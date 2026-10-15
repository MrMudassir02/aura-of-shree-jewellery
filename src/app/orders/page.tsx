import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import SiteNavigation from "@/components/navigation/SiteNavigation";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { orderRepository } from "@/server/repositories/OrderRepository";

export const dynamic = "force-dynamic";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

type UserOrder = Awaited<ReturnType<typeof orderRepository.findByUserId>>[number];

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  let orders: UserOrder[] = [];
  if (userId) {
    try {
      orders = await orderRepository.findByUserId(userId);
    } catch (err) {
      console.error("Failed to fetch user orders:", err);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2B1519]">
      <SiteNavigation isLoggedIn={Boolean(session?.user)} user={session?.user} />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs text-[#8A7879]">
          <Link href="/" className="hover:text-[#6B1D2F] transition">
            Home
          </Link>
          <span>/</span>
          <span className="font-medium text-[#2B1519]">My Orders</span>
        </nav>

        <header className="border-b border-[#E8DFD5] pb-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A059]">
            Aura Privilege Services
          </span>
          <h1 className="mt-1 font-serif text-3xl sm:text-4xl text-[#2B1519]">
            Order History &amp; Tracking
          </h1>
          <p className="mt-1.5 text-sm text-[#524043]">
            Track status, delivery timelines, and view invoices for your jewellery orders.
          </p>
        </header>

        {!session?.user ? (
          <div className="mt-8 rounded-2xl border border-[#E8DFD5] bg-white p-8 sm:p-12 text-center shadow-xs">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FAF7F2] text-[#6B1D2F]">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl text-[#2B1519]">
              Sign in to view your orders
            </h2>
            <p className="mt-2 text-sm text-[#8A7879] max-w-md mx-auto">
              Access your complete order history, BIS hallmark certificates, and real-time insured delivery updates.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/login?callbackUrl=/orders"
                className="rounded-xl bg-[#6B1D2F] px-7 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-[#541524]"
              >
                Sign In to Account
              </Link>
              <Link
                href="/products"
                className="rounded-xl border border-[#DFD4C7] bg-[#FAF7F2] px-6 py-3 text-sm font-semibold text-[#2B1519] transition hover:bg-white hover:border-[#6B1D2F]"
              >
                Browse Jewellery Collection
              </Link>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-[#E8DFD5] bg-white p-8 sm:p-12 text-center shadow-xs">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FAF7F2] text-[#C5A059]">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl text-[#2B1519]">
              No orders placed yet
            </h2>
            <p className="mt-2 text-sm text-[#8A7879] max-w-md mx-auto">
              You haven&apos;t placed any orders with Aura of Shree yet. Discover our latest bridal &amp; solitaire collections.
            </p>
            <div className="mt-6">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-[#6B1D2F] px-8 py-3.5 text-sm font-semibold text-white shadow-xs transition hover:bg-[#541524]"
              >
                <span>Explore Jewellery Catalogue</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {orders.map((order) => {
              const orderId = String(order._id);
              const dateStr = new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              return (
                <div
                  key={orderId}
                  className="overflow-hidden rounded-2xl border border-[#E8DFD5] bg-white shadow-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F0E6DC] bg-[#FAF7F2] px-6 py-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#8A7879]">
                        Order ID: <span className="font-mono text-[#2B1519]">#{orderId.slice(-8).toUpperCase()}</span>
                      </p>
                      <p className="text-xs text-[#524043] mt-0.5">Placed on {dateStr}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="inline-flex rounded-full bg-emerald-50 border border-emerald-200/80 px-3 py-1 text-xs font-semibold text-emerald-800">
                        {order.status || "CONFIRMED"}
                      </span>
                      <span className="text-sm font-bold text-[#6B1D2F]">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>

                  <div className="divide-y divide-[#F5ECE1] p-6">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                        <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg border border-[#E8DFD5] bg-[#FAF7F2]">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              unoptimized
                              sizes="56px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-[#8A7879]">
                              ◇
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm text-[#2B1519] truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-[#8A7879] mt-0.5">
                            SKU: {item.sku} · Qty: {item.quantity}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-semibold text-[#2B1519]">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#F0E6DC] bg-[#FFFDFB] px-6 py-3 flex items-center justify-between text-xs text-[#8A7879]">
                    <span>Insured Delivery by BlueDart / Sequel</span>
                    <span className="text-[#6B1D2F] font-semibold">100% BIS Hallmarked</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

