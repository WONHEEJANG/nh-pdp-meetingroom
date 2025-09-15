'use client'

import React from 'react'

interface HeaderProps {
  onBack?: () => void
  onHome?: () => void
  onMenu?: () => void
}

const Header: React.FC<HeaderProps> = ({ onBack, onHome, onMenu }) => {
  return (
    <div className="w-full bg-white flex items-center justify-center fixed top-0 left-0 right-0 z-10" style={{ height: '50px' }}>
      {/* Title Only */}
      <h1 className="text-base font-semibold text-[#121212] leading-6 tracking-[-0.32px]" style={{ fontFamily: 'Pretendard', fontWeight: 600, fontSize: '16px', letterSpacing: '-0.32px', lineHeight: '24px' }}>
        회의실 예약
      </h1>
    </div>
  )
}

export default Header
