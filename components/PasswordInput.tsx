'use client'

import React from 'react'

interface PasswordInputProps {
  value: string
  onChange: (value: string) => void
  onKeyDown?: (e: React.KeyboardEvent) => void
  placeholder?: string
  label?: string
  description?: string
}

const PasswordInput: React.FC<PasswordInputProps> = ({ 
  value, 
  onChange, 
  onKeyDown,
  placeholder = "4자리 숫자 입력",
  label = "비밀번호",
  description
}) => {
  return (
    <div className="mb-6">
      <div className="mb-2">
        <span 
          className="text-[#505050]"
          style={{ fontFamily: 'Pretendard', fontWeight: 500, fontSize: '14px', letterSpacing: '-0.28px', lineHeight: '22px' }}
        >
          {label}
        </span>
      </div>
      <div className="w-full bg-white border border-[#e1e1e1] rounded-xl" style={{ height: '54px', paddingLeft: '20px', paddingRight: '20px' }}>
        <input
          type="password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          inputMode="numeric"
          pattern="[0-9]*"
          className="w-full h-full text-[#121212] placeholder-[#929292] focus:outline-none bg-white"
          style={{ fontFamily: 'Pretendard', fontWeight: 500, fontSize: '18px', letterSpacing: '-0.36px', lineHeight: '26px' }}
        />
      </div>
      {description && (
        <p 
          className="text-[#767676] mt-2"
          style={{ fontFamily: 'Pretendard', fontWeight: 400, fontSize: '13px', letterSpacing: '-0.26px', lineHeight: '20px' }}
        >
          {description}
        </p>
      )}
    </div>
  )
}

export default PasswordInput
