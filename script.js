// tiny-performance-profile
/* Performance profile: animated background adapts, story timing/audio/product links stay unchanged. */
window.TINY_PERF = (() => {
  const qs = new URLSearchParams(location.search);
  const quality = qs.get('tinyfx');
  const touch = matchMedia('(pointer:coarse)').matches;
  const constrained = touch || (navigator.deviceMemory && navigator.deviceMemory <= 6)
     || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
  const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (touch && matchMedia('(max-width:900px)').matches && !/Windows|Macintosh|X11/i.test(navigator.userAgent));
  const lite = mobile || (quality === 'full' ? false : quality === 'lite' ? true : !!constrained);
  document.documentElement.classList.toggle('tiny-lite', lite);
  document.documentElement.classList.toggle('tiny-mobile', mobile);
  const maxCanvasPixels = mobile ? 365000 : lite ? 1250000 : 2100000;
  function canvasDpr(w,h,maxDpr=1.6) {
    return Math.max(mobile ? .48 : .55, Math.min(devicePixelRatio || 1,
      mobile ? .84 : lite ? 1.15 : maxDpr,
      Math.sqrt(maxCanvasPixels / Math.max(1, w*h))));
  }
  return { lite, mobile, canvasDpr, ambientFps: mobile ? 60 : lite ? 24 : 60,
    roverFps:mobile ? 45 : lite ? 30 : 60,
    orbitFps:mobile ? 45 : lite ? 24 : 60,
    leafFps:mobile ? 60 : lite ? 24 : 60 };

})();

// script-2
const text1 = document.getElementById('text-1');
        const text2 = document.getElementById('text-2');
        const text3 = document.getElementById('text-3');
        const text4 = document.getElementById('text-4');
        const text5 = document.getElementById('text-5');
        const text6 = document.getElementById('text-6');
        const text7 = document.getElementById('text-7');
        const text8 = document.getElementById('text-8');

        // Chỉ bật lớp trang trí tương ứng với lời chúc đang xuất hiện.
        (()=>{
            const pairs=[['text-6','decor-want'],['text-7','decor-health'],['text-8','decor-beauty']]
                .map(([textId,decorId])=>[document.getElementById(textId),document.getElementById(decorId)]);
            const sync=()=>pairs.forEach(([label,decor])=>{
                if(label&&decor)decor.classList.toggle('is-visible',label.classList.contains('hien-thi'));
            });
            pairs.forEach(([label])=>{if(label)new MutationObserver(sync).observe(label,{attributes:true,attributeFilter:['class']});});
            sync();
        })();
        const text9 = document.getElementById('text-9');
        const text10 = document.getElementById('text-10');
        const text11 = document.getElementById('text-11');
        const text12 = document.getElementById('text-12');
        const text13 = document.getElementById('text-13');
        const wishBackdrop = document.getElementById('wish-backdrop');
        const beautyStage = document.getElementById('beauty-stage');
        const smileStage = document.getElementById('smile-stage');
        const cloverStage = document.getElementById('clover-stage');
        const luckStage = document.getElementById('luck-stage');
        const luckFrontField = document.getElementById('luck-front-field');
        const questionStage = document.getElementById('question-stage');
        const pinkOverlay = document.getElementById('pink-overlay');
        const vangOverlay = document.getElementById('vang-overlay');
        const xanhOverlay = document.getElementById('xanh-overlay');
        const anhHaiNguoi = document.getElementById('anh-hai-nguoi');
        const laCanvas = document.getElementById('laCanvas');
        let laDaChay = false;
        const natureCanvas = document.getElementById('natureCanvas');
        const khungMat = document.getElementById('khung-mat');
        const lowerStars = document.getElementById('lower-stars');
        const womanScene = document.getElementById('woman-scene');
        const uiverseStarfield = document.getElementById('uiverse-starfield');
        const saoVuTru = document.getElementById('sao-vu-tru');
        const vienVuTru = document.getElementById('vien-vu-tru');
        const moiRobot = document.getElementById('moi-robot');
        const trucXElements = document.querySelectorAll('.truc-x');
        const matElements = document.querySelectorAll('.con-mat');
        
        // === MP3 + lyric: đồng hồ nhạc là nguồn thời gian duy nhất, không lệ thuộc số lượt click. ===
        const tinySoundtrack = document.getElementById('tiny-soundtrack');
        const musicWaitHint = document.getElementById('music-wait-hint');
        const lyricZone = document.getElementById('tiny-lyric-zone');
        const lyricSlots = [document.getElementById('tiny-lyric-top'), document.getElementById('tiny-lyric-bottom')];

        const lyricCues = [{"time":0.0,"text":"chỉ biết nói cho em"},{"time":1.7,"text":"nghe vậy thôi"},{"time":3.4,"text":"vì đã lỡ yêu em rồi"},{"time":6.3,"text":"chẳng giám[...]":0}];
        const MUSIC_HOLD_TIME = 9.7;
        const MUSIC_FADE_START = 8.35;
        const MUSIC_VOLUME = 0.84;
        let musicGateClosed = false;
        let musicAllowedPastGate = false;
        let musicFadeTimer = null;
        let musicResumeFadeStart = 0;
        let musicSeekingResume = false;
        let lyricActiveIndex = -1;
        let lyricSlotIndex = -1;
        let lyricInterval = null;
        tinySoundtrack.volume = MUSIC_VOLUME;
        tinySoundtrack.muted = false;
        let musicHintTimer = null;
        const musicWaitMessages = ['đợi chút xíu đii', 'đợi chút nữa thui', 'xíu nữa', 'sắp được rùi', '1 chút thuii'];
        function showMusicWaitHint() {
            const msg = musicWaitMessages[Math.floor(Math.random() * musicWaitMessages.length)];
            musicWaitHint.textContent = msg;
            musicWaitHint.classList.add('show');
            clearTimeout(musicHintTimer);
            musicHintTimer = setTimeout(() => musicWaitHint.classList.remove('show'), 1700);
        }

        function startMusicIfAllowed() {
            // Trình duyệt có thể chặn autoplay có tiếng khi chưa có thao tác người dùng.
            // Không hiện nút: thử phát khi mở, và thử lại trong lần click/chạm đầu tiên.
            if (musicGateClosed && !musicAllowedPastGate) return;
            if (!tinySoundtrack.paused) return;
            const p = tinySoundtrack.play();
            if (p && typeof p.catch === 'function') p.catch(() => {});
        }

        function musicFadeAndHold() {
            if (musicAllowedPastGate || musicGateClosed) return;
            const t = tinySoundtrack.currentTime || 0;
            if (t >= MUSIC_HOLD_TIME - .02) {
                musicGateClosed = true;
                scheduleIntroNudge(2000);
                tinySoundtrack.pause();
                try { tinySoundtrack.currentTime = MUSIC_HOLD_TIME; } catch (_) {}
                tinySoundtrack.volume = 0;
                if (musicFadeTimer !== null) { clearInterval(musicFadeTimer); musicFadeTimer = null; }
                return;
            }
            if (t >= MUSIC_FADE_START) {
                tinySoundtrack.volume = MUSIC_VOLUME * Math.max(0, (MUSIC_HOLD_TIME - t) / (MUSIC_HOLD_TIME - MUSIC_FADE_START));
            }
        }

        // Chỉ phát tiếp sau khi nghe đủ 9,7 giây VÀ click vào "ui em đẹp quá".
        function resumeMusicAtBeauty() {
            if (musicAllowedPastGate) return;
            if (!musicGateClosed || tinySoundtrack.currentTime < MUSIC_HOLD_TIME - .045) return;
            musicAllowedPastGate = true;
            musicGateClosed = false;
            if (musicFadeTimer !== null) { clearInterval(musicFadeTimer); musicFadeTimer = null; }
            musicSeekingResume = true;
            if (tinySoundtrack.readyState >= 1) {
                try { tinySoundtrack.currentTime = Math.max(MUSIC_HOLD_TIME, tinySoundtrack.currentTime); } catch (_) {}
            } else {
                tinySoundtrack.addEventListener('loadedmetadata', () => {
                    if (musicSeekingResume) tinySoundtrack.currentTime = MUSIC_HOLD_TIME;
                }, {once:true});
            }
            tinySoundtrack.volume = 0;
            const fadeIn = (now) => {
                if (tinySoundtrack.paused || !musicAllowedPastGate) return;
                const v = Math.min(1, (now - musicResumeFadeStart) / 850);
                tinySoundtrack.volume = MUSIC_VOLUME * v;
                if (v < 1) requestAnimationFrame(fadeIn);
            };
            // Đợi âm thanh PHÁT THỰC SỰ rồi mới đếm 850ms tăng âm lượng.
            // Nếu bắt đầu rAF trước play() xong thì có thể bị kẹt tại volume=0.
            tinySoundtrack.addEventListener('playing', () => {
                musicResumeFadeStart = performance.now();
                requestAnimationFrame(fadeIn);
            }, {once:true});
            startMusicIfAllowed();
        }

        function cueIndexAt(t) {
            let lo = 0, hi = lyricCues.length - 1, result = -1;
            while (lo <= hi) {
                const mid = (lo + hi) >> 1;
                if (lyricCues[mid].time <= t + .035) { result = mid; lo = mid + 1; }
                else hi = mid - 1;
            }
            return result;
        }

        // Luân phiên 2 hàng: hàng cũ mờ ra và hàng mới sáng lên, không dịch lyric theo số click.
        function syncLyricWithMusic(force=false) {
            if (activeWish !== 'smile') return;
            const index = cueIndexAt(tinySoundtrack.currentTime || 0);
            if (index === lyricActiveIndex && !force) return;
            if (index < 0) {
                lyricSlots.forEach(el => el.classList.remove('show'));
                lyricActiveIndex = -1;
                return;
            }
            const oldSlot = lyricSlotIndex;
            const nextSlot = oldSlot < 0 ? 0 : 1 - oldSlot;
            const cue = lyricCues[index];
            // Nếu song bị tua/người xem vào cảnh muộn, cập nhật ngay câu ứng với thời gian thực.
            lyricSlots.forEach(el => el.classList.remove('show'));
            const el = lyricSlots[nextSlot];
            el.textContent = cue.text;
            el.classList.toggle('compact', cue.text.length > 31);
            // Đồng thời cho câu tiếp theo hiện ở hàng đối diện, mờ dần câu cũ.
            requestAnimationFrame(() => {
                if (activeWish === 'smile' && cueIndexAt(tinySoundtrack.currentTime || 0) === index)
                    el.classList.add('show');
            });
            lyricActiveIndex = index;
            lyricSlotIndex = nextSlot;
        }

        function beginLyricsAtSmile() {
            lyricActiveIndex = -1;
            lyricSlotIndex = -1;
            lyricSlots.forEach(el => { el.classList.remove('show','compact'); el.textContent = ''; });
            lyricZone.classList.add('hien-thi');
            lyricZone.setAttribute('aria-hidden','false');
            syncLyricWithMusic(true);
            if (lyricInterval === null) lyricInterval = setInterval(() => syncLyricWithMusic(), TINY_PERF.lite ? 160 : 110);
        }

        tinySoundtrack.addEventListener('timeupdate', () => {
            musicFadeAndHold();
            if (activeWish === 'smile') syncLyricWithMusic();
        });
        tinySoundtrack.addEventListener('play', () => {
            if (!musicAllowedPastGate && !musicGateClosed && musicFadeTimer === null)
                musicFadeTimer = setInterval(musicFadeAndHold, 35);
        });
        // Thử phát NGAY khi mở trang (và khi media sẵn sàng), không cần nút riêng.
        // Chrome/Safari có thể chặn tiếng khi chưa có tương tác: trường hợp đó click đầu tiên
        // trên trang sẽ khởi phát nhạc như trước, không thể vượt qua chính sách bằng JavaScript.
        startMusicIfAllowed();
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startMusicIfAllowed, {once:true});
        }
        window.addEventListener('load', startMusicIfAllowed, {once:true});
        window.addEventListener('pageshow', startMusicIfAllowed);
        tinySoundtrack.addEventListener('canplay', startMusicIfAllowed, {once:true});
        tinySoundtrack.addEventListener('canplaythrough', startMusicIfAllowed, {once:true});
        // Khi người dùng đã cho phép tự phát âm thanh trên website, nhạc bắt đầu
        // ngay khi trang/media sẵn sàng. Nếu trình duyệt chặn autoplay có tiếng,
        // tương tác đầu tiên sẽ mở khóa (không có cách JS hợp lệ để vượt chính sách đó).
        document.addEventListener('pointerdown', startMusicIfAllowed, {passive:true});
        document.addEventListener('keydown', startMusicIfAllowed);
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) startMusicIfAllowed();
        });

        let clickCount = 0;
        let animationStarted = false;
        // Gợi ý xuất hiện khi nhạc đầu đã nghe đủ 9,7 giây, người xem chờ thêm 2s
        // ở một trong ba cảnh mở đầu, kể cả cảnh nhận lệnh từ Dr D. Không dựa trên thời gian mở trang.
        const introNudge = document.getElementById('tiny-intro-nudge');
        let introNudgeTimer = null;
        function hideIntroNudge() {
            clearTimeout(introNudgeTimer);
            introNudgeTimer = null;
            introNudge?.classList.remove('show');
            khungMat.classList.remove('tiny-intro-urging');
        }
        function scheduleIntroNudge(waitMs=2000) {
            clearTimeout(introNudgeTimer);
            if (!musicGateClosed || musicAllowedPastGate || clickCount > 2) return;
            introNudgeTimer = setTimeout(() => {
                if (!musicGateClosed || musicAllowedPastGate || clickCount > 2 || document.hidden) return;
                // Nếu người xem chưa đánh thức Tiny, Tiny tự mở mắt mời sang cảnh.
                matElements.forEach(eye => eye.classList.add('thuc'));
                khungMat.classList.add('tiny-intro-urging');
                introNudge?.classList.add('show');
            },waitMs);
        }
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) hideIntroNudge();
            else if (musicGateClosed && !musicAllowedPastGate && clickCount <= 2)
                scheduleIntroNudge(2000);
        });

        let canClick = true;
        let dungRoiHoa = false;
        let dungVeLaVang = false;
        let dungVeHoaHong = false; 
        let ngungChopTuDong = false;
        let canhMuonDaChay = false;
        let canhChucDaChay = false;
        let activeWish = '';
        let wishBlinkHandle = null;
        let wishBlinkToken = 0;
        // Batch heavy scene initialization: the text and real Tiny eyes always retain full speed.
        let tinyTransitionTimer = 0;
        function budgetSceneTransition(ms=760) {
            clearTimeout(tinyTransitionTimer);
            document.documentElement.classList.add('tiny-scene-transition');
            tinyTransitionTimer=setTimeout(()=>document.documentElement.classList.remove('tiny-scene-transition'),ms);
            window.tinyPauseDecorForTransition=budgetSceneTransition;
        }
        function afterPaintIfCurrent(scene,fn,delay=90) {
            setTimeout(()=>{
                if(activeWish!==scene)return;
                requestAnimationFrame(()=>{if(activeWish===scene)fn()});
            },delay);
        }


        // Chuyển cảnh: click chuột trên PC hoặc chạm màn hình trên mobile
        function chuyenCanh() {
            {
                if (!canClick) return;
                // Gọi play() ngay trong tương tác để Chrome cho phép âm thanh.
                startMusicIfAllowed();
                // Không được bỏ qua 9,7 giây đầu dù click nhiều lần.
                if (clickCount === 2 && (!musicGateClosed || tinySoundtrack.currentTime < MUSIC_HOLD_TIME - .045)) {
                    showMusicWaitHint();
                    return;
                }
                if (clickCount === 2) resumeMusicAtBeauty();
                hideIntroNudge();

                if (clickCount === 0) {
                    canClick = false;
                    clickCount++;
                    text1.classList.remove('hien-thi');
                    
                    setTimeout(() => {
                        matElements.forEach(m => m.classList.add('thuc'));
                        text2.classList.add('hien-thi'); 
                        setTimeout(kichHoatChuKyChop, 1000);
                        canClick = true;
                        if (musicGateClosed && clickCount === 1) scheduleIntroNudge(2000); 
                    }, 700);
                } 
                else if (clickCount === 1) {
                    clickCount++;
                    text2.classList.remove('hien-thi');
                    text3.classList.add('hien-thi');
                    batDauLiec();
                    if (musicGateClosed && !musicAllowedPastGate) scheduleIntroNudge(2000);
                }
                else if (clickCount === 2) {
                    clickCount++;
                    
                    text3.classList.remove('hien-thi');
                    text4.classList.add('hien-thi');
                    pinkOverlay.classList.add('hien-thi');
                    natureCanvas.classList.add('hien-thi');

                    dungLiec(false);
                    trucXElements.forEach(tx => {
                        const currentTransform = window.getComputedStyle(tx).getPropertyValue('transform');
                        tx.style.transform = currentTransform; 
                    });

                    void khungMat.offsetWidth; 

                    trucXElements.forEach(tx => {
                        tx.style.transition = 'transform 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
                        tx.style.transform = 'translateX(0)';
                    });

                    khungMat.classList.add('me-man');
                    
                    if (!animationStarted) {
                        try {
                            khoiDongMuaHoa();
                        } catch (err) {
                            console.error("Lỗi:", err);
                        }
                        animationStarted = true;
                    }
                }
                else if (clickCount === 3) {
                    clickCount++;
                    
                    text4.classList.remove('hien-thi');
                    text5.classList.add('hien-thi');
                    document.getElementById('tiny-sky').classList.add('hien-thi');
                    
                    pinkOverlay.classList.remove('hien-thi');
                    vangOverlay.classList.add('loe');          // Ánh vàng lóe từ đáy màn hình
                    anhHaiNguoi.classList.add('hien-thi');     // Ảnh hai cô gái ở góc phải
                    laCanvas.classList.add('hien-thi');        // Lá vàng và hoa rơi bên phải
                    coHoa.classList.add('hien-thi');           // Cỏ hoa vẽ nét đung đưa theo gió
                    if (!laDaChay) { laDaChay = true; khoiDongLaVang(); }
                    moiRobot.classList.remove('hien-thi');
                    moiRobot.style.opacity = '0';
                    
                    trucXElements.forEach(tx => {
                        tx.style.transition = ''; 
                        tx.style.transform = ''; 
                    });
                    batDauLiec();   // mắt liếc ngẫu nhiên, mỏ đưa theo
                    
                    dungRoiHoa = true; 
                    natureCanvas.style.transition = 'opacity 6s ease-in-out';
                    natureCanvas.style.opacity = '0';
                    // Ngừng vẽ các cánh hồng sau khi đã mờ hẳn để giải phóng CPU/GPU.
                    setTimeout(() => { dungVeHoaHong = true; }, 6300);
                }
                else if (clickCount === 4) {
                    clickCount++;
                    batDauCanhMuon();
                }
                else if (clickCount === 5) {
                    clickCount++;
                    batDauCanhChucSucKhoe();
                }
                else if (clickCount === 6) {
                    clickCount++;
                    batDauCanhChucXinhDep();
                }
                else if (clickCount === 7) {
                    clickCount++;
                    batDauCanhGiuNuCuoi();
                }
                else if (clickCount === 8) {
                    clickCount++;
                    batDauCanhCoBonLa();
                }
                else if (clickCount === 9) {
                    clickCount++;
                    batDauCanhCamLayDi();
                }
                else if (clickCount === 10) {
                    clickCount++;
                    batDauCanhMayMan();
                }
                else if (clickCount === 11) {
                    clickCount++;
                    batDauCanhLieuCoThe();
                }
                else if (clickCount === 12) {
                    clickCount++;
                    startShareFlightScene();
                }
            }
        }

// ... rest of the original script content unchanged ...

// Append helper: persistent music toggle and quick text update per user request
(function(){
  // Create a small floating music toggle button if not present in HTML
  function ensureButton(){
    let btn = document.getElementById('music-toggle-btn');
    if (btn) return btn;
    btn = document.createElement('button');
    btn.id = 'music-toggle-btn';
    btn.type = 'button';
    btn.setAttribute('aria-pressed','false');
    btn.textContent = 'Bật nhạc';
    // basic positioning so it appears and is usable without CSS changes
    btn.style.position = 'fixed';
    btn.style.left = '12px';
    btn.style.bottom = '12px';
    btn.style.zIndex = '9999';
    btn.style.padding = '8px 12px';
    btn.style.borderRadius = '8px';
    btn.style.border = 'none';
    btn.style.background = 'rgba(0,0,0,0.6)';
    btn.style.color = '#fff';
    btn.style.fontSize = '14px';
    btn.style.cursor = 'pointer';
    document.body.appendChild(btn);
    return btn;
  }

  const btn = ensureButton();
  function updateBtn(playing){
    if(!btn) return;
    btn.textContent = playing ? 'Tắt nhạc' : 'Bật nhạc';
    btn.setAttribute('aria-pressed', playing ? 'true':'false');
  }

  // restore user preference: if user previously forced music on, allow past gate
  try{
    const pref = localStorage.getItem('bgmUserToggle');
    if(pref === '1'){
      musicAllowedPastGate = true;
      // attempt to resume from hold time so UX is continuous
      try{ if(tinySoundtrack.readyState >= 1) tinySoundtrack.currentTime = Math.max(MUSIC_HOLD_TIME, tinySoundtrack.currentTime || 0); }catch(_){ }
      tinySoundtrack.play().then(()=>updateBtn(true)).catch(()=>updateBtn(!tinySoundtrack.paused));
    } else {
      updateBtn(!tinySoundtrack.paused);
    }
  } catch(e){ updateBtn(!tinySoundtrack.paused); }

  btn.addEventListener('click', function(e){
    e.preventDefault();
    if (tinySoundtrack.paused) {
      musicAllowedPastGate = true;
      localStorage.setItem('bgmUserToggle','1');
      tinySoundtrack.play().then(()=>{
        updateBtn(true);
      }).catch(()=>{
        // if autoplay blocked, leave label and let user click again
        updateBtn(!tinySoundtrack.paused);
        alert('Trình duyệt có thể chặn tự động phát âm thanh. Hãy nhấn lại để bật nhạc.');
      });
    } else {
      tinySoundtrack.pause();
      musicAllowedPastGate = false;
      localStorage.setItem('bgmUserToggle','0');
      updateBtn(false);
    }
  });

  // Quick text replacement requested by user: change opening text if present
  try{
    const el = document.getElementById('text-1');
    if(el) el.textContent = 'Cậu tớ. Tớ là 10A8. Được nhận lệnh từ Mẹ Hằng xinh gái, ...';
  }catch(e){}
})();
