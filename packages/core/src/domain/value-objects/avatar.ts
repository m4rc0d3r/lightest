import { z } from "zod";

import { MimeType } from "~/file";
import { File as ZodFile, zUrlOrEmptyStr } from "~/zod";

const zAvatarAsFile = z
  .instanceof(File)
  .superRefine(
    ZodFile.REFINEMENTS.isOneOf([MimeType.gif, MimeType.jpeg, MimeType.png, MimeType.svg]),
  );

const zAvatar = zUrlOrEmptyStr;
type Avatar = z.infer<typeof zAvatar>;

export { zAvatar, zAvatarAsFile };
export type { Avatar };
