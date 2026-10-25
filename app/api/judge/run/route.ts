import { NextRequest, NextResponse } from 'next/server';
import { executeSingleRun, SupportedLanguage } from '@/lib/judge-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, language, stdin = '', timeLimitMs = 2500 } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Mã nguồn không được để trống' }, { status: 400 });
    }

    const validLangs: SupportedLanguage[] = ['cpp', 'c', 'python', 'javascript'];
    if (!validLangs.includes(language)) {
      return NextResponse.json({ error: 'Ngôn ngữ lập trình không hợp lệ' }, { status: 400 });
    }

    const clampedTimeout = Math.min(Math.max(Number(timeLimitMs) || 2000, 500), 5000);

    const result = await executeSingleRun(code, language, String(stdin), clampedTimeout);

    return NextResponse.json(result);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Lỗi hệ thống khi thực thi mã nguồn';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
