<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RouterLink2 } from "@/components/ui/router-link-2";
import { APIError, API_ERROR_CODE } from "@/http/dtos/api-error";
import { Report } from "@/http/dtos/report";
import { Notification, STATUS } from "@/models/notification";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();

const schema = toTypedSchema(
  z.object({
    email: z.string().email(),
    password: z.string().min(6).max(32),
  }),
);

const form = useForm({
  validationSchema: schema,
});
const errors = reactive<Notification[]>([]);
const authStore = useAuthStore();

async function onSubmit(e?: Event) {
  await form.handleSubmit(async ({ email, password }) => {
    const result = await authStore.login(email, password);
    if (result instanceof Report) {
      toast.success(result.message);
      void router.push("/");
    } else if (result instanceof APIError) {
      if (result.code === API_ERROR_CODE.ERR_NETWORK) {
        toast.error(result.message);
      } else {
        errors.splice(
          0,
          errors.length,
          ...result.message.split("\n").map((error) => new Notification(STATUS.FAILURE, error)),
        );
      }
    }
  })(e);
}
</script>

<template>
  <Card>
    <CardContent class="flex flex-col gap-4">
      <form class="flex flex-col items-center gap-4" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder="Email" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type="password" placeholder="Password" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <Button type="submit">Login</Button>
      </form>
      <ul v-if="errors.length > 0">
        <li
          v-for="{ id, message } in errors"
          :key="id"
          class="text-destructive-foreground text-center text-sm"
        >
          <p>{{ message }}</p>
        </li>
      </ul>
    </CardContent>
    <CardFooter class="justify-center">
      <p><RouterLink2 to="/register">Create</RouterLink2>&nbsp;an account</p>
    </CardFooter>
  </Card>
</template>
