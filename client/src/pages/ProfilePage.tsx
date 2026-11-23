import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Settings,
  Target,
  Save,
  CheckCircle2,
  Loader2,
  BookOpen,
  LogOut
} from 'lucide-react';
import { ExamSelectorModal } from '../components/dashboard/ExamSelectorModal';

export const ProfilePage: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);

  const [name, setName] = useState<string>(user?.name || '');
  const [dailyHours, setDailyHours] = useState<number>(user?.dailyStudyHours || 2);
  const [targetDate, setTargetDate] = useState<string>(user?.targetDate || '');
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'advanced'>(
    user?.experienceLevel || 'intermediate'
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      const payload = {
        name,
        dailyStudyHours: dailyHours,
        targetDate,
        experienceLevel
      };

      await api.put('/auth/me', payload);
      updateUser(payload);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '850px' }}>
      {/* Header Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '2rem 2.5rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.12))',
          border: '1px solid var(--border-hover)'
        }}
      >
        <div className="badge badge-indigo" style={{ marginBottom: '0.75rem', display: 'inline-flex', gap: '0.35rem' }}>
          <Settings size={14} /> Profile & Preferences
        </div>
        <h2>Account & Study Target Settings</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.35rem', fontSize: '0.95rem' }}>
          Manage your personal study goals, target competitive exam, and diagnostic preferences.
        </p>
      </div>

      {saveSuccess && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#6ee7b7',
          fontSize: '0.9rem'
        }}>
          <CheckCircle2 size={18} /> Profile preferences saved successfully!
        </div>
      )}

      {error && (
        <div style={{
          background: 'rgba(244, 63, 94, 0.15)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.5rem',
          color: '#fda4af',
          fontSize: '0.9rem'
        }}>
          {error}
        </div>
      )}

      {/* Target Exam Configuration Card */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Target Competitive Exam
            </span>
            <h3 style={{ fontSize: '1.25rem', marginTop: '0.25rem', color: 'var(--text-primary)' }}>
              {user?.selectedExam?.name || 'No Exam Selected'}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setIsExamModalOpen(true)}
            className="btn btn-primary"
          >
            <Target size={16} /> Switch Target Exam
          </button>
        </div>

        {/* Selected Subjects */}
        {user?.selectedSubjects && user.selectedSubjects.length > 0 && (
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Focus Subjects:</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
              {user.selectedSubjects.map((sub) => (
                <span
                  key={sub.id}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.3rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <BookOpen size={12} color="var(--accent-cyan)" /> {sub.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Profile Form */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '1.5rem' }}>Study Goals & Preferences</h3>

        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="grid-cols-2">
            <div>
              <label className="input-label">Full Name</label>
              <input
                type="text"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="input-label">Email Address (Immutable)</label>
              <input
                type="email"
                className="input-field"
                value={user?.email || ''}
                disabled
                style={{ opacity: 0.7, cursor: 'not-allowed' }}
              />
            </div>
          </div>

          <div className="grid-cols-3">
            <div>
              <label className="input-label">Daily Study Target</label>
              <select
                className="input-field"
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
              >
                <option value={1}>1 Hour / day</option>
                <option value={2}>2 Hours / day (Recommended)</option>
                <option value={3}>3 Hours / day</option>
                <option value={4}>4+ Hours / day (Intensive)</option>
              </select>
            </div>

            <div>
              <label className="input-label">Target Exam Date</label>
              <input
                type="date"
                className="input-field"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
              />
            </div>

            <div>
              <label className="input-label">Preparation Level</label>
              <select
                className="input-field"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
              >
                <option value="beginner">Beginner (Starting Foundation)</option>
                <option value="intermediate">Intermediate (Solved basics)</option>
                <option value="advanced">Advanced (Speed & Mocks)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button
              type="submit"
              disabled={isSaving}
              className="btn btn-primary"
              style={{ minWidth: '160px' }}
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save size={16} /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Account Logout Card */}
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 700 }}>Log Out from this Device</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Your question progress and streak are saved to MongoDB Atlas.
          </div>
        </div>

        <button
          onClick={logout}
          className="btn btn-secondary"
          style={{ color: '#fda4af', border: '1px solid rgba(244, 63, 94, 0.3)' }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      {/* Exam Selector Modal */}
      <ExamSelectorModal
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
      />
    </div>
  );
};
