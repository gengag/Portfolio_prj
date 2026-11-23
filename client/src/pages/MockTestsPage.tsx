import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FileQuestion,
  Clock,
  Award,
  AlertCircle,
  PlayCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const MockTestsPage: React.FC = () => {
  const { user } = useAuth();
  const examName = user?.selectedExam?.name || 'Competitive Exams';

  const mockTests = [
    {
      id: 'mock-full-1',
      title: `${examName} Full-Length Mock 1`,
      type: 'Full Length Simulator',
      duration: '60 Mins',
      questions: 100,
      marks: 100,
      negativeMarking: '-0.25 per wrong answer',
      difficulty: 'Exam Standard',
      status: 'Ready',
      tagColor: 'badge-indigo'
    },
    {
      id: 'mock-quant-1',
      title: 'Quantitative Aptitude Sectional Sprint',
      type: 'Sectional Speed Test',
      duration: '20 Mins',
      questions: 35,
      marks: 35,
      negativeMarking: '-0.25 per wrong answer',
      difficulty: 'High Speed',
      status: 'Ready',
      tagColor: 'badge-cyan'
    },
    {
      id: 'mock-reas-1',
      title: 'Reasoning Ability & Puzzle Challenge',
      type: 'Sectional Speed Test',
      duration: '20 Mins',
      questions: 35,
      marks: 35,
      negativeMarking: '-0.25 per wrong answer',
      difficulty: 'Tricky / Analytical',
      status: 'Ready',
      tagColor: 'badge-amber'
    },
    {
      id: 'mock-eng-1',
      title: 'English Comprehension & Grammar Sprint',
      type: 'Sectional Speed Test',
      duration: '20 Mins',
      questions: 30,
      marks: 30,
      negativeMarking: '-0.25 per wrong answer',
      difficulty: 'Standard',
      status: 'Ready',
      tagColor: 'badge-emerald'
    }
  ];

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '1100px' }}>
      {/* Header Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '2rem 2.5rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.1))',
          border: '1px solid var(--border-hover)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div className="badge badge-indigo" style={{ marginBottom: '0.75rem', display: 'inline-flex', gap: '0.35rem' }}>
              <Sparkles size={14} /> Official Pattern Simulation
            </div>
            <h2>Full-Length & Sectional Mock Tests</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.35rem', fontSize: '0.95rem' }}>
              Timed simulations with strict negative marking rules calibrated for <strong>{examName}</strong>.
            </p>
          </div>

          <Link to="/practice" className="btn btn-primary" style={{ padding: '0.75rem 1.25rem' }}>
            <PlayCircle size={18} /> Quick Practice Mode
          </Link>
        </div>
      </div>

      {/* Rules & Scoring Notice */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.25)'
        }}
      >
        <ShieldCheck size={28} color="#f59e0b" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          <strong style={{ color: '#fbbf24' }}>Official Marking Protocol:</strong> Correct answer = <strong>+1.0 mark</strong>. Incorrect answer = <strong>-0.25 mark penalty</strong>. Unattempted = 0. Sectional timers will automatically submit when time expires.
        </div>
      </div>

      {/* Mock Tests Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {mockTests.map((test) => (
          <div
            key={test.id}
            className="glass-panel"
            style={{
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1.25rem',
              border: '1px solid var(--border-color)',
              transition: 'transform 0.2s ease, border-color 0.2s ease'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span className={`badge ${test.tagColor}`}>{test.type}</span>
                <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7' }}>
                  {test.status}
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', lineHeight: '1.4', marginBottom: '0.75rem' }}>
                {test.title}
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={14} color="var(--accent-amber)" /> {test.duration}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FileQuestion size={14} color="var(--accent-cyan)" /> {test.questions} Questions
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Award size={14} color="var(--primary-light)" /> {test.marks} Marks
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <AlertCircle size={14} color="var(--accent-rose)" /> {test.negativeMarking}
                </div>
              </div>
            </div>

            <Link
              to="/practice"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
            >
              <span>Begin Mock Test</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
