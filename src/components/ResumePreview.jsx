import React from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, ExternalLink } from 'lucide-react';

export default function ResumePreview({ data, template = 'classic' }) {
    if (!data) return null;
    const { personal, summary, experience, education, projects, skills, links } = data;

    // Classic: Serif headings, centered header, traditional look (default)
    const isClassic = template === 'classic';
    // Modern: Sans-serif headings, left-aligned, clean lines
    const isModern = template === 'modern';
    // Minimal: Airy, smaller type, no lines, very simple
    const isMinimal = template === 'minimal';

    // Added print:shadow-none print:p-0 etc. handled by global CSS, but keeping semantic classes here
    const containerClass = `bg-white text-slate-900 font-sans p-10 max-w-[210mm] mx-auto min-h-[297mm] shadow-sm ${isClassic ? 'font-serif' : 'font-sans'
        }`;

    const headerClass = `mb-8 ${isClassic ? 'text-center border-b-2 border-slate-900 pb-6' :
        isModern ? 'text-left border-b border-slate-300 pb-6' :
            'text-left pb-4' // Minimal
        }`;

    const nameClass = `font-bold text-slate-900 mb-2 uppercase tracking-tight ${isClassic ? 'text-4xl' :
        isModern ? 'text-5xl tracking-tighter' :
            'text-3xl font-normal tracking-wide' // Minimal
        }`;

    const contactContainerClass = `flex flex-wrap gap-4 text-sm text-slate-600 font-medium tracking-wide ${isClassic ? 'justify-center' : 'justify-start'
        }`;

    const sectionTitleClass = `text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 ${isClassic ? 'border-b border-slate-200 pb-1 text-center' :
        isModern ? 'text-kodnest-red border-l-4 border-kodnest-red pl-3' :
            'text-slate-400 mb-2' // Minimal
        }`;

    return (
        <div className={containerClass} id="resume-preview-node">
            {/* Header */}
            <header className={headerClass}>
                <h1 className={nameClass}>
                    {personal?.name || "Your Name"}
                </h1>
                <div className={contactContainerClass}>
                    {personal?.email && (
                        <div className="flex items-center gap-1">
                            <Mail size={14} /> {personal.email}
                        </div>
                    )}
                    {personal?.phone && (
                        <div className="flex items-center gap-1">
                            <Phone size={14} /> {personal.phone}
                        </div>
                    )}
                    {personal?.location && (
                        <div className="flex items-center gap-1">
                            <MapPin size={14} /> {personal.location}
                        </div>
                    )}
                    {links?.github && (
                        <div className="flex items-center gap-1">
                            <Github size={14} /> {links.github}
                        </div>
                    )}
                    {links?.linkedin && (
                        <div className="flex items-center gap-1">
                            <Linkedin size={14} /> {links.linkedin}
                        </div>
                    )}
                </div>
            </header>

            {/* Summary */}
            {summary && (
                <section className="mb-8 break-inside-avoid">
                    <h2 className={sectionTitleClass}>
                        Professional Summary
                    </h2>
                    <p className="text-slate-800 leading-relaxed text-sm text-justify">
                        {summary}
                    </p>
                </section>
            )}

            {/* Experience */}
            {experience && experience.length > 0 && (
                <section className="mb-8">
                    <h2 className={sectionTitleClass}>
                        Experience
                    </h2>
                    <div className="space-y-6">
                        {experience.map((exp, idx) => (
                            <div key={idx} className={`break-inside-avoid ${isMinimal ? "mb-6" : ""}`}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className={`font-bold text-slate-900 ${isModern ? 'text-lg' : 'text-base'}`}>{exp.role}</h3>
                                    <span className="text-xs font-mono text-slate-500">{exp.duration}</span>
                                </div>
                                <div className="text-sm font-medium text-slate-700 mb-2">{exp.company}</div>
                                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line text-justify">
                                    {exp.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {projects && projects.length > 0 && (
                <section className="mb-8 p-1"> {/* Added padding to avoid clipping */}
                    <h2 className={sectionTitleClass}>Projects</h2>
                    <div className="space-y-6">
                        {projects.map((proj, idx) => (
                            <div key={idx} className={`break-inside-avoid ${isMinimal ? "mb-6" : ""}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className={`font-bold text-slate-900 ${isModern ? 'text-lg' : 'text-base'}`}>
                                            {proj.title || proj.name}
                                        </h3>
                                        {/* Tech Stack Pills for Modern/Classic */}
                                        {proj.techStack && proj.techStack.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {proj.techStack.map((tech, tIdx) => (
                                                    <span key={tIdx} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-sm border border-slate-200">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col items-end gap-1">
                                        {proj.liveUrl && (
                                            <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-kodnest-red flex items-center gap-1 hover:underline font-medium">
                                                Live Demo <ExternalLink size={10} />
                                            </a>
                                        )}
                                        {proj.githubUrl && (
                                            <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 flex items-center gap-1 hover:text-slate-900 transition-colors">
                                                GitHub <Github size={10} />
                                            </a>
                                        )}
                                        {/* Backward compat for old 'link' field */}
                                        {!proj.liveUrl && !proj.githubUrl && proj.link && (
                                            <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-kodnest-red flex items-center gap-1 hover:underline">
                                                Link <ExternalLink size={10} />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <p className="text-sm text-slate-600 leading-relaxed text-justify whitespace-pre-line">
                                    {proj.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {education && education.length > 0 && (
                <section className="mb-8 break-inside-avoid">
                    <h2 className={sectionTitleClass}>Education</h2>
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
            {skills && (
                <section className="break-inside-avoid">
                    <h2 className={sectionTitleClass}>Skills</h2>

                    {/* Handle New Categorized Structure */}
                    {typeof skills === 'object' && !Array.isArray(skills) ? (
                        <div className="grid grid-cols-1 gap-4">
                            {/* Technical */}
                            {skills.technical && skills.technical.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Technical</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.technical.map((skill, idx) => (
                                            <span key={idx} className={`text-sm ${isModern ? 'bg-slate-100 px-2 py-1 rounded-sm text-slate-700 font-medium' :
                                                    isMinimal ? 'text-slate-600 border-r border-slate-300 pr-2 last:border-0' :
                                                        'bg-white border border-slate-200 px-2 py-1 rounded-sm text-slate-700'
                                                }`}>
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {/* Tools */}
                            {skills.tools && skills.tools.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tools & Technologies</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.tools.map((skill, idx) => (
                                            <span key={idx} className={`text-sm ${isModern ? 'bg-slate-100 px-2 py-1 rounded-sm text-slate-700 font-medium' :
                                                    isMinimal ? 'text-slate-600 border-r border-slate-300 pr-2 last:border-0' :
                                                        'bg-white border border-slate-200 px-2 py-1 rounded-sm text-slate-700'
                                                }`}>
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {/* Soft Skills */}
                            {skills.soft && skills.soft.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Soft Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.soft.map((skill, idx) => (
                                            <span key={idx} className={`text-sm ${isModern ? 'bg-slate-100 px-2 py-1 rounded-sm text-slate-700 font-medium' :
                                                    isMinimal ? 'text-slate-600 border-r border-slate-300 pr-2 last:border-0' :
                                                        'bg-white border border-slate-200 px-2 py-1 rounded-sm text-slate-700'
                                                }`}>
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Fallback for Array structure */
                        <div className="flex flex-wrap gap-2">
                            {Array.isArray(skills) && skills.map((skill, idx) => (
                                <span key={idx} className={`text-sm ${isModern ? 'bg-slate-100 px-2 py-1 rounded-sm text-slate-700 font-medium' :
                                        isMinimal ? 'text-slate-600 border-r border-slate-300 pr-2 last:border-0' :
                                            'bg-white border border-slate-200 px-2 py-1 rounded-sm text-slate-700'
                                    }`}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}
