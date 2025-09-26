'use client'

import React, { useState, useEffect } from 'react'

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
  const [isAnimating, setIsAnimating] = useState(false)
  const [isIdle, setIsIdle] = useState(false) // 1.5초 동안 동작이 없을 때 true

  // console.log('🎭 ActionButtons 렌더링 - isAnimating:', isAnimating, 'isIdle:', isIdle)

  // ===== 마이크로인터랙션 애니메이션 코드 (주석처리됨) =====
  // 나중에 다시 사용하려면 아래 주석을 해제하세요
  
  // // 애니메이션 실행 함수
  // const startAnimation = () => {
  //   console.log('🎯 애니메이션 시작!')
  //   setIsAnimating(true)
  //   // 애니메이션 완료 후 상태 리셋
  //   setTimeout(() => {
  //     console.log('✅ 애니메이션 완료')
  //     setIsAnimating(false)
  //   }, 400) // 0.4초 애니메이션 시간
  // }

  // // 1.5초 동안 동작이 없을 때 애니메이션 시작 (2번만)
  // useEffect(() => {
  //   if (!isIdle) return

  //   console.log('🚀 1.5초 동안 동작 없음 - 애니메이션 시작')
    
  //   let animationCount = 0
  //   const maxAnimations = 2
    
  //   const executeAnimation = () => {
  //     if (animationCount < maxAnimations) {
  //       console.log(`🎯 애니메이션 ${animationCount + 1}/${maxAnimations} 실행`)
  //       startAnimation()
  //       animationCount++
        
  //       // 3초 후 다음 애니메이션 실행
  //       setTimeout(executeAnimation, 3000)
  //     } else {
  //       console.log('✅ 2번 애니메이션 완료')
  //     }
  //   }
    
  //   // 첫 번째 애니메이션 즉시 실행
  //   executeAnimation()

  //   return () => {
  //     console.log('🧹 애니메이션 정리')
  //   }
  // }, [isIdle])

  // // 사용자 액션 감지 및 1.5초 대기 타이머
  // useEffect(() => {
  //   let idleTimer: NodeJS.Timeout

  //   const handleUserAction = (event: Event) => {
  //     console.log('👆 사용자 액션 감지:', event.type)
      
  //     // 기존 타이머 클리어
  //     clearTimeout(idleTimer)
  //     setIsIdle(false)
      
  //     // 1.5초 후에 idle 상태로 설정
  //     idleTimer = setTimeout(() => {
  //       console.log('⏰ 1.5초 동안 동작 없음 - idle 상태로 변경')
  //       setIsIdle(true)
  //     }, 1500)
  //   }

  //   console.log('🎧 사용자 액션 리스너 등록')
    
  //   // 다양한 사용자 액션 이벤트 리스너 추가
  //   window.addEventListener('scroll', handleUserAction, { passive: true })
  //   window.addEventListener('touchstart', handleUserAction, { passive: true })
  //   window.addEventListener('mousedown', handleUserAction, { passive: true })
  //   window.addEventListener('keydown', handleUserAction, { passive: true })

  //   // 컴포넌트 마운트 시에도 1.5초 타이머 시작
  //   idleTimer = setTimeout(() => {
  //     console.log('⏰ 초기 1.5초 대기 완료 - idle 상태로 변경')
  //     setIsIdle(true)
  //   }, 1500)

  //   return () => {
  //     console.log('🧹 사용자 액션 리스너 제거')
  //     clearTimeout(idleTimer)
  //     window.removeEventListener('scroll', handleUserAction)
  //     window.removeEventListener('touchstart', handleUserAction)
  //     window.removeEventListener('mousedown', handleUserAction)
  //     window.removeEventListener('keydown', handleUserAction)
  //   }
  // }, [])
  // ===== 마이크로인터랙션 애니메이션 코드 끝 =====

  const handleButtonClick = (callback?: () => void) => {
    if (callback) callback()
  }
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
              onClick={() => handleButtonClick(onCancel)}
              className={`flex-1 bg-white border border-[#d3d3d3] rounded-xl text-[#121212] hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 ease-in-out touch-manipulation ${
                // isAnimating ? 'transform scale-105' : 'transform scale-100'
                'transform scale-100'
              }`}
              style={{ fontFamily: 'Pretendard', fontWeight: 500, fontSize: '18px', letterSpacing: '-0.36px', lineHeight: '26px', height: '56px' }}
            >
              {cancelText}
            </button>
          )}
          
          {/* Confirm Button */}
          <button
            onClick={() => handleButtonClick(onConfirm)}
            disabled={disabled}
            className={`${showCancel ? 'flex-1' : 'w-full'} rounded-xl transition-all duration-200 ease-in-out touch-manipulation ${
              disabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#19973c] text-white hover:bg-[#15803d] active:bg-[#137a35]'
            } ${
              // isAnimating ? 'transform scale-105' : 'transform scale-100'
              'transform scale-100'
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
