import { Contract } from "@lightest/core";
import { function as function_, taskEither } from "fp-ts";

import { NotFoundError } from "~/app";
import { getUserFromRequest, server, unexpectedError } from "~/infra/ts-rest";

const router: ReturnType<typeof server.router<typeof Contract.contract.user>> = server.router(
  Contract.contract.user,
  {
    getMe: async ({ req }) => {
      const { userService } = req.container.cradle;

      const { id } = getUserFromRequest(req);

      const searchResult = await function_.pipe(
        userService.getById({ id }),
        taskEither.map(({ passwordHash, verificationCode, updatedAt, ...me }) => me),
        taskEither.toUnion,
      )();

      if (searchResult instanceof Error) {
        if (searchResult instanceof NotFoundError)
          return { status: 404, body: { area: "NOT_FOUND", ...searchResult } };

        return unexpectedError();
      }

      return {
        status: 200,
        body: {
          me: searchResult,
        },
      };
    },
  },
);

export { router };
