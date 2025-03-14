import { ref } from "vue";

interface MovieSearchResult {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  vote_average: number;
}

export function useMovieSearch() {
  const searchResults = ref<MovieSearchResult[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const searchMovies = async (query: string) => {
    if (!query.trim()) {
      searchResults.value = [];
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=false`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }

      const data = await response.json();
      searchResults.value = data.results.slice(0, 5).map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        release_date: movie.release_date,
        poster_path: movie.poster_path
          ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
          : null,
        vote_average: movie.vote_average,
      }));
    } catch (e) {
      error.value = e instanceof Error ? e.message : "An error occurred";
      searchResults.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  return {
    searchResults,
    isLoading,
    error,
    searchMovies,
  };
}
