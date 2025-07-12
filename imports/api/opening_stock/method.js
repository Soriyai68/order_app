import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import { OpeningStock } from './collection';
import { Products } from '../products/collection';

// Insert OpeningStock
export const insertOpeningStock = new ValidatedMethod({
  name: 'openingStock.insert',
  validate: new SimpleSchema({
    product_id: { type: String },
    stock: { type: Number },
    default_price: { type: Number },
    date: { type: Date },
    description: { type: String, optional: true }
  }).validator(),
  async run(doc) {
    const result = await OpeningStock.insertAsync(doc);
    // Update product current_stock
    await Products.updateAsync(doc.product_id, { $inc: { current_stock: doc.stock } });
    return result;
  }
});

// Update OpeningStock
export const updateOpeningStock = new ValidatedMethod({
  name: 'openingStock.update',
  validate: new SimpleSchema({
    _id: { type: String },
    product_id: { type: String, optional: true },
    stock: { type: Number, optional: true },
    default_price: { type: Number, optional: true },
    date: { type: Date, optional: true },
    description: { type: String, optional: true }
  }).validator(),
  async run({ _id, ...modifier }) {
    const oldDoc = await OpeningStock.findOneAsync(_id);
    const result = await OpeningStock.updateAsync(_id, { $set: modifier });
    // If stock or product_id changed, update product current_stock
    if (modifier.stock !== undefined || modifier.product_id !== undefined) {
      // Remove old stock from old product
      await Products.updateAsync(oldDoc.product_id, { $inc: { current_stock: -oldDoc.stock } });
      // Add new stock to new product
      const newProductId = modifier.product_id || oldDoc.product_id;
      const newStock = modifier.stock !== undefined ? modifier.stock : oldDoc.stock;
      await Products.updateAsync(newProductId, { $inc: { current_stock: newStock } });
    }
    return result;
  }
});

// Remove OpeningStock
export const removeOpeningStock = new ValidatedMethod({
  name: 'openingStock.remove',
  validate: new SimpleSchema({
    _id: { type: String }
  }).validator(),
  async run({ _id }) {
    const doc = await OpeningStock.findOneAsync(_id);
    const result = await OpeningStock.removeAsync(_id);
    // Subtract stock from product current_stock
    if (doc) {
      await Products.updateAsync(doc.product_id, { $inc: { current_stock: -doc.stock } });
    }
    return result;
  }
});

// Find One OpeningStock
export const findOneOpeningStock = new ValidatedMethod({
  name: 'openingStock.findOne',
  validate: new SimpleSchema({
    _id: { type: String }
  }).validator(),
  run({ _id }) {
    return OpeningStock.findOne(_id);
  }
});

// Find All OpeningStock (with product lookup)
export const findOpeningStocks = new ValidatedMethod({
  name: 'openingStock.find',
  validate: new SimpleSchema({}).validator(),
  async run() {
    return await OpeningStock.rawCollection().aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'product_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: {
          path: '$product',
          preserveNullAndEmptyArrays: true
        }
      }
      // Optionally, project fields as needed
      // { $project: { ... } }
    ]).toArray();
  }
});