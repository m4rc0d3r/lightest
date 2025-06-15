import z from "zod";

const zSchema = z.string().trim().nonempty().base64url();

export { zSchema };
