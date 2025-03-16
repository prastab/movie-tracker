<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getAllUserRatings, deleteRating } from "../../lib/api";
import RatingStars from "../../components/RatingStars.vue";

const router = useRouter();
const movies = ref([]);
const isLoading = ref(true);
const error = ref("");

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const fetchRatedMovies = async () => {
    try {
        const ratings = await getAllUserRatings();

        // Fetch movie details from TMDB for each rated movie
        const movieDetails = await Promise.all(
            ratings.map(async (rating) => {
                const response = await fetch(
                    `https://api.themoviedb.org/3/movie/${rating.movie_id}?api_key=${API_KEY}`,
                );
                const data = await response.json();
                return {
                    ...data,
                    userRating: rating.rating,
                    ratedAt: rating.created_at,
                    poster_path: data.poster_path
                        ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
                        : null,
                };
            }),
        );

        movies.value = movieDetails;
    } catch (e) {
        error.value = "Failed to load rated movies";
    } finally {
        isLoading.value = false;
    }
};

const handleRemoveRating = async (movieId: number) => {
    try {
        await deleteRating(movieId);
        movies.value = movies.value.filter((movie) => movie.id !== movieId);
    } catch (e) {
        console.error("Failed to remove rating:", e);
    }
};

const navigateToMovie = (movieId: number) => {
    router.push(`/movies/${movieId}`);
};

onMounted(fetchRatedMovies);
</script>

<template>
    <div class="container mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                My Ratings
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
                @click="fetchRatedMovies"
                class="mt-4 text-primary hover:text-primary/90"
            >
                Try Again
            </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="movies.length === 0" class="text-center py-12">
            <p class="text-gray-600 dark:text-gray-300 text-lg mb-4">
                You haven't rated any movies yet
            </p>
            <router-link
                to="/"
                class="text-primary hover:text-primary/90 font-medium"
            >
                Discover movies to rate
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
                        :src="movie.poster_path"
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
                        class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-3"
                    >
                        <span>{{
                            new Date(movie.release_date).getFullYear()
                        }}</span>
                        <div class="flex items-center gap-1">
                            <span class="text-yellow-400">★</span>
                            {{ Math.round(movie.vote_average * 10) / 10 }}
                        </div>
                    </div>

                    <div class="flex items-center justify-between mb-3">
                        <RatingStars
                            v-model="movie.userRating"
                            size="sm"
                            disabled
                        />
                    </div>

                    <div class="mt-4 flex justify-between items-center">
                        <span class="text-sm text-gray-500 dark:text-gray-400">
                            Rated
                            {{ new Date(movie.ratedAt).toLocaleDateString() }}
                        </span>
                        <button
                            @click="handleRemoveRating(movie.id)"
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
