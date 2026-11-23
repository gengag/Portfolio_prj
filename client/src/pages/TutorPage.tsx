import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  BrainCircuit,
  Send,
  Sparkles,
  Zap,
  AlertTriangle,
  Lightbulb,
  RotateCcw,
  Bot,
  User as UserIcon,
  Loader2
} from 'lucide-react';

interface IMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const TutorPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<IMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `👋 **Welcome to your personal AI Exam Coach!**\n\nI am configured for **${user?.selectedExam?.name || 'Competitive Exams'}**.\n\nYou can ask me to explain any difficult concept, share shortcut calculation tricks, analyze common exam traps, or solve specific questions. What would you like to master today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string, mode?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: IMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const chatHistory = messages.map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res: any = await api.post('/tutor/chat', {
        message: text,
        examName: user?.selectedExam?.name || 'Competitive Exams',
        subjectName: user?.selectedSubjects?.[0]?.name || 'General',
        mode: mode || 'general',
        chatHistory
      });

      const replyContent = res.data?.data?.reply || res.data?.reply || 'I am ready to help with your next question!';

      const assistantMsg: IMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: IMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ *Unable to generate response right now: ${err.message || 'Please check your connection and try again.'}*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Quick Action Buttons
  const quickActions = [
    {
      label: 'Shortcut Math Trick',
      icon: <Zap size={14} color="#f59e0b" />,
      prompt: 'Share a fast mental shortcut trick for Quantitative Aptitude.',
      mode: 'trick'
    },
    {
      label: 'Exam Traps to Avoid',
      icon: <AlertTriangle size={14} color="#f43f5e" />,
      prompt: 'What are the top traps and common mistakes students make in this exam?',
      mode: 'trap'
    },
    {
      label: 'Concept Breakdown',
      icon: <Lightbulb size={14} color="#06b6d4" />,
      prompt: 'Explain a core high-weightage concept simply with a clear example.',
      mode: 'concept'
    }
  ];

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '1000px', height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header Panel */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 2rem',
          marginBottom: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--primary), var(--accent-cyan))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px var(--primary-glow)'
            }}
          >
            <BrainCircuit size={24} color="#fff" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>AI Exam Coach Tutor</h3>
              <span className="badge badge-cyan" style={{ fontSize: '0.75rem' }}>
                <Sparkles size={12} /> Live Active
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.15rem' }}>
              Target: <strong style={{ color: 'var(--text-primary)' }}>{user?.selectedExam?.name || 'General Exam'}</strong>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() =>
              setMessages([
                {
                  id: 'welcome-reset',
                  role: 'assistant',
                  content: `Chat session reset! Ask me any question for **${user?.selectedExam?.name || 'your exam'}**.`,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
              ])
            }
            className="btn btn-secondary"
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
            title="Reset Chat"
          >
            <RotateCcw size={14} /> Clear Chat
          </button>

          <Link to="/dashboard" className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
            Dashboard
          </Link>
        </div>
      </div>

      {/* Chat Messages Feed */}
      <div
        className="glass-panel"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          marginBottom: '1rem'
        }}
      >
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                gap: '0.85rem',
                alignItems: 'flex-start',
                flexDirection: isUser ? 'row-reverse' : 'row'
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: 'var(--radius-sm)',
                  background: isUser ? 'var(--primary)' : 'rgba(6, 182, 212, 0.2)',
                  border: isUser ? 'none' : '1px solid var(--accent-cyan)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {isUser ? <UserIcon size={18} color="#fff" /> : <Bot size={18} color="var(--accent-cyan)" />}
              </div>

              {/* Message Bubble */}
              <div
                style={{
                  maxWidth: '75%',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: isUser
                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(99, 102, 241, 0.15))'
                    : 'rgba(255, 255, 255, 0.04)',
                  border: isUser ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap'
                }}
              >
                <div>{msg.content}</div>
                <div
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    textAlign: isUser ? 'right' : 'left',
                    marginTop: '0.5rem'
                  }}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(6, 182, 212, 0.2)',
                border: '1px solid var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Bot size={18} color="var(--accent-cyan)" />
            </div>
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--text-secondary)',
                fontSize: '0.85rem'
              }}
            >
              <Loader2 size={16} className="animate-spin" color="var(--accent-cyan)" /> Thinking and analyzing concepts...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Suggestions */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        {quickActions.map((action, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(action.prompt, action.mode)}
            disabled={isLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {action.icon}
            <span>{action.label}</span>
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="glass-panel" style={{ padding: '0.75rem 1rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your syllabus, shortcut tricks, or concept doubts..."
          disabled={isLoading}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '0.95rem',
            outline: 'none',
            padding: '0.4rem'
          }}
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputMessage.trim() || isLoading}
          className="btn btn-primary"
          style={{ padding: '0.6rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          <span>Send</span>
        </button>
      </div>
    </div>
  );
};

