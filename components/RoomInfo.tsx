'use client'

import React from 'react'

interface RoomInfoProps {
  selectedRoom: number
}

const RoomInfo: React.FC<RoomInfoProps> = ({ selectedRoom }) => {
  // 각 회의실별 정보 정의
  const roomData = {
    1: {
      capacity: 10,
      features: ['영상기기 연결 지원', '화이트보드', '프로젝터']
    },
    2: {
      capacity: 6,
      features: ['영상기기 연결 지원', '화이트보드']
    },
    3: {
      capacity: 4,
      features: ['영상기기 연결 지원', '소형 회의용']
    }
  }

  const currentRoom = roomData[selectedRoom as keyof typeof roomData]

  return (
    <div className="w-full" style={{ paddingTop: '16px', paddingBottom: '16px' }}>
      {/* Info Box */}
      <div className="w-full bg-[#f6f6f6] rounded-2xl p-4 mb-6 flex items-center" style={{ height: '62px' }}>
        <p 
          className="text-[#505050]"
          style={{ fontFamily: 'Pretendard', fontWeight: 400, fontSize: '14px', letterSpacing: '-0.28px', lineHeight: '22px', wordBreak: 'keep-all' }}
        >
          수용인원 최대 {currentRoom.capacity}명, {currentRoom.features.join(', ')}
        </p>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end mb-4" style={{ height: '24px' }}>
        <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white border border-[#d3d3d3] rounded-sm flex-shrink-0"></div>
            <span 
              className="text-[#505050] whitespace-nowrap"
              style={{ fontFamily: 'Pretendard', fontWeight: 400, fontSize: '12px', letterSpacing: '0px', lineHeight: '14.32px' }}
            >
              예약가능
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#f6f6f6] rounded-sm flex-shrink-0"></div>
            <span 
              className="text-[#505050] whitespace-nowrap"
              style={{ fontFamily: 'Pretendard', fontWeight: 400, fontSize: '12px', letterSpacing: '0px', lineHeight: '14.32px' }}
            >
              예약불가
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#111111] rounded-sm flex-shrink-0"></div>
            <span 
              className="text-[#505050] whitespace-nowrap"
              style={{ fontFamily: 'Pretendard', fontWeight: 400, fontSize: '12px', letterSpacing: '0px', lineHeight: '14.32px' }}
            >
              선택
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomInfo
