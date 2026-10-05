
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Search,
  UserRound,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import AOS from "aos";
import { createClient } from "@/lib/supabase/client";

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

type NavbarProps = {
  cartCount?: number;
};

export default function Navbar({
  cartCount = 0,
}: NavbarProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
        return;
      }

      setProducts(data ?? []);
    };

    fetchProducts();
  }, []);

  /*
   * Refresh AOS whenever the mobile menu or search panel changes.
   * This allows newly opened elements to animate correctly.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      AOS.refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, [menuOpen, shopOpen, searchOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    setShopOpen(false);
    setSearchOpen(false);
  };

  const searchResults =
    searchTerm.trim().length > 0
      ? products
          .filter((product) =>
            `${product.name} ${product.category} ${product.type}`
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          )
          .slice(0, 5)
      : [];

  return (
    <header
      className="site-header"
      data-aos="fade-down"
      data-aos-duration="900"
      data-aos-easing="ease-out-cubic"
    >
      <div className="nav-inner">

        {/* =====================================================
            LOGO
        ====================================================== */}

        <Link
          href="/"
          className="brand-logo group"
          aria-label="Dammys Essence home"
          onClick={closeMenu}
          data-aos="fade-right"
          data-aos-delay="150"
          data-aos-duration="800"
        >
          <Image
            src="/dammys-logo.png"
            alt="Dammys Essence"
            width={150}
            height={60}
            priority
            className="logo-image transition duration-500 group-hover:scale-105"
          />
        </Link>

        {/* =====================================================
            NAVIGATION
        ====================================================== */}

        <nav
          className={`nav-links ${menuOpen ? "open" : ""}`}
          aria-label="Main navigation"
        >
          {/* HOME */}

          <Link
            href="/"
            className="active"
            onClick={closeMenu}
            data-aos="fade-down"
            data-aos-delay="200"
            data-aos-duration="700"
          >
            Home
          </Link>

          {/* SHOP */}

          <div
            className="shop-dropdown"
            data-aos="fade-down"
            data-aos-delay="260"
            data-aos-duration="700"
          >
            <button
              type="button"
              className="shop-dropdown-trigger"
              onClick={() => {
                setShopOpen((current) => !current);
                setSearchOpen(false);
              }}
              aria-expanded={shopOpen}
            >
              <span>Shop</span>

              <ChevronDown
                size={15}
                className={`shop-chevron ${
                  shopOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`shop-dropdown-menu ${
                shopOpen ? "shop-dropdown-visible" : ""
              }`}
            >
              <Link
                href="/shop"
                onClick={closeMenu}
                data-aos="fade-up"
                data-aos-delay="50"
              >
                <span>All Products</span>
                <small>Explore everything</small>
              </Link>

              <Link
                href="/shop?category=fragrance"
                onClick={closeMenu}
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <span>Fragrances</span>
                <small>Discover your essence</small>
              </Link>

              <Link
                href="/shop?category=sunglasses"
                onClick={closeMenu}
                data-aos="fade-up"
                data-aos-delay="150"
              >
                <span>Sunglasses</span>
                <small>Coming soon</small>
              </Link>
            </div>
          </div>

          {/* ABOUT */}

          <Link
            href="/about"
            onClick={closeMenu}
            data-aos="fade-down"
            data-aos-delay="320"
            data-aos-duration="700"
          >
            About
          </Link>

          {/* CONTACT */}

          <Link
            href="/contact"
            onClick={closeMenu}
            data-aos="fade-down"
            data-aos-delay="380"
            data-aos-duration="700"
          >
            Contact
          </Link>
        </nav>

        {/* =====================================================
            ACTIONS
        ====================================================== */}

        <div
          className="nav-actions"
          data-aos="fade-left"
          data-aos-delay="200"
          data-aos-duration="800"
        >
          {/* SEARCH */}

          <button
            type="button"
            className="icon-button group"
            aria-label="Search"
            aria-expanded={searchOpen}
            onClick={() => {
              setSearchOpen((current) => !current);
              setShopOpen(false);
            }}
          >
            {searchOpen ? (
              <X
                size={22}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:rotate-90"
              />
            ) : (
              <Search
                size={22}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:scale-110"
              />
            )}
          </button>

          {/* ACCOUNT */}

          <Link
            href="/account"
            className="icon-button account-button group"
            aria-label="Account"
          >
            <UserRound
              size={22}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:-translate-y-0.5"
            />
          </Link>

          {/* CART */}

          <Link
            href="/cart"
            className="icon-button group"
            aria-label={`Shopping cart, ${cartCount} items`}
          >
            <div className="relative">
              <ShoppingCart
                size={23}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:-translate-y-0.5"
              />

              {cartCount > 0 && (
                <span className="cart-count">
                  {cartCount}
                </span>
              )}
            </div>
          </Link>

          {/* MOBILE MENU */}

          <button
            type="button"
            className="icon-button menu-button group"
            aria-label={
              menuOpen ? "Close menu" : "Open menu"
            }
            aria-expanded={menuOpen}
            onClick={() => {
              setMenuOpen((current) => !current);
              setShopOpen(false);
              setSearchOpen(false);
            }}
          >
            {menuOpen ? (
              <X
                size={23}
                className="transition-transform duration-300 group-hover:rotate-90"
              />
            ) : (
              <Menu
                size={23}
                className="transition-transform duration-300 group-hover:scale-110"
              />
            )}
          </button>
        </div>
      </div>

      {/* =====================================================
          SEARCH PANEL
      ====================================================== */}

      {searchOpen && (
        <div
          className="navbar-search-panel"
          data-aos="fade-down"
          data-aos-duration="450"
          data-aos-easing="ease-out-cubic"
        >
          <div className="navbar-search-box">

            {/* SEARCH INPUT */}

            <div className="navbar-search-input">
              <div className="search-icon-wrapper">
                <Search
                  size={17}
                  className="text-[#750080]"
                />
              </div>

              <input
                type="text"
                autoFocus
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search fragrances..."
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="search-clear"
                >
                  Clear
                </button>
              )}
            </div>

            {/* RESULTS */}

            {searchTerm.trim() !== "" && (
              <div className="navbar-search-results">

                {searchResults.length > 0 ? (
                  searchResults.map((product, index) => (
                    <Link
                      key={product.id}
                      href={`/shop/${product.id}`}
                      onClick={closeMenu}
                      className="search-result-item"
                      data-aos="fade-up"
                      data-aos-delay={index * 50}
                    >
                      <div className="search-result-image">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="56px"
                          className="object-cover transition duration-500 group-hover:scale-110"
                        />
                      </div>

                      <div className="search-result-info">
                        <p>{product.name}</p>

                        <span>
                          {product.category}
                        </span>
                      </div>

                      <strong>
                        ₦{Number(product.price).toLocaleString()}
                      </strong>
                    </Link>
                  ))
                ) : (
                  <div className="search-empty">
                    <div className="search-empty-icon">
                      <Sparkles size={18} />
                    </div>

                    <p>No products found</p>

                    <span>
                      Try another fragrance name.
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* DEFAULT */}

            {searchTerm.trim() === "" && (
              <div className="search-default">
                <p>SEARCH DAMMYS ESSENCE</p>

                <span>
                  Find your perfect fragrance by name or category.
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
