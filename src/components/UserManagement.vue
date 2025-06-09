<template>
  <div
    class="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg"
  >
    <h2 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
      Manajemen User
    </h2>
    <form @submit.prevent="addUser" class="flex flex-col gap-3 mb-6">
      <input
        v-model="newUser.email"
        type="email"
        placeholder="Email"
        required
        class="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
      />
      <input
        v-model="newUser.password"
        type="password"
        placeholder="Password"
        required
        class="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
      />
      <select
        v-model="newUser.role"
        required
        class="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
      >
        <option value="">Pilih Role</option>
        <option value="admin">Admin</option>
        <option value="user">User</option>
      </select>
      <button
        type="submit"
        class="py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors"
      >
        Tambah User
      </button>
      <div v-if="addError" class="text-red-500 mt-2">{{ addError }}</div>
      <div v-if="addSuccess" class="text-emerald-600 mt-2">
        {{ addSuccess }}
      </div>
    </form>
    <h3 class="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">
      Daftar User
    </h3>
    <table
      class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 mb-4"
    >
      <thead class="bg-gray-100 dark:bg-gray-800">
        <tr>
          <th
            class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200"
          >
            Email
          </th>
          <th
            class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200"
          >
            Role
          </th>
          <th
            class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200"
          >
            Aksi
          </th>
        </tr>
      </thead>
      <tbody
        class="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800"
      >
        <tr v-for="user in users" :key="user.id">
          <td class="px-4 py-2 text-gray-900 dark:text-white">
            <template v-if="editUserId === user.id">
              <input
                v-model="editUser.email"
                type="email"
                class="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </template>
            <template v-else>{{ user.email }}</template>
          </td>
          <td class="px-4 py-2 text-gray-900 dark:text-white">
            <template v-if="editUserId === user.id">
              <select
                v-model="editUser.role"
                class="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </template>
            <template v-else>{{ user.role }}</template>
          </td>
          <td class="px-4 py-2 text-gray-900 dark:text-white">
            <template v-if="editUserId === user.id">
              <button
                @click="saveEditUser(user.id)"
                class="px-2 py-1 bg-emerald-600 text-white rounded font-semibold hover:bg-emerald-700 mr-1"
              >
                Simpan
              </button>
              <button
                @click="cancelEditUser"
                class="px-2 py-1 bg-gray-500 text-white rounded font-semibold hover:bg-gray-700"
              >
                Batal
              </button>
            </template>
            <template v-else>
              <button
                @click="startEditUser(user)"
                class="px-2 py-1 bg-yellow-500 text-white rounded font-semibold hover:bg-yellow-600 mr-1"
              >
                Edit
              </button>
              <button
                @click="confirmDeleteUser(user)"
                class="px-2 py-1 bg-red-500 text-white rounded font-semibold hover:bg-red-700"
              >
                Hapus
              </button>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 min-w-[300px] text-center relative"
      >
        <h3 class="text-lg font-semibold mb-4">Konfirmasi Hapus User</h3>
        <p class="mb-4">
          Yakin ingin menghapus user <b>{{ deleteUserEmail }}</b
          >?
        </p>
        <div class="flex gap-2 justify-center">
          <button
            @click="doDeleteUser"
            class="px-4 py-2 bg-red-500 text-white rounded font-semibold hover:bg-red-700 transition"
          >
            Ya, Hapus
          </button>
          <button
            @click="showDeleteConfirm = false"
            class="px-4 py-2 bg-gray-500 text-white rounded font-semibold hover:bg-gray-700 transition"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { API_BASE_URL } from "../config";

const users = ref([]);
const newUser = ref({ email: "", password: "", role: "" });
const addError = ref("");
const addSuccess = ref("");
const editUserId = ref("");
const editUser = ref({ email: "", role: "" });
const showDeleteConfirm = ref(false);
const deleteUserId = ref("");
const deleteUserEmail = ref("");

const fetchUsers = async () => {
  addError.value = "";
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok && data.users) {
      users.value = data.users;
    } else {
      addError.value = data.error || "Gagal memuat user.";
    }
  } catch (e) {
    addError.value = "Gagal memuat user.";
  }
};

const addUser = async () => {
  addError.value = "";
  addSuccess.value = "";
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newUser.value),
    });
    const data = await res.json();
    if (res.ok) {
      addSuccess.value = "User berhasil ditambahkan.";
      newUser.value = { email: "", password: "", role: "" };
      fetchUsers();
    } else {
      addError.value = data.error || "Gagal menambah user.";
    }
  } catch (e) {
    addError.value = "Gagal menambah user.";
  }
};

function startEditUser(user) {
  editUserId.value = user.id;
  editUser.value = { email: user.email, role: user.role };
}
function cancelEditUser() {
  editUserId.value = "";
  editUser.value = { email: "", role: "" };
}
const saveEditUser = async (id) => {
  addError.value = "";
  addSuccess.value = "";
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editUser.value),
    });
    const data = await res.json();
    if (res.ok) {
      addSuccess.value = "User berhasil diupdate.";
      editUserId.value = "";
      fetchUsers();
    } else {
      addError.value = data.error || "Gagal update user.";
    }
  } catch (e) {
    addError.value = "Gagal update user.";
  }
};
function confirmDeleteUser(user) {
  showDeleteConfirm.value = true;
  deleteUserId.value = user.id;
  deleteUserEmail.value = user.email;
}
const doDeleteUser = async () => {
  addError.value = "";
  addSuccess.value = "";
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/users/${deleteUserId.value}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) {
      addSuccess.value = "User berhasil dihapus.";
      showDeleteConfirm.value = false;
      fetchUsers();
    } else {
      addError.value = data.error || "Gagal menghapus user.";
    }
  } catch (e) {
    addError.value = "Gagal menghapus user.";
  }
};

onMounted(fetchUsers);
</script>
