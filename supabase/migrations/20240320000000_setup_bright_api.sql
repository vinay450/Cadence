-- Create the bright_api table
create table if not exists bright_api (
  id uuid default uuid_generate_v4() primary key,
  api_key text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table bright_api enable row level security;

-- Create policy to allow authenticated users to read the API key
create policy "Allow authenticated users to read API key"
  on bright_api
  for select
  to authenticated
  using (true);

-- Revoke all permissions from public
revoke all on bright_api from public;

-- Grant select permission to authenticated users
grant select on bright_api to authenticated; 