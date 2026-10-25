'use client';

import React, { useState } from 'react';
import { Problem } from '@/lib/problems';
import { TestCase } from '@/lib/judge-engine';
import { Plus, Trash2, CheckCircle2, RotateCw, AlertCircle } from 'lucide-react';

interface CreateProblemProps {
  onProblemCreated: (problem: Problem) => void;
  onCancel: () => void;
}

export function CreateProblemModal({ onProblemCreated, onCancel }: CreateProblemProps) {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<'Dễ' | 'Trung bình' | 'Khó'>('Dễ');
  const [category, setCategory] = useState('Thuật toán cơ bản');
  const [timeLimitMs, setTimeLimitMs] = useState(1500);
  const [description, setDescription] = useState('');
  const [inputFormat, setInputFormat] = useState('');
  const [outputFormat, setOutputFormat] = useState('');
  const [constraintsText, setConstraintsText] = useState('1 ≤ N ≤ 10^5\nThời gian: 1500ms');

  // Test cases: sample & hidden
  const [samples, setSamples] = useState<TestCase[]>([
    {
      id: 'sc-1',
      input: '5\n1 2 3 4 5',
      expectedOutput: '15',
      isSample: true,
      explanation: 'Tổng 5 số là 15',
    },
  ]);

  const [hiddens, setHiddens] = useState<TestCase[]>([
    {
      id: 'hc-1',
      input: '1\n100',
      expectedOutput: '100',
      isSample: false,
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addSample = () => {
    setSamples([
      ...samples,
      {
        id: `sc-${Date.now()}`,
        input: '',
        expectedOutput: '',
        isSample: true,
      },
    ]);
  };

  const removeSample = (index: number) => {
    setSamples(samples.filter((_, i) => i !== index));
  };

  const updateSample = (index: number, field: 'input' | 'expectedOutput' | 'explanation', value: string) => {
    const updated = [...samples];
    updated[index] = { ...updated[index], [field]: value };
    setSamples(updated);
  };

  const addHidden = () => {
    setHiddens([
      ...hiddens,
      {
        id: `hc-${Date.now()}`,
        input: '',
        expectedOutput: '',
        isSample: false,
      },
    ]);
  };

  const removeHidden = (index: number) => {
    setHiddens(hiddens.filter((_, i) => i !== index));
  };

  const updateHidden = (index: number, field: 'input' | 'expectedOutput', value: string) => {
    const updated = [...hiddens];
    updated[index] = { ...updated[index], [field]: value };
    setHiddens(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề bài tập.');
      return;
    }
    if (!description.trim()) {
      setError('Vui lòng nhập mô tả đề bài.');
      return;
    }
    if (samples.length === 0 || !samples[0].input || !samples[0].expectedOutput) {
      setError('Vui lòng cung cấp ít nhất 1 test case mẫu hợp lệ.');
      return;
    }

    setIsSubmitting(true);

    try {
      const constraints = constraintsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch('/api/judge/problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          difficulty,
          category,
          timeLimitMs,
          description,
          inputFormat,
          outputFormat,
          constraints,
          sampleCases: samples,
          hiddenCases: hiddens,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Lỗi khi tạo bài tập');
      }

      onProblemCreated(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi hệ thống khi tạo bài');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Tạo Đề Bài Mới</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Tạo bài tập tự định nghĩa kèm bộ test case mẫu và test case ẩn để chấm thật
          </p>
        </div>

        <button
          onClick={onCancel}
          className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 transition-colors"
        >
          Hủy bỏ
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/50 p-5 rounded-xl border border-slate-800 text-xs">
          <div className="sm:col-span-2 space-y-1">
            <label className="font-semibold text-slate-300">Tên bài tập *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Tìm Ước Chung Lớn Nhất (GCD)"
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Độ khó</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as 'Dễ' | 'Trung bình' | 'Khó')}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="Dễ">Dễ</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Khó">Khó</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Chủ đề / Phân loại</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Toán học, Mảng, Quy hoạch động, ..."
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Giới hạn thời gian (ms)</label>
            <input
              type="number"
              min={200}
              max={5000}
              step={100}
              value={timeLimitMs}
              onChange={(e) => setTimeLimitMs(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Description & Formats */}
        <div className="space-y-4 bg-slate-900/50 p-5 rounded-xl border border-slate-800 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Nội dung đề bài *</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả chi tiết yêu cầu bài toán..."
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Định dạng đầu vào (Input)</label>
              <textarea
                rows={2}
                value={inputFormat}
                onChange={(e) => setInputFormat(e.target.value)}
                placeholder="VD: Dòng 1 chứa N, dòng 2 chứa N số..."
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Định dạng đầu ra (Output)</label>
              <textarea
                rows={2}
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                placeholder="VD: In ra kết quả duy nhất trên 1 dòng..."
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Ràng buộc (mỗi dòng 1 ràng buộc)</label>
            <textarea
              rows={2}
              value={constraintsText}
              onChange={(e) => setConstraintsText(e.target.value)}
              placeholder="VD: 1 <= N <= 10^5"
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        </div>

        {/* Sample Test Cases */}
        <div className="space-y-3 bg-slate-900/50 p-5 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm text-slate-200">Test Cases Mẫu (Hiển thị cho người dùng)</h3>
              <p className="text-slate-400 text-[11px]">Người giải bài có thể nhìn thấy input và output mong đợi</p>
            </div>
            <button
              type="button"
              onClick={addSample}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm test mẫu</span>
            </button>
          </div>

          {samples.map((tc, idx) => (
            <div key={tc.id || idx} className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 font-mono">
                <span>Ví dụ #{idx + 1}</span>
                {samples.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSample(idx)}
                    className="text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-semibold">Đầu vào (Input)</label>
                  <textarea
                    rows={2}
                    value={tc.input}
                    onChange={(e) => updateSample(idx, 'input', e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded font-mono text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-semibold">Đầu ra mong đợi (Expected)</label>
                  <textarea
                    rows={2}
                    value={tc.expectedOutput}
                    onChange={(e) => updateSample(idx, 'expectedOutput', e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded font-mono text-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 uppercase font-semibold">Giải thích (Tùy chọn)</label>
                <input
                  type="text"
                  value={tc.explanation || ''}
                  onChange={(e) => updateSample(idx, 'explanation', e.target.value)}
                  placeholder="Giải thích vì sao ra kết quả này..."
                  className="w-full p-1.5 bg-slate-900 border border-slate-800 rounded text-slate-300 text-xs"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Hidden Test Cases */}
        <div className="space-y-3 bg-slate-900/50 p-5 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm text-slate-200">Test Cases Ẩn (Bí mật dùng khi chấm thật)</h3>
              <p className="text-slate-400 text-[11px]">Người giải không thấy nội dung test này nhằm tránh hardcode</p>
            </div>
            <button
              type="button"
              onClick={addHidden}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm test ẩn</span>
            </button>
          </div>

          {hiddens.map((tc, idx) => (
            <div key={tc.id || idx} className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 font-mono">
                <span>Test ẩn #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => removeHidden(idx)}
                  className="text-rose-400 hover:text-rose-300 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-semibold">Đầu vào (Input)</label>
                  <textarea
                    rows={2}
                    value={tc.input}
                    onChange={(e) => updateHidden(idx, 'input', e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded font-mono text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-semibold">Đầu ra mong đợi (Expected)</label>
                  <textarea
                    rows={2}
                    value={tc.expectedOutput}
                    onChange={(e) => updateHidden(idx, 'expectedOutput', e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded font-mono text-emerald-400"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit button */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition-all disabled:opacity-50 shadow-md shadow-emerald-900/30"
          >
            {isSubmitting ? (
              <RotateCw className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            <span>Tạo bài & Bắt đầu làm bài</span>
          </button>
        </div>
      </form>
    </div>
  );
}
