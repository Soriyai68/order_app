import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Products = new Mongo.Collection('products');

const ProductsSchema = new SimpleSchema({
  name: { type: String },
  sku: { type: Number },
  unit_id: { type: String }, // Reference to Units collection (_id as String)
  brand_id: { type: String }, // Reference to Brands collection (_id as String)
  category_id: { type: String }, // Reference to Categories collection (_id as String)
  default_price: { type: Number },
  selling_price: { type: Number },
  imageUrl: { type: String, optional: true, max: 100 },
  current_stock: { type: Number, optional: true },
  descriptions: { type: String, optional: true }
});

Products.attachSchema?.(ProductsSchema);
