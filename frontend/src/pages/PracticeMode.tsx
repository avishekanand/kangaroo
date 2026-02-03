import React, { useEffect, useState } from 'react';
import { db } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';
import { BookOpen, Eye, Check } from 'lucide-react';
import 'katex/dist/katex.min.css';
import { MathView } from '../components/MathView';

const PracticeMode: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
    const [showSolution, setShowSolution] = useState(false);
    const [userAnswer, setUserAnswer] = useState('');

    const questions = useLiveQuery(() => db.questions.toArray());

    useEffect(() => {
        const initData = async () => {
            try {
                const count = await db.questions.count();
                if (count === 0) {
                    const response = await fetch('/questions.json');
                    if (!response.ok) throw new Error('Failed to fetch questions');
                    const data = await response.json();
                    await db.questions.bulkAdd(data);
                    console.log('Loaded questions into IndexedDB');
                }
            } catch (error) {
                console.error('Failed to load questions:', error);
            } finally {
                setLoading(false);
            }
        };
        initData();
    }, []);

    if (loading) {
        return <div className="p-8 text-center">Loading questions...</div>;
    }

    if (!questions || questions.length === 0) {
        return <div className="p-8 text-center">No questions found. Please check questions.json.</div>;
    }

    const selectedQuestion = questions.find(q => q.id === selectedQuestionId);

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <h1 className="text-3xl font-bold mb-6 text-indigo-700 flex items-center gap-2">
                <BookOpen className="w-8 h-8" />
                Kangaroo Math Practice
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Question List */}
                <div className="md:col-span-4 bg-white rounded-lg shadow overflow-hidden h-[calc(100vh-200px)] flex flex-col">
                    <div className="p-4 bg-gray-50 border-b font-semibold text-gray-700">
                        Questions ({questions.length})
                    </div>
                    <div className="overflow-y-auto flex-1 p-2 space-y-2">
                        {questions.map(q => (
                            <button
                                key={q.id}
                                onClick={() => {
                                    setSelectedQuestionId(q.id);
                                    setShowSolution(false);
                                    setUserAnswer('');
                                }}
                                className={`w-full text-left p-3 rounded-md text-sm transition-colors ${selectedQuestionId === q.id
                                    ? 'bg-indigo-100 text-indigo-800 border-l-4 border-indigo-500'
                                    : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                            >
                                <div className="font-medium truncate">Question {q.id + 1}</div>
                                <div className="text-xs text-gray-500 truncate">{q.problem.substring(0, 40)}...</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Question Detail */}
                <div className="md:col-span-8 bg-white rounded-lg shadow p-8 min-h-[400px]">
                    {selectedQuestion ? (
                        <div className="flex flex-col h-full">
                            <div className="mb-8">
                                <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Question {selectedQuestion.id + 1}</h2>
                                <div className="prose max-w-none bg-gray-50 p-6 rounded-xl border border-gray-200 text-lg leading-relaxed shadow-sm">
                                    <MathView content={selectedQuestion.problem} />
                                </div>
                            </div>

                            <div className="mt-auto">
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Answer</label>
                                    <div className="flex gap-4">
                                        <input
                                            type="text"
                                            value={userAnswer}
                                            onChange={(e) => setUserAnswer(e.target.value)}
                                            placeholder="Enter your answer here..."
                                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        />
                                        <button
                                            onClick={() => setShowSolution(true)}
                                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-md flex items-center gap-2"
                                        >
                                            <Check className="w-5 h-5" />
                                            Check Answer
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Enter your answer and click check to see the solution.</p>
                                </div>

                                {showSolution && (
                                    <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
                                        <div className="flex items-center gap-2 mb-3 text-green-700 font-semibold text-lg">
                                            <Eye className="w-5 h-5" />
                                            Solution
                                        </div>
                                        <div className="prose max-w-none bg-green-50 p-6 rounded-xl border border-green-200 text-gray-800 shadow-sm">
                                            <MathView content={selectedQuestion.solution} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <BookOpen className="w-24 h-24 mb-6 opacity-20" />
                            <p className="text-xl font-medium">Select a question from the list to begin practice</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PracticeMode;
