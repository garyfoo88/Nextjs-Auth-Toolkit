"use server";

import { signIn } from "@/auth";
import { CustomAuthorizeError } from "@/auth.config";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schema";
import { AuthError } from "next-auth";
import { z } from "zod";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validateFields = LoginSchema.safeParse(values);
  if (validateFields.error) return { error: "Invalid fields" };

  const { email, password } = validateFields.data;
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof CustomAuthorizeError) {
      if (error.code === "Invalid Credentials")
        return { error: "Invalid credentials" };
      return { error: "Something went wrong!" };
    }

    throw error;
  }
};
