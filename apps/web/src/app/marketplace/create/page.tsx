'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import Select from '../../../components/Select';
import { MediaUploader } from '../../../components/MediaUploader';

import { ArrowLeft } from 'lucide-react';

const CATEGORIES = [
  'Software & Source Code',
  'UI/UX Templates',
  'APIs & Developer Tools',
  'AI Tools & Prompts',
  'Courses & Ebooks',
  'Developer Services',
  'Freelance/Gigs',
  'Other',
];

export default function CreateListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: CATEGORIES[0],
    type: 'DIGITAL_PRODUCT',
    price: '0.00',
    externalUrl: '',
    imageUrl: '',
    tags: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const priceVal = parseFloat(formData.price);
      if (isNaN(priceVal) || priceVal < 0) {
        throw new Error('Invalid price');
      }

      const payload = {
        ...formData,
        price: priceVal,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        externalUrl: formData.externalUrl || undefined,
        imageUrl: formData.imageUrl || undefined
      };

      const res = await fetch('/api/v1/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to create listing');
      }

      router.push('/marketplace/my-listings');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    color: 'var(--foreground)',
    fontSize: '14px',
    outline: 'none'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '8px',
    color: 'var(--foreground)'
  };

  return (
    <div style={{ padding: '40px 24px', maxWidth: '800px', margin: '0 auto' }}>
      <button 
        onClick={() => router.back()} 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--foreground-muted)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '24px', fontSize: '14px', fontWeight: 600, padding: 0 }}
      >
        <ArrowLeft size={16} />
        Back
      </button>
      <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '24px' }}>Create Listing</h1>
      
      <Card padding="lg">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {error && (
            <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: 'var(--radius-sm)', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <div>
            <label style={labelStyle}>Title</label>
            <input 
              required
              type="text" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              style={inputStyle}
              placeholder="e.g. Next.js SaaS Template"
            />
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea 
              required
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
              placeholder="Describe your product or service..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Category</label>
              <Select 
                id="category"
                options={CATEGORIES.map(c => ({ value: c, label: c }))}
                value={formData.category}
                onChange={v => setFormData({...formData, category: v})}
                fullWidth
              />
            </div>
            <div>
              <label style={labelStyle}>Type</label>
              <Select 
                id="type"
                options={[
                  { value: 'DIGITAL_PRODUCT', label: 'Digital Product' },
                  { value: 'SERVICE', label: 'Service' }
                ]}
                value={formData.type}
                onChange={v => setFormData({...formData, type: v})}
                fullWidth
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Price ($)</label>
              <input 
                required
                type="number" 
                step="0.01"
                min="0"
                value={formData.price} 
                onChange={e => setFormData({...formData, price: e.target.value})} 
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>External/Demo URL (optional)</label>
              <input 
                type="url" 
                value={formData.externalUrl} 
                onChange={e => setFormData({...formData, externalUrl: e.target.value})} 
                style={inputStyle}
                placeholder="https://"
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Tags (comma separated)</label>
            <input 
              type="text" 
              value={formData.tags} 
              onChange={e => setFormData({...formData, tags: e.target.value})} 
              style={inputStyle}
              placeholder="react, tailwind, nodejs"
            />
          </div>

          <div>
            <label style={labelStyle}>Cover Image (optional)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <MediaUploader 
                onUploadSuccess={(_id, url) => setFormData({...formData, imageUrl: url})} 
                onError={(err) => setError(err)}
              />
              {formData.imageUrl && (
                <div style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                  <img src={formData.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Listing'}
            </Button>
          </div>

        </form>
      </Card>
    </div>
  );
}
