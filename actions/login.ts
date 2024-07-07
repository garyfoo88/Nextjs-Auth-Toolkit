"use server";

import { LoginSchema } from "@/schema";
import { z } from "zod";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validateFields = LoginSchema.safeParse(values);
  if (validateFields.error) return { error: "Invalid fields" };
  return { success: "Email sent!" };
};
