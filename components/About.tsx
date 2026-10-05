import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  Gem,
  Sparkles,
  Star,
} from "lucide-react";

export default function About() {
  return (
    <main className="min-h-screen bg-[#FFF9FF] pt-24">

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#41004C]">
        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-[#750080]/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#750080]/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 md:py-32 lg:grid-cols-2 lg:gap-20">

          {/* HERO TEXT */}
          <div data-aos="fade-right">
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.35em] text-[#D9B7DF]">
              The Dammys Essence Story
            </p>

            <h1 className="max-w-2xl font-serif text-5xl leading-[1.05] text-[#FFF9FF] md:text-7xl">
              More Than a Scent.
              <span className="block text-[#D9B7DF]">
                It&apos;s Your Essence.
              </span>
            </h1>

            <p
              className="mt-7 max-w-xl text-sm leading-8 text-[#FFF9FF]/65 md:text-base"
              data-aos="fade-up"
              data-aos-delay="150"
            >
              Dammys Essence was created around one simple belief:
              what you wear should feel like an extension of who you are.
              From captivating fragrances to timeless eyewear, every piece
              is chosen to help you express your presence with confidence.
            </p>

            <div
              className="mt-9 flex flex-col gap-3 sm:flex-row"
              data-aos="fade-up"
              data-aos-delay="250"
            >
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFF9FF] px-7 py-3.5 text-sm font-medium text-[#41004C] transition duration-300 hover:bg-[#D9B7DF]"
              >
                Explore Collection
                <ArrowRight size={17} />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-[#FFF9FF]/20 px-7 py-3.5 text-sm font-medium text-[#FFF9FF] transition duration-300 hover:border-[#D9B7DF] hover:text-[#D9B7DF]"
              >
                Get in Touch
              </Link>
            </div>
          </div>

          {/* HERO IMAGE */}
          <div
            className="relative"
            data-aos="fade-left"
            data-aos-delay="200"
          >
            <div className="relative mx-auto max-w-lg overflow-hidden rounded-4xl border border-white/10 bg-[#750080]/20 p-2">
              <div className="relative aspect-4/5 overflow-hidden rounded-3xl">
                <Image
                  src="https://images.unsplash.com/photo-1612817288484-6f916006741a?w=1200&q=85"
                  alt="Luxury perfume collection"
                  fill
                  priority
                  className="object-cover transition duration-700 hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />

                <div className="absolute inset-0 bg-linear-to-t from-[#41004C]/50 via-transparent to-transparent" />
              </div>
            </div>

            {/* FLOATING BADGE */}
            <div
              className="absolute -bottom-5 -left-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#FFF9FF] px-5 py-4 shadow-2xl md:-left-8"
              data-aos="zoom-in"
              data-aos-delay="450"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F6EAF8] text-[#750080]">
                <Sparkles size={18} />
              </div>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#750080]">
                  Curated
                </p>

                <p className="mt-0.5 text-sm font-medium text-[#41004C]">
                  With Intention
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-24">

          <div data-aos="fade-right">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-[#750080]">
              Our Philosophy
            </p>

            <h2 className="max-w-xl font-serif text-4xl leading-tight text-[#41004C] md:text-5xl">
              Your presence speaks before you do.
            </h2>
          </div>

          <div
            className="space-y-6 text-sm leading-8 text-[#41004C]/60 md:text-base"
            data-aos="fade-left"
          >
            <p>
              At Dammys Essence, we believe personal style goes beyond
              appearance. It is about the feeling you leave behind and the
              confidence you carry with you.
            </p>

            <p>
              A fragrance can become a memory. A pair of sunglasses can
              become part of your signature look. Together, they become
              expressions of individuality.
            </p>

            <p>
              That is why we focus on pieces that feel distinctive,
              sophisticated, and effortless — products selected not simply
              to follow trends, but to complement your identity.
            </p>
          </div>
        </div>
      </section>

      {/* TWO WORLDS */}
      <section className="bg-[#F6EAF8]">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">

          <div
            className="mx-auto max-w-2xl text-center"
            data-aos="fade-up"
          >
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-[#750080]">
              The Collection
            </p>

            <h2 className="font-serif text-4xl text-[#41004C] md:text-5xl">
              Fragrance &amp; Eyewear
            </h2>

            <p className="mt-5 text-sm leading-7 text-[#41004C]/60 md:text-base">
              Two different expressions. One unmistakable essence.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">

            {/* FRAGRANCE */}
            <div
              className="group relative overflow-hidden rounded-3xl bg-[#41004C]"
              data-aos="fade-right"
            >
              <div className="relative aspect-4/5">
                <Image
                  src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1200&q=85"
                  alt="Dammys Essence fragrance collection"
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                <div className="absolute inset-0 bg-linear-to-t from-[#41004C] via-[#41004C]/30 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#FFF9FF]/10 text-[#D9B7DF] backdrop-blur-sm">
                    <Sparkles size={20} />
                  </div>

                  <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#D9B7DF]">
                    Fragrance
                  </p>

                  <h3 className="mt-2 font-serif text-4xl text-[#FFF9FF]">
                    Leave a Signature.
                  </h3>

                  <p className="mt-4 max-w-md text-sm leading-6 text-[#FFF9FF]/60">
                    Discover scents created to become part of your identity,
                    from bold and captivating to soft and timeless.
                  </p>

                  <Link
                    href="/shop?category=fragrance"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#FFF9FF] transition hover:text-[#D9B7DF]"
                  >
                    Explore Fragrances
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>

            {/* SUNGLASSES */}
            <div
              className="group relative overflow-hidden rounded-3xl bg-[#41004C]"
              data-aos="fade-left"
            >
              <div className="relative aspect-4/5">
                <Image
                  src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1200&q=85"
                  alt="Dammys Essence sunglasses collection"
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                <div className="absolute inset-0 bg-linear-to-t from-[#41004C] via-[#41004C]/30 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#FFF9FF]/10 text-[#D9B7DF] backdrop-blur-sm">
                    <Eye size={20} />
                  </div>

                  <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#D9B7DF]">
                    Eyewear
                  </p>

                  <h3 className="mt-2 font-serif text-4xl text-[#FFF9FF]">
                    Frame Your Style.
                  </h3>

                  <p className="mt-4 max-w-md text-sm leading-6 text-[#FFF9FF]/60">
                    Discover carefully selected eyewear designed to add
                    confidence, character, and effortless style to your look.
                  </p>

                  <Link
                    href="/shop?category=sunglasses"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#FFF9FF] transition hover:text-[#D9B7DF]"
                  >
                    Explore Sunglasses
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">

        <div
          className="mx-auto max-w-2xl text-center"
          data-aos="fade-up"
        >
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-[#750080]">
            What We Believe
          </p>

          <h2 className="font-serif text-4xl text-[#41004C] md:text-5xl">
            The Essence Behind The Brand
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">

          {/* VALUE 1 */}
          <div
            className="rounded-3xl border border-[#41004C]/10 bg-white p-8 md:p-10"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F6EAF8] text-[#750080]">
              <Gem size={21} />
            </div>

            <h3 className="mt-7 font-serif text-2xl text-[#41004C]">
              Quality
            </h3>

            <p className="mt-4 text-sm leading-7 text-[#41004C]/55">
              We believe every product should feel worthy of being part of
              your everyday life.
            </p>
          </div>

          {/* VALUE 2 */}
          <div
            className="rounded-3xl border border-[#41004C]/10 bg-white p-8 md:p-10"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F6EAF8] text-[#750080]">
              <Star size={21} />
            </div>

            <h3 className="mt-7 font-serif text-2xl text-[#41004C]">
              Individuality
            </h3>

            <p className="mt-4 text-sm leading-7 text-[#41004C]/55">
              Your style is personal. We curate products that help you
              express what makes you different.
            </p>
          </div>

          {/* VALUE 3 */}
          <div
            className="rounded-3xl border border-[#41004C]/10 bg-white p-8 md:p-10"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F6EAF8] text-[#750080]">
              <Sparkles size={21} />
            </div>

            <h3 className="mt-7 font-serif text-2xl text-[#41004C]">
              Intention
            </h3>

            <p className="mt-4 text-sm leading-7 text-[#41004C]/55">
              Every selection is made with purpose, from the scent you wear
              to the style you carry.
            </p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#41004C]">
        <div
          className="mx-auto max-w-4xl px-6 py-24 text-center md:py-28"
          data-aos="zoom-in"
        >
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#D9B7DF]">
            Your Story. Your Style. Your Essence.
          </p>

          <h2 className="mt-5 font-serif text-4xl text-[#FFF9FF] md:text-6xl">
            Discover What Defines You.
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#FFF9FF]/60 md:text-base">
            Find a fragrance that stays with you. Find eyewear that speaks
            for you. Find pieces that feel unmistakably yours.
          </p>

          <Link
            href="/shop"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#FFF9FF] px-8 py-4 text-sm font-medium text-[#41004C] transition duration-300 hover:bg-[#D9B7DF]"
          >
            Discover Your Essence
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

    </main>
  );
}