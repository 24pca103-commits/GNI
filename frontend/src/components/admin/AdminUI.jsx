import React from 'react';
import { Search, X } from 'lucide-react';

/** Shared building blocks for the admin dashboard. */

export function PageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-['Cormorant_Garamond'] text-3xl font-bold leading-tight text-[#241A16]">{title}</h1>
        {description && <p className="mt-1 text-sm text-[#6B4030]">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Button({ variant = 'secondary', icon: Icon, children, className = '', ...props }) {
  const variants = {
    primary: 'bg-[#4A2C20] text-[#F7F2E8] hover:bg-[#603929] border border-[#4A2C20]',
    secondary: 'bg-white text-[#4A2C20] hover:bg-[#FAF7F0] border border-[#6B4030]/20',
    ghost: 'bg-transparent text-[#4A2C20] hover:bg-[#4A2C20]/5 border border-transparent',
    danger: 'bg-white text-red-700 hover:bg-red-50 border border-red-200',
    success: 'bg-emerald-700 text-white hover:bg-emerald-800 border border-emerald-700',
  };
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B89555] ${variants[variant]} ${className}`}
    >
      {Icon && <Icon className={`h-4 w-4 shrink-0 ${variant === 'primary' ? 'text-[#E5B869]' : ''}`} />}
      {children}
    </button>
  );
}

export function IconAction({ icon: Icon, label, onClick, tone = 'neutral', disabled }) {
  const tones = {
    neutral: 'text-[#6B4030] hover:bg-[#FAF7F0] hover:text-[#241A16]',
    danger: 'text-[#6B4030]/70 hover:bg-red-50 hover:text-red-600',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`rounded-lg p-2 transition-colors cursor-pointer disabled:opacity-40 ${tones[tone]}`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

export function StatCard({ label, value, hint, icon: Icon, tone = 'neutral', onClick, active }) {
  const tones = {
    neutral: 'bg-[#FAF7F0] text-[#4A2C20]',
    amber: 'bg-amber-50 text-amber-700',
    green: 'bg-emerald-50 text-emerald-700',
    red: 'bg-red-50 text-red-700',
  };
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`flex items-center gap-3.5 rounded-2xl border bg-white p-4 text-left transition-colors ${
        onClick ? 'cursor-pointer hover:border-[#B89555]/60' : ''
      } ${active ? 'border-[#4A2C20] ring-2 ring-[#B89555]/30' : 'border-[#6B4030]/12'}`}
    >
      {Icon && (
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </span>
      )}
      <span className="min-w-0">
        <span className="block text-xs font-medium text-[#6B4030]">{label}</span>
        <span className="block text-2xl font-bold tabular-nums leading-tight text-[#241A16]">{value}</span>
        {hint && <span className="block truncate text-xs text-[#6B4030]/80">{hint}</span>}
      </span>
    </Tag>
  );
}

export function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B4030]/50" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#6B4030]/20 bg-white py-2 pl-9 pr-8 text-sm text-[#241A16] placeholder:text-[#6B4030]/50 focus:border-[#B89555] focus:outline-none focus:ring-2 focus:ring-[#B89555]/20"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#6B4030]/60 hover:text-[#241A16] cursor-pointer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

export function Segmented({ options, value, onChange, label }) {
  return (
    <div role="tablist" aria-label={label} className="inline-flex max-w-full flex-wrap gap-0.5 rounded-xl border border-[#6B4030]/15 bg-white p-1">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
              active ? 'bg-[#4A2C20] text-white' : 'text-[#6B4030] hover:text-[#241A16]'
            }`}
          >
            {o.label}
            {o.count !== undefined && (
              <span
                className={`rounded-full px-1.5 text-xs tabular-nums ${active ? 'bg-white/15 text-[#E5B869]' : 'bg-[#FAF7F0] text-[#6B4030]'}`}
              >
                {o.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function Select({ value, onChange, children, label }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className="max-w-full rounded-xl border border-[#6B4030]/20 bg-white py-2 pl-3 pr-8 text-sm text-[#241A16] focus:border-[#B89555] focus:outline-none focus:ring-2 focus:ring-[#B89555]/20 cursor-pointer"
    >
      {children}
    </select>
  );
}

const BADGE_TONES = {
  green: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  amber: 'bg-amber-50 text-amber-800 ring-amber-200',
  red: 'bg-red-50 text-red-700 ring-red-200',
  brown: 'bg-[#4A2C20]/8 text-[#4A2C20] ring-[#4A2C20]/15',
  gray: 'bg-stone-100 text-stone-600 ring-stone-200',
};

export function Badge({ tone = 'gray', children, icon: Icon }) {
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${BADGE_TONES[tone]}`}>
      {Icon && <Icon className="h-3 w-3" />}
      {children}
    </span>
  );
}

export function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      title={label}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B89555] ${
        checked ? 'bg-emerald-600' : 'bg-stone-300'
      }`}
    >
      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );
}

export function Panel({ children, className = '' }) {
  return <div className={`overflow-hidden rounded-2xl border border-[#6B4030]/12 bg-white ${className}`}>{children}</div>;
}

export function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      {Icon && (
        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FAF7F0] text-[#B89555]">
          <Icon className="h-6 w-6" />
        </span>
      )}
      <p className="font-semibold text-[#241A16]">{title}</p>
      {message && <p className="mt-1 max-w-sm text-sm text-[#6B4030]">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
