import { prisma } from "@/lib/prisma";
import ArtworkManager from "./ArtworkManager";

interface PageProps {
    searchParams: Promise<{
        query?: string;
    }>;
}

export default async function ArtworksPage({ searchParams }: PageProps) {
    // Await searchParams in Next.js 15
    const resolvedParams = await searchParams;
    const query = resolvedParams.query || "";

    // 1. Fetch filtered artworks from Prisma based on the search query
    const artworks = await prisma.artwork.findMany({
        where: query
            ? {
                OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                ],
            }
            : {},
        include: {
            artist: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    // 2. Also fetch all artists for the artwork creation/edit form dropdown
    const artists = await prisma.artist.findMany({
        orderBy: { name: "asc" },
    });

    return (
        <ArtworkManager initialArtworks={artworks} artists={artists} />
    );
}