import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VNOJ Mini - Hệ Thống Chấm Bài Online Thật',
  description: 'Hệ thống Online Judge trực tuyến với cơ chế biên dịch và chấm bài thực tế hỗ trợ C++, C, Python 3 và JavaScript với đầy đủ phán quyết AC, WA, TLE, RTE, CE.',
  openGraph: {
    title: 'VNOJ Mini - Hệ Thống Chấm Bài Online Thật',
    description: 'Hệ thống Online Judge trực tuyến với cơ chế biên dịch và chấm bài thực tế hỗ trợ C++, C, Python 3 và JavaScript.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VNOJ Mini - Hệ Thống Chấm Bài Online Thật',
    description: 'Hệ thống Online Judge trực tuyến với cơ chế biên dịch và chấm bài thực tế.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen selection:bg-indigo-500/30 selection:text-indigo-200" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
