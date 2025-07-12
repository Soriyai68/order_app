<template>
  <section class="container mx-auto px-2 py-4">
    <h2 class="text-lg font-bold mb-4 text-gray-800 dark:text-white">User Management</h2>
    <table class="min-w-full bg-white dark:bg-gray-900 border rounded shadow">
      <thead>
        <tr>
          <th class="px-4 py-2 text-left">Email</th>
          <th class="px-4 py-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user._id">
          <td class="px-4 py-2">
            <div v-if="editId === user._id">
              <input v-model="editEmail" class="border px-2 py-1 rounded" />
              <div class="mt-2">
                <input v-model="editPassword" type="password" placeholder="New password" class="border px-2 py-1 rounded" />
                <button @click="changePassword(user._id)" class="bg-green-500 text-white px-2 py-1 rounded ml-2">Change Password</button>
              </div>
            </div>
            <div v-else>
              {{ user.emails[0]?.address }}
            </div>
          </td>
          <td class="px-4 py-2">
            <div v-if="editId === user._id">
              <button @click="updateUser(user._id)" class="bg-blue-500 text-white px-2 py-1 rounded mr-2">Save</button>
              <button @click="cancelEdit" class="bg-gray-300 px-2 py-1 rounded">Cancel</button>
            </div>
            <div v-else>
              <button @click="startEdit(user)" class="bg-yellow-400 text-white px-2 py-1 rounded mr-2">Edit</button>
              <button @click="deleteUser(user._id)" class="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
            </div>
          </td>
        </tr>
        <tr v-if="users.length === 0">
          <td colspan="2" class="px-4 py-2 text-center text-gray-500">No users found.</td>
        </tr>
      </tbody>
    </table>
    <div v-if="alert" class="mt-4 text-center text-red-500">{{ alert }}</div>
  </section>
</template>

<script>
import { Meteor } from 'meteor/meteor';

export default {
  name: "UserManagement",
  data() {
    return {
      users: [],
      editId: null,
      editEmail: "",
      editPassword: "",
      alert: "",
      usersSub: null,
    };
  },
  methods: {
    fetchUsers() {
      Meteor.call("users.list", (err, res) => {
        if (!err) {
          this.users = res || [];
        }
      });
    },
    startEdit(user) {
      this.editId = user._id;
      this.editEmail = user.emails[0]?.address || "";
      this.editPassword = "";
    },
    cancelEdit() {
      this.editId = null;
      this.editEmail = "";
      this.editPassword = "";
    },
    updateUser(userId) {
      if (!this.editEmail) {
        this.alert = "Email cannot be empty.";
        return;
      }
      Meteor.call("users.updateEmail", { userId, email: this.editEmail }, (err) => {
        if (err) {
          this.alert = err.reason || "Update failed";
        } else {
          this.alert = "User updated successfully.";
          this.editId = null;
          this.editEmail = "";
          this.fetchUsers();
        }
      });
    },
    changePassword(userId) {
      if (!this.editPassword) {
        this.alert = "Password cannot be empty.";
        return;
      }
      Meteor.call("users.changePassword", { userId, newPassword: this.editPassword }, (err) => {
        if (err) {
          this.alert = err.reason || "Password change failed";
        } else {
          this.alert = "Password changed successfully.";
          this.editPassword = "";
        }
      });
    },
    deleteUser(userId) {
      if (confirm("Are you sure you want to delete this user?")) {
        Meteor.call("users.remove", { userId }, (err) => {
          if (err) {
            this.alert = err.reason || "Delete failed";
          } else {
            this.alert = "User deleted.";
            this.fetchUsers();
          }
        });
      }
    },
  },
  mounted() {
    this.usersSub = Meteor.subscribe('users.all', {
      onReady: () => this.fetchUsers()
    });
  },
  beforeDestroy() {
    if (this.usersSub) this.usersSub.stop();
  }
};
</script>

<style scoped>
/* ...existing code or add your styles here... */
</style>
