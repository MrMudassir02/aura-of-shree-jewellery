"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";

const CART_KEY = "aura-cart-v1";

type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
};

type ShippingForm = {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
};

type RazorpayCheckoutOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
  handler: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
};

type RazorpayInstance = {
  open: () => void;
};

declare global {
  interface Window {
    Razorpay: new (options: RazorpayCheckoutOptions) => RazorpayInstance;
  }
}

export default function CheckoutClient() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [form, setForm] = useState<ShippingForm>({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);

      if (stored) {
        const parsed: CartItem[] = JSON.parse(stored);
        setCart(Array.isArray(parsed) ? parsed : []);
      }
    } catch {
      setCart([]);
    }

    setLoaded(true);
  }, []);

  function updateField(field: keyof ShippingForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  }

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const estimatedShipping = subtotal >= 2000 ? 0 : 99;
  const estimatedTotal = subtotal + estimatedShipping;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsProcessing(true);

    if (cart.length === 0) {
      setError("Your shopping bag is empty.");
      setIsProcessing(false);
      return;
    }

    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      setError("Please enter a valid Indian mobile number.");
      setIsProcessing(false);
      return;
    }

    if (!/^\d{6}$/.test(form.postalCode)) {
      setError("Please enter a valid 6-digit postal code.");
      setIsProcessing(false);
      return;
    }

    try {
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          shippingAddress: {
            fullName: form.fullName,
            phone: form.phone,
            addressLine1: form.addressLine1,
            addressLine2: form.addressLine2 || undefined,
            city: form.city,
            state: form.state,
            postalCode: form.postalCode,
            country: "India",
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to create your order.");
        setIsProcessing(false);
        return;
      }

      if (!window.Razorpay) {
        setError("Payment gateway is still loading. Please try again.");
        setIsProcessing(false);
        return;
      }

      const razorpay = new window.Razorpay({
        key: data.order.razorpayKeyId,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "AURA OF SHREE JWELLERY",
        description: "Jewellery purchase",
        order_id: data.order.razorpayOrderId,

        prefill: {
          name: form.fullName,
          contact: form.phone,
        },

        notes: {
          orderId: data.order.id,
        },

        theme: {
          color: "#3A1A1B",
        },

        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },

        handler: async (paymentResponse) => {
          try {
            const verifyResponse = await fetch("/api/orders/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpayOrderId: paymentResponse.razorpay_order_id,
                razorpayPaymentId: paymentResponse.razorpay_payment_id,
                razorpaySignature: paymentResponse.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok) {
              setError(
                verifyData.message ||
                  "Payment verification failed. Please contact support.",
              );
              return;
            }

            localStorage.removeItem(CART_KEY);

            window.location.href = `/order-success?orderId=${verifyData.orderId}`;
          } catch {
            setError(
              "Payment was received, but we could not verify it. Please contact support.",
            );
          } finally {
            setIsProcessing(false);
          }
        },
      });

      razorpay.open();
    } catch {
      setError("Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  }

  if (!loaded) {
    return (
      <main className="min-h-screen bg-[#F5EBDD] px-5 py-20 text-center">
        <p className="text-sm text-[#806D60]">Loading checkout...</p>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-[#F5EBDD] text-[#2B2020]">
        <header className="border-b border-[#3A1A1B]/10">
          <div className="mx-auto max-w-7xl px-5 py-5 lg:px-10">
            <Link
              href="/"
              className="text-xl font-semibold tracking-[0.12em] text-[#3A1A1B] sm:text-2xl"
            >
              AURA <span className="font-light">OF SHREE</span>
              <span className="mt-1 block text-center text-[9px] tracking-[0.42em]">
                JWELLERY
              </span>
            </Link>
          </div>
        </header>

        <section className="mx-auto max-w-2xl px-5 py-20 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-[#967344]">
            Checkout
          </p>

          <h1 className="mt-4 font-serif text-4xl text-[#3A1A1B]">
            Your bag is empty
          </h1>

          <p className="mt-4 text-sm text-[#806D60]">
            Add something beautiful to your bag before continuing.
          </p>

          <Link
            href="/products"
            className="mt-8 inline-block bg-[#3A1A1B] px-7 py-4 text-sm text-[#FFF9F0] transition hover:bg-[#54292A]"
          >
            Explore Jewellery
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5EBDD] text-[#2B2020]">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />

      <header className="border-b border-[#3A1A1B]/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-10">
          <Link
            href="/"
            className="text-xl font-semibold tracking-[0.12em] text-[#3A1A1B] sm:text-2xl"
          >
            AURA <span className="font-light">OF SHREE</span>
            <span className="mt-1 block text-center text-[9px] tracking-[0.42em]">
              JWELLERY
            </span>
          </Link>

          <Link
            href="/cart"
            className="text-sm text-[#3A1A1B] underline underline-offset-4"
          >
            Back to Bag
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-10 lg:py-16">
        <p className="text-xs uppercase tracking-[0.25em] text-[#967344]">
          Secure checkout
        </p>

        <h1 className="mt-4 font-serif text-4xl text-[#3A1A1B] sm:text-5xl">
          Complete Your Order
        </h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          <form onSubmit={handleSubmit} className="bg-[#FFF9F0] p-6 sm:p-8">
            <h2 className="font-serif text-2xl text-[#3A1A1B]">
              Shipping Details
            </h2>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="fullName" className="text-sm text-[#3A1A1B]">
                  Full name
                </label>

                <input
                  id="fullName"
                  required
                  value={form.fullName}
                  onChange={(event) =>
                    updateField("fullName", event.target.value)
                  }
                  className="mt-2 w-full border border-[#3A1A1B]/20 bg-white px-4 py-3 text-sm outline-none focus:border-[#3A1A1B]"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="phone" className="text-sm text-[#3A1A1B]">
                  Mobile number
                </label>

                <input
                  id="phone"
                  required
                  inputMode="numeric"
                  maxLength={10}
                  value={form.phone}
                  onChange={(event) =>
                    updateField("phone", event.target.value.replace(/\D/g, ""))
                  }
                  className="mt-2 w-full border border-[#3A1A1B]/20 bg-white px-4 py-3 text-sm outline-none focus:border-[#3A1A1B]"
                  placeholder="10-digit mobile number"
                />
              </div>

              <div>
                <label htmlFor="postalCode" className="text-sm text-[#3A1A1B]">
                  Postal code
                </label>

                <input
                  id="postalCode"
                  required
                  inputMode="numeric"
                  maxLength={6}
                  value={form.postalCode}
                  onChange={(event) =>
                    updateField(
                      "postalCode",
                      event.target.value.replace(/\D/g, ""),
                    )
                  }
                  className="mt-2 w-full border border-[#3A1A1B]/20 bg-white px-4 py-3 text-sm outline-none focus:border-[#3A1A1B]"
                  placeholder="6-digit PIN code"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="addressLine1"
                  className="text-sm text-[#3A1A1B]"
                >
                  Address
                </label>

                <input
                  id="addressLine1"
                  required
                  value={form.addressLine1}
                  onChange={(event) =>
                    updateField("addressLine1", event.target.value)
                  }
                  className="mt-2 w-full border border-[#3A1A1B]/20 bg-white px-4 py-3 text-sm outline-none focus:border-[#3A1A1B]"
                  placeholder="House number, street, area"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="addressLine2"
                  className="text-sm text-[#3A1A1B]"
                >
                  Address line 2
                  <span className="ml-1 text-xs text-[#806D60]">
                    (optional)
                  </span>
                </label>

                <input
                  id="addressLine2"
                  value={form.addressLine2}
                  onChange={(event) =>
                    updateField("addressLine2", event.target.value)
                  }
                  className="mt-2 w-full border border-[#3A1A1B]/20 bg-white px-4 py-3 text-sm outline-none focus:border-[#3A1A1B]"
                  placeholder="Landmark, apartment, etc."
                />
              </div>

              <div>
                <label htmlFor="city" className="text-sm text-[#3A1A1B]">
                  City
                </label>

                <input
                  id="city"
                  required
                  value={form.city}
                  onChange={(event) => updateField("city", event.target.value)}
                  className="mt-2 w-full border border-[#3A1A1B]/20 bg-white px-4 py-3 text-sm outline-none focus:border-[#3A1A1B]"
                  placeholder="City"
                />
              </div>

              <div>
                <label htmlFor="state" className="text-sm text-[#3A1A1B]">
                  State
                </label>

                <input
                  id="state"
                  required
                  value={form.state}
                  onChange={(event) => updateField("state", event.target.value)}
                  className="mt-2 w-full border border-[#3A1A1B]/20 bg-white px-4 py-3 text-sm outline-none focus:border-[#3A1A1B]"
                  placeholder="State"
                />
              </div>
            </div>

            {error ? (
              <div className="mt-6 border border-[#3A1A1B]/15 bg-[#F5EBDD] px-4 py-3 text-sm text-[#3A1A1B]">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isProcessing}
              className="mt-7 w-full bg-[#3A1A1B] px-6 py-4 text-sm text-[#FFF9F0] transition hover:bg-[#54292A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isProcessing
                ? "Opening Secure Payment..."
                : "Place Order & Pay →"}
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-[#806D60]">
              Your final price and stock availability will be verified securely
              by the server before payment.
            </p>
          </form>

          <aside className="h-fit bg-[#FFF9F0] p-6 sm:p-8">
            <h2 className="font-serif text-2xl text-[#3A1A1B]">
              Order Summary
            </h2>

            <div className="mt-6 space-y-5">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between gap-4 text-sm"
                >
                  <div>
                    <p className="text-[#3A1A1B]">{item.name}</p>
                    <p className="mt-1 text-xs text-[#806D60]">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <span className="shrink-0 text-[#3A1A1B]">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="my-6 h-px bg-[#3A1A1B]/10" />

            <div className="flex justify-between text-sm">
              <span className="text-[#806D60]">Subtotal</span>
              <span className="text-[#3A1A1B]">{formatPrice(subtotal)}</span>
            </div>

            <div className="mt-4 flex justify-between text-sm">
              <span className="text-[#806D60]">Shipping</span>
              <span className="text-[#3A1A1B]">
                {estimatedShipping === 0
                  ? "Free"
                  : formatPrice(estimatedShipping)}
              </span>
            </div>

            <div className="my-6 h-px bg-[#3A1A1B]/10" />

            <div className="flex justify-between">
              <span className="font-medium text-[#3A1A1B]">Total</span>

              <span className="font-semibold text-[#3A1A1B]">
                {formatPrice(estimatedTotal)}
              </span>
            </div>

            <p className="mt-5 text-xs leading-5 text-[#806D60]">
              This is an estimated total. The server will recalculate the actual
              amount before payment.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
