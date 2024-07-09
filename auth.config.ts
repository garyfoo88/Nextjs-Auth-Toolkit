import bcrypt from "bcryptjs";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { AuthError, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./schema";
import { getUserByEmail } from "./data/user";

export class CustomAuthorizeError extends AuthError {
  code = "Invalid Credentials";
}

export default {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Google,
    Credentials({
      async authorize(credentials): Promise<any> {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const user = await getUserByEmail(email);
          if (!user || !user.password) throw new CustomAuthorizeError();
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
          throw new CustomAuthorizeError();
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
