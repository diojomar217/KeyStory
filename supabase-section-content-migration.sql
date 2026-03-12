-- Add section_content column to orders table
-- This is needed to store dynamic section content like memory_map, quotes, reasons, etc.

ALTER TABLE orders ADD COLUMN IF NOT EXISTS section_content JSONB DEFAULT '{}'::jsonb;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders' AND column_name = 'section_content';

