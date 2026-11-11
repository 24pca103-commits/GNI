import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, ArrowDown, ArrowUp, Landmark, Loader2, Pencil, Plus, Trash2, UploadCloud, X } from 'lucide-react';
import { createPillar, updatePillar, uploadOfferingImage } from '../../services/api';
import { Badge, Button, EmptyState, IconAction, PageHeader, Panel, Switch } from './AdminUI';
import { Field } from './FormUI';
import { inputClass } from './adminFormat';
import { MAX_PILLAR_TAGS, PILLAR_IMAGES, PILLAR_LIMITS as L } from './offeringLimits';

const isActive = (p) => p.is_active === true || Number(p.is_active) === 1;
const tagsOf = (p) => (Array.isArray(p.tags) ? p.tags : String(p.tags || '').split(',').map((t) => t.trim()).filter(Boolean));
const splitTags = (text) => text.split(',').map((t) => t.trim()).filter(Boolean);

function checkText(errors, key, value, limit, label, required) {
  const n = String(value || '').trim().length;
  if (required && n === 0) errors[key] = `${label} is required.`;
  else if (n > 0 && n < limit.min) errors[key] = `${label} needs at least ${limit.min} characters (${n} now).`;
  else if (n > limit.max) errors[key] = `${label} must be ${limit.max} characters or fewer (${n} now).`;
}

function validate(f) {
  const e = {};
  checkText(e, 'title', f.title, L.title, 'Title', true);
  checkText(e, 'category', f.category, L.category, 'Category', true);
  checkText(e, 'badge', f.badge, L.badge, 'Badge', false);
  checkText(e, 'description', f.description, L.description, 'Description', true);
  checkText(e, 'subjects', f.subjects, L.subjects, 'Modules & practicals', false);
  const tags = splitTags(f.tags);
  if (tags.length > MAX_PILLAR_TAGS) e.tags = `Use at most ${MAX_PILLAR_TAGS} tags (${tags.length} now).`;
  else if (tags.some((t) => t.length < L.tag.min || t.length > L.tag.max))
    e.tags = `Each tag must be ${L.tag.min}–${L.tag.max} characters.`;
  if (!f.image.trim()) e.image = 'Choose an image for the pillar card.';
  return e;
}

function PillarEditor({ pillar, nextOrder, onClose, onSaved }) {
  const [form, setForm] = useState(() => ({
    title: pillar?.title || '',
    category: pillar?.category || '',
    badge: pillar?.badge || '',
    description: pillar?.description || '',
    subjects: pillar?.subjects || '',
    tags: tagsOf(pillar || {}).join(', '),
    image: pillar?.image || '',
    is_active: pillar ? isActive(pillar) : true,
  }));
  const [showErrors, setShowErrors] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const fileRef = useRef(null);
  const errors = useMemo(() => validate(form), [form]);
  const err = (k) => (showErrors ? errors[k] : undefined);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && !saving && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, saving]);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 5 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setSubmitError('Choose a JPG, PNG or WEBP image under 5 MB.');
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      let url = reader.result;
      try {
        const res = await uploadOfferingImage(reader.result, file.name);
        if (res?.url) url = res.url;
      } catch (_) {
        // keep the inline image if the upload endpoint is unavailable
      }
      set('image', url);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const save = async () => {
    setShowErrors(true);
    setSubmitError('');
    if (Object.keys(errors).length) return;
    const payload = {
      title: form.title.trim(),
      category: form.category.trim(),
      badge: form.badge.trim(),
      description: form.description.trim(),
      subjects: form.subjects.trim(),
      tags: splitTags(form.tags),
      image: form.image.trim(),
      is_active: form.is_active ? 1 : 0,
      ...(pillar ? {} : { display_order: nextOrder }),
    };
    setSaving(true);
    try {
      if (pillar) {
        await updatePillar(pillar.id, payload);
      } else {
        const res = await createPillar(payload);
        // New pillars are created visible; apply the switch if it was turned off
        if (!payload.is_active && res?.data?.id) await updatePillar(res.data.id, { is_active: 0 });
      }
      onSaved(pillar ? 'Pillar updated.' : 'Pillar added.');
    } catch (e) {
      setSubmitError(e.message || 'Saving failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const tags = splitTags(form.tags);

  return (
    <div className="fixed inset-0 z-[60] flex items-stretch justify-center bg-[#241A16]/60 backdrop-blur-sm sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="pillar-editor-title">
      <div className="flex max-h-full w-full max-w-3xl flex-col overflow-hidden bg-[#F7F2E8] shadow-2xl sm:max-h-[92vh] sm:rounded-3xl">
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-[#6B4030]/15 bg-white px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#B89555]">{pillar ? 'Edit pillar' : 'New pillar'}</p>
            <h2 id="pillar-editor-title" className="truncate font-['Cormorant_Garamond'] text-2xl font-bold text-[#241A16]">
              {form.title.trim() || 'Untitled pillar'}
            </h2>
          </div>
          <IconAction icon={X} label="Close" onClick={onClose} />
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
          <div className="space-y-5 rounded-2xl border border-[#6B4030]/12 bg-white p-5 sm:p-6">
            <Field
              label="Title"
              required
              htmlFor="pe-title"
              value={form.title}
              limit={L.title}
              error={err('title')}
              hint={`${L.title.min}–${L.title.max} characters. Shown on the pillar card and in the Register page "Skill pillar" list. Renaming also updates the offerings in this pillar.`}
            >
              <input id="pe-title" type="text" value={form.title} maxLength={L.title.max} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Painting & Natural Mineral Pigments" className={inputClass(err('title'))} />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Category" required htmlFor="pe-cat" value={form.category} limit={L.category} error={err('category')} hint="Small gold line above the title, e.g. “Art & Heritage”.">
                <input id="pe-cat" type="text" value={form.category} maxLength={L.category.max} onChange={(e) => set('category', e.target.value)} placeholder="e.g. Art & Heritage" className={inputClass(err('category'))} />
              </Field>
              <Field label="Badge" optional htmlFor="pe-badge" value={form.badge} limit={L.badge} error={err('badge')} hint="Label on the photo, e.g. “Core Studio Track”.">
                <input id="pe-badge" type="text" value={form.badge} maxLength={L.badge.max} onChange={(e) => set('badge', e.target.value)} placeholder="e.g. Core Studio Track" className={inputClass(err('badge'))} />
              </Field>
            </div>

            <Field label="Description" required htmlFor="pe-desc" value={form.description} limit={L.description} error={err('description')} hint={`${L.description.min}–${L.description.max} characters. One sentence about what this pillar covers.`}>
              <textarea id="pe-desc" rows={2} value={form.description} maxLength={L.description.max} onChange={(e) => set('description', e.target.value)} placeholder="e.g. Prehistoric rock painting, temple murals, sketching and deity iconography." className={inputClass(err('description'), 'resize-none leading-relaxed')} />
            </Field>

            <Field label="Modules & practicals" optional htmlFor="pe-subj" value={form.subjects} limit={L.subjects} error={err('subjects')} hint="Short list shown in the “Modules & Practicals” box on the card.">
              <input id="pe-subj" type="text" value={form.subjects} maxLength={L.subjects.max} onChange={(e) => set('subjects', e.target.value)} placeholder="e.g. Rock art, temple murals, sketching & iconography" className={inputClass(err('subjects'))} />
            </Field>

            <Field label="Tags" optional htmlFor="pe-tags" error={err('tags')} hint={`Separate with commas. Up to ${MAX_PILLAR_TAGS} tags, ${L.tag.min}–${L.tag.max} characters each.`}>
              <input id="pe-tags" type="text" value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="e.g. Rock Painting, Temple Murals, Sketching" className={inputClass(err('tags'))} />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tags.map((t, i) => (
                    <span key={`${t}-${i}`} className={`rounded-md border px-2 py-0.5 text-xs ${i >= MAX_PILLAR_TAGS || t.length > L.tag.max ? 'border-red-300 bg-red-50 text-red-700' : 'border-[#6B4030]/20 bg-[#F7F2E8] text-[#6B4030]'}`}>
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </Field>
          </div>

          <div className="space-y-3 rounded-2xl border border-[#6B4030]/12 bg-white p-5 sm:p-6">
            <div className="flex items-end justify-between">
              <span className="text-[13px] font-semibold text-[#241A16]">
                Card image <span className="text-red-600">*</span>
              </span>
              {uploading && <Loader2 className="h-4 w-4 animate-spin text-[#B89555]" />}
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {PILLAR_IMAGES.map((img) => (
                <button
                  key={img.url}
                  type="button"
                  onClick={() => set('image', img.url)}
                  className={`overflow-hidden rounded-xl border text-left cursor-pointer ${form.image === img.url ? 'border-[#4A2C20] ring-2 ring-[#B89555]/40' : 'border-[#6B4030]/15 hover:border-[#B89555]'}`}
                >
                  <img src={img.url} alt="" className="h-14 w-full object-cover" />
                  <span className="block truncate px-1.5 py-1 text-[10px] text-[#4A2C20]">{img.label}</span>
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFile} className="hidden" />
              <Button icon={UploadCloud} onClick={() => fileRef.current?.click()} disabled={uploading}>
                Upload image
              </Button>
              {form.image && !PILLAR_IMAGES.some((i) => i.url === form.image) && (
                <img src={form.image} alt="Selected" className="h-10 w-14 rounded-lg object-cover" />
              )}
              <span className="text-xs text-[#6B4030]/80">Landscape, JPG / PNG / WEBP, up to 5 MB.</span>
            </div>
            {err('image') && <p className="text-xs font-medium text-red-600">{err('image')}</p>}
          </div>

          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-[#6B4030]/12 bg-white p-5 sm:p-6">
            <span>
              <span className="block text-[13px] font-semibold text-[#241A16]">Visible on website</span>
              <span className="block text-xs text-[#6B4030]/80">Hidden pillars disappear from the home page and the Register page.</span>
            </span>
            <Switch checked={form.is_active} onChange={() => set('is_active', !form.is_active)} label="Visible on website" />
          </label>
        </div>

        <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-[#6B4030]/15 bg-white px-5 py-3 sm:px-6">
          <span className="min-w-0 text-xs">
            {submitError ? (
              <span className="inline-flex items-center gap-1.5 font-semibold text-red-600">
                <AlertCircle className="h-4 w-4" />
                {submitError}
              </span>
            ) : showErrors && Object.keys(errors).length ? (
              <span className="font-semibold text-red-600">Some fields need attention. They are marked in red.</span>
            ) : (
              <span className="text-[#6B4030]/80">Fields marked * are required.</span>
            )}
          </span>
          <div className="flex items-center gap-2">
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={save} disabled={saving || uploading}>
              {saving ? 'Saving…' : pillar ? 'Save changes' : 'Add pillar'}
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function PillarsView({ pillars, courses, loading, onChanged, onDelete, notify }) {
  const [editing, setEditing] = useState(null); // null | 'new' | pillar
  const [busyId, setBusyId] = useState(null);

  const ordered = useMemo(
    () => [...pillars].sort((a, b) => Number(a.display_order || 0) - Number(b.display_order || 0) || Number(a.id) - Number(b.id)),
    [pillars]
  );
  const offeringsIn = (p) => courses.filter((c) => String(c.pillar_id) === String(p.id)).length;

  const run = async (id, action) => {
    setBusyId(id);
    try {
      await action();
      await onChanged();
    } catch (e) {
      notify(e.message || 'Something went wrong.', true);
    } finally {
      setBusyId(null);
    }
  };

  // Rewrites display order 1..n so moving always works, even after deletions
  const move = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= ordered.length) return;
    const next = [...ordered];
    [next[index], next[target]] = [next[target], next[index]];
    run(ordered[index].id, async () => {
      await Promise.all(next.map((p, i) => (Number(p.display_order) === i + 1 ? null : updatePillar(p.id, { display_order: i + 1 }))));
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Heritage pillars"
        description="The skill pillars on the home page and in the Register page “Skill pillar” list. Offerings are grouped under them."
        actions={
          <Button variant="primary" icon={Plus} onClick={() => setEditing('new')}>
            New pillar
          </Button>
        }
      />

      <Panel>
        {ordered.length === 0 ? (
          <EmptyState icon={Landmark} title={loading ? 'Loading pillars…' : 'No pillars yet'} message={loading ? undefined : 'Add the first heritage pillar.'} />
        ) : (
          <ul className="divide-y divide-[#6B4030]/8">
            {ordered.map((p, i) => {
              const live = isActive(p);
              const count = offeringsIn(p);
              const busy = busyId === p.id;
              return (
                <li key={p.id} className={`flex flex-col gap-3 p-3.5 sm:p-4 sm:flex-row sm:items-center ${live ? '' : 'opacity-70'}`}>

                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="flex flex-col">
                      <IconAction icon={ArrowUp} label="Move up" onClick={() => move(i, -1)} disabled={i === 0 || busy} />
                      <IconAction icon={ArrowDown} label="Move down" onClick={() => move(i, 1)} disabled={i === ordered.length - 1 || busy} />
                    </div>
                    <img src={p.image || '/artisan/pillar-painting.jpg'} alt="" className="h-12 w-16 sm:h-14 sm:w-20 shrink-0 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#B89555]">
                        {i + 1}. {p.category}
                      </p>
                      <button type="button" onClick={() => setEditing(p)} className="block max-w-full truncate text-left font-semibold text-[#241A16] hover:text-[#8A6A30] cursor-pointer" title={p.title}>
                        {p.title}
                      </button>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        <Badge tone={count ? 'brown' : 'gray'}>
                          {count} {count === 1 ? 'offering' : 'offerings'}
                        </Badge>
                        {tagsOf(p).slice(0, 3).map((t) => (
                          <span key={t} className="hidden text-xs text-[#6B4030]/80 sm:inline">
                            · {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 sm:justify-end">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={live}
                        onChange={() => run(p.id, () => updatePillar(p.id, { is_active: live ? 0 : 1 }))}
                        label={live ? 'Hide from website' : 'Show on website'}
                      />
                      <span className={`w-12 text-xs font-medium ${live ? 'text-emerald-700' : 'text-[#6B4030]/70'}`}>{live ? 'Live' : 'Hidden'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button icon={Pencil} onClick={() => setEditing(p)} className="py-1 px-2.5 sm:px-3 text-xs sm:text-sm">
                        Edit
                      </Button>
                      <IconAction icon={Trash2} label="Delete pillar" tone="danger" onClick={() => onDelete(p, count)} disabled={busy} />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>

      {editing && (
        <PillarEditor
          pillar={editing === 'new' ? null : editing}
          nextOrder={ordered.length + 1}
          onClose={() => setEditing(null)}
          onSaved={async (msg) => {
            setEditing(null);
            await onChanged();
            notify(msg);
          }}
        />
      )}
    </div>
  );
}
