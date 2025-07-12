<template>
  <section class="container mx-auto px-4 py-2">
    <!-- <h2 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-10 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">Point of Sale</h2> -->
    
    <!-- Place & Customer Selection -->
    <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 mb-10 border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Place</label>
          <select
            v-model="selectedPlaceId"
            @change="onPlaceChange"
            class="block w-full px-4 py-3 text-sm text-gray-700 bg-gray-50/80 border border-gray-300/50 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50 dark:border-gray-600/50 dark:bg-gray-900/80 dark:text-gray-200 dark:focus:border-indigo-400 transition-all duration-300"
            aria-label="Select Place"
          >
            <option value="">Select place</option>
            <option v-for="place in availablePlaces" :key="place._id" :value="place._id">
              {{ place.name }}
              <span v-if="place.disabled" class="text-yellow-500 dark:text-yellow-400 text-xs">(Pending Order)</span>
            </option>
          </select>
        </div>
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Customer</label>
          <select
            v-model="selectedCustomerId"
            class="block w-full px-4 py-3 text-sm text-gray-700 bg-gray-50/80 border border-gray-300/50 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50 dark:border-gray-600/50 dark:bg-gray-900/80 dark:text-gray-200 dark:focus:border-indigo-400 transition-all duration-300"
            aria-label="Select Customer"
          >
            <option value="">Select customer</option>
            <option v-for="customer in customers" :key="customer._id" :value="customer._id">{{ customer.name }}</option>
          </select>
        </div>
      </div>
      <!-- Progress Bar for Loading -->
      <div v-if="loading || loadingPending" class="mt-4 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div class="h-full bg-indigo-500 animate-pulse" style="width: 100%;"></div>
      </div>
    </div>

    <!-- Product List & Cart -->
    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Product List -->
      <div class="flex-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
        <!-- Category & Brand Filters -->
        <div class="mb-4 flex flex-col sm:flex-row gap-2">
          <input
            v-model="search"
            type="text"
            placeholder="Search products..."
            class="w-full px-4 py-3 text-sm text-gray-700 bg-gray-50/80 border border-gray-300/50 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50 dark:border-gray-600/50 dark:bg-gray-900/80 dark:text-gray-200 dark:focus:border-indigo-400 transition-all duration-300"
            aria-label="Search products"
          />
          <select
            v-model="selectedCategory"
            class="w-full sm:w-48 px-4 py-3 text-sm text-gray-700 bg-gray-50/80 border border-gray-300/50 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50 dark:border-gray-600/50 dark:bg-gray-900/80 dark:text-gray-200 dark:focus:border-indigo-400 transition-all duration-300"
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            <option v-for="cat in categories" :key="cat._id" :value="cat._id">{{ cat.name }}</option>
          </select>
          <select
            v-model="selectedBrand"
            class="w-full sm:w-48 px-4 py-3 text-sm text-gray-700 bg-gray-50/80 border border-gray-300/50 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50 dark:border-gray-600/50 dark:bg-gray-900/80 dark:text-gray-200 dark:focus:border-indigo-400 transition-all duration-300"
            aria-label="Filter by brand"
          >
            <option value="">All Brands</option>
            <option v-for="brand in brands" :key="brand._id" :value="brand._id">{{ brand.name }}</option>
          </select>
        </div>
        <!-- Desktop Grid Layout -->
        <div
          class="hidden md:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          :style="filteredProducts.length > 8 ? 'max-height: 600px; overflow-y: auto;' : ''"
        >
          <div
            v-for="product in filteredProducts"
            :key="product._id"
            class="bg-gray-50/80 dark:bg-gray-900/80 rounded-xl shadow-md hover:shadow-lg p-4 flex flex-col items-center border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:scale-[1.02]"
          >
            <img
              v-if="product.imageUrl"
              :src="product.imageUrl"
              alt="Product"
              class="w-20 h-20 object-cover rounded-lg mb-3"
            />
            <div class="font-semibold text-gray-800 dark:text-gray-100 text-center text-sm">{{ product.name }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mb-2">SKU: {{ product.sku }}</div>
            <div class="text-indigo-600 dark:text-indigo-400 font-bold mb-3">${{ product.selling_price }}</div>
            <button
              @click="addToCart(product)"
              class="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-300 shadow-sm"
              title="Add to cart"
              aria-label="Add product to cart"
            >
              Add
            </button>
          </div>
        </div>
        <!-- Mobile Card Layout -->
        <div
          class="md:hidden space-y-4"
          :style="filteredProducts.length > 8 ? 'max-height: 600px; overflow-y: auto;' : ''"
        >
          <div
            v-for="product in filteredProducts"
            :key="product._id"
            class="bg-gray-50/80 dark:bg-gray-900/80 rounded-xl shadow-md p-4 flex items-center gap-4 border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:scale-[1.02]"
          >
            <img
              v-if="product.imageUrl"
              :src="product.imageUrl"
              alt="Product"
              class="w-16 h-16 object-cover rounded-lg"
            />
            <div class="flex-1">
              <div class="font-semibold text-gray-800 dark:text-gray-100 text-sm">{{ product.name }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">SKU: {{ product.sku }}</div>
              <div class="text-indigo-600 dark:text-indigo-400 font-bold text-sm">${{ product.selling_price }}</div>
            </div>
            <button
              @click="addToCart(product)"
              class="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-300 text-sm shadow-sm"
              title="Add to cart"
              aria-label="Add product to cart"
            >
              Add
            </button>
          </div>
        </div>
        <div v-if="filteredProducts.length === 0 && !loading" class="text-center text-gray-500 dark:text-gray-400 py-6">
          No products found.
        </div>
      </div>

      <!-- Cart -->
      <div class="w-full lg:w-96 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 flex flex-col">
        <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Cart</h3>
        <div v-if="cart.length === 0" class="text-gray-400 text-center py-8">No items in cart.</div>
        <div v-else class="flex-1 overflow-y-auto">
          <!-- Desktop Cart Table -->
          <div class="hidden md:block">
            <table class="w-full text-sm">
              <thead class="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
                <tr>
                  <th class="px-3 py-2 text-left font-semibold">Item</th>
                  <th class="px-3 py-2 text-right font-semibold">Qty</th>
                  <th class="px-3 py-2 text-right font-semibold no-print">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                <tr v-for="item in cart" :key="item._id" class="hover:bg-indigo-50/50 dark:hover:bg-gray-800/50 transition-all duration-300">
                  <td class="px-3 py-3">
                    <div class="font-medium text-gray-800 dark:text-gray-100">{{ item.name }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">SKU: {{ item.sku }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">${{ item.selling_price }} x {{ item.qty }}</div>
                  </td>
                  <td class="px-3 py-3 text-right">{{ item.qty }}</td>
                  <td class="px-3 py-3 text-right no-print">
                    <div class="flex justify-end gap-2">
                      <button
                        @click="decrement(item)"
                        class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
                        title="Decrease quantity"
                        aria-label="Decrease quantity"
                      >-</button>
                      <button
                        @click="increment(item)"
                        class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
                        title="Increase quantity"
                        aria-label="Increase quantity"
                      >+</button>
                      <button
                        @click="remove(item)"
                        class="text-red-500 hover:underline text-sm"
                        title="Remove item"
                        aria-label="Remove item"
                      >Remove</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Mobile Cart Cards -->
          <div class="md:hidden space-y-4">
            <div v-for="item in cart" :key="item._id" class="bg-gray-50/80 dark:bg-gray-900/80 rounded-xl shadow-md p-4 border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:scale-[1.02]">
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-medium text-gray-800 dark:text-gray-100 text-sm">{{ item.name }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">SKU: {{ item.sku }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">${{ item.selling_price }} x {{ item.qty }}</div>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    @click="decrement(item)"
                    class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
                    title="Decrease quantity"
                    aria-label="Decrease quantity"
                  >-</button>
                  <span class="text-sm">{{ item.qty }}</span>
                  <button
                    @click="increment(item)"
                    class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
                    title="Increase quantity"
                    aria-label="Increase quantity"
                  >+</button>
                  <button
                    @click="remove(item)"
                    class="text-red-500 hover:underline text-sm"
                    title="Remove item"
                    aria-label="Remove item"
                  >Remove</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-4 border-t border-gray-200/50 dark:border-gray-700/50 pt-4">
          <textarea
            v-model="description"
            rows="2"
            placeholder="Order description (optional)"
            class="w-full mb-3 px-4 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl bg-gray-50/80 dark:bg-gray-900/80 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-300 resize-none text-sm"
            aria-label="Order description"
          ></textarea>
          <div class="flex justify-between items-center mb-3">
            <span class="font-semibold text-gray-700 dark:text-gray-200 text-sm">Discount</span>
            <input
              type="number"
              min="0"
              :max="subtotal"
              v-model.number="discount"
              class="w-24 px-3 py-2 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-gray-50/80 dark:bg-gray-900/80 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-300 text-sm text-right"
              placeholder="0"
              aria-label="Discount amount"
            />
          </div>
          <div class="flex justify-between font-semibold text-gray-700 dark:text-gray-200 mb-3 text-sm">
            <span>Total</span>
            <span class="text-indigo-600 dark:text-indigo-400">${{ total.toFixed(2) }}</span>
          </div>
          <div class="flex gap-2">
            <button
              class="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl hover:from-green-700 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all duration-300 disabled:opacity-60 shadow-md"
              :disabled="cart.length === 0 || !selectedPlaceId || !selectedCustomerId || discount < 0 || discount > subtotal || loading || loadingPending"
              @click="checkout"
              title="Checkout order"
              aria-label="Checkout order"
            >
              <span v-if="loading">Processing...</span>
              <span v-else>Checkout</span>
            </button>
            <button
              class="w-full px-4 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white rounded-xl hover:from-yellow-700 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all duration-300 disabled:opacity-60 shadow-md"
              :disabled="cart.length === 0 || !selectedPlaceId || !selectedCustomerId || discount < 0 || discount > subtotal || loading || loadingPending"
              @click="checkoutPending"
              title="Mark order as pending"
              aria-label="Mark order as pending"
            >
              <span v-if="loadingPending">Processing...</span>
              <span v-else>Pending</span>
            </button>
          </div>
          <button
            class="w-full mt-3 px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-xl hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-300 shadow-md"
            @click="goToHistorySell"
            title="View order history"
            aria-label="View order history"
          >
            Check History Sell
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { Meteor } from "meteor/meteor";

export default {
  data() {
    return {
      products: [],
      customers: [],
      places: [],
      categories: [],
      brands: [],
      search: "",
      selectedCategory: "",
      selectedBrand: "",
      cart: [],
      selectedCustomerId: "",
      selectedPlaceId: "",
      discount: 0,
      loading: false,
      description: "",
      loadingPending: false,
      status: "paid", // default status for new order
      orders: [],
      editingOrderId: null, // Track if editing a pending order
    };
  },
  computed: {
    filteredProducts() {
      const s = this.search.trim().toLowerCase();
      return this.products.filter(
        p =>
          (!this.selectedCategory || p.category_id === this.selectedCategory) &&
          (!this.selectedBrand || p.brand_id === this.selectedBrand) &&
          (
            p.name.toLowerCase().includes(s) ||
            String(p.sku).includes(s)
          )
      );
    },
    subtotal() {
      return this.cart.reduce((sum, item) => sum + item.selling_price * item.qty, 0);
    },
    total() {
      const t = this.subtotal - (this.discount || 0);
      return t > 0 ? t : 0;
    },
    availablePlaces() {
      return this.places.map(place => {
        const hasPending = this.orders.some(
          o => o.place_id === place._id && o.status === "pending"
        );
        return {
          ...place,
          disabled: hasPending,
        };
      });
    },
  },
  methods: {
    fetchProducts() {
      Meteor.call("products.find", {}, (err, res) => {
        if (!err) this.products = res || [];
      });
    },
    fetchCustomers() {
      Meteor.call("customer.find", {}, (err, res) => {
        if (!err) this.customers = res || [];
      });
    },
    fetchPlaces() {
      Meteor.call("placeOrder.find", {}, (err, res) => {
        if (!err) this.places = res || [];
      });
    },
    fetchOrders() {
      Meteor.call("order_sell_pos.find", {}, (err, res) => {
        if (!err) this.orders = res || [];
      });
    },
    fetchCategories() {
      Meteor.call("categories.find", {}, (err, res) => {
        if (!err) this.categories = res || [];
      });
    },
    fetchBrands() {
      Meteor.call("brands.find", {}, (err, res) => {
        if (!err) this.brands = res || [];
      });
    },
    addToCart(product) {
      const idx = this.cart.findIndex(i => i._id === product._id);
      if (idx !== -1) {
        this.cart[idx].qty += 1;
      } else {
        this.cart.push({ ...product, qty: 1 });
      }
    },
    increment(item) {
      item.qty += 1;
    },
    decrement(item) {
      if (item.qty > 1) item.qty -= 1;
      else this.remove(item);
    },
    remove(item) {
      this.cart = this.cart.filter(i => i._id !== item._id);
    },
    onPlaceChange() {
      const pendingOrder = this.orders.find(
        o => o.place_id === this.selectedPlaceId && o.status === "pending"
      );
      if (pendingOrder) {
        this.editingOrderId = pendingOrder._id;
        this.selectedCustomerId = pendingOrder.customer_id;
        this.cart = pendingOrder.items.map(item => ({
          _id: item.product_id,
          name: item.name,
          sku: item.sku,
          qty: item.qty,
          selling_price: item.price,
        }));
        this.discount = pendingOrder.discount || 0;
        this.description = pendingOrder.description || "";
      } else {
        this.editingOrderId = null;
        this.cart = [];
        this.discount = 0;
        this.description = "";
        this.selectedCustomerId = "";
      }
    },
    checkout() {
      this.submitOrder("paid");
    },
    checkoutPending() {
      this.submitOrder("pending");
    },
    submitOrder(status) {
      if (!this.selectedPlaceId || !this.selectedCustomerId || this.cart.length === 0) {
        alert("Please select place, customer, and add products.");
        return;
      }
      if (this.discount < 0 || this.discount > this.subtotal) {
        alert("Invalid discount.");
        return;
      }
      const items = this.cart.map(item => ({
        product_id: item._id,
        name: item.name,
        sku: item.sku,
        qty: item.qty,
        price: item.selling_price,
        total: item.selling_price * item.qty,
      }));
      const payload = {
        place_id: this.selectedPlaceId,
        customer_id: this.selectedCustomerId,
        items,
        subtotal: this.subtotal,
        discount: this.discount || 0,
        total: this.total,
        description: this.description,
        status,
      };
      if (this.editingOrderId) {
        payload._id = this.editingOrderId;
        this.loading = status === "paid";
        this.loadingPending = status === "pending";
        Meteor.call("order_sell_pos.update", payload, (err) => {
          this.loading = false;
          this.loadingPending = false;
          if (err) {
            alert("Update failed: " + (err.reason || err.message || err));
          } else {
            alert("Order updated successfully!");
            this.cart = [];
            this.discount = 0;
            this.description = "";
            this.selectedPlaceId = "";
            this.selectedCustomerId = "";
            this.editingOrderId = null;
            this.fetchOrders();
          }
        });
      } else {
        this.loading = status === "paid";
        this.loadingPending = status === "pending";
        Meteor.call("order_sell_pos.insert", payload, (err) => {
          this.loading = false;
          this.loadingPending = false;
          if (err) {
            alert("Order failed: " + (err.reason || err.message || err));
          } else {
            alert("Order placed successfully!");
            this.cart = [];
            this.discount = 0;
            this.description = "";
            this.selectedPlaceId = "";
            this.selectedCustomerId = "";
            this.editingOrderId = null;
            this.fetchOrders();
          }
        });
      }
    },
    goToHistorySell() {
      this.$router.push({ name: 'history_sell' });
    },
  },
  mounted() {
    this.fetchProducts();
    this.fetchCustomers();
    this.fetchPlaces();
    this.fetchOrders();
    this.fetchCategories();
    this.fetchBrands();
  },
  watch: {
    orders(newOrders) {
      if (this.editingOrderId) {
        const pendingOrder = newOrders.find(
          o => o._id === this.editingOrderId
        );
        if (pendingOrder) {
          this.selectedCustomerId = pendingOrder.customer_id;
          this.cart = pendingOrder.items.map(item => ({
            _id: item.product_id,
            name: item.name,
            sku: item.sku,
            qty: item.qty,
            selling_price: item.price,
          }));
          this.discount = pendingOrder.discount || 0;
          this.description = pendingOrder.description || "";
        }
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 1400px;
}
@media (max-width: 1024px) {
  .container {
    max-width: 100%;
  }
}
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* Tooltip styles */
button[title]:hover::after {
  content: attr(title);
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: #1f2937;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 20;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Arrow for tooltip */
button[title]:hover::before {
  content: '';
  position: absolute;
  bottom: calc(100% + 4px);
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: #1f2937;
  z-index: 20;
}

/* Optional: prettier scrollbar for product list */
.md\:grid[style*="overflow-y: auto"], .md\:hidden[style*="overflow-y: auto"] {
  scrollbar-width: thin;
  scrollbar-color: #6366f1 #e5e7eb;
}
.md\:grid[style*="overflow-y: auto"]::-webkit-scrollbar,
.md\:hidden[style*="overflow-y: auto"]::-webkit-scrollbar {
  width: 8px;
  background: #e5e7eb;
}
.md\:grid[style*="overflow-y: auto"]::-webkit-scrollbar-thumb,
.md\:hidden[style*="overflow-y: auto"]::-webkit-scrollbar-thumb {
  background: #6366f1;
  border-radius: 8px;
}
</style>