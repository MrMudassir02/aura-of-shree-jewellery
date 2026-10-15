import mongoose from "mongoose";
import { connectDB } from "../src/lib/mongodb";
import { Category } from "../src/server/models/Category";
import { Product } from "../src/server/models/Product";

const categories = [
  {
    name: "Rings",
    slug: "rings",
    description: "Discover elegant rings for every style and occasion.",
  },
  {
    name: "Necklaces",
    slug: "necklaces",
    description: "Explore chokers, royal bridal sets, and heritage necklaces.",
  },
  {
    name: "Earrings",
    slug: "earrings",
    description: "Explore earrings for everyday wear and special occasions.",
  },
  {
    name: "Bracelets",
    slug: "bracelets",
    description: "Discover bracelets that bring elegance to every look.",
  },
  {
    name: "Pendants",
    slug: "pendants",
    description: "Explore pendants designed to make every moment special.",
  },
  {
    name: "Gold Coins",
    slug: "gold-coins",
    description: "Pure 24K 999 investment gold coins, hallmark certified.",
  },
  {
    name: "Chains",
    slug: "chains",
    description: "Explore timeless chains for versatile styling.",
  },
];

async function seed() {
  await connectDB();

  let createdCategories = 0;
  let existingCategories = 0;
  let createdSamples = 0;
  let existingSamples = 0;

  for (const data of categories) {
    const existing = await Category.findOne({ slug: data.slug });

    if (existing) {
      await Category.updateOne(
        { _id: existing._id },
        {
          $set: {
            name: data.name,
            description: data.description,
            isActive: true,
          },
        },
      );
      existingCategories++;
    } else {
      await Category.create({
        ...data,
        isActive: true,
      });
      createdCategories++;
    }
  }

  for (const categoryData of categories) {
    const category = await Category.findOne({
      slug: categoryData.slug,
    });

    if (!category) {
      throw new Error(`Category creation failed: ${categoryData.slug}`);
    }

    for (let number = 1; number <= 6; number++) {
      const slug = `sample-${categoryData.slug}-${number}`;
      const sku = `SAMPLE-${categoryData.slug.toUpperCase()}-${String(number).padStart(2, "0")}`;

      const result = await Product.updateOne(
        { slug },
        {
          $setOnInsert: {
            name: `SAMPLE — ${categoryData.name} Design ${number}`,
            slug,
            sku,
            description:
              "Demo placeholder only. Replace with verified product details before publishing.",
            category: category._id,
            price: 0,
            stock: 0,
            images: [],
            isActive: false,
            isFeatured: false,
          },
        },
        { upsert: true },
      );

      if (result.upsertedCount > 0) {
        createdSamples++;
      } else {
        existingSamples++;
      }
    }
  }

  console.log("\nJewellery seed completed.");
  console.table({
    categoriesCreated: createdCategories,
    categoriesAlreadyPresent: existingCategories,
    sampleProductsCreated: createdSamples,
    sampleProductsAlreadyPresent: existingSamples,
  });

  console.log(
    "\nSample products are intentionally inactive and cannot be sold. Add verified inventory, prices, stock, and real images before activating products.",
  );
}

seed()
  .catch((error) => {
    console.error("Jewellery seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
