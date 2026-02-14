import React, { useState, useEffect } from 'react';
import { useProject } from '../ProjectContext';
import { CheckCircle, ExternalLink, Copy, Check, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function Proof() {
    const { isStepComplete, STEPS } = useProject();

    const [links, setLinks] = useState({
        lovable: '',
        github: '',
        deploy: ''
    });

    const [copied, setCopied] = useState(false);
    const [checklistPassed, setChecklistPassed] = useState(false);

    // Load saved links and checklist status
    useEffect(() => {
        const savedLinks = localStorage.getItem('rb_final_submission');
        if (savedLinks) {
            setLinks(JSON.parse(savedLinks));
        }

        const checklist = localStorage.getItem('rb_checklist_state');
        if (checklist) {
            const parsed = JSON.parse(checklist);
            // Verify all 10 items (indices 0-9) are true
            const allPassed = Object.keys(parsed).length === 10 && Object.values(parsed).every(v => v === true);
            setChecklistPassed(allPassed);
        }
    }, []);

    // Save links on change
    useEffect(() => {
        localStorage.setItem('rb_final_submission', JSON.stringify(links));
    }, [links]);

    const allStepsComplete = STEPS.every(s => isStepComplete(s.id));
    const completionPercentage = Math.round((STEPS.filter(s => isStepComplete(s.id)).length / STEPS.length) * 100);

    // URL Validation Regex
    const isValidUrl = (string) => {
        try {
            new URL(string);
            return string.startsWith('http');
        } catch (_) {
            return false;
        }
    };

    // Shipped Logic: 8 Steps + Checklist + 3 Valid Links
    const isShipped = allStepsComplete && checklistPassed
        && isValidUrl(links.lovable)
        && isValidUrl(links.github)
        && isValidUrl(links.deploy);

    const handleCopy = () => {
        const submissionText = `
AI Resume Builder — Final Submission

Lovable Project: ${links.lovable}
GitHub Repository: ${links.github}
Live Deployment: ${links.deploy}

Core Capabilities:
- Structured resume builder
- Deterministic ATS scoring
- Template switching
- PDF export with clean formatting
- Persistence + validation checklist
`.trim();

        navigator.clipboard.writeText(submissionText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-[720px] mx-auto space-y-16 pb-24">
            <div className="space-y-6 text-center">
                <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">Project Proof & Submission</h1>
                <p className="text-xl text-slate-600 max-w-xl mx-auto font-serif leading-relaxed">
                    Verify all steps are completed and submit your final project links.
                </p>
                {isShipped && (
                    <div className="mt-8 bg-emerald-50 text-emerald-800 px-6 py-3 rounded-full inline-flex items-center gap-2 font-serif font-bold tracking-wide border border-emerald-100">
                        <ShieldCheck size={20} />
                        Project 3 Shipped Successfully.
                    </div>
                )}
            </div>

            {/* Progress Overview */}
            <div className="bg-white p-10 rounded-sm border border-slate-200">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl font-serif font-bold text-slate-800">Build Progress</h2>
                    <div className="flex items-center gap-4">
                        <div className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-widest ${isShipped ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                            {isShipped ? 'Shipped' : 'In Progress'}
                        </div>
                        <span className={`text-4xl font-serif font-bold ${allStepsComplete ? 'text-slate-900' : 'text-kodnest-red'}`}>
                            {completionPercentage}%
                        </span>
                    </div>
                </div>

                <div className="w-full bg-kodnest-off-white rounded-full h-4 mb-10 border border-slate-100">
                    <div
                        className={`h-4 rounded-full transition-all duration-1000 ${allStepsComplete ? 'bg-slate-900' : 'bg-kodnest-red'}`}
                        style={{ width: `${completionPercentage}%` }}
                    ></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {STEPS.map((step) => (
                        <div key={step.id} className="flex items-center gap-4 p-4 rounded-sm border border-slate-100 bg-kodnest-off-white">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border ${isStepComplete(step.id) ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-300 border-slate-200'}`}>
                                {isStepComplete(step.id) ? <Check size={16} strokeWidth={3} /> : <span className="text-xs font-bold">{step.id}</span>}
                            </div>
                            <span className={`font-medium tracking-wide ${isStepComplete(step.id) ? 'text-slate-900' : 'text-slate-400'}`}>
                                {step.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Submission Form */}
            <div className="bg-white p-10 rounded-sm border border-slate-200">
                <h2 className="text-2xl font-serif font-bold text-slate-800 mb-10 flex items-center gap-4">
                    <ExternalLink size={24} className="text-kodnest-red" />
                    Project Links
                </h2>

                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Lovable Project Link</label>
                        <input
                            type="url"
                            className="w-full p-4 border border-slate-200 rounded-sm bg-kodnest-off-white focus:bg-white focus:border-kodnest-red focus:ring-0 outline-none transition-all font-mono text-sm"
                            placeholder="https://lovable.dev/..."
                            value={links.lovable}
                            onChange={(e) => setLinks({ ...links, lovable: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">GitHub Repository</label>
                        <input
                            type="url"
                            className="w-full p-4 border border-slate-200 rounded-sm bg-kodnest-off-white focus:bg-white focus:border-kodnest-red focus:ring-0 outline-none transition-all font-mono text-sm"
                            placeholder="https://github.com/..."
                            value={links.github}
                            onChange={(e) => setLinks({ ...links, github: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Deployment URL</label>
                        <input
                            type="url"
                            className="w-full p-4 border border-slate-200 rounded-sm bg-kodnest-off-white focus:bg-white focus:border-kodnest-red focus:ring-0 outline-none transition-all font-mono text-sm"
                            placeholder="https://vercel.app/..."
                            value={links.deploy}
                            onChange={(e) => setLinks({ ...links, deploy: e.target.value })}
                        />
                    </div>
                </div>

                <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col sm:flex-row gap-6 justify-end items-center">
                    {(!allStepsComplete || !checklistPassed) && (
                        <div className="flex items-center gap-4 text-kodnest-red bg-red-50 px-6 py-3 rounded-sm text-sm font-bold border border-red-100 tracking-wide">
                            <AlertTriangle size={18} />
                            <span>{!allStepsComplete ? 'COMPLETE ALL STEPS' : 'COMPLETE CHECKLIST (STEP 7)'}</span>
                        </div>
                    )}

                    <button
                        onClick={handleCopy}
                        disabled={!isShipped}
                        className={`flex items-center gap-4 px-8 py-4 rounded-sm font-bold uppercase tracking-widest transition-all ${isShipped
                            ? 'bg-kodnest-red text-white hover:bg-red-900 transform active:scale-95'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        {copied ? <Check size={20} /> : <Copy size={20} />}
                        {copied ? 'COPIED!' : 'COPY FINAL SUBMISSION'}
                    </button>
                </div>
            </div>
        </div>
    );
}
