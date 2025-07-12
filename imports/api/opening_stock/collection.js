import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const OpeningStock = new Mongo.Collection('opening_stock');

// Define schema for OpeningStock
const OpeningStockSchema = new SimpleSchema({
  product_id: { type: String }, // Reference to Products collection (_id as String)
  stock: { type: Number },      // Opening stock quantity
  default_price: { type: Number }, // Opening price
  date: { type: Date, defaultValue: new Date() },
  description: { type: String, optional: true },
});

OpeningStock.attachSchema?.(OpeningStockSchema);

