'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Create Exhibition
export async function createExhibition(formData: FormData) {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const startDateRaw = formData.get("startDate") as string;
    const endDateRaw = formData.get("endDate") as string;
    const location = formData.get("location") as string;

    if (!title || !startDateRaw || !endDateRaw) {
        throw new Error("Title, Start Date, and End Date are required");
    }

    await prisma.exhibition.create({
        data: {
            title,
            description: description || null,
            startDate: new Date(startDateRaw),
            endDate: new Date(endDateRaw),
            location: location || "", // Pass an empty string or default name instead of null
        },
    });

    revalidatePath("/exhibitions");
    revalidatePath("/");
}

// Update Exhibition
export async function updateExhibition(formData: FormData) {
    const id = parseInt(formData.get("id") as string, 10);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const startDateRaw = formData.get("startDate") as string;
    const endDateRaw = formData.get("endDate") as string;
    const location = formData.get("location") as string;

    if (!id || !title || !startDateRaw || !endDateRaw) {
        throw new Error("ID, Title, Start Date, and End Date are required");
    }

    await prisma.exhibition.update({
        where: { id },
        data: {
            title,
            description: description || null,
            startDate: new Date(startDateRaw),
            endDate: new Date(endDateRaw),
            location: location || "", // Pass an empty string or default name instead of null
        },
    });

    revalidatePath("/exhibitions");
    revalidatePath("/");
}

// Delete Exhibition
export async function deleteExhibition(id: number) {
    await prisma.exhibition.delete({
        where: { id },
    });

    revalidatePath("/exhibitions");
    revalidatePath("/");
}