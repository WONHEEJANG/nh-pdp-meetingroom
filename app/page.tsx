'use client'

import React from 'react';
import { useBooking } from '../hooks/useBooking';
import { TimeSelectionScreen } from '../components/screens/TimeSelectionScreen';
import { ConfirmationScreen } from '../components/screens/ConfirmationScreen';
import { CompletionScreen } from '../components/screens/CompletionScreen';
import { RoomSelectionSheet } from '../components/RoomSelectionSheet';
import { DateSelectionSheet } from '../components/DateSelectionSheet';
import { Room } from '../types';

const MeetingRoomBooking = () => {
  const {
    currentStep,
    setCurrentStep,
    selectedRoom,
    setSelectedRoom,
    selectedDate,
    setSelectedDate,
    selectedTimes,
    showRoomSheet,
    setShowRoomSheet,
    showDateSheet,
    setShowDateSheet,
    toggleTimeSelection,
    getTimeSlotStatus,
    formatTimeRange,
    resetBooking,
  } = useBooking();

  const rooms: Room[] = [
    { id: 1, name: '회의실 1', capacity: '최대 6명'},
    { id: 2, name: '회의실 2', capacity: '최대 8명'},
    { id: 3, name: '회의실 3', capacity: '최대 4명'}
  ];

  const timeSlots = [
    ['09:00', '09:30', '10:00', '10:30'],
    ['11:00', '11:30', '12:00', '12:30'],
    ['13:00', '13:30', '14:00', '14:30'],
    ['15:00', '15:30', '16:00', '16:30'],
    ['17:00', '17:30', '18:00', '18:30']
  ];

  const handleRoomSelect = () => setShowRoomSheet(true);
  const handleDateSelect = () => setShowDateSheet(true);
  const handleRoomChange = (roomName: string) => setSelectedRoom(roomName);
  const handleNext = () => setCurrentStep('confirmation');
  const handleConfirm = () => setCurrentStep('completion');
  const handleEdit = () => setCurrentStep('timeSelection');
  const handleComplete = () => resetBooking();

  return (
    <>
      {/* 바닥화면 */}
      <div className="max-w-md mx-auto bg-gray-100 min-h-screen overflow-x-hidden w-full">
        {currentStep === 'timeSelection' && (
          <TimeSelectionScreen
            selectedRoom={selectedRoom}
            selectedDate={selectedDate}
            selectedTimes={selectedTimes}
            timeSlots={timeSlots}
            onRoomSelect={handleRoomSelect}
            onDateSelect={handleDateSelect}
            onTimeToggle={toggleTimeSelection}
            getTimeSlotStatus={getTimeSlotStatus}
            onNext={handleNext}
          />
        )}
        {currentStep === 'confirmation' && (
          <ConfirmationScreen
            selectedRoom={selectedRoom}
            selectedDate={selectedDate}
            timeRange={formatTimeRange()}
            onBack={handleEdit}
            onConfirm={handleConfirm}
            onEdit={handleEdit}
          />
        )}
        {currentStep === 'completion' && (
          <CompletionScreen
            selectedRoom={selectedRoom}
            selectedDate={selectedDate}
            timeRange={formatTimeRange()}
            onComplete={handleComplete}
          />
        )}
      </div>

      {/* 검은 오버레이 - 바텀시트가 열릴 때만 표시 */}
      <div className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
        showRoomSheet || showDateSheet ? 'opacity-60' : 'opacity-0 pointer-events-none'
      }`} />

      {/* 바텀시트 - 독립적으로 렌더링 */}
      <RoomSelectionSheet
        isOpen={showRoomSheet}
        onClose={() => setShowRoomSheet(false)}
        rooms={rooms}
        selectedRoom={selectedRoom}
        onRoomSelect={handleRoomChange}
      />

      <DateSelectionSheet
        isOpen={showDateSheet}
        onClose={() => setShowDateSheet(false)}
        onDateSelect={setSelectedDate}
      />
    </>
  );
};

export default MeetingRoomBooking;
