import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Inbox, Layers, LogOut, Menu, MessageSquareQuote, RefreshCw, X } from 'lucide-react';

const NAV = [
  { id: 'courses', label: 'Offerings', icon: Layers },
  { id: 'registrations', label: 'Applications', icon: Inbox },
  { id: 'feedbacks', label: 'Reviews', icon: MessageSquareQuote },
];

function SidebarContent({ active, onNavigate, badges, onSync, syncing, lastSync, onLogout }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-5">
        <img src="/artisan/logo.png" alt="" className="h-10 w-10 rounded-xl bg-[#F7F2E8] object-contain p-1" />
        <div className="min-w-0">
          <p className="truncate font-['Cormorant_Garamond'] text-lg font-bold leading-tight text-white">Global Nagas Institute</p>
          <p className="text-xs text-[#E5B869]">Admin</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2" aria-label="Admin sections">
        {NAV.map((item) => {
          const isActive = active === item.id;
          const badge = badges[item.id];
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors cursor-pointer ${
                isActive ? 'bg-white/12 text-white' : 'text-[#F7F2E8]/70 hover:bg-white/6 hover:text-white'
              }`}
            >
              <item.icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#E5B869]' : ''}`} />
              <span className="flex-1">{item.label}</span>
              {badge?.count > 0 && (
                <span
                  title={badge.title}
                  className={`min-w-6 rounded-full px-1.5 py-0.5 text-center text-xs font-semibold tabular-nums ${
                    badge.alert ? 'bg-[#B89555] text-[#241A16]' : 'bg-white/10 text-[#F7F2E8]/80'
                  }`}
                >
                  {badge.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-white/10 px-3 py-3">
        <button
          type="button"
          onClick={onSync}
          disabled={syncing}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-[#F7F2E8]/70 hover:bg-white/6 hover:text-white cursor-pointer disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          <span className="flex-1">{syncing ? 'Syncing…' : 'Sync now'}</span>
          <span className="text-xs text-[#F7F2E8]/45">{lastSync}</span>
        </button>
        <Link
          to="/"
          target="_blank"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#F7F2E8]/70 hover:bg-white/6 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" />
          View website
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-[#F7F2E8]/70 hover:bg-red-500/15 hover:text-red-200 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}

export default function AdminShell({ active, onNavigate, badges, onSync, syncing, lastSync, onLogout, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const shared = { active, badges, onSync, syncing, lastSync, onLogout };

  return (
    <div className="min-h-screen bg-[#F7F2E8] font-['DM_Sans'] text-[#241A16]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-[#241A16] lg:block">
        <SidebarContent {...shared} onNavigate={onNavigate} />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#6B4030]/15 bg-[#241A16] px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2.5">
          <img src="/artisan/logo.png" alt="" className="h-8 w-8 rounded-lg bg-[#F7F2E8] object-contain p-0.5" />
          <span className="font-['Cormorant_Garamond'] text-lg font-bold text-white">GNI Admin</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="rounded-lg p-2 text-[#F7F2E8] hover:bg-white/10 cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative h-full w-72 max-w-[85vw] bg-[#241A16]">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-5 rounded-lg p-1.5 text-[#F7F2E8]/70 hover:bg-white/10 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent
              {...shared}
              onNavigate={(id) => {
                setMobileOpen(false);
                onNavigate(id);
              }}
            />
          </aside>
        </div>
      )}

      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">{children}</div>
      </main>
    </div>
  );
}
