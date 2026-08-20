'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search as SearchIcon, Users, Folder, HelpCircle, AlertCircle } from 'lucide-react';
import Card from '../../components/Card';
import Link from 'next/link';

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'developers' | 'projects' | 'questions'>('projects');
  
  const [results, setResults] = useState<{
    developers: any[];
    projects: any[];
    questions: any[];
  }>({ developers: [], projects: [], questions: [] });
  
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    
    try {
      const [devsRes, projectsRes, questionsRes] = await Promise.all([
        fetch(`/api/v1/developers?username=${encodeURIComponent(query)}`),
        fetch(`/api/v1/projects?search=${encodeURIComponent(query)}`),
        fetch(`/api/v1/questions?search=${encodeURIComponent(query)}`)
      ]);

      const [developers, projects, questions] = await Promise.all([
        devsRes.ok ? devsRes.json() : { data: [] },
        projectsRes.ok ? projectsRes.json() : { data: [] },
        questionsRes.ok ? questionsRes.json() : { data: [] }
      ]);

      setResults({
        // Developers endpoint returns { developers: [], meta: {} } or { data: [], meta: {} } depending on standard
        // Let's assume standard { data: [] } or raw array based on typical DEV-TO-DEV API patterns
        developers: Array.isArray(developers) ? developers : (developers.data || developers.developers || []),
        projects: Array.isArray(projects) ? projects : (projects.data || projects.projects || []),
        questions: Array.isArray(questions) ? questions : (questions.data || questions.questions || [])
      });
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'projects', label: 'Projects', icon: Folder, count: results.projects.length },
    { id: 'questions', label: 'Questions', icon: HelpCircle, count: results.questions.length },
    { id: 'developers', label: 'Developers', icon: Users, count: results.developers.length },
  ] as const;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '80px' }}>
      <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 10 }}>
        <button 
          onClick={() => router.back()} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--foreground)' }}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: 'var(--foreground)' }}>Global Search</h1>
      </div>

      <div style={{ padding: '24px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <SearchIcon size={20} color="var(--foreground-muted)" style={{ position: 'absolute', left: '16px', top: '12px' }} />
            <input 
              type="text"
              placeholder="Search projects, questions, and developers..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 48px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                background: 'var(--background)',
                color: 'var(--foreground)',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            style={{
              padding: '0 24px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--primary)',
              color: '#fff',
              border: 'none',
              fontWeight: 600,
              fontSize: '16px',
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {!hasSearched && !loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--foreground-muted)' }}>
            <SearchIcon size={48} color="var(--border)" style={{ margin: '0 auto 16px auto', display: 'block' }} />
            <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>What are you looking for?</div>
            <div style={{ fontSize: '14px' }}>Search across the DEV-TO-DEV ecosystem.</div>
            
            <div style={{ marginTop: '32px', display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--surface)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border)' }}>
              <AlertCircle size={16} color="var(--foreground-muted)" />
              <span style={{ fontSize: '13px' }}>Currently supports Projects, Questions, and Developers. Posts and Roadmaps search coming soon.</span>
            </div>
          </div>
        )}

        {hasSearched && (
          <>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '999px',
                    border: '1px solid',
                    borderColor: activeTab === tab.id ? 'var(--primary)' : 'var(--border)',
                    background: activeTab === tab.id ? 'var(--primary-light)' : 'var(--surface)',
                    color: activeTab === tab.id ? 'var(--primary)' : 'var(--foreground)',
                    fontWeight: activeTab === tab.id ? 600 : 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <tab.icon size={16} />
                  {tab.label}
                  <span style={{ 
                    background: activeTab === tab.id ? 'var(--primary)' : 'var(--border)', 
                    color: activeTab === tab.id ? '#fff' : 'var(--foreground)',
                    padding: '2px 8px', 
                    borderRadius: '999px', 
                    fontSize: '12px' 
                  }}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--foreground-muted)' }}>Searching...</div>
              ) : results[activeTab].length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--foreground-muted)' }}>
                  No {activeTab} found for "{query}".
                </div>
              ) : (
                results[activeTab].map((item: any, i) => (
                  <Card key={item.id || i} padding="md" style={{ border: '1px solid var(--border)' }}>
                    {activeTab === 'projects' && (
                      <Link href={`/projects/${item.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div style={{ fontWeight: 600, fontSize: '16px', color: 'var(--foreground)' }}>{item.title}</div>
                        <div style={{ fontSize: '14px', color: 'var(--foreground-muted)', marginTop: '4px' }}>{item.description}</div>
                      </Link>
                    )}
                    {activeTab === 'questions' && (
                      <Link href={`/questions/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div style={{ fontWeight: 600, fontSize: '16px', color: 'var(--foreground)' }}>{item.title}</div>
                        <div style={{ fontSize: '14px', color: 'var(--foreground-muted)', marginTop: '4px' }}>{item.description}</div>
                      </Link>
                    )}
                    {activeTab === 'developers' && (
                      <Link href={`/developers/${item.username}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--border)', overflow: 'hidden' }}>
                          {item.avatarUrl && <img src={item.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '16px', color: 'var(--foreground)' }}>{item.displayName || item.username}</div>
                          <div style={{ fontSize: '14px', color: 'var(--foreground-muted)' }}>@{item.username}</div>
                        </div>
                      </Link>
                    )}
                  </Card>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
