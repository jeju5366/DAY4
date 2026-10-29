# 🍊 제주 이야기 (Vite + React + Supabase + Pixabay)

제주 캐릭터·콘텐츠(돌하르방, 감귤, 해녀, 한라산, 오름) 소개 사이트.
- 회원가입/로그인: Supabase Auth (이메일 + 비밀번호)
- 비회원: 갤러리 6장 / 회원: 카테고리별 24장
- 이미지: Pixabay API (키는 서버리스 함수에서만 사용 → 브라우저에 노출되지 않음)

## 환경변수 (3개)

| 이름 | 어디서 얻나 | 노출 |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase → Project Settings → API → Project URL | 공개 OK |
| `VITE_SUPABASE_ANON_KEY` | 같은 화면의 `anon` / publishable key | 공개 OK |
| `PIXABAY_API_KEY` | https://pixabay.com/api/docs/ (로그인 후 화면에 표시) | **비공개** (VITE_ 붙이지 말 것) |

## 1) Supabase 준비
1. https://supabase.com → New project 생성
2. Project Settings → API 에서 **Project URL**, **anon(publishable) key** 복사
3. Authentication → Providers → **Email** 이 켜져 있는지 확인
   - 테스트를 빨리 하려면 "Confirm email" 을 끄면 가입 즉시 로그인됩니다.
   - 켜 두면 가입 후 확인 메일의 링크를 눌러야 해요.
4. Authentication → URL Configuration
   - **Site URL**: 배포 주소 (예: `https://내프로젝트.vercel.app`)
   - **Redirect URLs**: `http://localhost:5173/**` 와 `https://내프로젝트.vercel.app/**` 추가

## 2) Pixabay 키
1. https://pixabay.com 가입/로그인 → https://pixabay.com/api/docs/ 접속
2. 문서 상단 "Parameters → key" 자리에 표시되는 API Key 복사

## 3) 로컬 실행
```bash
npm install
cp .env.example .env     # Windows: copy .env.example .env  → 값 채우기
npm run dev              # http://localhost:5173
```

## 4) GitHub 에 올리기
```bash
git init && git add . && git commit -m "init"
git remote add origin https://github.com/<아이디>/<저장소>.git
git push -u origin main
```
(`.env` 는 `.gitignore` 로 제외되어 올라가지 않습니다.)

## 5) Vercel 배포
1. https://vercel.com → Add New → Project → GitHub 저장소 Import
2. Framework Preset: **Vite** (자동 감지) — Build `npm run build`, Output `dist`
3. **Environment Variables** 에 위 3개를 입력 (Production / Preview / Development 모두 체크)
4. Deploy → 완료 후 발급된 주소를 Supabase **Site URL / Redirect URLs** 에 등록(1-4)
5. 환경변수를 나중에 바꿨다면 Deployments → Redeploy 해야 반영돼요.

## 구조
```
api/pixabay.js      Vercel 서버리스 함수 (Pixabay 프록시, 24시간 캐시)
server/pixabay.js   Pixabay 호출 공통 로직
vite.config.js      npm run dev 에서도 /api/pixabay 동작시키는 플러그인
src/                App(홈/헤더) · Auth(로그인/가입) · Gallery(이미지) · supabase.js
```

사진 출처: Pixabay (페이지 하단에 표기, 라이트박스에 작가 링크 표시)
