<script setup lang="ts">
import { Contract, Domain, File as FileModule, Str } from "@lightest/core";
import { toTypedSchema } from "@vee-validate/zod";
import { Trash, User } from "lucide-vue-next";
import type { ComponentFieldBindingObject } from "vee-validate";
import { useForm } from "vee-validate";
import { useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";
import type { z } from "zod";

import { useAuthStore } from "@/entities/auth";
import { injectDiContainer } from "@/features/di";
import { Tk } from "@/shared/i18n";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";

type FieldMeta = {
  labelTk: Tk;
};

const FIELD_META = {
  firstName: {
    labelTk: "first_name",
  },
  lastName: {
    labelTk: "last_name",
  },
  email: {
    labelTk: "email",
  },
  password: {
    labelTk: "password",
  },
} satisfies Partial<Record<keyof Schema, FieldMeta>>;

const { t } = useI18n();

const authStore = useAuthStore();

const { tsRestClient } = injectDiContainer();
const { mutate: register, isPending: isRegisterPending } = tsRestClient.auth.register.useMutation();

const zSchema = Contract.contract.auth.register.body;
type Schema = z.infer<typeof zSchema>;
const validationSchema = toTypedSchema(zSchema);

const form = useForm({
  validationSchema,
  initialValues: Object.fromEntries(
    Object.keys(zSchema.keyof().Enum).map((key) => [key, Str.EMPTY]),
  ),
});

const onSubmit = form.handleSubmit((values) => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(values)) {
    formData.set(key, value);
  }

  register(
    {
      body: formData,
    },
    {
      onSuccess: () => {
        authStore.isAuthenticated = true;
        toast.success(Str.capitalize(t(Tk.registration_successfully_completed)));
      },
      onError: () => {
        toast.error(Str.capitalize(t(Tk.failed_to_register)));
      },
    },
  );
});

const AVATAR_KEY: Extract<keyof Schema, "avatar"> = "avatar";

const avatarInput = useTemplateRef("avatar-input");
const avatarInputAccept = Object.values(Domain.User.Attribute.Avatar.FILE_CONSTRAINTS.mimeType)
  .map((value) => FileModule.ExtensionByMimeType[value])
  .join(Str.COMMA_WITH_SPACE);

function getAvatarSource(componentField: ComponentFieldBindingObject) {
  return componentField.modelValue instanceof File
    ? URL.createObjectURL(componentField.modelValue)
    : componentField.modelValue;
}

function clearAvatar() {
  form.setFieldValue(AVATAR_KEY, Str.EMPTY);
  if (avatarInput.value) {
    avatarInput.value.value = Str.EMPTY;
  }
}

function onAvatarInputChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    form.setFieldValue(AVATAR_KEY, file);
  }
}
</script>

<template>
  <div class="flex grow py-16">
    <Card class="m-auto min-w-1/2">
      <CardHeader class="text-center">
        <CardTitle>{{ Str.capitalize($t(Tk.registration)) }}</CardTitle>
        <CardDescription>{{
          Str.capitalize($t(Tk.create_an_account_to_be_able_to_create_and_manage_your_own_tests))
        }}</CardDescription>
      </CardHeader>
      <CardContent>
        <form class="flex flex-col gap-4" @submit="onSubmit">
          <FormField v-slot="{ componentField }" :name="AVATAR_KEY">
            <FormItem>
              <FormLabel class="justify-center">{{ Str.capitalize($t(Tk.avatar)) }}</FormLabel>
              <FormControl>
                <div class="group relative place-self-center p-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="auto"
                    :disabled="isRegisterPending"
                    class="rounded-full p-2"
                    @click="avatarInput?.click()"
                  >
                    <img
                      v-if="componentField.modelValue"
                      :src="getAvatarSource(componentField)"
                      :alt="Str.capitalize($t(Tk.avatar))"
                      class="size-18 rounded-full object-cover"
                    />
                    <User v-else class="size-18" />
                  </Button>
                  <Button
                    v-if="componentField.modelValue"
                    variant="destructive"
                    size="icon"
                    :disabled="isRegisterPending"
                    class="absolute top-0 right-0 hidden rounded-full group-hover:inline-flex"
                    @click="clearAvatar"
                  >
                    <Trash />
                  </Button>
                  <input
                    ref="avatar-input"
                    type="file"
                    class="hidden"
                    :accept="avatarInputAccept"
                    @change="onAvatarInputChange"
                  />
                </div>
              </FormControl>
              <FormDescription class="text-center">{{
                avatarInputAccept.toLocaleUpperCase()
              }}</FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
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
          <Button type="submit" :disabled="isRegisterPending">
            {{ Str.capitalize($t(Tk.register)) }}
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
