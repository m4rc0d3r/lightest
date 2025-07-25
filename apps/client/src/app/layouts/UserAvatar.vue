<script setup lang="ts">
import { Str } from "@lightest/core";
import { User } from "lucide-vue-next";

import { Tk } from "@/shared/i18n";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { cn } from "@/shared/ui/utils";

type User = {
  firstName: string;
  lastName: string;
  avatar: string;
};

type Props = {
  user: User;
  imageClass?: string | undefined;
  avatarFallbackText?: string | undefined;
};

const props = defineProps<Props>();

function getInitials() {
  const { firstName, lastName } = props.user;
  return [firstName, lastName].map((value) => value.charAt(0).toLocaleUpperCase()).join(Str.EMPTY);
}
</script>

<template>
  <Avatar>
    <AvatarImage
      :src="user.avatar"
      :alt="avatarFallbackText ?? Str.capitalize($t(Tk.user_avatar))"
      :class="cn('object-cover', props.imageClass)"
    />
    <AvatarFallback>
      <template v-if="getInitials().length > 0">{{ getInitials() }}</template>
      <User v-else class="size-3/4" />
    </AvatarFallback>
  </Avatar>
</template>
