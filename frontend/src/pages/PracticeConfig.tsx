import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createSession } from '../api';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export const PracticeConfig: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const source = searchParams.get('source');

    const { user } = useUser();
    const [mode, setMode] = useState<'practice' | 'challenge'>('practice');
    const [limit, setLimit] = useState(10);
    const [difficulty, setDifficulty] = useState('all');
    const [loading, setLoading] = useState(false);

    const handleStart = async () => {
        setLoading(true);
        try {
            let min = 1, max = 5;
            if (difficulty === 'easy') { max = 2; }
            else if (difficulty === 'medium') { min = 3; max = 3; }
            else if (difficulty === 'hard') { min = 4; }

            // Challenge Mode overrides
            const finalLimit = mode === 'challenge' ? 25 : limit;

            const questions = await createSession({
                limit: finalLimit,
                difficulty_min: min,
                difficulty_max: max,
                user_id: user?.id,
                mode: mode,
                source: source || undefined
            });

            // Store session
            localStorage.setItem('currentSession', JSON.stringify(questions));

            // Store quiz config
            const config = {
                mode,
                timeLimit: mode === 'challenge' ? 50 * 60 : null // 50 minutes in seconds
            };
            localStorage.setItem('quizConfig', JSON.stringify(config));

            navigate('/quiz');
        } catch (err) {
            alert('Failed to start session. Make sure there are questions available.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
                <h1 className="text-2xl font-bold text-center mb-6">Practice Setup</h1>

                <div className="space-y-6">
                    {/* Mode Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mode</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setMode('practice')}
                                className={`py-2 px-4 rounded-lg border-2 font-medium transition ${mode === 'practice' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                            >
                                Practice
                            </button>
                            <button
                                onClick={() => setMode('challenge')}
                                className={`py-2 px-4 rounded-lg border-2 font-medium transition ${mode === 'challenge' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                            >
                                Challenge
                            </button>
                        </div>
                        {mode === 'challenge' && (
                            <p className="text-xs text-indigo-600 mt-2 font-medium">
                                ⚡ 25 Questions • 50 Minutes • Timed
                            </p>
                        )}
                    </div>

                    {mode === 'practice' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Questions</label>
                            <select
                                value={limit}
                                onChange={(e) => setLimit(Number(e.target.value))}
                                className="block w-full rounded-md border-gray-300 shadow-sm border p-2"
                            >
                                <option value={5}>5 Questions</option>
                                <option value={10}>10 Questions</option>
                                <option value={20}>20 Questions</option>
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm border p-2"
                        >
                            <option value="all">Any Difficulty</option>
                            <option value="easy">Easy (1-2)</option>
                            <option value="medium">Medium (3)</option>
                            <option value="hard">Hard (4-5)</option>
                        </select>
                    </div>

                    <button
                        onClick={handleStart}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Starting...' : mode === 'challenge' ? 'Start Challenge' : 'Start Practice'}
                    </button>

                    <div className="text-center">
                        <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm">Cancel</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
