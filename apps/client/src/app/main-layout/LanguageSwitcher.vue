<script setup lang="ts">
import { AVAILABLE_LOCALES } from "@/shared/i18n";
import { capitalize } from "@/shared/str";
import { isOneOf } from "@/shared/type-guard";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline">
        {{ $t($i18n.locale).toLocaleUpperCase() }}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56">
      <DropdownMenuRadioGroup v-model="$i18n.locale">
        <DropdownMenuRadioItem
          v-for="locale in $i18n.availableLocales"
          :key="locale"
          :value="locale"
        >
          {{
            capitalize(
              $t(
                isOneOf(
                  locale,
                  Object.keys(AVAILABLE_LOCALES) as (keyof typeof AVAILABLE_LOCALES)[],
                )
                  ? AVAILABLE_LOCALES[locale]
                  : locale,
                1,
                {
                  locale,
                },
              ),
            )
          }}
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
