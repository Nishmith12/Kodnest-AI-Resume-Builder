import React, { useState } from 'react';
import { Layout, Save, Download, RefreshCw, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ResumePreview from '../components/ResumePreview';

const INITIAL_DATA = {
    personal: { name: '', email: '', phone: '', location: '' },
    summary: '',
    education: [],
    experience: [],
    projects: [],
    skills: [],
    links: { github: '', linkedin: '' }
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
    links: { github: 'github.com/alexrivera', linkedin: 'linkedin.com/in/alexrivera' }
};

export default function Builder() {
    const [data, setData] = useState(INITIAL_DATA);
    const [activeTab, setActiveTab] = useState('personal');

    const loadSampleData = () => {
        setData(SAMPLE_DATA);
    };

    const handlePersonalChange = (e) => {
        setData({ ...data, personal: { ...data.personal, [e.target.name]: e.target.value } });
    };

    const handleLinkChange = (e) => {
        setData({ ...data, links: { ...data.links, [e.target.name]: e.target.value } });
    };

    const addEducation = () => {
        setData({ ...data, education: [...data.education, { degree: '', institution: '', year: '' }] });
    };

    const updateEducation = (idx, field, value) => {
        const newEdu = [...data.education];
        newEdu[idx][field] = value;
        setData({ ...data, education: newEdu });
    };

    const addExperience = () => {
        setData({ ...data, experience: [...data.experience, { role: '', company: '', duration: '', description: '' }] });
    };

    const updateExperience = (idx, field, value) => {
        const newExp = [...data.experience];
        newExp[idx][field] = value;
        setData({ ...data, experience: newExp });
    };

    const addProject = () => {
        setData({ ...data, projects: [...data.projects, { name: '', description: '', link: '' }] });
    };

    const updateProject = (idx, field, value) => {
        const newProj = [...data.projects];
        newProj[idx][field] = value;
        setData({ ...data, projects: newProj });
    };


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
                                <textarea placeholder="Job Description (Bullet points recommended)" value={exp.description} onChange={(e) => updateExperience(idx, 'description', e.target.value)} className="w-full h-24 p-2 border border-slate-200 rounded-sm text-sm resize-none"></textarea>
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
                    </section>
                </div>
            </div>

            {/* Right Panel - Live Preview (50%) */}
            <div className="w-1/2 bg-slate-100 flex flex-col h-full">
                <div className="h-16 border-b border-slate-200 flex items-center justify-end px-6 bg-white flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Preview</span>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-8 flex justify-center">
                    <div className="origin-top scale-[0.8] md:scale-[0.9] lg:scale-100 transition-transform">
                        <ResumePreview data={data} />
                    </div>
                </div>
            </div>
        </div>
    );
}
