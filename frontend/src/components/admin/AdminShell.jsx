import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Inbox, Landmark, Layers, LogOut, Menu, MessageSquareQuote, RefreshCw, X } from 'lucide-react';

const NAV = [
  { id: 'courses', label: 'Offerings', icon: Layers },
  { id: 'registrations', label: 'Applications', icon: Inbox },
  { id: 'feedbacks', label: 'Reviews', icon: MessageSquareQuote },
  { id: 'pillars', label: 'Pillars', icon: Landmark },
];

function SidebarContent({ active, onNavigate, badges, onSync, syncing, lastSync, onLogout }) {
  return (
    <div className="flex h-full flex-col bg-white">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[#6B4030]/10">
        <img src="/artisan/logo.png" alt="Global Nagas Institute logo" className="h-10 w-auto object-contain shrink-0" />
        <div className="min-w-0">
          <p className="truncate font-['Cormorant_Garamond'] text-lg font-bold leading-tight text-[#241A16]">Global Nagas Institute</p>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#B89555]">Admin</p>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 space-y-1.5 px-3 py-3" aria-label="Admin sections">
        {NAV.map((item) => {
          const isActive = active === item.id;
          const badge = badges[item.id];
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#4A2C20] text-[#F7F2E8] shadow-sm'
                  : 'text-[#6B4030] hover:bg-[#4A2C20]/8 hover:text-[#241A16]'
              }`}
            >
              <item.icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#E5B869]' : 'text-[#6B4030]'}`} />
              <span className="flex-1">{item.label}</span>
              {badge?.count > 0 && (
                <span
                  title={badge.title}
                  className={`min-w-6 rounded-full px-1.5 py-0.5 text-center text-xs font-bold tabular-nums ${
                    isActive
                      ? 'bg-[#E5B869] text-[#241A16]'
                      : badge.alert
                      ? 'bg-[#B89555] text-white'
                      : 'bg-[#6B4030]/12 text-[#4A2C20]'
                  }`}
                >
                  {badge.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer Actions */}
      <div className="space-y-1 border-t border-[#6B4030]/10 px-3 py-3 bg-[#FAF7F0]/50">
        <button
          type="button"
          onClick={onSync}
          disabled={syncing}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium text-[#6B4030] hover:bg-[#4A2C20]/8 hover:text-[#241A16] cursor-pointer disabled:opacity-60 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin text-[#B89555]' : ''}`} />
          <span className="flex-1">{syncing ? 'Syncing…' : 'Sync now'}</span>
          <span className="text-xs text-[#6B4030]/60">{lastSync}</span>
        </button>
        <Link
          to="/"
          target="_blank"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-[#6B4030] hover:bg-[#4A2C20]/8 hover:text-[#241A16] transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          View website
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium text-[#6B4030] hover:bg-red-50 hover:text-red-700 cursor-pointer transition-colors"
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
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-[#6B4030]/15 bg-white lg:block shadow-2xs">
        <SidebarContent {...shared} onNavigate={onNavigate} />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#6B4030]/15 bg-[#F7F2E8] px-4 py-2.5 lg:hidden shadow-2xs">
        <div className="flex items-center gap-2.5">
          <img src="/artisan/logo.png" alt="Global Nagas Institute logo" className="h-9 sm:h-10 w-auto object-contain shrink-0" />
          <span className="font-['Cormorant_Garamond'] text-xl sm:text-2xl font-bold tracking-tight text-[#4A2C20] truncate">Global Nagas Institute</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="rounded-lg p-2 text-[#4A2C20] hover:bg-[#4A2C20]/10 cursor-pointer shrink-0"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-2xs" onClick={() => setMobileOpen(false)} />
          <aside className="relative h-full w-72 max-w-[85vw] border-r border-[#6B4030]/15 bg-white shadow-xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-5 rounded-lg p-1.5 text-[#6B4030] hover:bg-[#4A2C20]/10 cursor-pointer"
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
