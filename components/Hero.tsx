import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section
      className="hero overflow-hidden"
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      {/* Background glow */}
      <div className="hero-glow hero-glow-one" />
      <div className="hero-glow hero-glow-two" />

      <div className="hero-inner">
        {/* LEFT CONTENT */}
        <div
          className="hero-content"
          data-aos="fade-right"
          data-aos-duration="1000"
          data-aos-delay="150"
        >
          <div
            className="hero-eyebrow"
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-delay="250"
          >
            <span className="eyebrow-line" />
            <span>THE ART OF PERSONAL ESSENCE</span>
          </div>

          <h1
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="350"
          >
            More Than
            <br />
            <span>A Scent.</span>
            <br />
            <em>It&apos;s an Essence.</em>
          </h1>

          <p
            className="hero-description"
            data-aos="fade-up"
            data-aos-duration="900"
            data-aos-delay="450"
          >
            Discover fragrances crafted to become part of your identity.
            Elegant, captivating and unforgettable — every scent tells a story.
          </p>

          <div
            className="hero-actions"
            data-aos="fade-up"
            data-aos-duration="900"
            data-aos-delay="550"
          >
            <Link href="/shop" className="hero-button">
              Explore Collection
              <ArrowRight size={17} strokeWidth={1.7} />
            </Link>

            <Link href="/about" className="hero-secondary-button">
              Discover Dammys
            </Link>
          </div>

          {/* Small brand statement */}
          <div
            className="hero-note"
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-delay="650"
          >
            <Sparkles size={15} />
            <span>Luxury fragrances for every moment</span>
          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div
          className="hero-visual"
          data-aos="fade-left"
          data-aos-duration="1200"
          data-aos-delay="250"
        >
          {/* Decorative rings */}
          <div className="hero-ring hero-ring-one" />
          <div className="hero-ring hero-ring-two" />

          {/* Logo behind perfume */}
          <div
            className="hero-logo"
            data-aos="zoom-in"
            data-aos-duration="1000"
            data-aos-delay="500"
          >
            <Image
              src="/dammys-logo.png"
              alt="Dammys Essence"
              width={240}
              height={240}
              priority
            />
          </div>

          {/* Perfume image */}
          <div
            className="hero-product"
            data-aos="zoom-in"
            data-aos-duration="1200"
            data-aos-delay="400"
          >
            <Image
              src="/hero-perfume.png"
              alt="Dammys Essence perfume"
              fill
              priority
              className="hero-product-image"
            />
          </div>

          {/* Floating text */}
          <div
            className="hero-floating-text"
            data-aos="fade-up"
            data-aos-duration="900"
            data-aos-delay="750"
          >
            <span>01</span>
            <div />
            <span>ESSENCE</span>
          </div>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <div
        className="hero-scroll"
        data-aos="fade-up"
        data-aos-duration="800"
        data-aos-delay="900"
      >
        <span>SCROLL TO DISCOVER</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}