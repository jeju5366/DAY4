-- 장바구니 테이블 (Supabase > SQL Editor 에 붙여넣고 Run)
-- 여러 번 실행해도 안전하도록 if not exists / drop policy if exists 사용

create table if not exists public.cart_items (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null default auth.uid() references auth.users(id) on delete cascade,
  photo_id     text not null,                       -- Pixabay 사진 id
  title        text,                                -- 사진 태그(표시용)
  thumb_url    text,
  large_url    text,
  page_url     text,                                -- Pixabay 원본 페이지
  photographer text,
  quantity     int  not null default 1 check (quantity > 0),
  created_at   timestamptz not null default now(),
  unique (user_id, photo_id)                        -- 같은 사진은 한 줄 + 수량으로
);

create index if not exists cart_items_user_idx on public.cart_items (user_id, created_at desc);

-- 본인 장바구니만 보고/담고/수정/삭제 가능 (RLS)
alter table public.cart_items enable row level security;

drop policy if exists "cart_select_own" on public.cart_items;
drop policy if exists "cart_insert_own" on public.cart_items;
drop policy if exists "cart_update_own" on public.cart_items;
drop policy if exists "cart_delete_own" on public.cart_items;

create policy "cart_select_own" on public.cart_items
  for select to authenticated using (user_id = auth.uid());
create policy "cart_insert_own" on public.cart_items
  for insert to authenticated with check (user_id = auth.uid());
create policy "cart_update_own" on public.cart_items
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "cart_delete_own" on public.cart_items
  for delete to authenticated using (user_id = auth.uid());
