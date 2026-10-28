"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

type Product = {
  id: number;
  name: string;
  type: "fragrance" | "sunglasses";
  category: string;
  price: number;
  image: string;
  description: string;
  size?: string | null;
};

type ProductDetailsProps = {
  product: Product;
};

export default function ProductDetails({
  product,
}: ProductDetailsProps) {
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const price = Number(product.price) || 0;

  function handleAddToCart() {
    for (let i = 0; i < quantity; i++) {
  addToCart(product);
}
    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 2200);
  }

  function toggleWishlist() {
    const nextValue = !wishlisted;
    setWishlisted(nextValue);

    try {
      const saved = JSON.parse(
        localStorage.getItem("dammys-essence-wishlist") || "[]",
      ) as number[];

      const updated = nextValue
        ? [...new Set([...saved, product.id])]
        : saved.filter((id) => id !== product.id);

      localStorage.setItem(
        "dammys-essence-wishlist",
        JSON.stringify(updated),
      );
    } catch {
      // The button still works for this session if storage is unavailable.
    }
  }

  return (
    <main className="min-h-screen bg-[#FFF9FF] pb-20 pt-28 text-[#41004C]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Link
          href="/shop"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#41004C]/10 bg-white px-4 py-2.5 text-sm font-medium text-[#41004C]/70 transition hover:border-[#750080]/30 hover:text-[#750080]"
        >
          <ArrowLeft size={16} />
          Back to collection
        </Link>

        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Product image */}
          <div className="lg:sticky lg:top-28">
            <div className="relative overflow-hidden rounded-4xl border border-[#41004C]/5 bg-[#F6EAF8]">
              <div className="absolute left-5 top-5 z-10 rounded-full border border-white/70 bg-white/85 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#750080] backdrop-blur-md">
                {product.type === "fragrance"
                  ? "Signature fragrance"
                  : "Style collection"}
              </div>

              <div className="relative aspect-4/5">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover transition duration-700 hover:scale-[1.04]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-[#41004C]/10 to-transparent" />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-[#41004C]/8 bg-white p-4 text-center">
                <ShieldCheck className="mx-auto mb-2 text-[#750080]" size={21} />
                <p className="text-xs font-medium">Quality picks</p>
              </div>

              <div className="rounded-2xl border border-[#41004C]/8 bg-white p-4 text-center">
                <ShoppingBag className="mx-auto mb-2 text-[#750080]" size={21} />
                <p className="text-xs font-medium">Easy ordering</p>
              </div>

              <div className="rounded-2xl border border-[#41004C]/8 bg-white p-4 text-center">
                <Truck className="mx-auto mb-2 text-[#750080]" size={21} />
                <p className="text-xs font-medium">Delivery options</p>
              </div>
            </div>
          </div>

          {/* Product information */}
          <section className="flex flex-col py-2 lg:py-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#750080]">
              {product.category}
            </p>

            <h1 className="mt-4 font-serif text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {product.name}
            </h1>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#41004C]/10 pb-6">
              <p className="text-3xl font-semibold tracking-tight text-[#750080]">
                {price.toLocaleString("en-NG", {
                  style: "currency",
                  currency: "NGN",
                  maximumFractionDigits: 0,
                })}
              </p>

              <span className="rounded-full bg-[#F6EAF8] px-3 py-1.5 text-xs font-medium text-[#750080]">
                {product.type === "fragrance" ? "Fragrance" : "Eyewear"}
              </span>
            </div>

            <div className="py-7">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#750080]/80">
                The experience
              </p>

              <p className="max-w-xl text-sm leading-8 text-[#41004C]/70 sm:text-base">
                {product.description}
              </p>
            </div>

            {product.size && (
              <div className="border-t border-[#41004C]/10 py-6">
                <p className="text-sm font-semibold">
                  {product.type === "fragrance" ? "Size" : "Frame"}
                </p>

                <span className="mt-3 inline-flex rounded-xl border border-[#41004C]/15 bg-white px-5 py-3 text-sm">
                  {product.size}
                </span>
              </div>
            )}

            {/* Quantity selector */}
            <div className="border-t border-[#41004C]/10 py-6">
              <p className="mb-3 text-sm font-semibold">Quantity</p>

              <div className="flex w-fit items-center rounded-full border border-[#41004C]/15 bg-white p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#F6EAF8] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Minus size={15} />
                </button>

                <span
                  aria-live="polite"
                  className="w-12 text-center text-sm font-semibold tabular-nums"
                >
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.min(20, current + 1))}
                  disabled={quantity >= 20}
                  aria-label="Increase quantity"
                  className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#F6EAF8] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Plus size={15} />
                </button>
              </div>

              <p className="mt-3 text-xs text-[#41004C]/45">
                Maximum 20 items per product.
              </p>
            </div>

            {/* Action buttons */}
            <div className="mt-2 flex gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-full bg-[#41004C] px-5 text-sm font-semibold text-white shadow-lg shadow-[#41004C]/10 transition hover:bg-[#750080] active:scale-[0.98]"
              >
                {added ? <Check size={19} /> : <ShoppingBag size={19} />}
                {added ? "Added to bag!" : "Add to bag"}
              </button>

              <button
                type="button"
                onClick={toggleWishlist}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                aria-pressed={wishlisted}
                className={`flex min-h-14 w-14 shrink-0 items-center justify-center rounded-full border transition ${
                  wishlisted
                    ? "border-[#750080] bg-[#F6EAF8] text-[#750080]"
                    : "border-[#41004C]/15 bg-white text-[#41004C] hover:border-[#750080] hover:text-[#750080]"
                }`}
              >
                <Heart size={20} fill={wishlisted ? "currentColor" : "none"} />
              </button>
            </div>

            <p className="mt-4 text-center text-xs text-[#41004C]/50">
              {added
                ? `${quantity} ${quantity === 1 ? "item" : "items"} added to your shopping bag.`
                : "A thoughtful choice. A lasting impression."}
            </p>

            <div className="mt-8 rounded-2xl border border-[#750080]/10 bg-[#F6EAF8]/60 p-5">
              <p className="font-serif text-lg">The Dammys Essence promise</p>
              <p className="mt-2 text-sm leading-7 text-[#41004C]/65">
                Discover your signature style with carefully selected
                fragrances and eyewear. Add your favourite to your bag
                whenever you are ready.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}