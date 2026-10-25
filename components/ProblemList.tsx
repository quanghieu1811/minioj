'use client';

import React, { useState } from 'react';
import { Problem } from '@/lib/problems';
import { Search, Clock, Cpu, ArrowRight, CheckCircle2, BookOpen, Sparkles, Filter } from 'lucide-react';

interface ProblemListProps {
  problems: Problem[];
  onSelectProblem: (problem: Problem) => void;
  solvedProblemIds: string[];
  onNavigateCreate: () => void;
}

export function ProblemList({
  problems,
  onSelectProblem,
  solvedProblemIds,
  onNavigateCreate,
}: ProblemListProps) {
  const [search, setSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Categories extraction
  const categories = Array.from(new Set(problems.map(p => p.category)));

  // Filter problems
  const filteredProblems = problems.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());

    const matchesDifficulty =
      selectedDifficulty === 'all' || p.difficulty === selectedDifficulty;

    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;

    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Dễ':
        return <span className="text-emerald-400 font-medium">Dễ</span>;
      case 'Trung bình':
        return <span className="text-amber-400 font-medium">Trung bình</span>;
      case 'Khó':
        return <span className="text-rose-400 font-medium">Khó</span>;
      default:
        return <span className="text-slate-400">{diff}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-8">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Real Online Judge Engine Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Kho Bài Tập Lập Trình & Chấm Code Thật
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Hệ thống biên dịch và chấm điểm mã nguồn trực tiếp trên máy chủ Linux với 
            trình biên dịch thực tế <strong className="text-slate-200">GCC 12</strong>, <strong className="text-slate-200">G++ 12</strong>, <strong className="text-slate-200">Python 3.10</strong> và <strong className="text-slate-200">Node.js 22</strong>. Đánh giá chính xác từng test case với đầy đủ các phán quyết AC, WA, TLE, RTE, CE.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">{solvedProblemIds.length}</span>
              <span>/ {problems.length} bài đã giải</span>
            </div>
            <span className="text-slate-700">·</span>
            <div>Tối đa 1500ms / 256MB</div>
            <span className="text-slate-700">·</span>
            <div>Tự động kiểm tra I/O chuẩn</div>
          </div>
        </div>

        {/* Subtle grid background glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo mã bài, tên bài tập hoặc từ khóa..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-lg">
            {(['all', 'Dễ', 'Trung bình', 'Khó'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  selectedDifficulty === diff
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {diff === 'all' ? 'Tất cả độ khó' : diff}
              </button>
            ))}
          </div>

          <button
            onClick={onNavigateCreate}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Thêm bài mới</span>
          </button>
        </div>
      </div>

      {/* Category filter row if multiple categories */}
      {categories.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs text-slate-400">
          <span className="text-slate-500 font-medium">Chủ đề:</span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded border transition-colors ${
              selectedCategory === 'all'
                ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-400'
            }`}
          >
            Tất cả ({problems.length})
          </button>
          {categories.map((cat) => {
            const count = problems.filter(p => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded border transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-400'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Problem Table / Cards */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/50 divide-y divide-slate-800/80">
        {filteredProblems.length === 0 ? (
          <div className="text-center py-16 px-4">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-300">Không tìm thấy bài tập nào</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Không có bài tập nào phù hợp với bộ lọc hiện tại. Hãy thử tìm kiếm với từ khóa khác hoặc tạo bài tập mới.
            </p>
          </div>
        ) : (
          filteredProblems.map((problem) => {
            const isSolved = solvedProblemIds.includes(problem.id);
            const totalTests = (problem.sampleCases?.length || 0) + (problem.hiddenCases?.length || 0);

            return (
              <div
                key={problem.id}
                onClick={() => onSelectProblem(problem)}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 hover:bg-slate-800/40 cursor-pointer transition-colors gap-4"
              >
                {/* Left side problem info */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    {isSolved ? (
                      <span title="Đã giải thành công" className="text-emerald-400">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                      </span>
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                    )}

                    <span className="text-xs font-mono font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      {problem.code}
                    </span>

                    <h3 className="text-base font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors truncate">
                      {problem.title}
                    </h3>

                    {problem.isCustom && (
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Tự tạo
                      </span>
                    )}
                  </div>

                  {/* Clean unboxed metadata */}
                  <div className="flex flex-wrap items-center gap-x-2 text-xs text-slate-400 pl-6.5">
                    <span>{getDifficultyBadge(problem.difficulty)}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span>{problem.category}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {problem.timeLimitMs}ms
                    </span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-slate-500" />
                      {totalTests} test cases
                    </span>
                  </div>
                </div>

                {/* Right action button */}
                <div className="flex items-center gap-3 sm:self-center pl-6.5 sm:pl-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProblem(problem);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Làm bài</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
