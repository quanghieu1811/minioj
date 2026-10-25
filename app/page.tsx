'use client';

import React, { useState, useEffect } from 'react';
import { Problem, INITIAL_PROBLEMS } from '@/lib/problems';
import { SubmissionResult } from '@/lib/judge-engine';
import { Navbar, ActiveTab } from '@/components/Navbar';
import { ProblemList } from '@/components/ProblemList';
import { JudgeWorkspace } from '@/components/JudgeWorkspace';
import { SubmissionList } from '@/components/SubmissionList';
import { SubmissionDetailModal } from '@/components/SubmissionDetailModal';
import { CreateProblemModal } from '@/components/CreateProblemModal';
import { SystemSpecsModal } from '@/components/SystemSpecsModal';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('problems');
  const [problems, setProblems] = useState<Problem[]>(INITIAL_PROBLEMS);
  const [selectedProblem, setSelectedProblem] = useState<Problem>(INITIAL_PROBLEMS[0]);
  const [submissions, setSubmissions] = useState<SubmissionResult[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionResult | null>(null);
  const [solvedProblemIds, setSolvedProblemIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load problems and submissions on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [probRes, subRes] = await Promise.all([
          fetch('/api/judge/problems'),
          fetch('/api/judge/submissions'),
        ]);

        if (probRes.ok) {
          const probData = await probRes.json();
          if (Array.isArray(probData) && probData.length > 0) {
            setProblems(probData);
            setSelectedProblem(probData[0]);
          }
        }

        if (subRes.ok) {
          const subData = await subRes.json();
          if (Array.isArray(subData)) {
            setSubmissions(subData);
            const acProblems = subData
              .filter((s: SubmissionResult) => s.verdict === 'AC')
              .map((s: SubmissionResult) => s.problemId);
            setSolvedProblemIds(Array.from(new Set(acProblems)));
          }
        }
      } catch {
        // Fallback to initial local state
      }
    };

    fetchData();
  }, []);

  const handleSelectProblem = (problem: Problem) => {
    setSelectedProblem(problem);
    setActiveTab('workspace');
  };

  const handleSubmissionComplete = (result: SubmissionResult) => {
    setSubmissions((prev) => [result, ...prev]);
    if (result.verdict === 'AC' && !solvedProblemIds.includes(result.problemId)) {
      setSolvedProblemIds((prev) => [...prev, result.problemId]);
    }
  };

  const handleProblemCreated = (newProblem: Problem) => {
    setProblems((prev) => [newProblem, ...prev]);
    setSelectedProblem(newProblem);
    setActiveTab('workspace');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedProblemCode={selectedProblem?.code}
      />

      <main className="flex-1 pb-16">
        {activeTab === 'problems' && (
          <ProblemList
            problems={problems}
            onSelectProblem={handleSelectProblem}
            solvedProblemIds={solvedProblemIds}
            onNavigateCreate={() => setActiveTab('create')}
          />
        )}

        {activeTab === 'workspace' && selectedProblem && (
          <JudgeWorkspace
            key={selectedProblem.id}
            problem={selectedProblem}
            onSubmissionComplete={handleSubmissionComplete}
            onBackToList={() => setActiveTab('problems')}
          />
        )}

        {activeTab === 'submissions' && (
          <SubmissionList
            submissions={submissions}
            problems={problems}
            onSelectProblem={handleSelectProblem}
            onViewSubmissionDetail={setSelectedSubmission}
          />
        )}

        {activeTab === 'create' && (
          <CreateProblemModal
            onProblemCreated={handleProblemCreated}
            onCancel={() => setActiveTab('problems')}
          />
        )}

        {activeTab === 'specs' && (
          <SystemSpecsModal onClose={() => setActiveTab('problems')} />
        )}
      </main>

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <SubmissionDetailModal
          submission={selectedSubmission}
          problems={problems}
          onClose={() => setSelectedSubmission(null)}
          onGoToProblem={handleSelectProblem}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">VNOJ Mini</span>
            <span>·</span>
            <span>Hệ Thống Chấm Bài Online Thật (Real Sandboxed Judge)</span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
            <span>Ubuntu Linux</span>
            <span>·</span>
            <span>GCC / G++ 12.3</span>
            <span>·</span>
            <span>Python 3.10</span>
            <span>·</span>
            <span>Node.js 22</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
