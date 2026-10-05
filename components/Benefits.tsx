"use client";

import {
  Truck,
  ShieldCheck,
  LockKeyhole,
  Headphones,
} from "lucide-react";

const benefits = [
  {
    icon: Truck,
    title: "Fast & Reliable Delivery",
    description: "Your fragrance delivered safely and on time.",
  },
  {
    icon: ShieldCheck,
    title: "100% Authentic",
    description: "Genuine fragrances, carefully selected for you.",
  },
  {
    icon: LockKeyhole,
    title: "Secure Payments",
    description: "Shop with confidence using secure payments.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description: "We're always here whenever you need us.",
  },
];

export default function Benefits() {
  return (
    <section className="benefits-section overflow-hidden">
      <div className="benefits-inner">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;

          return (
            <div
              className="benefit-item"
              key={benefit.title}
              data-aos="fade-up"
              data-aos-delay={index * 150}
            >
              <div
                className="benefit-icon"
                data-aos="zoom-in"
                data-aos-delay={100 + index * 150}
              >
                <Icon size={24} strokeWidth={1.4} />
              </div>

              <div
                className="benefit-content"
                data-aos="fade-up"
                data-aos-delay={150 + index * 150}
              >
                <h3>{benefit.title}</h3>

                <p>{benefit.description}</p>
              </div>

              {index !== benefits.length - 1 && (
                <span className="benefit-divider" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}