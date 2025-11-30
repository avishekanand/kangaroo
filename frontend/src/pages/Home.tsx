import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';

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
                <Link to="/olympiad?source=OlympiadBench" className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center text-center group bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-100 hover:border-emerald-300">
                    <div className="bg-emerald-100 p-4 rounded-full mb-4 group-hover:bg-emerald-200 transition">
                        <Trophy size={40} className="text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-bold mb-2 text-emerald-900">OlympiadBench</h2>
                    <p className="text-emerald-700 text-sm">Advanced competition benchmarks.</p>
                </Link>

                {/* Kangaroo 3-4 */}
                <Link to="/olympiad?source=Kangaroo%202025%20(3-4)" className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center text-center group bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-100 hover:border-orange-300">
                    <div className="bg-orange-100 p-4 rounded-full mb-4 group-hover:bg-orange-200 transition">
                        <Trophy size={40} className="text-orange-600" />
                    </div>
                    <h2 className="text-xl font-bold mb-2 text-orange-900">Kangaroo (3-4)</h2>
                    <p className="text-orange-700 text-sm">Grades 3-4 Math Kangaroo questions.</p>
                </Link>

                {/* Kangaroo 5-6 */}
                <Link to="/olympiad?source=Kangaroo%202025%20(5-6)" className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center text-center group bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-100 hover:border-red-300">
                    <div className="bg-red-100 p-4 rounded-full mb-4 group-hover:bg-red-200 transition">
                        <Trophy size={40} className="text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold mb-2 text-red-900">Kangaroo (5-6)</h2>
                    <p className="text-red-700 text-sm">Grades 5-6 Math Kangaroo questions.</p>
                </Link>
            </div>
        </div>
    );
};
