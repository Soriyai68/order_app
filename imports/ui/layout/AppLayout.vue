<template>
  <aside class="flex relative">
    <!-- Sidebar -->
    <div
      :class="[
        'h-screen bg-white border-l border-r dark:bg-gray-900 dark:border-gray-700 transition-all duration-300 ease-in-out relative flex flex-col',
        'sm:h-screen h-[100dvh]',
        sidebarOpen
          ? 'sm:w-64 w-60 px-5 py-8'
          : 'w-0 px-0 py-0 overflow-hidden',
      ]"
      aria-expanded="true"
      aria-label="Sidebar navigation"
    >
      <div
        class="flex-1 h-full overflow-y-auto transition-all"
        :class="sidebarOpen ? '' : 'hidden'"
      >
        <!-- Search bar -->
        <div class="relative mb-4" v-if="sidebarOpen">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              class="w-5 h-5 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </span>
          <input
            type="text"
            v-model="searchQuery"
            class="w-full py-1.5 pl-10 pr-4 text-gray-700 bg-white border rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
            placeholder="Search"
            aria-label="Search"
          />
        </div>
        <!-- Navigation -->
        <nav class="mt-4 -mx-3 space-y-6" role="navigation">
          <!-- Management -->
          <div class="space-y-3" v-if="filteredLinks.management.length">
            <label
              v-if="sidebarOpen"
              class="px-3 text-xs text-gray-500 uppercase dark:text-gray-400"
              >Management</label
            >
            <a
              v-for="item in filteredLinks.management"
              :key="item.label"
              class="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
              href="#"
              @click.prevent="handleManagementClick(item)"
            >
              <span v-html="item.icon"></span>
              <span v-if="sidebarOpen" class="mx-2 text-sm font-medium">{{
                item.label
              }}</span>
            </a>
          </div>
          <!-- Inventory -->
          <div class="space-y-3" v-if="filteredLinks.inventory.length">
            <label
              v-if="sidebarOpen"
              class="px-3 text-xs text-gray-500 uppercase dark:text-gray-400"
              >Inventory</label
            >
            <a
              v-for="item in filteredLinks.inventory"
              :key="item.label"
              class="flex items-center px-4 py-2 text-gray-600 transition-colors duration-300 transform hover:rounded-xl dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
              href="#"
              @click.prevent="handleInventoryClick(item)"
              style="cursor: pointer"
            >
              <span v-html="item.icon"></span>
              <span v-if="sidebarOpen" class="mx-2 text-sm font-medium">{{
                item.label
              }}</span>
            </a>
          </div>
          <!-- Operations -->
          <div class="space-y-3" v-if="filteredLinks.operations.length">
            <label
              v-if="sidebarOpen"
              class="px-3 text-xs text-gray-500 uppercase dark:text-gray-400"
              >Operations</label
            >
            <a
              v-for="item in filteredLinks.operations"
              :key="item.label"
              class="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
              href="#"
              @click.prevent="handleOperationsClick(item)"
            >
              <span v-html="item.icon"></span>
              <span v-if="sidebarOpen" class="mx-2 text-sm font-medium">{{
                item.label
              }}</span>
            </a>
          </div>
          <!-- Profile & Logout -->
          <div class="space-y-3 mt-4" v-if="filteredLinks.profile.length">
            <a
              v-for="item in filteredLinks.profile"
              :key="item.label"
              class="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
              href="#"
              @click.prevent="handleProfileClick(item)"
            >
              <template v-if="item.img">
                <img
                  class="object-cover w-5 h-5 rounded-lg"
                  src="/images/components/yaa.png"
                  alt="Profile avatar"
                />
                <span
                  v-if="sidebarOpen"
                  class="mx-2 text-sm font-semibold text-blue-700 dark:text-blue-300"
                >
                  {{ userEmail }}
                </span>
              </template>
              <template v-else>
                <span v-html="item.icon"></span>
              </template>
              <span v-if="sidebarOpen" class="mx-2 text-sm font-medium">{{
                item.label
              }}</span>
            </a>
          </div>
        </nav>
      </div>
      <!-- Divider above toggle button -->
      <div class="w-full flex-shrink-0" v-if="sidebarOpen">
        <div class="border-t border-gray-200 dark:border-gray-700 my-2"></div>
        <div class="flex justify-center">
          <button
            @click="sidebarOpen = !sidebarOpen"
            class="sidebar-toggle-btn"
            :class="sidebarOpen ? '' : 'collapsed'"
            aria-label="Toggle sidebar"
          >
            <svg
              class="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <!-- Toggle button always visible and fixed at left -->
    <button
      v-if="!sidebarOpen"
      @click="sidebarOpen = true"
      class="sidebar-toggle-btn sidebar-toggle-fixed"
      aria-label="Open sidebar"
    >
      <svg
        class="w-6 h-6 text-gray-500"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
    <!-- Main content area -->
    <main
      class="flex-1 min-h-screen bg-gray-50 dark:bg-gray-800 p-8 transition-all duration-300"
      :class="sidebarOpen ? '' : 'ml-0'"
    >
      <router-view />
    </main>
  </aside>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const sidebarOpen = ref(true);

// Always keep sidebar open on refresh
onMounted(() => {
  sidebarOpen.value = true;
  // Optionally, remove sidebar param from URL if present
  if (route.query.sidebar) {
    const q = { ...route.query };
    delete q.sidebar;
    router.replace({ query: q });
  }
});

const searchQuery = ref("");
const user = Meteor.user && Meteor.user();
const userEmail = computed(() => user?.emails?.[0]?.address || "");

const svgIcons = {
  Products: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/></svg>`,
  "Opening Stock": `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25"/></svg>`,
  Unit: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014 -0.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.5 14.5M9.75 3.104a22.471 22.471 0 013 0M5 14.5l4.096-4.096m0 0a2.25 2.25 0 011.591.659L14.5 19.5"/></svg>`,
  Category: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 15.75v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/></svg>`,
  Brand: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"/></svg>`,
  Place: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>`,
  "Order Sell": `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/></svg>`,
  Customer: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/></svg>`,
  Report: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"/></svg>`,
  User: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>`,
  Logout: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"/></svg>`,
  Dashboard: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.5V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v6.75m-18 0v4.5A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75v-4.5m-18 0h18" /></svg>`,
};

const logout = () => {
  Meteor.logout((err) => {
    if (!err) router.push("/login");
  });
};

const navLinks = {
  management: [
    {
      label: "POS",
      icon: svgIcons["Order Sell"],
      onClick: () => router.push("/operation/pos"),
    },
    {
      label: "Dashboard",
      icon: svgIcons.Dashboard,
      onClick: () => router.push("/"),
    },
    {
      label: "Products",
      icon: svgIcons.Products,
      onClick: () => router.push("/management/product"),
    },
    {
      label: "Opening Stock",
      icon: svgIcons["Opening Stock"],
      onClick: () => router.push("/management/opening_stock"),
    },
  ],
  inventory: [
    {
      label: "Unit",
      icon: svgIcons.Unit,
      onClick: () => router.push("/inventory/unit"),
    },
    {
      label: "Category",
      icon: svgIcons.Category,
      onClick: () => router.push("/inventory/category"),
    },
    {
      label: "Brand",
      icon: svgIcons.Brand,
      onClick: () => router.push("/inventory/brand"),
    },
  ],
  operations: [
    { label: "Place", icon: svgIcons.Place },
    { label: "Order Sell", icon: svgIcons["Order Sell"] },
    { label: "Customer", icon: svgIcons.Customer },
    { label: "Report", icon: svgIcons.Report },
  ],
  profile: [
    {
      label: "Profile",
      img: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&h=634&q=80",
      onClick: () => router.push(`/profile/${userEmail.value}`),
    },
    { label: "Logout", icon: svgIcons.Logout },
  ],
};

const filteredLinks = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return navLinks;
  const filter = (arr) =>
    arr.filter((item) => item.label.toLowerCase().includes(q));
  return {
    management: filter(navLinks.management),
    inventory: filter(navLinks.inventory),
    operations: filter(navLinks.operations),
    profile: filter(navLinks.profile),
  };
});

function handleManagementClick(item) {
  if (item.label === "Products") {
    router.push("/management/product");
  } else if (typeof item.onClick === "function") {
    item.onClick();
  }
}

function handleInventoryClick(item) {
  if (item.label === "Unit") {
    router.push("/inventory/unit");
  } else if (item.label === "Brand") {
    router.push("/inventory/brand");
  } else if (item.label === "Category") {
    router.push("/inventory/category");
  } else if (typeof item.onClick === "function") {
    item.onClick();
  }
}

function handleOperationsClick(item) {
  if (item.label === "Place") {
    router.push("/operation/place_order");
  } else if (item.label === "Customer") {
    router.push("/operation/customer");
  } else if (item.label === "Order Sell") {
    router.push("/operation/pos");
  } else if (item.label === "Report") {
    router.push("/operation/sellList");
  }
}

function handleProfileClick(item) {
  if (item.label === "Profile" && typeof item.onClick === "function") {
    item.onClick();
  } else if (item.label === "Logout") {
    logout();
  }
}
</script>

<style>
/* Smooth transitions */
.transition-all {
  transition: all 0.3s ease-in-out;
}

/* Hide scrollbar but keep functionality */
.overflow-y-auto::-webkit-scrollbar {
  display: none;
}

.overflow-y-auto {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Prevent layout shift */
.aside > div {
  min-width: 0;
}

.sidebar-toggle-btn {
  @apply bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow transition-all duration-300 ease-in-out flex items-center justify-center;
  padding: 0.5rem;
  margin-bottom: 0.25rem;
  outline: none;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s, transform 0.3s;
  z-index: 50;
}

.sidebar-toggle-btn:hover {
  @apply bg-blue-100 dark:bg-blue-900 shadow-lg;
}

.sidebar-toggle-btn.collapsed {
  transform: rotate(180deg) scale(1.08);
  background: #e0e7ef;
}

/* Fixed position for toggle button when sidebar is closed */
.sidebar-toggle-fixed {
  position: fixed;
  top: 1.5rem;
  left: 0.75rem;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(60, 60, 60, 0.1);
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
}

.sidebar-toggle-fixed:hover {
  background: #e0e7ef;
}

/* Ensure main content takes full width when sidebar is closed */
main {
  width: 100%;
}
</style>