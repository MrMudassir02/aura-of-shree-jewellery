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
    <main className="min-h-screen bg-[#FAF7F2] px-4 py-16 text-[#2B1519] sm:py-24">
      <section className="mx-auto max-w-2xl rounded-2xl border border-[#E8DFD5] bg-white p-8 text-center shadow-lg sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#1A4D2E]/10 text-2xl text-[#1A4D2E]">
          ✓
        </div>

        <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#C5A059]">
          ORDER CONFIRMED &amp; INSURED
        </p>

        <h1 className="mt-2 font-serif text-3xl font-bold text-[#6B1D2F] sm:text-4xl">
          Thank you for your order
        </h1>

        <p className="mt-3 text-xs sm:text-sm leading-6 text-[#8A7879]">
          Your payment has been verified. Your handcrafted jewellery is being prepared for transit with full transit insurance.
        </p>

        <div className="mt-8 rounded-xl border border-[#E8DFD5] bg-[#FAF7F2]/60 p-5 text-left text-xs">
          <div className="flex justify-between gap-2 border-b border-[#E8DFD5] pb-3">
            <span className="text-[#8A7879]">Order Reference</span>
            <span className="font-mono font-bold text-[#2B1519]">{order._id.toString()}</span>
          </div>

          <div className="flex justify-between gap-2 border-b border-[#E8DFD5] py-3">
            <span className="text-[#8A7879]">Payment Status</span>
            <span className="font-semibold text-[#1A4D2E] uppercase tracking-wider">
              ✓ {order.paymentStatus}
            </span>
          </div>

          <div className="flex justify-between gap-2 border-b border-[#E8DFD5] py-3">
            <span className="text-[#8A7879]">Items</span>
            <span className="font-semibold text-[#2B1519]">
              {order.items.reduce(
                (sum: number, item: { quantity: number }) =>
                  sum + item.quantity,
                0,
              )}{" "}
              pieces
            </span>
          </div>

          <div className="flex justify-between gap-2 pt-3 font-bold text-sm">
            <span className="text-[#2B1519]">Total Paid</span>
            <span className="text-[#6B1D2F]">{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-[#E8DFD5] bg-[#FAF7F2]/60 p-5 text-left text-xs">
          <h2 className="font-serif text-sm font-bold text-[#2B1519]">Insured Delivery Destination</h2>
          <p className="mt-2 text-[#524043] leading-5">
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

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/products"
            className="rounded-md bg-[#6B1D2F] px-7 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[#541524]"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="rounded-md border border-[#DFD4C7] bg-white px-7 py-3 text-xs font-bold uppercase tracking-wider text-[#2B1519] transition hover:bg-[#FAF7F2]"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
