<template>
  <section class="container px-2 mx-auto">
    <div class="flex items-center gap-x-3">
      <h2 class="text-lg font-medium text-gray-800 dark:text-white">
        Customers
      </h2>
      <span
        class="px-3 py-0 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400"
      >
        {{ customers.length }} customers
      </span>
    </div>
    <!-- Add Customer Button -->
    <div class="my-6 flex">
      <button
        @click="openModal"
        class="px-6 py-2 mx-auto tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
      >
        Add Customer
      </button>
    </div>
    <!-- Search Input -->
    <div
      class="my-4 flex flex-col sm:flex-row sm:justify-end sm:items-center gap-2"
    >
      <div class="relative w-full sm:w-80">
        <input
          v-model="search"
          type="text"
          placeholder="Search by name or email..."
          class="block w-full pl-10 pr-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-blue-400 transition"
        />
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
            />
          </svg>
        </span>
      </div>
    </div>
    <!-- Alert -->
    <div
      v-if="alert.show"
      class="fixed top-6 right-6 z-50 flex w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800 my-4"
    >
      <div :class="['flex items-center justify-center w-12', alert.bg]">
        <svg
          v-if="alert.type === 'success'"
          class="w-6 h-6 text-white fill-current"
          viewBox="0 0 40 40"
        >
          <path
            d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z"
          />
        </svg>
        <svg v-else class="w-6 h-6 text-white fill-current" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="18" fill="currentColor" />
        </svg>
      </div>
      <div class="px-4 py-2 -mx-3">
        <div class="mx-3">
          <span :class="['font-semibold', alert.text]">{{ alert.title }}</span>
          <p class="text-sm text-gray-600 dark:text-gray-200">
            {{ alert.message }}
          </p>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="modalOpen"
      class="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto bg-black bg-opacity-40"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl dark:bg-gray-900 sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle"
      >
        <h3
          class="text-lg font-medium leading-6 text-gray-800 capitalize dark:text-white"
          id="modal-title"
        >
          {{ form._id ? "Edit Customer" : "Add Customer" }}
        </h3>
        <form class="mt-4" @submit.prevent="submit">
          <div class="mb-3">
            <label
              class="text-sm text-gray-700 dark:text-gray-200"
              for="customer-name"
              >Name</label
            >
            <input
              id="customer-name"
              v-model="form.name"
              required
              placeholder="Customer name"
              class="block w-full mt-1 px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
            />
          </div>
          <div class="mb-3">
            <label
              class="text-sm text-gray-700 dark:text-gray-200"
              for="customer-email"
              >Email</label
            >
            <input
              id="customer-email"
              v-model="form.email"
              required
              type="email"
              placeholder="Email"
              class="block w-full mt-1 px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
            />
          </div>
          <div class="mb-3">
            <label
              class="text-sm text-gray-700 dark:text-gray-200"
              for="customer-phone"
              >Phone</label
            >
            <input
              id="customer-phone"
              v-model="form.phone"
              placeholder="Phone"
              class="block w-full mt-1 px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
            />
          </div>
          <div class="mt-4 sm:flex sm:items-center sm:-mx-2">
            <button
              type="button"
              @click="closeModal"
              class="w-full px-4 py-2 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md sm:w-1/2 sm:mx-2 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="w-full px-4 py-2 mt-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 sm:w-1/2 sm:mx-2 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
            >
              {{ form._id ? "Edit Customer" : "Add Customer" }}
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- Delete Modal -->
    <div
      v-if="deleteModal.show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full"
      >
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          Delete Customer
        </h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          Are you sure you want to delete this customer?
        </p>
        <div class="flex justify-end gap-2">
          <button
            @click="deleteModal.show = false"
            class="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            @click="confirmDelete"
            class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
    <!-- Customers Table -->
    <div class="flex flex-col mt-6">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div
            class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg"
          >
            <table
              class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs sm:text-sm md:text-base"
            >
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    class="py-3.5 px-4 text-sm font-normal text-left text-gray-500 dark:text-gray-400"
                  >
                    Name
                  </th>
                  <th
                    class="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400"
                  >
                    Email
                  </th>
                  <th
                    class="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400"
                  >
                    Phone
                  </th>
                  <th class="relative py-3.5 px-4">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody
                class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900"
              >
                <tr v-for="customer in pagedCustomers" :key="customer._id">
                  <td
                    class="px-4 py-4 text-sm font-medium text-blue-500 whitespace-nowrap"
                  >
                    {{ customer.name }}
                  </td>
                  <td
                    class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"
                  >
                    {{ customer.email }}
                  </td>
                  <td
                    class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"
                  >
                    {{ customer.phone }}
                  </td>
                  <td class="px-4 py-4 text-sm whitespace-nowrap">
                    <div class="flex items-center gap-x-6">
                      <button
                        @click="edit(customer)"
                        class="text-gray-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="w-5 h-5"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                          />
                        </svg>
                      </button>
                      <button
                        @click="askDelete(customer._id)"
                        class="text-gray-500 transition-colors duration-200 dark:hover:text-red-500 dark:text-gray-300 hover:text-red-500 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="w-5 h-5"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredCustomers.length === 0">
                  <td colspan="4" class="px-4 py-4 text-center text-gray-500">
                    No customers found.
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- Pagination Controls -->
            <div class="flex justify-center py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
              <div class="flex">
                <a
                  href="#"
                  class="px-4 py-2 mx-1 text-gray-500 capitalize bg-white rounded-md cursor-pointer dark:bg-gray-800 dark:text-gray-600"
                  :class="{ 'cursor-not-allowed opacity-60': currentPage === 1 }"
                  @click.prevent="prevPage"
                  :aria-disabled="currentPage === 1"
                >
                  <div class="flex items-center -mx-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mx-1 rtl:-scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                    </svg>
                    <span class="mx-1">previous</span>
                  </div>
                </a>
                <template v-for="page in paginationPages">
                  <span v-if="page === '...'" :key="'ellipsis-' + page" class="px-2 py-2 mx-1 text-gray-400 select-none">...</span>
                  <a
                    v-else
                    :key="page"
                    href="#"
                    class="hidden px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform bg-white rounded-md sm:inline dark:bg-gray-800 dark:text-gray-200 hover:bg-blue-500 dark:hover:bg-blue-500 hover:text-white dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:z-10"
                    :class="{
                      'bg-blue-500 text-white dark:bg-blue-500 dark:text-white': page === currentPage
                    }"
                    tabindex="0"
                    @click.prevent="goToPage(page)"
                  >
                    {{ page }}
                  </a>
                </template>
                <a
                  href="#"
                  class="px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform bg-white rounded-md dark:bg-gray-800 dark:text-gray-200 hover:bg-blue-500 dark:hover:bg-blue-500 hover:text-white dark:hover:text-gray-200"
                  :class="{ 'cursor-not-allowed opacity-60': currentPage === totalPages }"
                  @click.prevent="nextPage"
                  :aria-disabled="currentPage === totalPages"
                >
                  <div class="flex items-center -mx-1">
                    <span class="mx-1">Next</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mx-1 rtl:-scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </a>
              </div>
            </div>
            <!-- End Pagination Controls -->
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
      customers: [],
      form: {
        _id: null,
        name: "",
        email: "",
        phone: "",
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
      search: "",
      currentPage: 1,
      pageSize: 10,
    };
  },
  computed: {
    filteredCustomers() {
      if (!this.search.trim()) return this.customers;
      const search = this.search.trim().toLowerCase();
      return this.customers.filter(
        (c) =>
          (c.name && c.name.toLowerCase().includes(search)) ||
          (c.email && c.email.toLowerCase().includes(search))
      );
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredCustomers.length / this.pageSize));
    },
    pagedCustomers() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredCustomers.slice(start, start + this.pageSize);
    },
    paginationPages() {
      const pages = [];
      const total = this.totalPages;
      let start = 1;
      let end = total;

      if (total > 4) {
        if (this.currentPage <= 3) {
          end = 4;
        } else if (this.currentPage >= total - 2) {
          start = total - 3;
        } else {
          start = this.currentPage - 1;
          end = this.currentPage + 2;
        }
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (start > 1) {
        pages.unshift('...');
      }
      if (end < total) {
        pages.push('...');
      }

      return pages;
    },
  },
  methods: {
    showAlert(type, title, message) {
      const style = {
        success: {
          bg: "bg-emerald-500",
          text: "text-emerald-500 dark:text-emerald-400",
        },
        error: { bg: "bg-red-500", text: "text-red-500 dark:text-red-400" },
      }[type] || { bg: "", text: "" };
      this.alert = { show: true, type, title, message, ...style };
      setTimeout(() => {
        this.alert.show = false;
      }, 3000);
    },
    fetchCustomers() {
      Meteor.call("customer.find", {}, (err, res) => {
        if (!err) {
          this.customers = res || [];
          // Reset to first page if current page is out of range
          if (this.currentPage > this.totalPages) this.currentPage = 1;
        }
      });
    },
    submit() {
      if (!this.form.name || !this.form.email) {
        this.showAlert("error", "Error", "Name and email are required!");
        return;
      }
      const payload = {
        name: this.form.name,
        email: this.form.email,
        phone: this.form.phone,
      };
      if (this.form._id) {
        Meteor.call(
          "customer.update",
          { _id: this.form._id, ...payload },
          (err) => {
            if (err) {
              this.showAlert(
                "error",
                "Error",
                err.reason || err.message || err
              );
            } else {
              this.fetchCustomers();
              this.closeModal();
              this.showAlert(
                "success",
                "Success",
                "Customer updated successfully!"
              );
            }
          }
        );
      } else {
        Meteor.call("customer.insert", payload, (err) => {
          if (err) {
            this.showAlert("error", "Error", err.reason || err.message || err);
          } else {
            this.fetchCustomers();
            this.closeModal();
            this.showAlert(
              "success",
              "Success",
              "Customer added successfully!"
            );
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
        // Check if customer is used in any sell order
        Meteor.call("order_sell_pos.find", { customer_id: _id }, (err, orders) => {
          if (err) {
            this.showAlert("error", "Error", err.reason || err.message || err);
            return;
          }
          if (orders && orders.length > 0) {
            this.showAlert("error", "Error", "Cannot delete: Customer is used in sell orders.");
            return;
          }
          Meteor.call("customer.remove", { _id }, (err) => {
            if (err) {
              this.showAlert("error", "Error", err.reason || err.message || err);
            } else {
              this.fetchCustomers();
              this.showAlert(
                "success",
                "Success",
                "Customer deleted successfully!"
              );
            }
          });
        });
      }
    },
    edit(customer) {
      this.form = {
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      };
      this.modalOpen = true;
    },
    openModal() {
      this.form = {
        _id: null,
        name: "",
        email: "",
        phone: "",
      };
      this.modalOpen = true;
    },
    closeModal() {
      this.modalOpen = false;
      this.form = {
        _id: null,
        name: "",
        email: "",
        phone: "",
      };
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    goToPage(page) {
      if (typeof page === "number" && page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
  },
  watch: {
    search() {
      this.currentPage = 1;
    }
  },
  mounted() {
    this.fetchCustomers();
  },
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
