import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

import { connectDB } from "../src/lib/mongodb";
import { Category } from "../src/server/models/Category";
import { Product } from "../src/server/models/Product";

async function seedTestProduct() {
  await connectDB();

  // 1. Create or reuse a test category
  const category = await Category.findOneAndUpdate(
    { slug: "test-jewellery" },
    {
      $setOnInsert: {
        name: "Test Jewellery",
        slug: "test-jewellery",
        description: "Sample category for storefront testing.",
        isActive: true,
      },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    },
  );

  // 2. Create or reuse a test product
  const product = await Product.findOneAndUpdate(
    { slug: "classic-gold-tone-necklace" },
    {
      $set: {
        name: "Classic Gold Tone Necklace",
        slug: "classic-gold-tone-necklace",
        description:
          "A sample gold-tone necklace created for testing the Aura of Shree Jewellery storefront and shopping cart.",
        category: category._id,
        price: 1499,
        compareAtPrice: 1999,
        stock: 10,
        sku: "TEST-NECKLACE-001",
        images: [
          {
            url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f",
            publicId: "seed-test-necklace",
          },
        ],
        isActive: true,
        isFeatured: true,
      },
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );

  console.log("Test category:", category.name);
  console.log("Test product:", product.name);
  console.log("Product slug:", product.slug);
  console.log("Product ID:", product._id);
  console.log("Product stock:", product.stock);
}

seedTestProduct()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
