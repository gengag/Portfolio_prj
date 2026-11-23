import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  BrainCircuit
} from 'lucide-react';

export const MistakesPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  // Curated high-yield diagnostic mistake collection
  const recordedMistakes = [
    {
      id: 'mistake-1',
      subject: 'Quantitative Aptitude',
      topic: 'Speed, Time and Distance',
      question: 'A train 240 m long passes a pole in 24 seconds. How long will it take to pass a platform 650 m long?',
      userAnswer: '65 seconds (Calculated 650 / 10 only)',
      correctAnswer: '89 seconds (Total distance = 240m + 650m = 890m)',
      trapExplanation: 'Exam Trap: Students frequently forget to add the train’s own length (240m) to the platform length (650m). When passing a platform or bridge, total distance is always Train Length + Platform Length.',
      difficulty: 'Medium'
    },
    {
      id: 'mistake-2',
      subject: 'Reasoning Ability',
      topic: 'Syllogisms (Only a Few)',
      question: 'Statements: Only a few books are pens. All pens are pencils. No pencil is a marker. Conclusion: Some books are not pencils.',
      userAnswer: 'Follows (Assumed "Only a few" forbids books from entering pencils)',
      correctAnswer: 'Does not follow',
      trapExplanation: 'Exam Trap: "Only a few books are pens" restricts books from being fully contained in PENS, but does NOT prevent books from overlapping or entering the larger set of PENCILS.',
      difficulty: 'Hard'
    },
    {
      id: 'mistake-3',
      subject: 'English Language',
      topic: 'Subject-Verb Agreement',
      question: 'Identify the error: "Neither of the two candidates who appeared for the interview were selected by the panel."',
      userAnswer: 'No Error',
      correctAnswer: 'Error in "were selected" -> should be "was selected"',
      trapExplanation: 'Exam Trap: Pronouns like "Neither of", "Either of", and "Each of" always take a singular verb, despite being followed by a plural noun (candidates).',
      difficulty: 'Medium'
    },
    {
      id: 'mistake-4',
      subject: 'Quantitative Aptitude',
      topic: 'Average Speed',
      question: 'A car travels from City A to B at 40 km/h and returns at 60 km/h. What is the average speed?',
      userAnswer: '50 km/h (Arithmetic Average (40+60)/2)',
      correctAnswer: '48 km/h (Harmonic Mean: 2*40*60 / (40+60))',
      trapExplanation: 'Exam Trap: Since distance is constant, time spent at slower speed is higher! You must use the harmonic mean formula 2xy/(x+y).',
      difficulty: 'Easy'
    }
  ];

  const filteredMistakes = recordedMistakes.filter((m) => {
    if (selectedSubject === 'all') return true;
    return m.subject.toLowerCase().includes(selectedSubject.toLowerCase());
  });

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '1050px' }}>
      {/* Header Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '2rem 2.5rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.12), rgba(99, 102, 241, 0.12))',
          border: '1px solid var(--border-hover)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div className="badge badge-rose" style={{ marginBottom: '0.75rem', display: 'inline-flex', gap: '0.35rem' }}>
              <AlertTriangle size={14} /> Weak Spot Diagnostics
            </div>
            <h2>My Mistake Notebook</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.35rem', fontSize: '0.95rem' }}>
              AI tracks questions and traps you missed so you never repeat the same error in <strong>{user?.selectedExam?.name || 'the actual exam'}</strong>.
            </p>
          </div>

          <Link to="/practice" className="btn btn-primary" style={{ padding: '0.75rem 1.25rem' }}>
            <RotateCcw size={18} /> Retry Weak Topics Quiz
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {[
          { id: 'all', label: 'All Mistakes' },
          { id: 'quantitative', label: 'Quantitative Aptitude' },
          { id: 'reasoning', label: 'Reasoning Ability' },
          { id: 'english', label: 'English Language' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedSubject(tab.id)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: selectedSubject === tab.id ? '2px solid var(--accent-rose)' : '1px solid var(--border-color)',
              background: selectedSubject === tab.id ? 'rgba(244, 63, 94, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              color: selectedSubject === tab.id ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Mistakes Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
        {filteredMistakes.map((item) => (
          <div
            key={item.id}
            className="glass-panel"
            style={{
              padding: '2rem',
              borderLeft: '4px solid #f43f5e'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-indigo">{item.subject}</span>
                <span className="badge badge-cyan">{item.topic}</span>
              </div>
              <span className="badge badge-rose">{item.difficulty} Trap</span>
            </div>

            <h3 style={{ fontSize: '1.15rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
              {item.question}
            </h3>

            {/* Answer Comparison */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                fontSize: '0.9rem',
                color: '#fda4af'
              }}>
                <div style={{ fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <XCircle size={16} /> What You Answered:
                </div>
                {item.userAnswer}
              </div>

              <div style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                fontSize: '0.9rem',
                color: '#6ee7b7'
              }}>
                <div style={{ fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={16} /> Correct Solution:
                </div>
                {item.correctAnswer}
              </div>
            </div>

            {/* AI Explanation / Trap Analysis */}
            <div style={{
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.5'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '0.35rem' }}>
                <BrainCircuit size={16} /> Why This Trap Occurs & How to Prevent It:
              </div>
              {item.trapExplanation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
