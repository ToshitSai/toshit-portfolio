-- Supabase Migration: Create ai_usage_events table for tracking real Gemini / AI API usage
CREATE TABLE IF NOT EXISTS public.ai_usage_events (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'antigravity',
  model TEXT NOT NULL,
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  total_tokens INTEGER NOT NULL DEFAULT 0,
  request_id TEXT
);

-- Enable Row Level Security
ALTER TABLE public.ai_usage_events ENABLE ROW LEVEL SECURITY;

-- Allow public read access for token metrics aggregation
CREATE POLICY "Allow public read access for ai_usage_events" 
  ON public.ai_usage_events FOR SELECT USING (true);

-- Allow authenticated/service role insert
CREATE POLICY "Allow service role insert for ai_usage_events" 
  ON public.ai_usage_events FOR INSERT WITH CHECK (true);
