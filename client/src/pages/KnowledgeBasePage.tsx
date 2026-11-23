import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Check,
  Copy,
  Search
} from 'lucide-react';

export const KnowledgeBasePage: React.FC = () => {
  const { user } = useAuth();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const resources = [
    {
      id: 'res-1',
      title: 'Speed Math & Percentage Splitting Shortcuts',
      category: 'Quantitative Aptitude',
      summary: 'Calculate any percentage in 5 seconds using the 10%, 5%, 1% decomposition method. Eliminates standard long multiplication.',
      content: 'Formula: 36% of 450 = (10% * 3) + (5%) + (1%) = 135 + 22.5 + 4.5 = 162. For multiplication by 25: Divide by 4 and add two zeros (e.g., 64 * 25 = 1600).',
      tag: 'Shortcut Sheet'
    },
    {
      id: 'res-2',
      title: 'Master Rules for "Only a Few" Syllogisms',
      category: 'Reasoning Ability',
      summary: 'The deterministic Venn diagram rules for "Only a Few", "Some not", and complementary pairs (Either-Or).',
      content: 'Rule: "Only a few A are B" = Both "Some A are B" AND "Some A are not B". Result: "All A can never be B", but "All B can be A" is completely valid!',
      tag: 'Logical Traps'
    },
    {
      id: 'res-3',
      title: 'Top 25 Golden Grammar Rules for Error Spotting',
      category: 'English Language',
      summary: 'Subject-verb agreement, subjunctive mood, pronoun antecedents, and inversion rules tested in competitive exams.',
      content: 'Rule: When two subjects are joined by "Neither...nor", "Either...or", the verb agrees with the CLOSER subject. When joined by "as well as", "together with", the verb agrees with the FIRST subject.',
      tag: 'Grammar Guide'
    },
    {
      id: 'res-4',
      title: 'RBI Monetary Policy & Key Rates Reference Sheet',
      category: 'General Awareness',
      summary: 'Repo Rate, Reverse Repo, MSF, CRR, SLR, and the structure of the Monetary Policy Committee (MPC).',
      content: 'Repo Rate: Rate at which RBI lends short-term money to commercial banks against government securities. Standing Deposit Facility (SDF) forms the lower bound of the policy corridor.',
      tag: 'Fact Sheet'
    }
  ];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredResources = resources.filter((res) => {
    const matchesCategory = activeCategory === 'all' || res.category.toLowerCase().includes(activeCategory.toLowerCase());
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) || res.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '1050px' }}>
      {/* Header Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '2rem 2.5rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(99, 102, 241, 0.12))',
          border: '1px solid var(--border-hover)'
        }}
      >
        <div className="badge badge-cyan" style={{ marginBottom: '0.75rem', display: 'inline-flex', gap: '0.35rem' }}>
          <BookOpen size={14} /> Exam Formula & Concept Vault
        </div>
        <h2>Knowledge Base & Cheat Sheets</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.35rem', fontSize: '0.95rem' }}>
          High-yield formula cards, shortcut tricks, and grammar rules curated for <strong>{user?.selectedExam?.name || 'Competitive Exams'}</strong>.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ flex: 1, minWidth: '280px', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 1rem' }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search formulas, shortcuts, or grammar rules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              width: '100%',
              fontSize: '0.9rem'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['all', 'Quantitative', 'Reasoning', 'English', 'General Awareness'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '0.6rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: activeCategory === cat ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                background: activeCategory === cat ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                color: activeCategory === cat ? '#fff' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              {cat === 'all' ? 'All Subjects' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="glass-panel"
            style={{
              padding: '2rem',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span className="badge badge-indigo">{res.category}</span>
                  <span className="badge badge-cyan">{res.tag}</span>
                </div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{res.title}</h3>
              </div>

              <button
                onClick={() => handleCopy(res.id, `${res.title}\n\n${res.content}`)}
                className="btn btn-secondary"
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                {copiedId === res.id ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                <span>{copiedId === res.id ? 'Copied!' : 'Copy Rule'}</span>
              </button>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
              {res.summary}
            </p>

            <div style={{
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              color: 'var(--accent-cyan)',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              lineHeight: '1.6'
            }}>
              {res.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
