-- Create reservation table in public schema
CREATE TABLE IF NOT EXISTS reservation (
  id BIGSERIAL PRIMARY KEY,
  reserver_name TEXT NOT NULL,
  purpose TEXT NOT NULL,
  room TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_reservation_created_at ON reservation(created_at);
CREATE INDEX IF NOT EXISTS idx_reservation_room ON reservation(room);
CREATE INDEX IF NOT EXISTS idx_reservation_date ON reservation(date);

-- Enable Row Level Security (RLS)
ALTER TABLE reservation ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'reservation' 
    AND policyname = 'Allow all operations for authenticated users'
  ) THEN
    CREATE POLICY "Allow all operations for authenticated users" ON reservation
      FOR ALL USING (true);
  END IF;
END $$;

-- Create policy to allow all operations for anonymous users (for public access)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'reservation' 
    AND policyname = 'Allow all operations for anonymous users'
  ) THEN
    CREATE POLICY "Allow all operations for anonymous users" ON reservation
      FOR ALL USING (true);
  END IF;
END $$;
