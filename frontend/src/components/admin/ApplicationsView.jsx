import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, ChevronRight, Clock, Download, Inbox, Mail, Phone, Trash2, Users, X, XCircle } from 'lucide-react';
import { Button, EmptyState, IconAction, PageHeader, Panel, SearchInput, Select, StatCard } from './AdminUI';
import { DEFAULT_STATUS, STATUS_OPTIONS, formatDate, formatINR, statusGroup } from './adminFormat';

const GROUP_STYLE = {
  pending: { select: 'bg-amber-50 text-amber-900 border-amber-200' },
  confirmed: { select: 'bg-emerald-50 text-emerald-900 border-emerald-200' },
  closed: { select: 'bg-red-50 text-red-800 border-red-200' },
};

const nameOf = (r) => r.full_name || r.fullName || 'Unnamed applicant';
const phoneOf = (r) => r.full_phone || r.phone || '';
const courseOf = (r) => r.interested_skill || r.course_name || '—';

function StatusSelect({ value, onChange }) {
  const current = value || DEFAULT_STATUS;
  const style = current === 'Completed' ? { select: 'bg-sky-50 text-sky-900 border-sky-200' } : GROUP_STYLE[statusGroup(current)];
  const known = STATUS_OPTIONS.some((o) => o.value === current);
  return (
    <select
      value={current}
      onChange={(e) => onChange(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      aria-label="Application status"
      className={`rounded-lg border py-1.5 pl-2.5 pr-7 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#B89555]/30 cursor-pointer ${style.select}`}
    >
      {!known && <option value={current}>{current}</option>}
      {STATUS_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function DetailRow({ label, children }) {
  if (children === undefined || children === null || children === '') return null;
  return (
    <div className="grid grid-cols-[130px_1fr] gap-3 py-2.5 text-sm">
      <dt className="text-[#6B4030]">{label}</dt>
      <dd className="min-w-0 font-medium text-[#241A16] [overflow-wrap:anywhere]">{children}</dd>
    </div>
  );
}

function ApplicationDrawer({ reg, onClose, onStatusChange, onDelete }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const location = [reg.city, reg.state, reg.country].filter(Boolean).join(', ') || reg.location;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Application details">
      <div className="absolute inset-0 bg-[#241A16]/40 backdrop-blur-[2px]" onClick={onClose} />
      <aside className="gni-fade-up relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-3 border-b border-[#6B4030]/10 p-5">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#B89555]">Application</p>
            <h2 className="mt-0.5 [overflow-wrap:anywhere] font-['Cormorant_Garamond'] text-2xl font-bold text-[#241A16]">{nameOf(reg)}</h2>
            {reg.application_ref && <p className="mt-0.5 font-mono text-xs text-[#6B4030]">{reg.application_ref}</p>}
          </div>
          <IconAction icon={X} label="Close" onClick={onClose} />
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          <div className="flex flex-wrap items-center gap-2">
            <StatusSelect value={reg.payment_status} onChange={(v) => onStatusChange(reg.id, v)} />
            <span className="text-xs text-[#6B4030]">Applied {formatDate(reg.created_at)}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {reg.email && (
              <a href={`mailto:${reg.email}`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#6B4030]/20 px-3 py-2 text-sm font-semibold text-[#4A2C20] hover:bg-[#FAF7F0]">
                <Mail className="h-4 w-4 text-[#B89555]" /> Email
              </a>
            )}
            {phoneOf(reg) && (
              <a href={`tel:${phoneOf(reg).replace(/\s+/g, '')}`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#6B4030]/20 px-3 py-2 text-sm font-semibold text-[#4A2C20] hover:bg-[#FAF7F0]">
                <Phone className="h-4 w-4 text-[#B89555]" /> Call
              </a>
            )}
          </div>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[#6B4030]">Course</h3>
            <dl className="mt-1 divide-y divide-[#6B4030]/8">
              <DetailRow label="Course">{courseOf(reg)}</DetailRow>
              <DetailRow label="Duration">{reg.course_duration}</DetailRow>
              <DetailRow label="Course fee">{reg.course_fee ? formatINR(reg.course_fee) : ''}</DetailRow>
              <DetailRow label="Total amount">{reg.total_amount ? formatINR(reg.total_amount) : ''}</DetailRow>
              <DetailRow label="Payment ref">{reg.payment_ref}</DetailRow>
            </dl>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[#6B4030]">Applicant</h3>
            <dl className="mt-1 divide-y divide-[#6B4030]/8">
              <DetailRow label="Email">{reg.email}</DetailRow>
              <DetailRow label="Phone">{phoneOf(reg)}</DetailRow>
              <DetailRow label="Location">{location}</DetailRow>
              <DetailRow label="Profession">{reg.profession}</DetailRow>
              <DetailRow label="Experience">{reg.experience_level}</DetailRow>
            </dl>
          </section>

          {reg.learning_purpose && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[#6B4030]">Why they want to learn</h3>
              <p className="mt-2 whitespace-pre-line rounded-xl bg-[#FAF7F0] [overflow-wrap:anywhere] p-3.5 text-sm leading-relaxed text-[#241A16]">
                {reg.learning_purpose}
              </p>
            </section>
          )}
        </div>

        <footer className="border-t border-[#6B4030]/10 p-4">
          <Button variant="danger" icon={Trash2} onClick={() => onDelete(reg.id, nameOf(reg))} className="w-full">
            Delete application
          </Button>
        </footer>
      </aside>
    </div>
  );
}

function toCSV(rows) {
  const cols = [
    ['Reference', (r) => r.application_ref],
    ['Full name', nameOf],
    ['Email', (r) => r.email],
    ['Phone', phoneOf],
    ['Location', (r) => r.location],
    ['Profession', (r) => r.profession],
    ['Course', courseOf],
    ['Duration', (r) => r.course_duration],
    ['Fee', (r) => r.course_fee],
    ['Status', (r) => r.payment_status || DEFAULT_STATUS],
    ['Experience', (r) => r.experience_level],
    ['Applied on', (r) => r.created_at],
  ];
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  return [cols.map(([h]) => esc(h)).join(','), ...rows.map((r) => cols.map(([, get]) => esc(get(r))).join(','))].join('\n');
}

export default function ApplicationsView({ registrations, loading, onStatusChange, onDelete }) {
  const [search, setSearch] = useState('');
  const [course, setCourse] = useState('all');
  const [group, setGroup] = useState('all');
  const [openId, setOpenId] = useState(null);

  const courseOptions = useMemo(
    () => [...new Set(registrations.map(courseOf).filter((c) => c && c !== '—'))].sort(),
    [registrations]
  );

  const counts = {
    pending: registrations.filter((r) => statusGroup(r.payment_status) === 'pending').length,
    confirmed: registrations.filter((r) => statusGroup(r.payment_status) === 'confirmed').length,
    closed: registrations.filter((r) => statusGroup(r.payment_status) === 'closed').length,
  };

  const term = search.trim().toLowerCase();
  const visible = registrations
    .filter((r) => (course === 'all' ? true : courseOf(r) === course))
    .filter((r) => (group === 'all' ? true : statusGroup(r.payment_status) === group))
    .filter((r) =>
      !term
        ? true
        : [nameOf(r), r.email, phoneOf(r), r.location, r.application_ref].filter(Boolean).some((v) => String(v).toLowerCase().includes(term))
    )
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

  const openReg = registrations.find((r) => r.id === openId);

  const exportCSV = () => {
    if (!visible.length) return;
    const blob = new Blob(['﻿' + toCSV(visible)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gni-applications-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleGroup = (g) => setGroup((cur) => (cur === g ? 'all' : g));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Applications"
        description="Students who applied through the website. Click a row to see every detail."
        actions={
          <Button icon={Download} onClick={exportCSV} disabled={!visible.length}>
            Export CSV ({visible.length})
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Users} label="All applications" value={registrations.length} onClick={() => setGroup('all')} active={group === 'all'} />
        <StatCard icon={Clock} tone="amber" label="Awaiting action" value={counts.pending} hint="Payment pending" onClick={() => toggleGroup('pending')} active={group === 'pending'} />
        <StatCard icon={CheckCircle2} tone="green" label="Confirmed" value={counts.confirmed} hint={`${registrations.filter((r) => r.payment_status === 'Completed').length} completed the course`} onClick={() => toggleGroup('confirmed')} active={group === 'confirmed'} />
        <StatCard icon={XCircle} tone="red" label="Cancelled / rejected" value={counts.closed} onClick={() => toggleGroup('closed')} active={group === 'closed'} />
      </div>

      <Panel>
        <div className="flex flex-col gap-3 border-b border-[#6B4030]/10 p-3 md:flex-row md:items-center md:justify-between">
          <SearchInput value={search} onChange={setSearch} placeholder="Name, email, phone or reference" />
          <div className="flex flex-wrap items-center gap-2">
            <Select value={course} onChange={setCourse} label="Filter by course">
              <option value="all">All courses</option>
              {courseOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
            <Select value={group} onChange={setGroup} label="Filter by status">
              <option value="all">All statuses</option>
              <option value="pending">Awaiting action</option>
              <option value="confirmed">Confirmed</option>
              <option value="closed">Cancelled / rejected</option>
            </Select>
          </div>
        </div>

        {visible.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title={loading ? 'Loading applications…' : registrations.length ? 'No applications match' : 'No applications yet'}
            message={
              loading
                ? undefined
                : registrations.length
                ? 'Try clearing the search or filters.'
                : 'New applications from the website appear here automatically.'
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="whitespace-nowrap border-b border-[#6B4030]/10 bg-[#FCFAF6] text-xs font-semibold uppercase tracking-wide text-[#6B4030]">
                <tr>
                  <th className="px-4 py-3">Applicant</th>
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Applied</th>
                  <th className="px-4 py-3" aria-label="Actions" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#6B4030]/8">
                {visible.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => setOpenId(r.id)}
                    className="cursor-pointer transition-colors hover:bg-[#FCFAF6]"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#4A2C20] text-sm font-bold text-[#E5B869]">
                          {nameOf(r).trim().charAt(0).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-[#241A16]">{nameOf(r)}</p>
                          <p className="truncate text-xs text-[#6B4030]">{r.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="max-w-[260px] px-4 py-3">
                      <p className="truncate font-medium text-[#241A16]" title={courseOf(r)}>
                        {courseOf(r)}
                      </p>
                      <p className="text-xs text-[#6B4030]">{[r.course_duration, r.course_fee ? formatINR(r.course_fee) : ''].filter(Boolean).join(' · ')}</p>
                    </td>
                    <td className="px-4 py-3">
                      <StatusSelect value={r.payment_status} onChange={(v) => onStatusChange(r.id, v)} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-[#6B4030]">{formatDate(r.created_at)}</td>
                    <td className="px-4 py-3 text-right">
                      <ChevronRight className="ml-auto h-4 w-4 text-[#6B4030]/50" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {openReg && (
        <ApplicationDrawer
          reg={openReg}
          onClose={() => setOpenId(null)}
          onStatusChange={onStatusChange}
          onDelete={async (id, name) => {
            const removed = await onDelete(id, name);
            if (removed) setOpenId(null);
          }}
        />
      )}
    </div>
  );
}

