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
                <component
                  :is="Component"
                  v-if="Component"
                  />
              </RouterView>
        </main>
    </div>
</template>
