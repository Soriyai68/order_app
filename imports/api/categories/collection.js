import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Categories = new Mongo.Collection('categories');



const CategoriesSchema = new SimpleSchema({
  name: { type: String },
  code: { type: Number },
  description: { type: String, optional: true }
});

Categories.attachSchema?.(CategoriesSchema);

