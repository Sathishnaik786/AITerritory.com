-- Apple Carousel Cards table
create table if not exists apple_carousel_cards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  link_url text,
  button_text text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone default timezone('utc', now())
);

-- Add indexes
create index if not exists idx_apple_carousel_cards_active on apple_carousel_cards(is_active);
create index if not exists idx_apple_carousel_cards_sort_order on apple_carousel_cards(sort_order);

-- Enable RLS
alter table apple_carousel_cards enable row level security;

-- Create policy to allow public read access to active cards
create policy "Allow public read access to active apple carousel cards"
  on apple_carousel_cards for select
  using (is_active = true);