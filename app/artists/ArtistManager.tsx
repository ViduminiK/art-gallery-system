'use client';

import { useState } from "react";
import { createArtist, updateArtist, deleteArtist } from "../actions/artistActions";

type ArtistWithArtworks = {
    id: number;
    name: string;
    email: string;
    bio: string | null;
    artworks: { id: number }[];
};

export default function ArtistManager({ initialArtists }: { initialArtists: ArtistWithArtworks[] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [editingArtist, setEditingArtist] = useState<ArtistWithArtworks | null>(null);

    const filteredArtists = initialArtists.filter(
        (artist) =>
            artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            artist.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Search Input Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#111622] border border-slate-800 p-4 rounded-xl">
                <div className="relative w-full max-w-md">
                    <input
                        type="text"
                        placeholder="Search artists by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#0b0f17] border border-slate-700 rounded-lg py-2 px-4 text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                    />
                </div>
                <span className="text-xs text-slate-400 font-mono">
          Showing {filteredArtists.length} of {initialArtists.length}
        </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Create / Edit Form Drawer */}
                <section className="lg:col-span-4 bg-[#111622] border border-slate-800 rounded-xl p-6 shadow-xl space-y-5 h-fit">
                    <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                        <div>
                            <h2 className="text-base font-semibold text-slate-200">
                                {editingArtist ? "Edit Artist Profile" : "New Artist Profile"}
                            </h2>
                            <p className="text-xs text-slate-400">
                                {editingArtist ? "Update existing record in Neon." : "Add a new record to the database."}
                            </p>
                        </div>
                        {editingArtist && (
                            <button
                                onClick={() => setEditingArtist(null)}
                                className="text-xs text-slate-400 hover:text-white underline"
                            >
                                Cancel
                            </button>
                        )}
                    </div>

                    <form
                        action={async (formData) => {
                            if (editingArtist) {
                                await updateArtist(formData);
                                setEditingArtist(null);
                            } else {
                                await createArtist(formData);
                            }
                        }}
                        className="space-y-4"
                    >
                        {editingArtist && <input type="hidden" name="id" value={editingArtist.id} />}

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Full Name *</label>
                            <input
                                key={editingArtist ? `edit-name-${editingArtist.id}` : "create-name"}
                                type="text"
                                name="name"
                                defaultValue={editingArtist?.name || ""}
                                placeholder="e.g. Elena Rostova"
                                required
                                className="w-full bg-[#0b0f17] border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address *</label>
                            <input
                                key={editingArtist ? `edit-email-${editingArtist.id}` : "create-email"}
                                type="email"
                                name="email"
                                defaultValue={editingArtist?.email || ""}
                                placeholder="elena@gallery.com"
                                required
                                className="w-full bg-[#0b0f17] border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Biography</label>
                            <textarea
                                key={editingArtist ? `edit-bio-${editingArtist.id}` : "create-bio"}
                                name="bio"
                                defaultValue={editingArtist?.bio || ""}
                                placeholder="Write a brief overview of the artist's background..."
                                rows={4}
                                className="w-full bg-[#0b0f17] border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:outline-none resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs py-2.5 px-4 rounded-lg shadow-lg shadow-violet-950/40 transition active:scale-[0.99]"
                        >
                            {editingArtist ? "Save Changes" : "+ Add Artist Profile"}
                        </button>
                    </form>
                </section>

                {/* Artist Grid View */}
                <section className="lg:col-span-8">
                    {filteredArtists.length === 0 ? (
                        <div className="bg-[#111622] border border-slate-800 border-dashed rounded-xl p-12 text-center text-slate-400">
                            <p className="text-sm">No matching artists found.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredArtists.map((artist) => (
                                <div
                                    key={artist.id}
                                    className="bg-[#111622] border border-slate-800 hover:border-violet-500/40 rounded-xl p-5 shadow-lg flex flex-col justify-between transition group"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-semibold text-violet-400 text-sm">
                                                    {artist.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-sm text-slate-100 group-hover:text-violet-300 transition">
                                                        {artist.name}
                                                    </h3>
                                                    <p className="text-xs text-slate-400">{artist.email}</p>
                                                </div>
                                            </div>

                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950/70 border border-emerald-800/40 text-emerald-400">
                        Active
                      </span>
                                        </div>

                                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                            {artist.bio || "No biography details available."}
                                        </p>
                                    </div>

                                    <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-mono text-[11px]">
                      {artist.artworks.length} Artworks
                    </span>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setEditingArtist(artist)}
                                                className="text-violet-400 hover:text-violet-300 hover:bg-violet-950/40 px-2.5 py-1 rounded border border-transparent hover:border-violet-900/40 transition text-xs font-medium"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    await deleteArtist(artist.id);
                                                }}
                                                className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 px-2.5 py-1 rounded border border-transparent hover:border-rose-900/40 transition text-xs font-medium"
                                            >
                                                Remove
                                            </button>
                                        </div>
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