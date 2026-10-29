// Vercel 서버리스 함수: 인증키는 환경변수 DATA_GO_KR_KEY 에서만 읽는다 (브라우저로 노출되지 않음)
const UPSTREAM = "https://api.odcloud.kr/api/15125100/v1/uddi:32a1b877-af20-4505-a76a-fd389ebd30ca";

module.exports = async (req, res) => {
  const key = process.env.DATA_GO_KR_KEY;
  if (!key) {
    res.status(500).json({ error: "서버에 DATA_GO_KR_KEY 환경변수가 설정되지 않았어요." });
    return;
  }

  try {
    const url = UPSTREAM + "?" + new URLSearchParams({ page: "1", perPage: "100", serviceKey: key });
    const upstream = await fetch(url);
    const body = await upstream.text();

    if (!upstream.ok) {
      const msg = upstream.status === 401 ? "인증키가 올바르지 않아요. (401)" : "공공데이터 API 오류 (HTTP " + upstream.status + ")";
      res.status(502).json({ error: msg });
      return;
    }

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    // 월별 통계라 자주 바뀌지 않음 → 1시간 캐시해서 API 호출 횟수 절약
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).send(body);
  } catch (e) {
    res.status(502).json({ error: "공공데이터 API에 연결하지 못했어요." });
  }
};
