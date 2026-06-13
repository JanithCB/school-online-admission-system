"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/apply", label: "Apply Now" },
    { href: "/admin/applications", label: "Admin" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e5e5e0]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-sm bg-[#1a1a1a] flex items-center justify-center">
            <span className="text-white text-xs font-bold tracking-widest">NF</span>
          </div>
          <span className="font-semibold text-[#1a1a1a] text-sm tracking-tight hidden sm:block">
            Nordic Foundation
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#f0efea] text-[#1a1a1a]"
                    : "text-[#555550] hover:text-[#1a1a1a] hover:bg-[#f5f5f2]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
