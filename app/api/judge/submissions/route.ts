import { NextResponse } from 'next/server';
import { getSubmissions } from '@/lib/storage';

export async function GET() {
  try {
    const list = getSubmissions();
    return NextResponse.json(list);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Lỗi lấy lịch sử bài nộp';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
