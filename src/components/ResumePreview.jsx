import React from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, ExternalLink } from 'lucide-react';

export default function ResumePreview({ data }) {
    const { personal, summary, experience, education, projects, skills, links } = data;

    return (
        <div className="bg-white text-slate-900 font-sans p-10 max-w-[210mm] mx-auto min-h-[297mm] shadow-sm">
            {/* Header */}
            <header className="border-b-2 border-slate-900 pb-6 mb-8">
                <h1 className="text-4xl font-serif font-bold tracking-tight text-slate-900 uppercase mb-2">
                    {personal.name || "Your Name"}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm text-slate-600 font-medium tracking-wide">
                    {personal.email && (
                        <div className="flex items-center gap-1">
                            <Mail size={14} /> {personal.email}
                        </div>
                    )}
                    {personal.phone && (
                        <div className="flex items-center gap-1">
                            <Phone size={14} /> {personal.phone}
                        </div>
                    )}
                    {personal.location && (
                        <div className="flex items-center gap-1">
                            <MapPin size={14} /> {personal.location}
                        </div>
                    )}
                    {links.github && (
                        <div className="flex items-center gap-1">
                            <Github size={14} /> {links.github}
                        </div>
                    )}
                    {links.linkedin && (
                        <div className="flex items-center gap-1">
                            <Linkedin size={14} /> {links.linkedin}
                        </div>
                    )}
                </div>
            </header>

            {/* Summary */}
            {summary && (
                <section className="mb-8">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-3 border-b border-slate-200 pb-1">
                        Professional Summary
                    </h2>
                    <p className="text-slate-800 leading-relaxed text-sm">
                        {summary}
                    </p>
                </section>
            )}

            {/* Experience */}
            {experience.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 border-b border-slate-200 pb-1">
                        Experience
                    </h2>
                    <div className="space-y-6">
                        {experience.map((exp, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-slate-900 text-lg">{exp.role}</h3>
                                    <span className="text-xs font-mono text-slate-500">{exp.duration}</span>
                                </div>
                                <div className="text-sm font-medium text-slate-700 mb-2">{exp.company}</div>
                                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                                    {exp.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {projects.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 border-b border-slate-200 pb-1">
                        Projects
                    </h2>
                    <div className="space-y-5">
                        {projects.map((proj, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-slate-900">{proj.name}</h3>
                                    {proj.link && (
                                        <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-kodnest-red flex items-center gap-1 hover:underline">
                                            View Project <ExternalLink size={10} />
                                        </a>
                                    )}
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {proj.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {education.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 border-b border-slate-200 pb-1">
                        Education
                    </h2>
                    <div className="space-y-4">
                        {education.map((edu, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-slate-900">{edu.degree}</h3>
                                    <span className="text-xs font-mono text-slate-500">{edu.year}</span>
                                </div>
                                <div className="text-sm text-slate-700">{edu.institution}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <section>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-3 border-b border-slate-200 pb-1">
                        Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill, idx) => (
                            <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-1 rounded-sm text-xs font-medium border border-slate-200">
                                {skill.trim()}
                            </span>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
