<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "../../stores/auth";
import { useTheme } from "../../composables/useTheme";
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import SearchDropdown from "../SearchDropDown.vue";

const { isDark, toggleTheme } = useTheme();

const authStore = useAuthStore();
const router = useRouter();
const searchQuery = ref("");
const searchRef = ref(null);
const searchDropdownRef = ref(null);

const handleSearch = (e?: Event) => {
    e?.preventDefault();
    if (searchQuery.value.trim()) {
        router.push({
            name: "search",
            query: { q: searchQuery.value.trim() },
        });
        searchQuery.value = "";
        if (searchDropdownRef.value) {
            searchDropdownRef.value.showDropdown = false; // Remove .value here
        }
    }
};

const handleClickOutside = (event: MouseEvent) => {
    if (searchRef.value && !searchRef.value.contains(event.target)) {
        if (searchDropdownRef.value) {
            searchDropdownRef.value.showDropdown = false; // Remove .value here
        }
    }
};
const handleFocus = () => {
    if (searchDropdownRef.value) {
        searchDropdownRef.value.showDropdown = true;
    }
};
// Compute the display name from the email
const userDisplayName = computed(() => {
    try {
        if (!authStore.user?.email) return "Profile";
        return authStore.user.email.split("@")[0];
    } catch (error) {
        console.error("Display name error:", error);
        return "";
    }
});

onMounted(() => {
    document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
});
</script>
<template>
    <header
        class="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-600"
    >
        <div class="max-w-7xl m-0 px-4 sm:px-6 lg:px-8">
            <div class="h-16 flex items-center justify-between">
                <!-- Logo -->
                <router-link
                    to="/"
                    class="text-2xl font-bold text-red-600 hover:text-red-500 transition-colors"
                >
                    MovieTracker
                </router-link>
                <div class="flex-1 max-w-xl mx-4 relative" ref="searchRef">
                    <form @submit.prevent="handleSearch" class="relative">
                        <input
                            v-model="searchQuery"
                            type="search"
                            placeholder="Search movies..."
                            class="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-full pl-4 pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 border border-gray-200 dark:border-gray-700"
                            @focus="handleFocus"
                        />
                        <button
                            type="submit"
                            class="absolute right-0 top-0 h-full px-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors focus:outline-none rounded-r-full flex items-center justify-center hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="2"
                                stroke="currentColor"
                                class="w-5 h-5"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                />
                            </svg>
                        </button>
                    </form>

                    <!-- Search Dropdown -->
                    <SearchDropdown
                        ref="searchDropdownRef"
                        v-model="searchQuery"
                        @search="handleSearch"
                    />
                </div>
                <!-- Right side navigation -->
                <div class="flex flex-row items-center gap-6">
                    <!-- Theme Toggle -->
                    <div>
                        <button
                            @click="toggleTheme"
                            class="relative w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
                            aria-label="Toggle theme"
                        >
                            <!-- Sun icon -->
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="absolute inset-0 w-5 h-5 m-auto text-yellow-500 transition-transform duration-500"
                                :class="
                                    !isDark
                                        ? 'rotate-0 opacity-100'
                                        : 'rotate-90 opacity-0'
                                "
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                />
                            </svg>

                            <!-- Moon icon -->
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="absolute inset-0 w-5 h-5 m-auto text-gray-700 dark:text-gray-200 transition-transform duration-500"
                                :class="
                                    !isDark
                                        ? 'rotate-90 opacity-0'
                                        : 'rotate-0 opacity-100'
                                "
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                />
                            </svg>
                        </button>
                        <span
                            class="inset-0 rounded-full blur-sm opacity-0 hover:opacity-30 transition-opacity duration-200"
                            :class="
                                isDark ? 'bg-blue-500/20' : 'bg-yellow-500/20'
                            "
                        ></span>
                    </div>
                    <!-- Auth Links -->
                    <div class="flex flex-row items-center gap-4">
                        <template v-if="authStore.isAuthenticated">
                            <router-link
                                to="/watchlist"
                                class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Watchlist
                            </router-link>
                            <router-link
                                to="/ratings"
                                class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                My Ratings
                            </router-link>

                            <!-- User Menu Dropdown -->
                            <router-link
                                to="/profile"
                                class="flex items-center gap-2 px-3 py-2 rounded-md text-lg font-medium text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                            >
                                <span class="capitalize">{{
                                    userDisplayName
                                }}</span>
                            </router-link>
                        </template>
                        <template v-else>
                            <router-link
                                to="/login"
                                class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Login
                            </router-link>
                            <router-link
                                to="/register"
                                class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                            >
                                Register
                            </router-link>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- Spacer -->
    <div class="h-16"></div>
</template>

<style scoped>
.capitalize {
    text-transform: capitalize;
}
</style>
