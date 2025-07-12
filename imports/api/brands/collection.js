import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Brands = new Mongo.Collection('brands');

const BrandsSchema = new SimpleSchema({
  name: { type: String },
  description: { type: String }
});

Brands.attachSchema?.(BrandsSchema);

