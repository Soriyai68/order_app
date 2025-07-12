import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import { Brands } from './collection';

// Insert Brand
export const insertBrand = new ValidatedMethod({
  name: 'brands.insert',
  validate: new SimpleSchema({
    name: { type: String },
    description: { type: String }
  }).validator(),
  async run({ name, description }) {
    return await Brands.insertAsync({ name, description });
  }
});

// Update Brand
export const updateBrand = new ValidatedMethod({
  name: 'brands.update',
  validate: new SimpleSchema({
    _id: { type: String },
    name: { type: String, optional: true },
    description: { type: String, optional: true }
  }).validator(),
  async run({ _id, ...modifier }) {
    return await Brands.updateAsync(_id, { $set: modifier });
  }
});

// Remove Brand
export const removeBrand = new ValidatedMethod({
  name: 'brands.remove',
  validate: new SimpleSchema({
    _id: { type: String }
  }).validator(),
  async run({ _id }) {
    return await Brands.removeAsync(_id);
  }
});

// Find One Brand
export const findOneBrand = new ValidatedMethod({
  name: 'brands.findOne',
  validate: new SimpleSchema({
    _id: { type: String }
  }).validator(),
  run({ _id }) {
    return Brands.findOne(_id);
  }
});

// Find All Brands
export const findBrands = new ValidatedMethod({
  name: 'brands.find',
  validate: new SimpleSchema({}).validator(),
  run() {
    return Brands.find({}).fetch();
  }
});