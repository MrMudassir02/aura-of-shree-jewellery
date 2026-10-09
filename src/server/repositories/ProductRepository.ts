import { Types } from "mongoose";

import { connectDB } from "@/lib/mongodb";
import { Product, type ProductDocument } from "@/server/models/Product";

type ProductImageInput = {
  url: string;
  publicId: string;
};

type ProductCreateInput = Omit<
  Partial<ProductDocument>,
  "category" | "images"
> & {
  category: Types.ObjectId;
  images: ProductImageInput[];
};

type ProductUpdateInput = Omit<
  Partial<ProductDocument>,
  "category" | "images"
> & {
  category?: Types.ObjectId;
  images?: ProductImageInput[];
};

export class ProductRepository {
  async findById(id: string) {
    await connectDB();

    return Product.findById(id).lean<ProductDocument | null>();
  }
  

  async findByIds(ids: string[]) {
    await connectDB();

    return Product.find({
      _id: { $in: ids },
      isActive: true,
    }).lean<ProductDocument[]>();
  }


  async findBySlug(slug: string) {
    await connectDB();

    return Product.findOne({
      slug,
      isActive: true,
    }).lean<ProductDocument | null>();
  }

  async findMany(options?: {
    category?: string;
    featured?: boolean;
    limit?: number;
    skip?: number;
  }) {
    await connectDB();

    const filter: Record<string, unknown> = {
      isActive: true,
    };

    if (options?.category) {
      filter.category = options.category;
    }

    if (options?.featured !== undefined) {
      filter.isFeatured = options.featured;
    }

    return Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(options?.skip ?? 0)
      .limit(options?.limit ?? 20)
      .lean<ProductDocument[]>();
  }

  async create(data: ProductCreateInput) {
    await connectDB();

    const product = await Product.create(data);

    return product.toObject();
  }

  async updateById(id: string, data: ProductUpdateInput) {
    await connectDB();

    return Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean<ProductDocument | null>();
  }

  async deleteById(id: string) {
    await connectDB();

    return Product.findByIdAndUpdate(
      id,
      {
        isActive: false,
      },
      {
        new: true,
      },
    ).lean<ProductDocument | null>();
  }
}

export const productRepository = new ProductRepository();
