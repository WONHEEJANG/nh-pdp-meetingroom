'use client'

import React, { useState } from 'react';
import { ArrowLeft, Home, Menu, Calendar, ChevronDown, X, Check, Share2, MessageCircle } from 'lucide-react';

const MeetingRoomBooking = () => {
  const [currentStep, setCurrentStep] = useState('timeSelection');
  const [selectedRoom, setSelectedRoom] = useState('회의실 1');
  const [selectedDate, setSelectedDate] = useState('2025.09.27');
  const [selectedTimes, setSelectedTimes] = useState(['15:30', '16:00', '16:30', '17:00']);
  const [showRoomSheet, setShowRoomSheet] = useState(false);
  const [showDateSheet, setShowDateSheet] = useState(false);

  const rooms = [
    { id: 1, name: '회의실 1', capacity: '최대 6명', location: '전략반 앞' },
    { id: 2, name: '회의실 2', capacity: '최대 8명', location: '기획팀 옆' },
    { id: 3, name: '회의실 3', capacity: '최대 4명', location: '개발팀 앞' }
  ];

  const timeSlots = [
    ['09:00', '09:30', '10:00', '10:30'],
    ['11:00', '11:30', '12:00', '12:30'],
    ['13:00', '13:30', '14:00', '14:30'],
    ['15:00', '15:30', '16:00', '16:30'],
    ['17:00', '17:30', '18:00', '18:30']
  ];

  const toggleTimeSelection = (time: string) => {
    setSelectedTimes(prev => {
      if (prev.includes(time)) {
        return prev.filter(t => t !== time);
      } else {
        return [...prev, time].sort();
      }
    });
  };

  const getTimeSlotStatus = (time: string) => {
    if (selectedTimes.includes(time)) return 'selected';
    if (['10:00', '10:30', '11:00', '13:30', '14:00', '14:30'].includes(time)) return 'disabled';
    return 'available';
  };

  const formatTimeRange = () => {
    if (selectedTimes.length === 0) return '';
    const sorted = [...selectedTimes].sort();
    return `${sorted[0]} - ${sorted[sorted.length - 1]}`;
  };

  // Time Selection Screen
  const TimeSelectionScreen = () => (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="flex items-center justify-between">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
          <span className="text-lg font-semibold">회의실 예약</span>
          <div className="flex items-center gap-2">
            <Home className="w-6 h-6 text-gray-600" />
            <Menu className="w-6 h-6 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="px-6 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          예약정보를 선택해주세요
        </h1>
      </div>

      {/* Form */}
      <div className="px-6 space-y-6">
        {/* Room Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-3">장소</label>
          <button
            onClick={() => setShowRoomSheet(true)}
            className="w-full p-4 bg-white border border-gray-200 rounded-xl flex items-center justify-between"
          >
            <div className="text-left">
              <div className="text-sm text-gray-500">부가설명</div>
              <div className="text-lg font-medium text-gray-900">{selectedRoom}</div>
              <div className="text-sm text-gray-500">최대 6명</div>
            </div>
            <ChevronDown className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-3">날짜</label>
          <button
            onClick={() => setShowDateSheet(true)}
            className="w-full p-4 bg-white border border-gray-200 rounded-xl flex items-center justify-between"
          >
            <span className="text-lg font-medium text-gray-900">{selectedDate}</span>
            <Calendar className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Time Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-3">시간</label>
          <div className="space-y-3">
            {timeSlots.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-2">
                {row.map((time) => {
                  const status = getTimeSlotStatus(time);
                  return (
                    <button
                      key={time}
                      onClick={() => status === 'available' && toggleTimeSelection(time)}
                      disabled={status === 'disabled'}
                      className={`
                        time-slot
                        ${status === 'selected' 
                          ? 'time-slot-selected' 
                          : status === 'disabled'
                          ? 'time-slot-disabled'
                          : 'time-slot-available'
                        }
                      `}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white to-transparent">
        <button
          onClick={() => setCurrentStep('confirmation')}
          disabled={selectedTimes.length === 0}
          className="btn-primary w-full disabled:bg-gray-300"
        >
          예약하기
        </button>
      </div>

      {/* Room Selection Bottom Sheet */}
      {showRoomSheet && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">회의실 선택</h3>
                <button onClick={() => setShowRoomSheet(false)}>
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {rooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => {
                    setSelectedRoom(room.name);
                    setShowRoomSheet(false);
                  }}
                  className={`w-full p-4 rounded-xl text-left ${
                    selectedRoom === room.name ? 'text-green-600 font-semibold' : 'text-gray-900'
                  }`}
                >
                  {room.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Date Selection Bottom Sheet */}
      {showDateSheet && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">날짜 선택</h3>
                <button onClick={() => setShowDateSheet(false)}>
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-4">
                  <div className="p-4 rounded-xl">2021년</div>
                  <div className="p-4 rounded-xl">2022년</div>
                  <div className="p-4 rounded-xl">2023년</div>
                  <div className="p-4 rounded-xl">2024년</div>
                  <div className="p-4 rounded-xl bg-green-50 text-green-600">2025년</div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl">8월</div>
                  <div className="p-4 rounded-xl bg-gray-100">9월</div>
                  <div className="p-4 rounded-xl font-semibold">10월</div>
                  <div className="p-4 rounded-xl">11월</div>
                  <div className="p-4 rounded-xl">12월</div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl">25일</div>
                  <div className="p-4 rounded-xl">26일</div>
                  <div className="p-4 rounded-xl text-green-600">27일</div>
                  <div className="p-4 rounded-xl">28일</div>
                  <div className="p-4 rounded-xl">29일</div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <button
                onClick={() => setShowDateSheet(false)}
                className="btn-primary w-full"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Confirmation Screen
  const ConfirmationScreen = () => (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="flex items-center justify-between">
          <button onClick={() => setCurrentStep('timeSelection')}>
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <span className="text-lg font-semibold">예약확인</span>
          <X className="w-6 h-6 text-gray-600" />
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">
          {selectedRoom} 예약을 확정할까요?
        </h1>

        {/* Booking Summary */}
        <div className="card mb-8">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">장소</span>
              <span className="font-medium">{selectedRoom} (전략반 앞)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">날짜</span>
              <span className="font-medium">{selectedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">시간</span>
              <span className="font-medium">{formatTimeRange()}</span>
            </div>
          </div>
        </div>

        {/* Guidelines */}
        <div className="space-y-3 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-1 h-1 bg-gray-500 rounded-full mt-3"></div>
            <span className="text-gray-600">예약 시간 5분 전까지 입실해주세요</span>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-1 h-1 bg-gray-500 rounded-full mt-3"></div>
            <span className="text-gray-600">회의 종료 후 정리정돈을 부탁드립니다</span>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-1 h-1 bg-gray-500 rounded-full mt-3"></div>
            <span className="text-gray-600">예약 변경은 시작 30분 전까지 가능합니다</span>
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white to-transparent">
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentStep('timeSelection')}
            className="btn-secondary"
          >
            수정
          </button>
          <button
            onClick={() => setCurrentStep('completion')}
            className="btn-primary flex-1"
          >
            확정하기
          </button>
        </div>
      </div>
    </div>
  );

  // Completion Screen
  const CompletionScreen = () => (
    <div className="min-h-screen bg-white">
      {/* Content */}
      <div className="px-6 py-16 text-center">
        {/* Success Icon */}
        <div className="w-36 h-36 mx-auto mb-8 bg-green-100 rounded-full flex items-center justify-center">
          <Check className="w-16 h-16 text-green-600" />
        </div>

        <h1 className="text-3xl font-semibold text-gray-900 mb-8">
          {selectedRoom} 예약이 확정됐어요
        </h1>

        {/* Booking Details Card */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">장소</span>
              <span className="font-medium">{selectedRoom} (전략반 앞)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">날짜</span>
              <span className="font-medium">2025. 9. 8.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">시간</span>
              <span className="font-medium">{formatTimeRange()}</span>
            </div>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="flex justify-center gap-6 mb-8">
          <div className="text-center">
            <button className="w-14 h-14 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-2">
              <MessageCircle className="w-6 h-6 text-gray-600" />
            </button>
            <span className="text-sm text-gray-600">카카오톡</span>
          </div>
          <div className="text-center">
            <button className="w-14 h-14 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-2">
              <Share2 className="w-6 h-6 text-gray-600" />
            </button>
            <span className="text-sm text-gray-600">공유하기</span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white to-transparent">
        <button
          onClick={() => setCurrentStep('timeSelection')}
          className="btn-primary w-full"
        >
          확인
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto bg-gray-100 min-h-screen">
      {currentStep === 'timeSelection' && <TimeSelectionScreen />}
      {currentStep === 'confirmation' && <ConfirmationScreen />}
      {currentStep === 'completion' && <CompletionScreen />}
    </div>
  );
};

export default MeetingRoomBooking;
