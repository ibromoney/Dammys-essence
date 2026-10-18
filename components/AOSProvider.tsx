"use client";

import { useEffect } from "react";
import AOS from "aos";

export default function AOSProvider() {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      AOS.init({
        duration: 900,
        easing: "ease-out-cubic",
        once: true,
        offset: 80,
        disable: false,
      });

      AOS.refresh();
    }, 300);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return null;
}