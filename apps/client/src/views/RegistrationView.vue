<template>
  <div>
    <RegistrationForm />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import RegistrationForm from "@/components/auth/RegistrationForm.vue";

export default defineComponent({
  components: {
    RegistrationForm,
  },
});
</script>

<style scoped></style>
