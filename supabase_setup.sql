-- Create a table for application settings
CREATE TABLE IF NOT EXISTS public.app_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow everyone to read settings (public config)
CREATE POLICY "Allow public read access" ON public.app_settings
    FOR SELECT USING (true);

-- Allow authenticated users (admins) to insert/update
-- Note: In a real production app, you'd want to restrict this to specific admin roles.
-- For now, we'll allow authenticated users to modify it.
CREATE POLICY "Allow authenticated update" ON public.app_settings
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert default configuration for regions
INSERT INTO public.app_settings (key, value)
VALUES (
    'allowed_regions', 
    '["Región Metropolitana de Santiago"]'::jsonb
)
ON CONFLICT (key) DO NOTHING;
