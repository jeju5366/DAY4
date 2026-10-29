import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase.js";

// 로그인한 사용자의 장바구니(Supabase cart_items 테이블)
export function useCart(session) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const uid = session?.user?.id;

  useEffect(() => {
    setError(null);
    if (!supabase || !uid) { setItems([]); return; }
    let alive = true;
    supabase.from("cart_items").select("*").order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!alive) return;
        if (error) setError(error.message); else setItems(data);
      });
    return () => { alive = false; };
  }, [uid]);

  const add = useCallback(async (p) => {
    const found = items.find((i) => i.photo_id === String(p.id));
    if (found) return setQty(found.id, found.quantity + 1);
    const row = {
      photo_id: String(p.id), title: p.tags?.split(",")[0] ?? "", thumb_url: p.thumb,
      large_url: p.large, page_url: p.page, photographer: p.user,
    };
    const { data, error } = await supabase.from("cart_items").insert(row).select().single();
    if (error) setError(error.message); else setItems((cur) => [data, ...cur]);
  }, [items]); // eslint-disable-line react-hooks/exhaustive-deps

  const setQty = useCallback(async (id, quantity) => {
    if (quantity < 1) return remove(id);
    const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", id);
    if (error) setError(error.message);
    else setItems((cur) => cur.map((i) => (i.id === id ? { ...i, quantity } : i)));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const remove = useCallback(async (id) => {
    const { error } = await supabase.from("cart_items").delete().eq("id", id);
    if (error) setError(error.message);
    else setItems((cur) => cur.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(async () => {
    const { error } = await supabase.from("cart_items").delete().eq("user_id", uid);
    if (error) setError(error.message); else setItems([]);
  }, [uid]);

  const count = items.reduce((n, i) => n + i.quantity, 0);
  return { items, count, error, add, setQty, remove, clear };
}
