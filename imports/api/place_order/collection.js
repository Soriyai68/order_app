import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Place_Order = new Mongo.Collection('place_order');

const PlaceOrderSchema = new SimpleSchema({
  name : { type: String }, // Name of the order
  date: { type: Date, defaultValue: new Date() },
  description: { type: String, optional: true },
});

Place_Order.attachSchema?.(PlaceOrderSchema);

