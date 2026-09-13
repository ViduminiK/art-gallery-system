'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    const navItems = [
        { name: "Dashboard", href: "/" },
        { name: "Artists", href: "/artists" },
        { name: "Artworks", href: "/artworks" },
        { name: "Exhibitions", href: "/exhibitions" },
    ];

    return (
        <header className="border-b border-slate-800 bg-[#111622] sticky top-0 z-50 px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-8">
                <Link href="/" className="flex items-center gap-3">
          <span className="bg-violet-600 text-white text-xs font-bold px-2.5 py-1 rounded shadow-sm">
            AGMS
          </span>
                    <span className="font-semibold text-sm tracking-wide text-white">
            Art Gallery Management System
          </span>
                </Link>
                <nav className="flex items-center gap-6 text-sm font-medium">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`transition-colors duration-150 pb-1 ${
                                    isActive
                                        ? "text-violet-400 font-semibold border-b-2 border-violet-500"
                                        : "text-slate-400 hover:text-white"
                                }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
}