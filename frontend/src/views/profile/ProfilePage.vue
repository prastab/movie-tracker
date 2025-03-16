<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "../../stores/auth";
import { getWatchlistMovies, getAllUserRatings } from "../../lib/api";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
const isLoading = ref(false);
const error = ref("");
const success = ref("");

const stats = ref({
    totalMoviesRated: 0,
    watchlistCount: 0,
    averageRating: 0,
});

// Fetch user stats
const fetchUserStats = async () => {
    isLoading.value = true;
    try {
        // Get watchlist and ratings in parallel
        const [watchlistMovies, userRatings] = await Promise.all([
            getWatchlistMovies(),
            getAllUserRatings(),
        ]);

        // Calculate stats
        stats.value = {
            totalMoviesRated: userRatings.length,
            watchlistCount: watchlistMovies.length,
            averageRating:
                userRatings.length > 0
                    ? Number(
                          (
                              userRatings.reduce(
                                  (acc: number, curr: any) => acc + curr.rating,
                                  0,
                              ) / userRatings.length
                          ).toFixed(1),
                      )
                    : 0,
        };
    } catch (e) {
        console.error("Error fetching user stats:", e);
        error.value = "Failed to load user statistics";
    } finally {
        isLoading.value = false;
    }
};
const handleLogout = () => {
    authStore.logout();
    router.push("/login"); // Redirect to login page after logout
};

onMounted(() => {
    if (authStore.isAuthenticated) {
        fetchUserStats();
    } else {
        router.push("/login");
    }
});
onMounted(fetchUserStats);
</script>

<template>
    <div class="container mx-auto px-4 pt-24">
        <div class="max-w-3xl mx-auto">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Profile Settings
            </h1>

            <div
                class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8"
            >
                <h2
                    class="text-xl font-semibold text-gray-900 dark:text-white mb-4"
                >
                    Account Information
                </h2>
                <div class="space-y-4">
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 dark:text-gray-200"
                            >Email</label
                        >
                        <p class="mt-1 text-gray-600 dark:text-gray-300">
                            {{ authStore.user?.email }}
                        </p>
                    </div>

                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 dark:text-gray-200"
                        >
                            Member since
                        </label>
                        <p class="mt-1 text-gray-600 dark:text-gray-300">
                            {{
                                new Date(
                                    authStore.user?.created_at,
                                ).toLocaleDateString()
                            }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Stats Section -->
            <div
                class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8"
            >
                <h2
                    class="text-xl font-semibold text-gray-900 dark:text-white mb-4"
                >
                    Statistics
                </h2>

                <!-- Loading State -->
                <div
                    v-if="isLoading"
                    class="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    <div
                        v-for="i in 3"
                        :key="i"
                        class="text-center animate-pulse"
                    >
                        <div
                            class="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-2"
                        ></div>
                        <div
                            class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"
                        ></div>
                    </div>
                </div>

                <!-- Stats Display -->
                <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="text-center">
                        <p class="text-3xl font-bold text-primary">
                            {{ stats.totalMoviesRated }}
                        </p>
                        <p class="text-gray-600 dark:text-gray-300">
                            Movies Rated
                        </p>
                    </div>
                    <div class="text-center">
                        <p class="text-3xl font-bold text-primary">
                            {{ stats.watchlistCount }}
                        </p>
                        <p class="text-gray-600 dark:text-gray-300">
                            In Watchlist
                        </p>
                    </div>
                    <div class="text-center">
                        <p class="text-3xl font-bold text-primary">
                            {{ stats.averageRating }}/5
                        </p>
                        <p class="text-gray-600 dark:text-gray-300">
                            Average Rating
                        </p>
                    </div>
                </div>
            </div>

            <!-- Error/Success Messages -->
            <div v-if="error" class="text-red-500 text-sm mb-4">
                {{ error }}
            </div>
            <div v-if="success" class="text-green-500 text-sm mb-4">
                {{ success }}
            </div>

            <!-- Logout Button -->
            <div class="flex justify-end">
                <button
                    @click="handleLogout"
                    class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </div>
    </div>
</template>
