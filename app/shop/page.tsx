"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ArrowRight, Glasses } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Filter = "all" | "fragrance" | "sunglasses";

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

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get("category");
  const collection = searchParams.get("collection");

  const filter: Filter =
    category === "fragrance" || category === "sunglasses"
      ? category
      : "all";

  useEffect(() => {
    const fetchProducts = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } else {
        setProducts(data ?? []);
      }

      setLoading(false);
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesType =
      filter === "all" || product.type === filter;

    const matchesCollection =
      !collection ||
      product.category.toLowerCase() === collection.toLowerCase();

    return matchesType && matchesCollection;
  });

  const changeFilter = (newFilter: Filter) => {
    if (newFilter === "all") {
      router.push("/shop");
    } else {
      router.push(`/shop?category=${newFilter}`);
    }
  };

  return (
    <main className="min-h-screen bg-[#FFF9FF] pt-24">
      <section className="mx-auto max-w-7xl px-6 py-16">

        {/* HEADER */}
        <div className="text-center">
          <p
            className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-[#750080]"
            data-aos="fade-down"
          >
            Dammys Essence
          </p>

          <h1
            className="font-serif text-5xl text-[#41004C] md:text-7xl"
            data-aos="zoom-in"
          >
            The Collection
          </h1>

          <p
            className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#41004C]/60 md:text-base"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Discover fragrances and accessories carefully selected to express
            your personality, presence, and essence.
          </p>
        </div>

        {/* FILTERS */}
        <div
          className="mt-12 flex flex-wrap items-center justify-center gap-3"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {[
            {
              label: "All",
              value: "all" as Filter,
            },
            {
              label: "Fragrances",
              value: "fragrance" as Filter,
            },
            {
              label: "Sunglasses",
              value: "sunglasses" as Filter,
            },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => changeFilter(item.value)}
              className={`rounded-full px-6 py-3 text-sm font-medium transition duration-300 ${
                filter === item.value
                  ? "bg-[#41004C] text-[#FFF9FF] shadow-lg"
                  : "border border-[#41004C]/10 bg-white text-[#41004C]/60 hover:border-[#750080] hover:text-[#750080]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* ACTIVE COLLECTION */}
        {collection && (
          <div className="mt-8 text-center" data-aos="fade-up">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#750080]">
              Collection
            </p>

            <h2 className="mt-2 font-serif text-3xl text-[#41004C]">
              {collection}
            </h2>
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="mt-20 flex flex-col items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#F6EAF8] border-t-[#750080]" />

            <p className="mt-5 text-sm text-[#41004C]/50">
              Loading our collection...
            </p>
          </div>
        ) : filter === "sunglasses" &&
          filteredProducts.length === 0 ? (
          /* SUNGLASSES COMING SOON */
          <div
            className="mx-auto mt-16 max-w-3xl overflow-hidden rounded-3xl border border-[#41004C]/10 bg-white p-10 text-center shadow-sm md:p-16"
            data-aos="zoom-in"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#F6EAF8] text-[#750080]">
              <Glasses size={34} strokeWidth={1.5} />
            </div>

            <p
              className="mt-8 text-xs font-medium uppercase tracking-[0.3em] text-[#750080]"
              data-aos="fade-down"
              data-aos-delay="100"
            >
              Coming Soon
            </p>

            <h2
              className="mt-4 font-serif text-4xl text-[#41004C] md:text-5xl"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              The Sunglasses Collection
            </h2>

            <p
              className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#41004C]/60 md:text-base"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              Something stylish is on the way. Our sunglasses collection is
              currently being curated and will be available soon.
            </p>

            <button
              type="button"
              onClick={() => changeFilter("all")}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#41004C] px-7 py-3.5 text-sm font-medium text-white transition hover:bg-[#750080]"
              data-aos="zoom-in"
              data-aos-delay="400"
            >
              Explore Fragrances
              <ArrowRight size={17} />
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          /* NO PRODUCTS */
          <div className="mt-20 text-center" data-aos="fade-up">
            <p className="font-serif text-3xl text-[#41004C]">
              No products available
            </p>

            <p className="mt-3 text-sm text-[#41004C]/50">
              Check back soon for our latest collection.
            </p>
          </div>
        ) : (
          /* PRODUCTS */
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product, index) => (
              <article
                key={product.id}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                data-aos="fade-up"
                data-aos-delay={(index % 3) * 100}
              >
                {/* IMAGE */}
                <div className="relative aspect-4/5 overflow-hidden bg-[#F6EAF8]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />

                  <span className="absolute left-4 top-4 rounded-full bg-[#FFF9FF]/90 px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#41004C] backdrop-blur-sm">
                    {product.category}
                  </span>
                </div>

                {/* PRODUCT INFO */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-medium text-[#41004C]">
                        {product.name}
                      </h2>

                      {product.size && (
                        <p className="mt-1 text-sm text-[#41004C]/50">
                          {product.type === "fragrance"
                            ? "Size"
                            : "Frame"}
                          : {product.size}
                        </p>
                      )}
                    </div>

                    <p className="text-lg font-semibold text-[#750080]">
                      ₦{Number(product.price).toLocaleString()}
                    </p>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-[#41004C]/60">
                    {product.description}
                  </p>

                  {/* VIEW PRODUCT BUTTON */}
                  <Link
                    href={`/shop/${product.id}`}
                    className="mt-6 flex w-full items-center justify-center rounded-full bg-[#41004C] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#750080]"
                  >
                    View Product
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function ShopLoading() {
  return (
    <main className="min-h-screen bg-[#FFF9FF] pt-24">
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex min-h-125 flex-col items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#F6EAF8] border-t-[#750080]" />

          <p className="mt-5 text-sm text-[#41004C]/50">
            Loading our collection...
          </p>
        </div>
      </section>
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopLoading />}>
      <ShopContent />
    </Suspense>
  );
}