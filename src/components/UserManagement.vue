<template>
  <div
    class="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800"
  >
    <h2
      class="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center tracking-tight"
    >
      Manajemen User
    </h2>
    <form @submit.prevent="addUser" class="flex flex-col gap-4 mb-8">
      <PrelineInput
        v-model="newUser.email"
        type="email"
        placeholder="Email"
        required
        :error="''"
      />
      <PrelineInput
        v-model="newUser.password"
        type="password"
        placeholder="Password"
        required
        :error="''"
      />
      <div>
        <label class="block mb-1 font-semibold text-gray-700 dark:text-gray-200"
          >Role</label
        >
        <select
          v-model="newUser.role"
          required
          class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          <option value="">Pilih Role</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>
      <button
        type="submit"
        class="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-400 text-white font-semibold transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed mt-2"
      >
        Tambah User
      </button>
    </form>
    <h3 class="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">
      Daftar User
    </h3>
    <div class="overflow-x-auto rounded-xl shadow">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th
              class="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200"
            >
              Email
            </th>
            <th
              class="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200"
            >
              Role
            </th>
            <th
              class="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200"
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
                <PrelineInput
                  v-model="editUser.email"
                  type="email"
                  class="w-full"
                />
              </template>
              <template v-else>{{ user.email }}</template>
            </td>
            <td class="px-4 py-2 text-gray-900 dark:text-white">
              <template v-if="editUserId === user.id">
                <select
                  v-model="editUser.role"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
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
                  class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 transition text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 mr-2"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Simpan
                </button>
                <button
                  @click="cancelEditUser"
                  class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Batal
                </button>
              </template>
              <template v-else>
                <button
                  @click="startEditUser(user)"
                  class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-50 text-yellow-700 border border-yellow-100 hover:bg-yellow-100 transition text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-200 mr-2"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h6v-6l9.293-9.293a1 1 0 00-1.414-1.414L9 9V3H3v6l9.293 9.293a1 1 0 001.414-1.414L5.232 5.232z"
                    />
                  </svg>
                  Edit
                </button>
                <button
                  @click="confirmDeleteUser(user)"
                  class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-100 hover:bg-red-100 transition text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-red-200"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Hapus
                </button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Modal Konfirmasi Hapus User -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div
        class="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 min-w-[340px] w-full max-w-xs flex flex-col items-center border border-gray-100 dark:border-gray-800"
      >
        <button
          @click="showDeleteConfirm = false"
          class="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
          aria-label="Tutup"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <svg
          class="w-12 h-12 text-red-500 mb-2"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="2"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <h3
          class="text-xl font-bold text-gray-700 dark:text-gray-100 text-center mt-2 mb-1"
        >
          Konfirmasi Hapus User
        </h3>
        <p class="text-gray-600 dark:text-gray-300 text-center text-base mb-4">
          Yakin ingin menghapus user <b>{{ deleteUserEmail }}</b
          >?
        </p>
        <div class="flex gap-3 justify-center mt-2 w-full">
          <button
            @click="doDeleteUser"
            class="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition text-base shadow focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Ya, Hapus
          </button>
          <button
            @click="showDeleteConfirm = false"
            class="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold transition text-base shadow focus:outline-none focus:ring-2 focus:ring-gray-300"
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
import { notification } from "../composables/useNotification";
import PrelineInput from "./_PrelineInput.vue";

const users = ref([]);
const newUser = ref({ email: "", password: "", role: "" });
const editUserId = ref("");
const editUser = ref({ email: "", role: "" });
const showDeleteConfirm = ref(false);
const deleteUserId = ref("");
const deleteUserEmail = ref("");

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
  showDeleteConfirm.value = true;
  deleteUserId.value = user.id;
  deleteUserEmail.value = user.email;
}
const doDeleteUser = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/users/${deleteUserId.value}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) {
      notification("success", "User berhasil dihapus.");
      showDeleteConfirm.value = false;
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
