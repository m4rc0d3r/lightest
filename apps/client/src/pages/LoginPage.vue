<script setup lang="ts">
import { Contract, Str } from "@lightest/core";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";
import type { z } from "zod";
import { RouterLink, useRouter } from "vue-router";

import { useAuthStore } from "@/entities/auth";
import { injectDiContainer } from "@/features/di";
import { Tk } from "@/shared/i18n";
import { ROUTES } from "@/shared/routing";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";

type FieldMeta = {
  labelTk: Tk;
};

const FIELD_META = {
  email: {
    labelTk: "email",
  },
  password: {
    labelTk: "password",
  },
} satisfies Partial<Record<keyof Schema, FieldMeta>>;

const router = useRouter();
const { t } = useI18n();

const authStore = useAuthStore();

const { tsRestClient } = injectDiContainer();
const { mutate: login, isPending: isLoginPending } = tsRestClient.auth.login.useMutation();

const zSchema = Contract.contract.auth.login.body;
type Schema = z.infer<typeof zSchema>;
const validationSchema = toTypedSchema(zSchema);

const form = useForm({
  validationSchema,
  initialValues: Object.fromEntries(
    Object.keys(zSchema.keyof().Enum).map((key) => [key, Str.EMPTY]),
  ),
});

const onSubmit = form.handleSubmit((values) => {
  login(
    {
      body: values,
    },
    {
      onSuccess: () => {
        authStore.isAuthenticated = true;
        toast.success(Str.capitalize(t(Tk.login_completed_successfully)));
        void router.push(ROUTES.home);
      },
      onError: () => {
        toast.error(Str.capitalize(t(Tk.failed_to_log_in)));
      },
    },
  );
});
</script>

<template>
  <div class="flex grow py-16">
    <Card class="m-auto min-w-1/2">
      <CardHeader class="text-center">
        <CardTitle>{{ Str.capitalize($t(Tk["login.noun"])) }}</CardTitle>
        <CardDescription>{{
          Str.capitalize($t(Tk.log_in_to_your_account_to_access_test_management))
        }}</CardDescription>
      </CardHeader>
      <CardContent>
        <form class="flex flex-col gap-4" @submit="onSubmit">
          <FormField
            v-for="[name, { labelTk }] in Object.entries(FIELD_META)"
            :key="name"
            v-slot="{ componentField }"
            :name
          >
            <FormItem>
              <FormLabel>{{ Str.capitalize($t(labelTk)) }}</FormLabel>
              <FormControl>
                <Input :type="name === 'password' ? 'password' : 'text'" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <Button type="submit" :disabled="isLoginPending">
            {{ Str.capitalize($t(Tk["login.verb"])) }}
          </Button>
        </form>
      </CardContent>
      <CardFooter class="justify-center">
        <p class="text-center">
          {{ [Str.capitalize($t(Tk.don_t_have_an_account)), Str.QUESTION_MARK].join(Str.EMPTY) }}
          <Button as-child variant="link" size="auto">
            <RouterLink :to="ROUTES.register">{{ Str.capitalize($t(Tk.create)) }}</RouterLink>
          </Button>
        </p>
      </CardFooter>
    </Card>
  </div>
</template>
