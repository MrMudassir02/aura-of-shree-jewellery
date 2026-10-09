import { connectDB } from "@/lib/mongodb";
import { User, type UserDocument } from "@/server/models/User";
import type { Types } from "mongoose";

export class UserRepository {
  async findById(id: string) {
    await connectDB();

    return User.findById(id).lean<
      (UserDocument & { _id: Types.ObjectId }) | null
    >();
  }

  async findByEmail(email: string) {
    await connectDB();

    return User.findOne({
      email: email.trim().toLowerCase(),
    }).lean<(UserDocument & { _id: Types.ObjectId }) | null>();
  }

  async findByEmailWithPassword(email: string) {
    await connectDB();

    return User.findOne({
      email: email.trim().toLowerCase(),
    })
      .select("+password")
      .lean<(UserDocument & { _id: Types.ObjectId }) | null>();
  }

  async create(data: Partial<UserDocument>) {
    await connectDB();

    const user = await User.create(data);

    return user.toObject();
  }

  async updateById(id: string, data: Partial<UserDocument>) {
    await connectDB();

    return User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean<(UserDocument & { _id: Types.ObjectId }) | null>();
  }

  async markEmailVerified(id: string) {
    await connectDB();

    return User.findByIdAndUpdate(
      id,
      { isEmailVerified: true },
      {
        new: true,
        runValidators: true,
      },
    ).lean<(UserDocument & { _id: Types.ObjectId }) | null>();
  }
}

export const userRepository = new UserRepository();
