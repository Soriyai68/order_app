<template>
  <section class="container mx-auto px-4 py-2">
    <!-- <h2 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-10 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">Order Sell History</h2> -->
    
    <!-- Filter Controls with Glassmorphism -->
    <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 mb-10 border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300">
      <div class="flex flex-col lg:flex-row lg:items-end gap-4">
        <div class="flex flex-col sm:flex-row gap-4 w-full">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">From Date</label>
            <input
              type="date"
              v-model="filters.from"
              class="block w-full px-4 py-3 text-sm text-gray-700 bg-gray-50/80 border border-gray-300/50 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50 dark:border-gray-600/50 dark:bg-gray-900/80 dark:text-gray-200 dark:focus:border-indigo-400 transition-all duration-300"
              aria-label="From Date"
            />
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">To Date</label>
            <input
              type="date"
              v-model="filters.to"
              class="block w-full px-4 py-3 text-sm text-gray-700 bg-gray-50/80 border border-gray-300/50 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50 dark:border-gray-600/50 dark:bg-gray-900/80 dark:text-gray-200 dark:focus:border-indigo-400 transition-all duration-300"
              aria-label="To Date"
            />
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Customer</label>
            <select
              v-model="filters.customer_id"
              class="block w-full px-4 py-3 text-sm text-gray-700 bg-gray-50/80 border border-gray-300/50 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50 dark:border-gray-600/50 dark:bg-gray-900/80 dark:text-gray-200 dark:focus:border-indigo-400 transition-all duration-300"
              aria-label="Customer Filter"
            >
              <option value="">All Customers</option>
              <option v-for="c in customers" :key="c._id" :value="c._id">{{ c.name }}</option>
            </select>
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Place</label>
            <select
              v-model="filters.place_id"
              class="block w-full px-4 py-3 text-sm text-gray-700 bg-gray-50/80 border border-gray-300/50 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50 dark:border-gray-600/50 dark:bg-gray-900/80 dark:text-gray-200 dark:focus:border-indigo-400 transition-all duration-300"
              aria-label="Place Filter"
            >
              <option value="">All Places</option>
              <option v-for="p in places" :key="p._id" :value="p._id">{{ p.name }}</option>
            </select>
          </div>
        </div>
        <div class="flex gap-3 mt-4 lg:mt-0">
          <button
            class="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-xl hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50 transition-all duration-300 flex items-center gap-2 shadow-md"
            @click="fetchOrders"
            :disabled="isLoading"
            aria-label="Apply Filters"
          >
            <svg v-if="isLoading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isLoading ? 'Loading...' : 'Apply Filters' }}</span>
          </button>
          <button
            class="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl hover:from-green-700 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50 transition-all duration-300 shadow-md"
            @click="exportToExcel"
            title="Export table to Excel"
            aria-label="Export to Excel"
          >
            Export to Excel
          </button>
          <button
            class="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-500 text-white rounded-xl hover:from-gray-700 hover:to-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 transition-all duration-300 shadow-md"
            @click="printReport"
            title="Print the report"
            aria-label="Print Report"
          >
            Print Report
          </button>
        </div>
      </div>
      <!-- Progress Bar -->
      <div v-if="isLoading" class="mt-4 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div class="h-full bg-indigo-500 animate-pulse" style="width: 100%;"></div>
      </div>
    </div>

    <!-- Responsive Table -->
    <div class="flex flex-col mt-10">
      <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div id="printable-table" class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            <div class="hidden md:block">
              <table class="min-w-full divide-y divide-gray-200/50 dark:divide-gray-700/50 text-sm">
                <thead class="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
                  <tr>
                    <th class="px-6 py-4 text-left font-semibold whitespace-nowrap">Date</th>
                    <th class="px-6 py-4 text-left font-semibold whitespace-nowrap">Place</th>
                    <th class="px-6 py-4 text-left font-semibold whitespace-nowrap">Customer</th>
                    <th class="px-6 py-4 text-left font-semibold whitespace-nowrap">Subtotal</th>
                    <th class="px-6 py-4 text-left font-semibold whitespace-nowrap">Discount</th>
                    <th class="px-6 py-4 text-left font-semibold whitespace-nowrap">Total</th>
                    <th class="px-6 py-4 text-left font-semibold whitespace-nowrap">Status</th>
                    <th class="px-6 py-4 text-left font-semibold whitespace-nowrap">Items</th>
                    <th class="px-6 py-4 text-left font-semibold whitespace-nowrap no-print">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200/50 dark:divide-gray-700/50 dark:bg-gray-900/80">
                  <tr v-for="order in paginatedOrders" :key="order._id" class="hover:bg-indigo-50/50 dark:hover:bg-gray-800/50 transition-all duration-300 transform hover:scale-[1.02] bg-white/80 dark:bg-gray-900/80">
                    <td class="px-6 py-5 whitespace-nowrap text-gray-700 dark:text-gray-200">{{ formatDate(order.createdAt) }}</td>
                    <td class="px-6 py-5 whitespace-nowrap text-gray-700 dark:text-gray-200">{{ getPlaceName(order.place_id) }}</td>
                    <td class="px-6 py-5 whitespace-nowrap text-gray-700 dark:text-gray-200">{{ getCustomerName(order.customer_id) }}</td>
                    <td class="px-6 py-5 whitespace-nowrap text-gray-700 dark:text-gray-200">${{ order.subtotal.toFixed(2) }}</td>
                    <td class="px-6 py-5 whitespace-nowrap text-gray-700 dark:text-gray-200">${{ order.discount?.toFixed(2) || '0.00' }}</td>
                    <td class="px-6 py-5 whitespace-nowrap font-bold text-indigo-600 dark:text-indigo-400">${{ order.total.toFixed(2) }}</td>
                    <td class="px-6 py-5 whitespace-nowrap">
                      <span
                        v-if="order.status === 'paid'"
                        class="px-4 py-1.5 rounded-full bg-green-100/80 text-green-800 dark:bg-green-900/80 dark:text-green-200 font-medium shadow-sm"
                      >Paid</span>
                      <span
                        v-else-if="order.status === 'pending'"
                        class="px-4 py-1.5 rounded-full bg-yellow-100/80 text-yellow-800 dark:bg-yellow-900/80 dark:text-yellow-200 font-medium shadow-sm"
                      >Pending</span>
                      <span v-else class="px-4 py-1.5 rounded-full bg-gray-100/80 text-gray-600 dark:bg-gray-800/80 dark:text-gray-400 shadow-sm">-</span>
                    </td>
                    <td class="px-6 py-5 whitespace-nowrap">
                      <ul class="list-disc list-inside">
                        <li v-for="item in order.items" :key="item.product_id" class="text-gray-700 dark:text-gray-200">
                          {{ item.name }} (x{{ item.qty }}) - ${{ item.price.toFixed(2) }}
                        </li>
                      </ul>
                    </td>
                    <td class="px-6 py-5 whitespace-nowrap no-print">
                      <div class="flex items-center gap-3">
                        <select
                          v-model="order._newStatus"
                          class="px-4 py-2 border border-gray-300/50 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:bg-gray-900/80 dark:text-white transition-all duration-300 text-sm shadow-sm"
                          aria-label="Change order status"
                        >
                          <option value="paid">Paid</option>
                          <option value="pending">Pending</option>
                        </select>
                        <button
                          class="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-300 disabled:opacity-50 text-sm shadow-sm"
                          @click="changeStatus(order)"
                          :disabled="order.status === order._newStatus"
                          title="Update order status"
                          aria-label="Update order status"
                        >
                          Update
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="paginatedOrders.length === 0 && !isLoading">
                    <td colspan="9" class="px-6 py-6 text-center text-gray-500 dark:text-gray-400">No orders found.</td>
                  </tr>
                  <tr v-if="isLoading">
                    <td colspan="9" class="px-6 py-6 text-center text-gray-500 dark:text-gray-400">
                      <div class="flex justify-center items-center">
                        <svg class="animate-spin h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span class="ml-2 text-indigo-600 dark:text-indigo-400 font-medium">Loading orders...</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- Mobile Card Layout -->
            <div class="md:hidden space-y-4 p-4">
              <div v-for="order in paginatedOrders" :key="order._id" class="bg-white/80 dark:bg-gray-900/80 rounded-xl shadow-md p-4 transition-all duration-300 hover:scale-[1.02] hover:bg-indigo-50/50 dark:hover:bg-gray-800/50">
                <div class="space-y-2">
                  <div>
                    <span class="text-sm font-semibold text-gray-600 dark:text-gray-400">Date:</span>
                    <span class="text-sm text-gray-700 dark:text-gray-200">{{ formatDate(order.createdAt) }}</span>
                  </div>
                  <div>
                    <span class="text-sm font-semibold text-gray-600 dark:text-gray-400">Place:</span>
                    <span class="text-sm text-gray-700 dark:text-gray-200">{{ getPlaceName(order.place_id) }}</span>
                  </div>
                  <div>
                    <span class="text-sm font-semibold text-gray-600 dark:text-gray-400">Customer:</span>
                    <span class="text-sm text-gray-700 dark:text-gray-200">{{ getCustomerName(order.customer_id) }}</span>
                  </div>
                  <div>
                    <span class="text-sm font-semibold text-gray-600 dark:text-gray-400">Subtotal:</span>
                    <span class="text-sm text-gray-700 dark:text-gray-200">${{ order.subtotal.toFixed(2) }}</span>
                  </div>
                  <div>
                    <span class="text-sm font-semibold text-gray-600 dark:text-gray-400">Discount:</span>
                    <span class="text-sm text-gray-700 dark:text-gray-200">${{ order.discount?.toFixed(2) || '0.00' }}</span>
                  </div>
                  <div>
                    <span class="text-sm font-semibold text-gray-600 dark:text-gray-400">Total:</span>
                    <span class="text-sm font-bold text-indigo-600 dark:text-indigo-400">${{ order.total.toFixed(2) }}</span>
                  </div>
                  <div>
                    <span class="text-sm font-semibold text-gray-600 dark:text-gray-400">Status:</span>
                    <span
                      v-if="order.status === 'paid'"
                      class="inline-block px-3 py-1 text-sm rounded-full bg-green-100/80 text-green-800 dark:bg-green-900/80 dark:text-green-200 font-medium"
                    >Paid</span>
                    <span
                      v-else-if="order.status === 'pending'"
                      class="inline-block px-3 py-1 text-sm rounded-full bg-yellow-100/80 text-yellow-800 dark:bg-yellow-900/80 dark:text-yellow-200 font-medium"
                    >Pending</span>
                    <span v-else class="inline-block px-3 py-1 text-sm rounded-full bg-gray-100/80 text-gray-600 dark:bg-gray-800/80 dark:text-gray-400">-</span>
                  </div>
                  <div>
                    <span class="text-sm font-semibold text-gray-600 dark:text-gray-400">Items:</span>
                    <ul class="list-disc list-inside text-sm text-gray-700 dark:text-gray-200">
                      <li v-for="item in order.items" :key="item.product_id">
                        {{ item.name }} (x{{ item.qty }}) - ${{ item.price.toFixed(2) }}
                      </li>
                    </ul>
                  </div>
                  <div class="no-print">
                    <span class="text-sm font-semibold text-gray-600 dark:text-gray-400">Action:</span>
                    <div class="flex items-center gap-2 mt-2">
                      <select
                        v-model="order._newStatus"
                        class="px-3 py-1.5 border border-gray-300/50 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:bg-gray-900/80 dark:text-white transition-all duration-300 text-sm"
                        aria-label="Change order status"
                      >
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                      </select>
                      <button
                        class="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-300 disabled:opacity-50 text-sm"
                        @click="changeStatus(order)"
                        :disabled="order.status === order._newStatus"
                        title="Update order status"
                        aria-label="Update order status"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="paginatedOrders.length === 0 && !isLoading" class="text-center text-gray-500 dark:text-gray-400 py-6">
                No orders found.
              </div>
              <div v-if="isLoading" class="text-center text-gray-500 dark:text-gray-400 py-6">
                <div class="flex justify-center items-center">
                  <svg class="animate-spin h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span class="ml-2 text-indigo-600 dark:text-indigo-400 font-medium">Loading orders...</span>
                </div>
              </div>
            </div>
          </div>
          <!-- Pagination Controls -->
          <div class="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
            <div class="flex items-center gap-3">
              <span class="text-sm text-gray-700 dark:text-gray-300">
                Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, orders.length) }} of {{ orders.length }} orders
              </span>
              <select
                v-model="pageSize"
                class="px-3 py-2 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-gray-50/80 dark:bg-gray-900/80 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-300"
                aria-label="Items per page"
              >
                <option :value="7">7 per page</option>
                <option :value="10">10 per page</option>
                <option :value="20">20 per page</option>
              </select>
            </div>
            <div class="flex gap-2 flex-wrap justify-center">
              <button
                class="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-300 disabled:opacity-50 shadow-sm"
                @click="currentPage = 1"
                :disabled="currentPage === 1"
                aria-label="Go to first page"
              >
                First
              </button>
              <button
                class="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-300 disabled:opacity-50 shadow-sm"
                @click="currentPage--"
                :disabled="currentPage === 1"
                aria-label="Go to previous page"
              >
                Previous
              </button>
              <span class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
                Page {{ currentPage }} of {{ totalPages }}
              </span>
              <button
                class="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-300 disabled:opacity-50 shadow-sm"
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                aria-label="Go to next page"
              >
                Next
              </button>
              <button
                class="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-300 disabled:opacity-50 shadow-sm"
                @click="currentPage = totalPages"
                :disabled="currentPage === totalPages"
                aria-label="Go to last page"
              >
                Last
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { Meteor } from 'meteor/meteor';
import printJS from 'print-js';
import * as XLSX from 'xlsx';

export default {
  data() {
    return {
      orders: [],
      places: [],
      customers: [],
      filters: {
        from: '',
        to: '',
        customer_id: '',
        place_id: '', // changed from status to place_id
      },
      isLoading: false,
      currentPage: 1,
      pageSize: 7, // Default to 7 items per page
    };
  },
  computed: {
    paginatedOrders() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.orders.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.orders.length / this.pageSize);
    },
  },
  watch: {
    pageSize() {
      this.currentPage = 1; // Reset to first page when page size changes
    },
  },
  methods: {
    fetchOrders() {
      this.isLoading = true;
      this.currentPage = 1; // Reset to first page on new fetch
      const filter = {};
      if (this.filters.from) filter.from = this.filters.from;
      if (this.filters.to) filter.to = this.filters.to;
      if (this.filters.customer_id) filter.customer_id = this.filters.customer_id;
      if (this.filters.place_id) filter.place_id = this.filters.place_id; // changed from status to place_id
      Meteor.call('order_sell_pos.find', filter, (err, res) => {
        this.isLoading = false;
        if (!err) {
          this.orders = (res || []).map(o => ({
            ...o,
            _newStatus: o.status || 'paid',
          }));
        } else {
          alert('Failed to fetch orders: ' + (err.reason || err.message || err));
        }
      });
    },
    fetchPlaces() {
      Meteor.call('placeOrder.find', {}, (err, res) => {
        if (!err) this.places = res || [];
      });
    },
    fetchCustomers() {
      Meteor.call('customer.find', {}, (err, res) => {
        if (!err) this.customers = res || [];
      });
    },
    getPlaceName(id) {
      const p = this.places.find(x => x._id === id);
      return p ? p.name : id;
    },
    getCustomerName(id) {
      const c = this.customers.find(x => x._id === id);
      return c ? c.name : id;
    },
    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    },
    changeStatus(order) {
      if (order.status === order._newStatus) return;
      this.isLoading = true;
      Meteor.call('order_sell_pos.updateStatus', { _id: order._id, status: order._newStatus }, (err) => {
        this.isLoading = false;
        if (err) {
          alert('Failed to update status: ' + (err.reason || err.message || err));
        } else {
          order.status = order._newStatus;
        }
      });
    },
    exportToExcel() {
      try {
        if (this.orders.length === 0) {
          alert('No orders to export.');
          return;
        }
        const data = this.orders.map(order => ({
          Date: this.formatDate(order.createdAt),
          Place: this.getPlaceName(order.place_id),
          Customer: this.getCustomerName(order.customer_id),
          Subtotal: order.subtotal.toFixed(2),
          Discount: order.discount?.toFixed(2) || '0.00',
          Total: order.total.toFixed(2),
          Status: order.status || '-',
          Items: order.items.map(item => `${item.name} (x${item.qty}) - $${item.price.toFixed(2)}`).join('; '),
        }));
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
        XLSX.writeFile(workbook, `Order_Sell_History_${new Date().toISOString().slice(0, 10)}.xlsx`);
      } catch (error) {
        alert('Failed to export to Excel: ' + error.message);
        console.error('Excel export error:', error);
      }
    },
    printReport() {
      printJS({
        printable: 'printable-table',
        type: 'html',
        style: `
          table { width: 100%; border-collapse: collapse; font-size: 12pt; font-family: Arial, sans-serif; }
          th, td { padding: 12px; border: 1px solid #e5e7eb; text-align: left; }
          thead { background: linear-gradient(to right, #4f46e5, #3b82f6); color: white; }
          .no-print { display: none; }
          .bg-green-100 { background: #d1fae5; }
          .bg-yellow-100 { background: #fef9c3; }
          .bg-gray-100 { background: #f3f4f6; }
          h2 { font-size: 18pt; font-weight: bold; text-align: center; margin-bottom: 20px; }
          .md\:hidden { display: block; }
          .hidden { display: none; }
        `,
        header: `<h2>Order Sell History Report</h2>`,
      });
    },
  },
  mounted() {
    this.fetchOrders();
    this.fetchPlaces();
    this.fetchCustomers();
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
</style>