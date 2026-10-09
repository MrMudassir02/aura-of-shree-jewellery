import { loadEnvConfig } from "@next/env";
import mongoose from "mongoose";

import { connectDB } from "../src/lib/mongodb";
import { User } from "../src/server/models/User";

loadEnvConfig(process.cwd());

async function promoteAdmin() {
  const email = process.argv[2]?.trim().toLowerCase();

  if (!email) {
    throw new Error("Usage: npx tsx scripts/promote-admin.ts <your-email>");
  }

  await connectDB();

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found. Check the email address.");
  }

  if (!user.isEmailVerified) {
    throw new Error("Email is not verified. Verify it before promotion.");
  }

  if (!user.isActive) {
    throw new Error("This account is inactive.");
  }

  if (user.role === "admin") {
    console.log("This account is already an admin.");
    return;
  }

  user.role = "admin";
  await user.save();

  console.log("Admin promotion successful.");
  console.log("Email:", user.email);
  console.log("Role:", user.role);
}

promoteAdmin()
  .catch((error) => {
    console.error("Admin promotion failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
