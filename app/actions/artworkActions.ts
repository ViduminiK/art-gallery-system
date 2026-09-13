'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Create Artwork
export async function createArtwork(formData: FormData) {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const priceRaw = formData.get("price") as string;
    const artistId = parseInt(formData.get("artistId") as string, 10);

    if (!title || isNaN(artistId)) {
        throw new Error("Title and Artist selection are required");
    }

    const priceParsed = priceRaw && !isNaN(parseFloat(priceRaw)) ? parseFloat(priceRaw) : 0;

    await prisma.artwork.create({
        data: {
            title,
            description: description || null,
            imageUrl: imageUrl || null,
            price: priceParsed,
            artistId,
        },
    });

    revalidatePath("/artworks");
    revalidatePath("/artists");
    revalidatePath("/");
}

// Update Artwork
export async function updateArtwork(formData: FormData) {
    const id = parseInt(formData.get("id") as string, 10);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const priceRaw = formData.get("price") as string;
    const artistId = parseInt(formData.get("artistId") as string, 10);

    if (!id || !title || isNaN(artistId)) {
        throw new Error("ID, Title, and Artist are required");
    }

    const priceParsed = priceRaw && !isNaN(parseFloat(priceRaw)) ? parseFloat(priceRaw) : 0;

    await prisma.artwork.update({
        where: { id },
        data: {
            title,
            description: description || null,
            imageUrl: imageUrl || null,
            price: priceParsed,
            artistId,
        },
    });

    revalidatePath("/artworks");
    revalidatePath("/artists");
    revalidatePath("/");
}

// Delete Artwork
export async function deleteArtwork(id: number) {
    await prisma.artwork.delete({
        where: { id },
    });

    revalidatePath("/artworks");
    revalidatePath("/artists");
    revalidatePath("/");
}