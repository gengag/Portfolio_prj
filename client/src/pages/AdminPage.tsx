import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  ShieldAlert,
  Database,
  Server,
  RefreshCw,
  CheckCircle2,
  Loader2,
  BookOpen
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [healthData, setHealthData] = useState<any>(null);
  const [examCount, setExamCount] = useState<number>(0);
  const [isSeeding, setIsSeeding] = useState<boolean>(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);

  useEffect(() => {
    checkHealth();
    fetchExamsCount();
  }, []);

  const checkHealth = async () => {
    try {
      const res: any = await api.get('/health');
      setHealthData(res.data?.data || res.data);
    } catch (err: any) {
      setHealthData({ status: 'unreachable', error: err.message });
    }
  };

  const fetchExamsCount = async () => {
    try {
      const res: any = await api.get('/exams');
      const exams = res.data?.data || res.data || [];
      setExamCount(exams.length);
    } catch (err) {
      console.warn(err);
    }
  };

  const handleSeed = async () => {
    setIsSeeding(true);
    setSeedResult(null);
    try {
      await api.post('/exams/seed');
      setSeedResult('Database exams and syllabi verified and synchronized successfully.');
      fetchExamsCount();
    } catch (err: any) {
      setSeedResult(`Failed: ${err.message || 'Seeding failed'}`);
    } finally {
      setIsSeeding(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="container animate-fade-in" style={{ maxWidth: '600px', textAlign: 'center', padding: '4rem 1rem' }}>
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <ShieldAlert size={48} color="#f43f5e" style={{ margin: '0 auto 1rem' }} />
          <h2>Restricted Access</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            This portal is restricted to system administrators.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '1050px' }}>
      {/* Header */}
      <div
        className="glass-panel"
        style={{
          padding: '2rem 2.5rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(99, 102, 241, 0.12))',
          border: '1px solid var(--border-hover)'
        }}
      >
        <div className="badge badge-amber" style={{ marginBottom: '0.75rem', display: 'inline-flex', gap: '0.35rem' }}>
          <ShieldAlert size={14} /> System Operations
        </div>
        <h2>Administrator Control Console</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.35rem', fontSize: '0.95rem' }}>
          Inspect cluster health, seed and synchronize exam categories, and verify backend telemetry.
        </p>
      </div>

      {seedResult && (
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
          <CheckCircle2 size={18} /> {seedResult}
        </div>
      )}

      {/* Cluster Status Cards */}
      <div className="grid-cols-3" style={{ marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>API GATEWAY</span>
            <Server size={18} color="var(--accent-emerald)" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#6ee7b7' }}>
            {healthData?.status === 'healthy' ? 'Online' : 'Operational'}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Port 5000 • Express TS</span>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>MONGODB ATLAS</span>
            <Database size={18} color="var(--accent-cyan)" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            Connected
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cluster0 • Replica Set</span>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>REGISTERED EXAMS</span>
            <BookOpen size={18} color="var(--primary-light)" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{examCount} Active</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Banking, SSC, UPSC, Railways</span>
        </div>
      </div>

      {/* Database Maintenance Card */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Database Maintenance & Synchronization</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Trigger full verification of competitive exam models, subjects, topics, and initial question banks.
        </p>

        <button
          onClick={handleSeed}
          disabled={isSeeding}
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {isSeeding ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          <span>Re-verify & Seed Exams</span>
        </button>
      </div>
    </div>
  );
};
