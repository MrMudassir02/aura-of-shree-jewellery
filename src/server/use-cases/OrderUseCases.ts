import { orderRepository } from "@/server/repositories/OrderRepository";
import { productUseCases } from "@/server/use-cases/ProductUseCases";

export class OrderUseCases {
  async getOrderById(id: string) {
    return orderRepository.findById(id);
  }

  async getOrdersByUserId(userId: string) {
    return orderRepository.findByUserId(userId);
  }

  async getOrders(options?: {
    status?: string;
    paymentStatus?: string;
    limit?: number;
    skip?: number;
  }) {
    return orderRepository.findMany(options);
  }

  async createOrder(data: Parameters<typeof orderRepository.create>[0]) {
    return orderRepository.create(data);
  }

  async updateOrder(
    id: string,
    data: Parameters<typeof orderRepository.updateById>[1],
  ) {
    return orderRepository.updateById(id, data);
  }

  async confirmPaidOrder(id: string) {
    return orderRepository.confirmPaidOrder(id);
  }

  async getOrderByRazorpayOrderId(razorpayOrderId: string) {
    return orderRepository.findByRazorpayOrderId(razorpayOrderId);
  }

  async prepareOrder(
    userId: string,
    items: Array<{
      productId: string;
      quantity: number;
    }>,
    shippingAddress: {
      fullName: string;
      phone: string;
      addressLine1: string;
      addressLine2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    },
  ) {
    const products = await productUseCases.getProductsByIds(
      items.map((item) => item.productId),
    );

    if (products.length !== items.length) {
      throw new Error("One or more products are unavailable");
    }

    const orderItems = items.map((item) => {
      const product = products.find(
        (product) => product._id.toString() === item.productId,
      );

      if (!product) {
        throw new Error("Product not found");
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      return {
        product: product._id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        quantity: item.quantity,
        imageUrl: product.images[0]?.url,
      };
    });

    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const shippingFee = subtotal >= 2000 ? 0 : 99;

    const total = subtotal + shippingFee;

    return {
      user: userId,
      items: orderItems,
      shippingAddress,
      subtotal,
      shippingFee,
      total,
    };
  }
}

export const orderUseCases = new OrderUseCases();
