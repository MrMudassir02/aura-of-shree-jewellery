import { connectDB } from "@/lib/mongodb";
import { Otp, type OtpDocument } from "@/server/models/Otp";
import type { Types } from "mongoose";

export class OtpRepository {
  async findActive(email: string, purpose: OtpDocument["purpose"]) {
    await connectDB();

    return Otp.findOne({
      email: email.trim().toLowerCase(),
      purpose,
      consumedAt: null,
      expiresAt: { $gt: new Date() },
    })
      .sort({ createdAt: -1 })
      .lean<(OtpDocument & { _id: Types.ObjectId }) | null>();
  }

  async create(data: Partial<OtpDocument>) {
    await connectDB();

    const otp = await Otp.create(data);

    return otp.toObject();
  }

  async incrementAttempts(id: string) {
    await connectDB();

    return Otp.findByIdAndUpdate(
      id,
      { $inc: { attempts: 1 } },
      { new: true },
    ).lean<(OtpDocument & { _id: Types.ObjectId }) | null>();
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
    ).lean<(OtpDocument & { _id: Types.ObjectId }) | null>();
  }

  async deleteActive(email: string, purpose: OtpDocument["purpose"]) {
    await connectDB();

    return Otp.deleteMany({
      email: email.trim().toLowerCase(),
      purpose,
      consumedAt: null,
    });
  }
}

export const otpRepository = new OtpRepository();
