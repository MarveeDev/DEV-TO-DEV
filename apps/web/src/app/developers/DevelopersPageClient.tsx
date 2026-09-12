'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';

import DiscoverTabs from '../../components/Navigation/DiscoverTabs';
import BackButton from '../../components/Navigation/BackButton';

export default function DevelopersPageClient({ initialDevelopers }: { initialDevelopers: any[] | null }) {
  const router = useRouter();
  const [browseDevelopers, setBrowseDevelopers] = useState<any[]>(initialDevelopers ?? []);
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [mode, setMode] = useState<'RECOMMENDED' | 'SEARCH' | 'BROWSE'>('BROWSE');
  const [matches, setMatches] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBrowse = async () => {
    try {
      const res = await fetch('/api/v1/developers/public?limit=50');
      if (res.ok) {
        const data = await res.json();
        setBrowseDevelopers(data.items || []);
      }
    } catch {
      // keep existing list
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const meRes = await fetch('/api/v1/auth/me');
        if (meRes.ok) {
          setIsAuth(true);
          setMode('RECOMMENDED');
          await fetchRecommended();
        } else {
          setIsAuth(false);
          setMode('BROWSE');
          if (initialDevelopers === null) {
            await fetchBrowse();
          }
          setLoading(false);
        }
      } catch {
        setIsAuth(false);
        setMode('BROWSE');
        setLoading(false);
      }
    };
    init();
  }, []);

  const fetchRecommended = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/v1/developers/matches?limit=10');
      if (res.status === 401) {
        setIsAuth(false);
        setMode('BROWSE');
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch recommendations');
      const data = await res.json();
      setMatches(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const q = new URLSearchParams();
      if (searchQuery) {
        q.append('username', searchQuery);
        q.append('name', searchQuery);
      }
      const res = await fetch(`/api/v1/developers?${q.toString()}`);
      if (!res.ok) throw new Error('Failed to search developers');
      const data = await res.json();
      setSearchResults(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (next: 'RECOMMENDED' | 'SEARCH' | 'BROWSE') => {
    setMode(next);
    if (next === 'RECOMMENDED') fetchRecommended();
    if (next === 'SEARCH') fetchSearch();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSearch();
  };

  const handleConnect = async (username: string) => {
    try {
      const res = await fetch(`/api/v1/connections/${encodeURIComponent(username)}`, { method: 'POST' });
      if (res.ok) {
        setMatches(matches.map(m => m.developer.username === username ? { ...m, connectionStatus: 'PENDING' } : m));
        setSearchResults(searchResults.map(s => s.username === username ? { ...s, publicConnectionStatus: 'PENDING' } : s));
      } else if (res.status === 401) {
        router.push('/login');
      } else {
        alert('Failed to send connection request');
      }
    } catch {
      alert('Network error');
    }
  };

  return (
    <div>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        <div className="page-header" style={{ marginBottom: '24px' }}>
          <BackButton fallback="/dashboard" />
          <div className="page-header-content">
            <h1 className="text-wrap-safe" style={{ fontSize: '32px', fontWeight: 800, color: 'var(--foreground)' }}>Developer Discovery</h1>
            <p style={{ color: 'var(--foreground-muted)', fontSize: '16px', margin: 0 }}>
              Don&apos;t connect because you know each other. Connect because you can grow together.
            </p>
          </div>
        </div>

        <DiscoverTabs />

        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
          <button
            onClick={() => switchMode('BROWSE')}
            style={{
              padding: '8px 16px',
              background: mode === 'BROWSE' ? 'var(--foreground)' : 'transparent',
              color: mode === 'BROWSE' ? 'var(--surface)' : 'var(--foreground-muted)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Browse All
          </button>
          {isAuth && (
            <>
              <button
                onClick={() => switchMode('RECOMMENDED')}
                style={{
                  padding: '8px 16px',
                  background: mode === 'RECOMMENDED' ? 'var(--foreground)' : 'transparent',
                  color: mode === 'RECOMMENDED' ? 'var(--surface)' : 'var(--foreground-muted)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Recommended
              </button>
              <button
                onClick={() => switchMode('SEARCH')}
                style={{
                  padding: '8px 16px',
                  background: mode === 'SEARCH' ? 'var(--foreground)' : 'transparent',
                  color: mode === 'SEARCH' ? 'var(--surface)' : 'var(--foreground-muted)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Search All
              </button>
            </>
          )}
        </div>

        {error && <div style={{ padding: '12px', background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius-sm)', marginBottom: '24px', fontSize: '14px' }}>{error}</div>}

        {mode === 'SEARCH' && (
          <form onSubmit={handleSearchSubmit} style={{ marginBottom: '32px', display: 'flex', gap: '12px' }}>
            <input
              type="text"
              placeholder="Search by name or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)', borderRadius: 'var(--radius-md)', fontSize: '15px', outline: 'none' }}
            />
            <Button type="submit" size="md" variant="primary">
              Search
            </Button>
          </form>
        )}

        {mode === 'BROWSE' && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '8px' }}>Explore the developer community</h2>
            <p style={{ color: 'var(--foreground-muted)', fontSize: '14px', marginBottom: '24px' }}>Browse public developer profiles on DEV-TO-DEV.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {browseDevelopers.length === 0 ? (
                <Card style={{ textAlign: 'center', padding: '40px' }}>
                  <p style={{ color: 'var(--foreground-muted)' }}>No developers to show right now.</p>
                </Card>
              ) : (
                browseDevelopers.map(dev => (
                  <Card key={dev.username} padding="md" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      {dev.avatarUrl ? (
                        <img src={dev.avatarUrl} alt={dev.displayName} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--border)', flexShrink: 0 }}></div>
                      )}
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--foreground)', margin: '0 0 2px 0' }}>{dev.displayName}</h3>
                        <Link href={`/developers/${dev.username}`} style={{ color: 'var(--foreground-muted)', textDecoration: 'none', fontSize: '13px' }}>
                          @{dev.username}
                        </Link>
                        {dev.experienceLevel && (
                          <div style={{ marginTop: '6px' }}>
                            <Badge variant="outline">{dev.experienceLevel}</Badge>
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <Link href={`/developers/${dev.username}`} style={{ textDecoration: 'none' }}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {mode === 'RECOMMENDED' && (
          loading ? (
            <div style={{ textAlign: 'center', color: 'var(--foreground-muted)', padding: '40px' }}>Loading developers...</div>
          ) : (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '8px' }}>Developers you may grow with</h2>
              <p style={{ color: 'var(--foreground-muted)', fontSize: '14px', marginBottom: '24px' }}>Based on your skills and learning goals</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {matches.length === 0 ? (
                  <Card style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ color: 'var(--foreground-muted)' }}>No recommendations found right now. Try adding more skills and goals to your profile.</p>
                  </Card>
                ) : (
                  matches.map(match => (
                    <Card key={match.developer.id} padding="md">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--border)', flexShrink: 0 }}></div>
                          <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--foreground)', margin: '0 0 4px 0' }}>{match.developer.displayName}</h3>
                            <Link href={`/developers/${match.developer.username}`} style={{ color: 'var(--foreground-muted)', textDecoration: 'none', fontSize: '14px' }}>
                              @{match.developer.username}
                            </Link>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)' }}>{match.compatibility.score}%</div>
                          <div style={{ color: 'var(--foreground-muted)', fontSize: '12px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Compatibility</div>
                        </div>
                      </div>

                      {match.developer.bio && <p style={{ color: 'var(--foreground)', fontSize: '15px', marginBottom: '24px', lineHeight: 1.5 }}>{match.developer.bio}</p>}

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                        {match.compatibility.sharedSkills.length > 0 && (
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Shared Skills</div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              {match.compatibility.sharedSkills.map((s: string) => (
                                <Badge key={s} variant="default">{s}</Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {match.compatibility.sharedLearningGoals.length > 0 && (
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Shared Goals</div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              {match.compatibility.sharedLearningGoals.map((g: string) => (
                                <Badge key={g} variant="outline">{g}</Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {match.compatibility.complementarySkills.length > 0 && (
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Complementary</div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              {match.compatibility.complementarySkills.map((s: string) => (
                                <Badge key={s} variant="primary">{s}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <Link href={`/developers/${match.developer.username}`} style={{ textDecoration: 'none' }}>
                          <Button variant="outline">View Profile</Button>
                        </Link>
                        {match.connectionStatus === 'NONE' ? (
                          <Button onClick={() => handleConnect(match.developer.username)} variant="primary">
                            Connect
                          </Button>
                        ) : (
                          <Button variant="ghost" disabled>
                            Request Sent
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )
        )}

        {mode === 'SEARCH' && (
          loading ? (
            <div style={{ textAlign: 'center', color: 'var(--foreground-muted)', padding: '40px' }}>Loading developers...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {searchResults.length === 0 ? (
                <Card style={{ textAlign: 'center', padding: '40px' }}>
                  <p style={{ color: 'var(--foreground-muted)' }}>No developers found.</p>
                </Card>
              ) : (
                searchResults.map(dev => (
                  <Card key={dev.id} padding="md" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--border)', flexShrink: 0 }}></div>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--foreground)', margin: '0 0 2px 0' }}>{dev.displayName}</h3>
                        <Link href={`/developers/${dev.username}`} style={{ color: 'var(--foreground-muted)', textDecoration: 'none', fontSize: '13px' }}>
                          @{dev.username}
                        </Link>
                        <div style={{ marginTop: '6px' }}>
                          <Badge variant="outline">{dev.experienceLevel}</Badge>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <Link href={`/developers/${dev.username}`} style={{ textDecoration: 'none' }}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                      {(dev.publicConnectionStatus === 'NONE' || dev.publicConnectionStatus === 'REJECTED' || dev.publicConnectionStatus === 'CANCELLED') ? (
                        <Button onClick={() => handleConnect(dev.username)} variant="primary" size="sm">Connect</Button>
                      ) : dev.publicConnectionStatus === 'PENDING' ? (
                        <Button variant="ghost" size="sm" disabled>Request Sent</Button>
                      ) : dev.publicConnectionStatus === 'INCOMING_REQUEST' ? (
                        <Link href="/network" style={{ textDecoration: 'none' }}>
                          <Button variant="outline" size="sm">Respond</Button>
                        </Link>
                      ) : dev.publicConnectionStatus === 'ACCEPTED' ? (
                        <Button variant="secondary" size="sm" disabled>Connected</Button>
                      ) : null}
                    </div>
                  </Card>
                ))
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
