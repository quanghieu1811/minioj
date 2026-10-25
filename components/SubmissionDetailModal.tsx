'use client';

import React from 'react';
import { SubmissionResult } from '@/lib/judge-engine';
import { Problem } from '@/lib/problems';
import { X, CheckCircle2, XCircle, AlertTriangle, Clock, ChevronDown, ChevronRight } from 'lucide-react';

interface SubmissionDetailModalProps {
  submission: SubmissionResult | null;
  problems: Problem[];
  onClose: () => void;
  onGoToProblem: (problem: Problem) => void;
}

export function SubmissionDetailModal({
  submission,
  problems,
  onClose,
  onGoToProblem,
}: SubmissionDetailModalProps) {
  const [expandedTest, setExpandedTest] = React.useState<number | null>(null);

  if (!submission) return null;

  const problem = problems.find((p) => p.id === submission.problemId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 font-bold">
                Mã nộp: #{submission.id.slice(0, 8)}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {new Date(submission.submittedAt).toLocaleString('vi-VN')}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              {problem ? `${problem.code} - ${problem.title}` : submission.problemId}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Summary Card */}
          <div
            className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              submission.verdict === 'AC'
                ? 'bg-emerald-950/30 border-emerald-500/40'
                : submission.verdict === 'WA'
                ? 'bg-rose-950/30 border-rose-500/40'
                : 'bg-amber-950/30 border-amber-500/40'
            }`}
          >
            <div>
              <div className="text-xs uppercase font-mono text-slate-400">Kết quả</div>
              <div className="text-xl font-bold font-mono mt-0.5">
                {submission.verdict === 'AC' ? (
                  <span className="text-emerald-400">Accepted (AC)</span>
                ) : submission.verdict === 'WA' ? (
                  <span className="text-rose-400">Wrong Answer (WA)</span>
                ) : submission.verdict === 'TLE' ? (
                  <span className="text-amber-400">Time Limit Exceeded (TLE)</span>
                ) : submission.verdict === 'RTE' ? (
                  <span className="text-rose-400">Runtime Error (RTE)</span>
                ) : (
                  <span className="text-amber-400">Compilation Error (CE)</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div>
                <span className="text-slate-400">Điểm số: </span>
                <strong className="text-white text-sm">{submission.score}/100</strong>
              </div>
              <span className="text-slate-700">·</span>
              <div>
                <span className="text-slate-400">Test đạt: </span>
                <strong className="text-white">{submission.passedTests}/{submission.totalTests}</strong>
              </div>
              <span className="text-slate-700">·</span>
              <div>
                <span className="text-slate-400">Thời gian max: </span>
                <strong className="text-white">{submission.maxTimeMs} ms</strong>
              </div>
            </div>
          </div>

          {/* Compilation Error if present */}
          {submission.compilationError && (
            <div className="space-y-1.5 p-3 rounded-lg bg-amber-950/30 border border-amber-800/60 font-mono text-xs">
              <span className="text-amber-400 font-bold uppercase flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Lỗi từ trình biên dịch:
              </span>
              <pre className="p-2.5 rounded bg-slate-950 text-amber-200/90 whitespace-pre-wrap overflow-x-auto max-h-48">
                {submission.compilationError}
              </pre>
            </div>
          )}

          {/* Test cases breakdown */}
          {submission.testResults && submission.testResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-mono font-semibold text-slate-400">
                Chi tiết kết quả từng Test Case
              </h4>

              <div className="divide-y divide-slate-800 border border-slate-800 rounded-lg overflow-hidden bg-slate-950 text-xs font-mono">
                {submission.testResults.map((tr) => {
                  const isExpanded = expandedTest === tr.testIndex;
                  return (
                    <div key={tr.testIndex}>
                      <div
                        onClick={() => tr.isSample && setExpandedTest(isExpanded ? null : tr.testIndex)}
                        className={`flex items-center justify-between p-3 ${
                          tr.isSample ? 'cursor-pointer hover:bg-slate-900/50' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {tr.isSample && (
                            isExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                            )
                          )}
                          <span className="font-bold text-slate-200">Test #{tr.testIndex}</span>
                          {tr.isSample && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                              Mẫu
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-slate-400">{tr.timeMs} ms</span>
                          <span
                            className={`px-2 py-0.5 rounded font-bold ${
                              tr.verdict === 'AC'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-rose-500/20 text-rose-400'
                            }`}
                          >
                            {tr.verdict}
                          </span>
                        </div>
                      </div>

                      {tr.isSample && isExpanded && (
                        <div className="p-3 bg-slate-900 border-t border-slate-800 space-y-2">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold">Input:</span>
                            <pre className="p-2 rounded bg-slate-950 text-slate-200 whitespace-pre overflow-x-auto">
                              {tr.input}
                            </pre>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold">Expected:</span>
                            <pre className="p-2 rounded bg-slate-950 text-emerald-400 whitespace-pre overflow-x-auto">
                              {tr.expectedOutput}
                            </pre>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold">Actual Output:</span>
                            <pre className="p-2 rounded bg-slate-950 text-slate-200 whitespace-pre overflow-x-auto">
                              {tr.actualOutput}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-950">
          {problem && (
            <button
              onClick={() => {
                onClose();
                onGoToProblem(problem);
              }}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Mở bài tập này để làm lại →
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors ml-auto"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
