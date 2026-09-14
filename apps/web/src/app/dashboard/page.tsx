'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Avatar from '../../components/Avatar';
import SkillTag from '../../components/SkillTag';
import SectionHeader from '../../components/SectionHeader';
import SearchBar from '../../components/SearchBar';
import ProjectCard from '../../components/ProjectCard';
import DiscoverTabs from '../../components/Navigation/DiscoverTabs';
import { formatPrice } from '../../lib/currency';
import { ArrowRight, Map, Folder, CircleHelp, Store, Users } from 'lucide-react';
import { useCurrentUser } from '../../components/Auth/CurrentUserProvider';
import DashboardSkeleton from '../../components/skeletons/DashboardSkeleton';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useCurrentUser();

  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [developers, setDevelopers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }
    if (!user.developerProfile) {
      router.push('/onboarding');
      return;
    }
  }, [authLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    (async () => {
      const safe = async (url: string, fallback: any) => {
        try {
          const res = await fetch(url);
          if (!res.ok) return fallback;
          return await res.json();
        } catch {
          return fallback;
        }
      };

      const [rData, pData, devData, projData, qData, mData] = await Promise.all([
        safe('/api/v1/roadmaps', []),
        safe('/api/v1/roadmaps/me', []),
        safe('/api/v1/developers/public?limit=8', { items: [] }),
        safe('/api/v1/projects?limit=6', { items: [] }),
        safe('/api/v1/questions?sort=popular&limit=5', { items: [] }),
        safe('/api/v1/marketplace', []),
      ]);

      if (cancelled) return;
      setRoadmaps(Array.isArray(rData) ? rData : []);
      setProgress(Array.isArray(pData) ? pData : []);
      setDevelopers(devData?.items ?? []);
      setProjects(projData?.items ?? []);
      setQuestions(qData?.items ?? []);
      setListings(Array.isArray(mData) ? mData : []);
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  if (authLoading || !user) {
    return <DashboardSkeleton />;
  }

  const profile = user.developerProfile;
  const firstName = (profile?.displayName || '').split(' ')[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const progressByRoadmap: Record<string, number> = {};
  progress.forEach((p: any) => {
    progressByRoadmap[p.roadmapId] = (progressByRoadmap[p.roadmapId] || 0) + 1;
  });
  const startedRoadmaps = roadmaps.filter((r) => (progressByRoadmap[r.id] || 0) > 0);
  const recommendedRoadmaps = roadmaps.filter((r) => !progressByRoadmap[r.id]).slice(0, 3);

  const handleSearch = (value: string) => {
    if (value.trim()) router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    else router.push('/search');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Greeting + search */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Avatar src={profile?.avatarUrl} name={profile?.displayName} size={52} />
          <div style={{ minWidth: 0 }}>
            <h1 className="page-title" style={{ margin: '0 0 4px 0' }}>
              {greeting}, {firstName || 'developer'}
            </h1>
            <p style={{ color: 'var(--foreground-muted)', fontSize: 14, margin: 0 }}>
              Learn. Connect. Build. Grow.
            </p>
          </div>
        </div>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search developers, projects, questions..."
          size="lg"
          onSubmit={handleSearch}
        />
      </section>

      <DiscoverTabs />

      {/* Featured developers */}
      {developers.length > 0 && (
        <section>
          <SectionHeader
            title="Featured developers"
            subtitle="People in the community to discover"
            action={
              <Link href="/developers" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                View all <ArrowRight size={15} />
              </Link>
            }
          />
          <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingTop: 16, paddingBottom: 8, scrollSnapType: 'x mandatory' }}>
            {developers.map((dev: any) => (
              <Link
                key={dev.username}
                href={`/developers/${dev.username}`}
                style={{ flex: '0 0 200px', scrollSnapAlign: 'start', textDecoration: 'none' }}
              >
                <Card padding="md" className="hover-card" style={{ height: '100%' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 8 }}>
                    <Avatar src={dev.avatarUrl} name={dev.displayName} size={56} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--foreground)' }}>{dev.displayName}</div>
                      <div style={{ fontSize: 13, color: 'var(--foreground-subtle)' }}>@{dev.username}</div>
                    </div>
                    {dev.experienceLevel && (
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--foreground-muted)', background: 'var(--surface-muted)', padding: '3px 10px', borderRadius: 'var(--radius-full)' }}>
                        {dev.experienceLevel}
                      </span>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Lower grid */}
      <div className="dashboard-lower-grid">
        {/* Main column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, minWidth: 0 }}>
          {/* Trending projects */}
          <section>
            <SectionHeader
              title="Trending projects"
              subtitle="What the community is building"
              action={
                <Link href="/projects" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  View all <ArrowRight size={15} />
                </Link>
              }
            />
            {projects.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, paddingTop: 16 }}>
                {projects.map((project: any) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <Card padding="md" style={{ marginTop: 16, textAlign: 'center', color: 'var(--foreground-muted)' }}>
                <Folder size={24} color="var(--foreground-subtle)" style={{ marginBottom: 8 }} />
                No projects yet.
              </Card>
            )}
          </section>

          {/* Popular questions */}
          <section>
            <SectionHeader
              title="Popular questions"
              subtitle="Recent discussions from the community"
              action={
                <Link href="/questions" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  View all <ArrowRight size={15} />
                </Link>
              }
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 16 }}>
              {questions.length > 0 ? (
                questions.map((q: any) => (
                  <Link key={q.id} href={`/questions/${q.id}`} style={{ textDecoration: 'none' }}>
                    <Card padding="md" className="hover-card">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <CircleHelp size={22} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--foreground)' }}>{q.title}</div>
                          <div style={{ fontSize: 13, color: 'var(--foreground-muted)', marginTop: 4 }}>
                            <strong>{q.voteScore || 0}</strong> votes · <strong>{q._count?.answers || 0}</strong> answers
                          </div>
                        </div>
                        {q.skills && q.skills.length > 0 && (
                          <div style={{ display: 'none', gap: 6 }}>
                            {q.skills.slice(0, 2).map((qs: any) => (
                              <SkillTag key={qs.skill.id} name={qs.skill.name} slug={qs.skill.slug} />
                            ))}
                          </div>
                        )}
                      </div>
                    </Card>
                  </Link>
                ))
              ) : (
                <Card padding="md" style={{ textAlign: 'center', color: 'var(--foreground-muted)' }}>
                  No questions yet.
                </Card>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* Continue learning */}
          <section>
            <SectionHeader
              title="Your learning"
              action={
                <Link href="/roadmaps" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  Explore <ArrowRight size={15} />
                </Link>
              }
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 16 }}>
              {startedRoadmaps.length > 0 ? (
                startedRoadmaps.map((r: any) => {
                  const done = progressByRoadmap[r.id] || 0;
                  const total = r._count?.nodes || 0;
                  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                  return (
                    <Link key={r.id} href={`/roadmaps/${r.slug}`} style={{ textDecoration: 'none' }}>
                      <Card padding="md" className="hover-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                          <Map size={16} color="var(--primary)" />
                          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{r.category}</span>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--foreground)', marginBottom: 10 }}>{r.title}</div>
                        <div style={{ height: 6, background: 'var(--surface-muted)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: 'var(--primary)' }} />
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--foreground-muted)', marginTop: 6 }}>
                          {done} of {total} topics
                        </div>
                      </Card>
                    </Link>
                  );
                })
              ) : recommendedRoadmaps.length > 0 ? (
                recommendedRoadmaps.slice(0, 2).map((r: any) => (
                  <Link key={r.id} href={`/roadmaps/${r.slug}`} style={{ textDecoration: 'none' }}>
                    <Card padding="md" className="hover-card">
                      <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--foreground)', marginBottom: 6 }}>{r.title}</div>
                      <p style={{ fontSize: 13, color: 'var(--foreground-muted)', margin: 0, lineHeight: 1.5 }}>{r.description}</p>
                      <div style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600, marginTop: 8 }}>{r._count?.nodes || 0} topics</div>
                    </Card>
                  </Link>
                ))
              ) : (
                <Card padding="md" style={{ textAlign: 'center', color: 'var(--foreground-muted)' }}>
                  <Map size={24} color="var(--foreground-subtle)" style={{ marginBottom: 8 }} />
                  Explore roadmaps to start learning.
                </Card>
              )}
            </div>
          </section>

          {/* Marketplace discovery */}
          <section>
            <SectionHeader
              title="Marketplace"
              action={
                <Link href="/marketplace" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  View all <ArrowRight size={15} />
                </Link>
              }
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 16 }}>
              {listings.length > 0 ? (
                listings.slice(0, 3).map((l: any) => (
                  <Link key={l.id} href={`/marketplace/${l.id}`} style={{ textDecoration: 'none' }}>
                    <Card padding="md" className="hover-card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {l.imageUrl ? (
                        <img src={l.imageUrl} alt="" style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', objectFit: 'cover', flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Store size={20} />
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="truncate" style={{ fontWeight: 600, fontSize: 14, color: 'var(--foreground)' }}>{l.title}</div>
                        <div style={{ fontSize: 13, color: 'var(--foreground-muted)', marginTop: 2 }}>{l.seller?.displayName}</div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--foreground)', flexShrink: 0 }}>
                        {formatPrice(l.price, l.currency)}
                      </div>
                    </Card>
                  </Link>
                ))
              ) : (
                <Card padding="md" style={{ textAlign: 'center', color: 'var(--foreground-muted)' }}>
                  <Store size={24} color="var(--foreground-subtle)" style={{ marginBottom: 8 }} />
                  No listings yet.
                </Card>
              )}
            </div>
          </section>

          {/* Recommended roadmaps link */}
          {recommendedRoadmaps.length > 0 && (
            <Link href="/roadmaps" style={{ textDecoration: 'none' }}>
              <Button variant="outline" fullWidth style={{ gap: 8 }}>
                <Users size={18} /> Explore more roadmaps <ArrowRight size={16} />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
