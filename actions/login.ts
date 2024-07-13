"use server";

import { signIn } from "@/auth";
import { CustomAuthorizeError } from "@/auth.config";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { LoginSchema } from "@/schema";
import { z } from "zod";

export const login = async (
  values: z.infer<typeof LoginSchema>
): Promise<any> => {
  const validateFields = LoginSchema.safeParse(values);
  if (validateFields.error) return { error: "Invalid fields" };

  const { email, password, code } = validateFields.data;

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

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken || twoFactorToken.token !== code)
        return { error: "Invalid code!" };

      const hasExpired = new Date(twoFactorToken.expiresAt) < new Date();

      if (hasExpired)
        return {
          error: "Code expired!",
        };

      await db.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);
      return { twoFactor: true };
    }
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
