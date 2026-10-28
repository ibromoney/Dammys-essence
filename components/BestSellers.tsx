
"use client";

import { useEffect, useState } from "react";
import { Heart, ArrowRight, ShoppingBag, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";
import { useCart, type CartProduct } from "@/context/CartContext";

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

export default function BestSellers() {
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [recentlyAdded, setRecentlyAdded] = useState<number[]>([]);

  const { addToCart } = useCart();

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("type", "fragrance")
        .order("created_at", { ascending: false })
        .limit(4);

      if (error) {
        console.error("Error fetching best sellers:", error);
        return;
      }

      if (!cancelled) {
        setProducts((data ?? []) as Product[]);
      }
    };

    void fetchProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  function toggleWishlist(id: number) {
    setWishlist((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function handleAddToCart(product: Product) {
    const cartProduct: CartProduct = {
      id: product.id,
      name: product.name,
      type: product.type,
      category: product.category,
      price: Number(product.price),
      image: product.image,
      description: product.description,
      size: product.size,
    };

    addToCart(cartProduct);

    setRecentlyAdded((current) =>
      current.includes(product.id)
        ? current
        : [...current, product.id],
    );

    window.setTimeout(() => {
      setRecentlyAdded((current) =>
        current.filter((id) => id !== product.id),
      );
    }, 1500);
  }

  return (
    <section className="best-sellers overflow-hidden" id="shop">
      <div className="best-sellers-inner">
        {/* SECTION HEADER */}
        <div className="best-sellers-header" data-aos="fade-up">
          <div>
            <p
              className="best-sellers-eyebrow"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              DISCOVER YOUR SIGNATURE
            </p>

            <h2 data-aos="fade-up" data-aos-delay="200">
              Our Best
              <span> Sellers.</span>
            </h2>
          </div>

          <Link
            href="/shop"
            className="best-sellers-view"
            data-aos="fade-left"
            data-aos-delay="300"
          >
            View All Products
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* PRODUCT GRID */}
        <div className="best-sellers-grid">
          {products.map((product, index) => {
            const isWishlisted = wishlist.includes(product.id);
            const wasRecentlyAdded = recentlyAdded.includes(product.id);

            return (
              <article
                className="best-seller-card"
                key={product.id}
                data-aos="fade-up"
                data-aos-delay={100 + index * 100}
              >
                {/* IMAGE */}
                <div className="best-seller-image-wrap">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={800}
                    height={1000}
                    className="best-seller-image"
                  />

                  <span
                    className="best-seller-tag"
                    data-aos="fade-down"
                    data-aos-delay={200 + index * 100}
                  >
                    BEST SELLER
                  </span>

                  <button
                    type="button"
                    className={`best-seller-wishlist ${
                      isWishlisted ? "selected" : ""
                    }`}
                    onClick={() => toggleWishlist(product.id)}
                    aria-label={
                      isWishlisted
                        ? `Remove ${product.name} from wishlist`
                        : `Add ${product.name} to wishlist`
                    }
                  >
                    <Heart
                      size={18}
                      fill={isWishlisted ? "currentColor" : "none"}
                    />
                  </button>

                  {/* QUICK ADD */}
                  <button
                    type="button"
                    className="quick-add"
                    onClick={() => handleAddToCart(product)}
                    aria-label={`Add ${product.name} to cart`}
                    aria-live="polite"
                    data-aos="fade-up"
                    data-aos-delay={300 + index * 100}
                  >
                    {wasRecentlyAdded ? (
                      <>
                        <Check size={16} />
                        ADDED TO CART
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={16} />
                        ADD TO CART
                      </>
                    )}
                  </button>
                </div>

                {/* INFO */}
                <div
                  className="best-seller-info"
                  data-aos="fade-up"
                  data-aos-delay={200 + index * 100}
                >
                  <div>
                    <h3>{product.name}</h3>

                    <p>
                      {product.category}
                      {product.size ? ` · ${product.size}` : ""}
                    </p>
                  </div>

                  <span className="best-seller-price">
                    ₦{Number(product.price).toLocaleString("en-NG")}
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {products.length === 0 && (
          <p className="py-10 text-center text-[#9b70a3]">
            Our signature fragrances are being prepared. Please check back soon.
          </p>
        )}
      </div>
    </section>
  );
}
