'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import Badge from '../../../components/Badge';
import BackButton from '../../../components/Navigation/BackButton';
import { Check, Edit, Trash, ThumbsUp, ThumbsDown } from 'lucide-react';

export default function QuestionDetailsPage() {
  const router = useRouter();
  const params = useParams();
  
  const [question, setQuestion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const [newAnswer, setNewAnswer] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  useEffect(() => {
    fetch('/api/v1/auth/session')
      .then(res => res.ok ? res.json() : null)
      .then(data => setCurrentUser(data?.user))
      .catch(() => setCurrentUser(null));
  }, []);

  const fetchQuestion = () => {
    fetch(`/api/v1/questions/${params.id}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setQuestion(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchQuestion();
  }, [params.id]);

  const handleVote = async (target: 'question' | 'answer', id: string, value: number) => {
    if (!currentUser) return router.push('/login');
    
    try {
      const endpoint = target === 'question' 
        ? `/api/v1/questions/${id}/vote` 
        : `/api/v1/answers/${id}/vote`;
        
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value })
      });
      
      if (res.ok) {
        fetchQuestion();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcceptAnswer = async (answerId: string) => {
    if (!currentUser || currentUser.id !== question?.authorId) return;
    
    try {
      const res = await fetch(`/api/v1/questions/${question.id}/answers/${answerId}/accept`, {
        method: 'POST'
      });
      if (res.ok) fetchQuestion();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveQuestion = async () => {
    if (!currentUser || currentUser.id !== question?.authorId) return;
    
    try {
      const res = await fetch(`/api/v1/questions/${question.id}/resolve`, {
        method: 'POST'
      });
      if (res.ok) fetchQuestion();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!window.confirm('Are you sure you want to delete this question? This action cannot be undone.')) return;
    
    try {
      const res = await fetch(`/api/v1/questions/${question.id}`, { method: 'DELETE' });
      if (res.ok) router.push('/questions');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAnswer = async (answerId: string) => {
    if (!window.confirm('Delete this answer?')) return;
    
    try {
      const res = await fetch(`/api/v1/answers/${answerId}`, { method: 'DELETE' });
      if (res.ok) fetchQuestion();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;
    
    setSubmittingAnswer(true);
    try {
      const res = await fetch(`/api/v1/questions/${question.id}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newAnswer })
      });
      
      if (res.ok) {
        setNewAnswer('');
        fetchQuestion();
      }
    } catch (err) {
      console.error(err);
    }
    setSubmittingAnswer(false);
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading question...</div>;
  if (!question) return <div style={{ padding: '40px' }}>Question not found.</div>;

  const isQuestionOwner = currentUser?.id === question.authorId;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '60px' }}>
      
      <div className="page-header">
        <BackButton fallback="/questions" />
        <div className="page-header-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
          <h1 className="text-wrap-safe" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--foreground)', margin: '0 0 8px 0' }}>
            {question.title}
          </h1>
          {isQuestionOwner && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {!question.resolvedAt && !question.acceptedAnswerId && (
                <Button variant="outline" size="sm" onClick={handleResolveQuestion} style={{ color: 'var(--success)', borderColor: 'var(--success)' }}>
                  <Check size={16} /> Mark Resolved
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleDeleteQuestion} style={{ color: 'var(--danger)', borderColor: 'var(--danger-light)' }}>
                <Trash size={16} /> Delete
              </Button>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {question.author?.avatarUrl ? (
            <img src={question.author.avatarUrl} alt={question.author.displayName} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
          ) : (
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--border)' }} />
          )}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <strong style={{ fontSize: '14px', color: 'var(--foreground)' }}>{question.author?.displayName}</strong>
            <span style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>@{question.author?.username} • {question.author?.experienceLevel || 'Developer'}</span>
          </div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--foreground-muted)' }}>
          Asked {new Date(question.createdAt).toLocaleDateString()}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        {/* Vote controls */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <button onClick={() => handleVote('question', question.id, 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground-muted)' }}>
            <ThumbsUp size={24} />
          </button>
          <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--foreground)' }}>{question.voteScore || 0}</span>
          <button onClick={() => handleVote('question', question.id, -1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground-muted)' }}>
            <ThumbsDown size={24} />
          </button>
        </div>
        
        {/* Main content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'var(--foreground)' }}>
            {question.description}
          </div>
          
          {question.attachments && question.attachments.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              {question.attachments.map((att: any) => (
                <div key={att.id} style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  {att.type === 'image' ? (
                    <img src={att.url} alt="Attachment" style={{ maxWidth: '100%', maxHeight: '400px', display: 'block', objectFit: 'contain' }} />
                  ) : att.type === 'video' ? (
                    <video src={att.url} controls style={{ maxWidth: '100%', maxHeight: '400px', display: 'block' }} />
                  ) : (
                    <a href={att.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '12px', background: 'var(--background)', color: 'var(--primary)', textDecoration: 'underline', fontSize: '14px' }}>
                      View Attachment
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
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
        </div>
      </div>

      {/* Answers Section */}
      <div style={{ marginTop: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '24px' }}>
          {question.answers?.length || 0} Answers
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {question.answers?.map((answer: any) => (
            <Card key={answer.id} padding="md" style={{ display: 'flex', gap: '16px', border: answer.id === question.acceptedAnswerId ? '2px solid var(--success)' : '1px solid var(--border)' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <button onClick={() => handleVote('answer', answer.id, 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground-muted)' }}>
                  <ThumbsUp size={20} />
                </button>
                <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--foreground)' }}>{answer.voteScore || 0}</span>
                <button onClick={() => handleVote('answer', answer.id, -1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground-muted)' }}>
                  <ThumbsDown size={20} />
                </button>
                
                {answer.id === question.acceptedAnswerId && (
                  <div style={{ marginTop: '8px', color: 'var(--success)' }} title="Accepted Answer">
                    <Check size={24} strokeWidth={3} />
                  </div>
                )}
                {question.resolvedAt && answer.id === question.resolvedById && (
                  <div style={{ marginTop: '8px', color: 'var(--success)' }} title="Resolved Answer">
                    <Check size={24} strokeWidth={3} />
                  </div>
                )}
              </div>
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {answer.author?.avatarUrl ? (
                      <img src={answer.author.avatarUrl} alt={answer.author.displayName} style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                    ) : (
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--border)' }} />
                    )}
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground)' }}>{answer.author?.displayName}</span>
                    <span style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>• {new Date(answer.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {isQuestionOwner && answer.id !== question.acceptedAnswerId && (
                      <Button variant="outline" size="sm" onClick={() => handleAcceptAnswer(answer.id)}>Accept</Button>
                    )}
                    {currentUser?.id === answer.authorId && (
                      <Button variant="outline" size="sm" onClick={() => handleDeleteAnswer(answer.id)} style={{ color: 'var(--danger)' }}><Trash size={14}/></Button>
                    )}
                  </div>
                </div>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5, color: 'var(--foreground)' }}>
                  {answer.content}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Answer Form */}
      <div style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Your Answer</h3>
        {currentUser ? (
          <form onSubmit={handleSubmitAnswer} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <textarea 
              value={newAnswer}
              onChange={e => setNewAnswer(e.target.value)}
              placeholder="Write your answer here..."
              required
              style={{
                width: '100%', minHeight: '150px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)',
                background: 'var(--background)', color: 'var(--foreground)', fontSize: '15px', resize: 'vertical', boxSizing: 'border-box'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="primary" type="submit" disabled={submittingAnswer || !newAnswer.trim()}>
                {submittingAnswer ? 'Posting...' : 'Post Answer'}
              </Button>
            </div>
          </form>
        ) : (
          <Card padding="md" style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--foreground-muted)', marginBottom: '16px' }}>You must be logged in to answer this question.</p>
            <Button variant="primary" onClick={() => router.push('/login')}>Log In</Button>
          </Card>
        )}
      </div>

    </div>
  );
}
