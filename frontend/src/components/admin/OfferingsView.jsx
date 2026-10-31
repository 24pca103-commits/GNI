import React, { useMemo, useState } from 'react';
import { BookOpen, Compass, Eye, Hammer, Layers, Pencil, Plus, Tag, Trash2 } from 'lucide-react';
import { getOfferingKind, parseJourneyPhases, parseWorkshopModules, getDayCount } from '../../utils/offerings';
import {
  Badge,
  Button,
  EmptyState,
  IconAction,
  PageHeader,
  Panel,
  SearchInput,
  Segmented,
  StatCard,
  Switch
} from './AdminUI';
import { formatINR } from './adminFormat';

function SeatsBar({ total, booked }) {
  const pct = total > 0 ? Math.min(100, Math.round((booked / total) * 100)) : 0;
  const left = Math.max(0, total - booked);
  const tone = left === 0 ? 'bg-red-500' : left <= 5 ? 'bg-amber-500' : 'bg-[#B89555]';
  return (
    <div className="w-full min-w-[120px]">
      <div className="flex items-baseline justify-between text-xs">
        <span className="font-semibold tabular-nums text-[#241A16]">
          {left} <span className="font-normal text-[#6B4030]">left</span>
        </span>
        <span className="tabular-nums text-[#6B4030]/80">
          {booked}/{total} booked
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#F3EBDC]">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${Math.max(pct, booked ? 4 : 0)}%` }} />
      </div>
    </div>
  );
}

function contentSummary(course, kind) {
  if (kind === 'journey') {
    const n = parseJourneyPhases(course.highlights, getDayCount(course.duration)).length;
    return `${n} ${n === 1 ? 'phase' : 'phases'}`;
  }
  const n = parseWorkshopModules(course.highlights).length;
  return `${n} ${n === 1 ? 'step' : 'steps'}`;
}

export default function OfferingsView({ courses, loading, onCreate, onEdit, onToggle, onDelete }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const rows = useMemo(
    () => courses.map((c) => ({ course: c, kind: getOfferingKind(c) })),
    [courses]
  );

  const counts = {
    all: rows.length,
    workshop: rows.filter((r) => r.kind === 'workshop').length,
    journey: rows.filter((r) => r.kind === 'journey').length,
    hidden: rows.filter((r) => !Number(r.course.is_active)).length,
  };
  const liveCount = rows.length - counts.hidden;
  const fullCount = rows.filter((r) => Number(r.course.seats_total) > 0 && Number(r.course.seats_available) === 0).length;
  const discounted = rows.filter((r) => Number(r.course.discount_price) < Number(r.course.original_price)).length;

  const term = search.trim().toLowerCase();
  const visible = rows.filter(({ course, kind }) => {
    if (filter === 'workshop' && kind !== 'workshop') return false;
    if (filter === 'journey' && kind !== 'journey') return false;
    if (filter === 'hidden' && Number(course.is_active)) return false;
    if (!term) return true;
    return [course.title, course.badge, course.pillar_title, course.description]
      .filter(Boolean)
      .some((v) => v.toLowerCase().includes(term));
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Offerings"
        description="Workshops and learning journeys shown on the website."
        actions={
          <>
            <Button icon={Hammer} onClick={() => onCreate('workshop')}>
              New workshop
            </Button>
            <Button variant="primary" icon={Compass} onClick={() => onCreate('journey')}>
              New journey
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Layers} label="Total offerings" value={rows.length} hint={`${counts.workshop} workshops · ${counts.journey} journeys`} />
        <StatCard icon={Eye} tone="green" label="Live on website" value={liveCount} hint={`${counts.hidden} hidden`} />
        <StatCard icon={BookOpen} tone={fullCount ? 'red' : 'neutral'} label="Fully booked" value={fullCount} hint="No seats left" />
        <StatCard icon={Tag} tone="amber" label="Running a discount" value={discounted} hint="Offer fee below regular" />
      </div>

      <Panel>
        <div className="flex flex-col gap-3 border-b border-[#6B4030]/10 p-3 sm:flex-row sm:items-center sm:justify-between">
          <Segmented
            label="Filter offerings"
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'all', label: 'All', count: counts.all },
              { value: 'workshop', label: 'Workshops', count: counts.workshop },
              { value: 'journey', label: 'Journeys', count: counts.journey },
              { value: 'hidden', label: 'Hidden', count: counts.hidden },
            ]}
          />
          <SearchInput value={search} onChange={setSearch} placeholder="Search by title, badge or pillar" />
        </div>

        {visible.length === 0 ? (
          <EmptyState
            icon={Layers}
            title={loading ? 'Loading offerings…' : 'No offerings match'}
            message={loading ? undefined : 'Try another filter or create a new workshop or journey.'}
            action={
              !loading && (
                <Button variant="primary" icon={Plus} onClick={() => onCreate(filter === 'journey' ? 'journey' : 'workshop')}>
                  Create offering
                </Button>
              )
            }
          />
        ) : (
          <>
            {/* Desktop table */}
            <table className="hidden w-full table-fixed text-left text-sm xl:table">
              <thead className="whitespace-nowrap border-b border-[#6B4030]/10 bg-[#FCFAF6] text-xs font-semibold uppercase tracking-wide text-[#6B4030]">
                <tr>
                  <th className="px-4 py-3">Offering</th>
                  <th className="w-36 px-4 py-3">Fee</th>
                  <th className="w-52 px-4 py-3">Seats</th>
                  <th className="w-32 px-4 py-3">On website</th>
                  <th className="w-36 px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#6B4030]/8">
                {visible.map(({ course, kind }) => {
                  const live = Boolean(Number(course.is_active));
                  const offer = Number(course.discount_price) || 0;
                  const regular = Number(course.original_price) || 0;
                  return (
                    <tr key={course.id} className={`transition-colors hover:bg-[#FCFAF6] ${live ? '' : 'opacity-70'}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={course.image_url || '/artisan/workshop.jpg'}
                            alt=""
                            className="h-12 w-16 shrink-0 rounded-lg object-cover"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/artisan/workshop.jpg';
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <button
                              type="button"
                              onClick={() => onEdit(course)}
                              className="block w-full truncate text-left font-semibold text-[#241A16] hover:text-[#8A6A30] cursor-pointer"
                              title={course.title}
                            >
                              {course.title}
                            </button>
                            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-[#6B4030]">
                              <Badge tone="brown" icon={kind === 'journey' ? Compass : Hammer}>
                                {kind === 'journey' ? 'Journey' : 'Workshop'}
                              </Badge>
                              <span>{course.duration}</span>
                              <span aria-hidden="true">·</span>
                              <span>{contentSummary(course, kind)}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className="block font-semibold tabular-nums text-[#241A16]">{formatINR(offer)}</span>
                        {regular > offer && (
                          <span className="block text-xs tabular-nums text-[#6B4030]/60 line-through">{formatINR(regular)}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <SeatsBar total={Number(course.seats_total) || 0} booked={Number(course.booked_seats) || 0} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={live}
                            onChange={() => onToggle(course.id, live ? 1 : 0)}
                            label={live ? 'Hide from website' : 'Show on website'}
                          />
                          <span className={`text-xs font-medium ${live ? 'text-emerald-700' : 'text-[#6B4030]/70'}`}>
                            {live ? 'Live' : 'Hidden'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="secondary" icon={Pencil} onClick={() => onEdit(course)} className="py-1.5">
                            Edit
                          </Button>
                          <IconAction icon={Trash2} label="Delete offering" tone="danger" onClick={() => onDelete(course.id, course.title)} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Mobile / tablet cards */}
            <ul className="divide-y divide-[#6B4030]/8 xl:hidden">
              {visible.map(({ course, kind }) => {
                const live = Boolean(Number(course.is_active));
                const offer = Number(course.discount_price) || 0;
                const regular = Number(course.original_price) || 0;
                return (
                  <li key={course.id} className={`space-y-3 p-4 ${live ? '' : 'opacity-70'}`}>
                    <div className="flex gap-3">
                      <img src={course.image_url || '/artisan/workshop.jpg'} alt="" className="h-14 w-16 shrink-0 rounded-lg object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 font-semibold text-[#241A16] [overflow-wrap:anywhere]">{course.title}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-[#6B4030]">
                          <Badge tone="brown">{kind === 'journey' ? 'Journey' : 'Workshop'}</Badge>
                          <span>{course.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span>
                        <span className="font-semibold tabular-nums">{formatINR(offer)}</span>
                        {regular > offer && <span className="ml-2 text-xs text-[#6B4030]/60 line-through">{formatINR(regular)}</span>}
                      </span>
                      <div className="w-40">
                        <SeatsBar total={Number(course.seats_total) || 0} booked={Number(course.booked_seats) || 0} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch checked={live} onChange={() => onToggle(course.id, live ? 1 : 0)} label={live ? 'Hide from website' : 'Show on website'} />
                        <span className={`text-xs font-medium ${live ? 'text-emerald-700' : 'text-[#6B4030]/70'}`}>{live ? 'Live' : 'Hidden'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button icon={Pencil} onClick={() => onEdit(course)} className="py-1.5">
                          Edit
                        </Button>
                        <IconAction icon={Trash2} label="Delete offering" tone="danger" onClick={() => onDelete(course.id, course.title)} />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </Panel>
    </div>
  );
}
