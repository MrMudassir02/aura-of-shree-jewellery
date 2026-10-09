import { categoryRepository } from "@/server/repositories/CategoryRepository";

export class CategoryUseCases {
  async getCategoryById(id: string) {
    return categoryRepository.findById(id);
  }

  async getCategoryBySlug(slug: string) {
    return categoryRepository.findBySlug(slug);
  }

  async getCategories() {
    return categoryRepository.findMany();
  }

  async createCategory(
    data: Parameters<typeof categoryRepository.create>[0]
  ) {
    return categoryRepository.create(data);
  }

  async updateCategory(
    id: string,
    data: Parameters<typeof categoryRepository.updateById>[1]
  ) {
    return categoryRepository.updateById(id, data);
  }

  async deleteCategory(id: string) {
    return categoryRepository.deleteById(id);
  }
}

export const categoryUseCases = new CategoryUseCases();
