// /components/NicknameModal.js
import { useState, useEffect, useRef } from 'react';

export default function NicknameModal({ isOpen, onClose, onSubmit, isSubmitting }) {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const modalRef = useRef(null);
  const inputRef = useRef(null);

  // 모달이 열릴 때 인풋에 포커스
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  // 모달 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // ESC 키 누르면 모달 닫기
  useEffect(() => {
    function handleEscKey(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    } else {
      document.removeEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!nickname.trim()) {
      setError('닉네임을 입력해주세요.');
      return;
    }
    
    if (nickname.length > 10) {
      setError('닉네임은 10자 이내로 입력해주세요.');
      return;
    }
    
    // 특수 문자 제한 (한글, 영문, 숫자만 허용)
    if (!/^[가-힣a-zA-Z0-9]+$/.test(nickname)) {
      setError('한글, 영문, 숫자만 사용할 수 있습니다.');
      return;
    }
    
    setError('');
    onSubmit(nickname);
  };

  // 모달이 닫혀있으면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
      <div 
        ref={modalRef}
        className="bg-white p-6 rounded-xl shadow-2xl w-11/12 max-w-md transform transition-all duration-300 ease-in-out scale-100"
      >
        <h3 className="text-xl font-bold mb-4 text-[#E53935]">나의 결과 저장하기</h3>
        <p className="mb-4 text-gray-700">닉네임을 입력하면 당신의 결과가 리더보드에 기록됩니다!</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
              닉네임
            </label>
            <input
              ref={inputRef}
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F5847A] focus:border-[#F5847A]"
              maxLength={10}
              disabled={isSubmitting}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            <p className="mt-1 text-xs text-gray-500">* 한글, 영문, 숫자 / 최대 10자</p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-100 transition-colors duration-200"
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              type="submit"
              className="relative px-4 py-2 bg-gradient-to-r from-[#F5847A] to-[#E53935] text-white font-medium rounded-md hover:from-[#E53935] hover:to-[#C62828] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F5847A] transition-all duration-200 overflow-hidden"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <span className="inline-block w-4 h-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  진행 중...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <span className="mr-1">저장하기</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 ml-1 transform transition-transform duration-300 ease-in-out group-hover:translate-x-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
              
              {/* 물결 효과 애니메이션 */}
              {isSubmitting && (
                <span className="absolute inset-0 flex justify-center items-center">
                  <span className="absolute h-8 w-8 rounded-full bg-white opacity-20 animate-ping"></span>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}