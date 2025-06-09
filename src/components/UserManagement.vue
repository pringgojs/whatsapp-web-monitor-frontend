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
    <!-- Local delete confirmation modal removed, now handled by global dialog -->
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { API_BASE_URL } from "../config";
import { notification } from "../composables/useNotification";
import { useDialog } from "../composables/useDialog";

const users = ref([]);
const newUser = ref({ email: "", password: "", role: "" });
const editUserId = ref("");
const editUser = ref({ email: "", role: "" });
// Removed: showDeleteConfirm, deleteUserId, deleteUserEmail

const { openDialog } = useDialog();

const fetchUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok && data.users) {
      users.value = data.users;
    } else {
      notification("error", data.error || "Gagal memuat user.");
    }
  } catch (e) {
    notification("error", "Gagal memuat user.");
  }
};

const validateEmail = (email) => /.+@.+\..+/.test(email);

const addUser = async () => {
  // Validasi
  if (!validateEmail(newUser.value.email)) {
    notification("error", "Format email tidak valid.");
    return;
  }
  if (!newUser.value.password || newUser.value.password.length < 6) {
    notification("error", "Password minimal 6 karakter.");
    return;
  }
  if (!newUser.value.role) {
    notification("error", "Role wajib dipilih.");
    return;
  }
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
      notification("success", "User berhasil ditambahkan.");
      newUser.value = { email: "", password: "", role: "" };
      fetchUsers();
    } else {
      notification("error", data.error || "Gagal menambah user.");
    }
  } catch (e) {
    notification("error", "Gagal menambah user.");
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
  // Validasi
  if (!validateEmail(editUser.value.email)) {
    notification("error", "Format email tidak valid.");
    return;
  }
  if (!editUser.value.role) {
    notification("error", "Role wajib dipilih.");
    return;
  }
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
      notification("success", "User berhasil diupdate.");
      editUserId.value = "";
      fetchUsers();
    } else {
      notification("error", data.error || "Gagal update user.");
    }
  } catch (e) {
    notification("error", "Gagal update user.");
  }
};

function confirmDeleteUser(user) {
  openDialog({
    title: "Konfirmasi Hapus User",
    description: `Yakin ingin menghapus user <b>${user.email}</b>?`,
    onYes: async () => {
      await doDeleteUser(user.id);
    },
    onClose: () => {},
    yes: "Ya, Hapus",
    no: "Batal",
    html: true,
  });
}

const doDeleteUser = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) {
      notification("success", "User berhasil dihapus.");
      fetchUsers();
    } else {
      notification("error", data.error || "Gagal menghapus user.");
    }
  } catch (e) {
    notification("error", "Gagal menghapus user.");
  }
};

onMounted(fetchUsers);
</script>
