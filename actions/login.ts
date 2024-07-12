"use server";

import { signIn } from "@/auth";
import { CustomAuthorizeError } from "@/auth.config";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { LoginSchema } from "@/schema";
import { z } from "zod";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validateFields = LoginSchema.safeParse(values);
  if (validateFields.error) return { error: "Invalid fields" };

  const { email, password } = validateFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email) {
    return { error: "Email does not exist" };
  }

  if (!existingUser.emailVerified) {
    const { email, token } = await generateVerificationToken(
      existingUser.email
    );

    await sendVerificationEmail(email, token);
    return { success: "Confirmation email sent!" };
  }

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
