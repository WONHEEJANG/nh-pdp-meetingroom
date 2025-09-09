export interface Room {
  id: number;
  name: string;
  capacity: string;
}

export interface TimeSlot {
  time: string;
  status: 'available' | 'selected' | 'disabled';
}

export type Step = 'timeSelection' | 'confirmation' | 'completion';

export interface BookingData {
  selectedRoom: string;
  selectedDate: string;
  selectedTimes: string[];
}
