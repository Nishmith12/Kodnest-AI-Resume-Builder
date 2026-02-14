import React, { useState, useEffect } from 'react';
import { useProject } from '../ProjectContext';
import { CheckSquare, Square, Save } from 'lucide-react';

const CHECKLIST_ITEMS = [
    "All form sections save to localStorage",
    "Live preview updates in real-time",
    "Template switching preserves data",
    "Color theme persists after refresh",
    "ATS score calculates correctly",
    "Score updates live on edit",
    "Export buttons work (copy/download)",
    "Empty states handled gracefully",
    "Mobile responsive layout works",
    "No console errors on any page"
];

export default function Test() {
    const { saveArtifact, artifacts } = useProject();
    const [checkedItems, setCheckedItems] = useState({});

    // Load checked state from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('rb_checklist_state');
        if (saved) {
            setCheckedItems(JSON.parse(saved));
        }
    }, []);

    // Save checked state
    const toggleItem = (idx) => {
        const newChecked = { ...checkedItems, [idx]: !checkedItems[idx] };
        setCheckedItems(newChecked);
        localStorage.setItem('rb_checklist_state', JSON.stringify(newChecked));
    };

    const allChecked = CHECKLIST_ITEMS.every((_, i) => checkedItems[i]);

    const handleComplete = () => {
        if (allChecked) {
            saveArtifact(7, 'verified');
        }
    };

    return (
        <div className="max-w-[720px] mx-auto space-y-10 pb-20">
            <div className="space-y-4">
                <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight leading-tight">07. Testing & Verification</h1>
                <p className="text-xl text-slate-600 leading-relaxed font-serif">
                    Verify the system against the core requirements before shipping.
                </p>
            </div>

            <div className="bg-white p-8 rounded-sm border border-slate-200 shadow-sm">
                <div className="space-y-4">
                    {CHECKLIST_ITEMS.map((item, idx) => (
                        <div key={idx}
                            onClick={() => toggleItem(idx)}
                            className={`flex items-center gap-4 p-4 rounded-sm border cursor-pointer transition-all ${checkedItems[idx] ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                                }`}
                        >
                            <div className={`flex-shrink-0 ${checkedItems[idx] ? 'text-emerald-600' : 'text-slate-300'}`}>
                                {checkedItems[idx] ? <CheckSquare size={24} /> : <Square size={24} />}
                            </div>
                            <span className={`font-medium ${checkedItems[idx] ? 'text-slate-900' : 'text-slate-500'}`}>{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleComplete}
                    disabled={!allChecked || artifacts[7]}
                    className={`px-8 py-4 rounded-sm font-bold uppercase tracking-widest transition-all flex items-center gap-3 ${allChecked
                            ? (artifacts[7] ? 'bg-emerald-600 text-white cursor-default' : 'bg-kodnest-red text-white hover:bg-red-900')
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                >
                    {artifacts[7] ? 'VERIFIED & COMPLETED' : 'MARK STEP COMPLETE'}
                    {artifacts[7] && <CheckSquare size={20} />}
                </button>
            </div>
        </div>
    );
}
