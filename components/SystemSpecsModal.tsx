'use client';

import React from 'react';
import { Server, Cpu, ShieldCheck, CheckCircle2, Clock, Zap, Terminal, FileCode } from 'lucide-react';

interface SystemSpecsProps {
  onClose: () => void;
}

export function SystemSpecsModal({ onClose }: SystemSpecsProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Kiến Trúc & Môi Trường Chấm Thật</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Thông số kỹ thuật của backend Online Judge đang hoạt động
          </p>
        </div>

        <button
          onClick={onClose}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 transition-colors"
        >
          ← Quay lại
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Compilers & Runtimes Card */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
            <Server className="w-4 h-4" />
            <span>Trình Biên Dịch & Thông Dịch (Runtimes)</span>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between text-slate-200">
                <span className="font-bold text-cyan-400">C++ 17 (g++)</span>
                <span className="text-emerald-400">Sẵn sàng</span>
              </div>
              <div className="text-[11px] text-slate-400">g++ -O2 -std=c++17 main.cpp -o solution -lm</div>
            </div>

            <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between text-slate-200">
                <span className="font-bold text-cyan-400">C 11 (gcc)</span>
                <span className="text-emerald-400">Sẵn sàng</span>
              </div>
              <div className="text-[11px] text-slate-400">gcc -O2 -std=c11 main.c -o solution -lm</div>
            </div>

            <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between text-slate-200">
                <span className="font-bold text-cyan-400">Python 3.10</span>
                <span className="text-emerald-400">Sẵn sàng</span>
              </div>
              <div className="text-[11px] text-slate-400">python3 -u solution.py (Unbuffered I/O)</div>
            </div>

            <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between text-slate-200">
                <span className="font-bold text-cyan-400">JavaScript (Node.js 22)</span>
                <span className="text-emerald-400">Sẵn sàng</span>
              </div>
              <div className="text-[11px] text-slate-400">node solution.js (V8 Engine)</div>
            </div>
          </div>
        </div>

        {/* Sandbox & Limits Card */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>Cơ Chế Cô Lập & Giới Hạn (Sandbox)</span>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
              <div>
                <strong className="text-white">Thư mục Sandbox độc lập: </strong>
                Mỗi lượt chạy hoặc bài nộp được tạo một thư mục tạm thời riêng biệt (<code className="text-indigo-300 font-mono">/tmp/judge_...</code>) và tự động dọn sạch sau khi kết thúc.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
              <div>
                <strong className="text-white">Đo thời gian nano giây: </strong>
                Sử dụng <code className="text-indigo-300 font-mono">process.hrtime.bigint()</code> để tính toán thời gian thực thi từng test case với độ trễ chính xác ở cấp độ mili-giây.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
              <div>
                <strong className="text-white">Ngắt tiến trình quá thời gian (TLE): </strong>
                Tiến trình chạy vượt quá giới hạn quy định sẽ bị ngắt bằng tín hiệu <code className="text-indigo-300 font-mono">SIGKILL</code> để giải phóng tài nguyên.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
              <div>
                <strong className="text-white">Chuẩn hóa đầu ra (Output Normalization): </strong>
                Loại bỏ khoảng trắng thừa cuối dòng và ký tự xuống dòng Windows (<code className="text-indigo-300 font-mono">\r\n</code>) theo đúng chuẩn ICPC/Olympic Tin học.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verdict explanation */}
      <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
        <h3 className="font-semibold text-sm text-white">Quy Định Các Phán Quyết (Verdicts)</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 space-y-1">
            <span className="font-bold text-emerald-400 text-sm">AC (Accepted)</span>
            <p className="text-[11px] text-slate-300 font-sans">
              Chấp nhận. Mã nguồn chạy đúng toàn bộ test case trong thời gian cho phép.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 space-y-1">
            <span className="font-bold text-rose-400 text-sm">WA (Wrong Answer)</span>
            <p className="text-[11px] text-slate-300 font-sans">
              Sai kết quả. Kết quả xuất ra màn hình khác với đáp án chuẩn của test case.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 space-y-1">
            <span className="font-bold text-amber-400 text-sm">TLE (Time Limit Exceeded)</span>
            <p className="text-[11px] text-slate-300 font-sans">
              Quá thời gian. Thuật toán bị lặp vô tận hoặc độ phức tạp quá lớn.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 space-y-1">
            <span className="font-bold text-rose-400 text-sm">RTE (Runtime Error)</span>
            <p className="text-[11px] text-slate-300 font-sans">
              Lỗi thực thi. Truy cập mảng ngoài giới hạn, chia cho 0, hoặc crash (Exit code != 0).
            </p>
          </div>

          <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 space-y-1">
            <span className="font-bold text-amber-400 text-sm">CE (Compile Error)</span>
            <p className="text-[11px] text-slate-300 font-sans">
              Lỗi biên dịch. Cú pháp C/C++ không thể biên dịch thành công.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
