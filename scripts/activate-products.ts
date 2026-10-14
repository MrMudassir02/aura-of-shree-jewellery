import mongoose from "mongoose";
import { connectDB } from "../src/lib/mongodb";
import { Product } from "../src/server/models/Product";

const PLACEHOLDER_IMAGE =
  "https://placehold.co/900x1100/F5EBDD/3A1A1B?text=Aura+of+Shree+Jewellery";
const TEMPORARY_PRICE_INR = 999;
const TEMPORARY_STOCK = 10;

async function main() {
  await connectDB();

  const samples = await Product.find({
    $or: [
      { sku: /^SAMPLE-/i },
      { slug: /^sample-/i },
      { name: /^SAMPLE\s*[—-]/i },
    ],
  });

  const rows = [];
  for (const product of samples) {
    const updates: Record<string, unknown> = {
      isActive: true,
      status: "ACTIVE",
      isSample: true,
    };

    if (!Number.isFinite(product.price) || product.price <= 0) {
      updates.price = TEMPORARY_PRICE_INR;
    }
    if (!Number.isFinite(product.stock) || product.stock < 1) {
      updates.stock = TEMPORARY_STOCK;
    }
    if (!Array.isArray(product.images) || product.images.length === 0) {
      updates.images = [{ url: PLACEHOLDER_IMAGE, publicId: "sample-placeholder" }];
    }

    await Product.updateOne({ _id: product._id }, { $set: updates }, { runValidators: true });
    rows.push({
      name: product.name,
      sku: product.sku,
      status: "ACTIVE",
      price: updates.price ?? product.price,
      stock: updates.stock ?? product.stock,
      image: updates.images ? "placeholder" : "existing",
      sample: true,
    });
  }

  console.table(rows);
  console.log(`Activated ${rows.length} sample products.`);
  console.log(`Temporary defaults used only when missing/invalid: price ₹${TEMPORARY_PRICE_INR}, stock ${TEMPORARY_STOCK}.`);
  console.log("All activated products are marked isSample=true and retain SAMPLE-prefixed identifiers.");
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error("Product activation failed:", error);
  await mongoose.disconnect().catch(() => undefined);
  process.exitCode = 1;
});
