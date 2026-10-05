import {
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#FFF9FF] pt-24">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-20">
        <div className="max-w-3xl">
          <p
            className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-[#750080]"
            data-aos="fade-down"
          >
            Get In Touch
          </p>

          <h1
            className="font-serif text-5xl leading-tight text-[#41004C] md:text-7xl"
            data-aos="fade-right"
            data-aos-delay="150"
          >
            Let&apos;s talk
            <br />
            <span className="italic text-[#750080]">essence.</span>
          </h1>

          <p
            className="mt-6 max-w-2xl text-base leading-8 text-[#41004C]/60 md:text-lg"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            Have a question about a fragrance, an order, or Dammys Essence?
            We&apos;d love to hear from you. Send us a message and our team
            will get back to you.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div
          className="grid overflow-hidden rounded-3xl bg-white shadow-sm lg:grid-cols-[0.8fr_1.2fr]"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {/* Contact Information */}
          <div
            className="bg-[#41004C] p-8 text-[#FFF9FF] md:p-12"
            data-aos="fade-right"
            data-aos-delay="300"
          >
            <p
              className="text-sm uppercase tracking-[0.25em] text-[#D9B7DF]"
              data-aos="fade-down"
              data-aos-delay="400"
            >
              Contact Information
            </p>

            <h2
              className="mt-5 font-serif text-3xl md:text-4xl"
              data-aos="fade-right"
              data-aos-delay="450"
            >
              We&apos;re here for you.
            </h2>

            <p
              className="mt-5 text-sm leading-7 text-[#F6EAF8]/70"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              Whether you need help choosing your next signature scent or
              simply want to say hello, feel free to reach out.
            </p>

            <div className="mt-10 space-y-7">
              {/* Email */}
              <div
                className="flex gap-4"
                data-aos="fade-up"
                data-aos-delay="550"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <Mail size={18} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-[#D9B7DF]">
                    Email
                  </p>

                  <a
                    href="mailto:hello@dammysessence.com"
                    className="mt-1 block text-sm transition hover:text-[#D9B7DF]"
                  >
                    hello@dammysessence.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div
                className="flex gap-4"
                data-aos="fade-up"
                data-aos-delay="600"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <Phone size={18} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-[#D9B7DF]">
                    Phone
                  </p>

                  <a
                    href="tel:+2340000000000"
                    className="mt-1 block text-sm transition hover:text-[#D9B7DF]"
                  >
                    +234 000 000 0000
                  </a>
                </div>
              </div>

              {/* Location */}
              <div
                className="flex gap-4"
                data-aos="fade-up"
                data-aos-delay="650"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <MapPin size={18} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-[#D9B7DF]">
                    Location
                  </p>

                  <p className="mt-1 text-sm">
                    Lagos, Nigeria
                  </p>
                </div>
              </div>
            </div>

            {/* Social */}
            <div
              className="mt-12 border-t border-white/10 pt-8"
              data-aos="fade-up"
              data-aos-delay="700"
            >
              <p className="text-xs uppercase tracking-wider text-[#D9B7DF]">
                Follow Dammys Essence
              </p>

              <div className="mt-4 flex gap-3">
                <a
                  href="#"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition hover:bg-white hover:text-[#41004C]"
                >
                  <span className="text-sm font-semibold">IG</span>
                </a>

                <a
                  href="#"
                  aria-label="Email"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition hover:bg-white hover:text-[#41004C]"
                >
                  <Mail size={17} />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div
            className="p-8 md:p-12"
            data-aos="fade-left"
            data-aos-delay="300"
          >
            <p
              className="text-sm uppercase tracking-[0.25em] text-[#750080]"
              data-aos="fade-down"
              data-aos-delay="400"
            >
              Send A Message
            </p>

            <h2
              className="mt-3 font-serif text-3xl text-[#41004C] md:text-4xl"
              data-aos="fade-left"
              data-aos-delay="450"
            >
              How can we help?
            </h2>

            <form
              className="mt-8 space-y-6"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              {/* Name */}
              <div data-aos="fade-up" data-aos-delay="550">
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-[#41004C]"
                >
                  Your Name
                </label>

                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-[#41004C]/10 bg-[#FFF9FF] px-5 py-4 text-sm text-[#41004C] outline-none transition placeholder:text-[#41004C]/30 focus:border-[#750080]"
                />
              </div>

              {/* Email */}
              <div data-aos="fade-up" data-aos-delay="600">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[#41004C]"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-[#41004C]/10 bg-[#FFF9FF] px-5 py-4 text-sm text-[#41004C] outline-none transition placeholder:text-[#41004C]/30 focus:border-[#750080]"
                />
              </div>

              {/* Subject */}
              <div data-aos="fade-up" data-aos-delay="650">
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-medium text-[#41004C]"
                >
                  Subject
                </label>

                <input
                  id="subject"
                  type="text"
                  placeholder="What can we help you with?"
                  className="w-full rounded-xl border border-[#41004C]/10 bg-[#FFF9FF] px-5 py-4 text-sm text-[#41004C] outline-none transition placeholder:text-[#41004C]/30 focus:border-[#750080]"
                />
              </div>

              {/* Message */}
              <div data-aos="fade-up" data-aos-delay="700">
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-[#41004C]"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  rows={6}
                  placeholder="Tell us what's on your mind..."
                  className="w-full resize-none rounded-xl border border-[#41004C]/10 bg-[#FFF9FF] px-5 py-4 text-sm text-[#41004C] outline-none transition placeholder:text-[#41004C]/30 focus:border-[#750080]"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#41004C] px-7 text-sm font-medium text-[#FFF9FF] transition hover:bg-[#750080]"
                data-aos="zoom-in"
                data-aos-delay="750"
              >
                Send Message
                <Send size={17} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}