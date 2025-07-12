<template>
  <section class="container px-2 mx-auto py-0">
    <!-- Alert -->
    <div v-if="alert.show" class="fixed top-6 right-6 z-50 flex w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800 my-4">
      <div :class="['flex items-center justify-center w-12', alert.bg]">
        <svg v-if="alert.type==='success'" class="w-6 h-6 text-white fill-current" viewBox="0 0 40 40"><path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z"/></svg>
        <svg v-else-if="alert.type==='info'" class="w-6 h-6 text-white fill-current" viewBox="0 0 40 40"><path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z"/></svg>
        <svg v-else-if="alert.type==='warning'" class="w-6 h-6 text-white fill-current" viewBox="0 0 40 40"><path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z"/></svg>
        <svg v-else-if="alert.type==='error'" class="w-6 h-6 text-white fill-current" viewBox="0 0 40 40"><path d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z"/></svg>
      </div>
      <div class="px-4 py-2 -mx-3">
        <div class="mx-3">
          <span :class="['font-semibold', alert.text]">{{ alert.title }}</span>
          <p class="text-sm text-gray-600 dark:text-gray-200">{{ alert.message }}</p>
        </div>
      </div>
    </div>
    <div class="flex items-center gap-x-3 mb-2">
      <h2 class="text-lg font-medium text-gray-800 dark:text-white mb-4 ">Guess</h2>
      <!-- <span class="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">
        {{ products.length }} products
      </span> -->
    </div>
    <!-- Summary Totals -->
    <div class="flex flex-wrap gap-6 mb-4">
      <div class="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded shadow text-sm font-semibold text-gray-700 dark:text-gray-200">
        Total Price: <span class="text-blue-600 dark:text-blue-400">${{ totalPrice.toFixed(2) }}</span>
      </div>
      <div class="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded shadow text-sm font-semibold text-gray-700 dark:text-gray-200">
        Total Selling Price: <span class="text-green-600 dark:text-green-400">${{ totalSellingPrice.toFixed(2) }}</span>
      </div>
      <div class="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded shadow text-sm font-semibold text-gray-700 dark:text-gray-200">
        Total All Product: <span class="text-indigo-600 dark:text-indigo-400">${{ totalAllProduct.toFixed(2) }}</span>
      </div>
      <div class="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded shadow text-sm font-semibold text-gray-700 dark:text-gray-200">
        Total Profit: <span class="text-emerald-600 dark:text-emerald-400">${{ totalProfit.toFixed(2) }}</span>
      </div>
    </div>
    <div class="relative flex justify-center mb-4">
      <button
        @click="isModalOpen = true"
        class="px-6 py-2 mx-auto tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
      >
        Add Product
      </button>
    </div>

    <!-- Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-40"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="relative w-full max-w-2xl mx-2 sm:mx-auto bg-gray-50 dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 p-2 sm:p-6 md:p-8 transition-all"
        style="max-height:95vh;overflow-y:auto;overflow-x:hidden;scrollbar-width:none;"
      >
        <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-2" id="modal-title">
          {{ form._id ? "Edit Product" : "Add Product" }}
        </h3>
        <div class="border-b border-gray-200 dark:border-gray-700 mb-4"></div>
        <!-- Product Form -->
        <form @submit.prevent="onSubmit" class="product-form grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Name</label>
            <input v-model="form.name" required
              class="block w-full px-4 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-blue-400 transition"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">SKU</label>
            <input v-model.number="form.sku" type="number" required
              :class="['block w-full px-4 py-2 text-base text-gray-700 bg-white border rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-blue-400 transition', skuExists ? 'border-red-500' : 'border-gray-300']"
            />
            <span v-if="skuExists" class="text-xs text-red-500">SKU already exists.</span>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Unit</label>
            <select v-model="form.unit_id" required
              class="block w-full px-4 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-blue-400 transition"
            >
              <option value="" disabled>Select unit</option>
              <option v-for="u in units" :key="u._id" :value="u._id">
                {{ u.name }} <span v-if="u.sub_name">({{ u.sub_name }})</span>
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Brand</label>
            <select v-model="form.brand_id" required
              class="block w-full px-4 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-blue-400 transition"
            >
              <option value="" disabled>Select brand</option>
              <option v-for="b in brands" :key="b._id" :value="b._id">
                {{ b.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Category</label>
            <select v-model="form.category_id" required
              class="block w-full px-4 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-blue-400 transition"
            >
              <option value="" disabled>Select category</option>
              <option v-for="c in categories" :key="c._id" :value="c._id">
                {{ c.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Default Price</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                v-model="form.default_price"
                step="any"
                readonly
                disabled
                class="pl-7 block w-full px-4 py-2 text-base text-gray-400 bg-gray-100 border border-gray-200 rounded-lg shadow-sm cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500"
                required
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Selling Price</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                v-model="form.selling_price"
                step="any"
                class="pl-7 block w-full px-4 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-blue-400 transition"
                required
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Current Stock</label>
            <input
              type="number"
              v-model="form.current_stock"
              readonly
              disabled
              class="block w-full px-4 py-2 text-base text-gray-400 bg-gray-100 border border-gray-200 rounded-lg shadow-sm cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500"
            />
          </div>
          <div class="sm:col-span-2">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Descriptions</label>
            <textarea v-model="form.descriptions"
              class="block w-full px-4 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-blue-400 transition"
              rows="2"
            ></textarea>
          </div>
          <div class="sm:col-span-2">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Image</label>
            <div class="flex flex-col items-start">
              <Upload
                :multiple="false"
                type="drag"
                :action="uploadAction"
                :before-upload="beforeUpload"
                :on-success="onUploadSuccess"
                :on-error="onUploadError"
                :show-upload-list="false"
              >
                <div class="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-gray-700 transition">
                  <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                  <p class="mt-2 text-sm text-blue-600 dark:text-blue-400">Click or drag files here to upload</p>
                </div>
              </Upload>
              <div v-if="form.imageUrl" class="mt-2 relative">
                <img
                  :src="form.imageUrl"
                  alt="Product Image"
                  class="rounded shadow border max-w-[80px] max-h-[80px] mt-2"
                />
                <button
                  type="button"
                  @click="removeImageUrl"
                  class="ml-2 text-red-500 underline absolute top-0 right-0 bg-white dark:bg-gray-900 px-2 py-1 rounded shadow"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
          <div class="sm:col-span-2 flex flex-col sm:flex-row gap-3 mt-4">
            <button
              type="button"
              @click="closeModal"
              class="w-full px-4 py-2 text-base font-semibold tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-300 rounded-lg dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="w-full px-4 py-2 text-base font-semibold tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
            >
              {{ form._id ? "Update" : "Add" }} Product
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Image Preview Modal -->
    <div
      v-if="showImageModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
      @click.self="showImageModal = false"
    >
      <div class="relative bg-transparent flex flex-col items-center w-full max-w-2xl mx-2 sm:mx-auto">
        <button
          @click="showImageModal = false"
          class="absolute top-0 right-0 m-2 text-white bg-gray-800 bg-opacity-70 rounded-full p-2 hover:bg-opacity-90 focus:outline-none"
          aria-label="Close"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        <img
          :src="modalImageUrl"
          alt="Product Full Image"
          class="max-w-full max-h-[80vh] rounded shadow-lg border-4 border-white dark:border-gray-800 object-contain"
        />
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
      <div class="flex flex-col sm:flex-row gap-3 w-full">
        <div class="relative w-full sm:w-64">
          <input
            v-model="searchText"
            type="text"
            placeholder="🔍 Search by name or SKU..."
            class="block w-full pl-10 pr-4 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-blue-400 transition"
          />
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" /></svg>
          </span>
        </div>
        <select v-model="filterUnit" class="w-full sm:w-40 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring focus:ring-blue-200 shadow-sm">
          <option value="">All Units</option>
          <option v-for="u in units" :key="u._id" :value="u._id">{{ u.name }}</option>
        </select>
        <select v-model="filterBrand" class="w-full sm:w-40 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring focus:ring-blue-200 shadow-sm">
          <option value="">All Brands</option>
          <option v-for="b in brands" :key="b._id" :value="b._id">{{ b.name }}</option>
        </select>
        <select v-model="filterCategory" class="w-full sm:w-40 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring focus:ring-blue-200 shadow-sm">
          <option value="">All Categories</option>
          <option v-for="c in categories" :key="c._id" :value="c._id">{{ c.name }}</option>
        </select>
      </div>
    </div>

    <!-- Product Table (styled) -->
    <div class="flex flex-col mt-6">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div class="overflow-x-auto overflow-y-visible border border-gray-200 dark:border-gray-700 md:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th class="py-3.5 px-4 text-xs sm:text-sm font-normal text-left text-gray-500 dark:text-gray-400 whitespace-nowrap">Name</th>
                  <th class="px-4 py-3.5 text-xs sm:text-sm font-normal text-left text-gray-500 dark:text-gray-400 whitespace-nowrap">SKU</th>
                  <th class="px-4 py-3.5 text-xs sm:text-sm font-normal text-left text-gray-500 dark:text-gray-400 whitespace-nowrap hidden md:table-cell">Unit</th>
                  <th class="px-4 py-3.5 text-xs sm:text-sm font-normal text-left text-gray-500 dark:text-gray-400 whitespace-nowrap hidden lg:table-cell">Brand</th>
                  <th class="px-4 py-3.5 text-xs sm:text-sm font-normal text-left text-gray-500 dark:text-gray-400 whitespace-nowrap hidden lg:table-cell">Category</th>
                  <th class="px-4 py-3.5 text-xs sm:text-sm font-normal text-left text-gray-500 dark:text-gray-400 whitespace-nowrap">Default Price</th>
                  <th class="px-4 py-3.5 text-xs sm:text-sm font-normal text-left text-gray-500 dark:text-gray-400 whitespace-nowrap">Selling Price</th>
                  <th class="px-4 py-3.5 text-xs sm:text-sm font-normal text-left text-gray-500 dark:text-gray-400 whitespace-nowrap">Stock</th>
                  <th class="px-4 py-3.5 text-xs sm:text-sm font-normal text-left text-gray-500 dark:text-gray-400 whitespace-nowrap">Image</th>
                  <th class="px-4 py-3.5 text-xs sm:text-sm font-normal text-left text-gray-500 dark:text-gray-400 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                <tr v-for="product in pagedProducts" :key="product._id" class="hover:bg-blue-50 dark:hover:bg-gray-800 transition">
                  <td class="px-4 py-4 text-xs sm:text-sm font-medium text-blue-500 whitespace-nowrap">{{ product.name }}</td>
                  <td class="px-4 py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">{{ product.sku }}</td>
                  <td class="px-4 py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap hidden md:table-cell">
                    <span v-if="product.unit && product.unit.name">
                      {{ product.unit.name }}<span v-if="product.unit.sub_name"> ({{ product.unit.sub_name }})</span>
                    </span>
                    <span v-else class="text-gray-400">-</span>
                  </td>
                  <td class="px-4 py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap hidden lg:table-cell">
                    <span v-if="product.brand && product.brand.name">
                      {{ product.brand.name }}
                    </span>
                    <span v-else class="text-gray-400">-</span>
                  </td>
                  <td class="px-4 py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap hidden lg:table-cell">
                    <span v-if="product.category && product.category.name">
                      {{ product.category.name }}
                    </span>
                    <span v-else class="text-gray-400">-</span>
                  </td>
                  <td class="px-4 py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    <span>$</span>{{ product.default_price }}
                  </td>
                  <td class="px-4 py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    <span>$</span>{{ product.selling_price }}
                  </td>
                  <td class="px-4 py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">{{ product.current_stock }}</td>
                  <td class="px-4 py-4 text-xs sm:text-sm whitespace-nowrap">
                    <img
                      v-if="product.imageUrl"
                      :src="product.imageUrl"
                      alt="Product Image"
                      class="max-w-[40px] max-h-[40px] rounded shadow border cursor-pointer transition hover:scale-110"
                      @click="openImageModal(product.imageUrl)"
                    />
                  </td>
                  <td class="px-4 py-4 text-xs sm:text-sm whitespace-nowrap">
                    <div class="flex items-center gap-x-4">
                      <button @click="editProduct(product)" class="text-gray-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                      <button @click="deleteProduct(product._id)" class="text-gray-500 transition-colors duration-200 dark:hover:text-red-500 dark:text-gray-300 hover:text-red-500 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="products.length === 0">
                  <td colspan="10" class="px-4 py-4 text-center text-gray-500">
                    No products found.
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
                  <span v-if="page === '...'" :key="'ellipsis-' + index" class="px-2 py-2 mx-1 text-gray-400 select-none">...</span>
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
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { Meteor } from "meteor/meteor";
import FilesCollection from "/imports/api/files/files";

export default {
  name: "ProductView",
  data() {
    return {
      products: [],
      units: [],
      brands: [],
      categories: [],
      form: {
        _id: null,
        name: "",
        sku: null,
        unit_id: "",
        brand_id: "",
        category_id: "",
        default_price: 0,
        selling_price: 0,
        imageUrl: "",
        current_stock: 0,
        descriptions: "",
      },
      file: null,
      fileData: [],
      uploadAction: "//jsonplaceholder.typicode.com/posts/",
      isModalOpen: false,
      currentPage: 1,
      pageSize: 10,
      showImageModal: false,
      modalImageUrl: "",
      skuExists: false,
      alert: {
        show: false,
        type: '',
        title: '',
        message: '',
        bg: '',
        text: ''
      },
      searchText: '',
      filterUnit: '',
      filterBrand: '',
      filterCategory: '',
    };
  },
  computed: {
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredProducts.length / this.pageSize));
    },
    pagedProducts() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredProducts.slice(start, start + this.pageSize);
    },
    filteredProducts() {
      const search = this.searchText.trim().toLowerCase();
      return this.products.filter(product => {
        const matchesSearch =
          (!search ||
            product.name.toLowerCase().includes(search) ||
            String(product.sku).includes(search));
        const matchesUnit = this.filterUnit ? product.unit_id === this.filterUnit : true;
        const matchesBrand = this.filterBrand ? product.brand_id === this.filterBrand : true;
        const matchesCategory = this.filterCategory ? product.category_id === this.filterCategory : true;
        return matchesSearch && matchesUnit && matchesBrand && matchesCategory;
      });
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
    totalPrice() {
      // Sum of default_price * current_stock for all filtered products
      return this.filteredProducts.reduce(
        (sum, p) => sum + (Number(p.default_price) || 0) * (Number(p.current_stock) || 0),
        0
      );
    },
    totalSellingPrice() {
      // Sum of selling_price * current_stock for all filtered products
      return this.filteredProducts.reduce(
        (sum, p) => sum + (Number(p.selling_price) || 0) * (Number(p.current_stock) || 0),
        0
      );
    },
    totalAllProduct() {
      // Alias for totalSellingPrice (total value of all products at selling price)
      return this.totalSellingPrice;
    },
    totalProfit() {
      // Total profit = total selling - total price
      return this.totalSellingPrice - this.totalPrice;
    },
  },
  methods: {
    fetchProducts() {
      Meteor.call("products.find", {}, (err, res) => {
        if (!err) {
          // Map aggregation result to flatten related fields for display
          this.products = (res || []).map(p => ({
            ...p,
            unit: p.unit || {},
            brand: p.brand || {},
            category: p.category || {},
          }));
        }
      });
    },
    fetchUnits() {
      Meteor.call("units.find", {}, (err, res) => {
        if (!err) this.units = res || [];
      });
    },
    fetchBrands() {
      Meteor.call("brands.find", {}, (err, res) => {
        if (!err) this.brands = res || [];
      });
    },
    fetchCategories() {
      Meteor.call("categories.find", {}, (err, res) => {
        if (!err) this.categories = res || [];
      });
    },
    beforeUpload(file) {
      if (this.form.imageUrl) {
        this.$Message.warning("Please remove the existing image before selecting a new file.");
        return false;
      }
      this.file = file;
      // Prevent auto upload, handle manually
      this.handleUpload(file);
      return false;
    },
    handleUpload(file) {
      // Use your Meteor FilesCollection upload logic here
      const upload = FilesCollection.insert({
        file: file,
        chunkSize: "dynamic",
      });
      upload.on("end", (err, fileObj) => {
        if (err) {
          this.$Message.error("Image upload failed: " + err.message);
        } else if (fileObj && fileObj._id) {
          this.getFileUploads(() => {
            const uploaded = this.fileData.find(f => f._id === fileObj._id);
            if (uploaded && uploaded.url) {
              this.form.imageUrl = uploaded.url;
            }
            this.file = null;
          });
        }
      });
    },
    onUploadSuccess(response, file) {
      // Not used, handled in handleUpload
    },
    onUploadError(error, file) {
      this.$Message.error("Upload error: " + error);
    },
    getFileUploads(cb) {
      Meteor.call("findImageData", (err, res) => {
        if (!err) {
          this.fileData = res || [];
          if (typeof cb === "function") cb();
        }
      });
    },
    removeFileFromServer(id) {
      if (!id) return;
      FilesCollection.remove({ _id: id }, (err) => {
        if (err) {
          alert("Error removing file: " + err.message);
        } else {
          this.getFileUploads();
        }
      });
    },
    removeImageUrl() {
      if (this.form.imageUrl) {
        const fileToRemove = this.fileData.find(
          (file) => file.url === this.form.imageUrl
        );
        if (fileToRemove && fileToRemove._id) {
          this.removeFileFromServer(fileToRemove._id);
        }
        this.form.imageUrl = "";
        this.file = null;
        if (this.$refs.fileInput) this.$refs.fileInput.value = "";
      }
    },
    showAlert(type, title, message) {
      const style = {
        success: { bg: 'bg-emerald-500', text: 'text-emerald-500 dark:text-emerald-400' },
        info:    { bg: 'bg-blue-500',    text: 'text-blue-500 dark:text-blue-400' },
        warning: { bg: 'bg-yellow-400',  text: 'text-yellow-400 dark:text-yellow-300' },
        error:   { bg: 'bg-red-500',     text: 'text-red-500 dark:text-red-400' }
      }[type] || { bg: '', text: '' }
      this.alert = { show: true, type, title, message, ...style }
      setTimeout(() => { this.alert.show = false }, 3000)
    },
    onSubmit() {
      // SKU uniqueness check (ignore self on edit)
      const skuVal = this.form.sku;
      const exists = this.products.some(
        p => String(p.sku).trim().toLowerCase() === String(skuVal).trim().toLowerCase() && p._id !== this.form._id
      );
      this.skuExists = exists;
      if (exists) {
        this.showAlert('error', 'Error', 'SKU already exists!');
        this.$nextTick(() => {
          const skuInput = this.$el.querySelector('input[type="number"][v-model="form.sku"]');
          if (skuInput) skuInput.focus();
        });
        return;
      }
      if (this.file) {
        this.showAlert('warning', 'Warning', 'Please upload the selected image before saving the product.');
        return;
      }
      this.saveProduct();
    },
    saveProduct() {
      const method = this.form._id ? "products.update" : "products.insert";
      const payload = { ...this.form };
      // Only keep imageUrl if it's a short URL (not a base64 string)
      if (!payload.imageUrl || payload.imageUrl.length > 100) {
        delete payload.imageUrl;
      }
      if (!payload._id) delete payload._id;
      Meteor.call(method, payload, (err) => {
        if (!err) {
          this.fetchProducts();
          this.resetForm();
          this.isModalOpen = false;
          this.showAlert('success', 'Success', this.form._id ? 'Product updated successfully!' : 'Product added successfully!');
        } else {
          this.showAlert('error', 'Error', err.reason || err.message || err);
        }
      });
    },
    editProduct(product) {
      this.form = {
        _id: product._id,
        name: product.name,
        sku: product.sku,
        unit_id: product.unit_id,
        brand_id: product.brand_id,
        category_id: product.category_id,
        default_price: product.default_price, // use actual default price
        selling_price: product.selling_price,
        imageUrl: product.imageUrl,
        current_stock: product.current_stock, // use actual current stock
        descriptions: product.descriptions,
      };
      this.file = null;
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
      this.resetForm();
    },
    deleteProduct(_id) {
      if (confirm("Are you sure you want to delete this product?")) {
        Meteor.call("products.remove", { _id }, (err) => {
          if (!err) this.fetchProducts();
        });
      }
    },
    resetForm() {
      this.form = {
        _id: null,
        name: "",
        sku: null,
        unit_id: "",
        brand_id: "",
        category_id: "",
        default_price: 0,
        selling_price: 0,
        imageUrl: "",
        current_stock: 0,
        descriptions: "",
      };
      this.file = null;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = "";
      }
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
    openImageModal(url) {
      this.modalImageUrl = url;
      this.showImageModal = true;
    },
  },
  mounted() {
    this.fetchProducts();
    this.fetchUnits();
    this.fetchBrands();
    this.fetchCategories();
    this.getFileUploads();
  },
};
</script>

<style scoped>
.product-form {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 32px;
  background: transparent;
  padding: 0;
  border-radius: 8px;
}
.product-form > div {
  flex: 1 1 200px;
  min-width: 180px;
  display: flex;
  flex-direction: column;
}
.product-form label {
  font-weight: bold;
  margin-bottom: 4px;
  color: #374151;
}
.dark .product-form label {
  color: #d1d5db;
}
.input {
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
  background: #fff;
  margin-bottom: 4px;
  color: #111827;
}
.input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px #2563eb22;
}
.dark .input {
  background: #1f2937;
  border-color: #374151;
  color: #f3f4f6;
}
.form-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
.btn-primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 8px 18px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}
.btn-primary:hover {
  background: #1d4ed8;
}
.btn-secondary {
  background: #e5e7eb;
  color: #374151;
  border: none;
  padding: 8px 18px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}
.btn-secondary:hover {
  background: #d1d5db;
}
.btn-action {
  background: none;
  border: none;
  color: #2563eb;
  cursor: pointer;
  font-weight: 500;
  margin-right: 6px;
  padding: 0 4px;
}
.btn-action:hover {
  text-decoration: underline;
}
.product-table {
  width: 100%;
  border-collapse: collapse;
}
.product-table th, .product-table td {
  border: 1px solid #ddd;
  padding: 8px;
}
.product-table th {
  background: #f4f4f4;
}
.mt-2 { margin-top: 0.5rem; }
.mt-6 { margin-top: 1.5rem; }
.text-gray-400 { color: #9ca3af; }
.text-red-500 { color: #ef4444; }
::-webkit-scrollbar {
  width: 0 !important;
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: transparent;
}
::-webkit-scrollbar-track {
  background: transparent;
}
@media (max-width: 1024px) {
  th.lg\:table-cell, td.lg\:table-cell {
    display: none !important;
  }
}
@media (max-width: 768px) {
  th.md\:table-cell, td.md\:table-cell {
    display: none !important;
  }
  .product-form {
    grid-template-columns: 1fr !important;
    gap: 8px !important;
  }
  .product-form > div {
    min-width: 100px !important;
  }
}
@media (max-width: 640px) {
  .container {
    padding-left: 0.25rem !important;
    padding-right: 0.25rem !important;
  }
  .product-form {
    padding: 0 !important;
    gap: 6px !important;
  }
  .product-form label {
    font-size: 0.95rem !important;
  }
  .product-form input,
  .product-form select,
  .product-form textarea {
    font-size: 0.95rem !important;
    padding: 6px !important;
  }
  .product-table th, .product-table td {
    padding: 4px !important;
    font-size: 0.9rem !important;
  }
  .sm\:col-span-2 {
    grid-column: span 1 !important;
  }
}
</style>