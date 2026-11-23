import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { ArrowRight } from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const handleFinish = async () => {
    try {
      // Tell the server that onboarding is done
      await api.put('/auth/me', { isOnboarded: true });
      // Update the client‑side context so subsequent checks see the new flag
      updateUser({ isOnboarded: true });
    } catch (err) {
      console.error('Failed to complete onboarding', err);
    }
    // Go to the main dashboard
    navigate('/dashboard');
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '600px', margin: '4rem auto', padding: '2rem' }}>
      <h2>Welcome{user?.name ? `, ${user.name}` : ''}!</h2>
      <p>
        This is a placeholder onboarding screen. In a real app we would ask you to:
      </p>
      <ul>
        <li>Select the exam(s) you want to study for</li>
        <li>Pick subjects or topics you care about</li>
        <li>Set study‑time preferences</li>
      </ul>
      <button className="btn btn-primary" onClick={handleFinish}>
        Finish onboarding <ArrowRight size={18} className="ml-1" />
      </button>
    </div>
  );
};

