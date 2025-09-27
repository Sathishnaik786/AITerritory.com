-- Add columns for Google Forms submissions tracking
alter table gemini_prompts 
add column if not exists submitted_via text default 'web_form',
add column if not exists submitter_name text,
add column if not exists submitter_email text,
add column if not exists status text default 'published';

-- Add constraint for status values
alter table gemini_prompts 
add constraint valid_status 
check (status in ('draft', 'pending_review', 'published', 'rejected'));

-- Add index for submitted_via for faster queries
create index if not exists idx_gemini_prompts_submitted_via 
on gemini_prompts(submitted_via);

-- Add index for status for faster queries
create index if not exists idx_gemini_prompts_status 
on gemini_prompts(status);

-- Update existing records to have proper default values
update gemini_prompts 
set submitted_via = 'web_form' 
where submitted_via is null;

update gemini_prompts 
set status = 'published' 
where status is null;