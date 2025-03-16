<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";

const props = defineProps<{
    modelValue: number;
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    showRemoveButton?: boolean; // New prop
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: number): void;
    (e: "remove"): void; // New emit event
}>();

const authStore = useAuthStore();
const hoverRating = ref(0);

const sizeClasses = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl",
};

const starClass = props.size ? sizeClasses[props.size] : sizeClasses.md;

const handleStarClick = (value: number) => {
    if (props.disabled || !authStore.isAuthenticated) return;
    const newRating = value === props.modelValue ? 0 : value;
    emit("update:modelValue", newRating);
};

const handleRemove = () => {
    emit("remove");
};
</script>

<template>
    <div class="flex items-center gap-1">
        <div class="flex items-center gap-1">
            <button
                v-for="n in 5"
                :key="n"
                type="button"
                :disabled="disabled || !authStore.isAuthenticated"
                class="transition-transform hover:scale-110 bg-transparent border-0 p-0 disabled:cursor-not-allowed"
                :class="[
                    starClass,
                    disabled ? 'cursor-default' : 'cursor-pointer',
                ]"
                @click="handleStarClick(n)"
                @mouseover="hoverRating = n"
                @mouseleave="hoverRating = 0"
            >
                <span
                    :class="[
                        n <= (hoverRating || modelValue)
                            ? 'text-yellow-400'
                            : 'text-gray-400',
                        disabled ? 'opacity-75' : 'opacity-100',
                    ]"
                >
                    ★
                </span>
            </button>
        </div>

        <!-- Remove Rating Button -->
        <button
            v-if="showRemoveButton && modelValue > 0"
            @click="handleRemove"
            :disabled="disabled"
            class="ml-2 text-gray-400 hover:text-red-500 transition-colors bg-transparent border-0 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            :class="[starClass]"
        >
            ×
        </button>
    </div>
</template>
