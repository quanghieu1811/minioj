import { TestCase, SupportedLanguage } from './judge-engine';

export interface Problem {
  id: string;
  code: string;
  title: string;
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
  difficultyColor: string;
  category: string;
  timeLimitMs: number;
  memoryLimitMb: number;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  sampleCases: TestCase[];
  hiddenCases: TestCase[];
  starters: Record<SupportedLanguage, string>;
  isCustom?: boolean;
}

export const INITIAL_PROBLEMS: Problem[] = [
  {
    id: 'prob-ab',
    code: 'P01_SUM',
    title: 'Tính Tổng A + B',
    difficulty: 'Dễ',
    difficultyColor: 'emerald',
    category: 'Cơ bản & Toán học',
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    description: `Cho hai số nguyên $A$ và $B$. Nhiệm vụ của bạn là tính tổng $A + B$ và in ra kết quả. Đây là bài toán nhập môn kinh điển của mọi hệ thống Online Judge.`,
    inputFormat: `Một dòng duy nhất chứa hai số nguyên $A$ và $B$, cách nhau bởi dấu cách.`,
    outputFormat: `In ra một số nguyên duy nhất là kết quả của $A + B$.`,
    constraints: [
      '-10^9 ≤ A, B ≤ 10^9',
      'Thời gian thực thi tối đa: 1000 ms',
      'Bộ nhớ tối đa: 256 MB',
    ],
    sampleCases: [
      {
        id: 'tc-ab-1',
        input: '3 5',
        expectedOutput: '8',
        isSample: true,
        explanation: '3 + 5 = 8.',
      },
      {
        id: 'tc-ab-2',
        input: '-10 25',
        expectedOutput: '15',
        isSample: true,
        explanation: '-10 + 25 = 15.',
      },
    ],
    hiddenCases: [
      { id: 'tc-ab-h1', input: '0 0', expectedOutput: '0' },
      { id: 'tc-ab-h2', input: '1000000000 2000000000', expectedOutput: '3000000000' },
      { id: 'tc-ab-h3', input: '-999999999 -1', expectedOutput: '-1000000000' },
      { id: 'tc-ab-h4', input: '456789 -123456', expectedOutput: '333333' },
    ],
    starters: {
      cpp: `#include <iostream>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    long long a, b;
    if (cin >> a >> b) {
        cout << a + b << "\\n";
    }
    return 0;
}
`,
      c: `#include <stdio.h>

int main() {
    long long a, b;
    if (scanf("%lld %lld", &a, &b) == 2) {
        printf("%lld\\n", a + b);
    }
    return 0;
}
`,
      python: `import sys

def main():
    line = sys.stdin.read().split()
    if len(line) >= 2:
        a = int(line[0])
        b = int(line[1])
        print(a + b)

if __name__ == '__main__':
    main()
`,
      javascript: `const fs = require('fs');

function main() {
    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (input.length >= 2) {
        const a = BigInt(input[0]);
        const b = BigInt(input[1]);
        console.log((a + b).toString());
    }
}

main();
`,
    },
  },
  {
    id: 'prob-palindrome',
    code: 'P02_PALIN',
    title: 'Kiểm Tra Xâu Đối Xứng',
    difficulty: 'Dễ',
    difficultyColor: 'emerald',
    category: 'Xử lý chuỗi',
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    description: `Một chuỗi được gọi là xâu đối xứng (Palindrome) nếu đọc từ trái sang phải hay từ phải sang trái đều giống nhau.

Lưu ý: Bỏ qua khoảng trắng và không phân biệt chữ hoa, chữ thường. Ví dụ: "A man a plan a canal Panama" là một xâu đối xứng hợp lệ.`,
    inputFormat: `Gồm một dòng chứa chuỗi $S$. Chuỗi có thể chứa chữ cái tiếng Anh, chữ số và khoảng trắng.`,
    outputFormat: `In ra "YES" (không có dấu ngoặc kép) nếu chuỗi là xâu đối xứng, ngược lại in ra "NO".`,
    constraints: [
      'Độ dài chuỗi: 1 ≤ |S| ≤ 10^5',
      'S chỉ gồm ký tự ASCII in được',
    ],
    sampleCases: [
      {
        id: 'tc-pal-1',
        input: 'racecar',
        expectedOutput: 'YES',
        isSample: true,
        explanation: 'racecar đọc xuôi ngược đều như nhau.',
      },
      {
        id: 'tc-pal-2',
        input: 'hello world',
        expectedOutput: 'NO',
        isSample: true,
        explanation: 'helloworld khác dlrowolleh.',
      },
      {
        id: 'tc-pal-3',
        input: 'A man a plan a canal Panama',
        expectedOutput: 'YES',
        isSample: true,
        explanation: 'Bỏ qua khoảng trắng và chuyển thường: amanaplanacanalpanama.',
      },
    ],
    hiddenCases: [
      { id: 'tc-pal-h1', input: 'a', expectedOutput: 'YES' },
      { id: 'tc-pal-h2', input: 'abccba', expectedOutput: 'YES' },
      { id: 'tc-pal-h3', input: '12321', expectedOutput: 'YES' },
      { id: 'tc-pal-h4', input: '1233214', expectedOutput: 'NO' },
      { id: 'tc-pal-h5', input: 'Was it a car or a cat I saw', expectedOutput: 'YES' },
    ],
    starters: {
      cpp: `#include <iostream>
#include <string>
#include <cctype>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    string raw;
    if (!getline(cin, raw)) return 0;

    string s = "";
    for (char c : raw) {
        if (c != ' ') {
            s += tolower(c);
        }
    }

    int left = 0, right = (int)s.size() - 1;
    bool isPalindrome = true;
    while (left < right) {
        if (s[left] != s[right]) {
            isPalindrome = false;
            break;
        }
        left++;
        right--;
    }

    cout << (isPalindrome ? "YES" : "NO") << "\\n";
    return 0;
}
`,
      c: `#include <stdio.h>
#include <string.h>
#include <ctype.h>

int main() {
    char raw[200005];
    if (!fgets(raw, sizeof(raw), stdin)) return 0;

    char s[200005];
    int len = 0;
    for (int i = 0; raw[i]; i++) {
        if (raw[i] != ' ' && raw[i] != '\\n' && raw[i] != '\\r') {
            s[len++] = tolower(raw[i]);
        }
    }

    int left = 0, right = len - 1;
    int isPal = 1;
    while (left < right) {
        if (s[left] != s[right]) {
            isPal = 0;
            break;
        }
        left++;
        right--;
    }

    printf("%s\\n", isPal ? "YES" : "NO");
    return 0;
}
`,
      python: `import sys

def main():
    s = sys.stdin.read().strip()
    clean = ''.join(c.lower() for c in s if c != ' ')
    if clean == clean[::-1]:
        print("YES")
    else:
        print("NO")

if __name__ == '__main__':
    main()
`,
      javascript: `const fs = require('fs');

function main() {
    const input = fs.readFileSync(0, 'utf-8').trim();
    const clean = input.replace(/\\s+/g, '').toLowerCase();
    const reversed = clean.split('').reverse().join('');
    if (clean === reversed) {
        console.log('YES');
    } else {
        console.log('NO');
    }
}

main();
`,
    },
  },
  {
    id: 'prob-two-sum',
    code: 'P03_2SUM',
    title: 'Tìm Cặp Số Có Tổng Bằng K',
    difficulty: 'Trung bình',
    difficultyColor: 'amber',
    category: 'Mảng & Bảng băm',
    timeLimitMs: 1500,
    memoryLimitMb: 256,
    description: `Cho một mảng gồm $N$ số nguyên $A = [a_1, a_2, ..., a_N]$ và một số nguyên $K$.

Nhiệm vụ của bạn là tìm hai chỉ số khác nhau $i$ và $j$ ($1 \\le i < j \\le N$) sao cho $a_i + a_j = K$.

Nếu có nhiều cặp thỏa mãn, hãy chọn cặp có $i$ nhỏ nhất, nếu vẫn trùng thì chọn $j$ nhỏ nhất. Nếu không tìm thấy cặp nào, in ra \`-1\`.`,
    inputFormat: `Dòng thứ nhất chứa hai số nguyên $N$ và $K$.
Dòng thứ hai chứa $N$ số nguyên $a_1, a_2, ..., a_N$ cách nhau bởi dấu cách.`,
    outputFormat: `In ra hai số nguyên $i$ và $j$ ($i < j$, đánh số từ 1) cách nhau bởi khoảng trắng, hoặc \`-1\` nếu không tồn tại.`,
    constraints: [
      '2 ≤ N ≤ 10^5',
      '-10^9 ≤ K ≤ 10^9',
      '-10^9 ≤ a_i ≤ 10^9',
    ],
    sampleCases: [
      {
        id: 'tc-2sum-1',
        input: `4 9
2 7 11 15`,
        expectedOutput: '1 2',
        isSample: true,
        explanation: 'a[1] + a[2] = 2 + 7 = 9.',
      },
      {
        id: 'tc-2sum-2',
        input: `3 6
3 2 4`,
        expectedOutput: '2 3',
        isSample: true,
        explanation: 'a[2] + a[3] = 2 + 4 = 6.',
      },
      {
        id: 'tc-2sum-3',
        input: `3 10
1 2 3`,
        expectedOutput: '-1',
        isSample: true,
        explanation: 'Không có cặp số nào có tổng bằng 10.',
      },
    ],
    hiddenCases: [
      {
        id: 'tc-2sum-h1',
        input: `5 0
-5 3 5 2 -3`,
        expectedOutput: '1 3',
      },
      {
        id: 'tc-2sum-h2',
        input: `6 100
10 20 30 40 50 60`,
        expectedOutput: '4 6',
      },
      {
        id: 'tc-2sum-h3',
        input: `4 8
4 1 7 4`,
        expectedOutput: '1 4',
      },
      {
        id: 'tc-2sum-h4',
        input: `2 5
2 4`,
        expectedOutput: '-1',
      },
    ],
    starters: {
      cpp: `#include <iostream>
#include <vector>
#include <unordered_map>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    long long k;
    if (!(cin >> n >> k)) return 0;

    vector<long long> a(n);
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }

    unordered_map<long long, int> seen; // value -> 1-based index
    for (int j = 0; j < n; j++) {
        long long needed = k - a[j];
        if (seen.find(needed) != seen.end()) {
            cout << seen[needed] << " " << (j + 1) << "\\n";
            return 0;
        }
        if (seen.find(a[j]) == seen.end()) {
            seen[a[j]] = j + 1;
        }
    }

    cout << "-1\\n";
    return 0;
}
`,
      c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    long long k;
    if (scanf("%d %lld", &n, &k) != 2) return 0;

    long long *a = (long long*)malloc(n * sizeof(long long));
    for (int i = 0; i < n; i++) {
        scanf("%lld", &a[i]);
    }

    // O(N^2) or hash search
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (a[i] + a[j] == k) {
                printf("%d %d\\n", i + 1, j + 1);
                free(a);
                return 0;
            }
        }
    }

    printf("-1\\n");
    free(a);
    return 0;
}
`,
      python: `import sys

def main():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    k = int(tokens[1])
    arr = [int(x) for x in tokens[2:2+n]]

    seen = {}
    for j, val in enumerate(arr):
        needed = k - val
        if needed in seen:
            print(f"{seen[needed]} {j + 1}")
            return
        if val not in seen:
            seen[val] = j + 1

    print("-1")

if __name__ == '__main__':
    main()
`,
      javascript: `const fs = require('fs');

function main() {
    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (tokens.length < 2) return;
    const n = parseInt(tokens[0], 10);
    const k = BigInt(tokens[1]);

    const seen = new Map();
    for (let j = 0; j < n; j++) {
        const val = BigInt(tokens[2 + j]);
        const needed = k - val;
        const key = needed.toString();
        if (seen.has(key)) {
            console.log(\`\${seen.get(key)} \${j + 1}\`);
            return;
        }
        const valKey = val.toString();
        if (!seen.has(valKey)) {
            seen.set(valKey, j + 1);
        }
    }

    console.log('-1');
}

main();
`,
    },
  },
  {
    id: 'prob-valid-parentheses',
    code: 'P04_BRACKET',
    title: 'Dấu Ngoặc Hợp Lệ',
    difficulty: 'Dễ',
    difficultyColor: 'emerald',
    category: 'Cấu trúc dữ liệu - Stack',
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    description: `Cho một chuỗi $S$ chỉ chứa các ký tự \`(\`, \`)\`, \`{\`, \`}\`, \`[\`, \`]\`.

Hãy xác định xem chuỗi đầu vào có hợp lệ hay không. Một chuỗi ngoặc là hợp lệ nếu:
1. Dấu mở ngoặc phải được đóng bằng dấu ngoặc cùng loại.
2. Dấu mở ngoặc phải được đóng theo đúng thứ tự.
3. Mọi dấu đóng ngoặc đều có dấu mở ngoặc tương ứng trước đó.`,
    inputFormat: `Gồm một dòng chứa chuỗi $S$.`,
    outputFormat: `In ra "YES" nếu chuỗi hợp lệ, ngược lại in ra "NO".`,
    constraints: [
      '1 ≤ |S| ≤ 10^5',
      'Chuỗi S chỉ gồm các ký tự \`()\`, \`{}\`, \`[]\`',
    ],
    sampleCases: [
      {
        id: 'tc-vp-1',
        input: '()[]{}',
        expectedOutput: 'YES',
        isSample: true,
        explanation: 'Mọi cặp dấu ngoặc đóng mở đúng cặp và theo thứ tự.',
      },
      {
        id: 'tc-vp-2',
        input: '([{}])',
        expectedOutput: 'YES',
        isSample: true,
        explanation: 'Các cặp dấu ngoặc lồng nhau chuẩn xác.',
      },
      {
        id: 'tc-vp-3',
        input: '(]',
        expectedOutput: 'NO',
        isSample: true,
        explanation: 'Dấu mở ( bị đóng bởi ].',
      },
    ],
    hiddenCases: [
      { id: 'tc-vp-h1', input: '([)]', expectedOutput: 'NO' },
      { id: 'tc-vp-h2', input: '{[]}', expectedOutput: 'YES' },
      { id: 'tc-vp-h3', input: '(((', expectedOutput: 'NO' },
      { id: 'tc-vp-h4', input: ')]}', expectedOutput: 'NO' },
      { id: 'tc-vp-h5', input: '{[()()]}', expectedOutput: 'YES' },
    ],
    starters: {
      cpp: `#include <iostream>
#include <string>
#include <stack>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    string s;
    if (!(cin >> s)) return 0;

    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') {
            st.push(c);
        } else {
            if (st.empty()) {
                cout << "NO\\n";
                return 0;
            }
            char top = st.top();
            st.pop();
            if ((c == ')' && top != '(') ||
                (c == ']' && top != '[') ||
                (c == '}' && top != '{')) {
                cout << "NO\\n";
                return 0;
            }
        }
    }

    cout << (st.empty() ? "YES" : "NO") << "\\n";
    return 0;
}
`,
      c: `#include <stdio.h>
#include <string.h>

int main() {
    char s[100005];
    if (scanf("%s", s) != 1) return 0;

    char stack[100005];
    int top = 0;

    for (int i = 0; s[i]; i++) {
        char c = s[i];
        if (c == '(' || c == '[' || c == '{') {
            stack[top++] = c;
        } else {
            if (top == 0) {
                printf("NO\\n");
                return 0;
            }
            char last = stack[--top];
            if ((c == ')' && last != '(') ||
                (c == ']' && last != '[') ||
                (c == '}' && last != '{')) {
                printf("NO\\n");
                return 0;
            }
        }
    }

    printf("%s\\n", top == 0 ? "YES" : "NO");
    return 0;
}
`,
      python: `import sys

def main():
    s = sys.stdin.read().strip()
    if not s:
        print("YES")
        return

    mapping = {')': '(', ']': '[', '}': '{'}
    stack = []

    for char in s:
        if char in "({[":
            stack.append(char)
        elif char in mapping:
            if not stack or stack[-1] != mapping[char]:
                print("NO")
                return
            stack.pop()

    print("YES" if not stack else "NO")

if __name__ == '__main__':
    main()
`,
      javascript: `const fs = require('fs');

function main() {
    const s = fs.readFileSync(0, 'utf-8').trim();
    if (!s) {
        console.log('YES');
        return;
    }

    const mapping = { ')': '(', ']': '[', '}': '{' };
    const stack = [];

    for (let i = 0; i < s.length; i++) {
        const c = s[i];
        if (c === '(' || c === '[' || c === '{') {
            stack.push(c);
        } else if (mapping[c]) {
            if (stack.length === 0 || stack[stack.length - 1] !== mapping[c]) {
                console.log('NO');
                return;
            }
            stack.pop();
        }
    }

    console.log(stack.length === 0 ? 'YES' : 'NO');
}

main();
`,
    },
  },
  {
    id: 'prob-kadane',
    code: 'P05_KADANE',
    title: 'Dãy Con Có Tổng Lớn Nhất (Maximum Subarray)',
    difficulty: 'Trung bình',
    difficultyColor: 'amber',
    category: 'Quy hoạch động',
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    description: `Cho một mảng $A$ gồm $N$ số nguyên. Hãy tìm một dãy con liên tiếp chứa ít nhất một phần tử sao cho tổng các phần tử trong dãy con đó là lớn nhất có thể.

Bài toán nổi tiếng này có thể được giải quyết bằng thuật toán Kadane với độ phức tạp $O(N)$.`,
    inputFormat: `Dòng thứ nhất chứa số nguyên $N$.
Dòng thứ hai chứa $N$ số nguyên $a_1, a_2, ..., a_N$ cách nhau bởi dấu cách.`,
    outputFormat: `In ra một số nguyên duy nhất là tổng lớn nhất tìm được.`,
    constraints: [
      '1 ≤ N ≤ 10^5',
      '-10^9 ≤ a_i ≤ 10^9',
      'Đảm bảo kết quả nằm trong phạm vi số nguyên 64-bit',
    ],
    sampleCases: [
      {
        id: 'tc-kad-1',
        input: `9
-2 1 -3 4 -1 2 1 -5 4`,
        expectedOutput: '6',
        isSample: true,
        explanation: 'Dãy con liên tiếp [4, -1, 2, 1] có tổng lớn nhất là 6.',
      },
      {
        id: 'tc-kad-2',
        input: `1
1`,
        expectedOutput: '1',
        isSample: true,
        explanation: 'Chỉ có 1 phần tử nên tổng là 1.',
      },
      {
        id: 'tc-kad-3',
        input: `5
5 4 -1 7 8`,
        expectedOutput: '23',
        isSample: true,
        explanation: 'Cả mảng có tổng là 23.',
      },
    ],
    hiddenCases: [
      {
        id: 'tc-kad-h1',
        input: `4
-5 -2 -8 -1`,
        expectedOutput: '-1',
      },
      {
        id: 'tc-kad-h2',
        input: `6
0 0 0 0 0 0`,
        expectedOutput: '0',
      },
      {
        id: 'tc-kad-h3',
        input: `7
-2 3 2 -1 4 -5 6`,
        expectedOutput: '14',
      },
    ],
    starters: {
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;

    long long currentSum = 0;
    long long maxSum = -1e18;

    for (int i = 0; i < n; i++) {
        long long val;
        cin >> val;
        if (i == 0) {
            currentSum = val;
            maxSum = val;
        } else {
            currentSum = max(val, currentSum + val);
            maxSum = max(maxSum, currentSum);
        }
    }

    cout << maxSum << "\\n";
    return 0;
}
`,
      c: `#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;

    long long currentSum = 0;
    long long maxSum = -1e18;

    for (int i = 0; i < n; i++) {
        long long val;
        scanf("%lld", &val);
        if (i == 0) {
            currentSum = val;
            maxSum = val;
        } else {
            currentSum = (val > currentSum + val) ? val : (currentSum + val);
            if (currentSum > maxSum) maxSum = currentSum;
        }
    }

    printf("%lld\\n", maxSum);
    return 0;
}
`,
      python: `import sys

def main():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    arr = [int(x) for x in tokens[1:1+n]]

    max_sum = arr[0]
    curr_sum = arr[0]

    for val in arr[1:]:
        curr_sum = max(val, curr_sum + val)
        max_sum = max(max_sum, curr_sum)

    print(max_sum)

if __name__ == '__main__':
    main()
`,
      javascript: `const fs = require('fs');

function main() {
    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (tokens.length < 2) return;
    const n = parseInt(tokens[0], 10);
    const arr = tokens.slice(1, 1 + n).map(BigInt);

    let currSum = arr[0];
    let maxSum = arr[0];

    for (let i = 1; i < n; i++) {
        currSum = (arr[i] > currSum + arr[i]) ? arr[i] : (currSum + arr[i]);
        if (currSum > maxSum) {
            maxSum = currSum;
        }
    }

    console.log(maxSum.toString());
}

main();
`,
    },
  },
  {
    id: 'prob-fibonacci',
    code: 'P06_FIBO',
    title: 'Số Fibonacci Modulo 10^9 + 7',
    difficulty: 'Dễ',
    difficultyColor: 'emerald',
    category: 'Toán học & Quy hoạch động',
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    description: `Dãy số Fibonacci được định nghĩa như sau:
$F(0) = 0$
$F(1) = 1$
$F(N) = (F(N-1) + F(N-2)) \\pmod{10^9 + 7}$ với mọi $N \\ge 2$.

Cho số nguyên không âm $N$, hãy tính giá trị của $F(N) \\pmod{10^9 + 7}$.`,
    inputFormat: `Gồm một dòng chứa số nguyên $N$.`,
    outputFormat: `In ra giá trị của $F(N) \\pmod{10^9 + 7}$.`,
    constraints: [
      '0 ≤ N ≤ 10^6',
    ],
    sampleCases: [
      {
        id: 'tc-fib-1',
        input: '0',
        expectedOutput: '0',
        isSample: true,
        explanation: 'F(0) = 0.',
      },
      {
        id: 'tc-fib-2',
        input: '10',
        expectedOutput: '55',
        isSample: true,
        explanation: 'F(10) = 55.',
      },
      {
        id: 'tc-fib-3',
        input: '30',
        expectedOutput: '832040',
        isSample: true,
        explanation: 'F(30) = 832040.',
      },
    ],
    hiddenCases: [
      { id: 'tc-fib-h1', input: '1', expectedOutput: '1' },
      { id: 'tc-fib-h2', input: '100', expectedOutput: '687995182' },
      { id: 'tc-fib-h3', input: '100000', expectedOutput: '25974069' },
      { id: 'tc-fib-h4', input: '1000000', expectedOutput: '848777977' },
    ],
    starters: {
      cpp: `#include <iostream>

using namespace std;

const int MOD = 1000000007;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    long long n;
    if (!(cin >> n)) return 0;

    if (n == 0) { cout << 0 << "\\n"; return 0; }
    if (n == 1) { cout << 1 << "\\n"; return 0; }

    long long a = 0, b = 1;
    for (int i = 2; i <= n; i++) {
        long long c = (a + b) % MOD;
        a = b;
        b = c;
    }

    cout << b << "\\n";
    return 0;
}
`,
      c: `#include <stdio.h>

#define MOD 1000000007

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;

    if (n == 0) { printf("0\\n"); return 0; }
    if (n == 1) { printf("1\\n"); return 0; }

    int a = 0, b = 1;
    for (int i = 2; i <= n; i++) {
        int c = (a + b) % MOD;
        a = b;
        b = c;
    }

    printf("%d\\n", b);
    return 0;
}
`,
      python: `import sys

def main():
    s = sys.stdin.read().strip()
    if not s:
        return
    n = int(s)
    MOD = 1000000007

    if n == 0:
        print(0)
        return
    if n == 1:
        print(1)
        return

    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, (a + b) % MOD

    print(b)

if __name__ == '__main__':
    main()
`,
      javascript: `const fs = require('fs');

function main() {
    const input = fs.readFileSync(0, 'utf-8').trim();
    if (!input) return;
    const n = parseInt(input, 10);
    const MOD = 1000000007n;

    if (n === 0) { console.log('0'); return; }
    if (n === 1) { console.log('1'); return; }

    let a = 0n, b = 1n;
    for (let i = 2; i <= n; i++) {
        const c = (a + b) % MOD;
        a = b;
        b = c;
    }

    console.log(b.toString());
}

main();
`,
    },
  },
  {
    id: 'prob-prime-count',
    code: 'P07_PRIME',
    title: 'Đếm Số Nguyên Tố Trong Đoạn [L, R]',
    difficulty: 'Trung bình',
    difficultyColor: 'amber',
    category: 'Số học & Sàng Eratosthenes',
    timeLimitMs: 1500,
    memoryLimitMb: 256,
    description: `Cho hai số nguyên dương $L$ và $R$. Hãy đếm số lượng các số nguyên tố nằm trong đoạn $[L, R]$ (bao gồm cả $L$ và $R$).

Số nguyên tố là số nguyên lớn hơn 1 và chỉ chia hết cho 1 và chính nó.`,
    inputFormat: `Gồm một dòng duy nhất chứa hai số nguyên $L$ và $R$ cách nhau bởi dấu cách.`,
    outputFormat: `In ra số lượng số nguyên tố trong đoạn $[L, R]$.`,
    constraints: [
      '1 ≤ L ≤ R ≤ 10^5',
    ],
    sampleCases: [
      {
        id: 'tc-pri-1',
        input: '1 10',
        expectedOutput: '4',
        isSample: true,
        explanation: 'Các số nguyên tố trong [1, 10] là: 2, 3, 5, 7.',
      },
      {
        id: 'tc-pri-2',
        input: '10 20',
        expectedOutput: '4',
        isSample: true,
        explanation: 'Các số nguyên tố trong [10, 20] là: 11, 13, 17, 19.',
      },
    ],
    hiddenCases: [
      { id: 'tc-pri-h1', input: '1 1', expectedOutput: '0' },
      { id: 'tc-pri-h2', input: '20 30', expectedOutput: '2' },
      { id: 'tc-pri-h3', input: '1 100', expectedOutput: '25' },
      { id: 'tc-pri-h4', input: '1000 2000', expectedOutput: '135' },
    ],
    starters: {
      cpp: `#include <iostream>
#include <vector>

using namespace std;

const int MAX = 100005;
bool isPrime[MAX];

void sieve() {
    fill(isPrime, isPrime + MAX, true);
    isPrime[0] = isPrime[1] = false;
    for (int p = 2; p * p < MAX; p++) {
        if (isPrime[p]) {
            for (int i = p * p; i < MAX; i += p)
                isPrime[i] = false;
        }
    }
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    sieve();
    int l, r;
    if (cin >> l >> r) {
        int count = 0;
        for (int i = l; i <= r; i++) {
            if (isPrime[i]) count++;
        }
        cout << count << "\\n";
    }
    return 0;
}
`,
      c: `#include <stdio.h>
#include <stdbool.h>

#define MAX 100005
bool isPrime[MAX];

void sieve() {
    for (int i = 0; i < MAX; i++) isPrime[i] = true;
    isPrime[0] = isPrime[1] = false;
    for (int p = 2; p * p < MAX; p++) {
        if (isPrime[p]) {
            for (int i = p * p; i < MAX; i += p)
                isPrime[i] = false;
        }
    }
}

int main() {
    sieve();
    int l, r;
    if (scanf("%d %d", &l, &r) == 2) {
        int count = 0;
        for (int i = l; i <= r; i++) {
            if (isPrime[i]) count++;
        }
        printf("%d\\n", count);
    }
    return 0;
}
`,
      python: `import sys

def main():
    tokens = sys.stdin.read().split()
    if len(tokens) < 2:
        return
    l = int(tokens[0])
    r = int(tokens[1])

    MAX = r + 1
    is_prime = [True] * MAX
    if MAX > 0: is_prime[0] = False
    if MAX > 1: is_prime[1] = False

    p = 2
    while p * p < MAX:
        if is_prime[p]:
            for i in range(p * p, MAX, p):
                is_prime[i] = False
        p += 1

    count = sum(1 for i in range(l, r + 1) if is_prime[i])
    print(count)

if __name__ == '__main__':
    main()
`,
      javascript: `const fs = require('fs');

function main() {
    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (tokens.length < 2) return;
    const l = parseInt(tokens[0], 10);
    const r = parseInt(tokens[1], 10);

    const isPrime = new Uint8Array(r + 1);
    isPrime.fill(1);
    if (r >= 0) isPrime[0] = 0;
    if (r >= 1) isPrime[1] = 0;

    for (let p = 2; p * p <= r; p++) {
        if (isPrime[p]) {
            for (let i = p * p; i <= r; i += p) {
                isPrime[i] = 0;
            }
        }
    }

    let count = 0;
    for (let i = l; i <= r; i++) {
        if (isPrime[i]) count++;
    }

    console.log(count);
}

main();
`,
    },
  },
];
