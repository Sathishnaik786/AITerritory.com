-- Testimonials table for user-submitted testimonials
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  user_name text not null,
  user_role text,
  user_avatar text,
  content text not null,
  approved boolean not null default false,
  created_at timestamp with time zone default timezone('utc', now())
);
create index if not exists idx_testimonials_approved on testimonials(approved); 