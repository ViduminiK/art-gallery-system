import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
    const [
        artistCount,
        artworkCount,
        exhibitionCount,
        portfolioValuation,
        recentArtists,
        recentArtworks,
    ] = await Promise.all([
        prisma.artist.count(),
        prisma.artwork.count(),
        prisma.exhibition.count(),
        prisma.artwork.aggregate({
            _sum: {
                price: true,
            },
        }),
        prisma.artist.findMany({
            orderBy: { createdAt: "desc" },
            take: 4,
            include: {
                _count: {
                    select: { artworks: true },
                },
            },
        }),
        prisma.artwork.findMany({
            orderBy: { createdAt: "desc" },
            take: 4,
            include: {
                artist: {
                    select: { name: true },
                },
            },
        }),
    ]);

    const totalValue = portfolioValuation._sum.price || 0;

    return (
        <main className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header with Quick Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white">
                        System Overview
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Welcome to the Art Gallery Management System workspace.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/artists"
                        className="bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs px-4 py-2.5 rounded-lg shadow-lg shadow-violet-950/40 transition"
                    >
                        Manage Artists →
                    </Link>
                    <Link
                        href="/artworks"
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs px-4 py-2.5 rounded-lg transition"
                    >
                        + Add Artwork
                    </Link>
                    <Link
                        href="/exhibitions"
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs px-4 py-2.5 rounded-lg transition"
                    >
                        + New Exhibition
                    </Link>
                </div>
            </div>

            {/* Metrics Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Artists */}
                <div className="bg-[#111622] border border-slate-800 rounded-xl p-5 flex items-center justify-between shadow-lg">
                    <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Total Artists
            </span>
                        <p className="text-3xl font-extrabold text-slate-100 mt-1">
                            {artistCount}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-violet-950/60 border border-violet-800/40 flex items-center justify-center text-xl">
                        🎨
                    </div>
                </div>

                {/* Catalogued Artworks */}
                <div className="bg-[#111622] border border-slate-800 rounded-xl p-5 flex items-center justify-between shadow-lg">
                    <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Catalogued Artworks
            </span>
                        <p className="text-3xl font-extrabold text-slate-100 mt-1">
                            {artworkCount}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center text-xl">
                        🖼️
                    </div>
                </div>

                {/* Active Exhibitions */}
                <div className="bg-[#111622] border border-slate-800 rounded-xl p-5 flex items-center justify-between shadow-lg">
                    <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Active Exhibitions
            </span>
                        <p className="text-3xl font-extrabold text-slate-100 mt-1">
                            {exhibitionCount}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-xl">
                        🏛️
                    </div>
                </div>

                {/* Total Portfolio Valuation */}
                <div className="bg-[#111622] border border-slate-800 rounded-xl p-5 flex items-center justify-between shadow-lg">
                    <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Portfolio Value
            </span>
                        <p className="text-2xl font-extrabold text-emerald-400 mt-1 font-mono">
                            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-xl">
                        💰
                    </div>
                </div>
            </div>

            {/* Two Column Section for Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recently Registered Artists */}
                <div className="bg-[#111622] border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                        <h2 className="text-base font-semibold text-slate-200">
                            Recently Registered Artists
                        </h2>
                        <Link
                            href="/artists"
                            className="text-xs text-violet-400 hover:text-violet-300 font-medium"
                        >
                            View All
                        </Link>
                    </div>

                    {recentArtists.length === 0 ? (
                        <p className="text-xs text-slate-500 text-center py-6">
                            No artists registered yet.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {recentArtists.map((artist) => (
                                <div
                                    key={artist.id}
                                    className="bg-[#0b0f17] border border-slate-800 rounded-lg p-3 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-violet-900/60 border border-violet-700/50 flex items-center justify-center text-slate-200 font-semibold text-xs uppercase">
                                            {artist.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-200">
                                                {artist.name}
                                            </p>
                                            <p className="text-[10px] text-slate-400">
                                                {artist.email}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-mono">
                    {artist._count.artworks} items
                  </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recently Catalogued Artworks */}
                <div className="bg-[#111622] border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                        <h2 className="text-base font-semibold text-slate-200">
                            Recent Artworks
                        </h2>
                        <Link
                            href="/artworks"
                            className="text-xs text-violet-400 hover:text-violet-300 font-medium"
                        >
                            View All
                        </Link>
                    </div>

                    {recentArtworks.length === 0 ? (
                        <p className="text-xs text-slate-500 text-center py-6">
                            No artworks catalogued yet.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {recentArtworks.map((artwork) => (
                                <div
                                    key={artwork.id}
                                    className="bg-[#0b0f17] border border-slate-800 rounded-lg p-3 flex items-center justify-between"
                                >
                                    <div className="truncate pr-2">
                                        <p className="text-xs font-semibold text-slate-200 truncate">
                                            {artwork.title}
                                        </p>
                                        <p className="text-[10px] text-slate-400">
                                            by {artwork.artist.name}
                                        </p>
                                    </div>
                                    <span className="text-xs font-mono text-emerald-400 font-semibold whitespace-nowrap">
                    ${artwork.price.toLocaleString()}
                  </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}