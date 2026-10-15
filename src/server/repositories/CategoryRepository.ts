import { Types } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Category, type CategoryDocument } from "@/server/models/Category";

export const CORE_CATEGORIES: Record<
  string,
  { name: string; description: string; imageUrl?: string }
> = {
  "gold-coins": {
    name: "24K Gold Coins",
    description:
      "Pure 24K 999 investment gold coins, hallmark certified with tamper-evident luxury assay packaging.",
    imageUrl:
      "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80",
  },
  necklaces: {
    name: "Necklaces",
    description:
      "Handcrafted chokers, heritage bridal sets, and delicate diamond pendant necklaces.",
    imageUrl:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
  },
  rings: {
    name: "Rings",
    description:
      "Solitaire diamond rings, cocktail bands, and traditional 22K gold rings for every milestone.",
    imageUrl:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
  },
  earrings: {
    name: "Earrings",
    description:
      "Exquisite jhumkas, chandelier drops, and everyday diamond studs in 22K hallmarked gold.",
    imageUrl:
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80",
  },
  bracelets: {
    name: "Bracelets & Bangles",
    description:
      "Artisanal kadas, tennis diamond bracelets, and modern flexible gold bangles.",
    imageUrl:
      "https://images.unsplash.com/photo-1611591475806-037140e6955a?auto=format&fit=crop&w=800&q=80",
  },
  pendants: {
    name: "Pendants",
    description:
      "Auspicious spiritual motifs, solitaire diamonds, and gemstone pendants crafted with elegance.",
    imageUrl:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
  },
  chains: {
    name: "Chains",
    description:
      "Timeless 22K hallmarked gold chains and delicate daily wear neck chains.",
    imageUrl:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
  },
};

export class CategoryRepository {
  async findById(id: string) {
    await connectDB();

    return Category.findById(id).lean<CategoryDocument | null>();
  }

  async findBySlug(slug: string) {
    await connectDB();

    const cleanSlug = slug.toLowerCase().trim();

    // 1. Try finding in MongoDB
    try {
      const category = await Category.findOne({
        $or: [
          { slug: cleanSlug },
          { slug: { $regex: new RegExp(`^${cleanSlug}$`, "i") } },
        ],
        isActive: true,
      }).lean<CategoryDocument | null>();

      if (category) {
        return category;
      }
    } catch (err) {
      console.error("Category query error:", err);
    }

    // 2. If not found in DB, check core known categories and auto-upsert
    const known = CORE_CATEGORIES[cleanSlug];
    if (known) {
      try {
        const created = await Category.findOneAndUpdate(
          { slug: cleanSlug },
          {
            $setOnInsert: {
              name: known.name,
              slug: cleanSlug,
              description: known.description,
              imageUrl: known.imageUrl,
              isActive: true,
            },
          },
          { upsert: true, new: true },
        ).lean<CategoryDocument | null>();

        if (created) return created;
      } catch {
        // Fallback gracefully
      }

      return {
        _id: new Types.ObjectId(),
        name: known.name,
        slug: cleanSlug,
        description: known.description,
        imageUrl: known.imageUrl,
        isActive: true,
      } as unknown as CategoryDocument;
    }

    // 3. For any other arbitrary slug, format title gracefully
    const formattedName = cleanSlug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    try {
      const created = await Category.findOneAndUpdate(
        { slug: cleanSlug },
        {
          $setOnInsert: {
            name: formattedName,
            slug: cleanSlug,
            description: `Explore our collection of handcrafted ${formattedName}.`,
            isActive: true,
          },
        },
        { upsert: true, new: true },
      ).lean<CategoryDocument | null>();

      if (created) return created;
    } catch {
      // Fallback gracefully
    }

    return {
      _id: new Types.ObjectId(),
      name: formattedName,
      slug: cleanSlug,
      description: `Explore our collection of handcrafted ${formattedName}.`,
      isActive: true,
    } as unknown as CategoryDocument;
  }

  async findMany() {
    await connectDB();

    try {
      const dbCategories = await Category.find({
        isActive: true,
      })
        .sort({ name: 1 })
        .lean<CategoryDocument[]>();

      const existingSlugs = new Set(
        dbCategories.map((c) => c.slug?.toLowerCase()),
      );
      const missingCore = Object.entries(CORE_CATEGORIES).filter(
        ([slug]) => !existingSlugs.has(slug),
      );

      // Auto-upsert missing core categories in MongoDB
      if (missingCore.length > 0) {
        Promise.all(
          missingCore.map(([slug, data]) =>
            Category.updateOne(
              { slug },
              {
                $setOnInsert: {
                  name: data.name,
                  slug,
                  description: data.description,
                  imageUrl: data.imageUrl,
                  isActive: true,
                },
              },
              { upsert: true },
            ),
          ),
        ).catch(() => {});
      }

      const combined = [...dbCategories];
      for (const [slug, data] of missingCore) {
        combined.push({
          _id: new Types.ObjectId(),
          name: data.name,
          slug,
          description: data.description,
          imageUrl: data.imageUrl,
          isActive: true,
        } as unknown as CategoryDocument);
      }

      return combined;
    } catch {
      return Object.entries(CORE_CATEGORIES).map(
        ([slug, data]) =>
          ({
            _id: new Types.ObjectId(),
            name: data.name,
            slug,
            description: data.description,
            imageUrl: data.imageUrl,
            isActive: true,
          }) as unknown as CategoryDocument,
      );
    }
  }

  async create(data: Partial<CategoryDocument>) {
    await connectDB();

    const category = await Category.create(data);

    return category.toObject();
  }

  async updateById(id: string, data: Partial<CategoryDocument>) {
    await connectDB();

    return Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean<CategoryDocument | null>();
  }

  async deleteById(id: string) {
    await connectDB();

    return Category.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    ).lean<CategoryDocument | null>();
  }
}

export const categoryRepository = new CategoryRepository();
