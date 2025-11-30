import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Question } from '../api';
import { Trophy, RefreshCcw, Home as HomeIcon } from 'lucide-react';

export const SessionSummary: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<{ total: number, correct: number, wrongQuestions: Question[] } | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('sessionResults');
        if (stored) {
            setStats(JSON.parse(stored));
        } else {
            navigate('/');
        }
    }, [navigate]);

    const handleRetry = () => {
        if (!stats) return;
        // Start new session with wrong questions
        localStorage.setItem('currentSession', JSON.stringify(stats.wrongQuestions));
        navigate('/quiz');
    };

    if (!stats) return null;

    const percentage = Math.round((stats.correct / stats.total) * 100);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                <div className="inline-flex p-4 rounded-full bg-yellow-100 text-yellow-600 mb-6">
                    <Trophy size={48} />
                </div>

                <h1 className="text-3xl font-bold mb-2">Session Complete!</h1>
                <p className="text-gray-600 mb-8">Here's how you did:</p>

                <div className="flex justify-center gap-8 mb-8">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-gray-800">{stats.correct}</div>
                        <div className="text-sm text-gray-500">Correct</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-gray-800">{stats.total}</div>
                        <div className="text-sm text-gray-500">Total</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-blue-600">{percentage}%</div>
                        <div className="text-sm text-gray-500">Score</div>
                    </div>
                </div>

                <div className="space-y-4">
                    {stats.wrongQuestions.length > 0 && (
                        <button
                            onClick={handleRetry}
                            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                        >
                            <RefreshCcw size={20} />
                            Practice Mistakes ({stats.wrongQuestions.length})
                        </button>
                    )}

                    <Link
                        to="/"
                        className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2"
                    >
                        <HomeIcon size={20} />
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};
