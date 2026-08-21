'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Select from '../../components/Select';
import Card from '../../components/Card';
import Button from '../../components/Button';

const EXPERIENCE_OPTIONS = [
  { value: 'BEGINNER', label: 'Beginner (0–2 years)' },
  { value: 'INTERMEDIATE', label: 'Intermediate (2–5 years)' },
  { value: 'ADVANCED', label: 'Advanced (5–8 years)' },
  { value: 'EXPERT', label: 'Expert (8+ years)' },
];

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    location: '',
    websiteUrl: '',
    githubUrl: '',
    experienceLevel: 'INTERMEDIATE',
  });

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/v1/profile/me');
      if (res.ok) {
        const data = await res.json();
        setFormData({
          displayName: data.displayName || '',
          bio: '',
          location: data.location || '',
          websiteUrl: data.websiteUrl || '',
          githubUrl: data.githubUrl || '',
          experienceLevel: data.experienceLevel || 'INTERMEDIATE',
        });
      } else {
        setMessage({ type: 'error', text: 'Failed to load profile data.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An error occurred loading profile.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const payload = { ...formData };
      if (!payload.bio) {
        delete (payload as any).bio;
      }

      const res = await fetch('/api/v1/profile/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        await fetchProfile(); // Reload data to confirm persistence
      } else {
        setMessage({ type: 'error', text: 'Failed to update profile.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An error occurred saving profile.' });
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: '14px', outline: 'none' };
  const labelStyle = { display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '14px', color: 'var(--foreground)' };

  if (loading) {
    return (
      <div style={{ padding: '40px 24px', display: 'flex', justifyContent: 'center' }}>
        <p style={{ color: 'var(--foreground-muted)' }}>Loading settings...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 24px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--foreground)', marginBottom: '8px' }}>Settings</h1>
          <p style={{ color: 'var(--foreground-muted)', fontSize: '16px' }}>Manage your profile and account preferences.</p>
        </div>

        <Card padding="lg">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {message && (
              <div style={{ 
                padding: '12px 16px', 
                borderRadius: 'var(--radius-md)', 
                background: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                color: message.type === 'success' ? '#15803d' : '#b91c1c',
                border: message.type === 'success' ? '1px solid #bbf7d0' : '1px solid #fecaca'
              }}>
                {message.text}
              </div>
            )}

            <div>
              <label style={labelStyle}>Display Name <span style={{color: 'red'}}>*</span></label>
              <input required type="text" value={formData.displayName} onChange={e => setFormData({...formData, displayName: e.target.value})} style={inputStyle} placeholder="John Doe" />
            </div>

            <div>
              <label style={labelStyle}>Professional Headline / Bio</label>
              <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} placeholder="Tell people about yourself..."></textarea>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Location</label>
                <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} style={inputStyle} placeholder="San Francisco, CA" />
              </div>
              <div>
                <label style={labelStyle}>Experience Level</label>
                <Select
                  id="settings-experience"
                  options={EXPERIENCE_OPTIONS}
                  value={formData.experienceLevel}
                  onChange={(v) => setFormData({ ...formData, experienceLevel: v })}
                  fullWidth
                />
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '8px 0' }} />

            <div>
              <label style={labelStyle}>Website URL</label>
              <input type="url" value={formData.websiteUrl} onChange={e => setFormData({...formData, websiteUrl: e.target.value})} style={inputStyle} placeholder="https://yourportfolio.com" />
            </div>

            <div>
              <label style={labelStyle}>GitHub URL</label>
              <input type="url" value={formData.githubUrl} onChange={e => setFormData({...formData, githubUrl: e.target.value})} style={inputStyle} placeholder="https://github.com/yourusername" />
            </div>

            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" size="lg" variant="primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
