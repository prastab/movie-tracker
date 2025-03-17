<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getWatchlistMovies, removeFromWatchlist } from "../../lib/api";
import { useRouter } from "vue-router";
import type { WatchlistMovie } from "../../types/movie";

const router = useRouter();
const movies = ref<WatchlistMovie[]>([]);
const isLoading = ref(true);
const error = ref("");

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// Fetch watchlist movies and their details from TMDB
const fetchWatchlistMovies = async () => {
    try {
        const watchlistMovies = await getWatchlistMovies();

        // Fetch movie details from TMDB for each movie in watchlist
        const movieDetails = await Promise.all(
            watchlistMovies.map(async (movie: WatchlistMovie) => {
                const response = await fetch(
                    `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}`,
                );
                const data = await response.json();
                return {
                    ...data,
                    addedAt: movie.addedAt,
                    poster_path: data.poster_path
                        ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
                        : null,
                } as WatchlistMovie;
            }),
        );

        movies.value = movieDetails;
    } catch (e) {
      console.log(e);
        error.value = "Failed to load watchlist";
    } finally {
        isLoading.value = false;
    }
};

const handleRemoveMovie = async (movieId: number) => {
    try {
        await removeFromWatchlist(movieId);
        movies.value = movies.value.filter((movie) => movie.id !== movieId);
    } catch (e) {
        console.error("Failed to remove movie:", e);
    }
};

const navigateToMovie = (movieId: number) => {
    router.push(`/movies/${movieId}`);
};

onMounted(fetchWatchlistMovies);
</script>

<template>
    <div class="container mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                My Watchlist
            </h1>
        </div>

        <!-- Loading State -->
        <div
            v-if="isLoading"
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
            <div v-for="n in 8" :key="n" class="animate-pulse">
                <div
                    class="aspect-[2/3] bg-gray-200 dark:bg-gray-700 rounded-lg mb-2"
                ></div>
                <div
                    class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"
                ></div>
                <div
                    class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"
                ></div>
            </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
            <p class="text-red-500">{{ error }}</p>
            <button
                @click="fetchWatchlistMovies"
                class="mt-4 text-primary hover:text-primary/90"
            >
                Try Again
            </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="movies.length === 0" class="text-center py-12">
            <p class="text-gray-600 dark:text-gray-300 text-lg mb-4">
                Your watchlist is empty
            </p>
            <router-link
                to="/"
                class="text-primary text-black dark:text-gray-200 hover:text-primary/90 font-medium"
            >
                Discover movies to add
            </router-link>
        </div>

        <!-- Movies Grid -->
        <div
            v-else
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
            <div
                v-for="movie in movies"
                :key="movie.id"
                class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group"
            >
                <!-- Movie Poster -->
                <div
                    class="relative aspect-[2/3] cursor-pointer"
                    @click="navigateToMovie(movie.id)"
                >
                    <img
                        :src="movie.poster_path || undefined"
                        :alt="movie.title"
                        class="w-full h-full object-cover"
                    />
                    <div
                        class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300"
                    ></div>
                </div>

                <!-- Movie Info -->
                <div class="p-4">
                    <h3
                        class="text-lg font-semibold text-gray-900 dark:text-white mb-2 cursor-pointer hover:text-primary"
                        @click="navigateToMovie(movie.id)"
                    >
                        {{ movie.title }}
                    </h3>

                    <div
                        class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400"
                    >
                        <span>{{
                            new Date(movie.release_date).getFullYear()
                        }}</span>
                        <div class="flex items-center gap-1">
                            <span class="text-yellow-400">★</span>
                            {{ Math.round(movie.vote_average * 10) / 10 }}
                        </div>
                    </div>

                    <div class="mt-4 flex justify-between items-center">
                        <span class="text-sm text-gray-500 dark:text-gray-400">
                            Added
                            {{ new Date(movie.addedAt).toLocaleDateString() }}
                        </span>
                        <button
                            @click="handleRemoveMovie(movie.id)"
                            class="text-red-500 hover:text-red-600 transition-colors"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
