import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Zap,
  BrainCircuit,
  BarChart3,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1rem' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', maxWidth: '850px', margin: '0 auto 4rem' }}>
        <div className="badge badge-indigo" style={{ marginBottom: '1.5rem', padding: '0.4rem 1rem' }}>
          <Sparkles size={14} /> AI-Powered Competitive Exam Preparation
        </div>

        <h1 style={{ fontSize: '3.25rem', lineHeight: 1.15, marginBottom: '1.5rem' }}>
          Master Your Exam with Your Personal <span className="gradient-text">AI Coach</span>
        </h1>

        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.7 }}>
          Adaptive question generation, real-time performance diagnostics, step-by-step mistake explanations, and custom RAG study plans for Banking, SSC, UPSC, and State exams.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '0.85rem 2rem' }}>
            Start Free Practice <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn btn-secondary" style={{ fontSize: '1.05rem', padding: '0.85rem 2rem' }}>
            Sign In to Dashboard
          </Link>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid-cols-3" style={{ marginBottom: '5rem' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(99, 102, 241, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem'
          }}>
            <BrainCircuit size={24} color="var(--primary-light)" />
          </div>
          <h3 style={{ marginBottom: '0.75rem' }}>Dynamic AI Quizzes</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Structured exam-standard questions generated on-the-fly, tuned strictly to your target exam, subject, and weak topics.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(6, 182, 212, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem'
          }}>
            <Zap size={24} color="var(--accent-cyan)" />
          </div>
          <h3 style={{ marginBottom: '0.75rem' }}>Deep Mistake Diagnostics</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Don't just see the answer. Get 6-step beginner-friendly AI explanations detailing exactly why your option was incorrect.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(16, 185, 129, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem'
          }}>
            <BarChart3 size={24} color="var(--accent-emerald)" />
          </div>
          <h3 style={{ marginBottom: '0.75rem' }}>Real Analytics & Weak Spots</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Deterministic accuracy tracking pinpointing weak concepts without fluff, creating automated targeted practice sets.
          </p>
        </div>
      </div>

      {/* Target Exams Banner */}
      <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', border: '1px solid var(--border-hover)' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Supported Exam Categories</h3>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {['Banking (IBPS / SBI PO)', 'Staff Selection (SSC CGL / CHSL)', 'Civil Services (UPSC Prelims)', 'Railways (RRB NTPC)', 'State PSCs'].map((exam) => (
            <div key={exam} className="badge badge-indigo" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>
              <CheckCircle2 size={16} color="var(--primary-light)" /> {exam}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
