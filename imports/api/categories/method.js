import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import { Categories } from './collection';

// Insert Category
export const insertCategory = new ValidatedMethod({
  name: 'categories.insert',
  validate: new SimpleSchema({
    name: { type: String },
    code: { type: Number },
    description: { type: String, optional: true }
  }).validator(),
  async run({ name, code, description }) {
    return await Categories.insertAsync({ name, code, description });
  }
});

// Update Category
export const updateCategory = new ValidatedMethod({
  name: 'categories.update',
  validate: new SimpleSchema({
    _id: { type: String },
    name: { type: String, optional: true },
    code: { type: Number, optional: true },
    description: { type: String, optional: true }
  }).validator(),
  async run({ _id, ...modifier }) {
    return await Categories.updateAsync(_id, { $set: modifier });
  }
});

// Remove Category
export const removeCategory = new ValidatedMethod({
  name: 'categories.remove',
  validate: new SimpleSchema({
    _id: { type: String }
  }).validator(),
  async run({ _id }) {
    return await Categories.removeAsync(_id);
  }
});

// Find One Category
export const findOneCategory = new ValidatedMethod({
  name: 'categories.findOne',
  validate: new SimpleSchema({
    _id: { type: String }
  }).validator(),
  run({ _id }) {
    return Categories.findOne(_id);
  }
});

// Find All Categories
export const findCategories = new ValidatedMethod({
  name: 'categories.find',
  validate: new SimpleSchema({}).validator(),
  run() {
    return Categories.find({}).fetch();
  }
});