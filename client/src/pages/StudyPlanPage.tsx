import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  PlayCircle,
  BookOpen,
  ArrowRight,
  ListTodo
} from 'lucide-react';

export const StudyPlanPage: React.FC = () => {
  const { user } = useAuth();
  const examName = user?.selectedExam?.name || 'Competitive Exams';

  const [completedDays, setCompletedDays] = useState<number[]>([1, 2]);

  const scheduleDays = [
    {
      day: 1,
      subject: 'Quantitative Aptitude',
      topic: 'Simplification, BODMAS & Approximations',
      targetQuestions: 30,
      duration: '45 mins',
      status: 'Completed'
    },
    {
      day: 2,
      subject: 'Reasoning Ability',
      topic: 'Syllogism Fundamentals & "Only a few" rules',
      targetQuestions: 25,
      duration: '40 mins',
      status: 'Completed'
    },
    {
      day: 3,
      subject: 'English Language',
      topic: 'Subject-Verb Agreement & Error Spotting Rules',
      targetQuestions: 30,
      duration: '35 mins',
      status: 'Active Today'
    },
    {
      day: 4,
      subject: 'Quantitative Aptitude',
      topic: 'Missing & Wrong Number Series Patterns',
      targetQuestions: 25,
      duration: '45 mins',
      status: 'Upcoming'
    },
    {
      day: 5,
      subject: 'Reasoning Ability',
      topic: 'Linear & Circular Seating Arrangements',
      targetQuestions: 20,
      duration: '50 mins',
      status: 'Upcoming'
    },
    {
      day: 6,
      subject: 'General & Banking Awareness',
      topic: 'RBI Monetary Policy & National Current Affairs',
      targetQuestions: 40,
      duration: '30 mins',
      status: 'Upcoming'
    },
    {
      day: 7,
      subject: 'Weekly Review',
      topic: 'Full-Length Mini Mock & Mistake Analysis',
      targetQuestions: 50,
      duration: '60 mins',
      status: 'Upcoming'
    }
  ];

  const toggleDay = (day: number) => {
    setCompletedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '1050px' }}>
      {/* Header Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '2rem 2.5rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(16, 185, 129, 0.12))',
          border: '1px solid var(--border-hover)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div className="badge badge-indigo" style={{ marginBottom: '0.75rem', display: 'inline-flex', gap: '0.35rem' }}>
              <Sparkles size={14} /> AI Diagnostic Roadmap
            </div>
            <h2>30-Day Adaptive Study Plan</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.35rem', fontSize: '0.95rem' }}>
              Personalized syllabus progression calibrated for <strong>{examName}</strong>.
            </p>
          </div>

          <Link to="/practice" className="btn btn-primary">
            <PlayCircle size={18} /> Today's Practice Session
          </Link>
        </div>
      </div>

      {/* Plan Progress Header */}
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ListTodo size={24} color="var(--accent-cyan)" />
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem' }}>
              Week 1: Core Foundation & High-Weightage Speed Building
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              {completedDays.length} of {scheduleDays.length} milestones checked off
            </div>
          </div>
        </div>

        <div className="badge badge-cyan" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>
          Pace: On Track 🚀
        </div>
      </div>

      {/* Days Roadmap List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
        {scheduleDays.map((item) => {
          const isDone = completedDays.includes(item.day);
          return (
            <div
              key={item.day}
              className="glass-panel"
              style={{
                padding: '1.25rem 1.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                borderLeft: isDone ? '4px solid #10b981' : item.status === 'Active Today' ? '4px solid var(--accent-cyan)' : '4px solid var(--border-color)',
                background: isDone ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.02)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div
                  onClick={() => toggleDay(item.day)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    border: isDone ? '2px solid #10b981' : '2px solid var(--border-color)',
                    background: isDone ? '#10b981' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                  title="Toggle status"
                >
                  {isDone && <CheckCircle2 size={18} />}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span className="badge badge-indigo">Day {item.day}</span>
                    <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.08)' }}>
                      {item.subject}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1.05rem', color: isDone ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: isDone ? 'line-through' : 'none' }}>
                    {item.topic}
                  </h4>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <Clock size={14} /> {item.duration}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <BookOpen size={14} /> {item.targetQuestions} Questions
                </div>
                <Link to="/practice" className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
                  Start Day <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
