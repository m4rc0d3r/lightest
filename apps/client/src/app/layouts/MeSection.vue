<script setup lang="ts">
import { Str } from "@lightest/core";
import { ref, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import UserAvatar from "./UserAvatar.vue";

import { useAuthStore } from "@/entities/auth";
import { injectDiContainer } from "@/features/di";
import { Tk } from "@/shared/i18n";
import { ROUTES } from "@/shared/routing";
import { EMPTY_ARGS } from "@/shared/ts-rest";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Skeleton } from "@/shared/ui/skeleton";

const router = useRouter();
const { t } = useI18n();

const authStore = useAuthStore();

const { tsRestClient } = injectDiContainer();
const {
  data: me,
  isError: isMeError,
  isPending: isMePending,
} = tsRestClient.user.getMe.useQuery(["user", "getMe"], EMPTY_ARGS, {
  retry: false,
});
const { mutate: logout, isPending: isLogoutPending } = tsRestClient.auth.logout.useMutation();

const fullName = ref(Str.EMPTY);

watchEffect(() => {
  if (me.value?.body.me) {
    const { firstName, lastName } = me.value?.body.me;
    fullName.value =
      [firstName, lastName].join(Str.SPACE).trim() || Str.capitalize(t(Tk.name_not_specified));
  }
});

watchEffect(() => {
  if (isMeError.value) {
    authStore.isAuthenticated = false;
  }
});

function onLogout() {
  logout(
    {},
    {
      onSuccess: () => {
        authStore.isAuthenticated = false;
        toast.success(Str.capitalize(t(Tk.logout_completed_successfully)));
        void router.push(ROUTES.home);
      },
      onError: () => {
        toast.error(Str.capitalize(t(Tk.failed_to_log_out)));
      },
    },
  );
}
</script>

<template>
  <div>
    <p v-if="isMeError">Error</p>
    <Skeleton v-else-if="isMePending" class="h-6 w-32" />
    <DropdownMenu v-else>
      <DropdownMenuTrigger as-child>
        <Button variant="ghost">
          <UserAvatar :user="me?.body.me!" />
          {{ fullName }}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem :disabled="isLogoutPending" @select="onLogout">{{
          Str.capitalize($t(Tk.logout))
        }}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
