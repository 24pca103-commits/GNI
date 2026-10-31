import React, { useState } from 'react';
import { CheckCircle2, Clock, MessageSquareQuote, RefreshCw, Star, ThumbsDown, ThumbsUp, Trash2, XCircle } from 'lucide-react';
import { Badge, Button, EmptyState, IconAction, PageHeader, Panel, Segmented } from './AdminUI';
import { formatDate } from './adminFormat';

const statusOf = (f) => (f.status === 'approved' || f.status === 'rejected' ? f.status : 'pending');

const STATUS_BADGE = {
  pending: { tone: 'amber', icon: Clock, label: 'Awaiting review' },
  approved: { tone: 'green', icon: CheckCircle2, label: 'Published' },
  rejected: { tone: 'red', icon: XCircle, label: 'Rejected' },
};

function Stars({ rating }) {
  const n = Math.max(0, Math.min(5, Number(rating) || 0));
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${n} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i < n ? 'fill-[#B89555] text-[#B89555]' : 'text-[#6B4030]/20'}`} />
      ))}
    </span>
  );
}

export default function FeedbackView({ feedbacks, loading, busyId, onRefresh, onApprove, onReject, onDelete }) {
  const [filter, setFilter] = useState('pending');

  const counts = {
    all: feedbacks.length,
    pending: feedbacks.filter((f) => statusOf(f) === 'pending').length,
    approved: feedbacks.filter((f) => statusOf(f) === 'approved').length,
    rejected: feedbacks.filter((f) => statusOf(f) === 'rejected').length,
  };

  const visible = feedbacks
    .filter((f) => filter === 'all' || statusOf(f) === filter)
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reviews"
        description="Approve student reviews before they appear in the website testimonials."
        actions={
          <Button icon={RefreshCw} onClick={onRefresh} disabled={loading}>
            Refresh
          </Button>
        }
      />

      <Segmented
        label="Filter reviews"
        value={filter}
        onChange={setFilter}
        options={[
          { value: 'pending', label: 'Awaiting review', count: counts.pending },
          { value: 'approved', label: 'Published', count: counts.approved },
          { value: 'rejected', label: 'Rejected', count: counts.rejected },
          { value: 'all', label: 'All', count: counts.all },
        ]}
      />

      {visible.length === 0 ? (
        <Panel>
          <EmptyState
            icon={MessageSquareQuote}
            title={loading ? 'Loading reviews…' : filter === 'pending' ? 'All caught up' : 'No reviews here'}
            message={loading ? undefined : filter === 'pending' ? 'There are no reviews waiting for approval.' : 'Reviews submitted on the website appear here.'}
          />
        </Panel>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {visible.map((fb) => {
            const status = statusOf(fb);
            const badge = STATUS_BADGE[status];
            const busy = busyId === fb.id;
            return (
              <article key={fb.id} className="flex flex-col rounded-2xl border border-[#6B4030]/12 bg-white p-5">
                <header className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#4A2C20] font-bold text-[#E5B869]">
                      {(fb.name || 'G').trim().charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[#241A16]">{fb.name || 'Anonymous'}</p>
                      <p className="truncate text-xs text-[#6B4030]">{[fb.role, fb.batch, fb.location].filter(Boolean).join(' · ') || 'Student'}</p>
                    </div>
                  </div>
                  <Badge tone={badge.tone} icon={badge.icon}>
                    {badge.label}
                  </Badge>
                </header>

                <div className="mt-4 flex items-center justify-between">
                  <Stars rating={fb.rating || 5} />
                  <span className="text-xs text-[#6B4030]/80">{formatDate(fb.created_at)}</span>
                </div>

                <p className="mt-3 flex-1 whitespace-pre-line text-sm [overflow-wrap:anywhere] leading-relaxed text-[#241A16]">{fb.review}</p>

                <footer className="mt-4 flex items-center justify-between gap-2 border-t border-[#6B4030]/8 pt-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {status !== 'approved' && (
                      <Button variant="success" icon={ThumbsUp} onClick={() => onApprove(fb.id)} disabled={busy} className="py-1.5">
                        Approve & publish
                      </Button>
                    )}
                    {status !== 'rejected' && (
                      <Button icon={ThumbsDown} onClick={() => onReject(fb.id)} disabled={busy} className="py-1.5">
                        {status === 'approved' ? 'Unpublish' : 'Reject'}
                      </Button>
                    )}
                  </div>
                  <IconAction icon={Trash2} label="Delete review" tone="danger" onClick={() => onDelete(fb.id)} disabled={busy} />
                </footer>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
