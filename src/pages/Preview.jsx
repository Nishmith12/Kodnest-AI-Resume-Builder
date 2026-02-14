import React from 'react';

export default function Preview() {
    return (
        <div className="min-h-screen bg-kodnest-off-white flex flex-col items-center justify-center font-sans">
            <h1 className="text-3xl font-serif font-bold text-slate-900 mb-6">Resume Preview</h1>
            <p className="text-slate-600 mb-8">This view is optimized for printing/exporting (Coming Soon).</p>

            <div className="bg-white p-10 shadow-lg w-[210mm] min-h-[297mm]">
                <div className="text-center text-slate-400 italic mt-40">
                    Resume content will appear here in clean read-only mode.
                </div>
            </div>
        </div>
    );
}
