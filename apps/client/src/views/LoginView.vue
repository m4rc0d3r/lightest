<template>
  <div>
    <LoginForm />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import LoginForm from "@/components/auth/LoginForm.vue";

export default defineComponent({
  components: {
    LoginForm,
  },
});
</script>

<style scoped></style>
