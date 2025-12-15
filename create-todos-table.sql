-- Create todos table for testing Supabase connection
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS todos (
  id BIGSERIAL PRIMARY KEY,
  task TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample data
INSERT INTO todos (task, status) VALUES
  ('Set up Supabase database', 'completed'),
  ('Create Next.js frontend client', 'completed'),
  ('Test database connection', 'in-progress'),
  ('Deploy to Vercel', 'pending'),
  ('Add user authentication', 'pending')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (optional)
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for testing)
CREATE POLICY "Enable all operations for todos" ON todos
  FOR ALL USING (true) WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_todos_updated_at 
  BEFORE UPDATE ON todos 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();