
"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  MapPin,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Printer,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

type DeliveryMethod = "delivery" | "pickup";
type PaymentMethod = "online" | "pay_on_delivery";

type CompletedOrder = {
  success: boolean;
  order: {
    id: number;
    orderNumber: string;
    subtotal: number;
    deliveryFee: number;
    totalAmount: number;
    paymentStatus: string;
    orderStatus: string;
    paymentMethod: PaymentMethod;
  };
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  delivery: {
    method: DeliveryMethod;
    address: string | null;
    city: string | null;
    state: string | null;
  };
  items: Array<{
    productId: number;
    name: string;
    type: string;
    image: string | null;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }>;
  message: string;
};

export default function CheckoutPage() {
  const { items, cartCount, subtotal, clearCart } = useCart();

  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>("delivery");

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("online");

  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] =
    useState<CompletedOrder | null>(null);

  const formatPrice = (amount: number) =>
    `₦${Number(amount).toLocaleString("en-NG", {
      maximumFractionDigits: 2,
    })}`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) return;

    if (items.length === 0) {
      setNotice("Your bag is empty. Add a product before placing an order.");
      return;
    }
    

    const formData = new FormData(event.currentTarget);

    setSubmitting(true);
    setNotice("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: formData.get("fullName"),
          customerEmail: formData.get("email"),
          customerPhone: formData.get("phone"),
          deliveryMethod,
          paymentMethod,
          address: formData.get("address"),
          city: formData.get("city"),
          state: formData.get("state"),
          items: items.map((item) => ({
            productId: Number(item.id),
            quantity: item.quantity,
          })),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setNotice(
          result.error ||
            "We couldn't create your order. Please try again.",
        );
        return;
      }

      if (
        !result.success ||
        !result.order?.orderNumber ||
        !Array.isArray(result.items) ||
        !result.customer ||
        !result.delivery
      ) {
        setNotice(
          "The order response was incomplete. Please contact Dammys Essence before placing another order.",
        );
        return;
      }

setCompletedOrder(result as CompletedOrder);
clearCart();
    } catch (error) {
      console.error("Checkout submission failed:", error);
      setNotice("Unable to reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Show the receipt before checking whether the cart is empty.
  if (completedOrder) {
    const order = completedOrder;

    return (
      <main
        id="order-receipt"
        className="min-h-screen bg-[#FFF9FF] px-4 pb-16 pt-28 text-[#41004C] sm:px-6"
      >
        <style jsx global>{`
          @media print {
            body * {
              visibility: hidden;
            }

            #order-receipt,
            #order-receipt * {
              visibility: visible;
            }

            #order-receipt {
              position: absolute;
              inset: 0;
              width: 100%;
              padding: 24px;
              background: white !important;
            }

            .no-print {
              display: none !important;
            }

            #order-receipt .receipt-card {
              break-inside: avoid;
              box-shadow: none !important;
              border: none !important;
            }
          }
        `}</style>

        <div className="mx-auto max-w-3xl">
          <section className="receipt-card rounded-3xl border border-[#41004C]/10 bg-white p-6 shadow-sm sm:p-10">
            <div className="text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#F6EAF8] text-[#750080]">
                <CheckCircle2 size={34} />
              </div>

              <p className="mt-6 text-xs font-semibold tracking-[0.25em] text-[#750080]">
                DAMMYS ESSENCE
              </p>

              <h1 className="mt-3 font-serif text-3xl sm:text-4xl">
                Thank you for your order!
              </h1>

              <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#41004C]/65">
                You have successfully placed your order. Your order is
                expected to arrive in 3–4 days after the admin confirms it.
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-[#F6EAF8]/70 p-5 text-center">
              <p className="text-xs tracking-widest text-[#41004C]/60">
                YOUR ORDER NUMBER
              </p>

              <p className="mt-2 break-all font-serif text-2xl font-semibold text-[#750080]">
                {order.order.orderNumber}
              </p>

              <p className="mt-3 text-xs text-[#41004C]/65">
                Order status:{" "}
                <span className="font-semibold capitalize">
                  {order.order.orderStatus}
                </span>
                {" · "}
                Payment:{" "}
                <span className="font-semibold capitalize">
                  {order.order.paymentStatus}
                </span>
              </p>
            </div>

            <div className="mt-8">
              <h2 className="font-serif text-xl">Order summary</h2>

              <div className="mt-4 divide-y divide-[#41004C]/10 border-y border-[#41004C]/10">
                {order.items.map((item, index) => (
                  <div
                    key={`${item.productId}-${index}`}
                    className="flex items-start justify-between gap-4 py-4"
                  >
                    <div className="min-w-0">
                      <p className="font-medium">{item.name}</p>

                      <p className="mt-1 text-xs text-[#41004C]/60">
                        Qty: {item.quantity} ×{" "}
                        {formatPrice(item.unitPrice)}
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-semibold tabular-nums">
                      {formatPrice(item.lineTotal)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-[#41004C]/60">Subtotal</span>
                  <span>{formatPrice(order.order.subtotal)}</span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-[#41004C]/60">Delivery fee</span>
                  <span>{formatPrice(order.order.deliveryFee)}</span>
                </div>

                <div className="flex justify-between gap-4 border-t border-[#41004C]/10 pt-4 text-base font-semibold">
                  <span>Total</span>
                  <span className="tabular-nums">
                    {formatPrice(order.order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-6 border-t border-[#41004C]/10 pt-6 sm:grid-cols-2">
              <div>
                <h2 className="font-serif text-lg">Customer details</h2>

                <div className="mt-3 space-y-2 text-sm leading-6 text-[#41004C]/70">
                  <p>{order.customer.name}</p>
                  <p className="break-all">{order.customer.email}</p>
                  <p>{order.customer.phone}</p>
                </div>
              </div>

              <div>
                <h2 className="font-serif text-lg">Delivery details</h2>

                <div className="mt-3 space-y-2 text-sm leading-6 text-[#41004C]/70">
                  <p className="capitalize">
                    {order.delivery.method === "delivery"
                      ? "Home delivery"
                      : "Customer pickup"}
                  </p>

                  {order.delivery.method === "delivery" ? (
                    <>
                      <p>{order.delivery.address}</p>
                      <p>
                        {[order.delivery.city, order.delivery.state]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </>
                  ) : (
                    <p>
                      Pickup arrangements will be confirmed by Dammys
                      Essence.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-[#750080]/15 bg-[#FFF9FF] p-4">
              <p className="text-sm font-semibold">Payment information</p>

              <p className="mt-2 text-xs leading-6 text-[#41004C]/65">
                {order.order.paymentMethod === "online"
                  ? "Online payment has not been connected yet. Your payment is pending; this receipt does not confirm payment."
                  : "Payment is pending and will be collected according to your selected payment arrangement."}
              </p>

              <p className="mt-2 text-xs leading-6 text-[#41004C]/65">
                Your order is awaiting admin confirmation. The estimated
                3–4-day delivery period begins after confirmation.
              </p>
            </div>

            <p className="mt-8 text-center font-serif text-sm italic text-[#750080]">
              More than a scent. It&apos;s an essence.
            </p>

            <div className="no-print mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex flex-1 items-center justify-center gap-3 bg-[#41004C] px-5 py-4 text-xs font-semibold tracking-widest text-white transition hover:bg-[#750080]"
              >
                <Printer size={17} />
                PRINT / SAVE RECEIPT
              </button>

              <Link
                href="/shop"
                className="flex flex-1 items-center justify-center gap-3 border border-[#41004C]/15 px-5 py-4 text-xs font-semibold tracking-widest text-[#41004C] transition hover:border-[#750080] hover:text-[#750080]"
              >
                CONTINUE SHOPPING
                <ArrowRight size={16} />
              </Link>
            </div>

            <p className="no-print mt-4 text-center text-xs leading-5 text-[#41004C]/50">
              To save a copy, choose &quot;Save as PDF&quot; in your
              browser&apos;s print window.
            </p>
          </section>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFF9FF] px-4 pb-16 pt-32 text-[#41004C]">
        <section className="w-full max-w-lg text-center">
          <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-[#F6EAF8] text-[#750080]">
            <ShoppingBag size={32} strokeWidth={1.4} />
          </div>

          <p className="text-xs font-semibold tracking-[0.25em] text-[#750080]">
            DAMMYS ESSENCE
          </p>

          <h1 className="mt-4 font-serif text-4xl">
            Your bag is empty.
          </h1>

          <p className="mt-4 text-sm leading-7 text-[#41004C]/60">
            Add your favourite fragrances to your bag before proceeding
            to checkout.
          </p>

          <Link
            href="/shop"
            className="mt-8 inline-flex items-center gap-3 bg-[#41004C] px-7 py-4 text-xs font-semibold tracking-[0.12em] text-white transition hover:bg-[#750080]"
          >
            EXPLORE THE COLLECTION
            <ArrowRight size={16} />
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF9FF] px-4 pb-20 pt-32 text-[#41004C] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 border-b border-[#41004C]/10 pb-8">
          <Link
            href="/cart"
            className="mb-6 inline-flex items-center gap-2 text-sm text-[#41004C]/60 transition hover:text-[#750080]"
          >
            <ArrowLeft size={16} />
            Back to bag
          </Link>

          <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-[#750080]">
            THE FINAL TOUCH
          </p>

          <h1 className="font-serif text-4xl font-normal sm:text-5xl">
            Secure your{" "}
            <span className="italic text-[#750080]">essence.</span>
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-7 text-[#41004C]/60">
            Add your details, choose how to receive your order, and select
            your preferred payment method.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          onChange={() => setNotice("")}
          className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]"
        >
          <div className="space-y-7">
            {/* Customer information */}
            <section className="rounded-2xl border border-[#41004C]/10 bg-white p-5 sm:p-8">
              <div className="mb-7 flex items-center gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-[#F6EAF8] text-[#750080]">
                  <PackageCheck size={21} />
                </div>

                <div>
                  <p className="text-xs font-semibold tracking-[0.15em] text-[#750080]">
                    STEP 01
                  </p>
                  <h2 className="mt-1 font-serif text-2xl">
                    Your details
                  </h2>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-medium"
                  >
                    Full name *
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    required
                    minLength={2}
                    className="w-full rounded-xl border border-[#41004C]/15 bg-[#FFF9FF] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#41004C]/35 focus:border-[#750080] focus:ring-2 focus:ring-[#750080]/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium"
                  >
                    Email address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl border border-[#41004C]/15 bg-[#FFF9FF] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#41004C]/35 focus:border-[#750080] focus:ring-2 focus:ring-[#750080]/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium"
                  >
                    Phone number *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="e.g. 08012345678"
                    required
                    minLength={7}
                    className="w-full rounded-xl border border-[#41004C]/15 bg-[#FFF9FF] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#41004C]/35 focus:border-[#750080] focus:ring-2 focus:ring-[#750080]/10"
                  />
                </div>
              </div>
            </section>

            {/* Delivery or pickup */}
            <section className="rounded-2xl border border-[#41004C]/10 bg-white p-5 sm:p-8">
              <div className="mb-7 flex items-center gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-[#F6EAF8] text-[#750080]">
                  <Truck size={21} />
                </div>

                <div>
                  <p className="text-xs font-semibold tracking-[0.15em] text-[#750080]">
                    STEP 02
                  </p>
                  <h2 className="mt-1 font-serif text-2xl">
                    How will you receive it?
                  </h2>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  aria-pressed={deliveryMethod === "delivery"}
                  onClick={() => {
                    setDeliveryMethod("delivery");
                    setNotice("");
                  }}
                  className={`rounded-xl border p-5 text-left transition ${
                    deliveryMethod === "delivery"
                      ? "border-[#750080] bg-[#F6EAF8]/70 ring-1 ring-[#750080]"
                      : "border-[#41004C]/15 hover:border-[#750080]/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Truck size={23} className="text-[#750080]" />
                    <span
                      className={`h-4 w-4 rounded-full border ${
                        deliveryMethod === "delivery"
                          ? "border-[#750080] bg-[#750080] ring-2 ring-white ring-offset-1 ring-offset-[#750080]"
                          : "border-[#41004C]/30"
                      }`}
                    />
                  </div>

                  <h3 className="mt-4 font-medium">Home delivery</h3>
                  <p className="mt-2 text-xs leading-5 text-[#41004C]/60">
                    Have your order delivered to your address.
                  </p>
                </button>

                <button
                  type="button"
                  aria-pressed={deliveryMethod === "pickup"}
                  onClick={() => {
                    setDeliveryMethod("pickup");
                    setNotice("");
                  }}
                  className={`rounded-xl border p-5 text-left transition ${
                    deliveryMethod === "pickup"
                      ? "border-[#750080] bg-[#F6EAF8]/70 ring-1 ring-[#750080]"
                      : "border-[#41004C]/15 hover:border-[#750080]/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <MapPin size={23} className="text-[#750080]" />
                    <span
                      className={`h-4 w-4 rounded-full border ${
                        deliveryMethod === "pickup"
                          ? "border-[#750080] bg-[#750080] ring-2 ring-white ring-offset-1 ring-offset-[#750080]"
                          : "border-[#41004C]/30"
                      }`}
                    />
                  </div>

                  <h3 className="mt-4 font-medium">Customer pickup</h3>
                  <p className="mt-2 text-xs leading-5 text-[#41004C]/60">
                    Collect your order from our designated pickup point.
                  </p>
                </button>
              </div>

              {deliveryMethod === "delivery" ? (
                <div className="mt-6 space-y-5">
                  <div>
                    <label
                      htmlFor="address"
                      className="mb-2 block text-sm font-medium"
                    >
                      Delivery address *
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      autoComplete="street-address"
                      placeholder="House number, street, area and nearby landmark"
                      required
                      rows={3}
                      className="w-full resize-y rounded-xl border border-[#41004C]/15 bg-[#FFF9FF] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#41004C]/35 focus:border-[#750080] focus:ring-2 focus:ring-[#750080]/10"
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="city"
                        className="mb-2 block text-sm font-medium"
                      >
                        City *
                      </label>
                      <input
                        id="city"
                        name="city"
                        autoComplete="address-level2"
                        placeholder="Your city"
                        required
                        className="w-full rounded-xl border border-[#41004C]/15 bg-[#FFF9FF] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#41004C]/35 focus:border-[#750080] focus:ring-2 focus:ring-[#750080]/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="state"
                        className="mb-2 block text-sm font-medium"
                      >
                        State *
                      </label>
                      <input
                        id="state"
                        name="state"
                        autoComplete="address-level1"
                        placeholder="Your state"
                        required
                        className="w-full rounded-xl border border-[#41004C]/15 bg-[#FFF9FF] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#41004C]/35 focus:border-[#750080] focus:ring-2 focus:ring-[#750080]/10"
                      />
                    </div>
                  </div>

                  <p className="flex items-start gap-2 text-xs leading-5 text-[#41004C]/55">
                    <MapPin
                      size={15}
                      className="mt-0.5 shrink-0 text-[#750080]"
                    />
                    Delivery fees will be confirmed before your order is
                    placed.
                  </p>
                </div>
              ) : (
                <div className="mt-6 rounded-xl bg-[#F6EAF8]/70 p-5">
                  <p className="font-medium">Pickup arrangements</p>
                  <p className="mt-2 text-sm leading-6 text-[#41004C]/65">
                    The pickup address and collection instructions will
                    need to be confirmed by Dammys Essence before collection.
                  </p>
                </div>
              )}
            </section>

            {/* Payment method */}
            <section className="rounded-2xl border border-[#41004C]/10 bg-white p-5 sm:p-8">
              <div className="mb-7 flex items-center gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-[#F6EAF8] text-[#750080]">
                  <CreditCard size={21} />
                </div>

                <div>
                  <p className="text-xs font-semibold tracking-[0.15em] text-[#750080]">
                    STEP 03
                  </p>
                  <h2 className="mt-1 font-serif text-2xl">
                    Payment method
                  </h2>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  type="button"
                  aria-pressed={paymentMethod === "online"}
                  onClick={() => {
                    setPaymentMethod("online");
                    setNotice("");
                  }}
                  className={`flex w-full items-start gap-4 rounded-xl border p-5 text-left transition ${
                    paymentMethod === "online"
                      ? "border-[#750080] bg-[#F6EAF8]/70 ring-1 ring-[#750080]"
                      : "border-[#41004C]/15 hover:border-[#750080]/50"
                  }`}
                >
                  <CreditCard
                    size={22}
                    className="mt-0.5 shrink-0 text-[#750080]"
                  />

                  <div className="flex-1">
                    <h3 className="font-medium">Pay online</h3>
                    <p className="mt-1 text-xs leading-5 text-[#41004C]/60">
                      Pay electronically through a secure payment provider.
                    </p>
                  </div>

                  <span
                    className={`mt-1 h-4 w-4 shrink-0 rounded-full border ${
                      paymentMethod === "online"
                        ? "border-[#750080] bg-[#750080] ring-2 ring-white ring-offset-1 ring-offset-[#750080]"
                        : "border-[#41004C]/30"
                    }`}
                  />
                </button>

                <button
                  type="button"
                  aria-pressed={paymentMethod === "pay_on_delivery"}
                  onClick={() => {
                    setPaymentMethod("pay_on_delivery");
                    setNotice("");
                  }}
                  className={`flex w-full items-start gap-4 rounded-xl border p-5 text-left transition ${
                    paymentMethod === "pay_on_delivery"
                      ? "border-[#750080] bg-[#F6EAF8]/70 ring-1 ring-[#750080]"
                      : "border-[#41004C]/15 hover:border-[#750080]/50"
                  }`}
                >
                  <PackageCheck
                    size={22}
                    className="mt-0.5 shrink-0 text-[#750080]"
                  />

                  <div className="flex-1">
                    <h3 className="font-medium">
                      {deliveryMethod === "pickup"
                        ? "Pay on pickup"
                        : "Pay on delivery"}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-[#41004C]/60">
                      {deliveryMethod === "pickup"
                        ? "Pay when you collect your order."
                        : "Pay when your order arrives, subject to availability."}
                    </p>
                  </div>

                  <span
                    className={`mt-1 h-4 w-4 shrink-0 rounded-full border ${
                      paymentMethod === "pay_on_delivery"
                        ? "border-[#750080] bg-[#750080] ring-2 ring-white ring-offset-1 ring-offset-[#750080]"
                        : "border-[#41004C]/30"
                    }`}
                  />
                </button>
              </div>

              {paymentMethod === "online" && (
                <p className="mt-5 rounded-xl bg-[#F6EAF8]/70 p-4 text-xs leading-6 text-[#41004C]/65">
                  Online payment is not connected yet. A payment provider
                  must be integrated before customers can pay here.
                </p>
              )}
            </section>
          </div>

          {/* Order summary */}
          <aside className="rounded-2xl border border-[#41004C]/10 bg-white p-5 shadow-sm sm:p-7 lg:sticky lg:top-28">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#750080]">
              YOUR SELECTION
            </p>

            <h2 className="mt-3 font-serif text-2xl">Order summary</h2>

            <div className="mt-6 space-y-5">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-[#F6EAF8]">
                    {item.image?.trim() ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-contain p-1"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#750080]/60">
                        <ShoppingBag size={22} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{item.name}</p>

                    <p className="mt-1 text-xs text-[#41004C]/55">
                      Qty: {item.quantity}
                      {item.size ? ` · ${item.size}` : ""}
                    </p>

                    <p className="mt-2 text-sm font-medium">
                      {formatPrice(Number(item.price) * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-4 border-t border-[#41004C]/10 pt-5 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-[#41004C]/60">
                  Subtotal ({cartCount} {cartCount === 1 ? "item" : "items"})
                </span>
                <span className="font-medium tabular-nums">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-[#41004C]/60">Delivery</span>
                <span className="text-right text-xs text-[#41004C]/55">
                  {deliveryMethod === "pickup" ? "Pickup" : "Confirmed later"}
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#41004C]/10 pt-5">
              <span className="font-medium">Estimated total</span>
              <span className="font-serif text-xl font-semibold tabular-nums">
                {formatPrice(subtotal)}
              </span>
            </div>

            <p className="mt-3 text-xs leading-5 text-[#41004C]/50">
              This estimate excludes any delivery fees that may apply.
            </p>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 flex w-full items-center justify-center gap-3 bg-[#41004C] px-5 py-4 text-xs font-semibold tracking-widest text-white transition hover:bg-[#750080] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "PLACING ORDER..." : "PLACE ORDER"}
              {!submitting && <ArrowRight size={16} />}
            </button>

            {notice && (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-[#750080]/20 bg-[#F6EAF8] p-4"
              >
                <div className="flex items-start gap-2 text-[#41004C]">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-[#750080]"
                  />
                  <p className="text-xs leading-6">{notice}</p>
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center justify-center gap-2 border-t border-[#41004C]/10 pt-5 text-xs text-[#41004C]/55">
              <ShieldCheck size={16} className="text-[#750080]" />
              Your details should be handled securely
            </div>

            <p className="mt-5 text-center font-serif text-sm italic text-[#750080]">
              More than a scent. It&apos;s an essence.
            </p>
          </aside>
        </form>
      </div>
    </main>
  );
}
