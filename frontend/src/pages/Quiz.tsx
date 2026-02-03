import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Question, streamHint } from '../api';
import { CheckCircle, XCircle, ArrowRight, RefreshCw, Home, HelpCircle, Trophy, Clock, Lightbulb, SkipForward, Loader } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { MathView } from '../components/MathView';

const QuizTimer = React.memo(({
    initialTime,
    showSummary,
    onTimeUp
}: {
    initialTime: number,
    showSummary: boolean,
    onTimeUp: () => void
}) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);

    useEffect(() => {
        if (showSummary || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [showSummary, onTimeUp]);

    const displayTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold border border-white/10 flex items-center gap-2 ${timeLeft < 60 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
            <Clock size={16} /> {displayTime(timeLeft)}
        </div>
    );
});

QuizTimer.displayName = 'QuizTimer';

export const Quiz: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [showSummary, setShowSummary] = useState(false);
    const [initialTimeLimit, setInitialTimeLimit] = useState<number | null>(null);

    // Hint State
    const [hint, setHint] = useState<string | null>(null);
    const [loadingHint, setLoadingHint] = useState(false);

    // Time Tracking
    const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

    useEffect(() => {
        const storedSession = localStorage.getItem('currentSession');
        const storedConfig = localStorage.getItem('quizConfig');

        if (storedSession) {
            setQuestions(JSON.parse(storedSession));
        } else {
            navigate('/');
        }

        if (storedConfig) {
            const config = JSON.parse(storedConfig);
            if (config.timeLimit) {
                setInitialTimeLimit(config.timeLimit);
            }
        }
    }, [navigate]);

    useEffect(() => {
        if (currentIndex < questions.length - 1) {
            // Preload next 2 images
            questions.slice(currentIndex + 1, currentIndex + 3).forEach(q => {
                if (q.image_path) {
                    const img = new Image();
                    img.src = `http://localhost:8000${q.image_path}`;
                }
            });
        }
    }, [currentIndex, questions]);

    if (questions.length === 0) return (
        <div className="min-h-screen bg-indigo-900 flex items-center justify-center text-white">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                <p>Loading your challenge...</p>
            </div>
        </div>
    );

    const currentQuestion = questions[currentIndex];

    const handleSubmit = async () => {
        if (!selectedOption) return;
        setIsSubmitted(true);
        const isCorrect = selectedOption === currentQuestion.correct_option_label;
        if (isCorrect) {
            setScore(s => s + 1);
        }

        // Record attempt
        if (user) {
            try {
                await fetch('http://localhost:8000/attempts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: user.id,
                        question_id: currentQuestion.id,
                        selected_option: selectedOption,
                        is_correct: isCorrect,
                        time_taken: Math.round((Date.now() - questionStartTime) / 1000) // Seconds
                    })
                });
            } catch (error) {
                console.error('Failed to record attempt:', error);
            }
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(i => i + 1);
            setSelectedOption(null);
            setIsSubmitted(false);
            setHint(null); // Clear hint
            setQuestionStartTime(Date.now()); // Reset timer for next question
        } else {
            setShowSummary(true);
        }
    };

    const handleSkip = () => {
        handleNext();
    };

    const handleHint = async () => {
        if (hint) return;
        setLoadingHint(true);
        setHint(""); // Initialize with empty string to show the panel
        try {
            const text = currentQuestion.problem || "Please help me with this math problem.";
            await streamHint(text, (chunk) => {
                setHint(prev => (prev || "") + chunk);
            });
        } catch (error) {
            console.error("Failed to get hint", error);
            setHint("Sorry, could not generate a hint. Is Ollama running?");
        } finally {
            setLoadingHint(false);
        }
    };

    if (showSummary) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-12 max-w-lg w-full text-center shadow-2xl">
                    <div className="bg-yellow-500/20 p-6 rounded-full inline-block mb-6 border border-yellow-500/30">
                        <Trophy size={64} className="text-yellow-400" />
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-2">
                        Challenge Complete!
                    </h2>
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 flex flex-col items-center p-4 md:p-8 font-sans">
            {/* Header */}
            <div className="w-full max-w-5xl flex justify-between items-center mb-8 text-white/80">
                <button onClick={() => navigate('/')} className="hover:text-white transition flex items-center gap-2">
                    <Home size={20} /> <span className="hidden md:inline">Exit</span>
                </button>

                <div className="flex items-center gap-4">
                    <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium border border-white/10">
                        Question {currentIndex + 1} of {questions.length}
                    </div>
                    {initialTimeLimit !== null && (
                        <QuizTimer
                            initialTime={initialTimeLimit}
                            showSummary={showSummary}
                            onTimeUp={() => setShowSummary(true)}
                        />
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSkip}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition text-sm font-medium border border-white/10"
                    >
                        Skip <SkipForward size={16} />
                    </button>
                    <HelpCircle size={20} className="hover:text-white cursor-pointer transition" />
                </div>
            </div>

            {/* Main Card */}
            <div className={`w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex ${currentQuestion.source.includes('Kangaroo') ? 'flex-col' : 'flex-col md:flex-row'} min-h-[600px]`}>

                {/* Question Area (Left/Top) */}
                <div className={`flex-1 bg-gray-50 p-8 md:p-12 flex flex-col justify-center border-b ${currentQuestion.source.includes('Kangaroo') ? 'border-gray-200' : 'md:border-b-0 md:border-r border-gray-200'} relative`}>
                    <div className="absolute top-6 left-8 flex gap-3">
                        <span className="text-xs font-bold tracking-wider text-gray-400 uppercase bg-gray-100 px-2 py-1 rounded">
                            ID: {currentQuestion.id} ({currentQuestion.external_id})
                        </span>
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

                    {/* Hint Button */}
                    <button
                        onClick={handleHint}
                        disabled={loadingHint || !!hint}
                        className={`absolute top-6 right-8 p-2 rounded-full transition shadow-sm ${hint ? 'bg-yellow-100 text-yellow-600' : 'bg-white hover:bg-yellow-50 text-gray-400 hover:text-yellow-500 border border-gray-200'
                            }`}
                        title="Get a Hint"
                    >
                        {loadingHint ? <Loader size={20} className="animate-spin" /> : <Lightbulb size={20} />}
                    </button>

                    {/* Hint Panel */}
                    {hint !== null && (
                        <div className="mx-8 mt-6 mb-2 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-sm animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center gap-2 font-bold mb-1">
                                <Lightbulb size={16} /> Hint {loadingHint && <span className="animate-pulse">...</span>}
                            </div>
                            {hint === "" && loadingHint ? (
                                <div className="flex items-center gap-2 text-yellow-600 italic">
                                    <Loader size={14} className="animate-spin" /> Tutor is thinking...
                                </div>
                            ) : (
                                <MathView content={hint} />
                            )}
                        </div>
                    )}

                    <div className="prose prose-lg max-w-none text-gray-800 mt-8">
                        {currentQuestion.problem && (
                            <MathView
                                content={currentQuestion.problem}
                                className="text-2xl leading-relaxed font-medium text-gray-800"
                            />
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
                                        <MathView content={opt} inline />
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
                        <MathView
                            content={currentQuestion.solution}
                            className="prose prose-lg prose-indigo max-w-none text-gray-700"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
