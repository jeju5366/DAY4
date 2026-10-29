import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fetchPixabay } from "./server/pixabay.js";

// 로컬 개발(npm run dev)에서도 /api/pixabay 가 동작하도록 하는 작은 플러그인.
// (배포 환경에서는 api/pixabay.js 가 Vercel 함수로 동작)
function pixabayDevApi(env) {
  return {
    name: "pixabay-dev-api",
    configureServer(server) {
      server.middlewares.use("/api/pixabay", async (req, res) => {
        const u = new URL(req.url, "http://localhost");
        res.setHeader("Content-Type", "application/json");
        if (!env.PIXABAY_API_KEY) {
          res.statusCode = 500;
          return res.end(JSON.stringify({ error: ".env 에 PIXABAY_API_KEY 를 설정하세요." }));
        }
        try {
          const hits = await fetchPixabay(u.searchParams.get("category"), u.searchParams.get("count"), env.PIXABAY_API_KEY);
          res.end(JSON.stringify({ hits }));
        } catch (e) {
          res.statusCode = 502;
          res.end(JSON.stringify({ error: String(e.message || e) }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return { plugins: [react(), pixabayDevApi(env)] };
});
