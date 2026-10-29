import { useEffect, useState } from "react";

const TABS = [
  ["all", "전체"],
  ["statue", "돌하르방"],
  ["tangerine", "감귤"],
  ["hallasan", "한라산"],
  ["sea", "바다"],
  ["oreum", "오름"],
];

// Pixabay 이미지 갤러리: 비회원은 6장(전체만), 회원은 카테고리별 24장
export default function Gallery({ member, onJoin }) {
  const [cat, setCat] = useState("all");
  const [items, setItems] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(null); // 확대해서 볼 사진

  useEffect(() => {
    if (!member) setCat("all");
  }, [member]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr(null);
    fetch(`/api/pixabay?category=${cat}&count=${member ? 24 : 6}`)
      .then((r) => r.json().then((d) => (r.ok ? d : Promise.reject(new Error(d.error || r.status)))))
      .then((d) => alive && setItems(d.hits))
      .catch((e) => alive && setErr(String(e.message || e)))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [cat, member]);

  return (
    <section className="gallery">
      <h2>제주 갤러리</h2>
      {member ? (
        <div className="tabs">
          {TABS.map(([k, label]) => (
            <button key={k} className={"tab" + (cat === k ? " on" : "")} onClick={() => setCat(k)}>{label}</button>
          ))}
        </div>
      ) : (
        <p className="lock">🔒 회원이 되면 카테고리별 전체 갤러리를 볼 수 있어요. <a href="#" onClick={(e) => { e.preventDefault(); onJoin(); }}>회원가입</a></p>
      )}

      {loading && <p className="note">불러오는 중…</p>}
      {err && <p className="note err">사진을 불러오지 못했어요: {err}</p>}
      {!loading && !err && items.length === 0 && <p className="note">검색 결과가 없어요.</p>}

      <div className="grid">
        {items.map((p) => (
          <figure key={p.id} onClick={() => setOpen(p)}>
            <img src={p.thumb} alt={p.tags} loading="lazy" />
            <figcaption>{p.tags.split(",")[0]}</figcaption>
          </figure>
        ))}
      </div>

      {open && (
        <div className="lightbox" onClick={() => setOpen(null)}>
          <img src={open.large} alt={open.tags} />
          <p>📷 <a href={open.page} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>{open.user}</a> · Pixabay</p>
        </div>
      )}
    </section>
  );
}
