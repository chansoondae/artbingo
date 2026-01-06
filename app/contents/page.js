import Link from 'next/link'
import { supabase } from '../../lib/supabase'
import ContentsClient from './ContentsClient'

// 메타데이터 설정
export const metadata = {
  title: '아트프렌즈 인기 콘텐츠 TOP 300 | Art Friends',
  description: '2025년 조회수 기준 아트프렌즈 인기 콘텐츠를 확인하세요. 카테고리별, 작성자별로 다양한 미술 콘텐츠를 탐색할 수 있습니다.',
  keywords: '아트프렌즈, 미술 콘텐츠, 전시 정보, 미술관, 갤러리, 인기 콘텐츠',
  openGraph: {
    title: '아트프렌즈 인기 콘텐츠 TOP 300',
    description: '2025년 조회수 기준 아트프렌즈 인기 콘텐츠. 카테고리별, 작성자별 미술 콘텐츠 탐색',
    images: [
      {
        url: '/og-contents.jpg',
        width: 1200,
        height: 630,
        alt: '아트프렌즈 인기 콘텐츠',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '아트프렌즈 인기 콘텐츠 TOP 300',
    description: '2025년 조회수 기준 아트프렌즈 인기 콘텐츠',
    images: ['/og-contents.jpg'],
  },
}

// 빌드 시 데이터 가져오기 (SSG)
async function getContents() {
  const { data, error } = await supabase
    .from('art_contents_all')
    .select('*')
    .order('view_count', { ascending: false })
    .limit(300)

  if (error) {
    console.error('Error fetching contents:', error)
    return []
  }

  return data || []
}

export default async function ArtFriendsPage() {
  const contents = await getContents()

  // 작성자별 통계 계산
  const authorStats = {}
  contents.forEach(content => {
    if (content.author) {
      if (!authorStats[content.author]) {
        authorStats[content.author] = 0
      }
      authorStats[content.author]++
    }
  })
  const allAuthors = Object.entries(authorStats)
    .sort((a, b) => b[1] - a[1])

  return (
    <div id="top" className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                🎨 아트프렌즈 인기 콘텐츠
              </h1>
              <p className="text-white/60 text-sm">조회수 기준 2025년 Top 300</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-sm transition-all duration-200 hover:scale-105"
            >
              ← 홈으로
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ContentsClient contents={contents} allAuthors={allAuthors} />

        {/* Back to Top Link */}
        {contents.length > 10 && (
          <div className="mt-12 text-center">
            <a
              href="#top"
              className="inline-block px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105"
            >
              ↑ 맨 위로
            </a>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-white/50 text-sm">
            © 2026 Art Friends. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
