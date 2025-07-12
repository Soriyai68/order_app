import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import { Units } from './collection';

// Insert Unit
export const insertUnit = new ValidatedMethod({
  name: 'units.insert',
  validate: new SimpleSchema({
    name: { type: String },
    sub_name: { type: String },
    description: { type: String },
    type: { type: String, allowedValues: ['float', 'int'] }, // added
    float: { type: Number, optional: true },
    int: { type: Number, optional: true }
  }).validator(),
  async run({ name, sub_name, description, type, float, int }) {
    return await Units.insertAsync({ name, sub_name, description, type, float, int });
  }
});

// Update Unit
export const updateUnit = new ValidatedMethod({
  name: 'units.update',
  validate: new SimpleSchema({
    _id: { type: String },
    name: { type: String, optional: true },
    sub_name: { type: String, optional: true },
    description: { type: String, optional: true },
    type: { type: String, allowedValues: ['float', 'int'], optional: true }, // added
    float: { type: Number, optional: true },
    int: { type: Number, optional: true }
  }).validator(),
  async run({ _id, ...modifier }) {
    return await Units.updateAsync(_id, { $set: modifier });
  }
});

// Remove Unit
export const removeUnit = new ValidatedMethod({
  name: 'units.remove',
  validate: new SimpleSchema({
    _id: { type: String }
  }).validator(),
  async run({ _id }) {
    return await Units.removeAsync(_id);
  }
});

// Find One Unit
export const findOneUnit = new ValidatedMethod({
  name: 'units.findOne',
  validate: new SimpleSchema({
    _id: { type: String }
  }).validator(),
  run({ _id }) {
    return Units.findOne(_id);
  }
});

// Find All Units
export const findUnits = new ValidatedMethod({
  name: 'units.find',
  validate: new SimpleSchema({}).validator(),
  run() {
    return Units.find({}).fetch();
  }
});