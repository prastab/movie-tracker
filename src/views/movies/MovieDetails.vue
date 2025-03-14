<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import {
    addToWatchlist,
    removeFromWatchlist,
    getWatchlistStatus,
} from "../../lib/api";
import { useAuthStore } from "../../stores/auth";
import { getUserRating, rateMovie, deleteRating } from "../../lib/api";
import RatingStars from "../../components/RatingStars.vue";

const route = useRoute();
const authStore = useAuthStore();
const movie = ref<any>(null);
const cast = ref<any[]>([]);
const similarMovies = ref<any[]>([]);
const isLoading = ref(true);
const error = ref("");
const userRating = ref(0);
const isUpdatingRating = ref(false);
const ratingError = ref("");
const isInWatchlist = ref(false);
const isUpdatingWatchlist = ref(false);

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const checkWatchlistStatus = async (movieId: string) => {
    if (!authStore.isAuthenticated) return;

    try {
        const status = await getWatchlistStatus(Number(movieId));
        isInWatchlist.value = status;
    } catch (e) {
        console.error("Error checking watchlist status:", e);
    }
};

const toggleWatchlist = async () => {
    if (!authStore.isAuthenticated || !movie.value) return;

    isUpdatingWatchlist.value = true;
    try {
        if (isInWatchlist.value) {
            await removeFromWatchlist(movie.value.id);
            isInWatchlist.value = false;
        } else {
            await addToWatchlist(movie.value.id);
            isInWatchlist.value = true;
        }
    } catch (e) {
        console.error("Error updating watchlist:", e);
    } finally {
        isUpdatingWatchlist.value = false;
    }
};

const fetchMovieDetails = async (movieId: string) => {
    try {
        const [movieResponse, creditsResponse, similarResponse] =
            await Promise.all([
                fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`),
                fetch(
                    `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`,
                ),
                fetch(
                    `${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}`,
                ),
            ]);

        const movieData = await movieResponse.json();
        const creditsData = await creditsResponse.json();
        const similarData = await similarResponse.json();

        movie.value = {
            ...movieData,
            poster_path: `https://image.tmdb.org/t/p/w342${movieData.poster_path}`,
        };
        cast.value = creditsData.cast.slice(0, 8);
        similarMovies.value = similarData.results
            .slice(0, 4)
            .map((movie: any) => ({
                ...movie,
                poster_path: `https://image.tmdb.org/t/p/w185${movie.poster_path}`,
            }));
    } catch (e) {
        error.value = "Failed to load movie details. Please try again.";
    } finally {
        isLoading.value = false;
    }
};
const handleRating = async (newRating: number) => {
    if (!authStore.isAuthenticated || !movie.value) return;

    isUpdatingRating.value = true;
    ratingError.value = "";

    try {
        if (newRating === 0) {
            await deleteRating(movie.value.id);
        } else {
            await rateMovie(movie.value.id, newRating);
        }
        userRating.value = newRating;
    } catch (e) {
        console.error("Rating error:", e);
        ratingError.value = "Failed to update rating";
        // Revert to previous rating on error
        userRating.value = props.modelValue;
    } finally {
        isUpdatingRating.value = false;
    }
};
const handleRemoveRating = async () => {
    if (!authStore.isAuthenticated || !movie.value) return;

    isUpdatingRating.value = true;
    ratingError.value = "";

    try {
        await deleteRating(movie.value.id);
        userRating.value = 0;
    } catch (e) {
        console.error("Rating removal error:", e);
        ratingError.value = "Failed to remove rating";
    } finally {
        isUpdatingRating.value = false;
    }
};
onMounted(async () => {
    const movieId = route.params.id as string;
    if (movieId) {
        await Promise.all([
            fetchMovieDetails(movieId),
            checkWatchlistStatus(movieId),
            authStore.isAuthenticated &&
                getUserRating(Number(movieId)).then(
                    (data) => (userRating.value = data.rating),
                ),
        ]);
    }
});
watch(
    () => route.params.id,
    async (newId) => {
        if (newId) {
            isLoading.value = true;
            await Promise.all([
                fetchMovieDetails(newId as string),
                checkWatchlistStatus(newId as string),
            ]);
            window.scrollTo(0, 0);
        }
    },
);
</script>
<template>
    <div
        class="relative min-h-screen bg-gray-900 bg-background text-foreground"
    >
        <!-- Backdrop Image -->
        <div
            class="absolute top-0 left-0 w-full h-screen z-10"
            v-if="movie?.backdrop_path"
        >
            <img
                :src="`https://image.tmdb.org/t/p/original${movie.backdrop_path}`"
                alt="backdrop"
                class="w-full h-full object-cover"
            />
            <div
                class="absolute inset-0 bg-gradient-to-b from-[rgba(20,20,20,0.75)] to-[#141414]"
            ></div>
        </div>

        <!-- Loading State -->
        <div
            v-if="isLoading"
            class="flex items-center justify-center min-h-screen"
        >
            <div
                class="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"
            ></div>
        </div>

        <!-- Error State -->
        <div
            v-else-if="error"
            class="flex flex-col items-center justify-center min-h-screen gap-4"
        >
            <p class="text-lg">{{ error }}</p>
            <button
                @click="fetchMovieDetails(route.params.id)"
                class="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
                Try Again
            </button>
        </div>

        <!-- Movie Content -->
        <div v-else class="relative z-20 max-w-[1400px] mx-auto px-5 py-24">
            <!-- Main Movie Info Section -->
            <div
                class="flex flex-col items-center justify-center md:flex-row gap-8 md:gap-12 mb-16"
            >
                <div class="mx-auto md:mx-0 md:flex-shrink-0">
                    <img
                        :src="movie.poster_path"
                        :alt="movie.title"
                        class="w-full md:w-[400px] rounded-2xl shadow-2xl border-4 border-white/30"
                    />
                </div>

                <div class="flex-grow pt-5">
                    <h1
                        class="text-4xl md:text-5xl font-bold mb-6 leading-tight text-center"
                    >
                        {{ movie.title }}
                    </h1>

                    <div
                        class="flex items-center justify-center gap-3 text-lg mb-6"
                    >
                        <span class="text-sm text-muted-foreground">
                            {{ new Date(movie.release_date).getFullYear() }}
                        </span>
                        <span class="text-gray-500">•</span>
                        <span
                            >{{ Math.floor(movie.runtime / 60) }}h
                            {{ movie.runtime % 60 }}m</span
                        >
                        <span class="text-gray-500">•</span>
                        <div class="flex items-center gap-1">
                            <span class="text-yellow-400">★</span>
                            {{ Math.round(movie.vote_average * 10) / 10 }}
                        </div>
                    </div>

                    <div class="flex flex-wrap justify-center gap-2 mb-8">
                        <span
                            v-for="genre in movie.genres"
                            :key="genre.id"
                            class="bg-muted/10 px-4 py-1.5 rounded-full text-sm"
                        >
                            {{ genre.name }}
                        </span>
                    </div>

                    <p
                        class="text-lg leading-relaxed text-muted-foreground max-w-3xl mb-8"
                    >
                        {{ movie.overview }}
                    </p>

                    <div
                        class="flex flex-col md:flex-row items-center gap-6 justify-center"
                    >
                        <div class="flex items-center gap-4">
                            <span class="text-gray-300">Rate:</span>
                            <RatingStars
                                v-model="userRating"
                                size="lg"
                                :disabled="isUpdatingRating"
                                @update:modelValue="handleRating"
                                :show-remove-button="true"
                                @remove="handleRemoveRating"
                            />
                            <span
                                v-if="ratingError"
                                class="text-red-500 text-sm"
                            >
                                {{ ratingError }}
                            </span>
                        </div>
                        <div class="flex items-center gap-4">
                            <button
                                v-if="authStore.isAuthenticated"
                                @click="toggleWatchlist"
                                :disabled="isUpdatingWatchlist"
                                class="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span class="text-lg font-bold">{{
                                    isInWatchlist ? "✓" : "+"
                                }}</span>
                                {{
                                    isInWatchlist
                                        ? "In Watchlist"
                                        : "Add to Watchlist"
                                }}
                            </button>

                            <router-link
                                v-else
                                to="/login"
                                class="flex items-center gap-2 bg-white-600 hover:bg-white-700 px-6 py-3 rounded-xl font-semibold transition-colors"
                            >
                                Login to add to watchlist
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Cast Section -->
            <section v-if="cast.length" class="mb-16">
                <h2 class="text-3xl font-semibold mb-8">Top Cast</h2>
                <div
                    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 md:gap-8"
                >
                    <div
                        v-for="person in cast"
                        :key="person.id"
                        class="group transition-transform hover:-translate-y-1"
                    >
                        <div
                            class="aspect-square rounded-full overflow-hidden mb-3"
                        >
                            <img
                                v-if="person.profile_path"
                                :src="`https://image.tmdb.org/t/p/w200${person.profile_path}`"
                                :alt="person.name"
                                class="w-full h-full object-cover"
                            />
                            <div
                                v-else
                                class="w-full h-full bg-gray-700 flex items-center justify-center text-3xl"
                            >
                                {{ person.name[0] }}
                            </div>
                        </div>
                        <div class="text-center">
                            <h3 class="font-semibold mb-1">
                                {{ person.name }}
                            </h3>
                            <p class="text-sm text-gray-400">
                                {{ person.character }}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Similar Movies Section -->
            <section v-if="similarMovies.length" class="mb-16">
                <h2 class="text-3xl font-semibold mb-8">Similar Movies</h2>
                <div
                    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
                >
                    <div
                        v-for="movie in similarMovies"
                        :key="movie.id"
                        @click="$router.push(`/movies/${movie.id}`)"
                        class="cursor-pointer group transition-transform hover:-translate-y-1"
                    >
                        <img
                            :src="movie.poster_path"
                            :alt="movie.title"
                            class="w-full aspect-[2/3] rounded-xl mb-3"
                        />
                        <div>
                            <h3 class="font-semibold mb-1">
                                {{ movie.title }}
                            </h3>
                            <span class="text-sm text-gray-400">
                                {{ new Date(movie.release_date).getFullYear() }}
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<style>
/* Add these styles if needed */
.dark .bg-gradient-overlay {
    background: linear-gradient(to bottom, rgba(20, 20, 20, 0.8), #141414);
}

.light .bg-gradient-overlay {
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.8), #ffffff);
}
</style>
