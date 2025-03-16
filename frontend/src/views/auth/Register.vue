<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const error = ref("");
const isLoading = ref(false);

async function handleRegister() {
    error.value = "";

    if (password.value !== confirmPassword.value) {
        error.value = "Passwords do not match";
        return;
    }

    if (!email.value || !password.value) {
        error.value = "Please fill in all fields";
        return;
    }

    isLoading.value = true;

    try {
        await authStore.register(email.value, password.value);
        router.push("/");
    } catch (e: any) {
        error.value = e.toString();
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>
    <div class="flex min-h-[80vh] items-center justify-center">
        <div
            class="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"
        >
            <div>
                <h2
                    class="text-center text-3xl font-bold text-gray-900 dark:text-white"
                >
                    Create your account
                </h2>
            </div>

            <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
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
                            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Create a password"
                        />
                    </div>

                    <div>
                        <label
                            for="confirm-password"
                            class="block text-sm font-medium text-gray-700 dark:text-gray-200"
                        >
                            Confirm Password
                        </label>
                        <input
                            id="confirm-password"
                            v-model="confirmPassword"
                            type="password"
                            required
                            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Confirm your password"
                        />
                    </div>
                </div>

                <div v-if="error" class="text-red-500 text-sm text-center">
                    {{ error }}
                </div>

                <button
                    type="submit"
                    :disabled="isLoading"
                    class="group relative flex w-full justify-center rounded-md bg-primary py-2 px-4 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span v-if="isLoading">Creating account...</span>
                    <span v-else>Create account</span>
                </button>

                <div class="text-sm text-center">
                    <router-link
                        to="/login"
                        class="font-medium text-primary hover:text-primary/90"
                    >
                        Already have an account? Sign in
                    </router-link>
                </div>
            </form>
        </div>
    </div>
</template>
