// 제주 귤밭 쉼터 — 설정 파일
// 이 파일만 고치면 연결 방식을 바꿀 수 있어요. (자세한 설명은 README.md)
window.JEJU_CONFIG = {
  // 내 귤밭만의 이름표예요. 다른 사람이 같은 코드를 올려도 섞이지 않게, 아무 영어/숫자로 바꿔두면 좋아요.
  appId: 'jeju-gyul-shelter-2026',

  // 기본 방 이름. 주소 뒤에 ?room=2 처럼 붙이면 다른 방(귤밭 2번)으로 들어가요.
  room: 'gyul-1',

  // 연결 방식: 'nostr'(기본, 가입 필요 없음) · 'mqtt' · 'torrent' · 'supabase'
  strategy: 'nostr',

  // strategy를 'supabase'로 바꿨을 때만 채워요.
  supabaseUrl: '',   // 예: 'https://abcdefgh.supabase.co'
  supabaseKey: '',   // Supabase의 anon public 키

  // 학교·회사 와이파이에서 서로 연결이 안 될 때만 TURN 서버를 넣어요.
  // 예: [{urls: 'turn:서버주소:3478', username: '아이디', credential: '비밀번호'}]
  turn: [],
};
