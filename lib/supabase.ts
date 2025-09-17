import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qrhkpskfoekacuwdiboz.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyaGtwc2tmb2VrYWN1d2RpYm96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczOTQ0MjksImV4cCI6MjA3Mjk3MDQyOX0.-9pLSkeHrRXYydB4EIzW5ae-l2sGXpKxVylbyI-VZsc'

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
  }
}
