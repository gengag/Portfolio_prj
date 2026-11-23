import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  TrendingUp,
  Target,
  Clock,
  PlayCircle,
  BarChart3,
  AlertCircle
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>({
    totalAttempted: 0,
    correctAnswers: 0,
    overallAccuracy: null,
    activeMistakes: 0,
    totalTimeSpentSeconds: 0,
    recentAttempts: []
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res: any = await api.get('/quiz/analytics');
        const data = res.data?.data || res.data;
        if (data) setAnalytics(data);
      } catch (err) {
        console.warn('Analytics fetch error', err);
      }
    };
    fetchAnalytics();
  }, []);

  const subjectStats = [
    { name: 'Quantitative Aptitude', accuracy: 78, status: 'Strong', color: 'var(--accent-emerald)' },
    { name: 'Reasoning Ability', accuracy: 82, status: 'Strong', color: 'var(--accent-cyan)' },
    { name: 'English Language', accuracy: 64, status: 'Needs Practice', color: 'var(--accent-amber)' },
    { name: 'General Awareness', accuracy: 50, status: 'High Priority Focus', color: 'var(--accent-rose)' }
  ];

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '1100px' }}>
      {/* Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '2rem 2.5rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(99, 102, 241, 0.12))',
          border: '1px solid var(--border-hover)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div className="badge badge-cyan" style={{ marginBottom: '0.75rem', display: 'inline-flex', gap: '0.35rem' }}>
              <TrendingUp size={14} /> Comprehensive Performance Telemetry
            </div>
            <h2>Exam Readiness Analytics</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.35rem', fontSize: '0.95rem' }}>
              Deep accuracy tracking, subject competency distribution, and pace analysis for <strong>{user?.selectedExam?.name || 'General Exam'}</strong>.
            </p>
          </div>

          <Link to="/practice" className="btn btn-primary">
            <PlayCircle size={18} /> Take Assessment
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>OVERALL ACCURACY</span>
            <Target size={18} color="var(--primary-light)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>
            {analytics.overallAccuracy !== null ? `${analytics.overallAccuracy}%` : '-- %'}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target Benchmark: 85%</span>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>ATTEMPTED QUESTIONS</span>
            <BarChart3 size={18} color="var(--accent-emerald)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{analytics.totalAttempted}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{analytics.correctAnswers} Correctly Solved</span>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>ACTIVE STREAK</span>
            <Clock size={18} color="var(--accent-amber)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{user?.streak?.current || 0} Days</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Longest: {user?.streak?.longest || 0} Days</span>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>WEAK TRAPS LOGGED</span>
            <AlertCircle size={18} color="var(--accent-rose)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{analytics.activeMistakes}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Available in Mistake Notebook</span>
        </div>
      </div>

      {/* Subject-Wise Mastery Breakdown */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '1.5rem' }}>Subject Mastery & Competency Index</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {subjectStats.map((sub, idx) => (
            <div key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{sub.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className="badge" style={{ color: sub.color, background: 'rgba(255,255,255,0.05)' }}>
                    {sub.status}
                  </span>
                  <span style={{ fontWeight: 800, fontSize: '1rem', color: sub.color }}>{sub.accuracy}%</span>
                </div>
              </div>

              <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${sub.accuracy}%`,
                    height: '100%',
                    background: sub.color,
                    borderRadius: '4px',
                    transition: 'width 0.5s ease'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
