import { useState } from "react";
import { supabase } from "./supabase.js";

// 로그인 / 회원가입 폼 (이메일 + 비밀번호)
export default function Auth({ onBack }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState(null); // { type: "ok" | "err", text }
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!supabase) return setMsg({ type: "err", text: "Supabase 설정이 필요해요." });
    setBusy(true);
    setMsg(null);
    const { data, error } =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password: pw })
        : await supabase.auth.signUp({ email, password: pw, options: { emailRedirectTo: window.location.origin } });
    setBusy(false);
    if (error) return setMsg({ type: "err", text: translate(error.message) });
    // 회원가입 후 세션이 없으면 이메일 확인이 켜져 있는 것
    if (mode === "signup" && !data.session)
      setMsg({ type: "ok", text: "가입 확인 메일을 보냈어요. 메일의 링크를 누른 뒤 로그인해 주세요." });
  }

  return (
    <main className="authbox">
      <form onSubmit={submit}>
        <h2>{mode === "login" ? "로그인" : "회원가입"}</h2>
        <label>이메일
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </label>
        <label>비밀번호 (6자 이상)
          <input type="password" required minLength={6} value={pw} onChange={(e) => setPw(e.target.value)} />
        </label>
        {msg && <p className={"msg " + msg.type}>{msg.text}</p>}
        <button className="btn big" disabled={busy}>{busy ? "잠시만요…" : mode === "login" ? "로그인" : "가입하기"}</button>
        <p className="switch">
          {mode === "login" ? "아직 회원이 아니신가요?" : "이미 계정이 있나요?"}{" "}
          <a href="#" onClick={(e) => { e.preventDefault(); setMsg(null); setMode(mode === "login" ? "signup" : "login"); }}>
            {mode === "login" ? "회원가입" : "로그인"}
          </a>
        </p>
        <p className="switch"><a href="#" onClick={(e) => { e.preventDefault(); onBack(); }}>← 돌아가기</a></p>
      </form>
    </main>
  );
}

// 자주 나오는 오류를 한국어로
function translate(m) {
  if (/Invalid login credentials/i.test(m)) return "이메일 또는 비밀번호가 맞지 않아요.";
  if (/already registered/i.test(m)) return "이미 가입된 이메일이에요.";
  if (/Email not confirmed/i.test(m)) return "이메일 확인이 아직 안 됐어요. 받은 메일의 링크를 눌러 주세요.";
  if (/Password should be/i.test(m)) return "비밀번호는 6자 이상이어야 해요.";
  if (/rate limit/i.test(m)) return "요청이 너무 많아요. 잠시 후 다시 시도해 주세요.";
  return m;
}
