<script setup lang="ts">
import { ref, watch } from "vue";
import { useMovieSearch } from "../composables/useMovieSearch";

const props = defineProps<{
    modelValue: string;
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
    (e: "search"): void;
}>();

defineExpose({
    showDropdown: false,
});

const showDropdown = ref(false);
const { searchResults, isLoading, searchMovies } = useMovieSearch();

// Debounce the search to avoid too many API calls
let debounceTimeout: number;
watch(
    () => props.modelValue,
    (newValue) => {
        clearTimeout(debounceTimeout);
        if (newValue.trim()) {
            debounceTimeout = setTimeout(() => {
                searchMovies(newValue);
            }, 300); // 300ms debounce
        } else {
            searchResults.value = [];
        }
    },
);

const selectMovie = (title: string) => {
    emit("update:modelValue", title);
    showDropdown.value = false;
    emit("search");
};

const formatYear = (dateString: string) => {
    return dateString ? new Date(dateString).getFullYear() : "";
};
</script>

<template>
    <div
        v-if="showDropdown"
        class="absolute w-full mt-2 bg-white dark:bg-gray-900 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700"
    >
        <div v-if="isLoading" class="p-4 text-gray-600 dark:text-gray-400">
            Loading...
        </div>
        <div
            v-else-if="searchResults.length === 0 && modelValue.trim()"
            class="p-4 text-gray-600 dark:text-gray-400"
        >
            No results found
        </div>
        <ul v-else class="max-h-96 overflow-y-auto">
            <li
                v-for="result in searchResults"
                :key="result.id"
                class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex items-center gap-3"
                @click="selectMovie(result.title)"
            >
                <!-- Movie Poster -->
                <div class="flex-shrink-0 w-12 h-18">
                    <img
                        v-if="result.poster_path"
                        :src="result.poster_path"
                        :alt="result.title"
                        class="w-full h-full object-cover rounded"
                    />
                    <div
                        v-else
                        class="w-full h-full bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-gray-500 dark:text-gray-400"
                    >
                        No Image
                    </div>
                </div>

                <!-- Movie Info -->
                <div class="flex-grow">
                    <div class="font-medium text-gray-900 dark:text-white">
                        {{ result.title }}
                    </div>
                    <div
                        class="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2"
                    >
                        <span>{{ formatYear(result.release_date) }}</span>
                        <span class="text-yellow-500 dark:text-yellow-400"
                            >★</span
                        >
                        <span>{{
                            Math.round(result.vote_average * 10) / 10
                        }}</span>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.max-h-96 {
    max-height: 24rem;
}

/* Custom scrollbar for the dropdown */
.overflow-y-auto {
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
    width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background-color: rgba(156, 163, 175, 0.7);
}
</style>
