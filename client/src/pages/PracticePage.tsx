import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import confetti from 'canvas-confetti';
import {
  PlayCircle,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Award,
  Check,
  BrainCircuit,
  Loader2,
  BookOpen
} from 'lucide-react';

interface IOption {
  id: string;
  text: string;
}

interface IQuizQuestion {
  _id: string;
  questionText: string;
  options: IOption[];
  difficulty: string;
  concept: string;
  tags?: string[];
}

interface IQuestionReview {
  questionId: string;
  questionText: string;
  options: IOption[];
  userSelectedOptionId: string;
  correctOptionId: string;
  isCorrect: boolean;
  explanation: string;
  concept: string;
  difficulty: string;
  tags?: string[];
}

interface IQuizResult {
  attemptId: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  timeSpentSeconds: number;
  review: IQuestionReview[];
}

export const PracticePage: React.FC = () => {
  const { user } = useAuth();

  // Screen modes: 'setup' | 'active' | 'results'
  const [stage, setStage] = useState<'setup' | 'active' | 'results'>('setup');

  // Setup options
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('mixed');
  const [questionCount, setQuestionCount] = useState<number>(5);

  // Active quiz state
  const [questions, setQuestions] = useState<IQuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Results state
  const [result, setResult] = useState<IQuizResult | null>(null);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'incorrect' | 'correct'>('all');

  // Timer loop for active quiz
  useEffect(() => {
    let interval: any = null;
    if (stage === 'active') {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [stage]);

  // Trigger confetti on high accuracy
  useEffect(() => {
    if (stage === 'results' && result && result.accuracy >= 70) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [stage, result]);

  // Start Quiz Handler
  const handleStartQuiz = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: any = {
        limit: questionCount,
        difficulty: selectedDifficulty
      };

      if (user?.selectedExam?.id) {
        params.examId = user.selectedExam.id;
      }

      if (selectedSubjectId !== 'all') {
        params.subjectId = selectedSubjectId;
      }

      const res: any = await api.get('/quiz/questions', { params });
      const data = res.data?.data || res.data;
      const loadedQuestions: IQuizQuestion[] = data?.questions || [];

      if (loadedQuestions.length === 0) {
        setError('No questions available matching your selection. Try a different subject or difficulty.');
        return;
      }

      setQuestions(loadedQuestions);
      setUserAnswers({});
      setCurrentIndex(0);
      setTimerSeconds(0);
      setStage('active');
    } catch (err: any) {
      setError(err.message || 'Failed to generate practice quiz');
    } finally {
      setIsLoading(false);
    }
  };

  // Select Option
  const handleSelectOption = (questionId: string, optionId: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  // Submit Quiz
  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    setError(null);

    const submissionAnswers = questions.map((q) => ({
      questionId: q._id,
      selectedOptionId: userAnswers[q._id] || '',
      timeSpentSeconds: Math.round(timerSeconds / questions.length)
    }));

    try {
      const payload = {
        examId: user?.selectedExam?.id,
        subjectId: selectedSubjectId !== 'all' ? selectedSubjectId : undefined,
        quizType: 'practice',
        difficulty: selectedDifficulty,
        timeSpentSeconds: timerSeconds,
        answers: submissionAnswers
      };

      const res: any = await api.post('/quiz/submit', payload);
      const evalData: IQuizResult = res.data?.data || res.data;

      setResult(evalData);
      setStage('results');
    } catch (err: any) {
      setError(err.message || 'Failed to submit quiz results');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // ==========================================
  // 1. SETUP VIEW
  // ==========================================
  if (stage === 'setup') {
    return (
      <div className="container animate-fade-in" style={{ maxWidth: '850px' }}>
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="badge badge-indigo" style={{ marginBottom: '0.5rem', display: 'inline-flex', gap: '0.35rem' }}>
                <Sparkles size={14} /> Dynamic Adaptive Practice
              </div>
              <h2>Configure Practice Quiz</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                Targeting: <strong style={{ color: 'var(--text-primary)' }}>{user?.selectedExam?.name || 'General Exam'}</strong>
              </p>
            </div>

            <Link to="/dashboard" className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
              Back to Dashboard
            </Link>
          </div>

          {error && (
            <div style={{
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              marginBottom: '1.5rem',
              color: '#fda4af',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          {/* Subject Focus */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              1. Focus Subject
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setSelectedSubjectId('all')}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: selectedSubjectId === 'all' ? '2px solid var(--primary-light)' : '1px solid var(--border-color)',
                  background: selectedSubjectId === 'all' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  color: selectedSubjectId === 'all' ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <BookOpen size={16} /> All Subjects (Mixed)
              </button>

              {user?.selectedSubjects?.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setSelectedSubjectId(sub.id)}
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: selectedSubjectId === sub.id ? '2px solid var(--primary-light)' : '1px solid var(--border-color)',
                    background: selectedSubjectId === sub.id ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    color: selectedSubjectId === sub.id ? '#fff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>

          {/* Question Count */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              2. Number of Questions
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '0.75rem' }}>
              {[
                { count: 5, label: '5 Questions', desc: 'Quick 5-min Sprint' },
                { count: 10, label: '10 Questions', desc: 'Standard Test (Recommended)' },
                { count: 15, label: '15 Questions', desc: 'Deep Assessment' }
              ].map((item) => (
                <div
                  key={item.count}
                  onClick={() => setQuestionCount(item.count)}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    border: questionCount === item.count ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                    background: questionCount === item.count ? 'rgba(6, 182, 212, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: questionCount === item.count ? '#fff' : 'var(--text-primary)' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty Tier */}
          <div style={{ marginBottom: '2.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              3. Difficulty Level
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginTop: '0.75rem' }}>
              {[
                { id: 'mixed', label: 'Mixed Adaptive' },
                { id: 'easy', label: 'Easy' },
                { id: 'medium', label: 'Medium' },
                { id: 'hard', label: 'Hard / Exam Tier' }
              ].map((diff) => (
                <button
                  key={diff.id}
                  type="button"
                  onClick={() => setSelectedDifficulty(diff.id)}
                  style={{
                    padding: '0.75rem 0.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: selectedDifficulty === diff.id ? '2px solid var(--primary-light)' : '1px solid var(--border-color)',
                    background: selectedDifficulty === diff.id ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                    color: selectedDifficulty === diff.id ? '#fff' : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action */}
          <button
            onClick={handleStartQuiz}
            disabled={isLoading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Preparing Questions...
              </>
            ) : (
              <>
                <PlayCircle size={20} /> Launch Practice Quiz
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. ACTIVE QUIZ VIEW
  // ==========================================
  if (stage === 'active' && questions.length > 0) {
    const currentQ = questions[currentIndex];
    const currentAnswer = userAnswers[currentQ._id];
    const answeredCount = Object.keys(userAnswers).length;
    const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

    return (
      <div className="container animate-fade-in" style={{ maxWidth: '900px' }}>
        {/* Progress Bar & Header */}
        <div className="glass-panel" style={{ padding: '1.25rem 2rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span className="badge badge-indigo">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                Answered: {answeredCount}/{questions.length}
              </span>
              <span className="badge badge-cyan">
                {currentQ.concept || 'General Concept'}
              </span>
              <span className="badge" style={{ textTransform: 'capitalize', background: 'rgba(255, 255, 255, 0.08)' }}>
                {currentQ.difficulty}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--accent-amber)', fontSize: '1rem' }}>
              <Clock size={18} />
              <span>{formatTime(timerSeconds)}</span>
            </div>
          </div>

          {/* Progress bar line */}
          <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--primary), var(--accent-cyan))',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', lineHeight: '1.6', marginBottom: '2rem', color: 'var(--text-primary)' }}>
            {currentQ.questionText}
          </h3>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {currentQ.options.map((option) => {
              const isSelected = currentAnswer === option.id;
              return (
                <div
                  key={option.id}
                  onClick={() => handleSelectOption(currentQ._id, option.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.1rem 1.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                    background: isSelected ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    border: isSelected ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                    background: isSelected ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.05)',
                    color: isSelected ? '#000' : 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    flexShrink: 0
                  }}>
                    {option.id}
                  </div>

                  <span style={{ fontSize: '1rem', color: isSelected ? '#fff' : 'var(--text-secondary)', fontWeight: isSelected ? 600 : 400 }}>
                    {option.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Question Palette & Nav Controls */}
        <div className="glass-panel" style={{ padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          {/* Quick Jump Bubbles */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const hasAnswered = !!userAnswers[q._id];
              return (
                <button
                  key={q._id}
                  onClick={() => setCurrentIndex(idx)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    border: isCurrent ? '2px solid var(--primary-light)' : '1px solid var(--border-color)',
                    background: hasAnswered ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                    color: hasAnswered ? '#6ee7b7' : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Prev / Next / Submit Controls */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
              disabled={currentIndex === 0}
              className="btn btn-secondary"
            >
              <ArrowLeft size={16} /> Prev
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1))}
                className="btn btn-secondary"
              >
                Next <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={isSubmitting}
                className="btn btn-primary"
                style={{ minWidth: '150px' }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Evaluating...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} /> Finish Quiz
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 3. RESULTS & AI EXPLANATION VIEW
  // ==========================================
  if (stage === 'results' && result) {
    const filteredReview = result.review.filter((item) => {
      if (reviewFilter === 'incorrect') return !item.isCorrect;
      if (reviewFilter === 'correct') return item.isCorrect;
      return true;
    });

    return (
      <div className="container animate-fade-in" style={{ maxWidth: '950px' }}>
        {/* Score Hero Panel */}
        <div
          className="glass-panel"
          style={{
            padding: '2.5rem',
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.12))',
            textAlign: 'center'
          }}
        >
          <div className="badge badge-indigo" style={{ marginBottom: '1rem', display: 'inline-flex', gap: '0.35rem' }}>
            <Award size={16} /> Assessment Evaluation Completed
          </div>

          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            {result.accuracy}% Accuracy
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2rem' }}>
            You solved <strong>{result.correctAnswers}</strong> out of <strong>{result.totalQuestions}</strong> questions correctly in {formatTime(result.timeSpentSeconds)}.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setStage('setup');
                setResult(null);
              }}
              className="btn btn-primary"
            >
              <RotateCcw size={18} /> Practice Again
            </button>

            <Link to="/dashboard" className="btn btn-secondary">
              Return to Dashboard
            </Link>
          </div>
        </div>

        {/* Diagnostic Breakdown Header & Filter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3>Detailed AI Diagnostics & Explanations</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Review correct answers, logical solutions, and common exam traps:
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setReviewFilter('all')}
              className={`btn ${reviewFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
            >
              All ({result.review.length})
            </button>
            <button
              onClick={() => setReviewFilter('incorrect')}
              className={`btn ${reviewFilter === 'incorrect' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
            >
              Incorrect ({result.review.filter((r) => !r.isCorrect).length})
            </button>
            <button
              onClick={() => setReviewFilter('correct')}
              className={`btn ${reviewFilter === 'correct' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
            >
              Correct ({result.review.filter((r) => r.isCorrect).length})
            </button>
          </div>
        </div>

        {/* Review Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
          {filteredReview.map((item, index) => (
            <div
              key={item.questionId}
              className="glass-panel"
              style={{
                padding: '2rem',
                borderLeft: item.isCorrect ? '4px solid #10b981' : '4px solid #f43f5e'
              }}
            >
              {/* Question header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                  Question {index + 1} • {item.concept}
                </span>

                {item.isCorrect ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#10b981', fontWeight: 700, fontSize: '0.85rem' }}>
                    <CheckCircle2 size={16} /> Correct (+1)
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#f43f5e', fontWeight: 700, fontSize: '0.85rem' }}>
                    <XCircle size={16} /> Incorrect
                  </span>
                )}
              </div>

              {/* Question Text */}
              <h4 style={{ fontSize: '1.1rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                {item.questionText}
              </h4>

              {/* Options Review */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {item.options.map((opt) => {
                  const isCorrectAnswer = opt.id === item.correctOptionId;
                  const isUserSelection = opt.id === item.userSelectedOptionId;

                  let borderColor = 'var(--border-color)';
                  let bgColor = 'rgba(255, 255, 255, 0.02)';
                  let textColor = 'var(--text-secondary)';

                  if (isCorrectAnswer) {
                    borderColor = '#10b981';
                    bgColor = 'rgba(16, 185, 129, 0.15)';
                    textColor = '#6ee7b7';
                  } else if (isUserSelection && !item.isCorrect) {
                    borderColor = '#f43f5e';
                    bgColor = 'rgba(244, 63, 94, 0.15)';
                    textColor = '#fda4af';
                  }

                  return (
                    <div
                      key={opt.id}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: `1px solid ${borderColor}`,
                        background: bgColor,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.9rem',
                        color: textColor
                      }}
                    >
                      <strong style={{ minWidth: '18px' }}>{opt.id}.</strong>
                      <span>{opt.text}</span>
                      {isCorrectAnswer && <Check size={14} style={{ marginLeft: 'auto', color: '#10b981' }} />}
                    </div>
                  );
                })}
              </div>

              {/* AI Explanation Box */}
              <div
                style={{
                  background: 'rgba(99, 102, 241, 0.08)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <BrainCircuit size={16} /> AI Explanation & Concept Breakdown
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  {item.explanation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
