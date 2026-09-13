import { prisma } from "@/lib/prisma";
import ArtistManager from "./ArtistManager";

export default async function ArtistsPage() {
    const artists = await prisma.artist.findMany({
        include: {
            artworks: true,
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <main className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white">
                        Artist Directory
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Manage gallery profiles, bio details, and catalogued artworks.
                    </p>
                </div>
                <div className="flex items-center">
          <span className="bg-violet-950/80 border border-violet-700/60 text-violet-300 text-xs px-3.5 py-1.5 rounded-full font-medium shadow-sm">
            Total Artists: {artists.length}
          </span>
                </div>
            </div>

            <ArtistManager initialArtists={artists} />
        </main>
    );
}