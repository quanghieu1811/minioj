'use client';

import React, { useRef, useEffect } from 'react';
import { SupportedLanguage } from '@/lib/judge-engine';
import { RotateCcw, Copy, Check, Maximize2, Minimize2, Type } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onResetCode: () => void;
  onRunCode: () => void;
  onSubmitCode: () => void;
  isJudging: boolean;
  isRunning: boolean;
}

export function CodeEditor({
  code,
  onChange,
  language,
  onLanguageChange,
  onResetCode,
  onRunCode,
  onSubmitCode,
  isJudging,
  isRunning,
}: CodeEditorProps) {
  const [copied, setCopied] = React.useState(false);
  const [fontSize, setFontSize] = React.useState<'sm' | 'base' | 'lg'>('sm');
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Sync line numbers scroll with textarea scroll
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Keyboard shortcut handlers (Tab, Ctrl+Enter, Ctrl+Shift+Enter)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl + Shift + Enter -> Submit
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Enter') {
      e.preventDefault();
      if (!isJudging && !isRunning) onSubmitCode();
      return;
    }

    // Ctrl + Enter -> Run
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isJudging && !isRunning) onRunCode();
      return;
    }

    // Tab key indent
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const indent = '    '; // 4 spaces
      const newCode = code.substring(0, start) + indent + code.substring(end);
      onChange(newCode);

      // Restore cursor position
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + indent.length;
        }
      }, 0);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');
  const lineCount = lines.length;

  const fontClasses = {
    sm: 'text-xs sm:text-[13px] leading-5',
    base: 'text-sm sm:text-sm leading-6',
    lg: 'text-base sm:text-base leading-7',
  }[fontSize];

  return (
    <div
      className={`flex flex-col border border-slate-800 rounded-xl overflow-hidden bg-slate-950 transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : 'h-full min-h-[460px]'
      }`}
    >
      {/* Editor Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b border-slate-800 bg-slate-900/90 text-xs">
        {/* Language selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="language-select" className="text-slate-400 font-medium hidden sm:inline">
            Ngôn ngữ:
          </label>
          <select
            id="language-select"
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
            className="bg-slate-950 border border-slate-700/80 rounded-md px-2.5 py-1 text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="cpp">C++ 17 (g++ 12.3)</option>
            <option value="c">C 11 (gcc 12.3)</option>
            <option value="python">Python 3.10</option>
            <option value="javascript">JavaScript (Node.js 22)</option>
          </select>
        </div>

        {/* Toolbar actions */}
        <div className="flex items-center gap-1.5 text-slate-400">
          {/* Font size */}
          <button
            onClick={() =>
              setFontSize((prev) => (prev === 'sm' ? 'base' : prev === 'base' ? 'lg' : 'sm'))
            }
            title="Thay đổi cỡ chữ"
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-800 text-slate-300 transition-colors"
          >
            <Type className="w-3.5 h-3.5" />
            <span className="uppercase text-[10px] font-mono">{fontSize}</span>
          </button>

          {/* Reset starter code */}
          <button
            onClick={onResetCode}
            title="Khôi phục mã mẫu ban đầu"
            className="p-1.5 rounded hover:bg-slate-800 hover:text-slate-200 text-slate-400 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Copy code */}
          <button
            onClick={handleCopy}
            title="Sao chép toàn bộ code"
            className="p-1.5 rounded hover:bg-slate-800 hover:text-slate-200 text-slate-400 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Fullscreen */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
            className="p-1.5 rounded hover:bg-slate-800 hover:text-slate-200 text-slate-400 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Editor Body with Line Numbers */}
      <div className="relative flex-1 flex overflow-hidden font-mono bg-slate-950">
        {/* Line Numbers Column */}
        <div
          ref={lineNumbersRef}
          aria-hidden="true"
          className={`select-none w-11 sm:w-12 py-3 pr-2 text-right text-slate-600 bg-slate-950/80 border-r border-slate-800/80 overflow-hidden font-mono ${fontClasses}`}
        >
          {Array.from({ length: Math.max(lineCount, 1) }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Textarea Code Input */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          placeholder="// Nhập code của bạn tại đây..."
          className={`flex-1 p-3 bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none resize-none font-mono selection:bg-indigo-500/30 overflow-auto whitespace-pre ${fontClasses}`}
        />
      </div>

      {/* Editor Footer Status Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-t border-slate-800/80 bg-slate-950 text-[11px] text-slate-500 font-mono">
        <div className="flex items-center gap-3">
          <span>{lineCount} dòng</span>
          <span>·</span>
          <span>{code.length} ký tự</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline text-slate-400">UTF-8</span>
        </div>

        <div className="hidden md:flex items-center gap-3 text-slate-400">
          <span>
            <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">Ctrl</kbd> +{' '}
            <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">Enter</kbd> Chạy thử
          </span>
          <span>·</span>
          <span>
            <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">Ctrl</kbd> +{' '}
            <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">Shift</kbd> +{' '}
            <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">Enter</kbd> Nộp bài
          </span>
        </div>
      </div>
    </div>
  );
}
