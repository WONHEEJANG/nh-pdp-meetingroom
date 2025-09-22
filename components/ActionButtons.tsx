'use client'

import React from 'react'

interface ActionButtonsProps {
  onCancel?: () => void
  onConfirm?: () => void
  disabled?: boolean
  cancelText?: string
  confirmText?: string
  showCancel?: boolean
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  onCancel, 
  onConfirm, 
  disabled = false, 
  cancelText = '예약취소', 
  confirmText = '예약하기',
  showCancel = true 
}) => {
  return (
    <div className="w-full bg-white fixed bottom-0 left-0 right-0 z-10">
      {/* Spacer */}
      <div className="w-full bg-gradient-to-r from-white to-transparent" style={{ height: '1px' }}></div>
      
      {/* Gradient Background */}
      <div className="w-full bg-gradient-to-b from-white to-transparent flex items-center justify-center py-6 px-6">
        <div className={`flex gap-3 sm:gap-4 w-full ${showCancel ? '' : 'justify-center'}`}>
          {/* Cancel Button */}
          {showCancel && (
            <button
              onClick={onCancel}
              className="flex-1 bg-white border border-[#d3d3d3] rounded-xl text-[#121212] hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
              style={{ fontFamily: 'Pretendard', fontWeight: 500, fontSize: '18px', letterSpacing: '-0.36px', lineHeight: '26px', height: '56px' }}
            >
              {cancelText}
            </button>
          )}
          
          {/* Confirm Button */}
          <button
            onClick={onConfirm}
            disabled={disabled}
            className={`${showCancel ? 'flex-1' : 'w-full'} rounded-xl transition-colors touch-manipulation ${
              disabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#19973c] text-white hover:bg-[#15803d] active:bg-[#137a35]'
            }`}
            style={{ fontFamily: 'Pretendard', fontWeight: 500, fontSize: '18px', letterSpacing: '-0.36px', lineHeight: '26px', height: '56px' }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ActionButtons
