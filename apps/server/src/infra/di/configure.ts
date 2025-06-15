import { Str } from "@lightest/core";
import type { Constructor } from "awilix";
import { asValue, createContainer, InjectionMode, Lifetime } from "awilix";
import { AwilixManager } from "awilix-manager";
import { drizzle } from "drizzle-orm/node-postgres";
import { z } from "zod";

import type { Config } from "../config";

import type { Container } from "./container";
import { asClass2, asFunction2 } from "./resolvers";

import { BlobService, VercelBlobStorageProvider } from "~/features/blob";
import { CryptoService, generateSafeUid } from "~/features/crypto";
import { EmailTemplateService, PugTemplateEngine } from "~/features/email-template";
import { BcryptHashProvider, HashingService } from "~/features/hashing";
import { generateJwt, JwtService, verifyJwt } from "~/features/jwt";
import { MailService, NodemailerApi } from "~/features/mail";
import { DrizzleUserRepository, UserService } from "~/features/user";

function configure(config: Config) {
  const {
    auth: {
      jwt: {
        access: { secret, lifetime },
      },
    },
    bcrypt: { roundsForPasswordHash },
    cookie: { domain, secure },
    drizzle: { databaseUrl, casing },
    server: { protocol },
  } = config;

  const logger: Container["logger"] = {
    log: (message) => {
      console.log(message);
    },
  };

  const diContainer = createContainer({
    injectionMode: InjectionMode.CLASSIC,
    strict: true,
  }).register({
    config: asValue(config),
    cookieOptions: asValue({
      domain,
      httpOnly: true,
      path: Str.SLASH,
      sameSite: "strict",
      secure: secure === "auto" ? protocol === "https" : secure,
      signed: true,
    }),
    logger: asValue(logger),
    db: asValue(
      drizzle({
        connection: databaseUrl,
        casing,
      }),
    ),
    generateUid_: asValue(generateSafeUid),
    hashData: asValue(BcryptHashProvider.createDataHasher(roundsForPasswordHash)),
    compareHashWithData: asValue(BcryptHashProvider.compareHashData),
    authTokenService: asFunction2(
      JwtService,
      () => new JwtService(secret, lifetime, generateJwt, verifyJwt),
      {
        lifetime: Lifetime.SINGLETON,
        asyncInitWrapper: async (_instance, _diContainer, asyncInit) => {
          const startTime = performance.now();
          await asyncInit?.();
          logger.log(
            createLifecycleMessage(JwtService, LifeStage.INIT, performance.now() - startTime),
          );
        },
        asyncDisposeWrapper: async (_instance, asyncDispose) => {
          const startTime = performance.now();
          await asyncDispose?.();
          logger.log(
            createLifecycleMessage(JwtService, LifeStage.DISPOSE, performance.now() - startTime),
          );
        },
      },
    ),
    ...Object.fromEntries(
      (
        [
          ["blobStorageProvider", VercelBlobStorageProvider],
          ["blobService", BlobService],

          ["cryptoService", CryptoService],

          ["passwordHashingService", HashingService],

          ["emailTemplateEngine", PugTemplateEngine],
          ["emailTemplateService", EmailTemplateService],

          ["mailApi", NodemailerApi],
          ["mailService", MailService],

          ["userRepository", DrizzleUserRepository],
          ["userService", UserService],
        ] as [string, Constructor<object>][]
      ).map(([key, value]) => [
        key,
        asClass2(value, {
          lifetime: Lifetime.SINGLETON,
          asyncInitWrapper: async (_instance, _diContainer, asyncInit) => {
            const startTime = performance.now();
            await asyncInit?.();
            logger.log(
              createLifecycleMessage(value, LifeStage.INIT, performance.now() - startTime),
            );
          },
          asyncDisposeWrapper: async (_instance, asyncDispose) => {
            const startTime = performance.now();
            await asyncDispose?.();
            logger.log(
              createLifecycleMessage(value, LifeStage.DISPOSE, performance.now() - startTime),
            );
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

const zLifeStage = z.enum(["INIT", "DISPOSE"]);
const LifeStage = zLifeStage.Values;
type LifeStage = z.infer<typeof zLifeStage>;

function createLifecycleMessage(
  value: Constructor<unknown> | string,
  lifeStage: LifeStage,
  elapsedTime: number,
) {
  return `An instance of '${typeof value === "string" ? value : value.name}' was ${lifeStage === LifeStage.INIT ? "initialized" : "disposed"} in ${Math.round(elapsedTime)}ms.`;
}

export { configure };
