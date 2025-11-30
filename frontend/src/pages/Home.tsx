import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ArrowRight } from 'lucide-react';

export const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <h1 className="text-4xl font-bold text-blue-600 mb-8">Math Practice</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
                {/* OlymMATH */}
                <Link to="/olympiad?source=OlymMATH" className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center text-center group bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-100 hover:border-indigo-300">
                    <div className="bg-indigo-100 p-4 rounded-full mb-4 group-hover:bg-indigo-200 transition">
                        <Trophy size={40} className="text-indigo-600" />
                    </div>
                    <h2 className="text-xl font-bold mb-2 text-indigo-900">OlymMATH</h2>
                    <p className="text-indigo-700 text-sm">Olympiad-level mathematics problems.</p>
                </Link>

                {/* NuminaMath */}
                <Link to="/olympiad?source=NuminaMath-CoT" className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center text-center group bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100 hover:border-purple-300">
                    <div className="bg-purple-100 p-4 rounded-full mb-4 group-hover:bg-purple-200 transition">
                        <Trophy size={40} className="text-purple-600" />
                    </div>
                    <h2 className="text-xl font-bold mb-2 text-purple-900">NuminaMath CoT</h2>
                    <p className="text-purple-700 text-sm">Chain-of-Thought reasoning problems.</p>
                </Link>

                {/* OlympiadBench */}
                <Link to="/olympiad?source=OlympiadBench" className="group bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-emerald-100 hover:border-emerald-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10">
                        <div className="bg-emerald-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                            <span className="text-2xl">🏆</span>
                        </div>
                        <h2 className="text-xl font-bold mb-2 text-emerald-900">OlympiadBench</h2>
                        <p className="text-gray-600 mb-6">Advanced competition benchmarks.</p>
                        <div className="flex items-center text-emerald-600 font-semibold group-hover:gap-2 transition-all">
                            Start Challenge <ArrowRight size={20} className="ml-2" />
                        </div>
                    </div>
                </Link>

                {/* BRIGHT (LeetCode) */}
                <Link to="/olympiad?source=BRIGHT%20(LeetCode)" className="group bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-cyan-100 hover:border-cyan-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10">
                        <div className="bg-cyan-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                            <span className="text-2xl">💻</span>
                        </div>
                        <h2 className="text-xl font-bold mb-2 text-cyan-900">BRIGHT (LeetCode)</h2>
                        <p className="text-gray-600 mb-6">Algorithmic and coding challenges.</p>
                        <div className="flex items-center text-cyan-600 font-semibold group-hover:gap-2 transition-all">
                            Start Challenge <ArrowRight size={20} className="ml-2" />
                        </div>
                    </div>
                </Link>

                {/* BRIGHT (Economics) */}
                <Link to="/olympiad?source=BRIGHT%20(Economics)" className="group bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-blue-100 hover:border-blue-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10">
                        <div className="bg-blue-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                            <span className="text-2xl">📈</span>
                        </div>
                        <h2 className="text-xl font-bold mb-2 text-blue-900">BRIGHT (Economics)</h2>
                        <p className="text-gray-600 mb-6">Complex economic reasoning problems.</p>
                        <div className="flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
                            Start Challenge <ArrowRight size={20} className="ml-2" />
                        </div>
                    </div>
                </Link>

                {/* Kangaroo 5-6 */}
                <Link to="/olympiad?source=Kangaroo%202025%20(5-6)" className="group bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-red-100 hover:border-red-200 relative overflow-hidden md:col-span-2">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10">
                        <div className="bg-red-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                            <span className="text-2xl">🦘</span>
                        </div>
                        <h2 className="text-xl font-bold mb-2 text-red-900">Kangaroo (5-6)</h2>
                        <p className="text-gray-600 mb-6">Step up your game with math problems for grades 5-6.</p>
                        <div className="flex items-center text-red-600 font-semibold group-hover:gap-2 transition-all">
                            Start Challenge <ArrowRight size={20} className="ml-2" />
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
};
