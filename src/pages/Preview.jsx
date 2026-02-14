import React, { useState, useEffect } from 'react';
import ResumePreview from '../components/ResumePreview';
import { Link } from 'react-router-dom';
import { ChevronLeft, Printer, Copy, AlertTriangle, X } from 'lucide-react';

export default function Preview() {
    const [data, setData] = useState(null);
    const [showWarning, setShowWarning] = useState(false);
    const [pendingAction, setPendingAction] = useState(null); // 'print' or 'copy'

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

    const validateAndExecute = (action) => {
        if (!data) return;

        // Validation Logic
        const hasName = data.personal?.name?.trim().length > 0;
        const hasContent = (data.experience?.length > 0) || (data.projects?.length > 0);

        if (!hasName || !hasContent) {
            setPendingAction(action);
            setShowWarning(true);
        } else {
            executeAction(action);
        }
    };

    const executeAction = (action) => {
        setShowWarning(false);
        if (action === 'print') {
            window.print();
        } else if (action === 'copy') {
            copyToClipboard();
        }
    };

    const copyToClipboard = () => {
        if (!data) return;

        const lines = [];
        lines.push(data.personal.name.toUpperCase());
        lines.push(`${data.personal.email} | ${data.personal.phone} | ${data.personal.location}`);
        if (data.links.github) lines.push(`GitHub: ${data.links.github}`);
        if (data.links.linkedin) lines.push(`LinkedIn: ${data.links.linkedin}`);
        lines.push('\nSUMMARY');
        lines.push(data.summary);

        if (data.experience.length > 0) {
            lines.push('\nEXPERIENCE');
            data.experience.forEach(exp => {
                lines.push(`${exp.role} at ${exp.company} (${exp.duration})`);
                lines.push(exp.description);
            });
        }

        if (data.projects.length > 0) {
            lines.push('\nPROJECTS');
            data.projects.forEach(proj => {
                lines.push(`${proj.name} - ${proj.link}`);
                lines.push(proj.description);
            });
        }

        if (data.education.length > 0) {
            lines.push('\nEDUCATION');
            data.education.forEach(edu => {
                lines.push(`${edu.degree}, ${edu.institution} (${edu.year})`);
            });
        }

        if (data.skills.length > 0) {
            lines.push('\nSKILLS');
            lines.push(data.skills.join(', '));
        }

        navigator.clipboard.writeText(lines.join('\n'));
        alert("Resume copied to clipboard successfully!");
    };

    if (!data) return (
        <div className="min-h-screen bg-kodnest-off-white flex flex-col items-center justify-center font-sans">
            <p className="text-slate-500">No resume data found. <Link to="/builder" className="text-kodnest-red underline">Build one now</Link>.</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-kodnest-off-white font-sans pb-20 relative">

            {/* Warning Modal */}
            {showWarning && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 print:hidden">
                    <div className="bg-white rounded-md shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-start gap-4">
                            <div className="bg-amber-100 p-2 rounded-full">
                                <AlertTriangle className="text-amber-600" size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-slate-900 mb-1">Resume Incomplete?</h3>
                                <p className="text-sm text-slate-600 mb-4">
                                    Your resume seems to be missing a <strong>Name</strong> or key <strong>Experience/Projects</strong>. It might look empty when exported.
                                </p>
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setShowWarning(false)}
                                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-sm"
                                    >
                                        Go Back
                                    </button>
                                    <button
                                        onClick={() => executeAction(pendingAction)}
                                        className="px-4 py-2 text-sm font-bold text-white bg-kodnest-red hover:bg-red-900 rounded-sm"
                                    >
                                        Export Anyway
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toolbar */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4 flex justify-between items-center shadow-sm print:hidden">
                <div className="flex items-center gap-4">
                    <Link to="/builder" className="text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2">
                        <ChevronLeft size={20} /> Back to Builder
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex bg-slate-100 p-1 rounded-sm gap-1 mr-4">
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
                        onClick={() => validateAndExecute('copy')}
                        className="text-slate-600 px-4 py-2 rounded-sm text-sm font-medium flex items-center gap-2 hover:bg-slate-100 transition-colors border border-slate-200"
                    >
                        <Copy size={16} /> Copy Text
                    </button>

                    <button
                        onClick={() => validateAndExecute('print')}
                        className="bg-slate-900 text-white px-6 py-2 rounded-sm text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors"
                    >
                        <Printer size={16} /> Print / PDF
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
