import Link from "next/link";
import Button from "../components/Button";
import Card from "../components/Card";

export default function Home() {
  return (
    <main style={{ minHeight: 'calc(100vh - 65px)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Hero Section */}
      <section style={{ padding: '80px 24px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: 'var(--background)' }}>
        <div style={{ maxWidth: '800px' }}>
          <h1 style={{ fontSize: '56px', fontWeight: 800, color: 'var(--foreground)', marginBottom: '24px', lineHeight: 1.1, letterSpacing: '-1px' }}>
            Connect. Build. <br/>
            <span style={{ color: 'var(--primary)' }}>Grow together.</span>
          </h1>
          
          <p style={{ fontSize: '20px', color: 'var(--foreground-muted)', marginBottom: '40px', lineHeight: 1.5, maxWidth: '600px', margin: '0 auto 40px auto' }}>
            DEV-TO-DEV is the professional network for developers. Share your projects, find collaborators with complementary skills, and track your growth.
          </p>
          
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <Button size="lg" variant="primary">Get Started</Button>
            </Link>
            <Link href="/developers" style={{ textDecoration: 'none' }}>
              <Button size="lg" variant="outline">Explore Developers</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '60px 24px', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', textAlign: 'center' }}>
          
          <Card padding="lg">
            <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px' }}>10K+</div>
            <div style={{ color: 'var(--foreground-muted)', fontWeight: 600, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Developers</div>
          </Card>
          
          <Card padding="lg">
            <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px' }}>2K+</div>
            <div style={{ color: 'var(--foreground-muted)', fontWeight: 600, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Projects</div>
          </Card>
          
          <Card padding="lg">
            <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px' }}>5K+</div>
            <div style={{ color: 'var(--foreground-muted)', fontWeight: 600, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Problems Solved</div>
          </Card>
          
          <Card padding="lg">
            <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px' }}>50K+</div>
            <div style={{ color: 'var(--foreground-muted)', fontWeight: 600, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Connections</div>
          </Card>

        </div>
      </section>

    </main>
  );
}
