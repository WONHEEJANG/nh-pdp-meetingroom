import React from 'react';
import Image from 'next/image';

interface CompletionScreenProps {
  selectedRoom: string;
  selectedDate: string;
  timeRange: string;
  onComplete: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  selectedRoom,
  selectedDate,
  timeRange,
  onComplete,
}) => {
  return (
    <div className="min-h-screen bg-white">
      <div className="px-6 py-16 text-left">
        {/* 이미지 영역 - 140x140, 왼쪽 정렬 */}
        <div className="w-35 h-35 mb-8 flex items-center justify-start">
          <Image
            src="/images/img_complete.png"
            alt="예약 완료"
            width={140}
            height={140}
            className="rounded-2xl"
          />
        </div>

        {/* 제목 - 26px, SemiBold */}
        <h1 className="text-[26px] font-semibold text-gray-900 mb-8">
          <span className="text-green-600">{selectedRoom}</span> 예약이 확정됐어요
        </h1>

        {/* 예약 정보 카드 - 회색 배경 #f6f6f6, 16px 둥근 모서리 */}
        <div 
          className="rounded-2xl p-5 mb-8"
          style={{ 
            backgroundColor: '#f6f6f6',
            borderRadius: '16px'
          }}
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center h-5">
              <span 
                className="text-sm"
                style={{ 
                  color: '#505050',
                  fontSize: '15px',
                  lineHeight: '20px'
                }}
              >
                장소
              </span>
              <span 
                className="font-medium text-sm"
                style={{ 
                  color: '#121212',
                  fontSize: '15px',
                  lineHeight: '20px'
                }}
              >
                {selectedRoom} (전략반 앞)
              </span>
            </div>
            <div className="flex justify-between items-center h-5">
              <span 
                className="text-sm"
                style={{ 
                  color: '#505050',
                  fontSize: '15px',
                  lineHeight: '20px'
                }}
              >
                날짜
              </span>
              <span 
                className="font-medium text-sm"
                style={{ 
                  color: '#121212',
                  fontSize: '15px',
                  lineHeight: '20px'
                }}
              >
                {selectedDate}
              </span>
            </div>
            <div className="flex justify-between items-center h-5">
              <span 
                className="text-sm"
                style={{ 
                  color: '#505050',
                  fontSize: '15px',
                  lineHeight: '20px'
                }}
              >
                시간
              </span>
              <span 
                className="font-medium text-sm"
                style={{ 
                  color: '#121212',
                  fontSize: '15px',
                  lineHeight: '20px'
                }}
              >
                {timeRange}
              </span>
            </div>
          </div>
        </div>

        {/* 공유 버튼들 - 중앙 정렬, 56x56, radius 24px, border 추가 */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="flex flex-col items-center">
            <button 
              className="w-14 h-14 flex items-center justify-center mb-2"
              style={{ 
                border: '1px solid var(--color-gray-200)',
                borderRadius: '20px'
              }}
            >
              <Image
                src="/images/ico_share-kakaotalk_fill_32.png"
                alt="카카오톡 공유"
                width={32}
                height={32}
              />
            </button>
            <span className="text-sm text-gray-500">카카오톡</span>
          </div>
          <div className="flex flex-col items-center relative">
            <button 
              className="w-14 h-14 flex items-center justify-center mb-2"
              style={{ 
                border: '1px solid var(--color-gray-200)',
                borderRadius: '20px'
              }}
            >
              <Image
                src="/images/ico_share-link_line_24.png"
                alt="링크 공유"
                width={24}
                height={24}
              />
            </button>
            <span className="text-sm text-gray-500">공유하기</span>
          </div>
        </div>
      </div>

      {/* 하단 확인 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white to-transparent">
        <button onClick={onComplete} className="btn-primary w-full">
          확인
        </button>
      </div>
    </div>
  );
};
