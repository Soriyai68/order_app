<template>
  <section class="container px-2 mx-auto">
    <div class="flex items-center gap-x-3">
      <h2 class="text-lg font-medium text-gray-800 dark:text-white">Opening Stock</h2>
      <span class="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">{{ openingStocks.length }} records</span>
    </div>
    <!-- Alert -->
    <div v-if="alert.show" class="fixed top-6 right-6 z-50 flex w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800 my-4">
      <div :class="['flex items-center justify-center w-12', alert.bg]">
        <svg v-if="alert.type === 'success'" class="w-6 h-6 text-white fill-current" viewBox="0 0 40 40"><path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z"/></svg>
        <svg v-else-if="alert.type === 'error'" class="w-6 h-6 text-white fill-current" viewBox="0 0 40 40"><path d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z"/></svg>
      </div>
      <div class="px-4 py-2 -mx-3">
        <div class="mx-3">
          <span :class="['font-semibold', alert.text]">{{ alert.title }}</span>
          <p class="text-sm text-gray-600 dark:text-gray-200">{{ alert.message }}</p>
        </div>
      </div>
    </div>
    <!-- Open Modal Button -->
    <div class="my-6 flex">
      <button @click="openModal" class="px-6 py-2 mx-auto tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">Add Opening Stock</button>
    </div>
    <!-- Modal -->
    <div v-if="modalOpen" class="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto bg-black bg-opacity-40" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl dark:bg-gray-900 sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle">
        <h3 class="text-lg font-medium leading-6 text-gray-800 capitalize dark:text-white" id="modal-title">
          {{ form._id ? "Edit Opening Stock" : "Add Opening Stock" }}
        </h3>
        <form class="mt-4" @submit.prevent="submit">
          <div class="mb-3">
            <label class="text-sm text-gray-700 dark:text-gray-200" for="product">Product</label>
            <select id="product" v-model="form.product_id" required class="block w-full mt-1 px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300">
              <option value="" disabled>Select product</option>
              <option v-for="p in products" :key="p._id" :value="p._id">{{ p.name }}</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="text-sm text-gray-700 dark:text-gray-200" for="stock">Stock</label>
            <input id="stock"
              v-model.number="form.stock"
              type="number"
              :step="stockStep"
              min="0"
              required
              :placeholder="stockPlaceholder"
              class="block w-full mt-1 px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
              @input="onStockInput"
            />
          </div>
          <div class="mb-3">
            <label class="text-sm text-gray-700 dark:text-gray-200" for="default_price">Default Price</label>
            <input id="default_price" v-model.number="form.default_price" type="number" min="0" step="0.01" required placeholder="Default price" class="block w-full mt-1 px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300" />
          </div>
          <div class="mb-3">
            <label class="text-sm text-gray-700 dark:text-gray-200" for="date">Date</label>
            <input id="date" v-model="form.date" type="date" required class="block w-full mt-1 px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300" />
          </div>
          <div class="mb-3">
            <label class="text-sm text-gray-700 dark:text-gray-200" for="description">Description</label>
            <input id="description" v-model="form.description" placeholder="Description" class="block w-full mt-1 px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300" />
          </div>
          <div class="mt-4 sm:flex sm:items-center sm:-mx-2">
            <button type="button" @click="closeModal" class="w-full px-4 py-2 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md sm:w-1/2 sm:mx-2 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40">Cancel</button>
            <button type="submit" class="w-full px-4 py-2 mt-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 sm:w-1/2 sm:mx-2 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40">{{ form._id ? "Edit" : "Add" }}</button>
          </div>
        </form>
      </div>
    </div>
    <!-- Delete Modal -->
    <div v-if="deleteModal.show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">Delete Opening Stock</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4">Are you sure you want to delete this record?</p>
        <div class="flex justify-end gap-2">
          <button @click="deleteModal.show = false" class="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
          <button @click="confirmDelete" class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Delete</button>
        </div>
      </div>
    </div>
    <!-- Table -->
    <div class="flex flex-col mt-6">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th class="py-3.5 px-4 text-sm font-normal text-left text-gray-500 dark:text-gray-400">Product</th>
                  <th class="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400">Stock</th>
                  <th class="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400">Default Price</th>
                  <th class="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400">Date</th>
                  <th class="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400">Description</th>
                  <th class="relative py-3.5 px-4"><span class="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                <tr v-for="os in pagedOpeningStocks" :key="os._id">
                  <td class="px-4 py-4 text-sm font-medium text-blue-500 whitespace-nowrap">{{ os.product?.name || '-' }}</td>
                  <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{{ os.stock }}</td>
                  <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{{ os.default_price }}</td>
                  <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{{ formatDate(os.date) }}</td>
                  <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{{ os.description }}</td>
                  <td class="px-4 py-4 text-sm whitespace-nowrap">
                    <div class="flex items-center gap-x-6">
                      <button @click="edit(os)" class="text-gray-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/></svg>
                      </button>
                      <button @click="askDelete(os._id)" class="text-gray-500 transition-colors duration-200 dark:hover:text-red-500 dark:text-gray-300 hover:text-red-500 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="openingStocks.length === 0">
                  <td colspan="6" class="px-4 py-4 text-center text-gray-500">No records found.</td>
                </tr>
              </tbody>
            </table>
            <!-- Pagination -->
            <div class="flex justify-center py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
              <div class="flex">
                <a href="#" class="px-4 py-2 mx-1 text-gray-500 capitalize bg-white rounded-md cursor-pointer dark:bg-gray-800 dark:text-gray-600" :class="{ 'cursor-not-allowed opacity-60': currentPage === 1 }" @click.prevent="prevPage" :aria-disabled="currentPage === 1">
                  <div class="flex items-center -mx-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mx-1 rtl:-scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18"/></svg>
                    <span class="mx-1">previous</span>
                  </div>
                </a>
                <a v-for="page in totalPages" :key="page" href="#" class="hidden px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform bg-white rounded-md sm:inline dark:bg-gray-800 dark:text-gray-200 hover:bg-blue-500 dark:hover:bg-blue-500 hover:text-white dark:hover:text-gray-200" :class="{ 'bg-blue-500 text-white dark:bg-blue-500 dark:text-white': page === currentPage }" @click.prevent="goToPage(page)">{{ page }}</a>
                <a href="#" class="px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform bg-white rounded-md dark:bg-gray-800 dark:text-gray-200 hover:bg-blue-500 dark:hover:bg-blue-500 hover:text-white dark:hover:text-gray-200" :class="{ 'cursor-not-allowed opacity-60': currentPage === totalPages }" @click.prevent="nextPage" :aria-disabled="currentPage === totalPages">
                  <div class="flex items-center -mx-1">
                    <span class="mx-1">Next</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mx-1 rtl:-scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                  </div>
                </a>
              </div>
            </div>
          </div>
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
      openingStocks: [],
      products: [],
      units: [],
      form: {
        _id: null,
        product_id: "",
        stock: 0,
        default_price: 0,
        date: this.formatDateInput(new Date()),
        description: "",
      },
      modalOpen: false,
      alert: {
        show: false,
        type: "",
        title: "",
        message: "",
        bg: "",
        text: "",
      },
      deleteModal: {
        show: false,
        id: null,
      },
      currentPage: 1,
      pageSize: 10,
    };
  },
  computed: {
    totalPages() {
      return Math.max(1, Math.ceil(this.openingStocks.length / this.pageSize));
    },
    pagedOpeningStocks() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.openingStocks.slice(start, start + this.pageSize);
    },
    currentUnitType() {
      // Find the selected product's unit type
      const product = this.products.find(p => p._id === this.form.product_id);
      if (!product) return 'float';
      const unit = this.units.find(u => u._id === product.unit_id);
      return unit ? unit.type : 'float';
    },
    stockStep() {
      return this.currentUnitType === 'int' ? 1 : 0.01;
    },
    stockPlaceholder() {
      return this.currentUnitType === 'int' ? '000' : '0.00';
    }
  },
  methods: {
    showAlert(type, title, message) {
      const style = {
        success: { bg: "bg-emerald-500", text: "text-emerald-500 dark:text-emerald-400" },
        error: { bg: "bg-red-500", text: "text-red-500 dark:text-red-400" },
      }[type] || { bg: "", text: "" };
      this.alert = { show: true, type, title, message, ...style };
      setTimeout(() => { this.alert.show = false; }, 3000);
    },
    fetchOpeningStocks() {
      Meteor.call("openingStock.find", {}, (err, res) => {
        if (!err) {
          this.openingStocks = res || [];
        }
      });
    },
    fetchProducts() {
      Meteor.call("products.find", {}, (err, res) => {
        if (!err) {
          this.products = res || [];
        }
      });
    },
    fetchUnits() {
      Meteor.call("units.find", {}, (err, res) => {
        if (!err) {
          this.units = res || [];
        }
      });
    },
    submit() {
      // Prevent update if editing and today is after 7 days from the record date
      if (this.form._id) {
        const recordDate = new Date(this.form.date);
        const now = new Date();
        recordDate.setHours(0,0,0,0);
        now.setHours(0,0,0,0);
        const diffDays = Math.floor((now - recordDate) / (1000 * 60 * 60 * 24));
        if (diffDays > 7) {
          this.showAlert("error", "Error", "Cannot update records after 7 days from the record date.");
          return;
        }
      }
      // Prepare value for stock based on unit type
      const unit = this.units.find(u => u._id === this.products.find(p => p._id === this.form.product_id)?.unit_id);
      let stockValue = this.form.stock;
      if (unit && unit.type === 'int') {
        stockValue = parseInt(stockValue);
        if (isNaN(stockValue)) stockValue = 0;
      } else {
        stockValue = parseFloat(stockValue);
        if (isNaN(stockValue)) stockValue = 0;
      }
      const payload = {
        product_id: this.form.product_id,
        stock: stockValue,
        default_price: this.form.default_price,
        date: new Date(this.form.date),
        description: this.form.description,
      };
      const updateProductDefaultPrice = () => {
        Meteor.call("products.update", {
          _id: this.form.product_id,
          default_price: this.form.default_price
        }, () => {});
      };
      if (this.form._id) {
        Meteor.call("openingStock.update", { _id: this.form._id, ...payload }, (err) => {
          if (err) {
            this.showAlert("error", "Error", err.reason || err.message || err);
          } else {
            updateProductDefaultPrice();
            this.fetchOpeningStocks();
            this.closeModal();
            this.showAlert("success", "Success", "Opening stock updated successfully!");
          }
        });
      } else {
        Meteor.call("openingStock.insert", payload, (err) => {
          if (err) {
            this.showAlert("error", "Error", err.reason || err.message || err);
          } else {
            updateProductDefaultPrice();
            this.fetchOpeningStocks();
            this.closeModal();
            this.showAlert("success", "Success", "Opening stock added successfully!");
          }
        });
      }
    },
    askDelete(id) {
      this.deleteModal.show = true;
      this.deleteModal.id = id;
    },
    confirmDelete() {
      const _id = this.deleteModal.id;
      this.deleteModal.show = false;
      if (_id) {
        Meteor.call("openingStock.remove", { _id }, (err) => {
          if (err) {
            this.showAlert("error", "Error", err.reason || err.message || err);
          } else {
            this.fetchOpeningStocks();
            this.showAlert("success", "Success", "Opening stock deleted successfully!");
          }
        });
      }
    },
    edit(os) {
      this.form = {
        _id: os._id,
        product_id: os.product_id,
        stock: os.stock,
        default_price: os.default_price,
        date: this.formatDateInput(os.date),
        description: os.description || "",
      };
      this.modalOpen = true;
    },
    openModal() {
      this.form = {
        _id: null,
        product_id: "",
        stock: 0,
        default_price: 0,
        date: this.formatDateInput(new Date()),
        description: "",
      };
      this.modalOpen = true;
    },
    closeModal() {
      this.modalOpen = false;
      this.form = {
        _id: null,
        product_id: "",
        stock: 0,
        default_price: 0,
        date: this.formatDateInput(new Date()),
        description: "",
      };
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) this.currentPage = page;
    },
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      return d.toLocaleDateString();
    },
    formatDateInput(date) {
      if (!date) return '';
      const d = new Date(date);
      return d.toISOString().slice(0, 10);
    },
    onStockInput() {
      if (this.currentUnitType === 'int') {
        // Only allow integer values
        if (typeof this.form.stock === 'string') {
          this.form.stock = this.form.stock.replace(/[^\d]/g, '');
        }
        this.form.stock = parseInt(this.form.stock) || 0;
      } else {
        // Allow float, but prevent multiple dots
        if (typeof this.form.stock === 'string') {
          this.form.stock = this.form.stock.replace(/[^\d.]/g, '');
          // Remove extra dots
          const parts = this.form.stock.split('.');
          if (parts.length > 2) {
            this.form.stock = parts[0] + '.' + parts.slice(1).join('');
          }
        }
        this.form.stock = parseFloat(this.form.stock) || 0;
      }
    }
  },
  mounted() {
    this.fetchOpeningStocks();
    this.fetchProducts();
    this.fetchUnits();
  },
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
