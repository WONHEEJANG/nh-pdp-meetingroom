import { config } from 'dotenv'
import { supabase } from '../lib/supabase'

// Load environment variables
config({ path: '.env.local' })

async function createTable() {
  try {
    console.log('🏗️ Creating reservation table...')
    
    // Read SQL file
    const fs = require('fs')
    const path = require('path')
    const sqlFile = fs.readFileSync(path.join(__dirname, 'create-table.sql'), 'utf8')
    
    // Execute SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlFile })
    
    if (error) {
      console.error('❌ Error creating table:', error)
      
      // Try alternative method - create table directly
      console.log('🔄 Trying alternative method...')
      
      const { data: createData, error: createError } = await supabase
        .from('reservation')
        .select('id')
        .limit(1)
      
      if (createError) {
        console.log('📝 Table does not exist, creating manually...')
        console.log('Please run the following SQL in Supabase SQL Editor:')
        console.log('')
        console.log(sqlFile)
        console.log('')
        console.log('Or use the Supabase dashboard to create the table with these columns:')
        console.log('Table name: nh-pdp-meetingroom.reservation')
        console.log('- id (BIGSERIAL, Primary Key)')
        console.log('- reserver_name (TEXT)')
        console.log('- purpose (TEXT)')
        console.log('- room (TEXT)')
        console.log('- date (TEXT)')
        console.log('- time (TEXT)')
        console.log('- password (TEXT)')
        console.log('- created_at (TIMESTAMPTZ, Default: NOW())')
      } else {
        console.log('✅ Table already exists!')
      }
    } else {
      console.log('✅ Table created successfully!')
    }
    
  } catch (error) {
    console.error('💥 Error:', error)
    console.log('')
    console.log('Please create the table manually in Supabase dashboard:')
    console.log('1. Go to Supabase Dashboard > SQL Editor')
    console.log('2. Run the SQL from create-table.sql file')
    console.log('3. Or use Table Editor to create table "nh-pdp-meetingroom.reservation" with the required columns')
  }
}

// Run the function
createTable()
