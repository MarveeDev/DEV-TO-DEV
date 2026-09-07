import LegalPage from '../../components/LegalPage';

export default function CookiePolicyPage() {
  return (
    <LegalPage title="Cookie Policy" updated="September 7, 2026">
      <p className="legal-lead">
        This Cookie Policy explains how DEV-TO-DEV uses cookies and similar technologies. We keep this to a minimum: DEV-TO-DEV uses a single essential cookie, and no advertising, analytics, or tracking cookies.
      </p>

      <h2>1. What Are Cookies?</h2>
      <p>Cookies are small text files stored on your device when you visit a website. They are widely used to make websites work or to remember information about your visit.</p>

      <h2>2. Cookies We Use</h2>
      <p>DEV-TO-DEV sets one cookie:</p>
      <ul>
        <li>
          <strong><code>session_id</code></strong> — an essential authentication cookie that keeps you signed in between page loads.
          <ul>
            <li><strong>Purpose:</strong> To remember that you are logged in.</li>
            <li><strong>Duration:</strong> 14 days, or until you log out.</li>
            <li><strong>Attributes:</strong> HTTP-only (not readable by scripts), sent over HTTPS in production, and limited to same-site requests (<code>SameSite=Lax</code>).</li>
          </ul>
        </li>
      </ul>
      <p>This cookie is <strong>strictly necessary</strong> to provide the signed-in experience and cannot be disabled without breaking authentication.</p>

      <h2>3. Cookies We Do Not Use</h2>
      <p>DEV-TO-DEV does <strong>not</strong> use:</p>
      <ul>
        <li>Analytics or performance cookies.</li>
        <li>Advertising, targeting, or marketing cookies.</li>
        <li>Third-party tracking cookies or pixels.</li>
      </ul>

      <h2>4. Cookie Consent</h2>
      <p>When you first visit, we show a consent banner. Because DEV-TO-DEV only uses essential cookies, your choice is primarily recorded for transparency:</p>
      <ul>
        <li><strong>Accept All</strong> — accepts all cookies (currently only the essential <code>session_id</code>).</li>
        <li><strong>Reject Non-Essential</strong> — rejects any non-essential cookies (none are currently used).</li>
        <li><strong>Cookie Settings</strong> — lets you review the cookies we use.</li>
      </ul>
      <p>Your consent preference is stored locally in your browser (local storage), not in a cookie.</p>

      <h2>5. Managing Cookies</h2>
      <p>You can control cookies through your browser settings, where you can view, block, or delete cookies for any site. Blocking the <code>session_id</code> cookie will prevent you from staying signed in to DEV-TO-DEV.</p>

      <h2>6. Changes to This Policy</h2>
      <p>We may update this Cookie Policy from time to time. Changes will be reflected by the &quot;Last updated&quot; date above.</p>

      <h2>7. Contact</h2>
      <p>If you have questions about this Cookie Policy, please contact the DEV-TO-DEV team through the platform.</p>
    </LegalPage>
  );
}
