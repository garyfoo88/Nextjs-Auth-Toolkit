"use server";

import { signIn } from "@/auth";
import { CustomAuthorizeError } from "@/auth.config";
import { LoginSchema } from "@/schema";
import { z } from "zod";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validateFields = LoginSchema.safeParse(values);
  if (validateFields.error) return { error: "Invalid fields" };

  const { email, password } = validateFields.data;

  try {
    // Disable redirect for this function. signIn uses next redirect and next redirect cannot be used within try catch
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: "Login successful" };
  } catch (error) {
    if (error instanceof CustomAuthorizeError) {
      if (error.code === "Invalid Credentials")
        return { error: "Invalid credentials" };
    }
    return { error: "Something went wrong!" };
  }
};
