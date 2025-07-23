import { z } from "zod";

const zTk = z.enum(["en", "uk", "english", "ukrainian", "main", "about_us"]);
const Tk = zTk.Values;
type Tk = z.infer<typeof zTk>;

export { Tk };
