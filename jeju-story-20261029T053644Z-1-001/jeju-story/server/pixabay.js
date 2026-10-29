// Pixabay 호출 로직 (Vercel 함수와 로컬 dev 서버가 함께 사용)
// API 키는 서버에만 두고, 허용된 카테고리만 검색하도록 제한한다.
const QUERIES = {
  all: "jeju island",
  hallasan: "jeju hallasan",
  tangerine: "jeju tangerine",
  statue: "jeju stone statue",
  sea: "jeju sea",
  oreum: "jeju oreum",
};

export async function fetchPixabay(category, count, key) {
  const q = QUERIES[category] || QUERIES.all;
  const perPage = Math.min(Math.max(Number(count) || 12, 3), 40);
  const url =
    "https://pixabay.com/api/?" +
    new URLSearchParams({
      key,
      q,
      image_type: "photo",
      orientation: "horizontal",
      safesearch: "true",
      per_page: String(perPage),
    });
  const r = await fetch(url);
  if (!r.ok) throw new Error("Pixabay " + r.status);
  const data = await r.json();
  return data.hits.map((h) => ({
    id: h.id,
    tags: h.tags,
    thumb: h.webformatURL,
    large: h.largeImageURL,
    user: h.user,
    page: h.pageURL,
  }));
}
