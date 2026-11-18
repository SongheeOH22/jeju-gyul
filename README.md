# 🍊 제주 귤밭 쉼터

제주 바닷가 귤밭에서 귤을 따고, 정자에서 고양이랑 쉬고, 모닥불에 고구마를 굽고, 해녀복을 입고 물질도 하는 작은 힐링 공간이에요.
링크만 있으면 누구나 들어올 수 있고, **'함께하기'**를 고르면 같은 링크로 들어온 사람들끼리 서로 보여요.

---

## 📁 파일 구성

| 파일 | 하는 일 |
|---|---|
| `index.html` | 귤밭 본체 (3D 화면, 캐릭터, 고양이, 바다 전부) |
| `net.js` | 함께하기 연결 (서버 없이 사람들끼리 직접 연결하는 Trystero 사용) |
| `config.js` | 설정 파일 — 방 이름, 연결 방식을 여기서 바꿔요 |
| `README.md` | 지금 보고 있는 안내서 |

> 네 파일을 **같은 폴더(저장소 맨 위)**에 그대로 올려야 해요.

---

## 🚀 GitHub Pages에 올리기 (처음 한 번)

1. **GitHub 가입·로그인** → 오른쪽 위 **＋ → New repository**
2. Repository name에 `jeju-gyul` 처럼 이름을 적고, **Public**을 고른 뒤 **Create repository**
   - 무료 계정은 Public 저장소에서만 Pages를 쓸 수 있어요.
3. 저장소 화면에서 **Add file → Upload files** → 네 파일(`index.html`, `net.js`, `config.js`, `README.md`)을 끌어다 놓고 **Commit changes**
4. 저장소 위쪽 **Settings → (왼쪽) Pages**
   - Build and deployment → Source: **Deploy from a branch**
   - Branch: **main**, 폴더: **/ (root)** → **Save**
5. 1~10분 기다린 뒤 `https://내아이디.github.io/jeju-gyul/` 로 들어가 보세요.
   Pages 설정 화면 위쪽에 주소와 **Visit site** 버튼도 나와요.

### 고친 파일을 다시 올릴 때
**Add file → Upload files**로 같은 이름의 파일을 다시 올리고 Commit 하면 덮어써져요. 반영까지 몇 분 걸릴 수 있어요.

---

## 👥 같이 놀기

1. 위 주소를 친구들에게 보내요.
2. 각자 닉네임을 정하고 **👥 함께하기**를 골라 들어가요.
3. 서로의 캐릭터와 이름표가 보이고, 같이 귤 따고, 정자·모닥불에 둥글게 앉을 수 있어요.

### 방 나누기 (사람이 많을 때)
이 방식은 접속한 사람들의 브라우저끼리 직접 연결해서, 한 방에 사람이 너무 많으면 느려질 수 있어요. 그럴 땐 주소 뒤에 방 번호를 붙여 나누세요.

- 귤밭 1번 (기본): `https://내아이디.github.io/jeju-gyul/`
- 귤밭 2번: `https://내아이디.github.io/jeju-gyul/?room=2`
- 우리 반 전용: `https://내아이디.github.io/jeju-gyul/?room=class3`

같은 `room` 주소로 들어온 사람끼리만 만나요.

---

## ⚙️ config.js 설정

```js
window.JEJU_CONFIG = {
  appId: 'jeju-gyul-shelter-2026',  // 내 귤밭만의 이름. 아무 영어·숫자로 바꿔두면 다른 사람 귤밭과 안 섞여요
  room: 'gyul-1',                   // 기본 방 이름
  strategy: 'nostr',                // 연결 방식: 'nostr'(기본) · 'mqtt' · 'torrent' · 'supabase'
  supabaseUrl: '', supabaseKey: '', // supabase 방식일 때만
  turn: [],                         // 연결이 막힐 때만 (아래 참고)
};
```

---

## 🔧 연결이 안 될 때

게임 안에서 왼쪽 기록판의 **'👥 함께하기 · 상태'** 줄(또는 시작 화면 아래 **🔧 연결 상태 보기**)을 누르면 진단 창이 떠요.

| 진단 창에 보이는 것 | 뜻 | 해볼 것 |
|---|---|---|
| 연결 라이브러리: **실패 ❌** | 연결 도구를 못 불러왔어요 | 새로고침, 다른 인터넷에서 다시 시도 |
| 같은 방에 연결된 다른 사람: **0명** (둘 다 들어와 있는데) | 서로를 못 찾았어요 | 둘 다 주소의 `?room=`이 같은지 확인 → 1~2분 기다려보기 → 아래 1·2번 |
| 다른 사람은 보이는데 캐릭터가 안 움직임 | 그 사람 창이 백그라운드에 있어요 | 그 사람이 귤밭 창을 앞에 띄우면 다시 움직여요 |

**1. 연결 방식 바꿔보기** — `config.js`의 `strategy`를 `'mqtt'` 또는 `'torrent'`로 바꿔 다시 올려보세요. (모두 같은 설정으로 들어와야 만나요)

**2. 학교·회사 와이파이에서만 안 될 때 (TURN 서버)** — 일부 네트워크는 브라우저끼리 직접 연결하는 걸 막아요. 이때는 중간에서 이어주는 TURN 서버가 필요해요. Cloudflare의 무료 TURN이나 Open Relay 같은 서비스에서 주소·아이디·비밀번호를 받아 `config.js`에 넣으면 돼요.

```js
turn: [{urls: 'turn:서버주소:3478', username: '아이디', credential: '비밀번호'}],
```

**3. Supabase로 바꾸기 (더 안정적으로)** — Supabase는 서로를 찾아주는 역할만 하고, 캐릭터 움직임은 계속 브라우저끼리 직접 주고받아서 무료 한도를 거의 쓰지 않아요.
1. supabase.com 가입 → New project 만들기
2. Project Settings → API에서 **Project URL**과 **anon public** 키 복사
3. `config.js`에서
   ```js
   strategy: 'supabase',
   supabaseUrl: 'https://xxxx.supabase.co',
   supabaseKey: '복사한 anon public 키',
   ```
4. 다시 올리기 (Supabase 무료 프로젝트는 일주일 동안 안 쓰면 잠들 수 있어요. 대시보드에서 다시 깨우면 돼요)

---

## 🌿 저장되는 것

- 닉네임, 마지막으로 고른 들어가는 방법, 돌담 소원 쪽지, 접어둔 패널 상태는 **각자 브라우저에만** 저장돼요.
- 서버가 없어서, 접속한 사람끼리 주고받는 건 지금 위치·동작·딴 귤처럼 "지금 이 순간" 정보뿐이에요.

## 🎮 조작

- 이동: WASD / 방향키 (Shift 달리기) · 휴대폰은 왼쪽 아래 조이스틱
- 시점: 화면 드래그 · 휠로 확대/축소
- 행동: E 또는 Space (오른쪽 아래 버튼) · 고양이 쓰다듬기: F · 인사: Q
