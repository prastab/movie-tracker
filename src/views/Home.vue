<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import {
    addToWatchlist as addToWatchlistAPI,
    removeFromWatchlist,
    getWatchlistStatus,
} from "../lib/api";

const router = useRouter();
const authStore = useAuthStore();
const trendingMovies = ref([]);
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const watchlistStatuses = ref(new Map());

const fetchTrendingMovies = async () => {
    try {
        const response = await fetch(
            `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`,
        );
        const data = await response.json();
        trendingMovies.value = data.results;
        if (authStore.isAuthenticated) {
            await fetchWatchlistStatuses();
        }
    } catch (error) {
        console.error("Error fetching trending movies:", error);
    }
};
const fetchWatchlistStatuses = async () => {
    try {
        const statuses = await Promise.all(
            trendingMovies.value.map(async (movie) => {
                const status = await getWatchlistStatus(movie.id);
                return [movie.id, status];
            }),
        );
        watchlistStatuses.value = new Map(statuses);
    } catch (error) {
        console.error("Error fetching watchlist statuses:", error);
    }
};

const addToWatchlist = async (movieId: number) => {
    if (!authStore.isAuthenticated) {
        router.push("/login");
        return;
    }

    try {
        const currentStatus = watchlistStatuses.value.get(movieId);

        if (currentStatus) {
            await removeFromWatchlist(movieId);
        } else {
            await addToWatchlistAPI(movieId);
        }

        // Toggle the status in our local state
        watchlistStatuses.value.set(movieId, !currentStatus);
    } catch (error) {
        console.error("Error updating watchlist:", error);
    }
};

const navigateToMovie = (movieId: number) => {
    router.push(`/movies/${movieId}`);
};

const viewAllMovies = () => {
    router.push("/movies/trending");
};

onMounted(() => {
    fetchTrendingMovies();
});
</script>

<template>
    <div class="movie-page">
        <!-- Header -->
        <div class="header">
            <div class="header-title">
                <span class="star-icon">★</span>
                <h2>Trending Movies</h2>
            </div>
            <button class="view-all-btn" @click="viewAllMovies">
                View All
            </button>
        </div>

        <!-- Movie Grid -->
        <div class="movie-grid">
            <!-- Loading Skeleton -->
            <template v-if="!trendingMovies.length">
                <div v-for="n in 6" :key="n" class="skeleton-card">
                    <div class="skeleton-poster"></div>
                    <div class="skeleton-info">
                        <div class="skeleton-title"></div>
                        <div class="skeleton-details"></div>
                    </div>
                </div>
            </template>

            <!-- Movie Cards -->
            <div
                v-for="movie in trendingMovies"
                :key="movie.id"
                class="movie-card"
                @click="navigateToMovie(movie.id)"
            >
                <div
                    class="watchlist-btn"
                    @click.stop="addToWatchlist(movie.id)"
                >
                    <span
                        class="plus-icon"
                        v-if="!watchlistStatuses.get(movie.id)"
                        >+</span
                    >
                    <span
                        class="check-icon text-green-600 text-xl font-bold"
                        v-else
                        >✓</span
                    >
                </div>
                <img
                    :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
                    :alt="movie.title"
                    class="poster"
                    loading="lazy"
                />
                <div class="movie-info">
                    <h3 class="title">{{ movie.title }}</h3>
                    <div class="details">
                        <span class="year">{{
                            new Date(movie.release_date).getFullYear()
                        }}</span>
                        <div class="rating">
                            <span class="star">★</span>
                            <span class="score">{{
                                Math.round(movie.vote_average * 10) / 10
                            }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
/* Page Container */
.watchlist-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 40px;
    height: 40px;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    line-height: 0;
    opacity: 0;
    visibility: hidden;
}

.movie-card:hover .watchlist-btn {
    opacity: 1;
    visibility: visible;
}
.watchlist-btn:hover {
    background-color: #b4caed;
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.check-icon {
    font-size: 26px;
    font-weight: bold;
    transition: color 0.3s ease;
}

.plus-icon {
    font-size: 32px;
    color: #3b82f6;
    font-weight: bold;
    transition: color 0.3s ease;
    margin-top: -5px;
}
.movie-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

/* Header */
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.header-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.star-icon {
    font-size: 2.5rem;
    color: #facc15;
}

h2 {
    font-size: 2rem;
    font-weight: bold;
    color: #3b82f6;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.view-all-btn {
    padding: 0.75rem 1.5rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.3s ease;
}

.view-all-btn:hover {
    background-color: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);
}

/* Movie Grid */
.movie-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
}
@media (max-width: 1024px) {
    .movie-grid {
        grid-template-columns: repeat(3, 1fr);
    }
    h2 {
        font-size: 2rem;
    }
}
@media (max-width: 768px) {
    .movie-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    h2 {
        font-size: 2rem;
    }
}

@media (max-width: 480px) {
    .movie-grid {
        grid-template-columns: 1fr;
    }
    h2 {
        font-size: 1rem;
    }
}

/* Movie Card */
.movie-card {
    position: relative;
    background-color: #d2d1d1;
    border-radius: 0.75rem;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    flex-direction: column;
    display: flex;
    height: 450px;
    transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;
    z-index: 1;
}

.movie-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.poster {
    height: 100%;
    aspect-ratio: 2 / 3;
    object-fit: cover;
}

.movie-info {
    padding: 0.8rem;
    flex-shrink: 0;
}

.title {
    font-size: 1.3rem;
    font-weight: 600;
    color: #111827;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0.5rem;
}

.details {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.year {
    font-size: 1rem;
    color: #6b7280;
    font-weight: 500;
}

.rating {
    display: flex;
    align-items: center;
    background-color: #fef9c3;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
}

.rating .star {
    color: #facc15;
    font-size: 1rem;
    margin-right: 0.25rem;
}

.score {
    font-size: 1rem;
    color: #854d0e;
    font-weight: 600;
}

/* Skeleton */
.skeleton-card {
    background-color: #e5e7eb;
    border-radius: 0.75rem;
    overflow: hidden;
}

.skeleton-poster {
    width: 100%;
    aspect-ratio: 2 / 3;
    background-color: #d1d5db;
}

.skeleton-info {
    padding: 0.75rem;
}

.skeleton-title {
    height: 1.25rem;
    background-color: #d1d5db;
    border-radius: 0.25rem;
    width: 75%;
    margin-bottom: 0.5rem;
}

.skeleton-details {
    height: 1rem;
    background-color: #d1d5db;
    border-radius: 0.25rem;
    width: 50%;
}
</style>
