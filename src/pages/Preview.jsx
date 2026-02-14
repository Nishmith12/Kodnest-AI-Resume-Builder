import React, { useState, useEffect } from 'react';
import ResumePreview from '../components/ResumePreview';
import { Link } from 'react-router-dom';
import { ChevronLeft, Printer } from 'lucide-react';

export default function Preview() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('resumeBuilderData');
        if (saved) {
            try {
                setData(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load resume data", e);
            }
        }
    }, []);

    const setTemplate = (tpl) => {
        if (!data) return;
        const newData = { ...data, template: tpl };
        setData(newData);
        localStorage.setItem('resumeBuilderData', JSON.stringify(newData));
    };

    if (!data) return (
        <div className="min-h-screen bg-kodnest-off-white flex flex-col items-center justify-center font-sans">
            <p className="text-slate-500">No resume data found. <Link to="/builder" className="text-kodnest-red underline">Build one now</Link>.</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-kodnest-off-white font-sans pb-20">
            {/* Toolbar */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4 flex justify-between items-center shadow-sm print:hidden">
                <div className="flex items-center gap-4">
                    <Link to="/builder" className="text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2">
                        <ChevronLeft size={20} /> Back to Builder
                    </Link>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex bg-slate-100 p-1 rounded-sm gap-1">
                        {['classic', 'modern', 'minimal'].map(t => (
                            <button
                                key={t}
                                onClick={() => setTemplate(t)}
                                className={`text-xs font-bold uppercase px-3 py-1.5 rounded-sm transition-all ${data.template === t
                                        ? 'bg-white text-slate-900 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => window.print()}
                        className="bg-slate-900 text-white px-6 py-2 rounded-sm text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors"
                    >
                        <Printer size={16} /> Print / Save PDF
                    </button>
                </div>
            </div>

            <div className="mt-10 flex justify-center print:mt-0 print:block">
                <div className="print:w-full">
                    <ResumePreview data={data} template={data.template || 'classic'} />
                </div>
            </div>
        </div>
    );
}
