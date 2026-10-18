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

        const lyricCues = [
  {"time":0.0,"text":"chỉ biết nói cho em"},
  {"time":1.7,"text":"nghe vậy thôi"},
  {"time":3.4,"text":"vì đã lỡ yêu em rồi"},
  {"time":6.3,"text":"chẳng giám..."}
];
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

{