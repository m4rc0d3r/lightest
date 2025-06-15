import { Domain } from "~/domain";

const zMe = Domain.User.zSchema.pick({
  id: true,
  firstName: true,
  lastName: true,
  avatar: true,
  email: true,
  createdAt: true,
});

export { zMe };
