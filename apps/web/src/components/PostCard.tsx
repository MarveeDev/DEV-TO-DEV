import React, { useState } from 'react';
import Link from 'next/link';
import Card from './Card';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

interface PostAuthor {
  id: string;
  profile: {
    username: string;
    displayName: string;
  };
}

interface PostAttachment {
  id: string;
  url: string;
  type: string;
}

interface PostProps {
  id: string;
  title?: string;
  content: string;
  skills?: { id: string, name: string, slug?: string }[];
  attachments?: PostAttachment[];
  createdAt: string;
  author: PostAuthor;
  currentUserId?: string;
  onDelete?: (id: string) => void;
  likeCount?: number;
  likedByMe?: boolean;
}

const isImageType = (type: string) => (type || '').toLowerCase() === 'image';
const isVideoType = (type: string) => (type || '').toLowerCase() === 'video';

export default function PostCard({ id, title, content, skills, attachments, createdAt, author, currentUserId, onDelete, likeCount = 0, likedByMe = false }: PostProps) {
  const isOwner = currentUserId === author.id;
  const [liked, setLiked] = useState(likedByMe);
  const [likesCount, setLikesCount] = useState(likeCount);
  const [likePending, setLikePending] = useState(false);

  const images = (attachments || []).filter((att) => isImageType(att.type));
  const videos = (attachments || []).filter((att) => isVideoType(att.type));
  const otherAttachments = (attachments || []).filter((att) => !isImageType(att.type) && !isVideoType(att.type));

  const handleLikeToggle = async () => {
    if (likePending) return;
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikesCount(c => c + (wasLiked ? -1 : 1));
    setLikePending(true);
    try {
      const res = await fetch(`/api/v1/posts/${id}/like`, {
        method: wasLiked ? 'DELETE' : 'POST',
      });
      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data && typeof data.likeCount === 'number') {
          setLikesCount(data.likeCount);
        }
      } else {
        setLiked(wasLiked);
        setLikesCount(c => c + (wasLiked ? 1 : -1));
      }
    } catch (err) {
      setLiked(wasLiked);
      setLikesCount(c => c + (wasLiked ? 1 : -1));
    } finally {
      setLikePending(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/posts/${id}`;
    try {
      if (navigator.share) {
        await navigator.share({ url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      // share cancelled or unavailable
    }
  };

  const engagementItemStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'transparent',
    border: 'none',
    padding: '6px 10px',
    cursor: 'pointer',
    color: 'var(--foreground-muted)',
    fontSize: '13px',
    fontWeight: 600,
    textDecoration: 'none',
    borderRadius: '8px',
  };

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
        <p style={{ fontSize: '15px', color: 'var(--foreground)', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap', marginBottom: '16px' }}>
          {content}
        </p>

        {images.map(att => (
          <img
            key={att.id}
            src={att.url}
            alt="Post attachment"
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '12px', marginBottom: '16px' }}
          />
        ))}

        {videos.map(att => (
          <video
            key={att.id}
            src={att.url}
            controls
            style={{ width: '100%', height: 'auto', borderRadius: '12px', marginBottom: '16px', display: 'block' }}
          />
        ))}
      </Link>

      {otherAttachments.map(att => (
        <a
          key={att.id}
          href={att.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'block', padding: '12px', background: 'var(--background)', color: 'var(--primary)', textDecoration: 'underline', fontSize: '14px', marginBottom: '16px' }}
        >
          View Attachment
        </a>
      ))}

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--border)', marginBottom: skills && skills.length > 0 ? '12px' : '0' }}>
        <button onClick={handleLikeToggle} disabled={likePending} style={{ ...engagementItemStyle, color: liked ? 'var(--primary)' : 'var(--foreground-muted)' }}>
          <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
          <span>{liked ? 'Unlike' : 'Like'}{likesCount > 0 ? ` (${likesCount})` : ''}</span>
        </button>
        <Link href={`/posts/${id}?comments=1`} style={engagementItemStyle}>
          <MessageCircle size={18} />
          <span>Comment</span>
        </Link>
        <button onClick={handleShare} style={engagementItemStyle}>
          <Share2 size={18} />
          <span>Share</span>
        </button>
      </div>

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
                window.location.href = `/skills/${skill.slug || skill.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
              }}
            >
              {skill.name}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}
