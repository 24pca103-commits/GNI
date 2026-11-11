import React from 'react';
import { AlertCircle, Plus } from 'lucide-react';

/**
 * Form building blocks shared by the admin editors (offerings, pillars):
 * labelled fields with hint, live character counter and error message.
 */

export function Counter({ value, limit }) {
  if (!limit) return null;
  const len = String(value ?? '').length;
  const over = len > limit.max;
  const under = len > 0 && len < limit.min;
  const near = !over && len >= limit.max * 0.9;
  return (
    <span
      className={`text-[11px] tabular-nums ${
        over || under ? 'text-red-600 font-semibold' : near ? 'text-amber-700 font-semibold' : 'text-[#6B4030]/60'
      }`}
    >
      {len}/{limit.max}
    </span>
  );
}

export function Field({ label, required, optional, hint, value, limit, error, children, htmlFor }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-end justify-between gap-3">
        <label htmlFor={htmlFor} className="text-[13px] font-semibold text-[#241A16]">
          {label}
          {required && <span className="text-red-600"> *</span>}
          {optional && <span className="ml-1 font-normal text-[#6B4030]/60">(optional)</span>}
        </label>
        <Counter value={value} limit={limit} />
      </div>
      {children}
      {error ? (
        <p className="flex items-start gap-1.5 text-xs font-medium text-red-600">
          <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      ) : (
        hint && <p className="text-xs leading-relaxed text-[#6B4030]/80">{hint}</p>
      )}
    </div>
  );
}

export function Section({ id, number, icon: Icon, title, description, children }) {
  return (
    <section id={`oe-section-${id}`} className="scroll-mt-4 rounded-2xl border border-[#6B4030]/12 bg-white">
      <header className="flex items-start gap-3 border-b border-[#6B4030]/10 px-3.5 py-3 sm:px-6 sm:py-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#4A2C20] text-[#E5B869]">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <h3 className="text-[15px] font-bold text-[#241A16]">
            <span className="mr-1.5 text-[#B89555]">{number}.</span>
            {title}
          </h3>
          <p className="mt-0.5 text-xs leading-relaxed text-[#6B4030]">{description}</p>
        </div>
      </header>
      <div className="space-y-4 px-3 py-3.5 sm:space-y-5 sm:px-6 sm:py-5">{children}</div>
    </section>
  );
}

export function IconButton({ onClick, title, children, tone = 'neutral', disabled }) {
  const tones = {
    neutral: 'text-[#6B4030] hover:bg-[#FAF7F0] hover:text-[#241A16]',
    danger: 'text-red-500 hover:bg-red-50 hover:text-red-700',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      disabled={disabled}
      className={`rounded-lg p-1.5 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 ${tones[tone]}`}
    >
      {children}
    </button>
  );
}

export function AddButton({ onClick, disabled, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-[#B89555]/70 bg-[#FAF7F0] px-3.5 py-2 text-xs font-semibold text-[#4A2C20] transition-colors hover:border-[#B89555] hover:bg-[#F3EBDC] cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Plus className="h-3.5 w-3.5 text-[#B89555]" />
      {children}
    </button>
  );
}
