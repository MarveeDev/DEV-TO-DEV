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
  ListChecks,
} from 'lucide-react';
import { useCurrentUser } from '../../../../components/Auth/CurrentUserProvider';
import LessonBlockRenderer, { type LessonBlock } from '../../../../components/learning/LessonBlockRenderer';

type Node = any;
type Roadmap = any;

const TABS = [
  { id: 'learn', label: 'Learn', icon: BookOpen },
  { id: 'try', label: 'Try it', icon: Code2 },
  { id: 'practice', label: 'Practice', icon: FlaskConical },
  { id: 'quiz', label: 'Quiz', icon: ListChecks },
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

  const lessonBlocks: LessonBlock[] = node.lessonBlocks || [];
  const learningBlocks = lessonBlocks.filter((b) =>
    ['EXPLANATION', 'SYNTAX', 'EXAMPLE', 'KEY_TAKEAWAYS', 'NOTE', 'SECTION'].includes(b.type),
  );
  const tryItBlocks = lessonBlocks.filter((b) => b.type === 'TRY_IT');
  const exerciseBlocks = lessonBlocks.filter((b) => b.type === 'EXERCISE');
  const quizBlocks = lessonBlocks.filter((b) => b.type === 'QUIZ');

  const sidebar = (
    <div className="learn-nav-inner">
      <div className="learn-nav-head">
        <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--foreground)', lineHeight: 1.3 }}>{roadmap.title}</div>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)', marginTop: '4px' }}>
          {completedCount}/{totalNodes} completed
        </div>
        <div style={{ height: '6px', borderRadius: 999, background: 'var(--border)', marginTop: '10px', overflow: 'hidden' }}>
          <div style={{ width: `${overallPercent}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.3s ease' }} />
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Roadmap</span>
              <button onClick={() => setNavOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--foreground-muted)', cursor: 'pointer' }} aria-label="Close">
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
          <div className="learn-card">
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

                {lessonBlocks.length > 0 ? (
                  learningBlocks.length > 0 ? (
                    <LessonBlockRenderer blocks={learningBlocks} />
                  ) : (
                    <p className="learn-lesson" style={{ color: 'var(--foreground-muted)' }}>
                      No explanation content for this topic yet.
                    </p>
                  )
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
                <h2 className="learn-title">Try it</h2>
                {tryItBlocks.length > 0 ? (
                  <LessonBlockRenderer blocks={tryItBlocks} />
                ) : (
                  <p className="learn-lesson" style={{ color: 'var(--foreground-muted)' }}>
                    No interactive exercise for this topic yet.
                  </p>
                )}
              </div>
            )}

            {activeTab === 'practice' && (
              <div>
                <h2 className="learn-title">Practice</h2>
                {exerciseBlocks.length > 0 ? (
                  <LessonBlockRenderer blocks={exerciseBlocks} />
                ) : (
                  <p className="learn-lesson" style={{ color: 'var(--foreground-muted)' }}>
                    No practice exercise for this topic yet.
                  </p>
                )}
              </div>
            )}

            {activeTab === 'quiz' && (
              <div>
                <h2 className="learn-title">Quiz</h2>
                {quizBlocks.length > 0 ? (
                  <LessonBlockRenderer blocks={quizBlocks} />
                ) : (
                  <p className="learn-lesson" style={{ color: 'var(--foreground-muted)' }}>
                    No quiz for this topic yet.
                  </p>
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
      
    </div>
  );
}
