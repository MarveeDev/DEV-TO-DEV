'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import Link from 'next/link';
import BackButton from '../../components/Navigation/BackButton';
import DiscoverTabs from '../../components/Navigation/DiscoverTabs';
import Select from '../../components/Select';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'active', label: 'Most Active' },
  { value: 'popular', label: 'Popular' },
];

export default function QuestionsPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('newest');

  const fetchQuestions = (searchQuery = '', filterQuery = '', sortQuery = '') => {
    setLoading(true);
    let url = '/api/v1/questions?limit=20';
    if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
    if (filterQuery) url += `&filter=${encodeURIComponent(filterQuery)}`;
    if (sortQuery) url += `&sort=${encodeURIComponent(sortQuery)}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setQuestions(data.items || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchQuestions(search, filter, sort);
  }, [search, filter, sort]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header */}
      <section style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '-8px' }}>
        <div className="page-header">
          <BackButton fallback="/dashboard" />
          <div className="page-header-content">
            <h1 className="text-wrap-safe" style={{ fontSize: '32px', fontWeight: 800, color: 'var(--foreground)', margin: '0 0 8px 0' }}>
              Questions
            </h1>
            <p style={{ color: 'var(--foreground-muted)', fontSize: '16px', margin: 0 }}>Solve problems. Share knowledge. Grow together.</p>
          </div>
        </div>
        <Button variant="primary" onClick={() => router.push('/questions/ask')}>Ask Question</Button>
      </section>

      <DiscoverTabs />

      {/* Filters */}
      <section style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            fontSize: '14px',
            flexGrow: 1,
            maxWidth: '300px',
            outline: 'none',
            background: 'var(--card-bg)',
            color: 'var(--foreground)'
          }}
        />
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          <Button size="sm" variant={filter === '' && sort !== 'popular' ? 'primary' : 'outline'} onClick={() => { setFilter(''); setSort('newest'); }}>All</Button>
          <Button size="sm" variant={filter === 'unanswered' ? 'primary' : 'outline'} onClick={() => setFilter('unanswered')}>Unanswered</Button>
          <Button size="sm" variant={filter === 'answered' ? 'primary' : 'outline'} onClick={() => setFilter('answered')}>Answered</Button>
          <Button size="sm" variant={sort === 'popular' ? 'primary' : 'outline'} onClick={() => { setFilter(''); setSort('popular'); }}>Popular</Button>
        </div>
        
        <Select
          id="questions-sort"
          label="Sort by:"
          options={SORT_OPTIONS}
          value={sort}
          onChange={(v) => setSort(v)}
          style={{ marginLeft: 'auto' }}
        />
      </section>

      {/* Questions List */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--foreground-muted)' }}>Loading questions...</div>
      ) : questions.length === 0 ? (
        <Card padding="lg" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '8px' }}>No questions found</h3>
          <p style={{ color: 'var(--foreground-muted)', marginBottom: '24px' }}>There are no questions matching your criteria.</p>
          <Button variant="primary" onClick={() => router.push('/questions/ask')}>Ask the first question</Button>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {questions.map(question => (
            <Link key={question.id} href={`/questions/${question.id}`} style={{ textDecoration: 'none' }}>
              <Card padding="md" style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                border: '1px solid var(--border)'
              }} className="hover-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--primary)', margin: 0, lineHeight: 1.4 }}>
                    {question.title}
                  </h3>
                  {(question.acceptedAnswerId || question.resolvedAt) && (
                    <Badge variant="primary">{question.acceptedAnswerId ? 'Answered' : 'Resolved'}</Badge>
                  )}
                </div>
                
                <p style={{ 
                  color: 'var(--foreground-muted)', 
                  margin: 0, 
                  fontSize: '14px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {question.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {question.skills?.map((qs: any) => (
                    <Badge 
                      key={qs.skill.id} 
                      variant="default" 
                      style={{ cursor: 'pointer' }}
                      onClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.push(`/skills/${qs.skill.slug || qs.skill.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
                      }}
                    >
                      {qs.skill.name}
                    </Badge>
                  ))}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '16px', color: 'var(--foreground-muted)', fontSize: '13px' }}>
                    <span><strong>{question.voteScore || 0}</strong> votes</span>
                    <span><strong>{question._count?.answers || 0}</strong> answers</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--foreground-muted)' }}>
                    {question.author?.avatarUrl ? (
                      <img src={question.author.avatarUrl} alt={question.author.displayName} style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
                    ) : (
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--border)' }} />
                    )}
                    <span>@{question.author?.username}</span>
                    <span>• {new Date(question.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
      
      <style>{`
        .hover-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
      `}</style>
    </div>
  );
}
