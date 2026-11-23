import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  X,
  Check,
  Building2,
  Briefcase,
  Landmark,
  Train,
  Award,
  BookOpen,
  ArrowRight,
  Loader2,
  Sparkles
} from 'lucide-react';

interface IExamItem {
  _id: string;
  name: string;
  code: string;
  description: string;
  category: string;
  icon?: string;
  subjectCount?: number;
}

interface ISubjectItem {
  _id: string;
  name: string;
  code: string;
  topics?: Array<{ _id: string; name: string }>;
}

interface ExamSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExamSelectorModal: React.FC<ExamSelectorModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth();

  const [exams, setExams] = useState<IExamItem[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [subjects, setSubjects] = useState<ISubjectItem[]>([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);
  const [isLoadingExams, setIsLoadingExams] = useState(false);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch available exams when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchExams();
    }
  }, [isOpen]);

  const fetchExams = async () => {
    setIsLoadingExams(true);
    setError(null);
    try {
      const res: any = await api.get('/exams');
      const data = res.data?.data || res.data || [];
      setExams(data);

      // Pre-select current user exam if existing, or first exam
      if (user?.selectedExam?.id) {
        setSelectedExamId(user.selectedExam.id);
        fetchExamSubjects(user.selectedExam.id);
      } else if (data.length > 0) {
        setSelectedExamId(data[0]._id);
        fetchExamSubjects(data[0]._id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load exams list');
    } finally {
      setIsLoadingExams(false);
    }
  };

  const fetchExamSubjects = async (examId: string) => {
    setIsLoadingSubjects(true);
    try {
      const res: any = await api.get(`/exams/${examId}`);
      const examDetails = res.data?.data || res.data;
      const loadedSubjects: ISubjectItem[] = examDetails?.subjects || [];
      setSubjects(loadedSubjects);

      // Default to all subjects checked
      const allIds = loadedSubjects.map((s) => s._id);
      setSelectedSubjectIds(allIds);
    } catch (err: any) {
      console.error('Failed to load subjects', err);
    } finally {
      setIsLoadingSubjects(false);
    }
  };

  const handleSelectExam = (examId: string) => {
    setSelectedExamId(examId);
    fetchExamSubjects(examId);
  };

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjectIds((prev) =>
      prev.includes(subjectId) ? prev.filter((id) => id !== subjectId) : [...prev, subjectId]
    );
  };

  const handleSave = async () => {
    const activeExam = exams.find((e) => e._id === selectedExamId);
    if (!activeExam) return;

    setIsSaving(true);
    setError(null);

    const activeSubjects = subjects
      .filter((s) => selectedSubjectIds.includes(s._id))
      .map((s) => ({ id: s._id, name: s.name }));

    try {
      const payload = {
        selectedExam: {
          id: activeExam._id,
          name: activeExam.name,
          code: activeExam.code
        },
        selectedSubjects: activeSubjects,
        isOnboarded: true
      };

      await api.put('/auth/me', payload);

      // Update auth context state
      updateUser(payload);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save exam selection');
    } finally {
      setIsSaving(false);
    }
  };

  const getExamIcon = (code: string) => {
    switch (code) {
      case 'BANKING':
        return <Building2 size={24} color="var(--primary-light)" />;
      case 'SSC':
        return <Briefcase size={24} color="var(--accent-cyan)" />;
      case 'UPSC':
        return <Landmark size={24} color="var(--accent-amber)" />;
      case 'RAILWAYS':
        return <Train size={24} color="var(--accent-emerald)" />;
      default:
        return <Award size={24} color="var(--primary-light)" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '800px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '2rem',
          position: 'relative',
          border: '1px solid var(--border-hover)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '0.25rem',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="badge badge-indigo" style={{ marginBottom: '0.5rem', display: 'inline-flex', gap: '0.35rem' }}>
            <Sparkles size={14} /> Exam Target Configuration
          </div>
          <h2>Select Your Target Exam</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Choose the competitive exam you are preparing for. Our AI diagnostics will tune question sets and analytics strictly to this exam's syllabus.
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            color: '#fda4af',
            fontSize: '0.85rem'
          }}>
            {error}
          </div>
        )}

        {/* Modal Body - Scrollable */}
        <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.5rem', marginBottom: '1.5rem' }}>
          {isLoadingExams ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              <Loader2 size={24} className="animate-spin" style={{ marginRight: '0.5rem' }} /> Loading exams...
            </div>
          ) : (
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                1. Target Category
              </label>

              {/* Exam Options Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem',
                  marginTop: '0.75rem',
                  marginBottom: '1.75rem'
                }}
              >
                {exams.map((exam) => {
                  const isSelected = selectedExamId === exam._id;
                  return (
                    <div
                      key={exam._id}
                      onClick={() => handleSelectExam(exam._id)}
                      style={{
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        border: isSelected
                          ? '2px solid var(--primary-light)'
                          : '1px solid var(--border-color)',
                        background: isSelected
                          ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(6, 182, 212, 0.1))'
                          : 'rgba(255, 255, 255, 0.03)',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{
                          padding: '0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(255, 255, 255, 0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {getExamIcon(exam.code)}
                        </div>
                        {isSelected && (
                          <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff'
                          }}>
                            <Check size={14} />
                          </div>
                        )}
                      </div>

                      <div style={{ marginTop: '1rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                          {exam.name}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: '1.3' }}>
                          {exam.description}
                        </div>
                        <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
                          {exam.subjectCount || 4} Subjects Included
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 2. Subjects Checklist */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  2. Focus Subjects
                </label>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem', marginBottom: '0.75rem' }}>
                  You can toggle specific subjects or prepare for all of them:
                </p>

                {isLoadingSubjects ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', padding: '1rem' }}>
                    <Loader2 size={16} className="animate-spin" /> Loading syllabus subjects...
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                    {subjects.map((subject) => {
                      const isChecked = selectedSubjectIds.includes(subject._id);
                      return (
                        <div
                          key={subject._id}
                          onClick={() => toggleSubject(subject._id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.85rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            background: isChecked ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                            border: isChecked ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--border-color)',
                            cursor: 'pointer',
                            userSelect: 'none'
                          }}
                        >
                          <div style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '4px',
                            border: isChecked ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                            background: isChecked ? 'var(--primary)' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            flexShrink: 0
                          }}>
                            {isChecked && <Check size={12} />}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                            <BookOpen size={16} color={isChecked ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: isChecked ? 'var(--text-primary)' : 'var(--text-secondary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                              {subject.name}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !selectedExamId || selectedSubjectIds.length === 0}
            className="btn btn-primary"
            style={{ minWidth: '160px' }}
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                Save Target Exam <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

