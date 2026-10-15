"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const categories = [
  {
    name: "Rings",
    slug: "rings",
    href: "/categories/rings",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="14" r="7" />
        <path d="M9 7l3-4 3 4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 3v4" strokeLinecap="round" />
        <circle cx="12" cy="7" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "Necklaces",
    slug: "necklaces",
    href: "/categories/necklaces",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M4 6c0 6.627 3.582 12 8 12s8-5.373 8-12" strokeLinecap="round" />
        <circle cx="12" cy="18" r="2.5" fill="currentColor" fillOpacity="0.15" />
        <path d="M12 18v3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Earrings",
    slug: "earrings",
    href: "/categories/earrings",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="8" cy="7" r="2" />
        <path d="M8 9v6l-2 3" strokeLinecap="round" />
        <circle cx="16" cy="7" r="2" />
        <path d="M16 9v6l2 3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Bracelets",
    slug: "bracelets",
    href: "/categories/bracelets",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <ellipse cx="12" cy="12" rx="9" ry="6" />
        <circle cx="12" cy="6" r="1.5" fill="currentColor" />
        <circle cx="12" cy="18" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "Pendants",
    slug: "pendants",
    href: "/categories/pendants",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M6 3l6 6 6-6" strokeLinecap="round" />
        <path d="M12 9v4" strokeLinecap="round" />
        <path d="M12 13l-3 4.5h6L12 13z" fill="currentColor" fillOpacity="0.2" />
        <circle cx="12" cy="19.5" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "Gold Coins",
    slug: "gold-coins",
    href: "/categories/gold-coins",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="6" strokeDasharray="2 2" />
        <text x="12" y="14" fontSize="6" fontWeight="bold" textAnchor="middle" fill="currentColor">
          24K
        </text>
      </svg>
    ),
  },
  {
    name: "All Jewels",
    slug: "all",
    href: "/products",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

export default function MobileCategoryPills() {
  const pathname = usePathname();

  return (
    <div className="w-full bg-[#FFFDFB] border-b border-[#F0E6DC] py-3 md:hidden">
      <div className="flex items-center gap-3.5 overflow-x-auto px-4 no-scrollbar">
        {categories.map((cat) => {
          const isActive = pathname === cat.href;

          return (
            <Link
              key={cat.slug}
              href={cat.href}
              className="flex shrink-0 flex-col items-center gap-1.5 group"
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition duration-200 active:scale-95 shadow-2xs ${
                  isActive
                    ? "border-[#6B1D2F] bg-[#6B1D2F] text-[#FAF7F2] shadow-sm"
                    : "border-[#E8DFD5] bg-white text-[#6B1D2F] group-hover:border-[#6B1D2F] group-hover:bg-[#FAF7F2]"
                }`}
              >
                {cat.icon}
              </div>
              <span
                className={`text-[11px] font-semibold text-center whitespace-nowrap transition ${
                  isActive ? "text-[#6B1D2F]" : "text-[#524043] group-hover:text-[#6B1D2F]"
                }`}
              >
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

