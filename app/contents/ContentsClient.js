'use client'

import { useState } from 'react'

export default function ContentsClient({ contents, allAuthors }) {
  const [selectedAuthors, setSelectedAuthors] = useState([])
  const [showAuthorCount, setShowAuthorCount] = useState(5)

  const getMonthBadge = (dateString) => {
    if (!dateString) return { year: '-', month: '-', color: 'bg-gray-400 text-white border-gray-500' }

    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = date.getMonth() + 1

    // 월별 색상 - 계절감 있는 색상
    const monthColors = {
      1: 'bg-slate-400 text-white border-slate-500',        // 겨울 - 차가운 회색
      2: 'bg-blue-400 text-white border-blue-500',          // 겨울 - 얼음같은 파랑
      3: 'bg-pink-300 text-white border-pink-400',          // 봄 - 벚꽃 핑크
      4: 'bg-green-300 text-white border-green-400',        // 봄 - 새싹 연두
      5: 'bg-rose-400 text-white border-rose-500',          // 봄 - 장미 핑크
      6: 'bg-sky-300 text-white border-sky-400',            // 여름 - 하늘 하늘색
      7: 'bg-cyan-400 text-white border-cyan-500',          // 여름 - 바다 청록
      8: 'bg-teal-400 text-white border-teal-500',          // 여름 - 민트 청록
      9: 'bg-amber-400 text-white border-amber-500',        // 가을 - 황금빛
      10: 'bg-orange-400 text-white border-orange-500',     // 가을 - 단풍 오렌지
      11: 'bg-yellow-400 text-white border-yellow-500',     // 가을 - 은행잎 노랑
      12: 'bg-red-500 text-white border-red-600',           // 겨울 - 크리스마스 빨강
    }

    return {
      year,
      month,
      color: monthColors[month] || 'bg-white/20 text-white/70 border-white/30'
    }
  }

  const formatNumber = (num) => {
    if (!num) return 0
    return num.toLocaleString('ko-KR')
  }

  const getCategoryColor = (category) => {
    const colors = {
      // 메인 게시판
      '✍️자유게시판': 'bg-emerald-400 text-white border-emerald-500',

      // 전시 관련
      '🎨미술관/갤러리 후기': 'bg-purple-400 text-white border-purple-500',
      '🎨전시오픈/할인/추천': 'bg-violet-400 text-white border-violet-500',
      '📍전시 추천 코스': 'bg-indigo-400 text-white border-indigo-500',

      // 여행 관련
      '🥘맛집 여행 후기': 'bg-orange-400 text-white border-orange-500',
      '🇯🇵일본여행': 'bg-red-400 text-white border-red-500',
      '🇲🇳몽골여행': 'bg-sky-400 text-white border-sky-500',
      '🏖️아시아여행': 'bg-teal-400 text-white border-teal-500',
      '🌊부산여행': 'bg-cyan-400 text-white border-cyan-500',
      '🗿남미여행': 'bg-amber-500 text-white border-amber-600',
      '🇪🇺유럽여행': 'bg-blue-500 text-white border-blue-600',
      '🏝️제주여행': 'bg-emerald-400 text-white border-emerald-500',
      '🍎경상북도여행': 'bg-rose-400 text-white border-rose-500',
      '🍲전라남도여행': 'bg-lime-500 text-white border-lime-600',
      '🌆서울여행': 'bg-slate-500 text-white border-slate-600',
      '☕카페 여행 후기': 'bg-amber-400 text-white border-amber-500',
      '🏨숙박 후기': 'bg-pink-400 text-white border-pink-500',

      // 이벤트/행사
      '📢 지금 여기': 'bg-green-400 text-white border-green-500',
      '🎊프리즈&키아프': 'bg-fuchsia-400 text-white border-fuchsia-500',
      '🏆아트프렌즈 콘테스트': 'bg-yellow-400 text-white border-yellow-500',
      '⚡번개 공지': 'bg-yellow-300 text-white border-yellow-400',
      '🚌아트버스 공지': 'bg-green-500 text-white border-green-600',
      '🎅🏻🎄크리스마스': 'bg-red-500 text-white border-red-600',
      '📝번개/아트버스 후기': 'bg-lime-400 text-white border-lime-500',

      // 커뮤니티
      '1️⃣ 한 줄 수다방': 'bg-pink-400 text-white border-pink-500',
      '🎙️공지사항': 'bg-slate-400 text-white border-slate-500',
      '❓질문게시판': 'bg-sky-500 text-white border-sky-600',
      '💓나눔게시판': 'bg-rose-400 text-white border-rose-500',
      '💡그때 거기': 'bg-amber-400 text-white border-amber-500',

      // 문화/교양
      '🎧아프 도슨트': 'bg-indigo-500 text-white border-indigo-600',
      '🖼️하루 한 작품': 'bg-purple-500 text-white border-purple-600',
      '🎭공연/영화/연극 후기': 'bg-violet-500 text-white border-violet-600',
      '🎭공연/영화/연극 정보': 'bg-fuchsia-500 text-white border-fuchsia-600',
      '🎤강연 클래스 후기': 'bg-blue-600 text-white border-blue-700',
      '📚서평/초대권이벤트': 'bg-emerald-500 text-white border-emerald-600',

      // 음식
      '🍲남의집 뭐먹나': 'bg-orange-500 text-white border-orange-600',
    }
    return colors[category] || 'bg-gray-400 text-white border-gray-500'
  }

  // 작성자 토글 함수
  const toggleAuthor = (author) => {
    setSelectedAuthors(prev => {
      if (prev.includes(author)) {
        return prev.filter(a => a !== author)
      } else {
        return [...prev, author]
      }
    })
  }

  // 필터링된 콘텐츠
  const filteredContents = selectedAuthors.length > 0
    ? contents.filter(content => selectedAuthors.includes(content.author))
    : contents

  const displayedAuthors = allAuthors.slice(0, showAuthorCount)
  const hasMoreAuthors = showAuthorCount < allAuthors.length

  // 다음 단계 계산
  const getNextCount = () => {
    if (showAuthorCount === 5) return 10
    if (showAuthorCount === 10) return 20
    const nextStep = showAuthorCount + 10
    return nextStep >= allAuthors.length ? allAuthors.length : nextStep
  }

  return (
    <>
      {/* Author Statistics */}
      <div className="mb-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>👑</span>
            <span>Top {Math.min(showAuthorCount, allAuthors.length)} 작성자</span>
            {selectedAuthors.length > 0 && (
              <span className="text-sm font-normal text-emerald-400">
                ({selectedAuthors.length}명 선택)
              </span>
            )}
          </h2>
          {selectedAuthors.length > 0 && (
            <button
              onClick={() => setSelectedAuthors([])}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 border border-white/30 text-white text-sm rounded-lg transition-all duration-200"
            >
              전체 보기
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {displayedAuthors.map(([author, count], index) => (
            <button
              key={author}
              onClick={() => toggleAuthor(author)}
              className={`
                bg-white/5 border rounded-xl p-4 transition-all duration-200 text-left
                ${selectedAuthors.includes(author)
                  ? 'border-emerald-400/60 bg-emerald-500/20 ring-2 ring-emerald-400/40'
                  : 'border-white/10 hover:bg-white/10 hover:border-white/20'}
              `}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`
                  inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
                  ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-900' :
                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-gray-900' :
                    index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-orange-900' :
                    'bg-white/20 text-white'}
                `}>
                  {index + 1}
                </span>
                <span className="text-white font-bold truncate">{author}</span>
              </div>
              <div className="text-white/70 text-sm">
                <span className="font-semibold text-white">{count}</span>개의 콘텐츠
              </div>
            </button>
          ))}
        </div>

        {/* 더보기/접기 버튼 */}
        <div className="mt-4 flex items-center justify-center gap-3">
          {hasMoreAuthors && (
            <button
              onClick={() => setShowAuthorCount(getNextCount())}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105"
            >
              더보기 (Top {getNextCount()})
            </button>
          )}
          {showAuthorCount > 5 && (
            <button
              onClick={() => setShowAuthorCount(5)}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105"
            >
              접기
            </button>
          )}
        </div>

        {selectedAuthors.length > 0 && (
          <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-400/30 rounded-xl">
            <div className="flex items-start gap-2">
              <p className="text-white text-sm flex-1">
                <span className="font-bold text-emerald-400">{selectedAuthors.join(', ')}</span>의 콘텐츠 <span className="font-bold text-emerald-400">{filteredContents.length}개</span>를 보고 있습니다
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Contents Grid */}
      {filteredContents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContents.map((content, index) => {
            const CardContent = () => {
              const monthBadge = getMonthBadge(content.date)
              return (
                <div className="flex flex-col h-full">
                  {/* Rank */}
                  <div className="mb-4">
                    <div className={`
                      inline-flex items-center justify-center min-w-[3rem] h-12 px-3 rounded-xl font-bold shadow-lg
                      ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-900 shadow-yellow-500/50' :
                        index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-gray-900 shadow-gray-400/50' :
                        index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-orange-900 shadow-orange-500/50' :
                        'bg-white/20 text-white shadow-white/20'}
                    `}>
                      <span>#{index + 1}</span>
                    </div>
                  </div>

                  {/* Badges: Month and Category */}
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${monthBadge.color}`}>
                      {monthBadge.month}월
                    </span>
                    {content.category && (
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getCategoryColor(content.category)}`}>
                        {content.category}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-white font-bold text-lg mb-3 line-clamp-2 min-h-[3.5rem] leading-tight">
                    {content.title}
                  </h3>

                  {/* URL Link */}
                  {content.url && (
                    <div className="mb-4">
                      <span className="text-blue-400 text-sm break-all line-clamp-1">
                        {content.url}
                      </span>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="space-y-3 mb-4 flex-grow">
                    {content.author && (
                      <div className="flex items-center gap-2">
                        <span className="text-white text-xl">🙋🏻‍♀️</span>
                        <span className="text-white text-lg truncate font-bold">{content.author}</span>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-5 border-t border-white/20 mt-auto">
                    <div className="text-center">
                      <div className="text-white text-sm mb-2 flex items-center justify-center gap-1.5 font-medium">
                        <span className="text-base">👁️</span>
                        <span>조회</span>
                      </div>
                      <div className="text-white font-bold text-lg">
                        {formatNumber(content.view_count)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-white text-sm mb-2 flex items-center justify-center gap-1.5 font-medium">
                        <span className="text-base">💬</span>
                        <span>댓글</span>
                      </div>
                      <div className="text-white font-bold text-lg">
                        {formatNumber(content.comments)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-white text-sm mb-2 flex items-center justify-center gap-1.5 font-medium">
                        <span className="text-base">❤️</span>
                        <span>좋아요</span>
                      </div>
                      <div className="text-white font-bold text-lg">
                        {formatNumber(content.likes)}
                      </div>
                    </div>
                  </div>
                </div>
              )
            }

            const cardClasses = `
              relative overflow-hidden
              bg-white/10 backdrop-blur-md border border-white/20
              rounded-2xl p-6
              transition-all duration-300
              hover:bg-white/15 hover:border-white/30
              hover:shadow-2xl hover:shadow-white/10
              hover:scale-[1.02] hover:-translate-y-1
              ${content.url ? 'cursor-pointer' : ''}
            `

            return content.url ? (
              <a
                key={content.id}
                href={content.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cardClasses}
              >
                <CardContent />
              </a>
            ) : (
              <div
                key={content.id}
                className={cardClasses}
              >
                <CardContent />
              </div>
            )
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-16 text-center">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-white/70 text-xl font-medium">
            콘텐츠가 없습니다.
          </p>
          <p className="text-white/50 text-sm mt-2">
            나중에 다시 확인해주세요.
          </p>
        </div>
      )}
    </>
  )
}
