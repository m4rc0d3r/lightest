<script setup lang="ts">
import { iife, isObject } from "@lightest/core";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RouterLink2 } from "@/components/ui/router-link-2";
import { injectDiContainer } from "@/features/di";
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
const authStore = useAuthStore();

const { tsRestClient } = injectDiContainer();
const { mutate: register, isPending: isRegisterPending } = tsRestClient.auth.register.useMutation();

async function onSubmit(e?: Event) {
  await form.handleSubmit((values) => {
    register(
      {
        body: values,
      },
      {
        onSuccess: ({ body: { payload } }) => {
          authStore.login(payload);
          toast.success("Successful registration");
          void router.push("/");
        },
        onError: (error) => {
          toast.error("Failed to register", {
            description: iife(() => {
              const MESSAGE = "message";
              const { body } = error;

              if (isObject(body) && MESSAGE in body && typeof body[MESSAGE] === "string") {
                return body[MESSAGE];
              }

              return "Something went wrong";
            }),
          });
        },
      },
    );
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
        <Button type="submit" :disabled="isRegisterPending">Register</Button>
      </form>
    </CardContent>
    <CardFooter class="justify-center">
      <p><RouterLink2 to="/login">Log in</RouterLink2>&nbsp;to an existing account</p>
    </CardFooter>
  </Card>
</template>
