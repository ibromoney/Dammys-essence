import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = await params;

  const supabase = createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#FFF9FF] pt-24">
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-20">

        {/* Back button */}
        <Link
          href="/shop"
          className="mb-10 inline-flex items-center gap-2 text-sm text-[#41004C]/60 transition hover:text-[#750080]"
          data-aos="fade-right"
        >
          <ArrowLeft size={18} />
          Back to Collection
        </Link>

        {/* Product */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">

          {/* Image */}
          <div
            className="relative overflow-hidden rounded-3xl bg-[#F6EAF8]"
            data-aos="fade-right"
            data-aos-delay="150"
          >
            <div
              className="relative aspect-4/5"
              data-aos="zoom-in"
              data-aos-delay="250"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">

            {/* Category */}
            <p
              className="text-sm font-medium uppercase tracking-[0.3em] text-[#750080]"
              data-aos="fade-down"
              data-aos-delay="200"
            >
              {product.category}
            </p>

            {/* Name */}
            <h1
              className="mt-4 font-serif text-5xl text-[#41004C] md:text-6xl"
              data-aos="fade-left"
              data-aos-delay="300"
            >
              {product.name}
            </h1>

            {/* Price */}
            <p
              className="mt-6 text-2xl font-semibold text-[#750080]"
              data-aos="fade-left"
              data-aos-delay="400"
            >
              ₦{Number(product.price).toLocaleString()}
            </p>

            {/* Divider */}
            <div
              className="my-8 h-px bg-[#41004C]/10"
              data-aos="fade-in"
              data-aos-delay="450"
            />

            {/* Description */}
            <p
              className="max-w-xl text-base leading-8 text-[#41004C]/65"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              {product.description}
            </p>

            {/* Size / Frame */}
            {product.size && (
              <div
                className="mt-8"
                data-aos="fade-up"
                data-aos-delay="550"
              >
                <p className="text-sm font-medium text-[#41004C]">
                  {product.type === "fragrance" ? "Size" : "Frame"}
                </p>

                <div className="mt-3 inline-flex rounded-full border border-[#41004C]/20 bg-white px-5 py-2.5 text-sm text-[#41004C]">
                  {product.size}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div
              className="mt-8"
              data-aos="fade-up"
              data-aos-delay="600"
            >
              <p className="text-sm font-medium text-[#41004C]">
                Quantity
              </p>

              <div className="mt-3 flex w-fit items-center rounded-full border border-[#41004C]/15 bg-white">
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center text-[#41004C] transition hover:text-[#750080]"
                >
                  <Minus size={16} />
                </button>

                <span className="w-10 text-center text-sm font-medium text-[#41004C]">
                  1
                </span>

                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center text-[#41004C] transition hover:text-[#750080]"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div
              className="mt-8 flex flex-col gap-3 sm:flex-row"
              data-aos="fade-up"
              data-aos-delay="650"
            >
              <button
                type="button"
                className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-full bg-[#41004C] px-7 text-sm font-medium text-[#FFF9FF] transition hover:bg-[#750080]"
              >
                <ShoppingBag size={18} />
                Add to Cart
              </button>

              <button
                type="button"
                aria-label="Add to wishlist"
                className="flex min-h-14 w-14 items-center justify-center rounded-full border border-[#41004C]/15 bg-white text-[#41004C] transition hover:border-[#750080] hover:text-[#750080]"
              >
                <Heart size={19} />
              </button>
            </div>

            {/* Small note */}
            <p
              className="mt-6 text-xs leading-6 text-[#41004C]/45"
              data-aos="fade-up"
              data-aos-delay="700"
            >
              {product.type === "fragrance"
                ? "Carefully selected fragrances crafted to leave a lasting impression."
                : "Carefully selected eyewear designed to complement your style and presence."}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}