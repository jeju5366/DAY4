// Vercel 서버리스 함수: GET /api/pixabay?category=all&count=12
import { fetchPixabay } from "../server/pixabay.js";

export default async function handler(req, res) {
  const key = process.env.PIXABAY_API_KEY;
  if (!key) return res.status(500).json({ error: "PIXABAY_API_KEY 가 설정되지 않았습니다." });
  try {
    const { category, count } = req.query;
    const hits = await fetchPixabay(category, count, key);
    // Pixabay 이용약관: 결과를 24시간 캐시
    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=3600");
    res.status(200).json({ hits });
  } catch (e) {
    res.status(502).json({ error: String(e.message || e) });
  }
}
