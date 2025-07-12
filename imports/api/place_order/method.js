import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import { Place_Order } from './collection';

// Insert Place_Order
export const insertPlaceOrder = new ValidatedMethod({
  name: 'placeOrder.insert',
  validate: new SimpleSchema({
    name: { type: String },
    date: { type: Date },
    description: { type: String, optional: true }
  }).validator(),
  async run(doc) {
    // Check for duplicate name (case-insensitive)
    const exists = await Place_Order.findOneAsync({
      name: { $regex: `^${doc.name}$`, $options: 'i' }
    });
    if (exists) {
      throw new Meteor.Error('placeOrder.duplicateName', 'Order name already exists');
    }
    return await Place_Order.insertAsync(doc);
  }
});

// Update Place_Order
export const updatePlaceOrder = new ValidatedMethod({
  name: 'placeOrder.update',
  validate: new SimpleSchema({
    _id: { type: String },
    name: { type: String, optional: true },
    date: { type: Date, optional: true },
    description: { type: String, optional: true }
  }).validator(),
  async run({ _id, ...modifier }) {
    // If name is being changed, check for duplicate (case-insensitive, ignore self)
    if (modifier.name) {
      const exists = await Place_Order.findOneAsync({
        _id: { $ne: _id },
        name: { $regex: `^${modifier.name}$`, $options: 'i' }
      });
      if (exists) {
        throw new Meteor.Error('placeOrder.duplicateName', 'Order name already exists');
      }
    }
    return await Place_Order.updateAsync(_id, { $set: modifier });
  }
});

// Remove Place_Order
export const removePlaceOrder = new ValidatedMethod({
  name: 'placeOrder.remove',
  validate: new SimpleSchema({
    _id: { type: String }
  }).validator(),
  async run({ _id }) {
    return await Place_Order.removeAsync(_id);
  }
});

// Find One Place_Order
export const findOnePlaceOrder = new ValidatedMethod({
  name: 'placeOrder.findOne',
  validate: new SimpleSchema({
    _id: { type: String }
  }).validator(),
  run({ _id }) {
    return Place_Order.findOne(_id);
  }
});

// Find All Place_Order
export const findPlaceOrders = new ValidatedMethod({
  name: 'placeOrder.find',
  validate: new SimpleSchema({}).validator(),
  async run() {
    return await Place_Order.find({}).fetchAsync();
  }
});
