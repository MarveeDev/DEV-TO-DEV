'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MessageSquarePlus, FolderPlus, CircleHelp, TrendingUp, PlaySquare, ArrowLeft, Bookmark, FileText, LayoutTemplate, HelpCircle } from 'lucide-react';
import Card from '../../components/Card';

export default function ActionsPage() {
  const router = useRouter();

  const mainActions = [
    { name: 'Create Post', path: '/posts/create', icon: MessageSquarePlus, color: '#3b82f6' },
    { name: 'Create Project', path: '/projects/create', icon: FolderPlus, color: '#10b981' },
    { name: 'Ask Question', path: '/questions/ask', icon: CircleHelp, color: '#f59e0b' },
    { name: 'Trending in Tech', path: '/trending', icon: TrendingUp, color: '#ef4444' },
    { name: 'Tech Videos', path: '/videos', icon: PlaySquare, color: '#8b5cf6' },
  ];

  const quickAccess = [
    { name: 'Drafts', icon: FileText, path: '/profile?tab=drafts' },
    { name: 'My Projects', icon: LayoutTemplate, path: '/profile?tab=projects' },
    { name: 'My Questions', icon: HelpCircle, path: '/profile?tab=questions' },
    { name: 'Saved', icon: Bookmark, path: '/profile?tab=saved' },
  ];

  const categories = [
    'AI / ML', 'Web Development', 'Cloud', 'Cybersecurity', 
    'Mobile Development', 'DevOps', 'Data Science', 'Blockchain'
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '80px' }}>
      <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 10 }}>
        <button 
          onClick={() => router.back()} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--foreground)' }}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: 'var(--foreground)' }}>DEV-TO-DEV Actions / Discover</h1>
      </div>

      <div style={{ padding: '24px 0' }}>
        <style>{`
          .horizontal-scroll {
            display: flex;
            gap: 16px;
            overflow-x: auto;
            padding: 8px 24px 24px 24px;
            scroll-snap-type: x mandatory;
            scrollbar-width: none; /* Firefox */
          }
          .horizontal-scroll::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Edge */
          }
          .action-card {
            flex: 0 0 140px;
            scroll-snap-align: start;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 12px;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: var(--radius-lg);
            padding: 24px 16px;
            text-decoration: none;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(0,0,0,0.02);
          }
          .action-card:hover {
            transform: translateY(-2px);
            border-color: var(--primary);
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          }
          .category-chip {
            padding: 8px 16px;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 999px;
            font-size: 14px;
            font-weight: 500;
            color: var(--foreground);
            cursor: pointer;
            transition: all 0.2s;
            text-decoration: none;
          }
          .category-chip:hover {
            border-color: var(--primary);
            color: var(--primary);
          }
        `}</style>
        
        <div className="horizontal-scroll">
          {mainActions.map((action) => (
            <Link key={action.name} href={action.path} className="action-card">
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '50%', 
                background: `${action.color}15`, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: action.color
              }}>
                <action.icon size={24} strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground)', textAlign: 'center', lineHeight: 1.2 }}>
                {action.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 24px 32px 24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', color: 'var(--foreground)' }}>Suggested for You</h2>
        <div style={{ display: 'grid', gap: '12px' }}>
          <Card padding="md" style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', border: '1px solid var(--border)' }} onClick={() => router.push('/posts/create')}>
            <MessageSquarePlus size={20} color="var(--primary)" />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '15px' }}>Share your thoughts</div>
              <div style={{ fontSize: '13px', color: 'var(--foreground-muted)' }}>Write a post to the community</div>
            </div>
          </Card>
          <Card padding="md" style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', border: '1px solid var(--border)' }} onClick={() => router.push('/projects/create')}>
            <FolderPlus size={20} color="#10b981" />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '15px' }}>Build and showcase your project</div>
              <div style={{ fontSize: '13px', color: 'var(--foreground-muted)' }}>Share what you're working on</div>
            </div>
          </Card>
          <Card padding="md" style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', border: '1px solid var(--border)' }} onClick={() => router.push('/questions/ask')}>
            <CircleHelp size={20} color="#f59e0b" />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '15px' }}>Get help from the community</div>
              <div style={{ fontSize: '13px', color: 'var(--foreground-muted)' }}>Ask a technical question</div>
            </div>
          </Card>
        </div>
      </div>

      <div style={{ padding: '0 24px 32px 24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', color: 'var(--foreground)' }}>Quick Access</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {quickAccess.map((item) => (
            <Link key={item.name} href={item.path} style={{ textDecoration: 'none' }}>
              <Card padding="sm" style={{ display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
                <item.icon size={18} color="var(--foreground-muted)" />
                <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--foreground)' }}>{item.name}</span>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 24px 32px 24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', color: 'var(--foreground)' }}>Explore Categories</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {categories.map((category) => (
            <Link key={category} href={`/trending?category=${encodeURIComponent(category)}`} className="category-chip">
              {category}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
