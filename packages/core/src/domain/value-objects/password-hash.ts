import z from "zod";

const zPasswordHash = z.string().trim().nonempty();

export { zPasswordHash };
