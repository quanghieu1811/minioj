import { NextRequest, NextResponse } from 'next/server';
import { judgeSubmission, SupportedLanguage, TestCase } from '@/lib/judge-engine';
import { getProblemById, saveSubmission } from '@/lib/storage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, language, problemId, customTestCases } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Mã nguồn không được để trống' }, { status: 400 });
    }

    const validLangs: SupportedLanguage[] = ['cpp', 'c', 'python', 'javascript'];
    if (!validLangs.includes(language)) {
      return NextResponse.json({ error: 'Ngôn ngữ lập trình không hợp lệ' }, { status: 400 });
    }

    let testCasesToRun: TestCase[] = [];
    let timeLimitMs = 1500;

    if (customTestCases && Array.isArray(customTestCases) && customTestCases.length > 0) {
      testCasesToRun = customTestCases;
    } else {
      const problem = getProblemById(problemId);
      if (!problem) {
        return NextResponse.json({ error: 'Không tìm thấy bài tập với ID: ' + problemId }, { status: 404 });
      }
      testCasesToRun = [...problem.sampleCases, ...problem.hiddenCases];
      timeLimitMs = problem.timeLimitMs || 1500;
    }

    // Execute real judge across all test cases
    const result = await judgeSubmission(code, language, problemId || 'custom', testCasesToRun, timeLimitMs);

    // Save to submissions history
    saveSubmission(result);

    return NextResponse.json(result);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Lỗi hệ thống khi chấm bài';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
