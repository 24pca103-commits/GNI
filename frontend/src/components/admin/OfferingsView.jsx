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
  Select,
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
  const options = Array.isArray(course.durations) ? course.durations.length : 0;
  const extra = options > 1 ? ` · ${options} durations` : '';
  if (kind === 'journey') {
    const n = parseJourneyPhases(course.highlights, getDayCount(course.duration)).length;
    return `${n} ${n === 1 ? 'phase' : 'phases'}${extra}`;
  }
  const n = parseWorkshopModules(course.highlights).length;
  return `${n} ${n === 1 ? 'step' : 'steps'}${extra}`;
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
            <Button icon={Hammer} onClick={() => onCreate('workshop')} className="flex-1 sm:flex-initial">
              New workshop
            </Button>
            <Button variant="primary" icon={Compass} onClick={() => onCreate('journey')} className="flex-1 sm:flex-initial">
              New journey
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        <StatCard icon={Layers} label="Total offerings" value={rows.length} hint={`${counts.workshop} workshops · ${counts.journey} journeys`} />
        <StatCard icon={Eye} tone="green" label="Live on website" value={liveCount} hint={`${counts.hidden} hidden`} />
        <StatCard icon={BookOpen} tone={fullCount ? 'red' : 'neutral'} label="Fully booked" value={fullCount} hint="No seats left" />
        <StatCard icon={Tag} tone="amber" label="Running a discount" value={discounted} hint="Offer fee below regular" />
      </div>

      <Panel>
        <div className="flex flex-col gap-3 border-b border-[#6B4030]/10 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label htmlFor="offering-filter-select" className="text-xs font-semibold uppercase tracking-wider text-[#6B4030]/80 shrink-0">
              Category:
            </label>
            <Select
              id="offering-filter-select"
              label="Filter offerings"
              value={filter}
              onChange={setFilter}
              className="w-full sm:w-auto font-medium"
            >
              <option value="all">All offerings ({counts.all})</option>
              <option value="workshop">Workshops ({counts.workshop})</option>
              <option value="journey">Journeys ({counts.journey})</option>
              <option value="hidden">Hidden from website ({counts.hidden})</option>
            </Select>
          </div>
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

            {/* Mobile / tablet cards with clear spacing and boundaries */}
            <div className="p-3 sm:p-4 space-y-3.5 xl:hidden bg-[#FAF7F0]/40">
              {visible.map(({ course, kind }) => {
                const live = Boolean(Number(course.is_active));
                const offer = Number(course.discount_price) || 0;
                const regular = Number(course.original_price) || 0;
                return (
                  <article
                    key={course.id}
                    className={`rounded-2xl border border-[#6B4030]/15 bg-white p-4 shadow-xs space-y-3.5 transition-all hover:border-[#B89555]/50 hover:shadow-sm ${
                      live ? '' : 'opacity-75 bg-[#FAF7F0]/60'
                    }`}
                  >
                    <div className="flex gap-3">
                      <img
                        src={course.image_url || '/artisan/workshop.jpg'}
                        alt=""
                        className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-xl object-cover border border-[#6B4030]/10"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/artisan/workshop.jpg';
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() => onEdit(course)}
                          className="block w-full text-left line-clamp-2 font-semibold text-sm sm:text-base text-[#241A16] hover:text-[#8A6A30] cursor-pointer [overflow-wrap:anywhere]"
                        >
                          {course.title}
                        </button>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-[#6B4030]">
                          <Badge tone="brown" icon={kind === 'journey' ? Compass : Hammer}>
                            {kind === 'journey' ? 'Journey' : 'Workshop'}
                          </Badge>
                          <span>{course.duration}</span>
                          <span aria-hidden="true">·</span>
                          <span>{contentSummary(course, kind)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 pt-1 border-t border-[#6B4030]/8">
                      <div>
                        <span className="font-bold text-base sm:text-lg tabular-nums text-[#241A16]">{formatINR(offer)}</span>
                        {regular > offer && (
                          <span className="ml-2 text-xs tabular-nums text-[#6B4030]/60 line-through">{formatINR(regular)}</span>
                        )}
                      </div>
                      <div className="w-full sm:w-48 sm:max-w-[200px]">
                        <SeatsBar total={Number(course.seats_total) || 0} booked={Number(course.booked_seats) || 0} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#6B4030]/8">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={live}
                          onChange={() => onToggle(course.id, live ? 1 : 0)}
                          label={live ? 'Hide from website' : 'Show on website'}
                        />
                        <span className={`text-xs font-semibold ${live ? 'text-emerald-700' : 'text-[#6B4030]/70'}`}>
                          {live ? 'Live' : 'Hidden'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="secondary"
                          icon={Pencil}
                          onClick={() => onEdit(course)}
                          className="py-1 px-3 text-xs sm:text-sm"
                        >
                          Edit
                        </Button>
                        <IconAction
                          icon={Trash2}
                          label="Delete offering"
                          tone="danger"
                          onClick={() => onDelete(course.id, course.title)}
                        />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </Panel>
    </div>
  );
}
