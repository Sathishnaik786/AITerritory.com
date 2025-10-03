-- Remove the category constraint to allow dynamic categories
alter table gemini_prompts 
drop constraint if exists gemini_prompts_category_check;

-- Add a more flexible constraint that still requires a category but allows any value
alter table gemini_prompts 
add constraint gemini_prompts_category_not_empty 
check (category is not null and category != '');