import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import { Products } from './collection';

// Insert Product
export const insertProduct = new ValidatedMethod({
  name: 'products.insert',
  validate: new SimpleSchema({
    name: { type: String },
    sku: { type: Number },
    unit_id: { type: String },
    brand_id: { type: String },
    category_id: { type: String },
    default_price: { type: Number },
    selling_price: { type: Number },
    imageUrl: { type: String, optional: true, max: 100 },
    current_stock: { type: Number, optional: true },
    descriptions: { type: String, optional: true }
  }).validator(),
  async run(doc) {
    return await Products.insertAsync(doc);
  }
});

// Update Product
export const updateProduct = new ValidatedMethod({
  name: 'products.update',
  validate: new SimpleSchema({
    _id: { type: String },
    name: { type: String, optional: true },
    sku: { type: Number, optional: true },
    unit_id: { type: String, optional: true },
    brand_id: { type: String, optional: true },
    category_id: { type: String, optional: true },
    default_price: { type: Number, optional: true },
    selling_price: { type: Number, optional: true },
    imageUrl: { type: String, optional: true, max: 100 },
    current_stock: { type: Number, optional: true },
    descriptions: { type: String, optional: true }
  }).validator(),
  async run({ _id, ...modifier }) {
    return await Products.updateAsync(_id, { $set: modifier });
  }
});

// Remove Product
export const removeProduct = new ValidatedMethod({
  name: 'products.remove',
  validate: new SimpleSchema({
    _id: { type: String }
  }).validator(),
  async run({ _id }) {
    return await Products.removeAsync(_id);
  }
});

// Find One Product
export const findOneProduct = new ValidatedMethod({
  name: 'products.findOne',
  validate: new SimpleSchema({
    _id: { type: String }
  }).validator(),
  run({ _id }) {
    return Products.findOne(_id);
  }
});

// Find All Products
export const findProducts = new ValidatedMethod({
  name: 'products.find',
  validate: new SimpleSchema({}).validator(),
  async run() {
    return await Products.rawCollection().aggregate([
      {
        $lookup: {
          from: 'units',
          localField: 'unit_id',
          foreignField: '_id',
          as: 'unit'
        }
      },
      {
        $unwind: {
          path: '$unit',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'brands',
          localField: 'brand_id',
          foreignField: '_id',
          as: 'brand'
        }
      },
      {
        $unwind: {
          path: '$brand',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true
        }
      }
      // Optionally, project fields as needed
      // { $project: { ... } }
    ]).toArray();
  }
});