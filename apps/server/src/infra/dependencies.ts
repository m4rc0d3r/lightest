import { hasMethod } from "@lightest/core";
import type {
  AwilixContainer,
  BuildResolver,
  BuildResolverOptions,
  Constructor,
  DisposableResolver,
} from "awilix";
import { asClass, asValue, createContainer, Lifetime } from "awilix";
import { AwilixManager } from "awilix-manager";
import { drizzle } from "drizzle-orm/node-postgres";
import type { CookieOptions } from "express";

import type { Config } from "./config";

import type { DAO } from "~/daos/app/dao";
import { PostgresDAO } from "~/daos/postgres/dao";
import { AuthService } from "~/services/auth-service";
import { MailService } from "~/services/mail-service";
import { SessionService } from "~/services/session-service";
import { TestService } from "~/services/test-service";
import { TokenService } from "~/services/token-service";
import { UserService } from "~/services/user-service";
import type { AnyFn } from "~/types/utility";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface AsyncInit {
  asyncInit(diContainer: AwilixContainer): Promise<unknown>;
}
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface AsyncDispose {
  asyncDispose(): Promise<unknown>;
}

type Dependencies = {
  config: Config;
  logger: typeof logger;
  defaultCookieOptions: CookieOptions;
  db: ReturnType<typeof drizzle>;
  dao: DAO;
  authService: AuthService;
  mailService: MailService;
  sessionService: SessionService;
  testService: TestService;
  tokenService: TokenService;
  userService: UserService;
};
const logger = {
  log: (message: string) => console.log(message),
};

function configureDependencies(config: Config) {
  const { databaseUrl, casing } = config.drizzle;
  const db = drizzle({
    connection: databaseUrl,
    casing,
  });

  const {
    cookie: { domain, sameSite, secure },
  } = config;

  const diContainer = createContainer<Dependencies>({
    injectionMode: "CLASSIC",
    strict: true,
  }).register({
    config: asValue(config),
    logger: asValue(logger),
    defaultCookieOptions: asValue({
      domain,
      httpOnly: true,
      path: "/",
      sameSite,
      secure,
      signed: true,
    }),
    db: asValue(db),
    ...Object.fromEntries(
      (
        [
          ["dao", PostgresDAO],
          ["authService", AuthService],
          ["mailService", MailService],
          ["sessionService", SessionService],
          ["testService", TestService],
          ["tokenService", TokenService],
          ["userService", UserService],
        ] as [string, Constructor<object>][]
      ).map(([key, value]) => [
        key,
        asClass2(value, {
          lifetime: Lifetime.SINGLETON,
          asyncInitWrapper: async (_instance, _diContainer, asyncInit) => {
            const startTime = performance.now();
            await asyncInit?.();
            logger.log(createLifecycleMessage(value, "INIT", performance.now() - startTime));
          },
          asyncDisposeWrapper: async (_instance, asyncDispose) => {
            const startTime = performance.now();
            await asyncDispose?.();
            logger.log(createLifecycleMessage(value, "DISPOSE", performance.now() - startTime));
          },
        }),
      ]),
    ),
  });

  const awilixManager = new AwilixManager({
    diContainer,
    asyncInit: true,
    asyncDispose: true,
    strictBooleanEnforced: true,
  });

  return { awilixManager, diContainer };
}

function createLifecycleMessage(
  value: Constructor<unknown> | string,
  lifeStage: "INIT" | "DISPOSE",
  elapsedTime: number,
) {
  return `An instance of '${typeof value === "string" ? value : value.name}' was ${lifeStage === "INIT" ? "initialized" : "disposed"} in ${Math.round(elapsedTime)} ms.`;
}

function asClass2<T = object>(
  Type: Constructor<T>,
  opts?: Omit<BuildResolverOptions<T>, "asyncInit" | "asyncDispose"> & {
    asyncInitWrapper?:
      | (<U extends T>(
          instance: U,
          diContainer: AwilixContainer,
          asyncInit?: () => Promise<unknown>,
        ) => Promise<unknown>)
      | undefined;
    asyncDisposeWrapper?:
      | (<U extends T>(instance: U, asyncDispose?: () => Promise<unknown>) => Promise<unknown>)
      | undefined;
  },
): BuildResolver<T> & DisposableResolver<T> {
  const { asyncInitWrapper, asyncDisposeWrapper, ...opts_ } = opts ?? {};

  return asClass(Type, {
    asyncInit:
      typeof asyncInitWrapper === "function"
        ? ((async (instance, diContainer) => {
            await asyncInitWrapper(
              instance,
              diContainer,
              hasMethod(instance, "asyncInit")
                ? async () => (instance as AsyncInit).asyncInit(diContainer)
                : undefined,
            );
          }) satisfies Extract<BuildResolverOptions<T>["asyncInit"], AnyFn>)
        : hasMethod(Type.prototype, "asyncInit"),
    asyncDispose:
      typeof asyncDisposeWrapper === "function"
        ? ((async (instance) => {
            await asyncDisposeWrapper(
              instance,
              hasMethod(instance, "asyncDispose")
                ? async () => (instance as AsyncDispose).asyncDispose()
                : undefined,
            );
          }) satisfies Extract<BuildResolverOptions<T>["asyncDispose"], AnyFn>)
        : hasMethod(Type.prototype, "asyncDispose"),
    ...opts_,
  });
}

export { configureDependencies };
export type { AsyncDispose, AsyncInit, Dependencies };
