import { prisma } from "@/lib/prisma";
import ExhibitionManager from "./ExhibitionManager";

export default async function ExhibitionsPage() {
    const exhibitions = await prisma.exhibition.findMany({
        orderBy: { startDate: "desc" },
    });

    return (
        <main className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white">
                        Exhibitions & Events
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Schedule gallery exhibitions, set event timelines, and manage venue locations.
                    </p>
                </div>
                <div className="flex items-center">
          <span className="bg-amber-950/80 border border-amber-700/60 text-amber-300 text-xs px-3.5 py-1.5 rounded-full font-medium shadow-sm">
            Total Exhibitions: {exhibitions.length}
          </span>
                </div>
            </div>

            <ExhibitionManager initialExhibitions={exhibitions} />
        </main>
    );
}