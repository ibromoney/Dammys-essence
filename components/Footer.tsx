import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer" data-aos="fade-up">
      <div className="footer-inner">
        {/* TOP */}
        <div className="footer-top">
          {/* BRAND */}
          <div
            className="footer-brand"
            data-aos="fade-right"
            data-aos-delay="100"
          >
            <div className="footer-logo">
              <span className="footer-logo-mark">D</span>

              <div>
                <span className="footer-logo-name">DAMMYS</span>
                <span className="footer-logo-sub">ESSENCE</span>
              </div>
            </div>

            <p>
              More than a scent, it&apos;s an essence. Discover fragrances that
              become part of your identity.
            </p>

            {/* SOCIAL MEDIA */}
            <div className="footer-socials">
              {/* Facebook */}
              <a
                href="#"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="social-letter">f</span>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/dammys_essence.ng?stkn=dDNpN3RiMHdmNTl2&utm_source=qr"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="social-letter">IG</span>
              </a>

              {/* X / Twitter */}
              <a
                href="#"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="social-letter">𝕏</span>
              </a>
            </div>
          </div>

          {/* SHOP */}
          <div
            className="footer-column"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <h3>SHOP</h3>

            <Link href="#shop">All Fragrances</Link>
            <Link href="#shop">Best Sellers</Link>
            <Link href="#shop">New Arrivals</Link>
            <Link href="#shop">For Him</Link>
            <Link href="#shop">For Her</Link>
          </div>

          {/* CUSTOMER CARE */}
          <div
            className="footer-column"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <h3>CUSTOMER CARE</h3>

            <Link href="#contact">Contact Us</Link>
            <Link href="#contact">Delivery Information</Link>
            <Link href="#contact">Returns & Exchanges</Link>
            <Link href="#contact">FAQs</Link>
            <Link href="#contact">Track Order</Link>
          </div>

          {/* CONTACT */}
          <div
            className="footer-column footer-contact"
            data-aos="fade-left"
            data-aos-delay="400"
          >
            <h3>GET IN TOUCH</h3>

            <a href="mailto:dammysessenceng@gmail.com">
              dammysessenceng@gmail.com
            </a>

            <a href="tel:+2347086888354">
              +2347086888354
            </a>

            <p>Kwara State, Osun State</p>
          </div>
        </div>

        {/* NEWSLETTER */}
        <div
          className="footer-newsletter"
          data-aos="fade-up"
          data-aos-delay="500"
        >
          <div>
            <p className="newsletter-eyebrow">
              STAY IN THE ESSENCE
            </p>

            <h2>
              Discover what&apos;s
              <span> new.</span>
            </h2>

            <p className="newsletter-text">
              Be the first to know about new fragrances, exclusive offers and
              special releases.
            </p>
          </div>

          <form className="newsletter-form">
            <input
              type="email"
              placeholder="Your email address"
              aria-label="Email address"
            />

            <button type="submit">
              JOIN US
              <ArrowUpRight size={16} />
            </button>
          </form>
        </div>

        {/* BOTTOM */}
        <div
          className="footer-bottom"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          <p>© 2026 Dammys Essence. All rights reserved.</p>

          <div className="footer-legal">
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms & Conditions</Link>
          </div>

          <p className="footer-credit">
            Crafted with care by <span>HighbeeDev</span>
          </p>
        </div>
      </div>
    </footer>
  );
}