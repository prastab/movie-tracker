<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const searchResults = ref([]);
const isLoading = ref(false);
const error = ref("");

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const searchMovies = async (query: string) => {
    if (!query) return;

    isLoading.value = true;
    error.value = "";

    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
                query,
            )}`,
        );
        const data = await response.json();
        searchResults.value = data.results.map((movie: any) => ({
            ...movie,
            poster_path: movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : null,
        }));
    } catch (e) {
        error.value = "Failed to search movies";
        console.error(e);
    } finally {
        isLoading.value = false;
    }
};

const navigateToMovie = (movieId: number) => {
    router.push(`/movies/${movieId}`);
};

// Watch for query changes
watch(
    () => route.query.q,
    (newQuery) => {
        if (newQuery) {
            searchMovies(newQuery.toString());
        }
    },
    { immediate: true },
);
</script>

<template>
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-8">
            Search Results for "{{ route.query.q }}"
        </h1>

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
        </div>

        <!-- No Results -->
        <div v-else-if="searchResults.length === 0" class="text-center py-12">
            <p class="text-gray-600 dark:text-gray-300">
                No movies found for your search
            </p>
        </div>

        <!-- Results Grid -->
        <div
            v-else
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
            <div
                v-for="movie in searchResults"
                :key="movie.id"
                class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group cursor-pointer"
                @click="navigateToMovie(movie.id)"
            >
                <div class="relative aspect-[2/3]">
                    <img
                        v-if="movie.poster_path"
                        :src="movie.poster_path"
                        :alt="movie.title"
                        class="w-full h-full object-cover"
                    />
                    <div
                        v-else
                        class="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
                    >
                        No Image
                    </div>
                </div>
                <div class="p-4">
                    <h3 class="font-semibold mb-2">{{ movie.title }}</h3>
                    <div class="flex justify-between text-sm text-gray-500">
                        <span>{{
                            new Date(movie.release_date).getFullYear()
                        }}</span>
                        <div class="flex items-center">
                            <span class="text-yellow-400 mr-1">★</span>
                            {{ Math.round(movie.vote_average * 10) / 10 }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
