import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { CheckCircle, XCircle, Calendar, Filter, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface Question {
    id: number;
    problem: string;
    correct_option_label: string;
    source: string;
}

interface Attempt {
    id: number;
    question_id: number;
    selected_option: string;
    is_correct: boolean;
    timestamp: string;
    question: Question;
}

export const ProfilePage: React.FC = () => {
    const { user } = useUser();
    const [attempts, setAttempts] = useState<Attempt[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<'all' | 'correct' | 'incorrect'>('all');
    const [filterDate, setFilterDate] = useState<string>('');

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user) return;
            try {
                const response = await fetch(`http://localhost:8000/users/${user.id}/history`);
                const data = await response.json();
                // Sort by timestamp desc
                data.sort((a: Attempt, b: Attempt) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                setAttempts(data);
            } catch (error) {
                console.error('Failed to fetch history:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">Please select a user to view profile.</p>
            </div>
        );
    }

    const filteredAttempts = attempts.filter(attempt => {
        // Status Filter
        if (filterStatus === 'correct' && !attempt.is_correct) return false;
        if (filterStatus === 'incorrect' && attempt.is_correct) return false;

        // Date Filter (YYYY-MM-DD from input matches timestamp)
        if (filterDate) {
            const attemptDate = new Date(attempt.timestamp).toISOString().split('T')[0];
            if (attemptDate !== filterDate) return false;
        }

        return true;
    });

    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatMath = (text: string) => {
        if (!text) return "";
        return text
            .replace(/\\\[/g, '$$$')
            .replace(/\\\]/g, '$$$')
            .replace(/\\\(/g, '$')
            .replace(/\\\)/g, '$');
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <Link to="/" className="text-indigo-600 hover:underline flex items-center gap-2 mb-2">
                            <ArrowLeft size={16} /> Back to Home
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
                    </div>
                    <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-200">
                        <p className="text-sm text-gray-500 uppercase tracking-wider font-bold">Current User</p>
                        <p className="text-xl font-bold text-indigo-600">{user.username}</p>
                        <p className="text-xs text-gray-400">Joined {new Date(user.created_at).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <p className="text-gray-500 font-medium">Total Attempts</p>
                        <p className="text-3xl font-bold text-gray-900">{attempts.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <p className="text-gray-500 font-medium">Correct Answers</p>
                        <p className="text-3xl font-bold text-green-600">
                            {attempts.filter(a => a.is_correct).length}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <p className="text-gray-500 font-medium">Accuracy</p>
                        <p className="text-3xl font-bold text-blue-600">
                            {attempts.length > 0
                                ? Math.round((attempts.filter(a => a.is_correct).length / attempts.length) * 100)
                                : 0}%
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600 font-medium">
                        <Filter size={20} /> Filters
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                        >
                            <option value="all">All Status</option>
                            <option value="correct">Correct</option>
                            <option value="incorrect">Incorrect</option>
                        </select>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Calendar size={16} className="text-gray-500" />
                            </div>
                            <input
                                type="date"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5"
                            />
                        </div>
                        {filterDate && (
                            <button
                                onClick={() => setFilterDate('')}
                                className="text-sm text-red-500 hover:underline"
                            >
                                Clear Date
                            </button>
                        )}
                    </div>
                </div>

                {/* History List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                            <p className="text-gray-500">Loading history...</p>
                        </div>
                    ) : filteredAttempts.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 border-dashed">
                            <p className="text-gray-500">No attempts found matching your filters.</p>
                        </div>
                    ) : (
                        filteredAttempts.map((attempt) => (
                            <div key={attempt.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        {attempt.is_correct ? (
                                            <div className="bg-green-100 p-2 rounded-full">
                                                <CheckCircle size={20} className="text-green-600" />
                                            </div>
                                        ) : (
                                            <div className="bg-red-100 p-2 rounded-full">
                                                <XCircle size={20} className="text-red-600" />
                                            </div>
                                        )}
                                        <div>
                                            <p className={`font-bold ${attempt.is_correct ? 'text-green-700' : 'text-red-700'}`}>
                                                {attempt.is_correct ? 'Correct Answer' : 'Incorrect Answer'}
                                            </p>
                                            <p className="text-xs text-gray-500">{formatDate(attempt.timestamp)}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold tracking-wider text-indigo-500 uppercase bg-indigo-50 px-2 py-1 rounded">
                                        {attempt.question?.source || 'Unknown Source'}
                                    </span>
                                </div>

                                <div className="mb-4">
                                    <p className="text-gray-800 font-medium mb-2 line-clamp-2">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkMath]}
                                            rehypePlugins={[rehypeKatex]}
                                            components={{
                                                p: ({ node, ...props }) => <span {...props} />
                                            }}
                                        >
                                            {formatMath(attempt.question?.problem || "Question text not available")}
                                        </ReactMarkdown>
                                    </p>
                                </div>

                                <div className="flex gap-4 text-sm">
                                    <div className={`px-3 py-1.5 rounded-lg border ${attempt.is_correct ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                                        You selected: <span className="font-bold">{attempt.selected_option}</span>
                                    </div>
                                    {!attempt.is_correct && (
                                        <div className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-600">
                                            Correct answer: <span className="font-bold">{attempt.question?.correct_option_label}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
