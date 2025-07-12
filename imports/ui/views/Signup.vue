<template>
  <div
    class="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 lg:max-w-4xl"
  >
    <div
      class="hidden bg-cover lg:block lg:w-1/2"
      style="
        background-image: url('/images/components/yaa.png');
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
        Create your account
      </p>

      <form @submit.prevent="signup" class="mt-6">
        <div class="mb-4">
          <label for="email" class="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
            Email Address
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Enter your email"
            required
            class="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div class="mb-4">
          <label for="password" class="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
            Password
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            required
            class="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div class="mb-4">
          <label for="confirmPassword" class="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            required
            class="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div v-if="errorMessage" class="mt-2 text-red-500 text-sm text-center">{{ errorMessage }}</div>
        <div v-if="successMessage" class="mt-2 text-green-500 text-sm text-center">{{ successMessage }}</div>
        <div class="mt-6">
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="loader"></span>
            {{ isLoading ? 'Signing up...' : 'Sign Up' }}
          </button>
        </div>
      </form>
      <p class="mt-4 text-sm text-center text-gray-600">
        Already have an account?
        <router-link to="/login" class="text-blue-500 hover:underline">
          Log in
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Accounts } from 'meteor/accounts-base';

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const router = useRouter();

const signup = () => {
  if (!email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = 'Please fill in all fields.';
    return;
  }
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.';
    return;
  }
  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  Accounts.createUser({
    email: email.value,
    password: password.value,
  }, (error) => {
    isLoading.value = false;
    if (error) {
      errorMessage.value = error.reason || 'Signup failed. Please try again.';
    } else {
      successMessage.value = 'Account created! Redirecting...';
      setTimeout(() => router.push('/login'), 1200);
    }
  });
};
</script>
