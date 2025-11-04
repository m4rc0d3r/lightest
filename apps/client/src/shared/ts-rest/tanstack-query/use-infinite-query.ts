import type {
  QueryFunction,
  QueryFunctionContext,
  QueryKey,
  UseInfiniteQueryOptions,
  UseInfiniteQueryReturnType,
} from "@tanstack/vue-query";
import { useInfiniteQuery } from "@tanstack/vue-query";
import type {
  AppRoute,
  AppRouteMutation,
  ClientArgs,
  ClientInferRequest,
  PartialClientInferRequest,
} from "@ts-rest/core";

import type { DataResponse, ErrorResponse } from "./common";
import { queryFn } from "./common";

// Used on X.useInfiniteQuery
type DataReturnInfiniteQuery<TAppRoute extends AppRoute, TClientArgs extends ClientArgs> = <
  TData = DataResponse<TAppRoute>,
>(
  queryKey: QueryKey,
  args: (context: QueryFunctionContext) => PartialClientInferRequest<TAppRoute, TClientArgs>,
  options?: UseInfiniteQueryOptions<DataResponse<TAppRoute>, ErrorResponse<TAppRoute>, TData>,
) => UseInfiniteQueryReturnType<TData, ErrorResponse<TAppRoute>>;

const getRouteUseInfiniteQuery =
  <TAppRoute extends AppRoute, TClientArgs extends ClientArgs>(
    route: TAppRoute,
    clientArgs: TClientArgs,
  ) =>
  (
    queryKey: QueryKey,
    argsMapper: (context: QueryFunctionContext) => ClientInferRequest<AppRouteMutation, ClientArgs>,
    options?: UseInfiniteQueryOptions<DataResponse<TAppRoute>>,
  ) => {
    const dataFn: QueryFunction<DataResponse<TAppRoute>> = async (context) => {
      const resultingQueryArgs = argsMapper(context);

      const innerDataFn = queryFn(route, clientArgs, resultingQueryArgs);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
      return innerDataFn(undefined as any);
    };

    return useInfiniteQuery({
      queryKey,
      // @ts-expect-error This is a complex type, let it remain as is.
      queryFn: dataFn,
      ...options,
    });
  };

export { getRouteUseInfiniteQuery };
export type { DataReturnInfiniteQuery };
