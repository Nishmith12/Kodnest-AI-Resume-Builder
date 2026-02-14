import React, { useState, useEffect } from 'react';
import { Layout, Save, Download, RefreshCw, ChevronLeft, AlertCircle, CheckCircle, TrendingUp, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import ResumePreview from '../components/ResumePreview';

const INITIAL_DATA = {
    personal: { name: '', email: '', phone: '', location: '' },
    summary: '',
    education: [],
    experience: [],
    projects: [],
    skills: [],
    links: { github: '', linkedin: '' },
    template: 'classic' // classic, modern, minimal
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
        { name: 'E-Commerce Platform', description: 'A full-stack e-commerce solution built with Next.js, Stripe, and PostgreSQL.', link: 'https://github.com/alex/ecommerce' },
        { name: 'Task Master AI', description: 'Productivity app utilizing OpenAI API to auto-categorize tasks.', link: 'https://github.com/alex/task-ai' }
    ],
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL'],
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

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('resumeBuilderData');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setData(parsed);
                calculateScore(parsed); // Calculate score immediately on load
            } catch (e) {
                console.error("Failed to load resume data", e);
            }
        }
    }, []);

    // Autosave when data changes
    useEffect(() => {
        localStorage.setItem('resumeBuilderData', JSON.stringify(data));
        calculateScore(data);
    }, [data]);

    const calculateScore = (resumeData) => {
        let newScore = 0;
        const newSuggestions = [];

        // 1. Summary Length (40-120 words) (+15)
        const summaryText = resumeData.summary || "";
        const summaryWords = summaryText.trim().length > 0 ? summaryText.trim().split(/\s+/).length : 0;

        if (summaryWords >= 40 && summaryWords <= 120) {
            newScore += 15;
        } else {
            if (summaryWords < 40) newSuggestions.push("Expand summary (target 40–120 words).");
            else newSuggestions.push("Shorten summary (target 40–120 words).");
        }

        // 2. Projects (At least 2) (+10)
        if (resumeData.projects && resumeData.projects.length >= 2) {
            newScore += 10;
        } else {
            newSuggestions.push("Add at least 2 projects.");
        }

        // 3. Experience (At least 1) (+10)
        if (resumeData.experience && resumeData.experience.length >= 1) {
            newScore += 10;
        } else {
            newSuggestions.push("Add at least 1 work experience/internship.");
        }

        // 4. Skills (>= 8 items) (+10)
        if (resumeData.skills && resumeData.skills.length >= 8) {
            newScore += 10;
        } else {
            newSuggestions.push("Add more skills (target 8+).");
        }

        // 5. Links (GitHub or LinkedIn exists) (+10)
        if (resumeData.links && (resumeData.links.github || resumeData.links.linkedin)) {
            newScore += 10;
        } else {
            newSuggestions.push("Add GitHub or LinkedIn links.");
        }

        // 6. Measurable Impact (Numbers in bullets) (+15)
        // Check experience and projects for numbers
        const allItems = [...(resumeData.experience || []), ...(resumeData.projects || [])];
        const hasNumbers = allItems.some(item =>
            /\d(%|k|\+|X)|(\$|€|£)\d/.test(item.description || "") || /\d+/.test(item.description || "")
        );
        if (!hasNumbers) {
            newSuggestions.push("Add measurable impact (numbers) in bullets.");
        } else {
            newScore += 15;
        }

        // 7. Complete Education (+10)
        const hasEducation = resumeData.education && resumeData.education.length > 0 && resumeData.education.every(e => e.degree && e.institution && e.year);
        if (hasEducation) {
            newScore += 10;
        }

        // Cap at 100
        setScore(Math.min(100, newScore));
        setSuggestions(newSuggestions.slice(0, 3)); // Top 3 priority
    };

    const getBulletGuidance = (text) => {
        if (!text) return null;
        const lines = text.split('\n');
        const issues = [];

        lines.forEach((line, i) => {
            if (!line.trim()) return;
            const firstWord = line.trim().split(' ')[0];
            // Check for action verbs (simple check)
            const startsWithVerb = ACTION_VERBS.some(v => firstWord.toLowerCase().startsWith(v.toLowerCase()));

            if (!startsWithVerb) {
                issues.push("Start bullets with strong action verbs (e.g. Built, Led).");
            }

            // Check for numbers
            const hasNumber = /\d/.test(line);
            if (!hasNumber) {
                issues.push("Add measurable impact (numbers).");
            }
        });

        if (issues.length === 0) return null;
        // return unique issues
        return [...new Set(issues)][0]; // Show one main tip at a time
    };

    const loadSampleData = () => {
        setData(SAMPLE_DATA);
    };

    const setTemplate = (tpl) => {
        setData({ ...data, template: tpl });
    };

    // ... Update handlers same as before ...
    const handlePersonalChange = (e) => setData({ ...data, personal: { ...data.personal, [e.target.name]: e.target.value } });
    const handleLinkChange = (e) => setData({ ...data, links: { ...data.links, [e.target.name]: e.target.value } });

    const updateEducation = (idx, field, value) => {
        const newEdu = [...data.education];
        newEdu[idx][field] = value;
        setData({ ...data, education: newEdu });
    };
    const addEducation = () => setData({ ...data, education: [...data.education, { degree: '', institution: '', year: '' }] });

    const updateExperience = (idx, field, value) => {
        const newExp = [...data.experience];
        newExp[idx][field] = value;
        setData({ ...data, experience: newExp });
    };
    const addExperience = () => setData({ ...data, experience: [...data.experience, { role: '', company: '', duration: '', description: '' }] });

    const updateProject = (idx, field, value) => {
        const newProj = [...data.projects];
        newProj[idx][field] = value;
        setData({ ...data, projects: newProj });
    };
    const addProject = () => setData({ ...data, projects: [...data.projects, { name: '', description: '', link: '' }] });


    return (
        <div className="flex h-screen bg-kodnest-off-white overflow-hidden">
            {/* Left Panel - Form Editor (50%) */}
            <div className="w-1/2 flex flex-col border-r border-slate-200 bg-white">
                {/* Toolbar */}
                <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="text-slate-500 hover:text-slate-900 transition-colors">
                            <ChevronLeft size={20} />
                        </Link>
                        <h1 className="font-serif font-bold text-lg text-slate-900">Resume Builder</h1>
                    </div>
                    <button
                        onClick={loadSampleData}
                        className="text-xs font-bold uppercase tracking-wider text-kodnest-red flex items-center gap-2 hover:bg-red-50 px-3 py-1.5 rounded-sm transition-colors"
                    >
                        <RefreshCw size={14} /> Load Sample
                    </button>
                </div>

                {/* Scrollable Form Area */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">

                    {/* ATS Score Panel */}
                    <div className="bg-slate-50 border border-slate-200 rounded-sm p-4 mb-6 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-2 relative z-10">
                            <div className="flex items-center gap-2">
                                <TrendingUp size={18} className="text-kodnest-red" />
                                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">ATS Readiness Score</h2>
                            </div>
                            <span className={`text-3xl font-bold font-serif ${score >= 80 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                                {score}
                            </span>
                        </div>

                        {/* Score Bar */}
                        <div className="w-full bg-slate-200 h-2 rounded-full mb-4 relative z-10">
                            <div
                                className={`h-2 rounded-full transition-all duration-1000 ${score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                                style={{ width: `${score}%` }}
                            ></div>
                        </div>

                        {/* Top 3 Improvements */}
                        {suggestions.length > 0 ? (
                            <div className="space-y-3 pt-2 relative z-10">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Improvements</h3>
                                {suggestions.map((suggestion, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-white p-2 border border-slate-100 rounded-sm shadow-sm">
                                        <AlertCircle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                                        <span className="font-medium">{suggestion}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium pt-2 relative z-10">
                                <CheckCircle size={16} /> All systems go! Your resume is optimized.
                            </div>
                        )}
                    </div>

                    <section className="space-y-4">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 border-b border-slate-100 pb-2">Personal Info</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <input name="name" placeholder="Full Name" value={data.personal.name} onChange={handlePersonalChange} className="p-3 border border-slate-200 rounded-sm focus:border-kodnest-red outline-none text-sm" />
                            <input name="email" placeholder="Email" value={data.personal.email} onChange={handlePersonalChange} className="p-3 border border-slate-200 rounded-sm focus:border-kodnest-red outline-none text-sm" />
                            <input name="phone" placeholder="Phone" value={data.personal.phone} onChange={handlePersonalChange} className="p-3 border border-slate-200 rounded-sm focus:border-kodnest-red outline-none text-sm" />
                            <input name="location" placeholder="Location" value={data.personal.location} onChange={handlePersonalChange} className="p-3 border border-slate-200 rounded-sm focus:border-kodnest-red outline-none text-sm" />
                            <input name="github" placeholder="GitHub (e.g. github.com/user)" value={data.links.github} onChange={handleLinkChange} className="p-3 border border-slate-200 rounded-sm focus:border-kodnest-red outline-none text-sm" />
                            <input name="linkedin" placeholder="LinkedIn (e.g. linkedin.com/in/user)" value={data.links.linkedin} onChange={handleLinkChange} className="p-3 border border-slate-200 rounded-sm focus:border-kodnest-red outline-none text-sm" />
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 border-b border-slate-100 pb-2">Summary</h2>
                        <textarea
                            value={data.summary}
                            onChange={(e) => setData({ ...data, summary: e.target.value })}
                            placeholder="Write a brief professional summary..."
                            className="w-full h-32 p-3 border border-slate-200 rounded-sm focus:border-kodnest-red outline-none text-sm resize-none"
                        ></textarea>
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>{data.summary.split(/\s+/).filter(w => w.length > 0).length} words</span>
                            <span>Target: 40-120 words</span>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Experience</h2>
                            <button onClick={addExperience} className="text-xs font-bold text-kodnest-red hover:underline">+ Add Role</button>
                        </div>
                        {data.experience.map((exp, idx) => (
                            <div key={idx} className="p-4 border border-slate-100 rounded-sm space-y-3 bg-slate-50">
                                <input placeholder="Job Title" value={exp.role} onChange={(e) => updateExperience(idx, 'role', e.target.value)} className="w-full p-2 border border-slate-200 rounded-sm text-sm" />
                                <div className="grid grid-cols-2 gap-2">
                                    <input placeholder="Company" value={exp.company} onChange={(e) => updateExperience(idx, 'company', e.target.value)} className="p-2 border border-slate-200 rounded-sm text-sm" />
                                    <input placeholder="Duration (e.g. 2022 - Present)" value={exp.duration} onChange={(e) => updateExperience(idx, 'duration', e.target.value)} className="p-2 border border-slate-200 rounded-sm text-sm" />
                                </div>
                                <div>
                                    <textarea placeholder="Job Description (Bullet points recommended)" value={exp.description} onChange={(e) => updateExperience(idx, 'description', e.target.value)} className="w-full h-24 p-2 border border-slate-200 rounded-sm text-sm resize-none mb-1"></textarea>
                                    {getBulletGuidance(exp.description) && (
                                        <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded-sm border border-amber-100">
                                            <Info size={12} /> {getBulletGuidance(exp.description)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </section>

                    <section className="space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Projects</h2>
                            <button onClick={addProject} className="text-xs font-bold text-kodnest-red hover:underline">+ Add Project</button>
                        </div>
                        {data.projects.map((proj, idx) => (
                            <div key={idx} className="p-4 border border-slate-100 rounded-sm space-y-3 bg-slate-50">
                                <input placeholder="Project Name" value={proj.name} onChange={(e) => updateProject(idx, 'name', e.target.value)} className="w-full p-2 border border-slate-200 rounded-sm text-sm" />
                                <input placeholder="Project Link" value={proj.link} onChange={(e) => updateProject(idx, 'link', e.target.value)} className="w-full p-2 border border-slate-200 rounded-sm text-sm" />
                                <div>
                                    <textarea placeholder="Project Description" value={proj.description} onChange={(e) => updateProject(idx, 'description', e.target.value)} className="w-full h-24 p-2 border border-slate-200 rounded-sm text-sm resize-none mb-1"></textarea>
                                    {getBulletGuidance(proj.description) && (
                                        <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded-sm border border-amber-100">
                                            <Info size={12} /> {getBulletGuidance(proj.description)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </section>

                    <section className="space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Education</h2>
                            <button onClick={addEducation} className="text-xs font-bold text-kodnest-red hover:underline">+ Add School</button>
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

                    <section className="space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Skills</h2>
                        </div>
                        <textarea
                            value={data.skills.join(', ')}
                            onChange={(e) => setData({ ...data, skills: e.target.value.split(',') })}
                            placeholder="Comma separated skills (e.g. React, Node.js, Design)"
                            className="w-full h-20 p-3 border border-slate-200 rounded-sm focus:border-kodnest-red outline-none text-sm resize-none"
                        ></textarea>
                        <p className="text-xs text-slate-400 text-right">{data.skills.filter(s => s.trim().length > 0).length} skills</p>
                    </section>
                </div>
            </div>

            {/* Right Panel - Live Preview (50%) */}
            <div className="w-1/2 bg-slate-100 flex flex-col h-full">
                <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Preview</span>
                    </div>
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
                </div>
                <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-slate-100">
                    <div className="origin-top scale-[0.65] sm:scale-[0.75] md:scale-[0.85] lg:scale-100 transition-transform">
                        <ResumePreview data={data} template={data.template || 'classic'} />
                    </div>
                </div>
            </div>
        </div>
    );
}
