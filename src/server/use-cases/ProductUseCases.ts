import { productRepository } from "@/server/repositories/ProductRepository";

export class ProductUseCases {
  async getProductById(id: string) { return productRepository.findById(id); }
  async getProductsByIds(ids: string[]) { return productRepository.findByIds(ids); }
  async getProductBySlug(slug: string) { return productRepository.findBySlug(slug); }
  async getProducts(options?: { category?: string; featured?: boolean; limit?: number; skip?: number; search?: string }) {
    return productRepository.findMany(options);
  }
  async getAdminProducts(options: { search?: string; category?: string; status?: string; skip: number; limit: number }) {
    return productRepository.findAdminMany(options);
  }
  async setProductStatus(ids: string[], status: "ACTIVE" | "DRAFT" | "ARCHIVED") {
    return productRepository.setStatus(ids, status);
  }
  async deleteProducts(ids: string[]) { return productRepository.deleteMany(ids); }
  async createProduct(data: Parameters<typeof productRepository.create>[0]) { return productRepository.create(data); }
  async updateProduct(id: string, data: Parameters<typeof productRepository.updateById>[1]) {
    return productRepository.updateById(id, data);
  }
  async deleteProduct(id: string) { return productRepository.deleteById(id); }
}
export const productUseCases = new ProductUseCases();
