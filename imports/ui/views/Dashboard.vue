<template>
  <section class="container px-4 mx-auto">
    <div class="flex items-center gap-x-3">
      <h2 class="text-lg font-medium text-gray-800 dark:text-white">Team Dashboard</h2>
      <span class="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">{{ products.length }} products</span>
    </div>

    <div class="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
      <!-- Pie Chart: Stock Distribution -->
      <div class="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Stock Distribution</h3>
        <div class="h-64">
          <Pie :data="roleChartData" :options="chartOptions" />
        </div>
      </div>

      <!-- Bar Chart: Sold Quantity per Product -->
      <div class="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Sold Quantity per Product</h3>
        <div class="h-64">
          <Bar :data="teamChartData" :options="chartOptions" />
        </div>
      </div>

      <!-- Doughnut Chart: Stock vs Sold -->
      <div class="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Stock vs Sold</h3>
        <div class="h-64">
          <Doughnut :data="statusChartData" :options="chartOptions" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { Pie, Bar, Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Meteor } from 'meteor/meteor';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale);

export default {
  components: { Pie, Bar, Doughnut },
  data() {
    return {
      products: [],
      soldMap: {},
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
        },
      },
      loading: true,
    };
  },
  computed: {
    // Pie: Stock distribution by product
    roleChartData() {
      const labels = this.products.map(p => p.name);
      const data = this.products.map(p => p.current_stock || 0);
      return {
        labels,
        datasets: [{
          data,
          backgroundColor: ['#34D399', '#3B82F6', '#F472B6', '#FBBF24', '#10B981', '#6366F1', '#F87171'],
        }],
      };
    },
    // Bar: Sold quantity by product
    teamChartData() {
      const labels = this.products.map(p => p.name);
      const data = this.products.map(p => this.soldMap[p._id] || 0);
      return {
        labels,
        datasets: [{
          label: 'Sold Qty',
          data,
          backgroundColor: ['#4F46E5', '#06B6D4', '#EC4899', '#F59E42', '#10B981', '#6366F1', '#F87171'],
        }],
      };
    },
    // Doughnut: Stock vs Sold (total)
    statusChartData() {
      const totalStock = this.products.reduce((sum, p) => sum + (p.current_stock || 0), 0);
      const totalSold = Object.values(this.soldMap).reduce((sum, qty) => sum + qty, 0);
      return {
        labels: ['Stock', 'Sold'],
        datasets: [{
          data: [totalStock, totalSold],
          backgroundColor: ['#10B981', '#EF4444'],
        }],
      };
    },
  },
  methods: {
    async fetchData() {
      this.loading = true;
      // Fetch products
      const products = await new Promise((resolve, reject) => {
        Meteor.call('products.find', {}, (err, res) => {
          if (err) reject(err);
          else resolve(res || []);
        });
      });
      // Fetch all order sell pos
      const orders = await new Promise((resolve, reject) => {
        Meteor.call('order_sell_pos.find', {}, (err, res) => {
          if (err) reject(err);
          else resolve(res || []);
        });
      });
      // Calculate sold qty per product
      const soldMap = {};
      orders.forEach(order => {
        (order.items || []).forEach(item => {
          soldMap[item.product_id] = (soldMap[item.product_id] || 0) + (item.qty || 0);
        });
      });
      this.products = products;
      this.soldMap = soldMap;
      this.loading = false;
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>

<style>
/* Tailwind CSS is already included via the template's classes */
</style>