import type { InjectionKey } from "vue";
import { provide } from "vue";

import type { createTsRestClient } from "@/shared/ts-rest";
import { createOptionalInject } from "@/shared/vue";

type DiContainer = {
  tsRestClient: ReturnType<typeof createTsRestClient>;
};

const DI_CONTAINER_KEY = Symbol("DiContainer") as InjectionKey<DiContainer>;

const injectDiContainer = createOptionalInject(DI_CONTAINER_KEY);

function provideDiContainer(value: DiContainer) {
  provide(DI_CONTAINER_KEY, value);
}

export { injectDiContainer, provideDiContainer };
export type { DiContainer };
