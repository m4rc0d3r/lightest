import type { InjectionKey } from "vue";
import { inject } from "vue";

function createOptionalInject<T>(key: InjectionKey<T>) {
  return () => {
    const value = inject(key);

    if (value === undefined) {
      throw new Error(`There is no value provided for the injection key "${key.description}"`);
    }

    return value;
  };
}

export { createOptionalInject };
