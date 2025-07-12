import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Customer = new Mongo.Collection('customer');

// Use a very permissive email regex
const emailRegEx = /^.+@.+\..+$/;

const CustomerSchema = new SimpleSchema({
 name : { type: String }, // Name of the customer
 email: {
    type: String,
    regEx: emailRegEx,
    min: 5,
    required: true,
    // Automatically trim email before validation
    autoValue() {
      if (this.isSet && typeof this.value === "string") {
        return this.value.trim();
      }
    },
    custom() {
      // Log the value if it fails validation for debugging
      if (!emailRegEx.test(this.value)) {
        // eslint-disable-next-line no-console
        console.error("Invalid email value:", this.value);
        return "regEx";
      }
    }
  }, // Email of the customer
 phone: { type: String, optional: true }, // Phone number of the customer
});

Customer.attachSchema?.(CustomerSchema);

