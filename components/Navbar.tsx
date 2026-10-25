'use client';

import React from 'react';
import { Terminal, Code2, ListOrdered, History, PlusCircle, Server, CheckCircle2 } from 'lucide-react';

export type ActiveTab = 'problems' | 'workspace' | 'submissions' | 'create' | 'specs';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  selectedProblemCode?: string;
}

export function Navbar({ activeTab, onTabChange, selectedProblemCode }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onTabChange('problems')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white font-mono">VNOJ</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Chấm thật
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Online Judge Backend Thật</p>
            </div>
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onTabChange('problems')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'problems'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ListOrdered className="w-4 h-4 text-indigo-400" />
            <span>Bài Tập</span>
          </button>

          <button
            onClick={() => onTabChange('workspace')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'workspace'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span>Làm Bài</span>
            {selectedProblemCode && (
              <span className="hidden md:inline-block text-[11px] font-mono px-1.5 py-0.2 text-indigo-300 bg-indigo-500/20 rounded">
                {selectedProblemCode}
              </span>
            )}
          </button>

          <button
            onClick={() => onTabChange('submissions')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'submissions'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <History className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Lịch Sử Nộp</span>
            <span className="sm:hidden">Bài Nộp</span>
          </button>

          <button
            onClick={() => onTabChange('create')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'create'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Tạo Đề Mới</span>
            <span className="sm:hidden">Tạo Đề</span>
          </button>
        </nav>

        {/* Right side status badge */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onTabChange('specs')}
            title="Xem thông tin môi trường chấm"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/60 text-slate-300 hover:text-white text-xs transition-colors"
          >
            <Server className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline font-mono">GCC 12 · Py 3.10 · Node 22</span>
            <span className="md:hidden">Specs</span>
          </button>
        </div>
      </div>
    </header>
  );
}
