import type { MutationOptions, UseMutationReturnType } from "@tanstack/vue-query";
import { useMutation } from "@tanstack/vue-query";
import type {
  AppRoute,
  AppRouteMutation,
  ClientArgs,
  ClientInferRequest,
  PartialClientInferRequest,
  ZodInferOrType,
} from "@ts-rest/core";

import type { DataResponse, ErrorResponse } from "./common";
import { queryFn } from "./common";

// Used pn X.useMutation
type DataReturnMutation<TAppRoute extends AppRoute, TClientArgs extends ClientArgs> = (
  options?: MutationOptions<
    DataResponse<TAppRoute>,
    ErrorResponse<TAppRoute>,
    PartialClientInferRequest<TAppRoute, TClientArgs>,
    unknown
  >,
) => UseMutationReturnType<
  DataResponse<TAppRoute>,
  ErrorResponse<TAppRoute>,
  PartialClientInferRequest<TAppRoute, TClientArgs>,
  unknown
>;

const getRouteUseMutation =
  <TAppRoute extends AppRoute, TClientArgs extends ClientArgs>(
    route: TAppRoute,
    clientArgs: TClientArgs,
  ) =>
  (options?: MutationOptions<TAppRoute["responses"]>) => {
    const mutationFunction = async (args?: ClientInferRequest<AppRouteMutation, ClientArgs>) => {
      const dataFn = queryFn(route, clientArgs, args);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
      return dataFn(undefined as any);
    };

    return useMutation({
      mutationFn: mutationFunction as () => Promise<ZodInferOrType<TAppRoute["responses"]>>,
      ...options,
    });
  };

export { getRouteUseMutation };
export type { DataReturnMutation };
