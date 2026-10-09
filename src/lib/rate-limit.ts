import { createHash } from "crypto";
import { connectDB } from "@/lib/mongodb";
import { RateLimit } from "@/server/models/RateLimit";

export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
) {
  await connectDB();

  const now = Date.now();
  const windowStart = Math.floor(now / windowMs) * windowMs;

  // Hash the key to avoid storing email addresses in plaintext.
  const hashedKey = createHash("sha256")
    .update(key.trim().toLowerCase())
    .digest("hex");

  const filter = {
    key: hashedKey,
    windowStart,
  };

  let record;

  try {
    record = await RateLimit.findOneAndUpdate(
      filter,
      {
        $inc: { count: 1 },
        $setOnInsert: {
          expiresAt: new Date(windowStart + windowMs),
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      },
    ).lean();
  } catch (error) {
    // A concurrent first request may win the unique-index race.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      record = await RateLimit.findOneAndUpdate(
        filter,
        { $inc: { count: 1 } },
        { returnDocument: "after" },
      ).lean();
    } else {
      throw error;
    }
  }

  if (!record) {
    throw new Error("RATE_LIMIT_UPDATE_FAILED");
  }

  const retryAfter = Math.max(
    1,
    Math.ceil((windowStart + windowMs - now) / 1000),
  );

  return {
    allowed: record.count <= limit,
    remaining: Math.max(0, limit - record.count),
    retryAfter: record.count > limit ? retryAfter : 0,
  };
}
