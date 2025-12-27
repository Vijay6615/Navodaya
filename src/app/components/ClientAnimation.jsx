"use client";

import { useEffect } from "react";

export default function ClientAnimation() {
  useEffect(() => {
    const elements = document.querySelectorAll(".fade-up");

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    });

    elements.forEach(el => observer.observe(el));
  }, []);

  return null;
}
