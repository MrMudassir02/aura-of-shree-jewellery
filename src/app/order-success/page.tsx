import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/server/models/Order";

type OrderSuccessPageProps = {
  searchParams: Promise<{ orderId?: string }>;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export const dynamic = "force-dynamic";

export default async function OrderSuccessPage({
  searchParams,
}: OrderSuccessPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { orderId } = await searchParams;

  if (!orderId || !Types.ObjectId.isValid(orderId)) {
    notFound();
  }

  await connectDB();

  const order = await Order.findOne({
    _id: new Types.ObjectId(orderId),
    user: new Types.ObjectId(session.user.id),
    paymentStatus: "paid",
  }).lean();

  if (!order) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F5EBDD] px-5 py-16 text-[#3A1A1B] sm:py-24">
      <section className="mx-auto max-w-2xl bg-[#FFF9F0] px-6 py-12 text-center sm:px-12 sm:py-16">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#967344]/50 text-3xl text-[#967344]">
          ✓
        </div>

        <p className="mt-8 text-xs uppercase tracking-[0.3em] text-[#967344]">
          Payment confirmed
        </p>

        <h1 className="mt-4 font-serif text-4xl sm:text-5xl">
          Thank you for your order.
        </h1>

        <p className="mt-5 text-sm leading-7 text-[#806D60]">
          Your payment has been verified successfully. Keep your order reference
          for future enquiries.
        </p>

        <div className="mt-10 border-y border-[#3A1A1B]/15 py-6 text-left">
          <div className="flex flex-wrap justify-between gap-2 text-sm">
            <span className="text-[#806D60]">Order reference</span>
            <span className="font-medium">{order._id.toString()}</span>
          </div>

          <div className="mt-4 flex justify-between gap-4 text-sm">
            <span className="text-[#806D60]">Payment status</span>
            <span className="font-medium capitalize">
              {order.paymentStatus}
            </span>
          </div>

          <div className="mt-4 flex justify-between gap-4 text-sm">
            <span className="text-[#806D60]">Order total</span>
            <span className="font-medium">{formatPrice(order.total)}</span>
          </div>

          <div className="mt-4 flex justify-between gap-4 text-sm">
            <span className="text-[#806D60]">Items</span>
            <span className="font-medium">
              {order.items.reduce(
                (sum: number, item: { quantity: number }) =>
                  sum + item.quantity,
                0,
              )}
            </span>
          </div>
        </div>

        <div className="mt-8 text-left">
          <h2 className="font-serif text-xl">Delivering to</h2>
          <p className="mt-3 text-sm leading-7 text-[#806D60]">
            {order.shippingAddress.fullName}
            <br />
            {order.shippingAddress.addressLine1}
            {order.shippingAddress.addressLine2
              ? `, ${order.shippingAddress.addressLine2}`
              : ""}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
            {order.shippingAddress.postalCode}
            <br />
            {order.shippingAddress.country}
          </p>
        </div>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/products"
            className="bg-[#3A1A1B] px-7 py-4 text-sm text-[#FFF9F0] transition hover:bg-[#54292A]"
          >
            Continue shopping
          </Link>
          <Link
            href="/"
            className="border border-[#3A1A1B]/25 px-7 py-4 text-sm transition hover:bg-[#3A1A1B]/5"
          >
            Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}
