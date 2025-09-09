import React from 'react';
import { Header } from '../Header';
import { BookingSummary } from '../BookingSummary';
import { Guidelines } from '../Guidelines';

interface ConfirmationScreenProps {
  selectedRoom: string;
  selectedDate: string;
  timeRange: string;
  onBack: () => void;
  onConfirm: () => void;
  onEdit: () => void;
}

export const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
  selectedRoom,
  selectedDate,
  timeRange,
  onBack,
  onConfirm,
  onEdit,
}) => {
  return (
    <div className="min-h-screen bg-white">
      <Header
        title="예약확인"
        showCloseButton
        onCloseClick={onBack}
      />

      <div className="px-6 pt-20 pb-32">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">
          <span className="text-green-600 font-bold">{selectedRoom}</span> 예약을 확정할까요?
        </h1>

        <BookingSummary
          selectedRoom={selectedRoom}
          selectedDate={selectedDate}
          timeRange={timeRange}
        />

        <Guidelines />
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white to-transparent">
        <div className="flex gap-3">
          <button onClick={onEdit} className="btn-secondary" style={{ width: '30%' }}>
            수정
          </button>
          <button onClick={onConfirm} className="btn-primary" style={{ width: '70%' }}>
            확정하기
          </button>
        </div>
      </div>
    </div>
  );
};
