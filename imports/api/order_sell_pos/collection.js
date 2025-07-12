import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const OrderSellPos = new Mongo.Collection('order_sell_pos');

const OrderSellPosSchema = new SimpleSchema({
  place_id: { type: String },
  customer_id: { type: String },
  items: {
    type: Array,
    minCount: 1,
  },
  'items.$': {
    type: Object,
  },
  'items.$.product_id': { type: String },
  'items.$.name': { type: String },
  'items.$.sku': { type: Number },
  'items.$.qty': { type: Number },
  'items.$.price': { type: Number },
  'items.$.total': { type: Number },
  subtotal: { type: Number },
  discount: { type: Number, defaultValue: 0 },
  total: { type: Number },
  description: { type: String, optional: true }, // add description field
  status: { type: String, optional: true }, // add status field (e.g., "pending", "paid")
  createdAt: { type: Date, defaultValue: () => new Date() },
  createdBy: { type: String, optional: true },
});

OrderSellPos.attachSchema?.(OrderSellPosSchema);
