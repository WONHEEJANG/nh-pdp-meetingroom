import React from 'react';

const guidelines = [
  '예약 시간 5분 전까지 입실해주세요',
  '회의 종료 후 정리정돈을 부탁드립니다',
  '예약 변경은 시작 30분 전까지 가능합니다',
];

export const Guidelines: React.FC = () => {
  return (
    <div className="space-y-3 mb-8">
      {guidelines.map((guideline, index) => (
        <div key={index} className="flex items-start gap-3">
          <div className="w-1 h-1 bg-gray-500 rounded-full mt-3"></div>
          <span className="text-gray-600">{guideline}</span>
        </div>
      ))}
    </div>
  );
};
