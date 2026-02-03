
import React from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, Settings } from 'lucide-react';

export const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8 font-sans">
            <h1 className="text-4xl font-extrabold text-slate-800 mb-12">Math Practice Platform</h1>

            <div className="w-full max-w-6xl space-y-12">

                {/* Section 1: Static Mode (Browser Only) */}
                <div className="bg-white rounded-3xl shadow-lg border border-indigo-100 overflow-hidden">
                    <div className="bg-indigo-600 px-8 py-4 flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <Play size={24} className="text-white fill-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Static Mode</h2>
                            <p className="text-indigo-100 text-sm">Browser-only practice with pre-loaded datasets</p>
                        </div>
                    </div>

                    <div className="p-8">
                        <Link to="/practice-static" className="flex items-center gap-8 group hover:bg-slate-50 p-6 rounded-2xl transition-colors border border-dashed border-slate-200 hover:border-indigo-300">
                            <div className="bg-indigo-100 w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                <span className="text-4xl">🦘</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-indigo-700 transition-colors">Kangaroo Static Practice</h3>
                                <p className="text-slate-600 text-lg mb-2">
                                    Instant access to ~600 math problems. No server required.
                                </p>
                                <div className="flex gap-4 text-sm text-slate-500 font-medium">
                                    <span className="flex items-center gap-1">⚡ Instant Load</span>
                                    <span className="flex items-center gap-1">💾 Offline Capable</span>
                                    <span className="flex items-center gap-1">📝 Self-Paced</span>
                                </div>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                <ArrowRight size={24} />
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Section 2: Dynamic Mode (Server Connected) */}
                <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden relative">
                    <div className="bg-slate-800 px-8 py-4 flex items-center gap-3">
                        <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                            <Settings size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Dynamic Mode</h2>
                            <p className="text-slate-300 text-sm">Interactive sessions with user modeling and tracking</p>
                        </div>
                    </div>

                    <div className="p-8 bg-slate-50/50">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Kangaroo Math */}
                            <Link to="/category/kangaroo" className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-200 hover:border-red-200">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="bg-red-50 w-12 h-12 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🦘</div>
                                    <h3 className="font-bold text-lg text-slate-800 group-hover:text-red-700">Kangaroo Math</h3>
                                </div>
                                <p className="text-slate-500 text-sm mb-4">Adaptive practice with official competition problems.</p>
                                <div className="text-red-600 font-semibold text-sm flex items-center gap-1">Configure Session <ArrowRight size={16} /></div>
                            </Link>

                            {/* BRIGHT Benchmark */}
                            <Link to="/category/bright" className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-200 hover:border-cyan-200">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="bg-cyan-50 w-12 h-12 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">💡</div>
                                    <h3 className="font-bold text-lg text-slate-800 group-hover:text-cyan-700">BRIGHT Logic</h3>
                                </div>
                                <p className="text-slate-500 text-sm mb-4">Challenging retrieval-based reasoning problems.</p>
                                <div className="text-cyan-600 font-semibold text-sm flex items-center gap-1">Configure Session <ArrowRight size={16} /></div>
                            </Link>

                            {/* Olympiad Math */}
                            <Link to="/category/olympiad" className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-200 hover:border-purple-200">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="bg-purple-50 w-12 h-12 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🏆</div>
                                    <h3 className="font-bold text-lg text-slate-800 group-hover:text-purple-700">Olympiad Math</h3>
                                </div>
                                <p className="text-slate-500 text-sm mb-4">Advanced competition-level mathematics.</p>
                                <div className="text-purple-600 font-semibold text-sm flex items-center gap-1">Configure Session <ArrowRight size={16} /></div>
                            </Link>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-200 flex justify-center">
                            <Link to="/client-test" className="text-slate-400 hover:text-slate-600 text-sm flex items-center gap-2 transition-colors">
                                <Settings size={14} /> Developer Prototype: Client-side PDF Extractor
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
