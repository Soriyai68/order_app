<template>
  <section class="container px-2 mx-auto">
    <div class="flex items-center gap-x-3">
      <h2 class="text-lg font-medium text-gray-800 dark:text-white">
        Categories
      </h2>
      <span
        class="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400"
        >{{ groupList.length }} categories</span
      >
    </div>
    <!-- Notification -->
    <div
      v-if="banner.visible"
      class="fixed top-6 right-6 z-50 flex w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800 my-4"
    >
      <div :class="['flex items-center justify-center w-12', banner.bg]">
        <svg
          v-if="banner.kind === 'success'"
          class="w-6 h-6 text-white fill-current"
          viewBox="0 0 40 40"
        >
          <path
            d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z"
          />
        </svg>
        <svg
          v-else-if="banner.kind === 'info'"
          class="w-6 h-6 text-white fill-current"
          viewBox="0 0 40 40"
        >
          <path
            d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z"
          />
        </svg>
        <svg
          v-else-if="banner.kind === 'warning'"
          class="w-6 h-6 text-white fill-current"
          viewBox="0 0 40 40"
        >
          <path
            d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z"
          />
        </svg>
        <svg
          v-else-if="banner.kind === 'error'"
          class="w-6 h-6 text-white fill-current"
          viewBox="0 0 40 40"
        >
          <path
            d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z"
          />
        </svg>
      </div>
      <div class="px-4 py-2 -mx-3">
        <div class="mx-3">
          <span :class="['font-semibold', banner.text]">{{
            banner.title
          }}</span>
          <p class="text-sm text-gray-600 dark:text-gray-200">
            {{ banner.msg }}
          </p>
        </div>
      </div>
    </div>
    <!-- Add Button -->
    <div class="my-6 flex">
      <button
        @click="openGroupDialog"
        class="px-6 py-2 mx-auto tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
      >
        Add Category
      </button>
    </div>
    <!-- Dialog -->
    <div
      v-if="dialogShow"
      class="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto bg-black bg-opacity-40"
    >
      <div
        class="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl dark:bg-gray-900 sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle"
      >
        <h3
          class="text-lg font-medium leading-6 text-gray-800 capitalize dark:text-white"
        >
          {{ groupForm.groupId ? "Edit Category" : "Add Category" }}
        </h3>
        <form class="mt-4" @submit.prevent="saveGroup">
          <div class="mb-3">
            <label
              class="text-sm text-gray-700 dark:text-gray-200"
              for="group-name"
              >Name</label
            >
            <input
              id="group-name"
              v-model="groupForm.groupName"
              required
              placeholder="Category name"
              class="block w-full mt-1 px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
              :class="{ 'border-red-500': nameTaken }"
            />
          </div>
          <div class="mb-3">
            <label
              class="text-sm text-gray-700 dark:text-gray-200"
              for="group-code"
              >Code</label
            >
            <input
              id="group-code"
              v-model.number="groupForm.groupCode"
              required
              type="number"
              placeholder="Category code"
              class="block w-full mt-1 px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
            />
          </div>
          <div class="mb-3">
            <label
              class="text-sm text-gray-700 dark:text-gray-200"
              for="group-description"
              >Description</label
            >
            <input
              id="group-description"
              v-model="groupForm.groupDesc"
              placeholder="Description"
              class="block w-full mt-1 px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
            />
          </div>
          <div class="mt-4 sm:flex sm:items-center sm:-mx-2">
            <button
              type="button"
              @click="closeGroupDialog"
              class="w-full px-4 py-2 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md sm:w-1/2 sm:mx-2 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="w-full px-4 py-2 mt-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 sm:w-1/2 sm:mx-2 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
            >
              {{ groupForm.groupId ? "Edit Category" : "Add Category" }}
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- Delete Confirmation -->
    <div
      v-if="removeDialog.visible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full"
      >
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          Delete Category
        </h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          Are you sure you want to delete this category?
        </p>
        <div class="flex justify-end gap-2">
          <button
            @click="removeDialog.visible = false"
            class="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            @click="deleteGroup"
            class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
    <!-- Search Input -->
    <div class="my-4 flex flex-col sm:flex-row sm:justify-end sm:items-center gap-2">
      <div class="relative w-full sm:w-80">
        <input
          v-model="searchText"
          type="text"
          placeholder="Search by name or code..."
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
    <!-- Table -->
    <div class="flex flex-col mt-6">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div
            class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg"
          >
            <table
              class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
            >
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    class="py-3.5 px-4 text-sm font-normal text-left text-gray-500 dark:text-gray-400"
                  >
                    <span>Name</span>
                  </th>
                  <th
                    class="px-8 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400"
                  >
                    <span>Code</span>
                  </th>
                  <th
                    class="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400"
                  >
                    <span>Description</span>
                  </th>
                  <th class="relative py-3.5 px-4">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody
                class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900"
              >
                <tr v-for="row in pagedGroupList" :key="row._id">
                  <td
                    class="px-4 py-4 text-sm font-medium text-blue-500 whitespace-nowrap"
                  >
                    {{ row.groupName }}
                  </td>
                  <td
                    class="px-8 py-4 text-sm font-medium text-emerald-500 whitespace-nowrap"
                  >
                    {{ row.groupCode }}
                  </td>
                  <td
                    class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"
                  >
                    {{ row.groupDesc }}
                  </td>
                  <td class="px-4 py-4 text-sm whitespace-nowrap">
                    <div class="flex items-center gap-x-6">
                      <button
                        @click="editGroup(row)"
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
                        @click="askDeleteGroup(row._id)"
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
                <tr v-if="groupList.length === 0">
                  <td colspan="4" class="px-4 py-4 text-center text-gray-500">
                    No categories found.
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- Pagination -->
            <div
              class="flex justify-center py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800"
            >
              <div class="flex">
                <a
                  href="#"
                  class="px-4 py-2 mx-1 text-gray-500 capitalize bg-white rounded-md cursor-pointer dark:bg-gray-800 dark:text-gray-600"
                  :class="{ 'cursor-not-allowed opacity-60': pageNum === 1 }"
                  @click.prevent="prevPage"
                  :aria-disabled="pageNum === 1"
                >
                  <div class="flex items-center -mx-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-6 h-6 mx-1 rtl:-scale-x-100"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7 16l-4-4m0 0l4-4m-4 4h18"
                      />
                    </svg>
                    <span class="mx-1">previous</span>
                  </div>
                </a>
                <a
                  v-for="idx in totalPages"
                  :key="idx"
                  href="#"
                  class="hidden px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform bg-white rounded-md sm:inline dark:bg-gray-800 dark:text-gray-200 hover:bg-blue-500 dark:hover:bg-blue-500 hover:text-white dark:hover:text-gray-200"
                  :class="{
                    'bg-blue-500 text-white dark:bg-blue-500 dark:text-white':
                      idx === pageNum,
                  }"
                  @click.prevent="goToPage(idx)"
                >
                  {{ idx }}
                </a>
                <a
                  href="#"
                  class="px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform bg-white rounded-md dark:bg-gray-800 dark:text-gray-200 hover:bg-blue-500 dark:hover:bg-blue-500 hover:text-white dark:hover:text-gray-200"
                  :class="{
                    'cursor-not-allowed opacity-60': pageNum === totalPages,
                  }"
                  @click.prevent="nextPage"
                  :aria-disabled="pageNum === totalPages"
                >
                  <div class="flex items-center -mx-1">
                    <span class="mx-1">Next</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-6 h-6 mx-1 rtl:-scale-x-100"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
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
      groupList: [],
      groupForm: {
        groupId: null,
        groupName: "",
        groupCode: "",
        groupDesc: "",
      },
      nameTaken: false,
      dialogShow: false,
      banner: {
        visible: false,
        kind: "",
        title: "",
        msg: "",
        bg: "",
        text: "",
      },
      removeDialog: {
        visible: false,
        id: null,
      },
      pageNum: 1,
      perPage: 10,
      searchText: "",
    };
  },
  computed: {
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredGroupList.length / this.perPage));
    },
    pagedGroupList() {
      const start = (this.pageNum - 1) * this.perPage;
      return this.filteredGroupList.slice(start, start + this.perPage);
    },
    filteredGroupList() {
      const searchTerm = this.searchText.trim().toLowerCase();
      if (!searchTerm) return this.groupList;
      return this.groupList.filter((group) => {
        return (
          (group.groupName && group.groupName.toLowerCase().includes(searchTerm)) ||
          (group.groupCode && group.groupCode.toString().includes(searchTerm))
        );
      });
    },
  },
  methods: {
    showBanner(kind, title, msg) {
      const style = {
        success: {
          bg: "bg-emerald-500",
          text: "text-emerald-500 dark:text-emerald-400",
        },
        info: { bg: "bg-blue-500", text: "text-blue-500 dark:text-blue-400" },
        warning: {
          bg: "bg-yellow-400",
          text: "text-yellow-400 dark:text-yellow-300",
        },
        error: { bg: "bg-red-500", text: "text-red-500 dark:text-red-400" },
      }[kind] || { bg: "", text: "" };
      this.banner = { visible: true, kind, title, msg, ...style };
      setTimeout(() => {
        this.banner.visible = false;
      }, 3000);
    },
    fetchGroups() {
      Meteor.call("categories.find", {}, (err, res) => {
        if (!err) {
          this.groupList = (res || []).map((c) => ({
            _id: c._id,
            groupName: c.name,
            groupCode: c.code,
            groupDesc: c.description,
          }));
        }
      });
    },
    saveGroup() {
      const codeVal = this.groupForm.groupCode;
      const exists = this.groupList.some(
        (c) => c.groupCode === codeVal && c._id !== this.groupForm.groupId
      );
      this.nameTaken = exists;
      if (exists) {
        this.showBanner("error", "Error", "Category code already exists!");
        return;
      }
      const doc = {
        name: this.groupForm.groupName,
        code: this.groupForm.groupCode,
        description: this.groupForm.groupDesc,
      };
      if (this.groupForm.groupId) {
        Meteor.call(
          "categories.update",
          {
            _id: this.groupForm.groupId,
            ...doc,
          },
          (err) => {
            if (err) {
              this.showBanner(
                "error",
                "Error",
                err.reason || err.message || err
              );
            } else {
              this.fetchGroups();
              this.closeGroupDialog();
              this.showBanner("success", "Success", "Category updated!");
            }
          }
        );
      } else {
        Meteor.call("categories.insert", doc, (err) => {
          if (err) {
            this.showBanner("error", "Error", err.reason || err.message || err);
          } else {
            this.fetchGroups();
            this.closeGroupDialog();
            this.showBanner("success", "Success", "Category added!");
          }
        });
      }
    },
    askDeleteGroup(id) {
      this.removeDialog.visible = true;
      this.removeDialog.id = id;
    },
    deleteGroup() {
      const _id = this.removeDialog.id;
      this.removeDialog.visible = false;
      if (_id) {
        // Check if category is used in any product
        Meteor.call("products.find", {}, (err, products) => {
          if (err) {
            this.showBanner("error", "Error", err.reason || err.message || err);
            return;
          }
          if ((products || []).some(p => p.category_id === _id)) {
            this.showBanner("error", "Error", "Cannot delete: Category is used in products.");
            return;
          }
          Meteor.call("categories.remove", { _id }, (err) => {
            if (err) {
              this.showBanner("error", "Error", err.reason || err.message || err);
            } else {
              this.fetchGroups();
              this.showBanner("success", "Success", "Category deleted!");
            }
          });
        });
      }
    },
    editGroup(cat) {
      this.groupForm = {
        groupId: cat._id,
        groupName: cat.groupName,
        groupCode: cat.groupCode,
        groupDesc: cat.groupDesc,
      };
      this.dialogShow = true;
    },
    openGroupDialog() {
      this.groupForm = {
        groupId: null,
        groupName: "",
        groupCode: "",
        groupDesc: "",
      };
      this.dialogShow = true;
    },
    closeGroupDialog() {
      this.dialogShow = false;
      this.groupForm = {
        groupId: null,
        groupName: "",
        groupCode: "",
        groupDesc: "",
      };
    },
    prevPage() {
      if (this.pageNum > 1) this.pageNum--;
    },
    nextPage() {
      if (this.pageNum < this.totalPages) this.pageNum++;
    },
    goToPage(idx) {
      if (idx >= 1 && idx <= this.totalPages) this.pageNum = idx;
    },
  },
  mounted() {
    this.fetchGroups();
  },
};
</script>

<style scoped>
/* ...existing code... */
</style>