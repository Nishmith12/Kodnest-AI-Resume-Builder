import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Smartphone, Copy, ExternalLink, ArrowRight, AlertCircle, Check, CheckCircle } from 'lucide-react';
import { useProject } from './ProjectContext';

const PROMPTS = {
    1: "Limit the scope to a specific problem area. Define 3 key user personas and their primary pain points. Output a JSON object with 'problem_statement', 'personas' (array), and 'pain_points' (array).",
    2: "Analyze the market for this problem. Identify 3 competitors. Define the TAM, SAM, and SOM. Output JSON with 'competitors' and 'market_size'.",
    3: "Create a system architecture diagram (Mermaid). Define the tech stack (Frontend, Backend, Database). Output JSON with 'tech_stack' and 'mermaid_diagram'.",
    4: "Create a High Level Design (HLD). Define the key modules and their interactions. Output JSON with 'modules' and 'data_flow'.",
    5: "Create a Low Level Design (LLD) for the Core Service. Define the API endpoints and Database Schema. Output JSON with 'api_endpoints' and 'schema'.",
    6: "Generate the core React components for the landing page and dashboard. Use TailwindCSS.",
    7: "Write 3 unit tests for the core logic using Jest/Vitest.",
    8: "Prepare a deployment script (Dockerfile) and a release note draft."
};

const PremiumLayout = () => {
    const { isStepComplete, saveArtifact, STEPS, currentStep } = useProject();
    const location = useLocation();
    const navigate = useNavigate();

    const currentPath = location.pathname.split('/').pop();
    const isProofPage = currentPath === 'proof';

    const stepId = currentStep?.id;
    const isComplete = isStepComplete(stepId);
    const nextStep = STEPS.find(s => s.id === (stepId || 0) + 1);

    const [copyStatus, setCopyStatus] = useState('idle'); // idle, copied
    const [buildStatus, setBuildStatus] = useState('idle'); // idle, success, error

    const handleCopy = () => {
        if (!stepId) return;
        navigator.clipboard.writeText(PROMPTS[stepId] || "");
        setCopyStatus('copied');
        setTimeout(() => setCopyStatus('idle'), 2000);
    };

    const handleItWorked = () => {
        if (!stepId) return;
        saveArtifact(stepId, "COMPLETED_VERIFIED");
        setBuildStatus('success');
    };

    const handleError = () => {
        setBuildStatus('error');
        setTimeout(() => setBuildStatus('idle'), 3000);
    };

    const handleNext = () => {
        if (nextStep) {
            navigate(`/rb/${nextStep.path}`);
            setBuildStatus('idle');
        } else {
            navigate('/rb/proof');
        }
    };

    return (
        <div className="flex flex-col h-screen bg-kodnest-off-white text-slate-900 font-sans selection:bg-kodnest-red selection:text-white">
            {/* Top Bar - h-16 (64px) */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-10 flex-shrink-0 z-10">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-kodnest-red rounded-sm flex items-center justify-center text-white font-serif font-bold text-xl">
                        AI
                    </div>
                    <span className="font-serif font-bold text-xl tracking-wide text-slate-900">AI Resume Builder</span>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-slate-500 text-sm font-medium tracking-wide">
                        {isProofPage ? 'Project Completion' : `Project 3 — Step ${stepId || 'Prf'} / ${STEPS.length}`}
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    {!isProofPage && (
                        <span className={`px-4 py-2 text-xs font-bold tracking-wider uppercase rounded-sm border ${isComplete
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-white text-kodnest-red border-kodnest-red'
                            }`}>
                            {isComplete ? 'Completed' : 'Active'}
                        </span>
                    )}
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Main Workspace (70%) - p-16 (64px) */}
                <main className="flex-1 overflow-y-auto p-16 relative bg-kodnest-off-white">
                    <Outlet />

                    {/* Next Step Navigation in Workspace */}
                    {!isProofPage && (
                        <div className="mt-16 flex justify-end max-w-[720px] mx-auto">
                            <button
                                onClick={handleNext}
                                disabled={!isComplete}
                                className={`flex items-center gap-4 px-10 py-4 rounded-sm font-bold tracking-wide transition-all border ${isComplete
                                        ? 'bg-kodnest-red text-white border-kodnest-red hover:bg-red-900 shadow-sm'
                                        : 'bg-transparent text-slate-300 border-slate-200 cursor-not-allowed'
                                    }`}
                            >
                                Next Step
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    )}
                </main>

                {/* Secondary Build Panel (30%) */}
                {!isProofPage && (
                    <aside className="w-[30%] bg-white border-l border-slate-200 flex flex-col">
                        {/* p-6 (24px) */}
                        <div className="p-6 border-b border-slate-200 bg-white">
                            <h3 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-4 tracking-wide">
                                <Smartphone size={20} className="text-kodnest-red" />
                                Build Context
                            </h3>
                        </div>
                        {/* p-10 (40px) */}
                        <div className="flex-1 p-10 overflow-y-auto space-y-10">

                            {/* Prompt Section */}
                            <div className="space-y-4">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    Copy This Into Lovable
                                </label>
                                <div className="relative group">
                                    <textarea
                                        readOnly
                                        className="w-full h-40 p-4 text-sm bg-kodnest-off-white border border-slate-200 rounded-sm resize-none text-slate-700 focus:outline-none focus:border-kodnest-red transition-colors font-mono leading-relaxed"
                                        value={PROMPTS[stepId] || "Loading prompt..."}
                                    />
                                    <button
                                        onClick={handleCopy}
                                        className="absolute bottom-4 right-4 p-2 bg-white border border-slate-200 hover:border-kodnest-red rounded-sm text-slate-600 hover:text-kodnest-red transition-all"
                                        title="Copy to clipboard"
                                    >
                                        {copyStatus === 'copied' ? <Check size={16} className="text-kodnest-red" /> : <Copy size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-4">
                                <a
                                    href="https://lovable.dev"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-4 w-full py-4 bg-slate-900 text-white rounded-sm hover:bg-black transition-colors font-bold text-sm tracking-wide"
                                >
                                    Build in Lovable <ExternalLink size={16} />
                                </a>
                            </div>

                            <div className="border-t border-slate-100 pt-10">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-4">
                                    Verification
                                </label>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={handleError}
                                        className="flex items-center justify-center gap-4 py-4 border border-slate-200 bg-white text-slate-600 rounded-sm hover:bg-slate-50 hover:text-red-700 transition-colors text-sm font-medium"
                                    >
                                        <AlertCircle size={18} /> Error
                                    </button>
                                    <button
                                        onClick={handleItWorked}
                                        disabled={isComplete}
                                        className={`flex items-center justify-center gap-4 py-4 border rounded-sm transition-all text-sm font-bold ${isComplete || buildStatus === 'success'
                                                ? 'bg-white border-slate-900 text-slate-900'
                                                : 'bg-kodnest-red text-white border-kodnest-red hover:bg-red-900'
                                            }`}
                                    >
                                        <CheckCircle size={18} />
                                        {isComplete ? 'Completed' : 'It Worked'}
                                    </button>
                                </div>

                                {buildStatus === 'error' && (
                                    <p className="text-xs text-kodnest-red mt-4 text-center font-medium">
                                        Something went wrong? Try rebuilding in Lovable.
                                    </p>
                                )}
                            </div>

                        </div>
                    </aside>
                )}
            </div>

            {/* Proof Footer */}
            <footer className="h-16 bg-white border-t border-slate-200 flex items-center justify-between px-10 flex-shrink-0 text-sm text-slate-500">
                <div className="flex items-center gap-6">
                    {STEPS.map((s, idx) => (
                        <React.Fragment key={s.id}>
                            <span className={`flex items-center gap-4 ${isStepComplete(s.id) ? 'text-kodnest-red font-bold' : 'text-slate-300'}`}>
                                <div className={`w-2.5 h-2.5 rounded-full ${isStepComplete(s.id) ? 'bg-kodnest-red' : 'bg-slate-200'}`}></div>
                                <span className="font-serif tracking-wide">{s.id}</span>
                            </span>
                            {idx < STEPS.length - 1 && <span className="w-10 h-px bg-slate-100"></span>}
                        </React.Fragment>
                    ))}
                </div>
                <div className="font-serif tracking-wide text-slate-400">
                    KodNest Premium System
                </div>
            </footer>
        </div>
    );
};

export default PremiumLayout;
