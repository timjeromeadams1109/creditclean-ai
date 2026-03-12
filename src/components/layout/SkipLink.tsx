"use client";
export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only fixed top-0 left-0 z-[100] bg-white text-black font-bold px-6 py-3 focus:outline-none focus:ring-2 rounded-br-lg"
    >
      Skip to main content
    </a>
  );
}
