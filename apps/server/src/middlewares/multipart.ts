import type { Request, RequestHandler } from "express";
import multer from "multer";

import { isObject } from "~/shared";

function multipartMiddleware() {
  return [
    multer().any(),
    (req, _res, next) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { body, files } = req;

      if (!(isObject(body) && Array.isArray(files))) return next();

      const groupedFiles = Object.groupBy(files, ({ fieldname }) => fieldname);

      const bodyAsRecord = body as Record<string, unknown>;

      for (const [fieldname, files] of Object.entries(groupedFiles)) {
        if (!files) continue;

        if (files.length === 1) {
          const [file] = files;
          if (!file) continue;

          bodyAsRecord[fieldname] = createFileFromMulterFile(file);
        } else {
          bodyAsRecord[fieldname] = files.map(createFileFromMulterFile);
        }
      }

      next();
    },
  ] as RequestHandler[];
}

function createFileFromMulterFile({
  buffer,
  mimetype,
  originalname,
}: NonNullable<Request["file"]>) {
  return new File([buffer], originalname, {
    type: mimetype,
  });
}

export { multipartMiddleware };
