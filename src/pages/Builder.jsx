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
    template: 'classic'
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

        // 1. Summary Length (+15)
        const summaryText = resumeData.summary || "";
        const summaryWords = summaryText.trim().length > 0 ? summaryText.trim().split(/\s+/).length : 0;
        if (summaryWords >= 40 && summaryWords <= 120) newScore += 15;
        else if (summaryWords < 40) newSuggestions.push("Expand summary (target 40–120 words).");
        else newSuggestions.push("Shorten summary (target 40–120 words).");

        // 2. Projects (+10)
        if (resumeData.projects && resumeData.projects.length >= 2) newScore += 10;
        else newSuggestions.push("Add at least 2 projects.");

        // 3. Experience (+10)
        if (resumeData.experience && resumeData.experience.length >= 1) newScore += 10;
        else newSuggestions.push("Add at least 1 work experience.");

        // 4. Skills (+10) - Count all categories
        const totalSkills = (resumeData.skills.technical?.length || 0) +
            (resumeData.skills.soft?.length || 0) +
            (resumeData.skills.tools?.length || 0);
        if (totalSkills >= 8) newScore += 10;
        else newSuggestions.push("Add more skills (target 8+ total).");

        // 5. Links (+10)
        if (resumeData.links && (resumeData.links.github || resumeData.links.linkedin)) newScore += 10;
        else newSuggestions.push("Add GitHub or LinkedIn links.");

        // 6. Impact (+15)
        const allItems = [...(resumeData.experience || []), ...(resumeData.projects || [])];
        const hasNumbers = allItems.some(item =>
            /\d(%|k|\+|X)|(\$|€|£)\d/.test(item.description || "") || /\d+/.test(item.description || "")
        );
        if (hasNumbers) newScore += 15;
        else newSuggestions.push("Add measurable impact (numbers) in bullets.");

        // 7. Education (+10)
        if (resumeData.education?.length > 0 && resumeData.education.every(e => e.degree && e.institution && e.year)) newScore += 10;

        setScore(Math.min(100, newScore));
        setSuggestions(newSuggestions.slice(0, 3));
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


    return (
        <div className="flex h-screen bg-kodnest-off-white overflow-hidden">
            {/* Left Panel - Form Editor */}
            <div className="w-1/2 flex flex-col border-r border-slate-200 bg-white">
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
                    {/* Score Panel */}
                    <div className="bg-slate-50 border border-slate-200 rounded-sm p-4 mb-6 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <TrendingUp size={18} className="text-kodnest-red" />
                                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">ATS Readiness Score</h2>
                            </div>
                            <span className={`text-3xl font-bold font-serif ${score >= 80 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{score}</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full mb-4">
                            <div className={`h-2 rounded-full transition-all duration-1000 ${score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${score}%` }}></div>
                        </div>
                        {suggestions.length > 0 ? (
                            <div className="space-y-3 pt-2">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Improvements</h3>
                                {suggestions.map((s, i) => (
                                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-white p-2 border border-slate-100 rounded-sm shadow-sm">
                                        <AlertCircle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                                        <span className="font-medium">{s}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium pt-2"><CheckCircle size={16} /> All systems go!</div>
                        )}
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
                <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Preview</span>
                        <Link to="/preview" className="ml-2 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-sm flex items-center gap-1 hover:bg-slate-800 transition-colors">
                            <ExternalLink size={12} /> Finalize & Export
                        </Link>
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-sm gap-1">
                        {['classic', 'modern', 'minimal'].map(t => (
                            <button key={t} onClick={() => setTemplate(t)} className={`text-xs font-bold uppercase px-3 py-1.5 rounded-sm transition-all ${data.template === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
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
