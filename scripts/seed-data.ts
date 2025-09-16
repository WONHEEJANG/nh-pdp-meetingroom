import { config } from 'dotenv'
import { supabase, reservationService } from '../lib/supabase'

// Load environment variables
config({ path: '.env.local' })

// Sample reservation data
const sampleReservations = [
  {
    reserver_name: '김농협',
    purpose: '팀 회의',
    room: '회의실 1',
    date: '2025. 9. 18.',
    time: '09:00 - 10:30',
    password: '1234'
  },
  {
    reserver_name: '이영희',
    purpose: '부서 회의',
    room: '회의실 2',
    date: '2025. 9. 18.',
    time: '14:00 - 15:30',
    password: '5678'
  },
  {
    reserver_name: '박민수',
    purpose: '업체 미팅',
    room: '회의실 1',
    date: '2025. 9. 19.',
    time: '10:00 - 11:00',
    password: '9999'
  },
  {
    reserver_name: '최지영',
    purpose: '업무 회의',
    room: '회의실 3',
    date: '2025. 9. 19.',
    time: '15:00 - 16:30',
    password: '1111'
  },
  {
    reserver_name: '정수현',
    purpose: '팀 회의',
    room: '회의실 2',
    date: '2025. 9. 20.',
    time: '11:00 - 12:00',
    password: '2222'
  }
]

async function seedData() {
  try {
    console.log('🌱 Starting to seed reservation data...')
    
    // Clear existing data (optional)
    console.log('🗑️ Clearing existing reservations...')
    const { error: deleteError } = await supabase
      .from('reservation')
      .delete()
      .neq('id', 0) // Delete all records
    
    if (deleteError) {
      console.error('Error clearing data:', deleteError)
    }
    
    // Insert sample data
    console.log('📝 Inserting sample reservations...')
    for (const reservation of sampleReservations) {
      try {
        const result = await reservationService.createReservation(reservation)
        console.log(`✅ Created reservation for ${reservation.reserver_name}`)
      } catch (error) {
        console.error(`❌ Error creating reservation for ${reservation.reserver_name}:`, error)
      }
    }
    
    console.log('🎉 Seeding completed!')
    
    // Verify data
    const reservations = await reservationService.getReservations()
    console.log(`📊 Total reservations: ${reservations.length}`)
    
  } catch (error) {
    console.error('💥 Seeding failed:', error)
  }
}

// Run the seeding function
seedData()
