import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import { OrderSellPos } from './collection';

// Insert Order Sell POS
export const insertOrderSellPos = new ValidatedMethod({
  name: 'order_sell_pos.insert',
  validate: new SimpleSchema({
    place_id: { type: String },
    customer_id: { type: String },
    items: { type: Array, minCount: 1 },
    'items.$': { type: Object },
    'items.$.product_id': { type: String },
    'items.$.name': { type: String },
    'items.$.sku': { type: Number },
    'items.$.qty': { type: Number },
    'items.$.price': { type: Number },
    'items.$.total': { type: Number },
    subtotal: { type: Number },
    discount: { type: Number, defaultValue: 0 },
    total: { type: Number },
    description: { type: String, optional: true }, // add description field
    status: { type: String, optional: true }, // add status field if needed
  }).validator(),
  async run(doc) {
    doc.createdAt = new Date();
    doc.createdBy = this.userId || null;
    // Decrement stock for each product sold
    for (const item of doc.items) {
      await import('../products/collection').then(({ Products }) => {
        Products.updateAsync(item.product_id, { $inc: { current_stock: -item.qty } });
      });
    }
    return await OrderSellPos.insertAsync(doc);
  }
});

// Find Orders
export const findOrderSellPos = new ValidatedMethod({
  name: 'order_sell_pos.find',
  validate: new SimpleSchema({
    from: { type: String, optional: true }, // ISO date string (yyyy-mm-dd)
    to: { type: String, optional: true },   // ISO date string (yyyy-mm-dd)
    customer_id: { type: String, optional: true },
    place_id: { type: String, optional: true }, // changed from status to place_id
  }).validator(),
  async run({ from, to, customer_id, place_id }) {
    const query = {};
    if (from || to) {
      query.createdAt = {};
      if (from) {
        // Start of day
        query.createdAt.$gte = new Date(from + "T00:00:00.000Z");
      }
      if (to) {
        // End of day
        query.createdAt.$lte = new Date(to + "T23:59:59.999Z");
      }
    }
    if (customer_id) {
      query.customer_id = customer_id;
    }
    if (place_id) {
      query.place_id = place_id;
    }
    return await OrderSellPos.find(query, { sort: { createdAt: -1 } }).fetch();
  }
});

// Find One Order
export const findOneOrderSellPos = new ValidatedMethod({
  name: 'order_sell_pos.findOne',
  validate: new SimpleSchema({
    _id: { type: String }
  }).validator(),
  run({ _id }) {
    return OrderSellPos.findOne(_id);
  }
});

// Update Status Method
export const updateOrderSellPosStatus = new ValidatedMethod({
  name: 'order_sell_pos.updateStatus',
  validate: new SimpleSchema({
    _id: { type: String },
    status: { type: String },
  }).validator(),
  async run({ _id, status }) {
    return await OrderSellPos.updateAsync(_id, { $set: { status } });
  }
});

//update Order Sell POS
export const updateOrderSellPos = new ValidatedMethod({
  name: 'order_sell_pos.update',
  validate: new SimpleSchema({
    _id: { type: String },
    place_id: { type: String, optional: true },
    customer_id: { type: String, optional: true },
    items: { type: Array, optional: true },
    'items.$': { type: Object, optional: true },
    'items.$.product_id': { type: String, optional: true },
    'items.$.name': { type: String, optional: true },
    'items.$.sku': { type: Number, optional: true },
    'items.$.qty': { type: Number, optional: true },
    'items.$.price': { type: Number, optional: true },
    'items.$.total': { type: Number, optional: true },
    subtotal: { type: Number, optional: true },
    discount: { type: Number, defaultValue: 0, optional: true },
    total: { type: Number, optional: true },
    description: { type: String, optional: true },
    status: { type: String, optional: true },
  }).validator(),
  async run(doc) {
    // Update stock if items are present
    if (doc.items) {
      const oldOrder = await OrderSellPos.findOneAsync(doc._id);
      const { Products } = await import('../products/collection');
      // Build a map of old items for quick lookup
      const oldItemsMap = {};
      if (oldOrder && Array.isArray(oldOrder.items)) {
        for (const item of oldOrder.items) {
          oldItemsMap[item.product_id] = item;
        }
      }
      // For each new item, calculate qty diff and update stock
      for (const newItem of doc.items) {
        const oldItem = oldItemsMap[newItem.product_id];
        const oldQty = oldItem ? oldItem.qty : 0;
        const diff = (newItem.qty || 0) - (oldQty || 0);
        if (diff !== 0) {
          await Products.updateAsync(newItem.product_id, { $inc: { current_stock: -diff } });
        }
      }
      // If any products were removed in the update, restore their stock
      if (oldOrder && Array.isArray(oldOrder.items)) {
        for (const oldItem of oldOrder.items) {
          if (!doc.items.find(i => i.product_id === oldItem.product_id)) {
            // Product was removed, restore its qty
            await Products.updateAsync(oldItem.product_id, { $inc: { current_stock: oldItem.qty } });
          }
        }
      }
    }
    return await OrderSellPos.updateAsync(doc._id, { $set: doc });
  }
});
