import React from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, ExternalLink } from 'lucide-react';

export default function ResumePreview({ data, template = 'classic', themeColor = '#0f766e' }) {
    if (!data) return null;

    // Inject theme color as CSS variable
    const containerStyle = {
        '--theme-color': themeColor,
    };

    const CommonProps = { data, themeColor };

    return (
        <div
            id="resume-preview-node"
            className="bg-white text-slate-900 font-sans min-h-[297mm] w-[210mm] mx-auto shadow-sm print:shadow-none overflow-hidden"
            style={containerStyle}
        >
            {template === 'modern' ? (
                <ModernLayout {...CommonProps} />
            ) : template === 'minimal' ? (
                <MinimalLayout {...CommonProps} />
            ) : (
                <ClassicLayout {...CommonProps} />
            )}
        </div>
    );
}

// --- SUB-LAYOUTS ---

const ClassicLayout = ({ data }) => {
    const { personal, summary, experience, education, projects, skills, links } = data;

    return (
        <div className="p-10 font-serif">
            <header className="text-center border-b-2 border-[var(--theme-color)] pb-6 mb-8">
                <h1 className="text-4xl font-bold text-slate-900 mb-2 uppercase tracking-tight">{personal?.name}</h1>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600 font-medium tracking-wide">
                    {/* Contact Info */}
                    <ContactItems personal={personal} links={links} />
                </div>
            </header>

            {/* Content Sections */}
            <div className="space-y-6">
                {summary && (
                    <section>
                        <SectionTitle classic>Professional Summary</SectionTitle>
                        <p className="text-slate-800 leading-relaxed text-sm text-justify">{summary}</p>
                    </section>
                )}

                <SkillsSection skills={skills} variant="classic" />
                <ExperienceSection experience={experience} variant="classic" />
                <ProjectsSection projects={projects} variant="classic" />
                <EducationSection education={education} variant="classic" />
            </div>
        </div>
    );
};

const ModernLayout = ({ data }) => {
    const { personal, summary, experience, education, projects, skills, links } = data;

    return (
        <div className="grid grid-cols-[30%_70%] min-h-[297mm]">
            {/* Left Sidebar */}
            <aside className="bg-[var(--theme-color)] text-white p-6 flex flex-col gap-8 print:bg-[var(--theme-color)] print:print-color-adjust-exact">
                <div className="text-center">
                    <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold">
                        {personal.name?.charAt(0) || "U"}
                    </div>
                    <h2 className="text-xl font-bold mb-4">Contact</h2>
                    <div className="flex flex-col gap-3 text-sm text-white/90 text-left">
                        <ContactItems personal={personal} links={links} vertical />
                    </div>
                </div>

                <div className="text-left">
                    <h2 className="text-lg font-bold border-b border-white/30 pb-2 mb-4">Education</h2>
                    <div className="space-y-4">
                        {education && education.map((edu, idx) => (
                            <div key={idx} className="text-sm">
                                <div className="font-bold">{edu.degree}</div>
                                <div className="text-white/80">{edu.institution}</div>
                                <div className="text-white/60 text-xs">{edu.year}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-left">
                    <h2 className="text-lg font-bold border-b border-white/30 pb-2 mb-4">Skills</h2>
                    <SkillsSection skills={skills} variant="modern-sidebar" />
                </div>
            </aside>

            {/* Main Content */}
            <main className="p-8 bg-white">
                <header className="mb-8 border-b-2 border-[var(--theme-color)] pb-4">
                    <h1 className="text-5xl font-bold text-[var(--theme-color)] uppercase tracking-tighter mb-2">{personal?.name}</h1>
                    <p className="text-lg text-slate-500 font-medium">Professional Profile</p>
                </header>

                <div className="space-y-8">
                    {summary && (
                        <section>
                            <SectionTitle modern>Summary</SectionTitle>
                            <p className="text-slate-700 leading-relaxed text-sm text-justify">{summary}</p>
                        </section>
                    )}
                    <ExperienceSection experience={experience} variant="modern" />
                    <ProjectsSection projects={projects} variant="modern" />
                </div>
            </main>
        </div>
    );
};

const MinimalLayout = ({ data }) => {
    const { personal, summary, experience, education, projects, skills, links } = data;

    return (
        <div className="p-10 font-sans">
            <header className="mb-8 pb-4 border-b border-slate-100">
                <h1 className="text-3xl font-normal tracking-wide text-slate-900 mb-2">{personal?.name}</h1>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
                    <ContactItems personal={personal} links={links} />
                </div>
            </header>

            <div className="space-y-8">
                {summary && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Summary</h2>
                        <p className="text-slate-800 leading-relaxed text-sm text-justify">{summary}</p>
                    </section>
                )}

                <SkillsSection skills={skills} variant="minimal" />
                <ExperienceSection experience={experience} variant="minimal" />
                <ProjectsSection projects={projects} variant="minimal" />
                <EducationSection education={education} variant="minimal" />
            </div>
        </div>
    );
};

// --- SHARED COMPONENTS ---

const SectionTitle = ({ children, classic, modern, minimal }) => {
    const className = `text-sm font-bold uppercase tracking-widest mb-4 ${classic ? 'border-b border-slate-200 pb-1 text-center text-slate-500' :
            modern ? 'text-[var(--theme-color)] border-l-4 border-[var(--theme-color)] pl-3' :
                'text-slate-400 mb-2'
        }`;
    return <h2 className={className}>{children}</h2>;
};

const ContactItems = ({ personal, links, vertical = false }) => (
    <>
        {personal?.email && <div className="flex items-center gap-2"><Mail size={12} /> {personal.email}</div>}
        {personal?.phone && <div className="flex items-center gap-2"><Phone size={12} /> {personal.phone}</div>}
        {personal?.location && <div className="flex items-center gap-2"><MapPin size={12} /> {personal.location}</div>}
        {links?.github && <div className="flex items-center gap-2"><Github size={12} /> {!vertical && 'GitHub'}</div>}
        {links?.linkedin && <div className="flex items-center gap-2"><Linkedin size={12} /> {!vertical && 'LinkedIn'}</div>}
    </>
);

const SkillsSection = ({ skills, variant }) => {
    if (!skills) return null;
    const isSidebar = variant === 'modern-sidebar';
    const isMinimal = variant === 'minimal';

    // Normalize logic
    const allSkills = Array.isArray(skills)
        ? { technical: skills, soft: [], tools: [] }
        : skills;

    const renderCategory = (title, items) => (
        items && items.length > 0 && (
            <div className="mb-3 last:mb-0">
                {!isSidebar && <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</h3>}
                <div className={`flex flex-wrap gap-2 ${isSidebar ? 'flex-col gap-1' : ''}`}>
                    {items.map((skill, idx) => (
                        <span key={idx} className={
                            isSidebar ? "text-sm text-white/90" :
                                isMinimal ? "text-sm text-slate-600 border-r border-slate-300 pr-2 last:border-0" :
                                    "text-xs font-medium bg-slate-100 text-slate-700 px-2 py-1 rounded-sm"
                        }>{skill}</span>
                    ))}
                </div>
            </div>
        )
    );

    return (
        <section className={`break-inside-avoid ${isSidebar ? '' : 'mb-8'}`}>
            {!isSidebar && <SectionTitle {...{ [variant]: true, classic: variant === 'classic', modern: variant === 'modern' }}>Skills</SectionTitle>}
            {isSidebar ? (
                <div className="space-y-4">
                    {allSkills.technical?.length > 0 && <div><h4 className="font-bold text-white/80 text-xs mb-2 uppercase">Technical</h4>{allSkills.technical.map(s => <div key={s} className="text-sm text-white/90 mb-1">{s}</div>)}</div>}
                    {allSkills.tools?.length > 0 && <div><h4 className="font-bold text-white/80 text-xs mb-2 uppercase">Tools</h4>{allSkills.tools.map(s => <div key={s} className="text-sm text-white/90 mb-1">{s}</div>)}</div>}
                    {allSkills.soft?.length > 0 && <div><h4 className="font-bold text-white/80 text-xs mb-2 uppercase">Soft Skills</h4>{allSkills.soft.map(s => <div key={s} className="text-sm text-white/90 mb-1">{s}</div>)}</div>}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {renderCategory("Technical", allSkills.technical)}
                    {renderCategory("Tools", allSkills.tools)}
                    {renderCategory("Soft Skills", allSkills.soft)}
                </div>
            )}
        </section>
    );
};

const ExperienceSection = ({ experience, variant }) => (
    experience && experience.length > 0 && (
        <section className={`mb-8 ${variant === 'modern' ? 'pl-2' : ''}`}>
            <SectionTitle {...{ [variant]: true, classic: variant === 'classic', modern: variant === 'modern' }}>Experience</SectionTitle>
            <div className="space-y-6">
                {experience.map((exp, idx) => (
                    <div key={idx} className="break-inside-avoid">
                        <div className="flex justify-between items-baseline mb-1">
                            <h3 className={`font-bold text-slate-900 ${variant === 'classic' ? 'text-lg' : 'text-base'}`}>{exp.role}</h3>
                            <span className="text-xs font-mono text-slate-500">{exp.duration}</span>
                        </div>
                        <div className={`text-sm font-medium mb-2 ${variant === 'modern' ? 'text-[var(--theme-color)]' : 'text-slate-700'}`}>{exp.company}</div>
                        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line text-justify">{exp.description}</p>
                    </div>
                ))}
            </div>
        </section>
    )
);

const ProjectsSection = ({ projects, variant }) => (
    projects && projects.length > 0 && (
        <section className={`mb-8 ${variant === 'modern' ? 'pl-2' : ''}`}>
            <SectionTitle {...{ [variant]: true, classic: variant === 'classic', modern: variant === 'modern' }}>Projects</SectionTitle>
            <div className="space-y-5">
                {projects.map((proj, idx) => (
                    <div key={idx} className="break-inside-avoid">
                        <div className="flex justify-between items-start mb-1">
                            <div>
                                <h3 className="font-bold text-slate-900 text-base">{proj.title || proj.name}</h3>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {proj.techStack?.map((t, i) => <span key={i} className="text-[10px] bg-slate-100 px-1 rounded-sm text-slate-600">{t}</span>)}
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                {proj.liveUrl && <a href={proj.liveUrl} className="text-xs text-[var(--theme-color)] flex items-center gap-1 hover:underline">Live <ExternalLink size={10} /></a>}
                                {proj.githubUrl && <a href={proj.githubUrl} className="text-xs text-slate-500 flex items-center gap-1 hover:text-slate-800">GitHub <Github size={10} /></a>}
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed text-justify mt-2">{proj.description}</p>
                    </div>
                ))}
            </div>
        </section>
    )
);

const EducationSection = ({ education, variant }) => (
    education && education.length > 0 && (
        <section className="mb-8 break-inside-avoid">
            <SectionTitle {...{ [variant]: true, classic: variant === 'classic', modern: variant === 'modern' }}>Education</SectionTitle>
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
    )
);
