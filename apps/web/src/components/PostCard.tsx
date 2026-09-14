import React, { useState } from 'react';
import Link from 'next/link';
import Card from './Card';
import Avatar from './Avatar';
import SkillTag from './SkillTag';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

interface PostAuthor {
  id: string;
  profile: {
    username: string;
    displayName: string;
    avatarUrl?: string | null;
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
    padding: '8px 12px',
    cursor: 'pointer',
    color: 'var(--foreground-muted)',
    fontSize: '13px',
    fontWeight: 600,
    textDecoration: 'none',
    borderRadius: 'var(--radius-md)',
  };

  return (
    <Card padding="md" style={{ marginBottom: 16 }}>
      {/* Author */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', minWidth: 0 }}>
          <Avatar src={author.profile.avatarUrl} name={author.profile.displayName} size={42} />
          <Link href={`/developers/${author.profile.username}`} style={{ textDecoration: 'none', color: 'inherit', minWidth: 0 }}>
            <strong className="truncate" style={{ fontSize: 15, color: 'var(--foreground)', display: 'block' }}>
              {author.profile.displayName || 'Unknown'}
            </strong>
            <span style={{ fontSize: 13, color: 'var(--foreground-subtle)' }}>
              @{author.profile.username}
            </span>
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <span style={{ fontSize: 12, color: 'var(--foreground-subtle)' }}>
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
                color: 'var(--danger)',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
                padding: 4,
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
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 10px 0', color: 'var(--foreground)', letterSpacing: '-0.01em' }}>
            {title}
          </h3>
        )}
        <p style={{ fontSize: 15, color: 'var(--foreground)', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap', marginBottom: 16 }}>
          {content}
        </p>

        {images.map(att => (
          <img
            key={att.id}
            src={att.url}
            alt="Post attachment"
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 'var(--radius-md)', marginBottom: 16 }}
          />
        ))}

        {videos.map(att => (
          <video
            key={att.id}
            src={att.url}
            controls
            style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-md)', marginBottom: 16, display: 'block' }}
          />
        ))}
      </Link>

      {otherAttachments.map(att => (
        <a
          key={att.id}
          href={att.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'block', padding: 12, background: 'var(--surface-muted)', color: 'var(--primary)', textDecoration: 'underline', fontSize: 14, marginBottom: 16, borderRadius: 'var(--radius-md)' }}
        >
          View Attachment
        </a>
      ))}

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 12, borderTop: '1px solid var(--border)', marginBottom: skills && skills.length > 0 ? 12 : 0 }}>
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
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {skills.map(skill => (
            <SkillTag key={skill.id} name={skill.name} slug={skill.slug} />
          ))}
        </div>
      )}
    </Card>
  );
}
