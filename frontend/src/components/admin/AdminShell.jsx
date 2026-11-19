import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { ExternalLink, Inbox, Landmark, Layers, LogOut, Menu, MessageSquareQuote, RefreshCw, X } from 'lucide-react';

const NAV = [
  { id: 'courses', label: 'Offerings', icon: Layers },
  { id: 'registrations', label: 'Applications', icon: Inbox },
  { id: 'feedbacks', label: 'Reviews', icon: MessageSquareQuote },
  { id: 'pillars', label: 'Pillars', icon: Landmark },
];

function SidebarContent({ active, onNavigate, badges, onSync, syncing, lastSync, onLogout, onClose }) {
  return (
    <div className="flex h-full min-h-full flex-col bg-white">
      {/* Brand Header */}
      <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-4 sm:py-5 border-b border-[#6B4030]/10 shrink-0 bg-white">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <img src="/artisan/logo.png" alt="Global Nagas Institute logo" className="h-9 sm:h-10 w-auto object-contain shrink-0" />
          <div className="min-w-0">
            <p className="truncate font-['Cormorant_Garamond'] text-base sm:text-lg font-bold leading-tight text-[#241A16]">Global Nagas Institute</p>
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#B89555]">Admin Workspace</p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="lg:hidden rounded-lg p-1.5 text-[#6B4030] hover:bg-[#4A2C20]/10 hover:text-[#241A16] cursor-pointer shrink-0 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Nav List */}
      <nav className="flex-1 space-y-1.5 px-3 py-3 overflow-y-auto overscroll-contain bg-white" aria-label="Admin sections">
        {NAV.map((item) => {
          const isActive = active === item.id;
          const badge = badges[item.id];
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onNavigate(item.id);
                if (onClose) onClose();
              }}
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
      <div className="space-y-1 border-t border-[#6B4030]/10 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0.75rem))] bg-[#FAF7F0] shrink-0">
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

  // Bulletproof mobile scroll lock: freeze body with position fixed so background cannot scroll
  useEffect(() => {
    if (mobileOpen) {
      const scrollY = window.scrollY;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      const originalWidth = document.body.style.width;
      const originalOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;

      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.top = originalTop;
        document.body.style.width = originalWidth;
        window.scrollTo(0, scrollY);
      };
    }
  }, [mobileOpen]);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#F7F2E8] font-['DM_Sans'] text-[#241A16]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-[#6B4030]/15 bg-white lg:block shadow-2xs">
        <SidebarContent {...shared} onNavigate={onNavigate} />
      </aside>

      {/* Mobile & Tablet top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#6B4030]/15 bg-[#F7F2E8]/95 backdrop-blur-md px-3 sm:px-4 py-2.5 lg:hidden shadow-xs w-full max-w-full">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1 mr-2">
          <img src="/artisan/logo.png" alt="Global Nagas Institute logo" className="h-8 sm:h-9 w-auto object-contain shrink-0" />
          <span className="font-['Cormorant_Garamond'] text-base sm:text-lg md:text-xl font-bold tracking-tight text-[#4A2C20] truncate">
            Global Nagas Institute
          </span>
          <span className="hidden sm:inline-block rounded-md bg-[#4A2C20]/8 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#B89555] shrink-0">
            Admin
          </span>
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

      {/* Mobile & Tablet Drawer Modal - Rendered via Portal directly into document.body */}
      {mobileOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9990] lg:hidden" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
              onClick={() => setMobileOpen(false)}
              onTouchMove={(e) => e.preventDefault()}
            />
            {/* Fixed Sidebar Drawer - 100% viewport height, anchored top: 0 to bottom: 0 */}
            <aside className="fixed inset-y-0 left-0 z-10 flex flex-col w-72 max-w-[85vw] h-full h-[100dvh] min-h-[100dvh] max-h-[100dvh] bg-white shadow-2xl border-r border-[#6B4030]/15 overscroll-contain">
              <SidebarContent
                {...shared}
                onClose={() => setMobileOpen(false)}
                onNavigate={(id) => {
                  setMobileOpen(false);
                  onNavigate(id);
                }}
              />
            </aside>
          </div>,
          document.body
        )}

      <main className="w-full max-w-full min-w-0 lg:pl-64">
        <div className="mx-auto max-w-6xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-10 min-w-0">{children}</div>
      </main>
    </div>
  );
}
