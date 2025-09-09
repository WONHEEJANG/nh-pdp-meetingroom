import { useState } from 'react';
import { BookingData, Step } from '../types';

// 오늘 날짜를 YYYY.MM.DD 형식으로 반환하는 함수
const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

export const useBooking = () => {
  const [currentStep, setCurrentStep] = useState<Step>('timeSelection');
  const [selectedRoom, setSelectedRoom] = useState('회의실 1');
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [showRoomSheet, setShowRoomSheet] = useState(false);
  const [showDateSheet, setShowDateSheet] = useState(false);

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

  const resetBooking = () => {
    setCurrentStep('timeSelection');
    setSelectedRoom('회의실 1');
    setSelectedDate(getTodayString());
    setSelectedTimes([]);
    setShowRoomSheet(false);
    setShowDateSheet(false);
  };

  return {
    currentStep,
    setCurrentStep,
    selectedRoom,
    setSelectedRoom,
    selectedDate,
    setSelectedDate,
    selectedTimes,
    setSelectedTimes,
    showRoomSheet,
    setShowRoomSheet,
    showDateSheet,
    setShowDateSheet,
    toggleTimeSelection,
    getTimeSlotStatus,
    formatTimeRange,
    resetBooking,
  };
};
