import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  PlayCircle,
  FileQuestion,
  Bot,
  CalendarCheck,
  TrendingUp,
  AlertTriangle,
  FileText,
  Settings,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Target
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const [isPrepHubExpanded, setIsPrepHubExpanded] = useState<boolean>(true);

  // All sidebar options organized inside the Preparation Hub section
  const prepHubItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/practice', label: 'Practice Quiz', icon: PlayCircle, badge: 'Live', badgeColor: 'badge-indigo' },
    { to: '/tutor', label: 'AI Tutor', icon: Bot, badge: 'AI', badgeColor: 'badge-cyan', highlight: true },
    { to: '/mock-tests', label: 'Mock Tests', icon: FileQuestion },
    { to: '/mistakes', label: 'My Mistakes', icon: AlertTriangle, badgeColor: 'badge-rose' },
    { to: '/performance', label: 'Analytics', icon: TrendingUp },
    { to: '/study-plan', label: 'Study Plan', icon: CalendarCheck },
    { to: '/documents', label: 'Knowledge Base', icon: FileText },
    { to: '/profile', label: 'Profile Settings', icon: Settings },
  ];

  return (
    <aside style={{
      width: '260px',
      borderRight: '1px solid var(--border-color)',
      background: 'rgba(11, 15, 25, 0.65)',
      backdropFilter: 'blur(12px)',
      padding: '1.25rem 0.85rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      minHeight: 'calc(100vh - 65px)',
      overflowY: 'auto'
    }}>
      {/* ========================================================
          PREPARATION HUB SECTION
          All options are housed inside this dedicated section
      ======================================================== */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '0.75rem 0.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem'
        }}
      >
        {/* Section Header */}
        <div
          onClick={() => setIsPrepHubExpanded((prev) => !prev)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.5rem 0.75rem',
            cursor: 'pointer',
            userSelect: 'none',
            borderRadius: 'var(--radius-md)',
            transition: 'background 0.15s ease'
          }}
          title="Toggle Preparation Hub section"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, var(--primary), var(--accent-cyan))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 8px var(--primary-glow)'
            }}>
              <GraduationCap size={14} color="#fff" />
            </div>

            <span style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
              letterSpacing: '0.06em'
            }}>
              Preparation Hub
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span
              className="badge badge-indigo"
              style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}
            >
              {prepHubItems.length}
            </span>
            {isPrepHubExpanded ? (
              <ChevronUp size={14} color="var(--text-muted)" />
            ) : (
              <ChevronDown size={14} color="var(--text-muted)" />
            )}
          </div>
        </div>

        {/* Section Options (Collapsible Container) */}
        {isPrepHubExpanded && (
          <div
            className="animate-fade-in"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              marginTop: '0.35rem',
              paddingLeft: '0.25rem',
              borderLeft: '2px solid rgba(99, 102, 241, 0.2)',
              marginLeft: '0.65rem'
            }}
          >
            {prepHubItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.6rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: isActive ? '#fff' : 'var(--text-secondary)',
                    background: isActive
                      ? item.highlight
                        ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(6, 182, 212, 0.25))'
                        : 'rgba(255, 255, 255, 0.08)'
                      : 'transparent',
                    border: isActive ? '1px solid var(--border-hover)' : '1px solid transparent',
                    transition: 'all var(--transition-fast)',
                    textDecoration: 'none'
                  })}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Icon
                      size={16}
                      color={item.highlight ? 'var(--accent-cyan)' : 'currentColor'}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`badge ${item.badgeColor || 'badge-indigo'}`}
                      style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        )}
      </div>

      {/* Target Exam Summary Footer */}
      <div
        style={{
          marginTop: 'auto',
          padding: '0.85rem 1rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-cyan)', fontSize: '0.75rem', fontWeight: 700 }}>
          <Target size={14} /> Active Target
        </div>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {user?.selectedExam?.name || 'General Competitive'}
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          {user?.selectedSubjects?.length || 4} Focus Subjects
        </div>
      </div>
    </aside>
  );
};
