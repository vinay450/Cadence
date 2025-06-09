-- Create the bright_api table
create table if not exists public.bright_api (
  id uuid default gen_random_uuid() primary key,
  api_key text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.bright_api enable row level security;

-- Create policy to allow edge functions to read the API key
create policy "Allow edge functions to read API key"
  on public.bright_api
  for select
  to authenticated
  using (true);

-- Grant access to authenticated users
grant select on public.bright_api to authenticated; 