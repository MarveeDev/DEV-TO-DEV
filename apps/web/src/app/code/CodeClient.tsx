'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Avatar from '../../components/Avatar';
import { useCurrentUser } from '../../components/Auth/CurrentUserProvider';
import { Heart, MessageCircle, Share2, RefreshCw, Clapperboard, VolumeX, Volume2, Music } from 'lucide-react';

interface CodePost {
  id: string;
  title?: string;
  content: string;
  createdAt: string;
  skills?: { id: string; name: string; slug?: string }[];
  attachments?: { id: string; url: string; type: string }[];
  backgroundSound?: { id: string; title: string; artist: string } | null;
  likeCount?: number;
  likedByMe?: boolean;
  author?: { id: string; profile?: { username?: string; displayName?: string; avatarUrl?: string | null } | null };
}

function firstVideo(post: CodePost) {
  return (post.attachments || []).find((a) => (a.type || '').toLowerCase() === 'video');
}

function skillSlug(name: string, slug?: string) {
  return slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

// Play a video with the current sound preference; if unmuted autoplay is
// rejected by the browser, fall back to muted playback without changing the
// user's global sound preference.
async function playVideoWithFallback(el: HTMLVideoElement) {
  try {
    await el.play();
  } catch {
    if (!el.muted) {
      el.muted = true;
      try {
        await el.play();
      } catch {
        // graceful failure — leave the video paused
      }
    }
  }
}

export default function CodeClient() {
  const router = useRouter();
  const { user } = useCurrentUser();

  const [posts, setPosts] = useState<CodePost[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const [activeId, setActiveId] = useState<string | null>(null);
  const videoEls = useRef<Record<string, HTMLVideoElement>>({});
  const listRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const fetchPage = useCallback(async (p: number) => {
    const res = await fetch(`/api/v1/posts?type=video&page=${p}&limit=10`);
    if (!res.ok) throw new Error('Failed to load');
    return res.json();
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchPage(1);
        if (cancelled) return;
        setPosts(data.data || []);
        setTotalPages(data.meta?.totalPages || 1);
        setPage(1);
      } catch {
        if (!cancelled) setError('Could not load CODE right now.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchPage]);

  const loadMore = useCallback(async () => {
    if (loadingMore) return;
    if (page >= totalPages) return;
    setLoadingMore(true);
    try {
      const next = page + 1;
      const data = await fetchPage(next);
      setPosts((prev) => [...prev, ...(data.data || [])]);
      setPage(next);
      setTotalPages(data.meta?.totalPages || totalPages);
    } catch {
      // keep existing; fail silently
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, page, totalPages, fetchPage]);

  // Infinite-scroll sentinel.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: '600px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  // Active-video detection: the card covering >= 50% of the viewport wins.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = (entry.target as HTMLElement).dataset.postId;
          if (!id) return;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setActiveId(id);
          }
        });
      },
      { threshold: [0.5] },
    );
    const cards = listRef.current?.querySelectorAll('[data-post-id]');
    cards?.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, [posts]);

  // Play the active video, pause the rest (single playback at a time).
  useEffect(() => {
    Object.entries(videoEls.current).forEach(([id, el]) => {
      if (id === activeId) {
        playVideoWithFallback(el);
      } else {
        el.pause();
      }
    });
  }, [activeId]);

  // Keep every video's muted state in sync with the user's sound preference.
  useEffect(() => {
    Object.values(videoEls.current).forEach((el) => {
      el.muted = isMuted;
    });
  }, [isMuted, posts]);

  const setVideoRef = (id: string) => (el: HTMLVideoElement | null) => {
    if (el) videoEls.current[id] = el;
    else delete videoEls.current[id];
  };

  const togglePlay = (id: string) => {
    const el = videoEls.current[id];
    if (!el) return;
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  };

  const handleLike = async (post: CodePost) => {
    if (!user) {
      router.push('/login');
      return;
    }
    const wasLiked = post.likedByMe;
    const optimisticCount = Math.max(0, (post.likeCount || 0) + (wasLiked ? -1 : 1));
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, likedByMe: !wasLiked, likeCount: optimisticCount } : p)),
    );
    try {
      const res = await fetch(`/api/v1/posts/${post.id}/like`, { method: wasLiked ? 'DELETE' : 'POST' });
      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data && typeof data.likeCount === 'number') {
          setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, likeCount: data.likeCount } : p)));
        }
      } else {
        setPosts((prev) =>
          prev.map((p) => (p.id === post.id ? { ...p, likedByMe: wasLiked, likeCount: post.likeCount || 0 } : p)),
        );
      }
    } catch {
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, likedByMe: wasLiked, likeCount: post.likeCount || 0 } : p)),
      );
    }
  };

  const handleShare = async (post: CodePost) => {
    const url = `${window.location.origin}/posts/${post.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title || 'CODE', url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // share cancelled or unavailable
    }
  };

  const retry = () => {
    setError('');
    setLoading(true);
    setPosts([]);
    setPage(1);
    setTotalPages(1);
    (async () => {
      try {
        const data = await fetchPage(1);
        setPosts(data.data || []);
        setTotalPages(data.meta?.totalPages || 1);
        setPage(1);
      } catch {
        setError('Could not load CODE right now.');
      } finally {
        setLoading(false);
      }
    })();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} role="status">
        <span className="sr-only">Loading CODE…</span>
        {[0, 1].map((i) => (
          <div key={i} style={{ height: '85svh', background: '#0b1220', borderRadius: 'var(--radius-lg)', position: 'relative', overflow: 'hidden' }}>
            <div className="skeleton" style={{ position: 'absolute', left: 16, bottom: 16, width: 220, height: 14 }} />
            <div className="skeleton" style={{ position: 'absolute', left: 16, bottom: 40, width: 160, height: 12 }} />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '70svh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', textAlign: 'center', padding: '24px' }}>
        <Clapperboard size={40} color="var(--foreground-subtle)" />
        <p style={{ color: 'var(--foreground-muted)', fontSize: '15px', margin: 0 }}>{error}</p>
        <button
          onClick={retry}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background: 'var(--primary)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div style={{ minHeight: '70svh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', textAlign: 'center', padding: '24px' }}>
        <Clapperboard size={40} color="var(--foreground-subtle)" />
        <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--foreground)', margin: 0 }}>No CODE videos yet.</h1>
        <p style={{ color: 'var(--foreground-muted)', fontSize: '14px', margin: 0 }}>
          Watch developers build, teach, and share.
        </p>
        <Link href="/posts/create" style={{ textDecoration: 'none', marginTop: '8px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            Share a video post
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div ref={listRef} style={{ display: 'flex', flexDirection: 'column' }}>
      {copied && (
        <div
          style={{
            position: 'fixed',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 200,
            background: 'var(--foreground)',
            color: 'var(--surface)',
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            fontWeight: 600,
            boxShadow: 'var(--shadow-md)',
          }}
        >
          Link copied
        </div>
      )}

      {posts.map((post) => {
        const video = firstVideo(post);
        if (!video) return null;
        const profile = post.author?.profile;
        const displayName = profile?.displayName || 'Unknown';
        const username = profile?.username;

        return (
          <section
            key={post.id}
            data-post-id={post.id}
            style={{
              height: '100svh',
              width: '100%',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#000',
              flexShrink: 0,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                maxWidth: 'min(100%, calc(100svh * 9 / 16))',
                background: '#000',
              }}
            >
              <video
                ref={setVideoRef(post.id)}
                src={video.url}
                muted
                playsInline
                loop
                preload="metadata"
                onClick={() => togglePlay(post.id)}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', cursor: 'pointer' }}
              />

              {/* Bottom gradient for readability */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: '55%',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0))',
                  pointerEvents: 'none',
                }}
              />

              {/* Creator + caption + skills */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  padding: '16px 72px 24px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <Link
                  href={username ? `/developers/${encodeURIComponent(username)}` : '/developers'}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '10px', alignSelf: 'flex-start', maxWidth: '100%' }}
                >
                  <Avatar src={profile?.avatarUrl} name={displayName} size={42} />
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: 'block', fontWeight: 700, fontSize: '15px', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {displayName}
                    </span>
                    {username && (
                      <span style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>@{username}</span>
                    )}
                  </span>
                </Link>

                {post.content && (
                  <p
                    style={{
                      margin: 0,
                      color: 'rgba(255,255,255,0.95)',
                      fontSize: '14px',
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {post.content}
                  </p>
                )}

                {post.backgroundSound && (
                  <Link
                    href={`/sounds/${post.backgroundSound.id}`}
                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', alignSelf: 'flex-start' }}
                  >
                    <Music size={14} color="rgba(255,255,255,0.85)" />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
                      {post.backgroundSound.title} — {post.backgroundSound.artist}
                    </span>
                  </Link>
                )}

                {post.skills && post.skills.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {post.skills.slice(0, 3).map((s) => (
                      <Link key={s.id} href={`/skills/${encodeURIComponent(skillSlug(s.name, s.slug))}`} style={{ textDecoration: 'none' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            fontSize: '12px',
                            fontWeight: 600,
                            padding: '4px 10px',
                            borderRadius: '999px',
                            background: 'rgba(255,255,255,0.16)',
                            color: '#fff',
                          }}
                        >
                          {s.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Right-side actions */}
              <div
                style={{
                  position: 'absolute',
                  right: 8,
                  bottom: 120,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '18px',
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted((m) => !m);
                  }}
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                  title={isMuted ? 'Unmute video' : 'Mute video'}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#fff' }}
                >
                  {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
                  <span style={{ fontSize: '12px', fontWeight: 700 }}>{isMuted ? 'Unmute' : 'Mute'}</span>
                </button>

                <button
                  onClick={() => handleLike(post)}
                  aria-label={post.likedByMe ? 'Unlike' : 'Like'}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: post.likedByMe ? '#f87171' : '#fff' }}
                >
                  <Heart size={28} fill={post.likedByMe ? 'currentColor' : 'none'} />
                  <span style={{ fontSize: '12px', fontWeight: 700 }}>{post.likeCount || 0}</span>
                </button>

                <Link
                  href={`/posts/${post.id}?comments=1`}
                  aria-label="Comment"
                  style={{ textDecoration: 'none', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
                >
                  <MessageCircle size={28} />
                  <span style={{ fontSize: '12px', fontWeight: 700 }}>Comment</span>
                </Link>

                <button
                  onClick={() => handleShare(post)}
                  aria-label="Share"
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#fff' }}
                >
                  <Share2 size={28} />
                  <span style={{ fontSize: '12px', fontWeight: 700 }}>Share</span>
                </button>
              </div>
            </div>
          </section>
        );
      })}

      <div ref={sentinelRef} style={{ height: 1 }} />
      {loadingMore && (
        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--foreground-muted)', fontSize: '13px' }}>
          Loading more…
        </div>
      )}
    </div>
  );
}
