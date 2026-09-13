'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Create Artist
export async function createArtist(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const bio = formData.get("bio") as string;

    if (!name || !email) {
        throw new Error("Name and Email are required");
    }

    await prisma.artist.create({
        data: { name, email, bio },
    });

    revalidatePath("/artists");
    revalidatePath("/");
}

// Update Artist
export async function updateArtist(formData: FormData) {
    const id = Number(formData.get("id"));
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const bio = formData.get("bio") as string;

    if (!id || !name || !email) {
        throw new Error("ID, Name, and Email are required");
    }

    await prisma.artist.update({
        where: { id },
        data: { name, email, bio },
    });

    revalidatePath("/artists");
    revalidatePath("/");
}

// Delete Artist
export async function deleteArtist(id: number) {
    await prisma.artist.delete({
        where: { id },
    });

    revalidatePath("/artists");
    revalidatePath("/");
}