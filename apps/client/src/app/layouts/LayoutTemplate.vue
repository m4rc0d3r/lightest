<script setup lang="ts"></script>

<template>
  <div class="flex h-full flex-col">
    <header class="border-b px-4 py-2">
      <slot />
    </header>
    <main class="flex grow">
      <RouterView />
    </main>
  </div>
</template>
