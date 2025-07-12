import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Units = new Mongo.Collection('units');

const UnitsSchema = new SimpleSchema({
  name: { type: String },
  sub_name: { type: String },
  description: { type: String },
  type: { type: String, allowedValues: ['float', 'int'] }, // added
  float: { type: Number, optional: true },
  int: { type: Number, optional: true }
});

Units.attachSchema?.(UnitsSchema);

