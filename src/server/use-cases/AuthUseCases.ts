import bcrypt from "bcryptjs";
import { randomInt } from "crypto";

import { otpRepository } from "@/server/repositories/OtpRepository";
import { userRepository } from "@/server/repositories/UserRepository";

const OTP_EXPIRY_MINUTES = 10;
const MAX_OTP_ATTEMPTS = 5;

export class AuthUseCases {
  async register(data: { name: string; email: string; password: string }) {
    const email = data.email.trim().toLowerCase();

    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await userRepository.create({
      name: data.name.trim(),
      email,
      password: passwordHash,
      role: "customer",
      isEmailVerified: false,
      isActive: true,
    });

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    };
  }

  async validateCredentials(email: string, password: string) {
    const user = await userRepository.findByEmailWithPassword(email);

    if (!user || !user.isActive || !user.isEmailVerified) {
      return null;
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return null;
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    };
  }

  async generateOtp(
    email: string,
    purpose: "email_verification" | "password_reset",
  ) {
    const normalizedEmail = email.trim().toLowerCase();

    await otpRepository.deleteActive(normalizedEmail, purpose);

    const otp = randomInt(100000, 1000000).toString();

    const codeHash = await bcrypt.hash(otp, 10);

    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await otpRepository.create({
      email: normalizedEmail,
      codeHash,
      purpose,
      expiresAt,
      attempts: 0,
      consumedAt: null,
    });

    return otp;
  }

  async generateEmailVerificationOtp(email: string) {
    return this.generateOtp(email, "email_verification");
  }

  async requestEmailVerificationOtp(email: string) {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await userRepository.findByEmail(normalizedEmail);

    if (!user || user.isEmailVerified || !user.isActive) {
      return null;
    }

    return this.generateOtp(normalizedEmail, "email_verification");
  }

  async generatePasswordResetOtp(email: string) {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await userRepository.findByEmail(normalizedEmail);

    if (!user || !user.isActive) {
      return null;
    }

    return this.generateOtp(normalizedEmail, "password_reset");
  }

  async verifyEmailOtp(email: string, otp: string) {
    const normalizedEmail = email.trim().toLowerCase();

    const record = await otpRepository.findActive(
      normalizedEmail,
      "email_verification",
    );

    if (!record || record.attempts >= MAX_OTP_ATTEMPTS) {
      return false;
    }

    const matches = await bcrypt.compare(otp, record.codeHash);

    if (!matches) {
      await otpRepository.incrementAttempts(record._id.toString());

      return false;
    }

    const consumed = await otpRepository.consume(record._id.toString());

    if (!consumed) {
      return false;
    }

    const user = await userRepository.findByEmail(normalizedEmail);

    if (!user) {
      return false;
    }

    await userRepository.markEmailVerified(user._id.toString());

    return true;
  }

  async verifyPasswordResetOtp(email: string, otp: string) {
    const normalizedEmail = email.trim().toLowerCase();

    const record = await otpRepository.findActive(
      normalizedEmail,
      "password_reset",
    );

    if (!record || record.attempts >= MAX_OTP_ATTEMPTS) {
      return false;
    }

    const matches = await bcrypt.compare(otp, record.codeHash);

    if (!matches) {
      await otpRepository.incrementAttempts(record._id.toString());

      return false;
    }

    return true;
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const normalizedEmail = email.trim().toLowerCase();

    const record = await otpRepository.findActive(
      normalizedEmail,
      "password_reset",
    );

    if (!record || record.attempts >= MAX_OTP_ATTEMPTS) {
      return false;
    }

    const matches = await bcrypt.compare(otp, record.codeHash);

    if (!matches) {
      await otpRepository.incrementAttempts(record._id.toString());

      return false;
    }

    const user = await userRepository.findByEmail(normalizedEmail);

    if (!user || !user.isActive) {
      return false;
    }

    
    const consumed = await otpRepository.consume(record._id.toString());

    if (!consumed) {
      return false;
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await userRepository.updateById(user._id.toString(), {
      password: passwordHash,
    });

    return true;
  }
}

export const authUseCases = new AuthUseCases();
