import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import { Customer } from './collection';

// Use a manual email regex if SimpleSchema.RegEx.Email is undefined
const emailRegEx =
  SimpleSchema.RegEx && SimpleSchema.RegEx.Email
    ? SimpleSchema.RegEx.Email
    : /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

// Insert Customer
export const insertCustomer = new ValidatedMethod({
  name: 'customer.insert',
  validate: new SimpleSchema({
    name: { type: String },
    email: { type: String, regEx: emailRegEx },
    phone: { type: String, optional: true }
  }).validator(),
  async run(doc) {
    doc.email = doc.email.trim();
    // Check for duplicate email (case-insensitive)
    const exists = await Customer.findOneAsync({
      email: { $regex: `^${doc.email}$`, $options: 'i' }
    });
    if (exists) {
      throw new Meteor.Error('customer.duplicateEmail', 'Customer email already exists');
    }
    return await Customer.insertAsync(doc);
  }
});

// Update Customer
export const updateCustomer = new ValidatedMethod({
  name: 'customer.update',
  validate: new SimpleSchema({
    _id: { type: String },
    name: { type: String, optional: true },
    email: { type: String, regEx: emailRegEx, optional: true },
    phone: { type: String, optional: true }
  }).validator(),
  async run({ _id, ...modifier }) {
    // If email is being changed, check for duplicate (case-insensitive, ignore self)
    if (modifier.email) {
      modifier.email = modifier.email.trim();
      const exists = await Customer.findOneAsync({
        _id: { $ne: _id },
        email: { $regex: `^${modifier.email}$`, $options: 'i' }
      });
      if (exists) {
        throw new Meteor.Error('customer.duplicateEmail', 'Customer email already exists');
      }
    }
    return await Customer.updateAsync(_id, { $set: modifier });
  }
});

// Remove Customer
export const removeCustomer = new ValidatedMethod({
  name: 'customer.remove',
  validate: new SimpleSchema({
    _id: { type: String }
  }).validator(),
  async run({ _id }) {
    return await Customer.removeAsync(_id);
  }
});

// Find One Customer
export const findOneCustomer = new ValidatedMethod({
  name: 'customer.findOne',
  validate: new SimpleSchema({
    _id: { type: String }
  }).validator(),
  run({ _id }) {
    return Customer.findOne(_id);
  }
});

// Find All Customers
export const findCustomers = new ValidatedMethod({
  name: 'customer.find',
  validate: new SimpleSchema({}).validator(),
  async run() {
    return await Customer.find({}).fetchAsync();
  }
});
