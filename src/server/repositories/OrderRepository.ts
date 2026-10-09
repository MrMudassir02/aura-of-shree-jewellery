import { connectDB } from "@/lib/mongodb";
import { Order, type OrderDocument } from "@/server/models/Order";
import { Product } from "@/server/models/Product";

type OrderCreateInput = {
  user: OrderDocument["user"];
  items: Array<{
    product: OrderDocument["items"][number]["product"];
    name: string;
    sku: string;
    price: number;
    quantity: number;
    imageUrl?: string;
  }>;
  shippingAddress: OrderDocument["shippingAddress"];
  subtotal: number;
  shippingFee: number;
  total: number;
  status?: OrderDocument["status"];
  paymentStatus?: OrderDocument["paymentStatus"];
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
};

export class OrderRepository {
  async create(data: OrderCreateInput) {
    await connectDB();

    const order = await Order.create(data);

    return order.toObject();
  }

  async findById(id: string) {
    await connectDB();

    return Order.findById(id).lean<OrderDocument | null>();
  }

  async findByUserId(userId: string) {
    await connectDB();

    return Order.find({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .lean<OrderDocument[]>();
  }

  async findMany(options?: {
    status?: string;
    paymentStatus?: string;
    limit?: number;
    skip?: number;
  }) {
    await connectDB();

    const filter: Record<string, unknown> = {};

    if (options?.status) {
      filter.status = options.status;
    }

    if (options?.paymentStatus) {
      filter.paymentStatus = options.paymentStatus;
    }

    return Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(options?.skip ?? 0)
      .limit(options?.limit ?? 20)
      .lean<OrderDocument[]>();
  }

  async findByRazorpayOrderId(razorpayOrderId: string) {
    await connectDB();

    return Order.findOne({
      razorpayOrderId,
    }).lean<OrderDocument | null>();
  }

  async updateById(id: string, data: Partial<OrderDocument>) {
    await connectDB();

    return Order.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean<OrderDocument | null>();
  }

  async confirmPaidOrder(id: string): Promise<OrderDocument> {
    const mongoose = await connectDB();
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        const order = await Order.findById(id).session(session);

        if (!order) {
          throw new Error("Order not found");
        }

        // Idempotency: never deduct stock twice.
        if (order.paymentStatus === "paid") {
          return;
        }

        if (order.paymentStatus !== "pending") {
          throw new Error("Order is not awaiting payment");
        }

        // Deduct stock atomically for every item.
        for (const item of order.items) {
          const updatedProduct = await Product.findOneAndUpdate(
            {
              _id: item.product,
              isActive: true,
              stock: { $gte: item.quantity },
            },
            {
              $inc: {
                stock: -item.quantity,
              },
            },
            {
              new: true,
              session,
            },
          );

          if (!updatedProduct) {
            throw new Error(`Insufficient stock for ${item.name}`);
          }
        }

        order.paymentStatus = "paid";
        order.status = "confirmed";

        await order.save({ session });
      });

      const confirmedOrder = await Order.findById(
        id,
      ).lean<OrderDocument | null>();

      if (!confirmedOrder) {
        throw new Error("Failed to confirm paid order");
      }

      return confirmedOrder;
    } finally {
      await session.endSession();
    }
  }
}

export const orderRepository = new OrderRepository();
