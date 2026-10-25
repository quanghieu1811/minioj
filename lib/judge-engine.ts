import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { randomUUID } from 'crypto';

export type SupportedLanguage = 'cpp' | 'c' | 'python' | 'javascript';

export type Verdict = 'AC' | 'WA' | 'TLE' | 'RTE' | 'CE' | 'MLE';

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isSample?: boolean;
  explanation?: string;
}

export interface SingleRunResult {
  stdout: string;
  stderr: string;
  timeMs: number;
  exitCode: number | null;
  timedOut: boolean;
  compilationError?: string;
}

export interface TestResult {
  testId: string;
  testIndex: number;
  isSample: boolean;
  verdict: Verdict;
  timeMs: number;
  input?: string; // shown for sample tests
  expectedOutput?: string; // shown for sample tests
  actualOutput?: string;
  stderr?: string;
}

export interface SubmissionResult {
  id: string;
  problemId: string;
  language: SupportedLanguage;
  verdict: Verdict;
  score: number;
  passedTests: number;
  totalTests: number;
  maxTimeMs: number;
  avgTimeMs: number;
  compilationError?: string;
  testResults: TestResult[];
  submittedAt: string;
}

// Normalize output for standard Competitive Programming judging
export function normalizeOutput(output: string): string {
  if (!output) return '';
  return output
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    .trim();
}

/**
 * Execute a command with stdin and return output, time, exit code, and timeout status
 */
function runProcess(
  command: string,
  args: string[],
  cwd: string,
  stdinText: string,
  timeoutMs: number,
  maxBufferBytes: number = 4 * 1024 * 1024
): Promise<{ stdout: string; stderr: string; timeMs: number; exitCode: number | null; timedOut: boolean }> {
  return new Promise((resolve) => {
    const startTime = process.hrtime.bigint();
    let timedOut = false;
    let stdoutBuffer = '';
    let stderrBuffer = '';

    const child = spawn(command, args, {
      cwd,
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        PATH: process.env.PATH || '/usr/local/bin:/usr/bin:/bin',
        LANG: 'C.UTF-8',
        LC_ALL: 'C.UTF-8',
        NODE_ENV: 'production',
        PYTHONUNBUFFERED: '1',
      },
    });

    const timer = setTimeout(() => {
      timedOut = true;
      try {
        child.kill('SIGKILL');
      } catch {
        // process might already be dead
      }
    }, timeoutMs);

    child.stdout.on('data', (chunk) => {
      if (stdoutBuffer.length < maxBufferBytes) {
        stdoutBuffer += chunk.toString('utf-8');
      }
    });

    child.stderr.on('data', (chunk) => {
      if (stderrBuffer.length < maxBufferBytes) {
        stderrBuffer += chunk.toString('utf-8');
      }
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      const endTime = process.hrtime.bigint();
      const timeMs = Number((endTime - startTime) / BigInt(1000000));
      resolve({
        stdout: stdoutBuffer,
        stderr: (stderrBuffer + '\n' + err.message).trim(),
        timeMs,
        exitCode: 1,
        timedOut: false,
      });
    });

    child.on('close', (code) => {
      clearTimeout(timer);
      const endTime = process.hrtime.bigint();
      const timeMs = Number((endTime - startTime) / BigInt(1000000));
      resolve({
        stdout: stdoutBuffer,
        stderr: stderrBuffer,
        timeMs,
        exitCode: timedOut ? null : code,
        timedOut,
      });
    });

    // Write input into process stdin and close
    try {
      if (stdinText) {
        child.stdin.write(stdinText);
      }
      child.stdin.end();
    } catch {
      // Stream could already be closed
    }
  });
}

/**
 * Compile source code if necessary (C++ or C).
 * Returns compilation error string if compilation failed, or null if successful/not needed.
 */
async function compileCode(
  language: SupportedLanguage,
  sandboxDir: string
): Promise<{ compilationError?: string; executablePath?: string }> {
  if (language === 'cpp') {
    const res = await runProcess(
      'g++',
      ['-O2', '-std=c++17', 'main.cpp', '-o', 'solution', '-lm'],
      sandboxDir,
      '',
      8000
    );
    if (res.exitCode !== 0 || res.timedOut) {
      return {
        compilationError: res.timedOut
          ? 'Quá thời gian biên dịch (g++ timed out > 8s)'
          : res.stderr || 'Lỗi biên dịch không xác định.',
      };
    }
    return { executablePath: path.join(sandboxDir, 'solution') };
  }

  if (language === 'c') {
    const res = await runProcess(
      'gcc',
      ['-O2', '-std=c11', 'main.c', '-o', 'solution', '-lm'],
      sandboxDir,
      '',
      8000
    );
    if (res.exitCode !== 0 || res.timedOut) {
      return {
        compilationError: res.timedOut
          ? 'Quá thời gian biên dịch (gcc timed out > 8s)'
          : res.stderr || 'Lỗi biên dịch không xác định.',
      };
    }
    return { executablePath: path.join(sandboxDir, 'solution') };
  }

  return {};
}

/**
 * Run a piece of code once against custom stdin (Live Test Run)
 */
export async function executeSingleRun(
  code: string,
  language: SupportedLanguage,
  stdinText: string,
  timeLimitMs: number = 2000
): Promise<SingleRunResult> {
  const sandboxDir = path.join(os.tmpdir(), `judge_run_${randomUUID()}`);
  fs.mkdirSync(sandboxDir, { recursive: true });

  try {
    let sourceFilename = 'solution.py';
    if (language === 'cpp') sourceFilename = 'main.cpp';
    else if (language === 'c') sourceFilename = 'main.c';
    else if (language === 'javascript') sourceFilename = 'solution.js';

    fs.writeFileSync(path.join(sandboxDir, sourceFilename), code, 'utf-8');

    // Compile if compiled language
    if (language === 'cpp' || language === 'c') {
      const comp = await compileCode(language, sandboxDir);
      if (comp.compilationError) {
        return {
          stdout: '',
          stderr: comp.compilationError,
          timeMs: 0,
          exitCode: 1,
          timedOut: false,
          compilationError: comp.compilationError,
        };
      }
    }

    // Determine execution command
    let cmd = '';
    let args: string[] = [];

    if (language === 'cpp' || language === 'c') {
      cmd = path.join(sandboxDir, 'solution');
    } else if (language === 'python') {
      cmd = 'python3';
      args = ['-u', 'solution.py'];
    } else if (language === 'javascript') {
      cmd = 'node';
      args = ['solution.js'];
    }

    const runRes = await runProcess(cmd, args, sandboxDir, stdinText, timeLimitMs);

    return {
      stdout: runRes.stdout,
      stderr: runRes.stderr,
      timeMs: runRes.timeMs,
      exitCode: runRes.exitCode,
      timedOut: runRes.timedOut,
    };
  } finally {
    try {
      fs.rmSync(sandboxDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup error
    }
  }
}

/**
 * Judge a code submission across a full suite of test cases
 */
export async function judgeSubmission(
  code: string,
  language: SupportedLanguage,
  problemId: string,
  testCases: TestCase[],
  timeLimitMs: number = 1000
): Promise<SubmissionResult> {
  const submissionId = randomUUID();
  const sandboxDir = path.join(os.tmpdir(), `judge_sub_${submissionId}`);
  fs.mkdirSync(sandboxDir, { recursive: true });

  try {
    let sourceFilename = 'solution.py';
    if (language === 'cpp') sourceFilename = 'main.cpp';
    else if (language === 'c') sourceFilename = 'main.c';
    else if (language === 'javascript') sourceFilename = 'solution.js';

    fs.writeFileSync(path.join(sandboxDir, sourceFilename), code, 'utf-8');

    // 1. Compile stage
    if (language === 'cpp' || language === 'c') {
      const comp = await compileCode(language, sandboxDir);
      if (comp.compilationError) {
        return {
          id: submissionId,
          problemId,
          language,
          verdict: 'CE',
          score: 0,
          passedTests: 0,
          totalTests: testCases.length,
          maxTimeMs: 0,
          avgTimeMs: 0,
          compilationError: comp.compilationError,
          testResults: [],
          submittedAt: new Date().toISOString(),
        };
      }
    }

    // 2. Command preparation
    let cmd = '';
    let args: string[] = [];
    if (language === 'cpp' || language === 'c') {
      cmd = path.join(sandboxDir, 'solution');
    } else if (language === 'python') {
      cmd = 'python3';
      args = ['-u', 'solution.py'];
    } else if (language === 'javascript') {
      cmd = 'node';
      args = ['solution.js'];
    }

    // 3. Run each test case
    const testResults: TestResult[] = [];
    let passedCount = 0;
    let maxTime = 0;
    let totalTime = 0;
    let overallVerdict: Verdict = 'AC';

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const runRes = await runProcess(cmd, args, sandboxDir, tc.input, timeLimitMs);

      totalTime += runRes.timeMs;
      if (runRes.timeMs > maxTime) {
        maxTime = runRes.timeMs;
      }

      let testVerdict: Verdict = 'AC';

      if (runRes.timedOut) {
        testVerdict = 'TLE';
      } else if (runRes.exitCode !== 0) {
        testVerdict = 'RTE';
      } else {
        const normActual = normalizeOutput(runRes.stdout);
        const normExpected = normalizeOutput(tc.expectedOutput);

        if (normActual === normExpected) {
          testVerdict = 'AC';
        } else {
          testVerdict = 'WA';
        }
      }

      if (testVerdict === 'AC') {
        passedCount++;
      } else if (overallVerdict === 'AC') {
        // First failing verdict determines overall verdict in standard ICPC/OI rules
        overallVerdict = testVerdict;
      }

      testResults.push({
        testId: tc.id,
        testIndex: i + 1,
        isSample: !!tc.isSample,
        verdict: testVerdict,
        timeMs: runRes.timeMs,
        input: tc.isSample ? tc.input : undefined,
        expectedOutput: tc.isSample ? tc.expectedOutput : undefined,
        actualOutput: tc.isSample ? runRes.stdout : undefined,
        stderr: runRes.stderr || undefined,
      });
    }

    const score = testCases.length > 0 ? Math.round((passedCount / testCases.length) * 100) : 0;
    const avgTimeMs = testCases.length > 0 ? Math.round(totalTime / testCases.length) : 0;

    return {
      id: submissionId,
      problemId,
      language,
      verdict: overallVerdict,
      score,
      passedTests: passedCount,
      totalTests: testCases.length,
      maxTimeMs: maxTime,
      avgTimeMs,
      testResults,
      submittedAt: new Date().toISOString(),
    };
  } finally {
    try {
      fs.rmSync(sandboxDir, { recursive: true, force: true });
    } catch {
      // Ignore
    }
  }
}
