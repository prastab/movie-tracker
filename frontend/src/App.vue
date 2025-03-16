<script setup lang="ts">
import { RouterView } from "vue-router";
import Navbar from "./components/layout/Navbar.vue";
</script>

<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header class="fixed top-0 w-full z-50">
            <Navbar />
        </header>
        <main class="pt-16">
            <RouterView v-slot="{ Component }">
                <transition
                    enter-active-class="transition-opacity duration-300"
                    leave-active-class="transition-opacity duration-300"
                    enter-from-class="opacity-0"
                    leave-to-class="opacity-0"
                >
                    <component :is="Component" />
                </transition>
            </RouterView>
        </main>
    </div>
</template>
