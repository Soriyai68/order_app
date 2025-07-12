<template>
  <div
    class="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 lg:max-w-4xl"
  >
    <div
      class="hidden bg-cover lg:block lg:w-1/2"
      style="
        background-image: url('/images/components/oo.png');
      "
    ></div>

    <div class="w-full px-6 py-8 md:px-8 lg:w-1/2">
      <div class="flex justify-center mx-auto">
        <img
          class="w-auto h-7 sm:h-8"
          src="/images/components/yaa.png"
          alt=""
        />
      </div>

      <p class="mt-3 text-xl text-center text-gray-600 dark:text-gray-200">
        Welcome back!
      </p>

      <div class="mt-4">
        <label
          class="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200"
          for="LoggingEmailAddress"
          >Email Address</label
        >
        <input
          id="LoggingEmailAddress"
          v-model="email"
          class="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
          type="email"
        />
      </div>

      <div class="mt-4">
        <div class="flex justify-between">
          <label
            class="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200"
            for="loggingPassword"
            >Password</label
          >
          <a
            href="#"
            class="text-xs text-gray-500 dark:text-gray-300 hover:underline"
            >Forget Password?</a
          >
        </div>

        <input
          id="loggingPassword"
          v-model="password"
          class="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
          type="password"
        />
      </div>

      <div v-if="error" class="mt-2 text-red-500 text-sm">{{ error }}</div>

      <div class="mt-6">
        <button
          @click.prevent="login"
          class="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
        >
          Sign In
        </button>
      </div>

      <div class="flex items-center justify-between mt-4">
        <span class="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
<!-- 
        <router-link
          to="/singup"
          class="text-xs text-gray-500 uppercase dark:text-gray-400 hover:underline"
        >
          or sign up
        </router-link> -->

        <span class="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { Meteor } from 'meteor/meteor';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const error = ref('');
    const router = useRouter();

    const login = () => {
      error.value = '';
      Meteor.loginWithPassword(email.value, password.value, (err) => {
        if (err) {
          error.value = err.reason || 'Login failed';
        } else {
          router.push('/');
        }
      });
    };

    return { email, password, error, login };
  },
};
</script>

<style>
</style>