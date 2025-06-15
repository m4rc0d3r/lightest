import z from "zod";

import { File as FileModule } from "~/file";
import { Zod } from "~/zod";

const zSchema = Zod.zUrlOrEmptyStr;

const FILE_CONSTRAINTS = {
  mimeType: [
    FileModule.MimeType.gif,
    FileModule.MimeType.jpeg,
    FileModule.MimeType.png,
    FileModule.MimeType.svg,
  ] as const satisfies FileModule.MimeType[],
};

const zFileSchema = z
  .instanceof(File)
  .superRefine(Zod.File.REFINEMENTS.isOneOf(FILE_CONSTRAINTS.mimeType));

export { FILE_CONSTRAINTS, zFileSchema, zSchema };
