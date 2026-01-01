import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "아트프렌즈 2025 전시 빙고",
  description: "2025년 미술 전시 방문 기록 빙고 게임",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
