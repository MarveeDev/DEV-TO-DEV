'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock data to match the visual reference for the dashboard
  // This will be replaced with actual API calls in the future stages
  const stats = { projects: 12, connections: 148, solved: 34, score: 850 };

  useEffect(() => {
    fetch('/api/v1/auth/me')
      .then(res => {
        if (!res.ok) throw new Error('Unauthenticated');
        return res.json();
      })
      .then(data => {
        if (!data.developerProfile) {
          router.push('/onboarding');
        } else {
          setUser(data);
          setLoading(false);
        }
      })
      .catch(() => router.push('/login'));
  }, [router]);

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--foreground-muted)' }}>Loading your dashboard...</div>;

  const profile = user.developerProfile;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
        {/* Welcome Section */}
        <section>
          <h1 className="text-wrap-safe" style={{ fontSize: '32px', fontWeight: 800, color: 'var(--foreground)', marginBottom: '8px' }}>
            Welcome back, {profile.displayName.split(' ')[0]}
          </h1>
          <p style={{ color: 'var(--foreground-muted)', fontSize: '16px' }}>Here is what is happening in your network today.</p>
        </section>

        <div className="dashboard-stats-grid">
          
          <Card padding="md" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ color: 'var(--foreground-muted)', fontSize: '14px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Developer Score</span>
            <span style={{ fontSize: '36px', fontWeight: 800, color: 'var(--primary)' }}>{stats.score}</span>
            <span style={{ fontSize: '13px', color: 'var(--foreground-muted)' }}>Top 5% this month</span>
          </Card>
          
          <Card padding="md" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ color: 'var(--foreground-muted)', fontSize: '14px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Connections</span>
            <span style={{ fontSize: '36px', fontWeight: 800, color: 'var(--foreground)' }}>{stats.connections}</span>
            <span style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 500 }}>+12 this week</span>
          </Card>
          
          <Card padding="md" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ color: 'var(--foreground-muted)', fontSize: '14px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Projects</span>
            <span style={{ fontSize: '36px', fontWeight: 800, color: 'var(--foreground)' }}>{stats.projects}</span>
            <span style={{ fontSize: '13px', color: 'var(--foreground-muted)' }}>2 active</span>
          </Card>
          
          <Card padding="md" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ color: 'var(--foreground-muted)', fontSize: '14px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Problems Solved</span>
            <span style={{ fontSize: '36px', fontWeight: 800, color: 'var(--foreground)' }}>{stats.solved}</span>
            <span style={{ fontSize: '13px', color: 'var(--foreground-muted)' }}>Across 4 topics</span>
          </Card>

        </div>

        <div className="dashboard-lower-grid">
          
          {/* Main Content Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Recent Activity</h2>
              <Link href="/feed" style={{ color: 'var(--primary)', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>View Feed →</Link>
            </div>
            
            <Card>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--border)', flexShrink: 0 }}></div>
                  <div>
                    <p style={{ fontSize: '14px', margin: '0 0 4px 0' }}><strong style={{ color: 'var(--foreground)' }}>Alex Chen</strong> shared a new project <strong style={{ color: 'var(--foreground)' }}>dev-tools-cli</strong>.</p>
                    <span style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>2 hours ago</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--border)', flexShrink: 0 }}></div>
                  <div>
                    <p style={{ fontSize: '14px', margin: '0 0 4px 0' }}><strong style={{ color: 'var(--foreground)' }}>Sarah Jenkins</strong> answered your question about <strong style={{ color: 'var(--foreground)' }}>React Server Components</strong>.</p>
                    <span style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>5 hours ago</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--border)', flexShrink: 0 }}></div>
                  <div>
                    <p style={{ fontSize: '14px', margin: '0 0 4px 0' }}>You reached <strong style={{ color: 'var(--primary)' }}>Expert</strong> level in <strong style={{ color: 'var(--foreground)' }}>TypeScript</strong>!</p>
                    <span style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>Yesterday</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Recommended</h2>
              <Link href="/developers" style={{ color: 'var(--primary)', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>See all</Link>
            </div>
            
            <Card padding="md">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--border)', flexShrink: 0 }}></div>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 2px 0' }}>Elena Rodriguez</h4>
                      <p style={{ fontSize: '12px', color: 'var(--foreground-muted)', margin: 0 }}>Senior Go Developer</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Connect</Button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--border)', flexShrink: 0 }}></div>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 2px 0' }}>David Kim</h4>
                      <p style={{ fontSize: '12px', color: 'var(--foreground-muted)', margin: 0 }}>Platform Engineer</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Connect</Button>
                </div>
              </div>
            </Card>

            <Card padding="md" style={{ background: 'var(--primary-light)', border: '1px solid var(--primary)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--primary)', marginBottom: '8px' }}>Grow your skills</h3>
              <p style={{ fontSize: '13px', color: 'var(--foreground)', marginBottom: '16px', lineHeight: 1.5 }}>
                Based on your goals, we recommend exploring <strong>System Architecture</strong> projects this week.
              </p>
              <Link href="/projects" style={{ textDecoration: 'none' }}>
                <Button size="sm" variant="primary" fullWidth>Find Projects</Button>
              </Link>
            </Card>
          </div>

        </div>
    </div>
  );
}
