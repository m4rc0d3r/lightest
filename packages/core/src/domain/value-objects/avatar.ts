import { z } from "zod";

import { File as FileModule } from "~/file";
import { Zod } from "~/zod";

const { MimeType } = FileModule;
const { File: ZodFile, zUrlOrEmptyStr } = Zod;

const zAvatarAsFile = z
  .instanceof(File)
  .superRefine(
    ZodFile.REFINEMENTS.isOneOf([MimeType.gif, MimeType.jpeg, MimeType.png, MimeType.svg]),
  );

const zAvatar = zUrlOrEmptyStr;
type Avatar = z.infer<typeof zAvatar>;

export { zAvatar, zAvatarAsFile };
export type { Avatar };
