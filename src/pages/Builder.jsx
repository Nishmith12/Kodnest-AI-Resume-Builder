import React, { useState, useEffect } from 'react';
import { Layout, Save, Download, RefreshCw, ChevronLeft, AlertCircle, CheckCircle, TrendingUp, Info, ExternalLink, Plus, Trash2, X, ChevronDown, ChevronUp, Loader2, Github, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import ResumePreview from '../components/ResumePreview';

const INITIAL_DATA = {
    personal: { name: '', email: '', phone: '', location: '' },
    summary: '',
    education: [],
    experience: [],
    projects: [],
    skills: { technical: [], soft: [], tools: [] }, // Changed to object
    links: { github: '', linkedin: '' },
    template: 'classic',
    themeColor: '#0f766e' // Default Teal
};

const SAMPLE_DATA = {
    personal: {
        name: 'Alex Rivera',
        email: 'alex.rivera@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA'
    },
    summary: 'Senior Frontend Engineer with 6+ years of experience building scalable web applications. Passionate about clean code, performance optimization, and intuitive user experiences. Expert in React ecosystem and modern CSS.',
    education: [
        { degree: 'B.S. Computer Science', institution: 'University of California, Berkeley', year: '2016 - 2020' }
    ],
    experience: [
        {
            role: 'Senior Software Engineer',
            company: 'TechFlow Inc.',
            duration: '2022 - Present',
            description: 'Led the migration of a legacy monolithic application to a micro-frontend architecture using Webpack Module Federation.\nImproved site performance metrics (Core Web Vitals) by 40% through code splitting and lazy loading.\nMentored 3 junior developers and established code review guidelines.'
        },
        {
            role: 'Frontend Developer',
            company: 'StartUp Alpha',
            duration: '2020 - 2022',
            description: 'Developed and maintained the core customer dashboard used by 50k+ daily users.\nCollaborated with product designers to implement a new design system using Tailwind CSS.'
        }
    ],
    projects: [
        {
            id: '1',
            title: 'E-Commerce Platform',
            description: 'A full-stack e-commerce solution built with Next.js, Stripe, and PostgreSQL. Features real-time inventory and AI recommendations.',
            techStack: ['Next.js', 'PostgreSQL', 'Stripe', 'Redis'],
            liveUrl: 'https://demo-ecommerce.com',
            githubUrl: 'https://github.com/alex/ecommerce'
        },
        {
            id: '2',
            title: 'Task Master AI',
            description: 'Productivity app utilizing OpenAI API to auto-categorize tasks and suggest priority levels based on user habits.',
            techStack: ['React', 'Node.js', 'OpenAI API'],
            liveUrl: '',
            githubUrl: 'https://github.com/alex/task-ai'
        }
    ],
    skills: {
        technical: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'GraphQL'],
        soft: ['Team Leadership', 'Mentoring', 'Agile Methodologies'],
        tools: ['Git', 'Docker', 'AWS', 'Figma']
    },
    links: { github: 'github.com/alexrivera', linkedin: 'linkedin.com/in/alexrivera' },
    template: 'classic'
};

const ACTION_VERBS = [
    'Built', 'Developed', 'Designed', 'Implemented', 'Led', 'Improved', 'Created', 'Optimized', 'Automated',
    'Managed', 'Launched', 'Initiated', 'Reduced', 'Increased', 'Saved', 'Generated'
];

export default function Builder() {
    const [data, setData] = useState(INITIAL_DATA);
    const [score, setScore] = useState(0);
    const [suggestions, setSuggestions] = useState([]);
    const [isSuggestingSkills, setIsSuggestingSkills] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('resumeBuilderData');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Simple migration check: if skills is array, convert to object
                if (Array.isArray(parsed.skills)) {
                    parsed.skills = { technical: parsed.skills, soft: [], tools: [] };
                }
                // Ensure projects have new fields
                if (parsed.projects) {
                    parsed.projects = parsed.projects.map(p => ({
                        ...p,
                        id: p.id || Math.random().toString(36).substr(2, 9),
                        title: p.title || p.name || '',
                        techStack: p.techStack || [],
                        liveUrl: p.liveUrl || p.link || '', // migrate link -> liveUrl
                        githubUrl: p.githubUrl || ''
                    }));
                }
                setData(parsed);
                calculateScore(parsed);
            } catch (e) {
                console.error("Failed to load resume data", e);
            }
        }
    }, []);

    // Autosave
    useEffect(() => {
        localStorage.setItem('resumeBuilderData', JSON.stringify(data));
        calculateScore(data);
    }, [data]);

    const calculateScore = (resumeData) => {
        let newScore = 0;
        const newSuggestions = [];

        // 1. Personal Info (Total: 35)
        if (resumeData.personal.name) newScore += 10;
        else newSuggestions.push("Add your full name (+10)");

        if (resumeData.personal.email) newScore += 10;
        else newSuggestions.push("Add your email address (+10)");

        if (resumeData.personal.phone) newScore += 5;
        else newSuggestions.push("Add phone number (+5)");

        if (resumeData.links.linkedin) newScore += 5;
        else newSuggestions.push("Add LinkedIn profile (+5)");

        if (resumeData.links.github) newScore += 5;
        else newSuggestions.push("Add GitHub profile (+5)");

        // 2. Summary (Total: 20)
        const summary = resumeData.summary || "";
        if (summary.length > 50) newScore += 10;
        else newSuggestions.push("Expand summary (> 50 chars) (+10)");

        const hasActionVerbs = ACTION_VERBS.some(verb =>
            summary.toLowerCase().includes(verb.toLowerCase())
        );
        if (hasActionVerbs) newScore += 10;
        else newSuggestions.push("Use action verbs in summary (e.g. Built, Led) (+10)");

        // 3. Experience (Total: 15)
        if (resumeData.experience && resumeData.experience.length >= 1) newScore += 15;
        else newSuggestions.push("Add at least 1 work experience (+15)");

        // 4. Education (Total: 10)
        if (resumeData.education && resumeData.education.length >= 1) newScore += 10;
        else newSuggestions.push("Add education details (+10)");

        // 5. Skills (Total: 10)
        const totalSkills = (resumeData.skills.technical?.length || 0) +
            (resumeData.skills.soft?.length || 0) +
            (resumeData.skills.tools?.length || 0);
        if (totalSkills >= 5) newScore += 10;
        else newSuggestions.push("Add at least 5 skills (+10)");

        // 6. Projects (Total: 10)
        if (resumeData.projects && resumeData.projects.length >= 1) newScore += 10;
        else newSuggestions.push("Add at least 1 project (+10)");

        setScore(Math.min(100, newScore));
        setSuggestions(newSuggestions);
    };

    const getScoreColor = (s) => {
        if (s <= 40) return 'text-red-500';
        if (s <= 70) return 'text-amber-500';
        return 'text-emerald-500';
    };

    const getScoreLabel = (s) => {
        if (s <= 40) return 'Needs Work';
        if (s <= 70) return 'Getting There';
        return 'Strong Resume';
    };

    const getBulletGuidance = (text) => {
        if (!text) return null;
        const lines = text.split('\n');
        const issues = [];
        lines.forEach((line) => {
            if (!line.trim()) return;
            const firstWord = line.trim().split(' ')[0];
            const startsWithVerb = ACTION_VERBS.some(v => firstWord.toLowerCase().startsWith(v.toLowerCase()));
            if (!startsWithVerb) issues.push("Start bullets with strong action verbs (e.g. Built, Led).");
            if (!/\d/.test(line)) issues.push("Add measurable impact (numbers).");
        });
        return issues.length > 0 ? [...new Set(issues)][0] : null;
    };

    const loadSampleData = () => setData(SAMPLE_DATA);
    const setTemplate = (tpl) => setData({ ...data, template: tpl });
    const handlePersonalChange = (e) => setData({ ...data, personal: { ...data.personal, [e.target.name]: e.target.value } });
    const handleLinkChange = (e) => setData({ ...data, links: { ...data.links, [e.target.name]: e.target.value } });

    // Education & Experience handlers (simplified for brevity, logic effectively same)
    const updateEducation = (idx, field, value) => {
        const newEdu = [...data.education]; newEdu[idx][field] = value; setData({ ...data, education: newEdu });
    };
    const addEducation = () => setData({ ...data, education: [...data.education, { degree: '', institution: '', year: '' }] });
    const updateExperience = (idx, field, value) => {
        const newExp = [...data.experience]; newExp[idx][field] = value; setData({ ...data, experience: newExp });
    };
    const addExperience = () => setData({ ...data, experience: [...data.experience, { role: '', company: '', duration: '', description: '' }] });

    // --- SKILLS SECTION HANDLERS ---
    const addSkill = (category, skillName) => {
        if (!skillName.trim()) return;
        const newSkills = { ...data.skills };
        if (!newSkills[category].includes(skillName.trim())) {
            newSkills[category] = [...newSkills[category], skillName.trim()];
            setData({ ...data, skills: newSkills });
        }
    };

    const removeSkill = (category, skillName) => {
        const newSkills = { ...data.skills };
        newSkills[category] = newSkills[category].filter(s => s !== skillName);
        setData({ ...data, skills: newSkills });
    };

    const suggestSkills = () => {
        setIsSuggestingSkills(true);
        setTimeout(() => {
            const suggestions = {
                technical: ["TypeScript", "React", "Node.js", "PostgreSQL", "GraphQL"],
                soft: ["Team Leadership", "Problem Solving"],
                tools: ["Git", "Docker", "AWS"]
            };
            const newSkills = { ...data.skills };
            Object.keys(suggestions).forEach(cat => {
                suggestions[cat].forEach(skill => {
                    if (!newSkills[cat].includes(skill)) newSkills[cat].push(skill);
                });
            });
            setData({ ...data, skills: newSkills });
            setIsSuggestingSkills(false);
        }, 1000);
    };

    // --- PROJECTS SECTION HANDLERS ---
    const addProject = () => {
        setData({
            ...data,
            projects: [...data.projects, {
                id: Math.random().toString(36).substr(2, 9),
                title: '', description: '', techStack: [], liveUrl: '', githubUrl: ''
            }]
        });
    };

    const updateProject = (id, field, value) => {
        const newProjects = data.projects.map(p => p.id === id ? { ...p, [field]: value } : p);
        setData({ ...data, projects: newProjects });
    };

    const deleteProject = (id) => {
        setData({ ...data, projects: data.projects.filter(p => p.id !== id) });
    };

    const addTechStack = (projId, tech) => {
        if (!tech.trim()) return;
        const newProjects = data.projects.map(p => {
            if (p.id === projId && !p.techStack.includes(tech.trim())) {
                return { ...p, techStack: [...p.techStack, tech.trim()] };
            }
            return p;
        });
        setData({ ...data, projects: newProjects });
    };

    const removeTechStack = (projId, tech) => {
        const newProjects = data.projects.map(p => {
            if (p.id === projId) {
                return { ...p, techStack: p.techStack.filter(t => t !== tech) };
            }
            return p;
        });
        setData({ ...data, projects: newProjects });
    };


    const [toastMessage, setToastMessage] = useState(null);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-kodnest-off-white overflow-hidden relative">
            {/* Toast Notification */}
            {toastMessage && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 animate-fade-in-down">
                    <CheckCircle size={16} className="text-emerald-400" />
                    <span className="text-sm font-medium">{toastMessage}</span>
                </div>
            )}

            {/* Left Panel - Form Editor */}
            <div className="w-full lg:w-1/2 flex flex-col border-r-0 lg:border-r border-slate-200 bg-white h-1/2 lg:h-full">
                {/* Toolbar */}
                <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="text-slate-500 hover:text-slate-900 transition-colors">
                            <ChevronLeft size={20} />
                        </Link>
                        <h1 className="font-serif font-bold text-lg text-slate-900">Resume Builder</h1>
                    </div>
                    <button onClick={loadSampleData} className="text-xs font-bold uppercase tracking-wider text-kodnest-red flex items-center gap-2 hover:bg-red-50 px-3 py-1.5 rounded-sm transition-colors">
                        <RefreshCw size={14} /> Load Sample
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {/* Score Panel - Circular */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6">
                        <div className="flex items-center gap-6">
                            {/* Circular Progress */}
                            <div className="relative w-20 h-20 flex-shrink-0">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="40" cy="40" r="36"
                                        stroke="currentColor" strokeWidth="8" fill="transparent"
                                        className="text-slate-200"
                                    />
                                    <circle
                                        cx="40" cy="40" r="36"
                                        stroke="currentColor" strokeWidth="8" fill="transparent"
                                        strokeDasharray={36 * 2 * Math.PI}
                                        strokeDashoffset={36 * 2 * Math.PI - (score / 100) * (36 * 2 * Math.PI)}
                                        className={`transition-all duration-1000 ease-out ${getScoreColor(score)}`}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center flex-col">
                                    <span className={`text-xl font-bold ${getScoreColor(score)}`}>{score}</span>
                                </div>
                            </div>

                            <div className="flex-1">
                                <h2 className={`text-lg font-bold mb-1 ${getScoreColor(score)}`}>{getScoreLabel(score)}</h2>
                                <p className="text-sm text-slate-500 mb-2">ATS Readiness Score</p>
                                {suggestions.length > 0 ? (
                                    <div className="text-xs text-slate-600 bg-white p-2 rounded border border-slate-100 shadow-sm">
                                        <div className="font-bold text-slate-700 mb-1 flex items-center gap-1">
                                            <TrendingUp size={12} /> Improve Score:
                                        </div>
                                        <ul className="space-y-1 pl-1">
                                            {suggestions.slice(0, 3).map((s, i) => (
                                                <li key={i} className="flex items-center gap-1.5">
                                                    <span className="w-1 h-1 rounded-full bg-kodnest-red flex-shrink-0"></span>
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                        <CheckCircle size={14} /> Perfect Score!
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Personal Info */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 border-b border-slate-100 pb-2">Personal Info</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <input name="name" placeholder="Full Name" value={data.personal.name} onChange={handlePersonalChange} className="p-3 border border-slate-200 rounded-sm focus:border-kodnest-red outline-none text-sm" />
                            <input name="email" placeholder="Email" value={data.personal.email} onChange={handlePersonalChange} className="p-3 border border-slate-200 rounded-sm focus:border-kodnest-red outline-none text-sm" />
                            <input name="phone" placeholder="Phone" value={data.personal.phone} onChange={handlePersonalChange} className="p-3 border border-slate-200 rounded-sm focus:border-kodnest-red outline-none text-sm" />
                            <input name="location" placeholder="Location" value={data.personal.location} onChange={handlePersonalChange} className="p-3 border border-slate-200 rounded-sm focus:border-kodnest-red outline-none text-sm" />
                            <input name="github" placeholder="GitHub" value={data.links.github} onChange={handleLinkChange} className="p-3 border border-slate-200 rounded-sm focus:border-kodnest-red outline-none text-sm" />
                            <input name="linkedin" placeholder="LinkedIn" value={data.links.linkedin} onChange={handleLinkChange} className="p-3 border border-slate-200 rounded-sm focus:border-kodnest-red outline-none text-sm" />
                        </div>
                    </section>

                    {/* Summary */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 border-b border-slate-100 pb-2">Summary</h2>
                        <textarea value={data.summary} onChange={(e) => setData({ ...data, summary: e.target.value })} placeholder="Write a brief professional summary..." className="w-full h-32 p-3 border border-slate-200 rounded-sm focus:border-kodnest-red outline-none text-sm resize-none"></textarea>
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>{data.summary.split(/\s+/).filter(w => w.length > 0).length} words</span>
                            <span>Target: 40-120 words</span>
                        </div>
                    </section>


                    {/* Advanced Projects Section */}
                    <section className="space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Projects</h2>
                            <button onClick={addProject} className="text-xs font-bold text-kodnest-red hover:underline flex items-center gap-1"><Plus size={14} /> Add Project</button>
                        </div>
                        <div className="space-y-4">
                            {data.projects.map((proj) => (
                                <ProjectAccordion
                                    key={proj.id}
                                    project={proj}
                                    onUpdate={updateProject}
                                    onDelete={deleteProject}
                                    onAddTech={addTechStack}
                                    onRemoveTech={removeTechStack}
                                    getGuidance={getBulletGuidance}
                                />
                            ))}
                        </div>
                    </section>

                    {/* Experience (Simplified view in this replaced file for focus on Projects/Skills) */}
                    <section className="space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Experience</h2>
                            <button onClick={addExperience} className="text-xs font-bold text-kodnest-red hover:underline flex items-center gap-1"><Plus size={14} /> Add Role</button>
                        </div>
                        {data.experience.map((exp, idx) => (
                            <div key={idx} className="p-4 border border-slate-100 rounded-sm space-y-3 bg-slate-50">
                                <input placeholder="Job Title" value={exp.role} onChange={(e) => updateExperience(idx, 'role', e.target.value)} className="w-full p-2 border border-slate-200 rounded-sm text-sm" />
                                <div className="grid grid-cols-2 gap-2">
                                    <input placeholder="Company" value={exp.company} onChange={(e) => updateExperience(idx, 'company', e.target.value)} className="p-2 border border-slate-200 rounded-sm text-sm" />
                                    <input placeholder="Duration" value={exp.duration} onChange={(e) => updateExperience(idx, 'duration', e.target.value)} className="p-2 border border-slate-200 rounded-sm text-sm" />
                                </div>
                                <div>
                                    <textarea placeholder="Job Description" value={exp.description} onChange={(e) => updateExperience(idx, 'description', e.target.value)} className="w-full h-24 p-2 border border-slate-200 rounded-sm text-sm resize-none mb-1"></textarea>
                                    {getBulletGuidance(exp.description) && <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded-sm border border-amber-100"><Info size={12} /> {getBulletGuidance(exp.description)}</div>}
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* Education (Simplified) */}
                    <section className="space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Education</h2>
                            <button onClick={addEducation} className="text-xs font-bold text-kodnest-red hover:underline flex items-center gap-1"><Plus size={14} /> Add School</button>
                        </div>
                        {data.education.map((edu, idx) => (
                            <div key={idx} className="p-4 border border-slate-100 rounded-sm space-y-3 bg-slate-50">
                                <input placeholder="Degree" value={edu.degree} onChange={(e) => updateEducation(idx, 'degree', e.target.value)} className="w-full p-2 border border-slate-200 rounded-sm text-sm" />
                                <div className="grid grid-cols-2 gap-2">
                                    <input placeholder="Institution" value={edu.institution} onChange={(e) => updateEducation(idx, 'institution', e.target.value)} className="p-2 border border-slate-200 rounded-sm text-sm" />
                                    <input placeholder="Year" value={edu.year} onChange={(e) => updateEducation(idx, 'year', e.target.value)} className="p-2 border border-slate-200 rounded-sm text-sm" />
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* Advanced Skills Section */}
                    <section className="space-y-6">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Skills</h2>
                            <button
                                onClick={suggestSkills}
                                disabled={isSuggestingSkills}
                                className="text-xs font-bold text-kodnest-red hover:underline flex items-center gap-1 disabled:opacity-50"
                            >
                                {isSuggestingSkills ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                                {isSuggestingSkills ? 'Adding...' : 'Suggest Skills'}
                            </button>
                        </div>

                        <SkillCategory
                            title="Technical Skills"
                            skills={data.skills.technical || []}
                            onAdd={(s) => addSkill('technical', s)}
                            onRemove={(s) => removeSkill('technical', s)}
                        />
                        <SkillCategory
                            title="Soft Skills"
                            skills={data.skills.soft || []}
                            onAdd={(s) => addSkill('soft', s)}
                            onRemove={(s) => removeSkill('soft', s)}
                        />
                        <SkillCategory
                            title="Tools & Technologies"
                            skills={data.skills.tools || []}
                            onAdd={(s) => addSkill('tools', s)}
                            onRemove={(s) => removeSkill('tools', s)}
                        />
                    </section>
                </div>
            </div>

            {/* Right Panel - Live Preview */}
            <div className="w-1/2 bg-slate-100 flex flex-col h-full">
                <div className="h-auto border-b border-slate-200 bg-white flex flex-col p-4 flex-shrink-0 z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Preview</span>
                            <div className="flex gap-2">
                                <Link to="/preview" className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-sm flex items-center gap-1 hover:bg-slate-800 transition-colors">
                                    <ExternalLink size={12} /> Finalize & Export
                                </Link>
                                <button onClick={() => showToast("PDF export ready! Check your downloads.")} className="border border-slate-200 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-sm flex items-center gap-1 hover:bg-slate-50 transition-colors">
                                    <Download size={12} /> PDF
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Template Selectors */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        {['classic', 'modern', 'minimal'].map(t => (
                            <button
                                key={t}
                                onClick={() => setTemplate(t)}
                                className={`flex flex-col items-center gap-2 p-2 rounded-sm border-2 transition-all ${data.template === t ? 'border-kodnest-red bg-red-50/50' : 'border-slate-100 hover:border-slate-300'
                                    }`}
                            >
                                <div className={`w-full h-16 bg-slate-100 rounded-sm overflow-hidden relative shadow-sm ${data.template === t ? 'ring-1 ring-kodnest-red' : ''
                                    }`}>
                                    {/* Visual Representation of Templates */}
                                    {t === 'classic' && (
                                        <div className="w-full h-full p-2 flex flex-col items-center">
                                            <div className="w-3/4 h-2 bg-slate-300 mb-1 rounded-[1px]"></div>
                                            <div className="w-1/2 h-1 bg-slate-200 mb-2 rounded-[1px]"></div>
                                            <div className="w-full h-[1px] bg-slate-200 mb-2"></div>
                                            <div className="w-full space-y-1">
                                                <div className="w-full h-1 bg-slate-200"></div>
                                                <div className="w-full h-1 bg-slate-200"></div>
                                            </div>
                                        </div>
                                    )}
                                    {t === 'modern' && (
                                        <div className="w-full h-full flex">
                                            <div className="w-[30%] h-full bg-slate-300"></div>
                                            <div className="w-[70%] h-full p-1 space-y-1">
                                                <div className="w-3/4 h-2 bg-slate-200 mb-1"></div>
                                                <div className="w-full h-1 bg-slate-100"></div>
                                                <div className="w-full h-1 bg-slate-100"></div>
                                            </div>
                                        </div>
                                    )}
                                    {t === 'minimal' && (
                                        <div className="w-full h-full p-2 flex flex-col items-start pt-1">
                                            <div className="w-1/2 h-2 bg-slate-300 mb-3 rounded-[1px]"></div>
                                            <div className="w-full space-y-1">
                                                <div className="w-full h-[1px] bg-slate-200"></div>
                                                <div className="w-3/4 h-1 bg-slate-100"></div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Active Checkmark */}
                                    {data.template === t && (
                                        <div className="absolute top-1 right-1 bg-kodnest-red text-white p-0.5 rounded-full shadow-sm">
                                            <CheckCircle size={8} />
                                        </div>
                                    )}
                                </div>
                                <span className="text-[10px] font-bold uppercase text-slate-500">{t}</span>
                            </button>
                        ))}
                    </div>

                    {/* Color Theme Picker */}
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase text-slate-400">Theme:</span>
                        <div className="flex gap-2">
                            {[
                                { name: 'Teal', value: '#0f766e' },
                                { name: 'Navy', value: '#1e3a8a' },
                                { name: 'Burgundy', value: '#881337' },
                                { name: 'Forest', value: '#14532d' },
                                { name: 'Charcoal', value: '#1f2937' }
                            ].map((c) => (
                                <button
                                    key={c.name}
                                    onClick={() => setData({ ...data, themeColor: c.value })}
                                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${data.themeColor === c.value ? 'border-slate-900 ring-1 ring-white' : 'border-white ring-1 ring-slate-200'
                                        }`}
                                    style={{ backgroundColor: c.value }}
                                    title={c.name}
                                ></button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-slate-100">
                    <div className="origin-top scale-[0.65] sm:scale-[0.75] md:scale-[0.85] lg:scale-100 transition-transform shadow-2xl print:shadow-none">
                        <ResumePreview data={data} template={data.template || 'classic'} themeColor={data.themeColor || '#0f766e'} />
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- SUB COMPONENTS ---

const SkillCategory = ({ title, skills, onAdd, onRemove }) => {
    const [input, setInput] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onAdd(input);
            setInput('');
        }
    };

    return (
        <div className="bg-slate-50 p-4 border border-slate-100 rounded-sm">
            <div className="flex justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase">{title}</span>
                <span className="text-xs text-slate-400">({skills.length})</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
                {skills.map((skill, idx) => (
                    <span key={idx} className="bg-white px-2 py-1 border border-slate-200 rounded-full text-xs text-slate-700 flex items-center gap-1 shadow-sm">
                        {skill}
                        <button onClick={() => onRemove(skill)} className="hover:text-red-500"><X size={10} /></button>
                    </span>
                ))}
            </div>
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type skill & press Enter..."
                className="w-full bg-white border border-slate-200 rounded-sm px-3 py-2 text-sm focus:border-kodnest-red outline-none"
            />
        </div>
    );
};

const ProjectAccordion = ({ project, onUpdate, onDelete, onAddTech, onRemoveTech, getGuidance }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [techInput, setTechInput] = useState('');

    const handleTechKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onAddTech(project.id, techInput);
            setTechInput('');
        }
    };

    return (
        <div className="border border-slate-200 rounded-sm bg-white overflow-hidden shadow-sm">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between p-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                        <ChevronDown size={16} className="text-slate-400" />
                    </div>
                    <span className="text-sm font-bold text-slate-800">{project.title || "New Project"}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); onDelete(project.id); }} className="text-slate-400 hover:text-red-500">
                    <Trash2 size={16} />
                </button>
            </div>

            {isOpen && (
                <div className="p-4 space-y-4 border-t border-slate-100">
                    <input
                        placeholder="Project Title"
                        value={project.title}
                        onChange={(e) => onUpdate(project.id, 'title', e.target.value)}
                        className="w-full p-2 border border-slate-200 rounded-sm text-sm focus:border-kodnest-red outline-none"
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                            <Globe size={14} className="absolute left-3 top-3 text-slate-400" />
                            <input
                                placeholder="Live URL (Optional)"
                                value={project.liveUrl}
                                onChange={(e) => onUpdate(project.id, 'liveUrl', e.target.value)}
                                className="w-full pl-9 p-2 border border-slate-200 rounded-sm text-sm focus:border-kodnest-red outline-none"
                            />
                        </div>
                        <div className="relative">
                            <Github size={14} className="absolute left-3 top-3 text-slate-400" />
                            <input
                                placeholder="GitHub URL (Optional)"
                                value={project.githubUrl}
                                onChange={(e) => onUpdate(project.id, 'githubUrl', e.target.value)}
                                className="w-full pl-9 p-2 border border-slate-200 rounded-sm text-sm focus:border-kodnest-red outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {project.techStack.map((tech, idx) => (
                                <span key={idx} className="bg-slate-100 px-2 py-0.5 rounded-sm text-xs text-slate-600 flex items-center gap-1 border border-slate-200">
                                    {tech}
                                    <button onClick={() => onRemoveTech(project.id, tech)} className="hover:text-red-500"><X size={10} /></button>
                                </span>
                            ))}
                        </div>
                        <input
                            value={techInput}
                            onChange={(e) => setTechInput(e.target.value)}
                            onKeyDown={handleTechKeyDown}
                            placeholder="Add Tech Stack (e.g. React) + Enter"
                            className="w-full p-2 border border-slate-200 rounded-sm text-sm focus:border-kodnest-red outline-none"
                        />
                    </div>

                    <div>
                        <textarea
                            placeholder="Project Description"
                            value={project.description}
                            onChange={(e) => onUpdate(project.id, 'description', e.target.value.slice(0, 200))}
                            className="w-full h-24 p-2 border border-slate-200 rounded-sm text-sm resize-none focus:border-kodnest-red outline-none"
                        ></textarea>
                        <div className="flex justify-between mt-1">
                            <span className="text-xs text-slate-400">{project.description.length}/200 characters</span>
                            {getGuidance(project.description) && (
                                <span className="text-xs text-amber-600 flex items-center gap-1"><Info size={10} /> {getGuidance(project.description)}</span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
