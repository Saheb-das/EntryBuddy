// internal import
import { z } from "zod";
import { registerSchema, loginSchema } from "../zod/auth";
import { userSchema } from "../zod/user";
import { visitorSchema } from "../zod/visitor";

// register user type
type TRegisterUser = z.infer<typeof registerSchema>;
type TLoginUser = z.infer<typeof loginSchema>;

// user created by loggedIn user
type TUserInput = z.infer<typeof userSchema>;

// visitor type
type TVisitorInput = z.infer<typeof visitorSchema>;

// export
export { TRegisterUser, TLoginUser, TUserInput, TVisitorInput };
