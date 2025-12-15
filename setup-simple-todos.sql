-- Simple todos table for testing (no auth required)
CREATE TABLE IF NOT EXISTS todos (
  id BIGSERIAL PRIMARY KEY,
  task TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample data
INSERT INTO todos (task, status) VALUES
  ('Set up Supabase database', 'completed'),
  ('Create Next.js frontend client', 'completed'),
  ('Test database connection', 'in-progress'),
  ('Deploy to Vercel', 'pending'),
  ('Add user authentication', 'pending')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security but allow all operations for testing
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for testing)
CREATE POLICY "Enable all operations for todos" ON todos
  FOR ALL USING (true) WITH CHECK (true);