"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Glasses, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Collection = {
  category: string;
  image: string;
};

const fragranceCollections: Collection[] = [
  {
    category: "For Him",
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "For Her",
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "Unisex",
    image:
      "https://images.unsplash.com/photo-1610461888750-10bfc601b8e3?auto=format&fit=crop&w=1200&q=80",
  },
];

const sunglassesCollections: Collection[] = [
  {
    category: "Men",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "Women",
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "Unisex",
    image:
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function FeaturedCollection() {
  const [fragranceCategories, setFragranceCategories] = useState<string[]>([]);
  const [sunglassesCategories, setSunglassesCategories] = useState<string[]>(
    [],
  );

  useEffect(() => {
    const fetchCategories = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("products")
        .select("type, category");

      if (error) {
        console.error("Error fetching collection categories:", error);
        return;
      }

      const fragrance = Array.from(
        new Set(
          (data ?? [])
            .filter((product) => product.type === "fragrance")
            .map((product) => product.category),
        ),
      );

      const sunglasses = Array.from(
        new Set(
          (data ?? [])
            .filter((product) => product.type === "sunglasses")
            .map((product) => product.category),
        ),
      );

      setFragranceCategories(fragrance);
      setSunglassesCategories(sunglasses);
    };

    fetchCategories();
  }, []);

  const availableFragranceCollections = fragranceCollections.filter(
    (collection) => fragranceCategories.includes(collection.category),
  );

  const availableSunglassesCollections = sunglassesCollections.filter(
    (collection) => sunglassesCategories.includes(collection.category),
  );

  return (
    <section className="bg-[#FFF9FF] py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* HEADER */}
        <div
          className="mb-14 text-center"
          data-aos="fade-up"
        >
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-[#750080]">
            Explore
          </p>

          <h2 className="font-serif text-4xl text-[#41004C] md:text-5xl">
            Find Your Essence
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#41004C]/60 md:text-base">
            Explore carefully selected fragrances and stylish eyewear designed
            to complement your personality and presence.
          </p>
        </div>

        {/* FRAGRANCES */}
        <div data-aos="fade-up">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F6EAF8] text-[#750080]">
              <Sparkles size={18} />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#750080]">
                Fragrances
              </p>

              <h3 className="mt-1 font-serif text-2xl text-[#41004C]">
                Signature Scents
              </h3>
            </div>
          </div>

          {availableFragranceCollections.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {availableFragranceCollections.map((collection, index) => (
                <Link
                  key={collection.category}
                  href={`/shop?category=fragrance&collection=${encodeURIComponent(
                    collection.category,
                  )}`}
                  className="group relative overflow-hidden rounded-3xl bg-[#41004C]"
                  data-aos="zoom-in"
                  data-aos-delay={index * 100}
                >
                  <div className="relative aspect-4/5">
                    <Image
                      src={collection.image}
                      alt={`${collection.category} fragrance collection`}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-[#41004C]/90 via-[#41004C]/20 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-7">
                      <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#F6EAF8]">
                        Fragrance
                      </p>

                      <h4 className="mt-2 font-serif text-3xl text-[#FFF9FF]">
                        {collection.category}
                      </h4>

                      <div className="mt-5 flex items-center gap-2 text-sm text-[#FFF9FF]/80">
                        Explore Collection
                        <ArrowUpRight
                          size={17}
                          className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-[#41004C]/10 bg-white p-8 text-center">
              <p className="text-sm text-[#41004C]/50">
                Our fragrance collections are being prepared.
              </p>
            </div>
          )}
        </div>

        {/* SUNGLASSES */}
        <div
          className="mt-24"
          data-aos="fade-up"
        >
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F6EAF8] text-[#750080]">
              <Glasses size={18} />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#750080]">
                Eyewear
              </p>

              <h3 className="mt-1 font-serif text-2xl text-[#41004C]">
                Sunglasses Collection
              </h3>
            </div>
          </div>

          {availableSunglassesCollections.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {availableSunglassesCollections.map((collection, index) => (
                <Link
                  key={collection.category}
                  href={`/shop?category=sunglasses&collection=${encodeURIComponent(
                    collection.category,
                  )}`}
                  className="group relative overflow-hidden rounded-3xl bg-[#41004C]"
                  data-aos="zoom-in"
                  data-aos-delay={index * 100}
                >
                  <div className="relative aspect-4/5">
                    <Image
                      src={collection.image}
                      alt={`${collection.category} sunglasses collection`}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-[#41004C]/90 via-[#41004C]/20 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-7">
                      <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#F6EAF8]">
                        Sunglasses
                      </p>

                      <h4 className="mt-2 font-serif text-3xl text-[#FFF9FF]">
                        {collection.category}
                      </h4>

                      <div className="mt-5 flex items-center gap-2 text-sm text-[#FFF9FF]/80">
                        Explore Collection
                        <ArrowUpRight
                          size={17}
                          className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-[#41004C]/10 bg-white p-10 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F6EAF8] text-[#750080]">
                <Glasses size={27} strokeWidth={1.5} />
              </div>

              <p className="mt-5 text-xs font-medium uppercase tracking-[0.3em] text-[#750080]">
                Coming Soon
              </p>

              <h4 className="mt-2 font-serif text-3xl text-[#41004C]">
                Sunglasses
              </h4>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#41004C]/50">
                Our eyewear collection is currently being curated. Check back
                soon for something special.
              </p>

              <Link
                href="/shop?category=sunglasses"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#41004C] px-6 py-3 text-sm font-medium text-[#FFF9FF] transition hover:bg-[#750080]"
              >
                View Sunglasses
                <ArrowUpRight size={17} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}