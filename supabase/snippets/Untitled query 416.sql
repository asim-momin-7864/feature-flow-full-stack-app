create type public.category as enum('FEATURE', 'BUG', 'UI');
create type public.status as enum('UNDER_REVIEW', 'PLANNED', 'IN_PROGRESS', 'COMPLETED');

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references public.profile(id) on delete cascade default auth.uid(),
  title text not null,
  description text not null,
  category public.category not null default 'FEATURE',
  status public.status not null default 'UNDER_REVIEW',
  is_deleted boolean not null default false,
  deleted_by_admin boolean not null default false,
  deleted_at timestamptz default null,
  search_vector tsvector generated always as (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, ''))
  ) stored
 );

 create index if not exists feedback_search_vector_idx on public.feedback using gin(search_vector);

 create table if not exists public.comment (
  id uuid primary key not null default gen_random_uuid(),
  feedback_id uuid not null references public.feedback(id) on delete cascade,
  user_id uuid not null references public.profile(id) on delete cascade default auth.uid(),
  content text not null,
  is_deleted boolean not null default false,
  deleted_by_admin boolean not null default false,
  deleted_at timestamptz null,
  created_at timestamptz not null default now()
 );

 create table if not exists public.votes (
  id uuid primary key not null default gen_random_uuid(),
  feedback_id uuid not null references public.feedback(id) on delete cascade,
  user_id uuid not null references public.profile(id) on delete cascade default auth.uid(),

  constraint unique_user_feedback_vote unique(feedback_id, user_id)
 );