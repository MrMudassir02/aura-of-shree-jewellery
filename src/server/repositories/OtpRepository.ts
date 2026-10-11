import { connectDB } from "@/lib/mongodb";
import { Otp, type OtpDocument } from "@/server/models/Otp";
import type { Types } from "mongoose";

type OtpPurpose = OtpDocument["purpose"];

type OtpRecord = OtpDocument & {
  _id: Types.ObjectId;
};

export class OtpRepository {
  async findActive(email: string, purpose: OtpPurpose) {
    await connectDB();

    return Otp.findOne({
      email: email.trim().toLowerCase(),
      purpose,
      consumedAt: null,
      expiresAt: { $gt: new Date() },
    })
      .sort({ createdAt: -1 })
      .lean<OtpRecord | null>();
  }

  async create(data: Partial<OtpDocument>) {
    await connectDB();

    const otp = await Otp.create(data);

    return otp.toObject();
  }

  async incrementAttemptsIfAllowed(id: string, maxAttempts: number) {
    await connectDB();

    return Otp.findOneAndUpdate(
      {
        _id: id,
        consumedAt: null,
        expiresAt: { $gt: new Date() },
        attempts: { $lt: maxAttempts },
      },
      {
        $inc: { attempts: 1 },
      },
      {
        new: true,
      },
    ).lean<OtpRecord | null>();
  }

  async consume(id: string) {
    await connectDB();

    return Otp.findOneAndUpdate(
      {
        _id: id,
        consumedAt: null,
        expiresAt: { $gt: new Date() },
      },
      {
        $set: {
          consumedAt: new Date(),
        },
      },
      {
        new: true,
      },
    ).lean<OtpRecord | null>();
  }

  async deleteActive(email: string, purpose: OtpPurpose) {
    await connectDB();

    return Otp.deleteMany({
      email: email.trim().toLowerCase(),
      purpose,
      consumedAt: null,
    });
  }
}

export const otpRepository = new OtpRepository();
