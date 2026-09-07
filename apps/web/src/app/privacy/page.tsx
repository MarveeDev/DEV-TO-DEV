import LegalPage from '../../components/LegalPage';

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="September 7, 2026">
      <p className="legal-lead">
        DEV-TO-DEV (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is a professional network for developers that lets you share projects, connect with other developers, and track your learning progress. This Privacy Policy explains what personal data we collect, how we use it, and the choices available to you.
      </p>

      <h2>1. Information We Collect</h2>
      <p>We collect the information you provide to us and the limited information required to operate your account.</p>
      <ul>
        <li><strong>Account and authentication data.</strong> When you sign in with GitHub or Google, we receive your email address and a unique account identifier from that provider. We store a minimal identity record (the provider name and that identifier) together with your email address.</li>
        <li><strong>Profile data.</strong> Information you add to your developer profile, such as your username, display name, bio, avatar, location, website, GitHub URL, and experience level.</li>
        <li><strong>Skills and learning goals.</strong> The technologies and skills you select and the learning goals you set.</li>
        <li><strong>Content you create.</strong> Posts, questions, answers, projects, marketplace listings, and messages you publish on the platform.</li>
        <li><strong>Activity data.</strong> Connections you make, roadmap progress you record, and a gamification score and streak derived from your activity.</li>
        <li><strong>Media you upload.</strong> Images and videos you attach to posts or other content, which are stored using Cloudinary.</li>
        <li><strong>Session data.</strong> A session identifier stored in an HTTP-only cookie that keeps you signed in.</li>
      </ul>

      <h2>2. How We Collect Information</h2>
      <ul>
        <li><strong>Directly from you</strong> when you create an account, complete onboarding, edit your profile, or create content.</li>
        <li><strong>Automatically from your authentication provider</strong> (GitHub or Google) when you sign in.</li>
        <li><strong>Through one essential cookie</strong> used for authentication. See our <a href="/cookie-policy">Cookie Policy</a>.</li>
      </ul>

      <h2>3. How We Use Your Information</h2>
      <ul>
        <li>To create and secure your account and keep you signed in.</li>
        <li>To provide the features you use, such as connecting developers, sharing content, tracking roadmap progress, and calculating scores.</li>
        <li>To store and display the content and media you publish.</li>
        <li>To operate, maintain, and improve the service, and to protect against abuse.</li>
      </ul>
      <p>We do <strong>not</strong> sell your personal data, and we do <strong>not</strong> use it for advertising or for third-party analytics.</p>

      <h2>4. Legal Bases for Processing (EEA / UK)</h2>
      <ul>
        <li><strong>Performance of a contract</strong> — to provide your account and the features you use.</li>
        <li><strong>Legitimate interests</strong> — to secure the service, prevent misuse, and improve reliability.</li>
        <li><strong>Consent</strong> — where you choose to provide optional information or connect additional accounts.</li>
      </ul>

      <h2>5. How We Share Information</h2>
      <p>We share information only with the service providers that help us operate DEV-TO-DEV, and only to the extent needed:</p>
      <ul>
        <li><strong>GitHub and Google</strong> — to authenticate your account (they process your sign-in).</li>
        <li><strong>Cloudinary</strong> — to store and serve the images and videos you upload.</li>
        <li><strong>Database and caching infrastructure</strong> — a PostgreSQL database and a Redis cache used for account storage and session management.</li>
      </ul>
      <p>We do not share your personal data with advertisers, data brokers, or third-party analytics providers.</p>

      <h2>6. Data Retention</h2>
      <p>We keep your personal data for as long as your account is active. You can delete content you have created, and you can delete your account, which removes the associated data (subject to brief backup retention). Authentication sessions expire automatically after 14 days, and temporary sign-in state expires after 10 minutes.</p>

      <h2>7. Cookies</h2>
      <p>DEV-TO-DEV uses a single essential cookie (<code>session_id</code>) to keep you signed in. We do not use analytics, advertising, or tracking cookies. See our <a href="/cookie-policy">Cookie Policy</a> for details.</p>

      <h2>8. Your Rights</h2>
      <p>Depending on your location, you may have the right to access, correct, delete, or export your personal data, and to withdraw consent where processing is based on consent. To exercise these rights, contact the DEV-TO-DEV team through the platform.</p>

      <h2>9. Children&apos;s Privacy</h2>
      <p>DEV-TO-DEV is not directed to children under the age of 13 (or 16 in some regions), and we do not knowingly collect personal data from children. If you believe a child has provided us with personal data, contact us so we can remove it.</p>

      <h2>10. Changes to This Policy</h2>
      <p>We may update this Privacy Policy from time to time. When we make material changes, we will update the &quot;Last updated&quot; date above. Continued use of the service after changes means you accept the updated policy.</p>

      <h2>11. Contact Us</h2>
      <p>If you have questions or concerns about this Privacy Policy, please contact the DEV-TO-DEV team through the platform.</p>
    </LegalPage>
  );
}
