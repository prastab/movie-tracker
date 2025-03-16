<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../../stores/auth";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const error = ref("");
const isLoading = ref(false);

async function handleLogin() {
    error.value = "";
    isLoading.value = true;

    try {
        await authStore.login(email.value, password.value);
        const redirectPath = route.query.redirect?.toString() || "/";
        router.push(redirectPath);
    } catch (e) {
        error.value = "Invalid email or password";
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>
    <div
        class="flex min-h-[80vh] items-center justify-center bg-gray-50 dark:bg-gray-900"
    >
        <div
            class="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"
        >
            <div>
                <h2
                    class="text-center text-3xl font-bold text-gray-900 dark:text-white"
                >
                    Sign in to your account
                </h2>
            </div>

            <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
                <div class="space-y-4 rounded-md">
                    <div>
                        <label
                            for="email"
                            class="block text-sm font-medium text-gray-700 dark:text-gray-200"
                        >
                            Email address
                        </label>
                        <input
                            id="email"
                            v-model="email"
                            type="email"
                            required
                            class="mt-1 block w-full rounded-md border border-gray-300 bg-gray-200 focus:bg-gray-50 px-3 py-2 text-gray-700 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm dark:bg-gray-700 dark:border-gray-900 dark:text-white dark:placeholder-gray-500"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label
                            for="password"
                            class="block text-sm font-medium text-gray-700 dark:text-gray-200"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            v-model="password"
                            type="password"
                            required
                            class="mt-1 block w-full rounded-md border border-gray-300 bg-gray-200 focus:bg-gray-50 px-3 py-2 text-gray-700 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm dark:bg-gray-700 dark:border-gray-900 dark:text-white dark:placeholder-gray-500"
                            placeholder="Enter your password"
                        />
                    </div>
                </div>

                <div v-if="error" class="text-red-500 text-sm text-center">
                    {{ error }}
                </div>

                <button
                    type="submit"
                    :disabled="isLoading"
                    class="group relative flex w-full justify-center rounded-md bg-blue-600 hover:bg-blue-700 py-2 px-4 text-sm font-medium text-white dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span v-if="isLoading">Signing in...</span>
                    <span v-else>Sign in</span>
                </button>

                <div class="text-sm text-center">
                    <router-link
                        to="/register"
                        class="font-medium text-black hover:text-black/50 dark:text-primary hover:dark:text-primary/90"
                    >
                        Don't have an account? Sign up
                    </router-link>
                </div>
            </form>
        </div>
    </div>
</template>
