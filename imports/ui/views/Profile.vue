<template>
  <section class="container mx-auto px-2 py-4">
    <h2 class="text-lg font-bold mb-4 text-gray-800 dark:text-white">My Profile</h2>
    <div v-if="user">
      <div class="mb-2">
        <span class="font-semibold">User ID:</span> {{ user._id }}
      </div>
      <div class="mb-2">
        <span class="font-semibold">Email:</span> {{ user.emails[0]?.address }}
      </div>
    </div>
    <div v-else class="text-gray-500">Not logged in.</div>
  </section>
</template>

<script>
import { Meteor } from 'meteor/meteor';

export default {
  name: "Profile",
  data() {
    return {
      user: Meteor.user(),
      tracker: null,
    };
  },
  mounted() {
    // Use Tracker to reactively update user info
    this.tracker = Tracker.autorun(() => {
      this.user = Meteor.user();
    });
  },
  beforeUnmount() {
    if (this.tracker) this.tracker.stop();
  }
};
</script>

<style scoped>
/* ...existing code or add your styles here... */
</style>
