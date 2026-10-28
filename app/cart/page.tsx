"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, cartCount, subtotal, updateQuantity, removeFromCart } =
    useCart();

  const formatPrice = (amount: number) =>
    `₦${Number(amount).toLocaleString("en-NG", {
      maximumFractionDigits: 2,
    })}`;

  return (
    <main className="min-h-screen bg-[#FFF9FF] px-4 pb-20 pt-32 text-[#41004C] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-10 border-b border-[#41004C]/10 pb-8">
          <Link
            href="/shop"
            className="mb-6 inline-flex items-center gap-2 text-sm text-[#41004C]/65 transition hover:text-[#750080]"
          >
            <ArrowLeft size={16} />
            Continue shopping
          </Link>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-[#750080]">
                YOUR SELECTION
              </p>
              <h1 className="font-serif text-4xl font-normal sm:text-5xl">
                Shopping <span className="italic text-[#750080]">Bag.</span>
              </h1>
              <p className="mt-3 text-sm text-[#41004C]/60">
                Your favourite fragrances, gathered in one place.
              </p>
            </div>

            <span className="rounded-full border border-[#750080]/15 bg-[#F6EAF8] px-4 py-2 text-sm">
              {cartCount} {cartCount === 1 ? "item" : "items"}
            </span>
          </div>
        </div>

        {/* Empty cart */}
        {items.length === 0 ? (
          <section className="mx-auto flex max-w-xl flex-col items-center py-16 text-center sm:py-24">
            <div className="mb-6 grid h-20 w-20 place-items-center rounded-full bg-[#F6EAF8] text-[#750080]">
              <ShoppingBag size={32} strokeWidth={1.4} />
            </div>

            <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-[#750080]">
              A LITTLE SPACE FOR SOMETHING SPECIAL
            </p>

            <h2 className="font-serif text-3xl sm:text-4xl">
              Your bag is empty.
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-7 text-[#41004C]/60">
              Discover a fragrance that speaks to your personality and make it
              part of your collection.
            </p>

            <Link
              href="/shop"
              className="mt-8 inline-flex items-center gap-3 bg-[#41004C] px-7 py-4 text-xs font-semibold tracking-[0.15em] text-white transition hover:bg-[#750080]"
            >
              EXPLORE THE COLLECTION
              <ArrowRight size={16} />
            </Link>
          </section>
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-[1fr_360px]">
            {/* Cart items */}
            <section className="min-w-0">
              <div className="mb-4 hidden grid-cols-[minmax(0,1fr)_110px_120px] gap-4 border-b border-[#41004C]/10 pb-3 text-[10px] font-semibold tracking-[0.15em] text-[#41004C]/45 sm:grid">
                <span>PRODUCT</span>
                <span className="text-center">QUANTITY</span>
                <span className="text-right">TOTAL</span>
              </div>

              <div className="divide-y divide-[#41004C]/10">
                {items.map((item, index) => (
                  <article
                    key={`${item.id}-${index}`}
                    className="grid gap-4 py-6 sm:grid-cols-[minmax(0,1fr)_110px_120px] sm:items-center"
                  >
                    {/* Product details */}
                    <div className="flex min-w-0 gap-4">
                      <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-[#F6EAF8] sm:h-32 sm:w-28">
                        {item.image?.trim() ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="(max-width: 640px) 96px, 112px"
                            className="object-contain p-2"
                          />
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-3 text-center text-[#750080]/60">
                            <ShoppingBag size={28} strokeWidth={1.3} />
                            <span className="text-[10px]">
                              Image unavailable
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex min-w-0 flex-col items-start py-1">
                        <span className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#750080]">
                          {item.type === "sunglasses"
                            ? "Eyewear"
                            : item.category || "Fragrance"}
                        </span>

                        <h2 className="font-serif text-lg leading-snug sm:text-xl">
                          {item.name}
                        </h2>

                        {item.size && (
                          <p className="mt-1 text-xs text-[#41004C]/55">
                            Size: {item.size}
                          </p>
                        )}

                        <p className="mt-2 text-sm font-medium">
                          {formatPrice(Number(item.price))}
                        </p>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="mt-auto inline-flex items-center gap-1.5 pt-3 text-xs text-[#41004C]/50 transition hover:text-red-700"
                        >
                          <Trash2 size={13} />
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between sm:justify-center">
                      <span className="text-xs text-[#41004C]/50 sm:hidden">
                        Quantity
                      </span>

                      <div className="flex items-center rounded-full border border-[#41004C]/15 bg-white">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-[#F6EAF8] disabled:cursor-not-allowed disabled:opacity-35"
                        >
                          <Minus size={13} />
                        </button>

                        <span className="min-w-7 text-center text-sm tabular-nums">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          aria-label={`Increase quantity of ${item.name}`}
                          className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-[#F6EAF8]"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Line total */}
                    <div className="flex items-center justify-between sm:justify-end">
                      <span className="text-xs text-[#41004C]/50 sm:hidden">
                        Item total
                      </span>

                      <p className="text-sm font-semibold tabular-nums">
                        {formatPrice(Number(item.price) * item.quantity)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>

              <Link
                href="/shop"
                className="mt-5 inline-flex items-center gap-2 text-sm text-[#750080] transition hover:text-[#41004C]"
              >
                <ArrowLeft size={15} />
                Continue shopping
              </Link>
            </section>

            {/* Order summary */}
            <aside className="rounded-2xl border border-[#41004C]/10 bg-white p-6 shadow-sm sm:p-7 lg:sticky lg:top-28">
              <p className="text-xs font-semibold tracking-[0.2em] text-[#750080]">
                YOUR ORDER
              </p>

              <h2 className="mt-3 font-serif text-2xl">Order summary</h2>

              <div className="mt-7 space-y-4 border-b border-[#41004C]/10 pb-5 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#41004C]/60">
                    Subtotal ({cartCount} {cartCount === 1 ? "item" : "items"})
                  </span>
                  <span className="font-medium tabular-nums">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <span className="text-[#41004C]/60">Delivery</span>
                  <span className="max-w-36 text-right text-xs leading-5 text-[#41004C]/55">
                    Calculated at checkout
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 py-5">
                <span className="font-medium">Estimated total</span>
                <span className="font-serif text-xl font-semibold tabular-nums">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <p className="mb-5 text-xs leading-5 text-[#41004C]/50">
                Delivery charges will be added once your delivery details are
                confirmed.
              </p>

              <Link
                href="/checkout"
                style={{ color: "#FFFFFF" }}
                className="flex w-full items-center justify-center gap-3 bg-[#41004C] px-5 py-4 text-xs font-semibold tracking-[0.13em]"
              >
                <span style={{ color: "#FFFFFF" }}>PROCEED TO CHECKOUT</span>
                <ArrowRight size={16} color="#FFFFFF" />
              </Link>

              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-[#41004C]/55">
                <ShieldCheck size={16} className="text-[#750080]" />
                Secure checkout experience
              </div>

              <div className="mt-6 border-t border-[#41004C]/10 pt-5 text-center">
                <p className="font-serif text-sm italic text-[#750080]">
                  More than a scent. It&apos;s an essence.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
