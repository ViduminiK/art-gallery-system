'use client';

import { useState } from "react";
import { createArtwork, updateArtwork, deleteArtwork } from "../actions/artworkActions";

type Artist = {
    id: number;
    name: string;
};

type ArtworkWithArtist = {
    id: number;
    title: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    status: string;
    artistId: number;
    artist: Artist;
    createdAt: Date;
};

export default function ArtworkManager({
                                           initialArtworks,
                                           artists,
                                       }: {
    initialArtworks: ArtworkWithArtist[];
    artists: Artist[];
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [editingArtwork, setEditingArtwork] = useState<ArtworkWithArtist | null>(null);

    const filteredArtworks = initialArtworks.filter(
        (artwork) =>
            artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (artwork.description && artwork.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
            artwork.artist.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#111622] border border-slate-800 p-4 rounded-xl">
                <div className="relative w-full max-w-md">
                    <input
                        type="text"
                        placeholder="Search artworks by title, description, or artist..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#0b0f17] border border-slate-700 rounded-lg py-2 px-4 text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                    />
                </div>
                <span className="text-xs text-slate-400 font-mono">
          Showing {filteredArtworks.length} of {initialArtworks.length}
        </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Create / Edit Form Sidebar */}
                <section className="lg:col-span-4 bg-[#111622] border border-slate-800 rounded-xl p-6 shadow-xl space-y-5 h-fit">
                    <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                        <div>
                            <h2 className="text-base font-semibold text-slate-200">
                                {editingArtwork ? "Edit Artwork Details" : "New Artwork Item"}
                            </h2>
                            <p className="text-xs text-slate-400">
                                {editingArtwork ? "Update existing record." : "Catalog a piece into the collection."}
                            </p>
                        </div>
                        {editingArtwork && (
                            <button
                                onClick={() => setEditingArtwork(null)}
                                className="text-xs text-slate-400 hover:text-white underline"
                            >
                                Cancel
                            </button>
                        )}
                    </div>

                    <form
                        action={async (formData) => {
                            if (editingArtwork) {
                                await updateArtwork(formData);
                                setEditingArtwork(null);
                            } else {
                                await createArtwork(formData);
                            }
                        }}
                        className="space-y-4"
                    >
                        {editingArtwork && <input type="hidden" name="id" value={editingArtwork.id} />}

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Artwork Title *</label>
                            <input
                                key={editingArtwork ? `edit-title-${editingArtwork.id}` : "create-title"}
                                type="text"
                                name="title"
                                defaultValue={editingArtwork?.title || ""}
                                placeholder="e.g. Starry Night Over the Rhone"
                                required
                                className="w-full bg-[#0b0f17] border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Artist *</label>
                            <select
                                key={editingArtwork ? `edit-artist-${editingArtwork.id}` : "create-artist"}
                                name="artistId"
                                defaultValue={editingArtwork?.artistId || (artists.length > 0 ? artists[0].id : "")}
                                required
                                className="w-full bg-[#0b0f17] border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-100 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                            >
                                {artists.length === 0 ? (
                                    <option value="" disabled>No artists available</option>
                                ) : (
                                    artists.map((artist) => (
                                        <option key={artist.id} value={artist.id}>
                                            {artist.name}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Price ($) *</label>
                            <input
                                key={editingArtwork ? `edit-price-${editingArtwork.id}` : "create-price"}
                                type="number"
                                step="0.01"
                                name="price"
                                defaultValue={editingArtwork?.price ?? 0}
                                placeholder="0.00"
                                required
                                className="w-full bg-[#0b0f17] border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Image URL</label>
                            <input
                                key={editingArtwork ? `edit-image-${editingArtwork.id}` : "create-image"}
                                type="text"
                                name="imageUrl"
                                defaultValue={editingArtwork?.imageUrl || ""}
                                placeholder="https://example.com/artwork.jpg"
                                className="w-full bg-[#0b0f17] border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                            <textarea
                                key={editingArtwork ? `edit-desc-${editingArtwork.id}` : "create-desc"}
                                name="description"
                                defaultValue={editingArtwork?.description || ""}
                                placeholder="Brief description of the artwork..."
                                rows={3}
                                className="w-full bg-[#0b0f17] border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:outline-none resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={artists.length === 0}
                            className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-medium text-xs py-2.5 px-4 rounded-lg shadow-lg shadow-violet-950/40 transition active:scale-[0.99]"
                        >
                            {editingArtwork ? "Save Changes" : "+ Add Artwork"}
                        </button>
                    </form>
                </section>

                {/* Artwork Cards Grid */}
                <section className="lg:col-span-8">
                    {filteredArtworks.length === 0 ? (
                        <div className="bg-[#111622] border border-slate-800 border-dashed rounded-xl p-12 text-center text-slate-400">
                            <p className="text-sm">No artworks found in the system.</p>
                            <p className="text-xs text-slate-500 mt-1">Ensure an artist is added first, then catalog artworks.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredArtworks.map((artwork) => (
                                <div
                                    key={artwork.id}
                                    className="bg-[#111622] border border-slate-800 hover:border-indigo-500/40 rounded-xl overflow-hidden shadow-lg flex flex-col justify-between transition group"
                                >
                                    <div>
                                        {/* Image Preview Banner */}
                                        {artwork.imageUrl ? (
                                            <div className="h-44 w-full overflow-hidden bg-slate-900">
                                                <img
                                                    src={artwork.imageUrl}
                                                    alt={artwork.title}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-44 w-full flex items-center justify-center bg-slate-900/60 border-b border-slate-800 text-slate-500 text-xs">
                                                📷 No Image Provided
                                            </div>
                                        )}

                                        <div className="p-5 space-y-3">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-400">
                                        {artwork.status || "AVAILABLE"}
                                    </span>
                                                    <h3 className="font-semibold text-base text-slate-100 group-hover:text-indigo-300 transition">
                                                        {artwork.title}
                                                    </h3>
                                                </div>
                                                <span className="text-xs font-semibold text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded">
                                    ${artwork.price.toLocaleString()}
                                </span>
                                            </div>

                                            <p className="text-xs text-slate-400 line-clamp-2">
                                                {artwork.description || "No description provided."}
                                            </p>

                                            <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
                                                <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block"></span>
                                                <span>By <strong className="text-slate-200">{artwork.artist.name}</strong></span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5 pt-0 mt-2 flex items-center justify-end gap-2 text-xs">
                                        <button
                                            onClick={() => setEditingArtwork(artwork)}
                                            className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/40 px-2.5 py-1 rounded border border-transparent hover:border-indigo-900/40 transition text-xs font-medium"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={async () => {
                                                await deleteArtwork(artwork.id);
                                            }}
                                            className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 px-2.5 py-1 rounded border border-transparent hover:border-rose-900/40 transition text-xs font-medium"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}