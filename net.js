// 제주 귤밭 쉼터 — 함께하기 연결 (Trystero, 서버 없는 P2P)
// 페이지 본체가 쓰는 연결 방식(presence / peers)을 그대로 흉내 냅니다.
const CFG = Object.assign({appId: 'jeju-gyul-shelter', room: 'gyul-1', strategy: 'nostr', supabaseUrl: '', supabaseKey: '', turn: []}, window.JEJU_CONFIG || {});
const PKG = {
  nostr: 'https://esm.run/trystero@0.25',
  mqtt: 'https://esm.run/@trystero-p2p/mqtt@0.25',
  torrent: 'https://esm.run/@trystero-p2p/torrent@0.25',
  supabase: 'https://esm.run/@trystero-p2p/supabase@0.25',
};
const qs = new URLSearchParams(location.search);
const roomName = String(qs.get('room') || CFG.room || 'gyul-1').replace(/[^\w\-가-힣]/g, '').slice(0, 40) || 'gyul-1';
const strategy = PKG[CFG.strategy] ? CFG.strategy : 'nostr';
const resolve = window.__jejuNetResolve || (() => {});
window.__jejuNetInfo = {room: roomName, strategy, error: ''};

async function start(){
  const lib = await import(CFG.libUrl || PKG[strategy]);
  const {joinRoom, selfId} = lib;
  const config = {appId: CFG.appId};
  if (strategy === 'supabase'){
    if (!CFG.supabaseUrl || !CFG.supabaseKey) throw new Error('config.js에 supabaseUrl과 supabaseKey를 넣어주세요');
    config.appId = CFG.supabaseUrl; config.supabaseKey = CFG.supabaseKey; config.relayConfig = {supabaseKey: CFG.supabaseKey};
  }
  if (Array.isArray(CFG.turn) && CFG.turn.length){ config.turnConfig = CFG.turn; config.rtcConfig = {iceServers: CFG.turn}; }
  const room = joinRoom(config, roomName);

  // --- Trystero changed its API over versions: support both shapes
  const act = room.makeAction('pres');
  const oldApi = Array.isArray(act);
  const send = oldApi ? (d, to) => act[0](d, to) : (d, to) => act.send(d, to ? {target: to} : undefined);
  const listen = fn => oldApi ? act[1]((d, id) => fn(d, id)) : (act.onMessage = (d, meta) => fn(d, meta && typeof meta === 'object' ? meta.peerId : meta));
  const setHandler = (name, fn) => oldApi ? room[name](fn) : (room[name] = fn);

  // --- presence state shared with everyone in the room
  let me = {peer: selfId, by: null, isMe: true, sameTab: true, kind: 'viewer', guest: false, presence: {}, updatedAt: Date.now()};
  let myState = {};
  const others = new Map(), lastSeen = new Map();
  let snapshot = Object.freeze([me]);
  const listeners = new Set();
  let pending = {joined: [], left: [], updated: []}, scheduled = false;
  const rebuild = () => { snapshot = Object.freeze([me, ...others.values()]); };
  const flushChanges = () => {
    if (scheduled) return; scheduled = true;
    setTimeout(() => {
      scheduled = false;
      const ch = {peers: snapshot, joined: pending.joined, left: pending.left, updated: pending.updated};
      pending = {joined: [], left: [], updated: []};
      listeners.forEach(fn => { try { fn(ch); } catch (e){ console.error(e); } });
    }, 0);
  };
  const drop = id => {
    const p = others.get(id); if (!p) return;
    others.delete(id); lastSeen.delete(id); rebuild(); pending.left.push(p); flushChanges();
  };
  listen((d, id) => {
    if (!id || id === selfId || !d || typeof d !== 'object') return;
    const st = d.s && typeof d.s === 'object' && !Array.isArray(d.s) ? d.s : {};
    const had = others.has(id);
    const p = Object.freeze({peer: String(id), by: null, isMe: false, sameTab: false, kind: 'viewer', guest: false, presence: Object.freeze(st), updatedAt: Date.now()});
    others.set(id, p); lastSeen.set(id, Date.now()); rebuild();
    (had ? pending.updated : pending.joined).push(p); flushChanges();
  });
  setHandler('onPeerJoin', id => { lastSeen.set(id, Date.now()); try { send({s: myState}, id); } catch (e){} });
  setHandler('onPeerLeave', id => drop(id));

  let dirty = true, lastSent = 0;
  setInterval(() => {
    const now = Date.now();
    if (dirty || now - lastSent > 1500){ try { send({s: myState}); } catch (e){} dirty = false; lastSent = now; }
    lastSeen.forEach((t, id) => { if (now - t > 12000) drop(id); });
  }, 100);
  window.addEventListener('pagehide', () => { try { room.leave(); } catch (e){} });

  return {
    roomName, strategy,
    peers: () => snapshot,
    onPeers(fn){ listeners.add(fn); setTimeout(() => fn({peers: snapshot, joined: snapshot.slice(), left: [], updated: []}), 0); return () => listeners.delete(fn); },
    presence(patch){
      for (const k in patch){ if (patch[k] === null) delete myState[k]; else myState[k] = patch[k]; }
      myState = Object.assign({}, myState);
      me = Object.freeze(Object.assign({}, me, {presence: Object.freeze(Object.assign({}, myState)), updatedAt: Date.now()}));
      rebuild(); dirty = true;
      return Promise.resolve();
    },
    connected: () => true,
    onConnection(fn){ setTimeout(() => fn(true), 0); return () => {}; },
    emit: () => Promise.resolve(), on: () => () => {},
  };
}
start().then(api => resolve(api)).catch(e => { console.warn('[귤밭 연결 실패]', e); window.__jejuNetInfo.error = String(e && e.message || e); resolve(null); });
