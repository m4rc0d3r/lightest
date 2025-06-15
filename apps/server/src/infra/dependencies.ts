import type { Fn } from "@lightest/core";
import { TypeGuard } from "@lightest/core";
import type {
  AwilixContainer,
  BuildResolver,
  BuildResolverOptions,
  Constructor,
  DisposableResolver,
} from "awilix";
import { asClass, asFunction, asValue, createContainer, Lifetime } from "awilix";
import { AwilixManager } from "awilix-manager";
import { drizzle } from "drizzle-orm/node-postgres";
import type { CookieOptions } from "express";

import type { Config } from "./config";

import type { AuthTokenPayload } from "~/features/auth";
import { BlobService, VercelBlobStorageProvider } from "~/features/blob";
import { CryptoService, generateSafeUid } from "~/features/crypto";
import { EmailTemplateService, PugTemplateEngine } from "~/features/email-template";
import { BcryptHashProvider, HashingService } from "~/features/hashing";
import { generateJwt, JwtService, verifyJwt } from "~/features/jwt";
import { MailService as MailService2, NodemailerApi } from "~/features/mail";
import type { UserRepository } from "~/features/user";
import { DrizzleUserRepository, UserService as UserService2 } from "~/features/user";

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
  userService2: UserService2;
  userRepository: UserRepository;
  authTokenService: JwtService<AuthTokenPayload>;
  passwordHashingService: HashingService;
  blobService: BlobService;
  mailService2: MailService2;
  cryptoService: CryptoService;
  emailTemplateService: EmailTemplateService;
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
    cookie: { domain, secure },
    server: { protocol },
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
      sameSite: "strict",
      secure: secure === "auto" ? protocol === "http" : secure,
      signed: true,
    }),
    db: asValue(db),
    authTokenService: asFunction(() => {
      const {
        auth: {
          jwt: {
            access: { secret, lifetime },
          },
        },
      } = config;
      return new JwtService<AuthTokenPayload>(secret, lifetime, generateJwt, verifyJwt);
    }),
    passwordHashingService: asValue(
      (() => {
        const {
          bcrypt: { roundsForPasswordHash },
        } = config;
        return new HashingService(
          BcryptHashProvider.createDataHasher(roundsForPasswordHash),
          BcryptHashProvider.compareHashData,
        );
      })(),
    ),
    blobService: asValue(
      (() => {
        const {
          vercel: { blobReadWriteToken },
        } = config;
        return new BlobService(new VercelBlobStorageProvider(blobReadWriteToken));
      })(),
    ),
    mailService2: asValue(
      (() => {
        const api = new NodemailerApi(config.mail);
        void api.asyncInit();
        return new MailService2(api);
      })(),
    ),
    cryptoService: asValue(new CryptoService(generateSafeUid)),
    emailTemplateService: asValue(new EmailTemplateService(new PugTemplateEngine())),
    ...Object.fromEntries(
      (
        [
          ["userService2", UserService2],
          ["userRepository", DrizzleUserRepository],
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
              TypeGuard.hasMethod(instance, "asyncInit")
                ? async () => (instance as AsyncInit).asyncInit(diContainer)
                : undefined,
            );
          }) satisfies Extract<BuildResolverOptions<T>["asyncInit"], Fn>)
        : TypeGuard.hasMethod(Type.prototype, "asyncInit"),
    asyncDispose:
      typeof asyncDisposeWrapper === "function"
        ? ((async (instance) => {
            await asyncDisposeWrapper(
              instance,
              TypeGuard.hasMethod(instance, "asyncDispose")
                ? async () => (instance as AsyncDispose).asyncDispose()
                : undefined,
            );
          }) satisfies Extract<BuildResolverOptions<T>["asyncDispose"], Fn>)
        : TypeGuard.hasMethod(Type.prototype, "asyncDispose"),
    ...opts_,
  });
}

export { configureDependencies };
export type { AsyncDispose, AsyncInit, Dependencies };
