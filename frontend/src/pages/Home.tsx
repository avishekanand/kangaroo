import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <h1 className="text-4xl font-bold text-blue-600 mb-8">Math Practice</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
                {/* Kangaroo Math */}
                <Link to="/category/kangaroo" className="group bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-red-100 hover:border-red-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10">
                        <div className="bg-red-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                            <span className="text-2xl">🦘</span>
                        </div>
                        <h2 className="text-xl font-bold mb-2 text-red-900">Kangaroo Math</h2>
                        <p className="text-gray-600 mb-6">Fun and challenging math problems for students.</p>
                        <div className="flex items-center text-red-600 font-semibold group-hover:gap-2 transition-all">
                            Explore <ArrowRight size={20} className="ml-2" />
                        </div>
                    </div>
                </Link>

                {/* BRIGHT Benchmark */}
                <Link to="/category/bright" className="group bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-cyan-100 hover:border-cyan-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10">
                        <div className="bg-cyan-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                            <span className="text-2xl">💡</span>
                        </div>
                        <h2 className="text-xl font-bold mb-2 text-cyan-900">BRIGHT Benchmark</h2>
                        <p className="text-gray-600 mb-6">Challenging retrieval-based reasoning problems.</p>
                        <div className="flex items-center text-cyan-600 font-semibold group-hover:gap-2 transition-all">
                            Explore <ArrowRight size={20} className="ml-2" />
                        </div>
                    </div>
                </Link>

                {/* Olympiad Math */}
                <Link to="/category/olympiad" className="group bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-purple-100 hover:border-purple-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10">
                        <div className="bg-purple-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                            <span className="text-2xl">🏆</span>
                        </div>
                        <h2 className="text-xl font-bold mb-2 text-purple-900">Olympiad Math</h2>
                        <p className="text-gray-600 mb-6">Advanced competition-level mathematics.</p>
                        <div className="flex items-center text-purple-600 font-semibold group-hover:gap-2 transition-all">
                            Explore <ArrowRight size={20} className="ml-2" />
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
};
