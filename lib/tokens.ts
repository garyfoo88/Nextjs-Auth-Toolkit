import { getVerificationTokenByEmail } from "@/data/verification-token";
import { v4 as uuidv4 } from "uuid";
import { db } from "./db";
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";

export const generatePasswordResetToken = async (email: string) => {
  const { token, expiresAt } = generateUuidAndExpiresAt();

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  });

  return passwordResetToken;
};

export const generateVerificationToken = async (email: string) => {
  const { token, expiresAt } = generateUuidAndExpiresAt();

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  });

  return verificationToken;
};

const generateUuidAndExpiresAt = () => {
  const token = uuidv4();
  const expiresAt = new Date(new Date().getTime() + 3600 * 1000);
  return { token, expiresAt };
};
