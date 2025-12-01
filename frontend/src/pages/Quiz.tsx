import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Question } from '../api';
import { CheckCircle, XCircle, ArrowRight, RefreshCw, Home, HelpCircle, Trophy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';

export const Quiz: React.FC = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [showSummary, setShowSummary] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('currentSession');
        if (stored) {
            setQuestions(JSON.parse(stored));
        } else {
            navigate('/');
        }
    }, [navigate]);

    if (questions.length === 0) return (
        <div className="min-h-screen bg-indigo-900 flex items-center justify-center text-white">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                <p>Loading your challenge...</p>
            </div>
        </div>
    );

    const currentQuestion = questions[currentIndex];

    const handleSubmit = () => {
        if (!selectedOption) return;
        setIsSubmitted(true);
        if (selectedOption === currentQuestion.correct_option_label) {
            setScore(s => s + 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(i => i + 1);
            setSelectedOption(null);
            setIsSubmitted(false);
        } else {
            setShowSummary(true);
        }
    };

    if (showSummary) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-12 max-w-lg w-full text-center shadow-2xl">
                    <div className="bg-yellow-500/20 p-6 rounded-full inline-block mb-6 border border-yellow-500/30">
                        <Trophy size={64} className="text-yellow-400" />
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-2">Challenge Complete!</h2>
                    <p className="text-indigo-200 text-lg mb-8">Here is how you performed</p>

                    <div className="bg-black/20 rounded-2xl p-8 mb-8">
                        <div className="text-6xl font-bold text-white mb-2">{Math.round((score / questions.length) * 100)}%</div>
                        <p className="text-indigo-200">
                            You got <span className="text-white font-bold">{score}</span> out of <span className="text-white font-bold">{questions.length}</span> correct
                        </p>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition font-semibold"
                        >
                            <Home size={20} /> Home
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-indigo-900 rounded-xl transition font-bold shadow-lg shadow-yellow-500/20"
                        >
                            <RefreshCw size={20} /> Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const formatMath = (text: string) => {
        if (!text) return "";
        return text
            .replace(/\\\[/g, '$$$')
            .replace(/\\\]/g, '$$$')
            .replace(/\\\(/g, '$')
            .replace(/\\\)/g, '$');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 flex flex-col items-center p-4 md:p-8 font-sans">
            {/* Header */}
            <div className="w-full max-w-5xl flex justify-between items-center mb-8 text-white/80">
                <button onClick={() => navigate('/')} className="hover:text-white transition flex items-center gap-2">
                    <Home size={20} /> <span className="hidden md:inline">Exit</span>
                </button>
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium border border-white/10">
                    Question {currentIndex + 1} of {questions.length}
                </div>
                <div className="flex items-center gap-2">
                    <HelpCircle size={20} className="hover:text-white cursor-pointer transition" />
                </div>
            </div>

            {/* Main Card */}
            <div className={`w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex ${currentQuestion.source.includes('Kangaroo') ? 'flex-col' : 'flex-col md:flex-row'} min-h-[600px]`}>

                {/* Question Area (Left/Top) */}
                <div className={`flex-1 bg-gray-50 p-8 md:p-12 flex flex-col justify-center border-b ${currentQuestion.source.includes('Kangaroo') ? 'border-gray-200' : 'md:border-b-0 md:border-r border-gray-200'} relative`}>
                    <div className="absolute top-6 left-8 flex gap-3">
                        <span className="text-xs font-bold tracking-wider text-indigo-500 uppercase bg-indigo-50 px-2 py-1 rounded">
                            {currentQuestion.source}
                        </span>
                        <span className="text-xs font-bold tracking-wider text-gray-400 uppercase bg-gray-100 px-2 py-1 rounded">
                            {currentQuestion.topic || "Mathematics"}
                        </span>
                        {currentQuestion.difficulty && (
                            <span className="text-xs font-bold tracking-wider text-yellow-600 uppercase bg-yellow-50 px-2 py-1 rounded">
                                {currentQuestion.difficulty}
                            </span>
                        )}
                    </div>

                    <div className="prose prose-lg max-w-none text-gray-800 mt-8">
                        {currentQuestion.problem && (
                            <ReactMarkdown
                                remarkPlugins={[remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                                components={{
                                    p: ({ node, ...props }) => <p className="text-2xl leading-relaxed font-medium text-gray-800" {...props} />
                                }}
                            >
                                {formatMath(currentQuestion.problem)}
                            </ReactMarkdown>
                        )}

                        {currentQuestion.image_path && (
                            <div className="mt-6 flex justify-center">
                                <img
                                    src={`http://localhost:8000${currentQuestion.image_path}`}
                                    alt="Question"
                                    className="max-w-full max-h-[400px] object-contain rounded-lg shadow-sm border border-gray-100"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Options Area (Right/Bottom) */}
                <div className={`${currentQuestion.source.includes('Kangaroo') ? 'w-full border-t border-gray-200' : 'w-full md:w-[400px]'} bg-white p-8 flex flex-col`}>
                    <h3 className="text-gray-500 font-medium mb-6 text-sm uppercase tracking-wider">Select Answer</h3>

                    <div className={`${currentQuestion.source.includes('Kangaroo') ? 'grid grid-cols-5 gap-4' : 'flex-1 space-y-3'}`}>
                        {currentQuestion.options?.map((opt, idx) => {
                            const label = ['A', 'B', 'C', 'D', 'E'][idx];
                            const isSelected = selectedOption === label;
                            const isCorrect = label === currentQuestion.correct_option_label;

                            return (
                                <button
                                    key={idx}
                                    onClick={() => !isSubmitted && setSelectedOption(label)}
                                    disabled={isSubmitted}
                                    className={`w-full p-4 rounded-xl border-2 text-left transition flex items-center gap-4 group relative overflow-hidden ${isSelected && isSubmitted
                                        ? isCorrect
                                            ? 'bg-green-50 border-green-500 text-green-900'
                                            : 'bg-red-50 border-red-500 text-red-900'
                                        : isSubmitted && isCorrect
                                            ? 'bg-green-50 border-green-500 text-green-900'
                                            : isSelected && !isSubmitted
                                                ? 'bg-indigo-50 border-indigo-600 text-indigo-900 ring-1 ring-indigo-600'
                                                : isSubmitted
                                                    ? 'bg-white border-gray-100 text-gray-400 opacity-50'
                                                    : 'bg-white border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                                        } ${currentQuestion.source.includes('Kangaroo') ? 'flex-col justify-center text-center gap-2' : ''}`}
                                >
                                    <span className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full text-sm font-bold transition ${isSelected && isSubmitted
                                        ? isCorrect
                                            ? 'bg-green-500 text-white'
                                            : 'bg-red-500 text-white'
                                        : isSubmitted && isCorrect
                                            ? 'bg-green-500 text-white'
                                            : isSelected && !isSubmitted
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-500 group-hover:text-white'
                                        }`}>
                                        {label}
                                    </span>
                                    <div className={`font-medium text-lg flex-1 ${currentQuestion.source.includes('Kangaroo') ? 'w-full' : ''}`}>
                                        <ReactMarkdown
                                            remarkPlugins={[remarkMath]}
                                            rehypePlugins={[rehypeKatex]}
                                            components={{
                                                p: ({ node, ...props }) => <span {...props} /> // Render as span to avoid block margins inside button
                                            }}
                                        >
                                            {formatMath(opt)}
                                        </ReactMarkdown>
                                    </div>

                                    {isSubmitted && isSelected && (
                                        <div className={`${currentQuestion.source.includes('Kangaroo') ? 'absolute top-2 right-2' : 'absolute right-4'}`}>
                                            {isCorrect ? (
                                                <CheckCircle className="text-green-500" size={24} />
                                            ) : (
                                                <XCircle className="text-red-500" size={24} />
                                            )}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        {isSubmitted && (
                            <div className={`mb-6 p-4 rounded-xl border ${selectedOption === currentQuestion.correct_option_label ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                <div className="flex items-center gap-2 font-bold mb-2">
                                    {selectedOption === currentQuestion.correct_option_label ? (
                                        <span className="text-green-700 flex items-center gap-2"><CheckCircle size={20} /> Correct!</span>
                                    ) : (
                                        <span className="text-red-700 flex items-center gap-2"><XCircle size={20} /> Incorrect</span>
                                    )}
                                </div>
                                <p className="text-gray-700">
                                    The correct answer is <span className="font-bold">{currentQuestion.correct_option_label}</span>
                                </p>
                            </div>
                        )}

                        {!isSubmitted ? (
                            <button
                                onClick={handleSubmit}
                                disabled={!selectedOption}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg transition shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                            >
                                Submit Answer
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold text-lg transition shadow-lg flex items-center justify-center gap-2"
                            >
                                {currentIndex < questions.length - 1 ? (
                                    <>Next Question <ArrowRight size={20} /></>
                                ) : (
                                    <>See Results <Trophy size={20} /></>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Solution Section - Full Width */}
            {isSubmitted && currentQuestion.solution && (
                <div className="w-full max-w-5xl mt-6 bg-white rounded-3xl shadow-xl overflow-hidden border border-indigo-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-indigo-50/80 px-8 py-4 border-b border-indigo-100 flex items-center justify-between backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-600 rounded-full p-1.5 shadow-sm">
                                <CheckCircle size={18} className="text-white" />
                            </div>
                            <h4 className="font-bold text-indigo-900 text-lg">Step-by-Step Solution</h4>
                        </div>
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Scroll to read</span>
                    </div>

                    <div className="p-8 max-h-[500px] overflow-y-auto custom-scrollbar bg-white">
                        <div className="prose prose-lg prose-indigo max-w-none text-gray-700">
                            <ReactMarkdown
                                remarkPlugins={[remarkMath, remarkGfm]}
                                rehypePlugins={[rehypeKatex]}
                                components={{
                                    p: ({ node, ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
                                    strong: ({ node, ...props }) => <strong className="font-bold text-indigo-900 bg-indigo-50 px-1 rounded" {...props} />,
                                    code: ({ node, ...props }) => <code className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded font-mono text-sm" {...props} />,
                                    blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-indigo-300 pl-4 italic text-gray-600 my-4" {...props} />
                                }}
                            >
                                {formatMath(currentQuestion.solution)}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
