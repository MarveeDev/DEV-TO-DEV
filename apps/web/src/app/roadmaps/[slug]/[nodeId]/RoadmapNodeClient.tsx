'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronRight,
  Map as MapIcon,
  Menu,
  X,
  BookOpen,
  Play,
  MessageSquare,
  Hammer,
  FlaskConical,
  Code2,
  Eye,
} from 'lucide-react';
import { useCurrentUser } from '../../../../components/Auth/CurrentUserProvider';
import LessonBlockRenderer from '../../../../components/learning/LessonBlockRenderer';

type Node = any;
type Roadmap = any;

const TABS = [
  { id: 'learn', label: 'Learn', icon: BookOpen },
  { id: 'try', label: 'Try it', icon: Code2 },
  { id: 'practice', label: 'Practice', icon: FlaskConical },
  { id: 'read', label: 'Read', icon: Eye },
  { id: 'watch', label: 'Watch', icon: Play },
  { id: 'build', label: 'Build', icon: Hammer },
  { id: 'discuss', label: 'Discuss', icon: MessageSquare },
];

function groupByStage(nodes: Node[]) {
  const map = new Map<string, Node[]>();
  for (const n of nodes) {
    const stage = n.stage || 'Other';
    if (!map.has(stage)) map.set(stage, []);
    map.get(stage)!.push(n);
  }
  return Array.from(map.entries());
}

export default function RoadmapNodeClient({
  slug,
  nodeId,
  initialNode,
  initialRoadmap,
}: {
  slug: string;
  nodeId: string;
  initialNode: Node | null;
  initialRoadmap: Roadmap | null;
}) {
  const router = useRouter();
  const { user } = useCurrentUser();

  const [node, setNode] = useState<Node | null>(initialNode);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(initialRoadmap);
  const [progress, setProgress] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('learn');
  const [navOpen, setNavOpen] = useState(false);
  const [collapsedStages, setCollapsedStages] = useState<Set<string>>(new Set());
  const [updating, setUpdating] = useState(false);

  const clientFetch = (url: string, options?: any) => window.fetch(url, options);

  useEffect(() => {
    if (initialNode === null) {
      fetch(`/api/v1/roadmaps/nodes/${encodeURIComponent(nodeId)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => setNode(d))
        .catch(() => {});
    }
    if (initialRoadmap === null) {
      fetch(`/api/v1/roadmaps/${encodeURIComponent(slug)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => setRoadmap(d))
        .catch(() => {});
    }
  }, [nodeId, slug, initialNode, initialRoadmap]);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const res = await clientFetch('/api/v1/roadmaps/me');
        if (res.ok) setProgress(await res.json());
      } catch {
        // ignore
      }
    };
    loadProgress();
  }, [nodeId]);

  const nodes = useMemo<Node[]>(
    () => ((roadmap?.nodes as Node[] | undefined) || []).slice().sort((a, b) => a.order - b.order),
    [roadmap],
  );
  const stages = useMemo(() => groupByStage(nodes), [nodes]);
  const completedIds = useMemo(() => new Set(progress.map((p: any) => p.nodeId)), [progress]);

  const totalNodes = nodes.length;
  const completedCount = nodes.filter((n) => completedIds.has(n.id)).length;
  const overallPercent = totalNodes > 0 ? Math.round((completedCount / totalNodes) * 100) : 0;

  const nodeIndex = nodes.findIndex((n) => n.id === nodeId);
  const prevNode = nodeIndex > 0 ? nodes[nodeIndex - 1] : null;
  const nextNode = nodeIndex >= 0 && nodeIndex < totalNodes - 1 ? nodes[nodeIndex + 1] : null;

  const currentStage = node?.stage || '';
  const currentStageOpen = !collapsedStages.has(currentStage);

  const toggleStage = (stage: string) => {
    setCollapsedStages((prev) => {
      const next = new Set(prev);
      if (next.has(stage)) next.delete(stage);
      else next.add(stage);
      return next;
    });
  };

  const isCompleted = completedIds.has(nodeId);

  const handleToggleComplete = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setUpdating(true);
    try {
      if (isCompleted) {
        await clientFetch(`/api/v1/roadmaps/nodes/${encodeURIComponent(nodeId)}/complete`, { method: 'DELETE' });
        setProgress((p) => p.filter((x) => x.nodeId !== nodeId));
      } else {
        const res = await clientFetch(`/api/v1/roadmaps/nodes/${encodeURIComponent(nodeId)}/complete`, { method: 'POST' });
        if (res.ok) {
          const created = await res.json();
          setProgress((p) => [...p, { nodeId, ...created }]);
        } else {
          const err = await res.json().catch(() => ({}));
          alert(err.message || 'Failed to complete topic');
        }
      }
    } finally {
      setUpdating(false);
    }
  };

  if (!node || !roadmap) {
    return (
      <div className="page-container" style={{ textAlign: 'center', color: 'var(--foreground-muted)', padding: '80px 16px' }}>
        Loading learning experience…
      </div>
    );
  }

  const sidebar = (
    <div className="learn-nav-inner">
      <div className="learn-nav-head">
        <div style={{ fontSize: '15px', fontWeight: 800, color: '#e7ecf5', lineHeight: 1.3 }}>{roadmap.title}</div>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#7dd3fc', marginTop: '4px' }}>
          {completedCount}/{totalNodes} completed
        </div>
        <div style={{ height: '6px', borderRadius: 999, background: '#1f2b45', marginTop: '10px', overflow: 'hidden' }}>
          <div style={{ width: `${overallPercent}%`, height: '100%', background: '#3b82f6', transition: 'width 0.3s ease' }} />
        </div>
      </div>

      <div className="learn-nav-list">
        {stages.map(([stage, stageNodes]) => {
          const stageDone = stageNodes.filter((n) => completedIds.has(n.id)).length;
          const isOpen = stage === currentStage ? currentStageOpen : !collapsedStages.has(stage);
          return (
            <div key={stage}>
              <button className="learn-stage" onClick={() => toggleStage(stage)}>
                <span className="learn-stage-num">{stageNodes.length}</span>
                <span className="learn-stage-name">{stage}</span>
                <span className="learn-stage-count">{stageDone}/{stageNodes.length}</span>
                <ChevronDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', color: '#6b7a95' }} />
              </button>
              {isOpen && (
                <div className="learn-stage-items">
                  {stageNodes.map((n) => {
                    const isCurrent = n.id === nodeId;
                    const done = completedIds.has(n.id);
                    return (
                      <Link key={n.id} href={`/roadmaps/${encodeURIComponent(slug)}/${n.id}`} onClick={() => setNavOpen(false)} className={isCurrent ? 'learn-node learn-node--current' : 'learn-node'}>
                        {done ? <CheckCircle2 size={16} color="#34d399" style={{ flexShrink: 0 }} /> : <Circle size={16} color={isCurrent ? '#7dd3fc' : '#3d4a63'} style={{ flexShrink: 0 }} />}
                        <span>{n.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="learn-root">
      {/* Mobile top bar */}
      <div className="learn-mobile-bar">
        <button className="learn-mobile-menu" onClick={() => setNavOpen(true)} aria-label="Open roadmap navigation">
          <Menu size={22} />
        </button>
        <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{node.title}</span>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)' }}>{overallPercent}%</span>
      </div>

      {/* Mobile drawer */}
      {navOpen && (
        <div className="learn-drawer">
          <div className="learn-drawer-backdrop" onClick={() => setNavOpen(false)} />
          <aside className="learn-drawer-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid #1f2b45' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#9aa7bd', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Roadmap</span>
              <button onClick={() => setNavOpen(false)} style={{ background: 'none', border: 'none', color: '#9aa7bd', cursor: 'pointer' }} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="learn-grid">
        {/* Left navigation */}
        <aside className="learn-nav">{sidebar}</aside>

        {/* Center */}
        <main className="learn-main">
          {/* Breadcrumb */}
          <div className="learn-breadcrumb">
            <Link href="/roadmaps" className="learn-bc-link">Roadmaps</Link>
            <ChevronRight size={14} color="var(--foreground-subtle)" />
            <Link href={`/roadmaps/${encodeURIComponent(slug)}`} className="learn-bc-link">{roadmap.title}</Link>
            <ChevronRight size={14} color="var(--foreground-subtle)" />
            <span className="learn-bc-current">{currentStage}</span>
          </div>

          {/* Header */}
          <div className="learn-header">
            <div className="learn-header-icon">
              <MapIcon size={28} />
            </div>
            <div className="learn-header-body">
              <h1>{roadmap.title} Roadmap</h1>
              <p>{roadmap.description || 'Follow this roadmap with hands-on practice and curated resources.'}</p>
              <div className="learn-progress">
                <div className="learn-progress-label">
                  <span>Overall Progress</span>
                  <span>{overallPercent}%</span>
                </div>
                <div className="learn-progress-track">
                  <div className="learn-progress-fill" style={{ width: `${overallPercent}%` }} />
                </div>
              </div>
            </div>
            <Link href={`/roadmaps/${encodeURIComponent(slug)}`} className="learn-view-roadmap">View Roadmap</Link>
          </div>

          {/* Tabs */}
          <div className="learn-tabs">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = activeTab === t.id;
              return (
                <button key={t.id} className={active ? 'learn-tab learn-tab--active' : 'learn-tab'} onClick={() => setActiveTab(t.id)}>
                  <Icon size={15} />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="learn-content">
            {activeTab === 'learn' && (
              <div>
                <h2 className="learn-title">{node.title}</h2>

                {node.lessonBlocks && node.lessonBlocks.length > 0 ? (
                  <LessonBlockRenderer blocks={node.lessonBlocks} />
                ) : (
                  <>
                    <p className="learn-lesson">{node.description}</p>

                    {node.topics && node.topics.length > 0 && (
                      <div className="learn-section">
                        <h3>Core Topics</h3>
                        <div className="learn-topics">
                          {node.topics.map((t: string, i: number) => (
                            <span key={i} className="learn-topic-chip">{t}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {node.learningObjectives && node.learningObjectives.length > 0 && (
                      <div className="learn-section learn-key-takeaways">
                        <h3>Key Takeaways</h3>
                        <ul>
                          {node.learningObjectives.map((obj: string, i: number) => (
                            <li key={i}>{obj}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === 'try' && (
              <div>
                <h2 className="learn-title">Try it yourself</h2>
                <p className="learn-lesson">
                  An interactive coding environment is planned for a future phase. Code execution is deliberately kept out of
                  this build for safety.
                </p>
                <div className="learn-editor-placeholder">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7a95', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>
                    <Code2 size={14} /> Editor (coming soon)
                  </div>
                  <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '13px', color: '#9aa7bd' }}># Write code here in a future phase</div>
                </div>
              </div>
            )}

            {activeTab === 'practice' && (
              <div>
                <h2 className="learn-title">Practice Exercise</h2>
                {node.practicalExercise ? (
                  <>
                    <p className="learn-lesson">{node.practicalExercise}</p>
                    <div className="learn-editor-placeholder">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7a95', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>
                        <Code2 size={14} /> Solution editor (coming soon)
                      </div>
                      <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '13px', color: '#9aa7bd' }}># Solve this exercise in a future phase</div>
                    </div>
                  </>
                ) : (
                  <p className="learn-lesson" style={{ color: 'var(--foreground-muted)' }}>No practice exercise for this topic yet.</p>
                )}
              </div>
            )}

            {activeTab === 'read' && (
              <div>
                <h2 className="learn-title">Recommended Reading</h2>
                {node.recommendedBookUrl ? (
                  <div className="learn-resource-card">
                    <div className="learn-resource-icon"><BookOpen size={20} /></div>
                    <div className="learn-resource-body">
                      {node.recommendedBookTitle && <div className="learn-resource-title">{node.recommendedBookTitle}</div>}
                      {node.recommendedBookAuthor && <div className="learn-resource-meta">{node.recommendedBookAuthor}</div>}
                      {node.recommendedBookDescription && <p className="learn-resource-desc">{node.recommendedBookDescription}</p>}
                      <a href={node.recommendedBookUrl} target="_blank" rel="noopener noreferrer" className="learn-resource-link">Read Online →</a>
                    </div>
                  </div>
                ) : (
                  <p className="learn-lesson" style={{ color: 'var(--foreground-muted)' }}>No free reading resource for this topic yet.</p>
                )}
              </div>
            )}

            {activeTab === 'watch' && (
              <div>
                <h2 className="learn-title">Recommended Video</h2>
                {node.videoUrl ? (
                  <div className="learn-resource-card">
                    <div className="learn-resource-icon learn-resource-icon--video"><Play size={18} /></div>
                    <div className="learn-resource-body">
                      {node.videoTitle && <div className="learn-resource-title">{node.videoTitle}</div>}
                      {(node.videoInstructor || node.videoPlatform || node.videoDuration) && (
                        <div className="learn-resource-meta">
                          {[node.videoInstructor, node.videoPlatform, node.videoDuration].filter(Boolean).join(' • ')}
                        </div>
                      )}
                      {node.videoDescription && <p className="learn-resource-desc">{node.videoDescription}</p>}
                      <a href={node.videoUrl} target="_blank" rel="noopener noreferrer" className="learn-resource-link learn-resource-link--video">Watch Video →</a>
                    </div>
                  </div>
                ) : (
                  <p className="learn-lesson" style={{ color: 'var(--foreground-muted)' }}>No video for this topic yet.</p>
                )}
              </div>
            )}

            {activeTab === 'build' && (
              <div>
                <h2 className="learn-title">Build Projects</h2>
                <p className="learn-lesson" style={{ color: 'var(--foreground-muted)' }}>
                  Apply what you&apos;ve learned by building real projects. Project-based learning for this roadmap is coming soon.
                </p>
                <Link href="/projects" className="learn-outline-btn">Browse Projects</Link>
              </div>
            )}

            {activeTab === 'discuss' && (
              <div>
                <h2 className="learn-title">Discuss</h2>
                <p className="learn-lesson" style={{ color: 'var(--foreground-muted)' }}>
                  Ask a question or share what you&apos;re working on with the DEV-TO-DEV community.
                </p>
                <Link href="/questions/ask" className="learn-outline-btn">Ask a Question</Link>
              </div>
            )}
          </div>

          {/* Previous / Next */}
          <div className="learn-prevnext">
            {prevNode ? (
              <Link href={`/roadmaps/${encodeURIComponent(slug)}/${prevNode.id}`} className="learn-prevnext-card">
                <span className="learn-prevnext-dir">← Previous</span>
                <span className="learn-prevnext-title">{prevNode.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {nextNode ? (
              <Link href={`/roadmaps/${encodeURIComponent(slug)}/${nextNode.id}`} className="learn-prevnext-card learn-prevnext-card--next">
                <span className="learn-prevnext-dir">Next →</span>
                <span className="learn-prevnext-title">{nextNode.title}</span>
              </Link>
            ) : (
              <span />
            )}
          </div>

          {/* Completion */}
          <div className="learn-complete">
            <button className={isCompleted ? 'btn btn--outline' : 'btn btn--primary'} onClick={handleToggleComplete} disabled={updating}>
              {isCompleted ? <><CheckCircle2 size={18} /> Completed</> : <><Circle size={18} /> Mark as Complete</>}
            </button>
          </div>
        </main>

        {/* Right resources */}
        <aside className="learn-aside">
          {node.recommendedBookUrl && (
            <div className="learn-aside-card">
              <div className="learn-aside-head">
                <span>Recommended Books</span>
                <span className="learn-aside-free">Free</span>
              </div>
              {node.recommendedBookTitle && <div className="learn-aside-title">{node.recommendedBookTitle}</div>}
              {node.recommendedBookAuthor && <div className="learn-aside-meta">{node.recommendedBookAuthor}</div>}
              <a href={node.recommendedBookUrl} target="_blank" rel="noopener noreferrer" className="learn-aside-btn">Read Online</a>
            </div>
          )}

          {node.videoUrl && (
            <div className="learn-aside-card">
              <div className="learn-aside-head"><span>Recommended Video</span></div>
              {node.videoTitle && <div className="learn-aside-title">{node.videoTitle}</div>}
              {(node.videoInstructor || node.videoDuration) && (
                <div className="learn-aside-meta">{[node.videoInstructor, node.videoDuration].filter(Boolean).join(' • ')}</div>
              )}
              <a href={node.videoUrl} target="_blank" rel="noopener noreferrer" className="learn-aside-btn learn-aside-btn--video">Watch</a>
            </div>
          )}

          {node.practicalExercise && (
            <div className="learn-aside-card">
              <div className="learn-aside-head"><span>Practice Exercise</span></div>
              <p className="learn-aside-desc">{node.practicalExercise}</p>
              <button className="learn-aside-btn" onClick={() => setActiveTab('practice')}>Open Exercise</button>
            </div>
          )}
        </aside>
      </div>

      <style jsx>{`
        .learn-root {
          min-height: 100vh;
          background: var(--background);
        }
        .learn-mobile-bar {
          display: none;
        }
        .learn-grid {
          display: grid;
          grid-template-columns: 280px minmax(0, 1fr) 320px;
          gap: 0;
          max-width: 1440px;
          margin: 0 auto;
        }
        .learn-nav {
          background: #0b1220;
          min-height: 100vh;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          border-right: 1px solid #1f2b45;
        }
        .learn-nav-inner {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .learn-nav-head {
          padding: 20px 20px 16px;
          border-bottom: 1px solid #1f2b45;
        }
        .learn-nav-list {
          flex: 1;
          padding: 12px 10px 40px;
          overflow-y: auto;
        }
        .learn-stage {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 9px 10px;
          border-radius: 8px;
          color: #cbd5e1;
          font-size: 13px;
          font-weight: 700;
          text-align: left;
        }
        .learn-stage:hover { background: #111a2e; }
        .learn-stage-num {
          min-width: 22px;
          height: 22px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #1f2b45;
          color: #7dd3fc;
          font-size: 11px;
          font-weight: 700;
          border-radius: 6px;
        }
        .learn-stage-name { flex: 1; }
        .learn-stage-count { color: #6b7a95; font-size: 11px; font-weight: 600; }
        .learn-stage-items { margin: 2px 0 8px; }
        .learn-node {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 7px 12px 7px 26px;
          font-size: 13px;
          color: #9aa7bd;
          border-radius: 8px;
          text-decoration: none;
        }
        .learn-node:hover { background: #111a2e; color: #e7ecf5; }
        .learn-node--current { background: rgba(59, 130, 246, 0.18); color: #e7ecf5; font-weight: 600; }

        .learn-main {
          padding: 24px 32px 80px;
          min-width: 0;
        }
        .learn-breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: var(--foreground-subtle);
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .learn-bc-link { color: var(--primary); font-weight: 500; }
        .learn-bc-current { color: var(--foreground-muted); font-weight: 600; }

        .learn-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border);
          margin-bottom: 20px;
        }
        .learn-header-icon {
          width: 56px;
          height: 56px;
          flex-shrink: 0;
          border-radius: 14px;
          background: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .learn-header-body { flex: 1; min-width: 0; }
        .learn-header h1 { font-size: 22px; font-weight: 800; margin: 0 0 6px; color: var(--foreground); }
        .learn-header p { font-size: 14px; color: var(--foreground-muted); margin: 0 0 16px; line-height: 1.6; }
        .learn-progress-label {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          font-weight: 600;
          color: var(--foreground);
          margin-bottom: 6px;
        }
        .learn-progress-track {
          height: 8px;
          border-radius: 999px;
          background: var(--border);
          overflow: hidden;
        }
        .learn-progress-fill { height: 100%; background: var(--primary); transition: width 0.3s ease; }
        .learn-view-roadmap {
          flex-shrink: 0;
          padding: 8px 14px;
          border-radius: 10px;
          border: 1px solid var(--border-strong);
          font-size: 13px;
          font-weight: 600;
          color: var(--foreground);
          text-decoration: none;
          background: var(--surface);
        }

        .learn-tabs {
          display: flex;
          gap: 2px;
          border-bottom: 1px solid var(--border);
          margin-bottom: 24px;
          overflow-x: auto;
        }
        .learn-tab {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 14px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          font-size: 14px;
          font-weight: 600;
          color: var(--foreground-muted);
          cursor: pointer;
          white-space: nowrap;
        }
        .learn-tab:hover { color: var(--foreground); }
        .learn-tab--active { color: var(--primary); border-bottom-color: var(--primary); }

        .learn-content { max-width: 720px; }
        .learn-title { font-size: 26px; font-weight: 800; margin: 0 0 16px; color: var(--foreground); }
        .learn-lesson { font-size: 15px; line-height: 1.7; color: var(--foreground-muted); margin: 0 0 20px; white-space: pre-wrap; }
        .learn-section { margin-bottom: 24px; }
        .learn-section h3 { font-size: 16px; font-weight: 700; margin: 0 0 12px; color: var(--foreground); }
        .learn-topics { display: flex; flex-wrap: wrap; gap: 8px; }
        .learn-topic-chip {
          font-size: 13px;
          padding: 6px 12px;
          border-radius: 999px;
          background: var(--surface-hover);
          color: var(--foreground);
          border: 1px solid var(--border);
        }
        .learn-key-takeaways {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 20px 24px;
        }
        .learn-key-takeaways ul { margin: 0; padding-left: 20px; }
        .learn-key-takeaways li { font-size: 14px; line-height: 1.7; color: var(--foreground-muted); margin-bottom: 8px; }

        .learn-editor-placeholder {
          background: #0b1220;
          border: 1px solid #1f2b45;
          border-radius: 12px;
          padding: 16px;
          margin-top: 8px;
        }

        .learn-resource-card {
          display: flex;
          gap: 16px;
          padding: 20px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
        }
        .learn-resource-icon {
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          border-radius: 10px;
          background: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .learn-resource-icon--video { background: var(--danger-light); color: var(--danger); }
        .learn-resource-body { min-width: 0; }
        .learn-resource-title { font-size: 16px; font-weight: 700; color: var(--foreground); }
        .learn-resource-meta { font-size: 13px; color: var(--foreground-muted); margin: 2px 0 10px; }
        .learn-resource-desc { font-size: 14px; color: var(--foreground-muted); line-height: 1.6; margin: 0 0 12px; }
        .learn-resource-link { font-size: 14px; font-weight: 600; color: var(--primary); text-decoration: none; }
        .learn-resource-link--video { color: var(--danger); }

        .learn-outline-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 10px;
          border: 1px solid var(--border-strong);
          background: var(--surface);
          color: var(--foreground);
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          margin-top: 8px;
        }

        .learn-prevnext {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-top: 32px;
          padding-top: 20px;
          border-top: 1px solid var(--border);
        }
        .learn-prevnext-card {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 14px 18px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--surface);
          text-decoration: none;
          max-width: 46%;
        }
        .learn-prevnext-card--next { text-align: right; margin-left: auto; }
        .learn-prevnext-dir { font-size: 12px; font-weight: 600; color: var(--foreground-subtle); }
        .learn-prevnext-title { font-size: 14px; font-weight: 600; color: var(--primary); }

        .learn-complete { margin-top: 24px; }

        .learn-aside {
          padding: 24px 20px 80px;
          border-left: 1px solid var(--border);
          background: var(--background);
        }
        .learn-aside-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 18px;
          margin-bottom: 16px;
        }
        .learn-aside-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--foreground-muted);
          margin-bottom: 10px;
        }
        .learn-aside-free {
          font-size: 11px;
          font-weight: 700;
          color: var(--success);
          background: var(--success-light);
          padding: 2px 8px;
          border-radius: 999px;
        }
        .learn-aside-title { font-size: 14px; font-weight: 700; color: var(--foreground); margin-bottom: 4px; }
        .learn-aside-meta { font-size: 12px; color: var(--foreground-muted); margin-bottom: 10px; }
        .learn-aside-desc { font-size: 13px; color: var(--foreground-muted); line-height: 1.5; margin: 0 0 12px; }
        .learn-aside-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 8px;
          background: var(--primary);
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          text-decoration: none;
        }
        .learn-aside-btn--video { background: var(--danger); }

        /* Tablet / Mobile */
        @media (max-width: 1200px) {
          .learn-grid { grid-template-columns: 260px minmax(0, 1fr); }
          .learn-aside { display: none; }
        }
        @media (max-width: 900px) {
          .learn-grid { grid-template-columns: 1fr; }
          .learn-nav { display: none; }
          .learn-mobile-bar {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            background: var(--surface);
            border-bottom: 1px solid var(--border);
            position: sticky;
            top: 0;
            z-index: 40;
          }
          .learn-mobile-menu {
            background: none;
            border: none;
            color: var(--foreground);
            cursor: pointer;
            display: inline-flex;
          }
          .learn-main { padding: 20px 16px 80px; }
        }
        .learn-drawer { display: none; }
        @media (max-width: 900px) {
          .learn-drawer { display: block; }
          .learn-drawer-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(11, 18, 32, 0.6);
            z-index: 100;
          }
          .learn-drawer-panel {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            width: 300px;
            max-width: 85vw;
            background: #0b1220;
            z-index: 101;
            overflow-y: auto;
          }
        }
      `}</style>
    </div>
  );
}
