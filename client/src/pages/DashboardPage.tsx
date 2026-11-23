import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Sparkles,
  Target,
  BrainCircuit,
  TrendingUp,
  AlertTriangle,
  PlayCircle,
  Clock,
  ArrowRight,
  CheckCircle2,
  Settings2,
  BookOpen,
  Award,
  Calendar
} from 'lucide-react';
import { ExamSelectorModal } from '../components/dashboard/ExamSelectorModal';

interface IRecentAttempt {
  _id: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  timeSpentSeconds: number;
  createdAt: string;
}

interface IAnalyticsData {
  totalAttempted: number;
  correctAnswers: number;
  overallAccuracy: number | null;
  activeMistakes: number;
  totalTimeSpentSeconds: number;
  recentAttempts: IRecentAttempt[];
}

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [analytics, setAnalytics] = useState<IAnalyticsData>({
    totalAttempted: 0,
    correctAnswers: 0,
    overallAccuracy: null,
    activeMistakes: 0,
    totalTimeSpentSeconds: 0,
    recentAttempts: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res: any = await api.get('/quiz/analytics');
      const data = res.data?.data || res.data;
      if (data) {
        setAnalytics(data);
      }
    } catch (err) {
      console.warn('Could not fetch quiz analytics:', err);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '1200px' }}>
      {/* Welcome Banner */}
      <div className="glass-panel" style={{
        padding: '2rem 2.5rem',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.1))',
        border: '1px solid var(--border-hover)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div className="badge badge-indigo" style={{ marginBottom: '0.75rem' }}>
              <Sparkles size={14} /> AI Diagnostic Status: Ready
            </div>
            <h2>Welcome back, {user?.name || 'Student'}! 👋</h2>

            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.35rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>
                Targeting: <strong style={{ color: 'var(--text-primary)' }}>{user?.selectedExam?.name || 'No Exam Selected'}</strong>
              </span>

              <button
                onClick={() => setIsExamModalOpen(true)}
                className="btn btn-secondary"
                style={{
                  padding: '0.3rem 0.75rem',
                  fontSize: '0.8rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Settings2 size={14} /> {user?.selectedExam?.name ? 'Change Exam' : 'Select Target Exam'}
              </button>
            </div>

            {/* Selected Subjects Chips */}
            {user?.selectedSubjects && user.selectedSubjects.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                {user.selectedSubjects.map((sub) => (
                  <span
                    key={sub.id}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    <BookOpen size={12} color="var(--accent-cyan)" /> {sub.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/practice" className="btn btn-primary">
              <PlayCircle size={18} /> Practice Quiz
            </Link>
            <Link to="/tutor" className="btn btn-secondary">
              <BrainCircuit size={18} color="var(--accent-cyan)" /> Ask AI Tutor
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards - Connected to Real Database Analytics */}
      <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>OVERALL ACCURACY</span>
            <Target size={20} color="var(--primary-light)" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800 }}>
            {analytics.overallAccuracy !== null ? `${analytics.overallAccuracy}%` : '-- %'}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {analytics.totalAttempted > 0 ? `Computed across ${analytics.totalAttempted} answers` : 'Take a quiz to compute'}
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>QUESTIONS ATTEMPTED</span>
            <TrendingUp size={20} color="var(--accent-emerald)" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800 }}>{analytics.totalAttempted}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {analytics.correctAnswers} correct answers ({analytics.totalAttempted - analytics.correctAnswers} incorrect)
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>CURRENT STREAK</span>
            <Clock size={20} color="var(--accent-amber)" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800 }}>{user?.streak?.current || 0} Days</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Daily practice consistency</span>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>ACTIVE MISTAKES</span>
            <AlertTriangle size={20} color="var(--accent-rose)" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800 }}>{analytics.activeMistakes}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {analytics.activeMistakes > 0 ? (
              <Link to="/practice" style={{ color: 'var(--accent-cyan)', textDecoration: 'underline' }}>
                Retry in Practice Mode
              </Link>
            ) : (
              'No active weak spots'
            )}
          </span>
        </div>
      </div>

      {/* AI Recommendations & Quick Launch */}
      <div className="grid-cols-2" style={{ marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Sparkles size={20} color="var(--accent-cyan)" />
            <h3>AI Coach Daily Recommendation</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
            {user?.selectedExam?.name ? (
              <>
                You are tuned for <strong>{user.selectedExam.name}</strong>. {analytics.activeMistakes > 0 ? `You have ${analytics.activeMistakes} active mistakes recorded. Review them now to eliminate recurring errors.` : 'Take a practice quiz to reinforce your exam readiness.'}
              </>
            ) : (
              <>
                Welcome to AI Exam Coach! Begin by selecting your target competitive exam to personalize questions and study plans.
              </>
            )}
          </p>

          <Link to="/practice" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'space-between' }}>
            <span>{analytics.totalAttempted > 0 ? 'Continue Practice' : 'Start Initial Assessment'}</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <CheckCircle2 size={20} color="var(--accent-emerald)" />
            <h3>Quick Launch Modes</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/practice" className="btn btn-secondary" style={{ justifyContent: 'space-between' }}>
              <span>🎯 Custom Topic Quiz</span>
              <span className="badge badge-indigo">Generate</span>
            </Link>
            <Link to="/tutor" className="btn btn-secondary" style={{ justifyContent: 'space-between' }}>
              <span>🤖 Interactive AI Tutor Session</span>
              <span className="badge badge-cyan">Chat</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Practice History */}
      {analytics.recentAttempts.length > 0 && (
        <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={20} color="var(--accent-amber)" />
              <h3>Recent Practice Sessions</h3>
            </div>
            <Link to="/practice" className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
              Start New Quiz
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {analytics.recentAttempts.map((attempt) => (
              <div
                key={attempt._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-color)',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '8px',
                    background: attempt.accuracy >= 70 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                    border: `1px solid ${attempt.accuracy >= 70 ? '#10b981' : '#f43f5e'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    color: attempt.accuracy >= 70 ? '#6ee7b7' : '#fda4af'
                  }}>
                    {attempt.accuracy}%
                  </div>

                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                      Solved {attempt.correctAnswers} of {attempt.totalQuestions} questions
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.15rem' }}>
                      <Calendar size={12} /> {new Date(attempt.createdAt).toLocaleDateString()}
                      <span>•</span>
                      <Clock size={12} /> {formatTime(attempt.timeSpentSeconds)}
                    </div>
                  </div>
                </div>

                <Link to="/practice" className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
                  Practice Again
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exam Selector Modal */}
      <ExamSelectorModal
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
      />
    </div>
  );
};
