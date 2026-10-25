import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { Problem, INITIAL_PROBLEMS } from './problems';
import { SubmissionResult } from './judge-engine';

const CUSTOM_PROBLEMS_FILE = path.join(os.tmpdir(), 'vnoj_custom_problems.json');
const SUBMISSIONS_FILE = path.join(os.tmpdir(), 'vnoj_submissions.json');

export function getCustomProblems(): Problem[] {
  try {
    if (fs.existsSync(CUSTOM_PROBLEMS_FILE)) {
      const data = fs.readFileSync(CUSTOM_PROBLEMS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch {
    // fallback
  }
  return [];
}

export function saveCustomProblem(problem: Problem): void {
  try {
    const list = getCustomProblems();
    const existingIndex = list.findIndex(p => p.id === problem.id);
    if (existingIndex >= 0) {
      list[existingIndex] = problem;
    } else {
      list.unshift(problem);
    }
    fs.writeFileSync(CUSTOM_PROBLEMS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch {
    // ignore
  }
}

export function getAllProblems(): Problem[] {
  const custom = getCustomProblems();
  return [...custom, ...INITIAL_PROBLEMS];
}

export function getProblemById(id: string): Problem | undefined {
  const all = getAllProblems();
  return all.find(p => p.id === id);
}

export function getSubmissions(): SubmissionResult[] {
  try {
    if (fs.existsSync(SUBMISSIONS_FILE)) {
      const data = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch {
    // fallback
  }
  return [];
}

export function saveSubmission(sub: SubmissionResult): void {
  try {
    const list = getSubmissions();
    list.unshift(sub);
    // keep latest 100
    const trimmed = list.slice(0, 100);
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(trimmed, null, 2), 'utf-8');
  } catch {
    // ignore
  }
}
