import Card from "../../components/Card";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const error = typeof resolvedSearchParams.error === 'string' ? resolvedSearchParams.error : undefined;

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 65px)', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '24px' }}>
        <Card padding="lg" style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <div style={{ width: '48px', height: '48px', background: 'var(--primary-light)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold', fontSize: '24px' }}>
              &lt;/&gt;
            </div>
          </div>
          
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--foreground)', marginBottom: '8px' }}>Welcome back</h1>
          <p style={{ color: 'var(--foreground-muted)', marginBottom: '32px', fontSize: '14px' }}>
            Log in to DEV-TO-DEV to continue growing.
          </p>

          {error && (
            <div style={{ padding: '12px', background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius-sm)', marginBottom: '24px', fontSize: '14px', textAlign: 'left', border: '1px solid #fca5a5' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <a 
              href="/api/v1/auth/github"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '12px', background: '#24292e', color: '#fff', borderRadius: 'var(--radius-md)', textDecoration: 'none', fontWeight: 600, fontSize: '14px', transition: 'opacity 0.2s' }}
            >
              Continue with GitHub
            </a>
            <a 
              href="/api/v1/auth/google"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '12px', background: 'var(--surface)', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', textDecoration: 'none', fontWeight: 600, fontSize: '14px', transition: 'background 0.2s', boxShadow: 'var(--shadow-sm)' }}
            >
              Continue with Google
            </a>
          </div>
        </Card>

        <p style={{ fontSize: '12px', color: 'var(--foreground-muted)', marginTop: '24px', textAlign: 'center' }}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
