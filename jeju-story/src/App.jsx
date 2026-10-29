import { useEffect, useState } from "react";
import { supabase } from "./supabase.js";
import Auth from "./Auth.jsx";
import Gallery from "./Gallery.jsx";
import Cart from "./Cart.jsx";
import { useCart } from "./useCart.js";

// 제주를 대표하는 IP(캐릭터/콘텐츠) 소개 카드
const IPS = [
  { icon: "🗿", name: "돌하르방", desc: "제주를 지켜 주는 돌 할아버지. 큰 눈과 푸근한 미소가 매력이에요." },
  { icon: "🍊", name: "감귤", desc: "제주의 맛과 향기를 대표하는 노란 보석 같은 과일이에요." },
  { icon: "🤿", name: "해녀", desc: "숨 한 번으로 바다를 누비는 제주의 자랑, 유네스코 인류무형문화유산." },
  { icon: "🏔️", name: "한라산", desc: "백록담을 품은 제주의 중심. 사계절 다른 얼굴을 보여 줘요." },
  { icon: "🌋", name: "오름", desc: "제주 곳곳에 솟은 작은 화산 언덕, 360여 개의 이야기." },
];

export default function App() {
  const [session, setSession] = useState(null);
  const [view, setView] = useState("home"); // "home" | "auth" | "cart"
  const cart = useCart(session);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s) setView("home"); // 로그인 성공 시 홈으로
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const logout = () => supabase.auth.signOut();

  return (
    <>
      <header className="top">
        <a className="logo" href="#" onClick={(e) => { e.preventDefault(); setView("home"); }}>🍊 제주 이야기</a>
        <nav>
          {session ? (
            <>
              <button className="btn cartbtn" onClick={() => setView("cart")}>🛒 장바구니{cart.count > 0 && <span className="badge">{cart.count}</span>}</button>
              <span className="who">{session.user.email}</span>
              <button className="btn ghost" onClick={logout}>로그아웃</button>
            </>
          ) : (
            <button className="btn" onClick={() => setView("auth")}>로그인 / 회원가입</button>
          )}
        </nav>
      </header>

      {!supabase && (
        <div className="warn">
          Supabase 환경변수(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)가 설정되지 않았어요. README 의 환경변수 안내를 따라 주세요.
        </div>
      )}

      {view === "auth" && !session ? (
        <Auth onBack={() => setView("home")} />
      ) : view === "cart" && session ? (
        <Cart cart={cart} onBack={() => setView("home")} />
      ) : (
        <main>
          <section className="hero">
            <h1>제주의 이야기를 만나요</h1>
            <p>돌하르방, 감귤, 해녀, 한라산… 제주가 품은 캐릭터와 콘텐츠를 사진으로 둘러보세요.</p>
            {!session && <button className="btn big" onClick={() => setView("auth")}>무료 회원가입하고 전체 갤러리 보기</button>}
          </section>

          <section className="ips">
            {IPS.map((ip) => (
              <article key={ip.name} className="ip">
                <div className="ico">{ip.icon}</div>
                <h3>{ip.name}</h3>
                <p>{ip.desc}</p>
              </article>
            ))}
          </section>

          <Gallery member={!!session} onJoin={() => setView("auth")} onAdd={cart.add} cartIds={cart.items.map((i) => i.photo_id)} />
        </main>
      )}

      <footer>
        사진 제공: <a href="https://pixabay.com" target="_blank" rel="noreferrer">Pixabay</a>
      </footer>
    </>
  );
}
