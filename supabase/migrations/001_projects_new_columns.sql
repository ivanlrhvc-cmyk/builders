ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS problem  text,
  ADD COLUMN IF NOT EXISTS how      text,
  ADD COLUMN IF NOT EXISTS features jsonb,
  ADD COLUMN IF NOT EXISTS tags     text[];
