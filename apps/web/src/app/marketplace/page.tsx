'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Select from '../../components/Select';
import { Search } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Software & Source Code',
  'UI/UX Templates',
  'APIs & Developer Tools',
  'AI Tools & Prompts',
  'Courses & Ebooks',
  'Developer Services',
  'Freelance/Gigs',
  'Other',
];

const TYPES = ['All', 'DIGITAL_PRODUCT', 'SERVICE'];

export default function MarketplacePage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [type, setType] = useState('All');

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category && category !== 'All') params.append('category', category);
      if (type && type !== 'All') params.append('type', type);

      const res = await fetch(`/api/v1/marketplace?${params.toString()}`);
      if (res.ok) {
        setListings(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchListings();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, category, type]);

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--foreground)', marginBottom: '8px' }}>Marketplace</h1>
          <p style={{ color: 'var(--foreground-muted)', fontSize: '16px' }}>Discover developer tools, templates, and services.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/marketplace/my-listings" style={{ textDecoration: 'none' }}>
            <Button variant="outline">My Listings</Button>
          </Link>
          <Link href="/marketplace/create" style={{ textDecoration: 'none' }}>
            <Button variant="primary">Create Listing</Button>
          </Link>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 100%', minWidth: '260px', position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--foreground-muted)' }} />
          <input 
            type="text" 
            placeholder="Search marketplace..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ 
              width: '100%', padding: '10px 12px 10px 40px', 
              border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', 
              background: 'var(--surface)', color: 'var(--foreground)', 
              fontSize: '14px', outline: 'none' 
            }} 
          />
        </div>
        <div style={{ flex: '1 1 calc(50% - 8px)', minWidth: '140px' }}>
          <Select 
            id="category-filter"
            options={CATEGORIES.map(c => ({ value: c, label: c === 'All' ? 'All Categories' : c }))}
            value={category}
            onChange={setCategory}
            fullWidth
          />
        </div>
        <div style={{ flex: '1 1 calc(50% - 8px)', minWidth: '140px' }}>
          <Select 
            id="type-filter"
            options={TYPES.map(t => ({ value: t, label: t === 'All' ? 'All Types' : (t === 'DIGITAL_PRODUCT' ? 'Digital Product' : 'Service') }))}
            value={type}
            onChange={setType}
            fullWidth
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--foreground-muted)' }}>Loading...</div>
      ) : listings.length === 0 ? (
        <Card padding="lg">
          <div style={{ textAlign: 'center', color: 'var(--foreground-muted)' }}>
            <p>No listings found matching your criteria.</p>
          </div>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {listings.map(listing => (
            <Link key={listing.id} href={`/marketplace/${listing.id}`} style={{ textDecoration: 'none' }}>
              <Card padding="md" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {listing.imageUrl && (
                  <div style={{ width: '100%', height: '160px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: '16px' }}>
                    <img src={listing.imageUrl} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)', background: 'var(--primary-light)', padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}>
                    {listing.type === 'DIGITAL_PRODUCT' ? 'Digital Product' : 'Service'}
                  </span>
                  <span style={{ fontWeight: 700, color: 'var(--foreground)' }}>
                    ${listing.price.toFixed(2)}
                  </span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '8px' }}>
                  {listing.title}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--foreground-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1, marginBottom: '16px' }}>
                  {listing.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                  {listing.seller.avatarUrl ? (
                    <img src={listing.seller.avatarUrl} alt={listing.seller.displayName} style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                  ) : (
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--border)' }} />
                  )}
                  <span style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>{listing.seller.displayName}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
