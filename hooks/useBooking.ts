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
    const timeGroups: string[] = [];
    let currentGroup: string[] = [];
    
    for (let i = 0; i < sorted.length; i++) {
      const currentTime = sorted[i];
      const nextTime = sorted[i + 1];
      
      // 현재 시간을 그룹에 추가
      currentGroup.push(currentTime);
      
      // 다음 시간이 없거나 연속되지 않으면 그룹 완성
      if (!nextTime || !isConsecutiveTime(currentTime, nextTime)) {
        if (currentGroup.length === 1) {
          // 단일 시간 - 30분 범위로 표시
          const startTime = currentGroup[0];
          const endTime = add30Minutes(startTime);
          timeGroups.push(`${startTime} - ${endTime}`);
        } else {
          // 연속된 시간 범위 - 첫 번째 시간부터 마지막 시간+30분까지
          const startTime = currentGroup[0];
          const endTime = add30Minutes(currentGroup[currentGroup.length - 1]);
          timeGroups.push(`${startTime} - ${endTime}`);
        }
        currentGroup = [];
      }
    }
    
    return timeGroups.join(', ');
  };

  // 30분을 더하는 헬퍼 함수
  const add30Minutes = (time: string) => {
    const [hour, min] = time.split(':').map(Number);
    const totalMinutes = hour * 60 + min + 30;
    const newHour = Math.floor(totalMinutes / 60);
    const newMin = totalMinutes % 60;
    return `${newHour.toString().padStart(2, '0')}:${newMin.toString().padStart(2, '0')}`;
  };

  // 연속된 시간인지 확인하는 헬퍼 함수
  const isConsecutiveTime = (time1: string, time2: string) => {
    const [hour1, min1] = time1.split(':').map(Number);
    const [hour2, min2] = time2.split(':').map(Number);
    
    const minutes1 = hour1 * 60 + min1;
    const minutes2 = hour2 * 60 + min2;
    
    return minutes2 - minutes1 === 30; // 30분 간격
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
