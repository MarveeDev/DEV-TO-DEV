import React from 'react';
import Link from 'next/link';
import Card from './Card';
import Button from './Button';

interface PostAuthor {
  id: string;
  profile: {
    username: string;
    displayName: string;
  };
}

interface PostProps {
  id: string;
  title?: string;
  content: string;
  skills?: { id: string, name: string }[];
  attachments?: { id: string, url: string, type: string }[];
  createdAt: string;
  author: PostAuthor;
  currentUserId?: string;
  onDelete?: (id: string) => void;
}

export default function PostCard({ id, title, content, skills, attachments, createdAt, author, currentUserId, onDelete }: PostProps) {
  const isOwner = currentUserId === author.id;
  
  return (
    <Card padding="md" style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--border)', flexShrink: 0 }}></div>
          <div>
            <Link href={`/developers/${author.profile.username}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <strong style={{ fontSize: '15px', color: 'var(--foreground)', display: 'block', marginBottom: '2px' }}>
                {author.profile.displayName || 'Unknown'}
              </strong>
              <span style={{ fontSize: '13px', color: 'var(--foreground-muted)' }}>
                @{author.profile.username}
              </span>
            </Link>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>
            {new Date(createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
          {isOwner && onDelete && (
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(id);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ef4444',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
                padding: '4px'
              }}
              title="Delete post"
            >
              Delete
            </button>
          )}
        </div>
      </div>
      
      <Link href={`/posts/${id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        {title && (
          <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 12px 0', color: 'var(--foreground)' }}>
            {title}
          </h3>
        )}
        <p style={{ fontSize: '15px', color: 'var(--foreground)', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap', marginBottom: (skills && skills.length > 0) || (attachments && attachments.length > 0) ? '16px' : '0' }}>
          {content}
        </p>
        
        {attachments && attachments.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: skills && skills.length > 0 ? '16px' : '0' }}>
            {attachments.map(att => (
              <div key={att.id} style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                {att.type === 'image' ? (
                  <img src={att.url} alt="Attachment" style={{ maxWidth: '100%', maxHeight: '300px', display: 'block', objectFit: 'contain' }} />
                ) : att.type === 'video' ? (
                  <video src={att.url} controls style={{ maxWidth: '100%', maxHeight: '300px', display: 'block' }} />
                ) : (
                  <a href={att.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '12px', background: 'var(--background)', color: 'var(--primary)', textDecoration: 'underline', fontSize: '14px' }}>
                    View Attachment
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {skills && skills.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {skills.map(skill => (
              <span 
                key={skill.id} 
                style={{
                  fontSize: '12px',
                  padding: '4px 10px',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  borderRadius: '999px',
                  fontWeight: 600,
                  display: 'inline-block',
                  transition: 'all 0.1s ease',
                  cursor: 'pointer'
                }} 
                className="skill-pill"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = `/skills/${(skill as any).slug || skill.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                }}
              >
                {skill.name}
              </span>
            ))}
          </div>
        )}
      </Link>
    </Card>
  );
}
