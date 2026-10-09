import { connectDB } from "@/lib/mongodb";
import { Category, type CategoryDocument } from "@/server/models/Category";

export class CategoryRepository {
  async findById(id: string) {
    await connectDB();

    return Category.findById(id).lean<CategoryDocument | null>();
  }

  async findBySlug(slug: string) {
    await connectDB();

    return Category.findOne({
      slug,
      isActive: true,
    }).lean<CategoryDocument | null>();
  }

  async findMany() {
    await connectDB();

    return Category.find({
      isActive: true,
    })
      .sort({ name: 1 })
      .lean<CategoryDocument[]>();
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
