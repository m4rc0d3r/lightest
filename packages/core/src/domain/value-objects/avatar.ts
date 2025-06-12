import { z } from "zod";

import { zUrlOrEmptyStr } from "~/zod";

const zAvatarAsFile = z.instanceof(File);

const zAvatar = zUrlOrEmptyStr;
type Avatar = z.infer<typeof zAvatar>;

export { zAvatar, zAvatarAsFile };
export type { Avatar };
