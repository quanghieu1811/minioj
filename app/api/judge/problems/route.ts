import { NextRequest, NextResponse } from 'next/server';
import { getAllProblems, saveCustomProblem } from '@/lib/storage';
import { Problem } from '@/lib/problems';
import { randomUUID } from 'crypto';

export async function GET() {
  try {
    const problems = getAllProblems();
    return NextResponse.json(problems);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Lỗi lấy danh sách bài tập';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, difficulty, category, timeLimitMs, description, inputFormat, outputFormat, constraints, sampleCases, hiddenCases } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Tiêu đề và đề bài không được để trống' }, { status: 400 });
    }

    const newId = `custom-${randomUUID().slice(0, 8)}`;
    const newCode = `USER_${Math.floor(100 + Math.random() * 900)}`;

    const newProblem: Problem = {
      id: newId,
      code: newCode,
      title: title.trim(),
      difficulty: difficulty || 'Dễ',
      difficultyColor: difficulty === 'Khó' ? 'rose' : difficulty === 'Trung bình' ? 'amber' : 'emerald',
      category: category || 'Tự tạo',
      timeLimitMs: Number(timeLimitMs) || 1500,
      memoryLimitMb: 256,
      description: description.trim(),
      inputFormat: inputFormat || 'Dữ liệu chuẩn từ bàn phím (stdin)',
      outputFormat: outputFormat || 'In ra màn hình (stdout)',
      constraints: Array.isArray(constraints) ? constraints : ['Thời gian chạy: 1.5s'],
      sampleCases: Array.isArray(sampleCases) && sampleCases.length > 0 ? sampleCases : [
        { id: `sc-1`, input: '1 2', expectedOutput: '3', isSample: true }
      ],
      hiddenCases: Array.isArray(hiddenCases) ? hiddenCases : [],
      starters: {
        cpp: `#include <iostream>\n\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    // Viết giải thuật của bạn ở đây\n    return 0;\n}\n`,
        c: `#include <stdio.h>\n\nint main() {\n    // Viết mã C của bạn ở đây\n    return 0;\n}\n`,
        python: `import sys\n\ndef main():\n    # Viết giải thuật của bạn ở đây\n    pass\n\nif __name__ == '__main__':\n    main()\n`,
        javascript: `const fs = require('fs');\n\nfunction main() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    // Viết mã JavaScript của bạn ở đây\n}\n\nmain();\n`,
      },
      isCustom: true,
    };

    saveCustomProblem(newProblem);
    return NextResponse.json(newProblem);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Lỗi khi tạo bài tập mới';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
