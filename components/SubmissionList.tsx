'use client';

import React, { useState } from 'react';
import { SubmissionResult, Verdict, SupportedLanguage } from '@/lib/judge-engine';
import { Problem } from '@/lib/problems';
import { Clock, CheckCircle2, XCircle, AlertTriangle, FileCode, Search, Filter } from 'lucide-react';

interface SubmissionListProps {
  submissions: SubmissionResult[];
  problems: Problem[];
  onSelectProblem: (problem: Problem) => void;
  onViewSubmissionDetail: (submission: SubmissionResult) => void;
}

export function SubmissionList({
  submissions,
  problems,
  onSelectProblem,
  onViewSubmissionDetail,
}: SubmissionListProps) {
  const [filterVerdict, setFilterVerdict] = useState<string>('all');
  const [filterLang, setFilterLang] = useState<string>('all');

  const getProblem = (id: string) => problems.find((p) => p.id === id);

  const filtered = submissions.filter((sub) => {
    const matchesVerdict = filterVerdict === 'all' || sub.verdict === filterVerdict;
    const matchesLang = filterLang === 'all' || sub.language === filterLang;
    return matchesVerdict && matchesLang;
  });

  const getVerdictBadge = (verdict: Verdict) => {
    switch (verdict) {
      case 'AC':
        return (
          <span className="inline-flex items-center gap-1 font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-xs font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            AC
          </span>
        );
      case 'WA':
        return (
          <span className="inline-flex items-center gap-1 font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 text-xs font-mono">
            <XCircle className="w-3.5 h-3.5" />
            WA
          </span>
        );
      case 'TLE':
        return (
          <span className="inline-flex items-center gap-1 font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 text-xs font-mono">
            <Clock className="w-3.5 h-3.5" />
            TLE
          </span>
        );
      case 'RTE':
        return (
          <span className="inline-flex items-center gap-1 font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 text-xs font-mono">
            <AlertTriangle className="w-3.5 h-3.5" />
            RTE
          </span>
        );
      case 'CE':
        return (
          <span className="inline-flex items-center gap-1 font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 text-xs font-mono">
            <AlertTriangle className="w-3.5 h-3.5" />
            CE
          </span>
        );
      default:
        return <span className="font-mono text-slate-400 text-xs">{verdict}</span>;
    }
  };

  const getLanguageLabel = (lang: SupportedLanguage) => {
    switch (lang) {
      case 'cpp':
        return 'C++ 17';
      case 'c':
        return 'C 11';
      case 'python':
        return 'Python 3';
      case 'javascript':
        return 'JavaScript';
      default:
        return lang;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Lịch Sử Nộp Bài</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Danh sách tất cả các bài nộp được máy chủ biên dịch và chấm thật
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Verdict Filter */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-lg">
            {(['all', 'AC', 'WA', 'TLE', 'RTE', 'CE'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setFilterVerdict(v)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  filterVerdict === v
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {v === 'all' ? 'Tất cả' : v}
              </button>
            ))}
          </div>

          {/* Lang Filter */}
          <select
            value={filterLang}
            onChange={(e) => setFilterLang(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">Tất cả ngôn ngữ</option>
            <option value="cpp">C++ 17</option>
            <option value="c">C 11</option>
            <option value="python">Python 3</option>
            <option value="javascript">JavaScript</option>
          </select>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40">
        {filtered.length === 0 ? (
          <div className="text-center py-16 px-4">
            <FileCode className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-300">Chưa có bài nộp nào phù hợp</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Hãy chọn một bài tập bất kỳ và nhấn &quot;Nộp bài (Chấm thật)&quot; để trải nghiệm hệ thống chấm code tự động.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-mono text-[11px]">
                <tr>
                  <th className="py-3 px-4">Mã bài nộp</th>
                  <th className="py-3 px-4">Bài tập</th>
                  <th className="py-3 px-4">Phán quyết</th>
                  <th className="py-3 px-4">Điểm</th>
                  <th className="py-3 px-4">Ngôn ngữ</th>
                  <th className="py-3 px-4">Thời gian</th>
                  <th className="py-3 px-4">Thời điểm</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filtered.map((sub) => {
                  const prob = getProblem(sub.problemId);
                  const timeFormatted = new Date(sub.submittedAt).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  });

                  return (
                    <tr
                      key={sub.id}
                      onClick={() => onViewSubmissionDetail(sub)}
                      className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 text-slate-500">
                        #{sub.id.slice(0, 8)}
                      </td>

                      <td className="py-3 px-4">
                        {prob ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectProblem(prob);
                            }}
                            className="text-left font-sans font-medium text-slate-200 hover:text-indigo-300 transition-colors"
                          >
                            <span className="text-indigo-400 font-mono mr-1.5 font-bold">
                              {prob.code}
                            </span>
                            {prob.title}
                          </button>
                        ) : (
                          <span className="text-slate-400 font-sans">
                            {sub.problemId}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">{getVerdictBadge(sub.verdict)}</td>

                      <td className="py-3 px-4">
                        <span
                          className={`font-bold ${
                            sub.score === 100
                              ? 'text-emerald-400'
                              : sub.score > 0
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {sub.score}/100
                        </span>
                        <span className="text-[11px] text-slate-500 ml-1">
                          ({sub.passedTests}/{sub.totalTests})
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-300">
                        {getLanguageLabel(sub.language)}
                      </td>

                      <td className="py-3 px-4 text-slate-300">
                        {sub.maxTimeMs} ms
                      </td>

                      <td className="py-3 px-4 text-slate-500">
                        {timeFormatted}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewSubmissionDetail(sub);
                          }}
                          className="text-xs font-sans text-indigo-400 hover:text-indigo-300 font-medium"
                        >
                          Chi tiết →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
