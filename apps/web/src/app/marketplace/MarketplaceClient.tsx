'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Select from '../../components/Select';
import Avatar from '../../components/Avatar';
import ReportListingModal from '../../components/ReportListingModal';
import { formatPrice } from '../../lib/currency';
import { Search, Store } from 'lucide-react';
import { MarketplaceCardSkeleton } from '../../components/skeletons';
import EmptyState from '../../components/EmptyState';

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

export default function MarketplaceClient({ initialListings }: { initialListings: any[] | null }) {
  const [listings, setListings] = useState<any[]>(initialListings ?? []);
  const [loading, setLoading] = useState(initialListings === null);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [type, setType] = useState('All');
  const [reportListingId, setReportListingId] = useState<string | null>(null);
  const didMount = useRef(false);

  const hasInitial = initialListings !== null;

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
    if (!didMount.current) {
      didMount.current = true;
      if (hasInitial) return;
    }
    const timer = setTimeout(() => {
      fetchListings();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, category, type]);

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '8px' }}>Marketplace</h1>
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
        <div role="status" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          <span className="sr-only">Loading marketplace…</span>
          <MarketplaceCardSkeleton />
          <MarketplaceCardSkeleton />
          <MarketplaceCardSkeleton />
          <MarketplaceCardSkeleton />
          <MarketplaceCardSkeleton />
          <MarketplaceCardSkeleton />
        </div>
      ) : listings.length === 0 ? (
        <EmptyState icon={Store} title="No listings found" description="Try adjusting your search or filters." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {listings.map(listing => (
            <Link key={listing.id} href={`/marketplace/${listing.id}`} style={{ textDecoration: 'none' }}>
              <Card padding="md" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {listing.imageUrl && (
                  <div style={{ position: 'relative', width: '100%', height: '160px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: '16px' }}>
                    <Image src={listing.imageUrl} alt={listing.title} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)', background: 'var(--primary-light)', padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}>
                    {listing.type === 'DIGITAL_PRODUCT' ? 'Digital Product' : 'Service'}
                  </span>
                  <span style={{ fontWeight: 700, color: 'var(--foreground)' }}>
                    {formatPrice(listing.price, listing.currency)}
                  </span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '8px' }}>
                  {listing.title}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--foreground-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1, marginBottom: '16px' }}>
                  {listing.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                  <Avatar src={listing.seller.avatarUrl} name={listing.seller.displayName} size={24} />
                  <span style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>{listing.seller.displayName}</span>
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setReportListingId(listing.id); }}
                    style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--foreground-muted)', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                  >
                    Report
                  </button>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {reportListingId && (
        <ReportListingModal listingId={reportListingId} onClose={() => setReportListingId(null)} />
      )}
    </div>
  );
}
