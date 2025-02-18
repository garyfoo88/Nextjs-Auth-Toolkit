"use server";
import bcrypt from "bcrypt";
import { RegisterSchema } from "@/schema";
import { z } from "zod";
import { db } from "@/lib/db";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validateFields = RegisterSchema.safeParse(values);
  if (validateFields.error) return { error: "Invalid fields" };

  const { email, password, name } = validateFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return {
      error: "Email already in use",
    };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const { token } = await generateVerificationToken(email);
  await sendVerificationEmail(email, token);

  return { success: "User created!" };
};
