export default function Problem() {
    return (
        <div className="max-w-[720px] mx-auto space-y-10">
            <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight leading-tight">01. Problem Statement</h1>
            <p className="text-xl text-slate-600 leading-relaxed font-serif">
                Define the core problem your AI Resume Builder solves. Who is it for? What pain points does it address?
            </p>

            <div className="bg-white p-10 rounded-sm border border-slate-200">
                <h2 className="text-2xl font-serif font-bold mb-6 text-slate-900">Core Problem</h2>
                <textarea
                    className="w-full h-40 p-4 border border-slate-200 rounded-sm focus:border-kodnest-red focus:ring-0 outline-none transition-all font-mono text-sm leading-relaxed"
                    placeholder="Describe the problem..."
                ></textarea>
            </div>
        </div>
    );
}
