export default function Newsletter() {
  return (
    <section
      className="bg-[#41004C] px-6 py-20 text-[#FFF9FF] overflow-hidden"
      data-aos="fade-up"
    >
      <div className="mx-auto max-w-4xl text-center">
        <p
          className="mb-3 text-sm uppercase tracking-[0.3em] text-[#D9B7DF]"
          data-aos="fade-down"
          data-aos-delay="100"
        >
          Stay in the Essence
        </p>

        <h2
          className="text-3xl font-semibold tracking-tight md:text-5xl"
          data-aos="zoom-in"
          data-aos-delay="200"
        >
          Join the Dammys Essence family
        </h2>

        <p
          className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#F6EAF8] md:text-base"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          Be the first to discover new fragrances, exclusive collections,
          special offers, and everything happening at Dammys Essence.
        </p>

        <form
          className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <input
            type="email"
            placeholder="Enter your email address"
            className="min-h-12 flex-1 rounded-full border border-[#D9B7DF]/30 bg-white/10 px-5 text-sm text-white outline-none placeholder:text-[#F6EAF8]/60 focus:border-[#D9B7DF]"
          />

          <button
            type="submit"
            className="min-h-12 rounded-full bg-[#FFF9FF] px-7 text-sm font-semibold text-[#41004C] transition hover:bg-[#F6EAF8]"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}