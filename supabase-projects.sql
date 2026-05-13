create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  genre text not null,
  info text not null,
  link text not null default '',
  image_gradient text not null default 'from-neutral-700 to-neutral-800',
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;

drop policy if exists "Anyone can read projects" on public.projects;
create policy "Anyone can read projects"
  on public.projects
  for select
  using (true);

insert into public.projects (name, genre, info, link, image_gradient)
values
  ('Quality Assurance', 'Testing', 'Automated testing framework', 'https://example.com', 'from-neutral-700 to-neutral-800'),
  ('Brand Identity', 'Design', 'UI/UX design', 'https://example.com', 'from-neutral-600 to-neutral-800'),
  ('AI Generator', 'AI', 'Machine learning', 'https://example.com', 'from-neutral-800 to-neutral-900'),
  ('E-commerce', 'Design', 'Experience redesign', 'https://example.com', 'from-neutral-500 to-neutral-700'),
  ('Testing Suite', 'Testing', 'Load & stress tools', 'https://example.com', 'from-neutral-700 to-neutral-900'),
  ('Smart Dashboard', 'AI', 'AI analytics', 'https://example.com', 'from-neutral-600 to-neutral-800');
