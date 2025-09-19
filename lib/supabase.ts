import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qrhkpskfoekacuwdiboz.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

// Types for our reservation table
export interface Reservation {
  id?: number
  reserver_name: string
  purpose: string
  room: string
  date: string
  time: string
  password: string
  created_at?: string
}

// Reservation functions
export const reservationService = {
  // Create a new reservation
  async createReservation(reservation: Omit<Reservation, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('reservation')
      .insert([reservation])
      .select()
    
    if (error) {
      console.error('Error creating reservation:', error)
      throw error
    }
    
    return data?.[0]
  },

  // Get all reservations
  async getReservations() {
    const { data, error } = await supabase
      .from('reservation')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching reservations:', error)
      throw error
    }
    
    return data
  },

  // Get reservation by ID
  async getReservationById(id: number) {
    const { data, error } = await supabase
      .from('reservation')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching reservation:', error)
      throw error
    }
    
    return data
  },

  // Update reservation
  async updateReservation(id: number, updates: Partial<Reservation>) {
    const { data, error } = await supabase
      .from('reservation')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) {
      console.error('Error updating reservation:', error)
      throw error
    }
    
    return data?.[0]
  },

  // Delete reservation
  async deleteReservation(id: number) {
    const { data, error } = await supabase
      .from('reservation')
      .delete()
      .eq('id', id)
      .select()
    
    if (error) {
      console.error('Error deleting reservation:', error)
      throw error
    }
    
    return data?.[0]
  },

  // Delete multiple reservations
  async deleteReservations(ids: number[]) {
    const { data, error } = await supabase
      .from('reservation')
      .delete()
      .in('id', ids)
      .select()
    
    if (error) {
      console.error('Error deleting reservations:', error)
      throw error
    }
    
    return data
  },

  // Verify password for reservation
  async verifyReservationPassword(id: number, password: string) {
    const { data, error } = await supabase
      .from('reservation')
      .select('password')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error verifying password:', error)
      throw error
    }
    
    return data?.password === password
  },

  // Delete specific time slots from a reservation
  async deleteTimeSlots(reservationId: string, timeSlots: string[]) {
    // 30분 단위로 저장된 데이터에서는 해당 시간 슬롯들을 직접 삭제
    const { data, error } = await supabase
      .from('reservation')
      .delete()
      .eq('id', parseInt(reservationId))
      .in('time', timeSlots)
      .select()
    
    if (error) {
      console.error('Error deleting time slots:', error)
      throw error
    }
    
    return data
  }
}
