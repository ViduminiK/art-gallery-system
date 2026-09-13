'use client';

import { useState } from "react";
import { createExhibition, updateExhibition, deleteExhibition } from "../actions/exhibitionActions";

type ExhibitionItem = {
    id: number;
    title: string;
    description: string | null;
    startDate: Date;
    endDate: Date;
    location: string | null;
};

export default function ExhibitionManager({
                                              initialExhibitions,
                                          }: {
    initialExhibitions: ExhibitionItem[];
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [editingExhibition, setEditingExhibition] = useState<ExhibitionItem | null>(null);

    const filteredExhibitions = initialExhibitions.filter(
        (exhibition) =>
            exhibition.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (exhibition.location && exhibition.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (exhibition.description && exhibition.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const formatDateForInput = (date: Date) => {
        return new Date(date).toISOString().split("T")[0];
    };

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#111622] border border-slate-800 p-4 rounded-xl">
                <div className="relative w-full max-w-md">
                    <input
                        type="text"
                        placeholder="Search exhibitions by title, location, or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#0b0f17] border border-slate-700 rounded-lg py-2 px-4 text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                    />
                </div>
                <span className="text-xs text-slate-400 font-mono">
          Showing {filteredExhibitions.length} of {initialExhibitions.length}
        </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Create / Edit Form Sidebar */}
                <section className="lg:col-span-4 bg-[#111622] border border-slate-800 rounded-xl p-6 shadow-xl space-y-5 h-fit">
                    <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                        <div>
                            <h2 className="text-base font-semibold text-slate-200">
                                {editingExhibition ? "Edit Exhibition" : "New Exhibition Event"}
                            </h2>
                            <p className="text-xs text-slate-400">
                                {editingExhibition ? "Update schedule or details." : "Schedule a new showcase."}
                            </p>
                        </div>
                        {editingExhibition && (
                            <button
                                onClick={() => setEditingExhibition(null)}
                                className="text-xs text-slate-400 hover:text-white underline"
                            >
                                Cancel
                            </button>
                        )}
                    </div>

                    <form
                        action={async (formData) => {
                            if (editingExhibition) {
                                await updateExhibition(formData);
                                setEditingExhibition(null);
                            } else {
                                await createExhibition(formData);
                            }
                        }}
                        className="space-y-4"
                    >
                        {editingExhibition && <input type="hidden" name="id" value={editingExhibition.id} />}

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Exhibition Title *</label>
                            <input
                                key={editingExhibition ? `edit-title-${editingExhibition.id}` : "create-title"}
                                type="text"
                                name="title"
                                defaultValue={editingExhibition?.title || ""}
                                placeholder="e.g. Modernist Visions 2026"
                                required
                                className="w-full bg-[#0b0f17] border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Location / Gallery Hall</label>
                            <input
                                key={editingExhibition ? `edit-location-${editingExhibition.id}` : "create-location"}
                                type="text"
                                name="location"
                                defaultValue={editingExhibition?.location || ""}
                                placeholder="e.g. Main Pavilion, Gallery B"
                                className="w-full bg-[#0b0f17] border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1">Start Date *</label>
                                <input
                                    key={editingExhibition ? `edit-start-${editingExhibition.id}` : "create-start"}
                                    type="date"
                                    name="startDate"
                                    defaultValue={editingExhibition ? formatDateForInput(editingExhibition.startDate) : ""}
                                    required
                                    className="w-full bg-[#0b0f17] border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-100 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1">End Date *</label>
                                <input
                                    key={editingExhibition ? `edit-end-${editingExhibition.id}` : "create-end"}
                                    type="date"
                                    name="endDate"
                                    defaultValue={editingExhibition ? formatDateForInput(editingExhibition.endDate) : ""}
                                    required
                                    className="w-full bg-[#0b0f17] border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-100 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                            <textarea
                                key={editingExhibition ? `edit-desc-${editingExhibition.id}` : "create-desc"}
                                name="description"
                                defaultValue={editingExhibition?.description || ""}
                                placeholder="Overview of the theme, featured curators, or event details..."
                                rows={3}
                                className="w-full bg-[#0b0f17] border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:outline-none resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs py-2.5 px-4 rounded-lg shadow-lg shadow-violet-950/40 transition active:scale-[0.99]"
                        >
                            {editingExhibition ? "Save Changes" : "+ Schedule Exhibition"}
                        </button>
                    </form>
                </section>

                {/* Exhibition Cards Grid */}
                <section className="lg:col-span-8">
                    {filteredExhibitions.length === 0 ? (
                        <div className="bg-[#111622] border border-slate-800 border-dashed rounded-xl p-12 text-center text-slate-400">
                            <p className="text-sm">No exhibitions found.</p>
                            <p className="text-xs text-slate-500 mt-1">Schedule a new exhibition event using the form on the left.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredExhibitions.map((exhibition) => (
                                <div
                                    key={exhibition.id}
                                    className="bg-[#111622] border border-slate-800 hover:border-amber-500/40 rounded-xl p-5 shadow-lg flex flex-col justify-between transition group"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                          {exhibition.location || "Main Hall"}
                        </span>
                                                <h3 className="font-semibold text-base text-slate-100 group-hover:text-amber-300 transition">
                                                    {exhibition.title}
                                                </h3>
                                            </div>
                                        </div>

                                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                            {exhibition.description || "No description provided for this exhibition event."}
                                        </p>

                                        <div className="bg-[#0b0f17] border border-slate-800/80 rounded-lg p-2.5 flex items-center justify-between text-xs text-slate-300 font-mono">
                                            <span>{new Date(exhibition.startDate).toLocaleDateString()}</span>
                                            <span className="text-slate-600">→</span>
                                            <span>{new Date(exhibition.endDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-end gap-2 text-xs">
                                        <button
                                            onClick={() => setEditingExhibition(exhibition)}
                                            className="text-amber-400 hover:text-amber-300 hover:bg-amber-950/40 px-2.5 py-1 rounded border border-transparent hover:border-amber-900/40 transition text-xs font-medium"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={async () => {
                                                await deleteExhibition(exhibition.id);
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