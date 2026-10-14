import { Types } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Product, type ProductDocument } from "@/server/models/Product";
import { Category } from "@/server/models/Category";

type ProductImageInput = { url: string; publicId: string };
type ProductCreateInput = Omit<Partial<ProductDocument>, "category" | "images"> & {
  category: Types.ObjectId; images: ProductImageInput[];
};
type ProductUpdateInput = Omit<Partial<ProductDocument>, "category" | "images"> & {
  category?: Types.ObjectId; images?: ProductImageInput[];
};

export class ProductRepository {
  async findById(id: string) {
    await connectDB();
    return Product.findById(id).lean<ProductDocument | null>();
  }

  async findByIds(ids: string[]) {
    await connectDB();
    return Product.find({ _id: { $in: ids }, isActive: true, status: "ACTIVE" }).lean<ProductDocument[]>();
  }

  async findBySlug(slug: string) {
    await connectDB();
    return Product.findOne({ slug, isActive: true, status: { $in: ["ACTIVE", null] } }).lean<ProductDocument | null>();
  }

  async findMany(options?: { category?: string; featured?: boolean; limit?: number; skip?: number; search?: string }) {
    await connectDB();
    const filter: Record<string, unknown> = { isActive: true, status: { $in: ["ACTIVE", null] } };

    if (options?.category) {
      const categoryParam = options.category.trim();
      if (Types.ObjectId.isValid(categoryParam) && categoryParam.length === 24) {
        filter.category = new Types.ObjectId(categoryParam);
      } else {
        const foundCategory = await Category.findOne({
          $or: [
            { slug: categoryParam.toLowerCase() },
            { name: { $regex: new RegExp(`^${categoryParam}$`, "i") } },
          ],
        }).lean();

        if (foundCategory) {
          filter.category = foundCategory._id;
        } else {
          return [];
        }
      }
    }

    if (options?.featured !== undefined) filter.isFeatured = options.featured;
    if (options?.search?.trim()) {
      const safe = options.search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { name: { $regex: safe, $options: "i" } },
        { description: { $regex: safe, $options: "i" } },
      ];
    }
    return Product.find(filter).sort({ createdAt: -1 }).skip(options?.skip ?? 0).limit(options?.limit ?? 20).lean<ProductDocument[]>();
  }

  async findAdminMany(options: {
    search?: string; category?: string; status?: string; skip: number; limit: number;
  }) {
    await connectDB();
    const filter: Record<string, unknown> = {};

    if (options.category) {
      const categoryParam = options.category.trim();
      if (Types.ObjectId.isValid(categoryParam) && categoryParam.length === 24) {
        filter.category = new Types.ObjectId(categoryParam);
      } else {
        const foundCategory = await Category.findOne({
          $or: [
            { slug: categoryParam.toLowerCase() },
            { name: { $regex: new RegExp(`^${categoryParam}$`, "i") } },
          ],
        }).lean();

        if (foundCategory) {
          filter.category = foundCategory._id;
        } else {
          return { products: [], total: 0 };
        }
      }
    }

    if (options.status && options.status !== "ALL") filter.status = options.status;
    if (options.search?.trim()) {
      const safe = options.search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [{ name: { $regex: safe, $options: "i" } }, { sku: { $regex: safe, $options: "i" } }];
    }
    const [products, total] = await Promise.all([
      Product.find(filter).populate("category", "name slug").sort({ updatedAt: -1 }).skip(options.skip).limit(options.limit).lean(),
      Product.countDocuments(filter),
    ]);
    return { products, total };
  }

  async create(data: ProductCreateInput) {
    await connectDB();
    const product = await Product.create(data);
    return product.toObject();
  }

  async updateById(id: string, data: ProductUpdateInput) {
    await connectDB();
    const update = { ...data } as Record<string, unknown>;
    if (update.status === "ACTIVE") update.isActive = true;
    if (update.status === "DRAFT" || update.status === "ARCHIVED") update.isActive = false;
    return Product.findByIdAndUpdate(id, update, { new: true, runValidators: true }).lean<ProductDocument | null>();
  }

  async setStatus(ids: string[], status: "ACTIVE" | "DRAFT" | "ARCHIVED") {
    await connectDB();
    return Product.updateMany(
      { _id: { $in: ids } },
      { $set: { status, isActive: status === "ACTIVE" } },
      { runValidators: true },
    );
  }

  async deleteMany(ids: string[]) {
    await connectDB();
    return Product.deleteMany({ _id: { $in: ids } });
  }

  async deleteById(id: string) {
    await connectDB();
    return Product.findByIdAndUpdate(id, { isActive: false, status: "ARCHIVED" }, { new: true }).lean<ProductDocument | null>();
  }
}
export const productRepository = new ProductRepository();
