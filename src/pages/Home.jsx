import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-kodnest-off-white text-slate-900 font-sans flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-3xl space-y-8">
                <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-slate-900 leading-tight">
                    Build a Resume <br />
                    <span className="text-kodnest-red">That Gets Read.</span>
                </h1>

                <p className="text-xl md:text-2xl text-slate-600 font-serif max-w-2xl mx-auto leading-relaxed">
                    Clean, professional, and calm. Create a resume that stands out by its simplicity.
                </p>

                <div className="pt-8">
                    <Link
                        to="/builder"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-kodnest-red text-white text-lg font-bold rounded-sm hover:bg-red-900 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        Start Building
                        <ArrowRight size={24} />
                    </Link>
                </div>
            </div>

            <footer className="absolute bottom-6 text-slate-400 text-sm font-serif">
                © 2024 KodNest Premium.
            </footer>
        </div>
    );
}
