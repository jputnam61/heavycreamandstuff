-- Add new columns to recipes table
ALTER TABLE recipes 
ADD COLUMN IF NOT EXISTS prep_time_mins integer,
ADD COLUMN IF NOT EXISTS cook_time_mins integer,
ADD COLUMN IF NOT EXISTS servings integer;

-- Add check constraints to ensure valid values
ALTER TABLE recipes 
ADD CONSTRAINT check_prep_time CHECK (prep_time_mins IS NULL OR prep_time_mins >= 0),
ADD CONSTRAINT check_cook_time CHECK (cook_time_mins IS NULL OR cook_time_mins >= 0),
ADD CONSTRAINT check_servings CHECK (servings IS NULL OR servings > 0);