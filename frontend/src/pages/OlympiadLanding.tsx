import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchOlympiadQuestions } from '../api';
import { Trophy, ArrowRight, Loader } from 'lucide-react';

export const OlympiadLanding: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const source = searchParams.get('source');
    const [loading, setLoading] = useState(false);

    const handleStart = async () => {
        setLoading(true);
        try {
            const questions = await fetchOlympiadQuestions(20, source || undefined);
            localStorage.setItem('currentSession', JSON.stringify(questions));
            navigate('/quiz');
        } catch (error) {
            console.error("Failed to fetch Olympiad questions", error);
            alert("Failed to load questions. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getTitle = () => {
        if (source === 'OlymMATH') return 'OlymMATH Challenge';
        if (source === 'NuminaMath-CoT') return 'NuminaMath Challenge';
        if (source === 'OlympiadBench') return 'OlympiadBench Challenge';
        if (source === 'BRIGHT (LeetCode)') return 'BRIGHT LeetCode Challenge';
        if (source === 'BRIGHT (Economics)') return 'BRIGHT Economics Challenge';
        if (source === 'Kangaroo 2025 (5-6)') return 'Kangaroo (5-6) Challenge';
        return 'Olympiad Challenge';
    };

    const getDescription = () => {
        if (source === 'OlymMATH') return 'Test your skills with high-quality problems from the OlymMATH dataset.';
        if (source === 'NuminaMath-CoT') return 'Practice Chain-of-Thought reasoning with complex math problems.';
        if (source === 'OlympiadBench') return 'Tackle advanced competition-level mathematics benchmarks.';
        if (source === 'BRIGHT (LeetCode)') return 'Algorithmic and coding challenges (Note: Answers not available).';
        if (source === 'BRIGHT (Economics)') return 'Complex economic reasoning problems (Note: Answers not available).';
        if (source === 'Kangaroo 2025 (5-6)') return 'Step up your game with math problems for grades 5-6.';
        return 'Test your skills with high-quality problems from various datasets.';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 text-white flex flex-col items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center space-y-8">
                <div className="flex justify-center">
                    <div className="bg-yellow-500/20 p-6 rounded-full backdrop-blur-sm border border-yellow-500/30">
                        <Trophy size={64} className="text-yellow-400" />
                    </div>
                </div>

                <h1 className="text-5xl font-bold tracking-tight">{getTitle()}</h1>

                <p className="text-xl text-indigo-200 leading-relaxed">
                    {getDescription()}
                </p>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                    <h3 className="text-lg font-semibold mb-4">Challenge Details</h3>
                    <ul className="text-left space-y-3 text-indigo-100 mb-8">
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                            20 Random Questions
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                            Mixed Topics
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                            Advanced Difficulty
                        </li>
                    </ul>

                    <button
                        onClick={handleStart}
                        disabled={loading}
                        className="w-full bg-yellow-500 hover:bg-yellow-400 text-indigo-900 font-bold py-4 rounded-xl text-xl transition flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader className="animate-spin" /> Loading...
                            </>
                        ) : (
                            <>
                                Start Challenge <ArrowRight />
                            </>
                        )}
                    </button>
                </div>

                <button
                    onClick={() => navigate('/')}
                    className="text-indigo-300 hover:text-white transition"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};
