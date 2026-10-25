'use client';

import React, { useState, useEffect } from 'react';
import { Problem } from '@/lib/problems';
import { SupportedLanguage, SubmissionResult, SingleRunResult, Verdict } from '@/lib/judge-engine';
import { CodeEditor } from './CodeEditor';
import {
  Play,
  Send,
  Clock,
  Cpu,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCw,
  Terminal,
  FileText,
  ChevronDown,
  ChevronRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface JudgeWorkspaceProps {
  problem: Problem;
  onSubmissionComplete?: (result: SubmissionResult) => void;
  onBackToList?: () => void;
}

export function JudgeWorkspace({
  problem,
  onSubmissionComplete,
  onBackToList,
}: JudgeWorkspaceProps) {
  // Language & Code state
  const [language, setLanguage] = useState<SupportedLanguage>('cpp');
  const [code, setCode] = useState<string>(problem.starters['cpp'] || '');

  // Custom run state
  const [customInput, setCustomInput] = useState<string>(
    problem.sampleCases?.[0]?.input || ''
  );
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState<SingleRunResult | null>(null);

  // Submit judge state
  const [isJudging, setIsJudging] = useState(false);
  const [judgeProgress, setJudgeProgress] = useState<string>('');
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);

  // Active bottom tab: 'custom' | 'judge'
  const [activeBottomTab, setActiveBottomTab] = useState<'custom' | 'judge'>('custom');

  // Expanded test detail in judge tab
  const [expandedTestIndex, setExpandedTestIndex] = useState<number | null>(null);

  // Copy sample feedback
  const [copiedSampleId, setCopiedSampleId] = useState<string | null>(null);

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    setCode(problem.starters[newLang] || '');
  };

  const handleResetCode = () => {
    if (confirm('Khôi phục mã nguồn ban đầu của bài tập này?')) {
      setCode(problem.starters[language] || '');
    }
  };

  const handleCopyInput = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSampleId(id);
    setTimeout(() => setCopiedSampleId(null), 1500);
  };

  const handleUseAsCustomInput = (input: string) => {
    setCustomInput(input);
    setActiveBottomTab('custom');
  };

  // Run code against custom stdin
  const handleRunCode = async () => {
    if (isRunning || isJudging) return;
    setIsRunning(true);
    setActiveBottomTab('custom');
    setRunResult(null);

    try {
      const res = await fetch('/api/judge/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          stdin: customInput,
          timeLimitMs: Math.max(problem.timeLimitMs, 2000),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Lỗi khi thực thi mã nguồn');
      }

      setRunResult(data);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Lỗi kết nối máy chủ chấm';
      setRunResult({
        stdout: '',
        stderr: errorMsg,
        timeMs: 0,
        exitCode: 1,
        timedOut: false,
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Submit code to judge against ALL test cases
  const handleJudgeSubmit = async () => {
    if (isRunning || isJudging) return;
    setIsJudging(true);
    setActiveBottomTab('judge');
    setSubmissionResult(null);
    setJudgeProgress('Đang gửi bài và khởi tạo môi trường chấm...');

    try {
      const res = await fetch('/api/judge/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          problemId: problem.id,
        }),
      });

      const data: SubmissionResult = await res.json();
      if (!res.ok) {
        throw new Error((data as unknown as { error?: string }).error || 'Lỗi khi chấm bài');
      }

      setSubmissionResult(data);
      if (onSubmissionComplete) {
        onSubmissionComplete(data);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Lỗi chấm bài trên máy chủ';
      alert(errorMsg);
    } finally {
      setIsJudging(false);
      setJudgeProgress('');
    }
  };

  const renderVerdictBadge = (verdict: Verdict) => {
    switch (verdict) {
      case 'AC':
        return (
          <span className="inline-flex items-center gap-1 font-bold text-emerald-400 font-mono">
            <CheckCircle2 className="w-4 h-4" />
            AC (Chấp nhận)
          </span>
        );
      case 'WA':
        return (
          <span className="inline-flex items-center gap-1 font-bold text-rose-400 font-mono">
            <XCircle className="w-4 h-4" />
            WA (Sai kết quả)
          </span>
        );
      case 'TLE':
        return (
          <span className="inline-flex items-center gap-1 font-bold text-amber-400 font-mono">
            <Clock className="w-4 h-4" />
            TLE (Quá thời gian)
          </span>
        );
      case 'RTE':
        return (
          <span className="inline-flex items-center gap-1 font-bold text-rose-500 font-mono">
            <AlertTriangle className="w-4 h-4" />
            RTE (Lỗi thực thi)
          </span>
        );
      case 'CE':
        return (
          <span className="inline-flex items-center gap-1 font-bold text-amber-500 font-mono">
            <AlertTriangle className="w-4 h-4" />
            CE (Lỗi biên dịch)
          </span>
        );
      default:
        return <span className="font-mono text-slate-400">{verdict}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-3">
          {onBackToList && (
            <button
              onClick={onBackToList}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
            >
              ← Quay lại danh sách
            </button>
          )}
          <span className="text-slate-600">/</span>
          <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
            {problem.code}
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-100 truncate">
            {problem.title}
          </h2>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRunCode}
            disabled={isRunning || isJudging}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isRunning ? (
              <RotateCw className="w-4 h-4 animate-spin text-cyan-400" />
            ) : (
              <Play className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
            )}
            <span>Chạy thử</span>
          </button>

          <button
            onClick={handleJudgeSubmit}
            disabled={isRunning || isJudging}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-emerald-900/20"
          >
            {isJudging ? (
              <RotateCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>Nộp bài (Chấm thật)</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left Problem Statement, Right Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Pane: Problem Description (5 cols) */}
        <div className="lg:col-span-5 space-y-5 bg-slate-900/60 border border-slate-800 rounded-xl p-5 overflow-y-auto max-h-[820px]">
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span
              className={`font-semibold ${
                problem.difficulty === 'Dễ'
                  ? 'text-emerald-400'
                  : problem.difficulty === 'Trung bình'
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              Độ khó: {problem.difficulty}
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{problem.category}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {problem.timeLimitMs}ms
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-slate-500" />
              {problem.memoryLimitMb}MB
            </span>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-mono tracking-wider text-slate-400 font-semibold">
              Mô tả bài toán
            </h3>
            <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans">
              {problem.description}
            </div>
          </div>

          {/* Input Format */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <h3 className="text-xs uppercase font-mono tracking-wider text-slate-400 font-semibold">
              Định dạng đầu vào (Input)
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line font-sans">
              {problem.inputFormat}
            </p>
          </div>

          {/* Output Format */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <h3 className="text-xs uppercase font-mono tracking-wider text-slate-400 font-semibold">
              Định dạng đầu ra (Output)
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line font-sans">
              {problem.outputFormat}
            </p>
          </div>

          {/* Constraints */}
          {problem.constraints && problem.constraints.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <h3 className="text-xs uppercase font-mono tracking-wider text-slate-400 font-semibold">
                Ràng buộc dữ liệu (Constraints)
              </h3>
              <ul className="text-xs font-mono space-y-1.5 text-slate-300 list-disc list-inside bg-slate-950/60 p-3 rounded-lg border border-slate-800/60">
                {problem.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Sample Test Cases */}
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <h3 className="text-xs uppercase font-mono tracking-wider text-slate-400 font-semibold">
              Ví dụ mẫu (Sample Tests)
            </h3>

            {problem.sampleCases?.map((sample, idx) => (
              <div
                key={sample.id || idx}
                className="rounded-lg border border-slate-800 bg-slate-950 overflow-hidden text-xs"
              >
                <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-slate-400">
                  <span className="font-mono font-semibold text-slate-300">
                    Ví dụ {idx + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUseAsCustomInput(sample.input)}
                      className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                      title="Nạp vào ô chạy thử"
                    >
                      Dùng test này
                    </button>
                    <button
                      onClick={() => handleCopyInput(sample.id, sample.input)}
                      className="flex items-center gap-1 hover:text-slate-200 transition-colors"
                      title="Sao chép input"
                    >
                      {copiedSampleId === sample.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
                  <div className="p-3 space-y-1">
                    <span className="text-[11px] font-mono text-slate-500 font-semibold uppercase">
                      Đầu vào (Input)
                    </span>
                    <pre className="font-mono text-slate-200 whitespace-pre overflow-x-auto selection:bg-indigo-500/30">
                      {sample.input}
                    </pre>
                  </div>
                  <div className="p-3 space-y-1">
                    <span className="text-[11px] font-mono text-slate-500 font-semibold uppercase">
                      Đầu ra (Output)
                    </span>
                    <pre className="font-mono text-emerald-400 whitespace-pre overflow-x-auto selection:bg-indigo-500/30">
                      {sample.expectedOutput}
                    </pre>
                  </div>
                </div>

                {sample.explanation && (
                  <div className="px-3 py-2 bg-slate-900/50 border-t border-slate-800/80 text-slate-400 text-[11px]">
                    <strong className="text-slate-300">Giải thích: </strong>
                    {sample.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Pane: Code Editor & Runner/Judge Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-4 flex flex-col">
          {/* Code Editor */}
          <div className="h-[430px]">
            <CodeEditor
              code={code}
              onChange={setCode}
              language={language}
              onLanguageChange={handleLanguageChange}
              onResetCode={handleResetCode}
              onRunCode={handleRunCode}
              onSubmitCode={handleJudgeSubmit}
              isJudging={isJudging}
              isRunning={isRunning}
            />
          </div>

          {/* Bottom Execution & Judge Panel */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/70">
            {/* Panel Tabs Header */}
            <div className="flex items-center justify-between px-3 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveBottomTab('custom')}
                  className={`flex items-center gap-2 px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                    activeBottomTab === 'custom'
                      ? 'border-indigo-500 text-indigo-300'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Chạy Thử Nghiệm (Custom Input)</span>
                  {runResult && (
                    <span
                      className={`w-2 h-2 rounded-full ${
                        runResult.timedOut || runResult.exitCode !== 0
                          ? 'bg-rose-400'
                          : 'bg-emerald-400'
                      }`}
                    />
                  )}
                </button>

                <button
                  onClick={() => setActiveBottomTab('judge')}
                  className={`flex items-center gap-2 px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                    activeBottomTab === 'judge'
                      ? 'border-emerald-500 text-emerald-300'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kết Quả Chấm Bài (Judge Results)</span>
                  {submissionResult && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                        submissionResult.verdict === 'AC'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {submissionResult.verdict}
                    </span>
                  )}
                </button>
              </div>

              {/* Status info right */}
              <div className="text-[11px] font-mono text-slate-500 hidden sm:block">
                {isJudging && <span className="text-emerald-400 animate-pulse">{judgeProgress}</span>}
                {isRunning && <span className="text-cyan-400 animate-pulse">Đang chạy code...</span>}
              </div>
            </div>

            {/* Panel Tab 1: Custom Input & Run Output */}
            {activeBottomTab === 'custom' && (
              <div className="p-4 space-y-3">
                <div>
                  <div className="flex items-center justify-between pb-1.5 text-xs text-slate-400">
                    <label htmlFor="custom-stdin" className="font-semibold text-slate-300">
                      Dữ liệu đầu vào thử nghiệm (Standard Input):
                    </label>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Nhấn &quot;Chạy thử&quot; hoặc Ctrl + Enter
                    </span>
                  </div>
                  <textarea
                    id="custom-stdin"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    rows={3}
                    placeholder="Nhập input thử nghiệm tại đây..."
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-y"
                  />
                </div>

                {/* Live Run Output Display */}
                {isRunning && (
                  <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center gap-2 text-cyan-400 text-xs font-mono">
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Đang biên dịch và thực thi trên máy chủ...</span>
                  </div>
                )}

                {runResult && !isRunning && (
                  <div className="space-y-2 rounded-lg bg-slate-950 border border-slate-800 p-3 text-xs font-mono">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-400">Trạng thái:</span>
                        {runResult.compilationError ? (
                          <span className="text-amber-400 font-bold">Lỗi biên dịch (CE)</span>
                        ) : runResult.timedOut ? (
                          <span className="text-amber-400 font-bold">Quá thời gian (TLE)</span>
                        ) : runResult.exitCode === 0 ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Thành công (Exit 0)
                          </span>
                        ) : (
                          <span className="text-rose-400 font-bold flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Lỗi thực thi (Exit {runResult.exitCode})
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{runResult.timeMs} ms</span>
                      </div>
                    </div>

                    {/* Standard Output */}
                    <div>
                      <div className="text-[11px] text-slate-500 font-semibold uppercase mb-1">
                        Kết quả xuất ra (Standard Output):
                      </div>
                      <pre className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-100 whitespace-pre overflow-x-auto max-h-48">
                        {runResult.stdout || <span className="text-slate-600 italic">(Không có output)</span>}
                      </pre>
                    </div>

                    {/* Stderr / Errors */}
                    {(runResult.stderr || runResult.compilationError) && (
                      <div>
                        <div className="text-[11px] text-rose-400 font-semibold uppercase mb-1">
                          Lỗi / Cảnh báo (Standard Error & Diagnostics):
                        </div>
                        <pre className="p-2.5 rounded bg-rose-950/30 border border-rose-900/50 text-rose-300 whitespace-pre-wrap overflow-x-auto max-h-48">
                          {runResult.compilationError || runResult.stderr}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Panel Tab 2: Judge Submissions & Test Breakdown */}
            {activeBottomTab === 'judge' && (
              <div className="p-4 space-y-4">
                {isJudging && (
                  <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center">
                    <div className="w-10 h-10 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-200">
                        Đang chấm bài thực tế trên máy chủ...
                      </p>
                      <p className="text-xs text-slate-400 font-mono">
                        Biên dịch với GCC / G++ và chạy từng test case với stdin thực
                      </p>
                    </div>
                  </div>
                )}

                {!isJudging && !submissionResult && (
                  <div className="py-10 text-center space-y-2">
                    <Send className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-sm text-slate-400">
                      Chưa có kết quả nộp bài. Nhấn nút <strong>&quot;Nộp bài (Chấm thật)&quot;</strong> để hệ thống biên dịch và chấm điểm mã nguồn của bạn.
                    </p>
                  </div>
                )}

                {submissionResult && !isJudging && (
                  <div className="space-y-4">
                    {/* Overall Verdict Banner */}
                    <div
                      className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        submissionResult.verdict === 'AC'
                          ? 'bg-emerald-950/30 border-emerald-500/40'
                          : submissionResult.verdict === 'WA'
                          ? 'bg-rose-950/30 border-rose-500/40'
                          : 'bg-amber-950/30 border-amber-500/40'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs uppercase font-mono tracking-wider text-slate-400">
                            Phán Quyết Tổng Thể:
                          </span>
                          <span className="text-lg">
                            {renderVerdictBadge(submissionResult.verdict)}
                          </span>
                        </div>
                        <div className="text-xs text-slate-300 font-mono flex items-center gap-3">
                          <span>
                            Số test đạt:{' '}
                            <strong className="text-white">
                              {submissionResult.passedTests} / {submissionResult.totalTests}
                            </strong>
                          </span>
                          <span>·</span>
                          <span>
                            Điểm số:{' '}
                            <strong
                              className={
                                submissionResult.score === 100
                                  ? 'text-emerald-400'
                                  : submissionResult.score > 0
                                  ? 'text-amber-400'
                                  : 'text-rose-400'
                              }
                            >
                              {submissionResult.score} / 100
                            </strong>
                          </span>
                        </div>
                      </div>

                      <div className="text-xs font-mono text-slate-400 space-y-0.5 sm:text-right">
                        <div>Thời gian tối đa: <strong className="text-slate-200">{submissionResult.maxTimeMs} ms</strong></div>
                        <div>Trung bình: <strong className="text-slate-200">{submissionResult.avgTimeMs} ms</strong></div>
                      </div>
                    </div>

                    {/* Compilation Error Display */}
                    {submissionResult.compilationError && (
                      <div className="space-y-1.5 p-3 rounded-lg bg-amber-950/30 border border-amber-800/60 text-xs font-mono">
                        <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Chi tiết lỗi biên dịch từ Trình biên dịch:</span>
                        </div>
                        <pre className="p-2.5 rounded bg-slate-950 text-amber-200/90 whitespace-pre-wrap overflow-x-auto max-h-56">
                          {submissionResult.compilationError}
                        </pre>
                      </div>
                    )}

                    {/* Test Cases Matrix */}
                    {submissionResult.testResults && submissionResult.testResults.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="font-semibold text-slate-300">
                            Chi tiết từng Test Case ({submissionResult.testResults.length} tests):
                          </span>
                          <span className="text-[11px] text-slate-500">
                            (Nhấp vào test mẫu để xem so sánh Input / Expected / Actual)
                          </span>
                        </div>

                        <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-lg overflow-hidden bg-slate-950 text-xs font-mono">
                          {submissionResult.testResults.map((tr) => {
                            const isExpanded = expandedTestIndex === tr.testIndex;
                            return (
                              <div key={tr.testId || tr.testIndex} className="hover:bg-slate-900/50">
                                <div
                                  onClick={() => {
                                    if (tr.isSample) {
                                      setExpandedTestIndex(isExpanded ? null : tr.testIndex);
                                    }
                                  }}
                                  className={`flex items-center justify-between p-2.5 ${
                                    tr.isSample ? 'cursor-pointer' : ''
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    {tr.isSample ? (
                                      isExpanded ? (
                                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                      ) : (
                                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                                      )
                                    ) : (
                                      <span className="w-3.5 h-3.5" />
                                    )}

                                    <span className="text-slate-300 font-bold">
                                      Test #{tr.testIndex}
                                    </span>

                                    {tr.isSample && (
                                      <span className="text-[10px] uppercase px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                                        Test mẫu
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-4">
                                    <span className="text-slate-400 text-[11px]">
                                      {tr.timeMs} ms
                                    </span>

                                    <span
                                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                        tr.verdict === 'AC'
                                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                          : tr.verdict === 'WA'
                                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                      }`}
                                    >
                                      {tr.verdict}
                                    </span>
                                  </div>
                                </div>

                                {/* Expanded test details for sample tests */}
                                {tr.isSample && isExpanded && (
                                  <div className="p-3 bg-slate-900/90 border-t border-slate-800 space-y-2 text-xs">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      <div>
                                        <span className="text-[10px] text-slate-500 uppercase font-semibold">
                                          Đầu vào (Input):
                                        </span>
                                        <pre className="p-1.5 rounded bg-slate-950 text-slate-200 whitespace-pre overflow-x-auto max-h-24">
                                          {tr.input}
                                        </pre>
                                      </div>

                                      <div>
                                        <span className="text-[10px] text-slate-500 uppercase font-semibold">
                                          Kết quả mong đợi (Expected):
                                        </span>
                                        <pre className="p-1.5 rounded bg-slate-950 text-emerald-400 whitespace-pre overflow-x-auto max-h-24">
                                          {tr.expectedOutput}
                                        </pre>
                                      </div>
                                    </div>

                                    <div>
                                      <span className="text-[10px] text-slate-500 uppercase font-semibold">
                                        Chương trình xuất ra (Actual Output):
                                      </span>
                                      <pre
                                        className={`p-1.5 rounded bg-slate-950 whitespace-pre overflow-x-auto max-h-24 ${
                                          tr.verdict === 'AC' ? 'text-emerald-300' : 'text-rose-300'
                                        }`}
                                      >
                                        {tr.actualOutput || <span className="text-slate-600 italic">(Không có output)</span>}
                                      </pre>
                                    </div>

                                    {tr.stderr && (
                                      <div>
                                        <span className="text-[10px] text-rose-400 uppercase font-semibold">
                                          Lỗi stderr:
                                        </span>
                                        <pre className="p-1.5 rounded bg-rose-950/40 text-rose-300 whitespace-pre-wrap max-h-24">
                                          {tr.stderr}
                                        </pre>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
