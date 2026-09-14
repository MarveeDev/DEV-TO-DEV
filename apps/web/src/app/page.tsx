import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, Folder, CircleHelp, Map, Store } from "lucide-react";
import Button from "../components/Button";
import Card from "../components/Card";
import HomeRoadmaps from "../components/HomeRoadmaps";
import { BASE_URL } from "../lib/seo";

export const metadata: Metadata = {
  alternates: {
    canonical: BASE_URL,
  },
};

const FEATURES = [
  {
    icon: Compass,
    title: "Connect",
    description: "Find developers with complementary skills and grow your professional network.",
    href: "/developers",
    cta: "Explore developers",
  },
  {
    icon: Folder,
    title: "Build",
    description: "Showcase your projects, find collaborators, and ship with a community behind you.",
    href: "/projects",
    cta: "Browse projects",
  },
  {
    icon: Map,
    title: "Learn",
    description: "Follow structured engineering roadmaps and track your progress toward mastery.",
    href: "/roadmaps",
    cta: "Start learning",
  },
  {
    icon: CircleHelp,
    title: "Grow",
    description: "Ask and answer technical questions and grow together as a community.",
    href: "/questions",
    cta: "Join the conversation",
  },
];

const STATS = [
  { value: "10K+", label: "Developers" },
  { value: "2K+", label: "Projects" },
  { value: "5K+", label: "Problems Solved" },
  { value: "50K+", label: "Connections" },
];

export default function Home() {
  return (
    <main style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Hero */}
      <section
        style={{
          padding: '72px 24px 64px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          background: 'var(--background)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ maxWidth: 760 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: 24,
            }}
          >
            <img src="/logo.png" alt="" style={{ height: 18, width: 'auto', objectFit: 'contain' }} />
            DEV-TO-DEV
          </span>

          <h1 style={{ fontSize: 44, fontWeight: 800, color: 'var(--foreground)', lineHeight: 1.1, letterSpacing: '-0.03em', margin: '0 0 20px 0' }}>
            Learn. Connect. Build. Grow.
          </h1>

          <p style={{ fontSize: 18, color: 'var(--foreground-muted)', lineHeight: 1.6, maxWidth: 600, margin: '0 auto 36px auto' }}>
            DEV-TO-DEV is the professional network for developers. Share your projects, find collaborators with complementary skills, and track your growth.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <Button size="lg" variant="primary">
                Get Started <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/developers" style={{ textDecoration: 'none' }}>
              <Button size="lg" variant="outline">
                Explore Developers
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '48px 24px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
          {STATS.map((s) => (
            <Card key={s.label} padding="lg" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 34, fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em' }}>{s.value}</div>
              <div style={{ color: 'var(--foreground-muted)', fontWeight: 600, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>
                {s.label}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '64px 24px', background: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--foreground)', letterSpacing: '-0.02em', margin: 0 }}>Everything you need to grow</h2>
            <p style={{ color: 'var(--foreground-muted)', fontSize: 16, marginTop: 8 }}>
              One community for learning, building, and connecting.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <Link key={f.title} href={f.href} style={{ textDecoration: 'none' }}>
                  <Card padding="lg" className="hover-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                      <Icon size={22} />
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--foreground)', margin: '0 0 8px 0' }}>{f.title}</h3>
                    <p style={{ fontSize: 14, color: 'var(--foreground-muted)', lineHeight: 1.6, margin: 0, flex: 1 }}>{f.description}</p>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--primary)', fontWeight: 600, fontSize: 14, marginTop: 16 }}>
                      {f.cta} <ArrowRight size={15} />
                    </span>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <HomeRoadmaps />

      {/* Explore */}
      <section style={{ padding: '48px 24px', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--foreground)', letterSpacing: '-0.02em', margin: '0 0 8px 0' }}>
            Explore DEV-TO-DEV
          </h2>
          <p style={{ color: 'var(--foreground-muted)', fontSize: 15, margin: '0 0 24px 0' }}>
            Learn, build, and connect with the developer community.
          </p>
          <nav style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'Roadmaps', href: '/roadmaps', icon: Map },
              { label: 'Developers', href: '/developers', icon: Compass },
              { label: 'Projects', href: '/projects', icon: Folder },
              { label: 'Questions', href: '/questions', icon: CircleHelp },
              { label: 'Marketplace', href: '/marketplace', icon: Store },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 18px',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-full)',
                    color: 'var(--foreground)',
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  <Icon size={16} color="var(--primary)" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </section>
    </main>
  );
}
