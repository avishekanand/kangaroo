import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export const CategoryPage: React.FC = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const navigate = useNavigate();

    const getCategoryDetails = (id: string | undefined) => {
        switch (id) {
            case 'kangaroo':
                return {
                    title: 'Kangaroo Math',
                    description: 'Fun and challenging math problems for students.',
                    datasets: [
                        {
                            name: 'Kangaroo (5-6)',
                            source: 'Kangaroo 2025 (5-6)',
                            description: 'Step up your game with math problems for grades 5-6.',
                            icon: '🦘',
                            color: 'red'
                        }
                    ]
                };
            case 'bright':
                return {
                    title: 'BRIGHT Benchmark',
                    description: 'Challenging retrieval-based reasoning problems.',
                    datasets: [
                        {
                            name: 'BRIGHT (LeetCode)',
                            source: 'BRIGHT (LeetCode)',
                            description: 'Algorithmic and coding challenges.',
                            icon: '💻',
                            color: 'cyan'
                        },
                        {
                            name: 'BRIGHT (Economics)',
                            source: 'BRIGHT (Economics)',
                            description: 'Complex economic reasoning problems.',
                            icon: '📈',
                            color: 'blue'
                        }
                    ]
                };
            case 'olympiad':
                return {
                    title: 'Olympiad Math',
                    description: 'Advanced competition-level mathematics.',
                    datasets: [
                        {
                            name: 'OlymMATH',
                            source: 'OlymMATH',
                            description: 'High-quality Olympiad mathematics problems.',
                            icon: '📐',
                            color: 'purple'
                        },
                        {
                            name: 'NuminaMath-CoT',
                            source: 'NuminaMath-CoT',
                            description: 'Chain-of-Thought reasoning with complex math.',
                            icon: '🧠',
                            color: 'indigo'
                        },
                        {
                            name: 'OlympiadBench',
                            source: 'OlympiadBench',
                            description: 'Advanced competition benchmarks.',
                            icon: '🏆',
                            color: 'emerald'
                        }
                    ]
                };
            default:
                return null;
        }
    };

    const category = getCategoryDetails(categoryId);

    if (!category) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Category not found</h2>
                    <button onClick={() => navigate('/')} className="text-indigo-600 hover:underline">
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition font-medium">
                        <ArrowLeft size={20} /> Back to Categories
                    </Link>
                    <h1 className="text-xl font-bold text-gray-800">{category.title}</h1>
                    <div className="w-20"></div> {/* Spacer for centering */}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">{category.title}</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">{category.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {category.datasets.map((dataset, idx) => (
                        <Link
                            key={idx}
                            to={`/olympiad?source=${encodeURIComponent(dataset.source)}`}
                            className={`group bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-${dataset.color}-100 hover:border-${dataset.color}-200 relative overflow-hidden`}
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-${dataset.color}-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110`}></div>
                            <div className="relative z-10">
                                <div className={`bg-${dataset.color}-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform`}>
                                    <span className="text-2xl">{dataset.icon}</span>
                                </div>
                                <h2 className={`text-xl font-bold mb-2 text-${dataset.color}-900`}>{dataset.name}</h2>
                                <p className="text-gray-600 mb-6">{dataset.description}</p>
                                <div className={`flex items-center text-${dataset.color}-600 font-semibold group-hover:gap-2 transition-all`}>
                                    Start Challenge <ArrowRight size={20} className="ml-2" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};
