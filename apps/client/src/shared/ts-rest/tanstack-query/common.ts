import type { QueryFunction, QueryFunctionContext, QueryKey } from "@tanstack/vue-query";
import type {
  AppRoute,
  AppRouteMutation,
  ClientArgs,
  ClientInferRequest,
  ClientInferResponses,
  ErrorHttpStatusCode,
  SuccessfulHttpStatusCode,
} from "@ts-rest/core";
import { evaluateFetchApiArgs, fetchApi, isErrorResponse } from "@ts-rest/core";

// Data response if it's a 2XX
type DataResponse<TAppRoute extends AppRoute> = ClientInferResponses<
  TAppRoute,
  SuccessfulHttpStatusCode,
  "force"
>;

// Error response if it's not a 2XX
type ErrorResponse<TAppRoute extends AppRoute> = ClientInferResponses<
  TAppRoute,
  ErrorHttpStatusCode,
  "ignore"
>;

const queryFn = <TAppRoute extends AppRoute, TClientArgs extends ClientArgs>(
  route: TAppRoute,
  clientArgs: TClientArgs,
  argsMapper?:
    | ClientInferRequest<AppRouteMutation, ClientArgs>
    | ((
        context: QueryFunctionContext<QueryKey>,
      ) => ClientInferRequest<AppRouteMutation, ClientArgs>),
): QueryFunction<DataResponse<TAppRoute>> => {
  return async (queryFnContext: QueryFunctionContext) => {
    const args = typeof argsMapper === "function" ? argsMapper(queryFnContext) : argsMapper;

    const fetchApiArgs = evaluateFetchApiArgs(route, clientArgs, args);
    const result = await fetchApi({
      ...fetchApiArgs,
      fetchOptions: {
        ...(queryFnContext?.signal && { signal: queryFnContext.signal }),
        ...fetchApiArgs.fetchOptions,
      },
    });

    // If the response is not a 2XX, throw an error to be handled by react-query
    if (isErrorResponse(result)) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw result;
    }

    return result as DataResponse<TAppRoute>;
  };
};

export { queryFn };
export type { DataResponse, ErrorResponse };
