'use client'

import React from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  showCloseButton?: boolean
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  showCloseButton = true 
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl mx-6 w-full max-w-sm animate-in fade-in-0 zoom-in-95 duration-200">
        {title && (
          <div className="px-6 pt-6 pb-4">
            <h2 
              className="text-[#121212]"
              style={{ fontFamily: 'Pretendard', fontWeight: 600, fontSize: '18px', letterSpacing: '-0.36px', lineHeight: '26px' }}
            >
              {title}
            </h2>
          </div>
        )}
        
        <div className="px-6 pt-6 pb-2">
          {children}
        </div>
        
        {showCloseButton && (
          <div className="px-6 pb-6">
            <button
              onClick={onClose}
              className="w-full bg-white border border-[#19973c] rounded-xl text-[#19973c] hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
              style={{ fontFamily: 'Pretendard', fontWeight: 500, fontSize: '16px', letterSpacing: '-0.32px', lineHeight: '24px', height: '48px' }}
            >
              확인
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal
