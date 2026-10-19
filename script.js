/* ========================================================
   JAVASCRIPT CHO TRANG CHÚC MỪNG 20/10 THU HÀ
   - Tương tác lầy lội với nút "Người code" (nhỏ dần & nhảy linh tinh)
   - Pháo hoa, thả tim, hiệu ứng âm thanh Web Audio sinh động
   - Hoạt động mượt mà 100% trên điện thoại & GitHub Pages
   ======================================================== */

// --- DỮ LIỆU CÂU HỎI ---
const QUIZ_DATA = [
  {
    badge: "Câu hỏi 1 / 3",
    emoji: "🌸",
    title: "Ai là người xinh hơn?",
    reaction: "Hãy suy nghĩ thật kỹ trước khi chọn nha!",
    winReaction: "Chính xác 100%! Thu Hà xinh nhất VN! ✨"
  },
  {
    badge: "Câu hỏi 2 / 3",
    emoji: "🥰",
    title: "Ai là người cute, đáng yêu hơn?",
    reaction: "Câu này quá dễ luôn nè, không được chọn sai đâu!",
    winReaction: "Quá chuẩn! top1VN 🥰"
  },
  {
    badge: "Câu hỏi 3 / 3",
    emoji: "😎",
    title: "Ai là người ngầu nhất hôm nay?",
    reaction: "Nhân vật chính của ngày 20/10 là ai ta?",
    winReaction: "Tuyệt đối chính xác! Hà vừa ngầu vừa xuất sắc 👑"
  }
];

// Các câu cà khịa khi cố tình bấm "Người code"
const CODER_SNARK_MESSAGES = [
  "alo alo???? 🤨",
  "ô chưa tỉnh ngủ à ",
  "nút màu trắng có võ đấy 🤏",
  "ô con mèo kìa ",
  "nút màu đỏ đẹp thế không bấm hầy ",
  "em co quyen lua chon sao? "
];

// --- STATE QUẢN LÝ ---
let currentQuestionIndex = 0;
let coderClickCount = 0;
const MAX_CODER_CLICKS = 6;
let heartSendCount = 0;
let isAudioPlaying = false;
let audioCtx = null;
let melodyInterval = null;

// --- DOM ELEMENTS ---
const screenIntro = document.getElementById('screenIntro');
const screenQuiz = document.getElementById('screenQuiz');
const screenWishes = document.getElementById('screenWishes');

const btnStart = document.getElementById('btnStart');
const btnExit = document.getElementById('btnExit');
const exitModal = document.getElementById('exitModal');
const btnStay = document.getElementById('btnStay');

const quizBadge = document.getElementById('quizBadge');
const progressBarFill = document.getElementById('progressBarFill');
const questionEmoji = document.getElementById('questionEmoji');
const questionTitle = document.getElementById('questionTitle');
const reactionText = document.getElementById('reactionText');
const answersArena = document.getElementById('answersArena');
const btnHa = document.getElementById('btnHa');
const btnCoder = document.getElementById('btnCoder');
const coderToast = document.getElementById('coderToast');

const btnSendLove = document.getElementById('btnSendLove');
const heartCount = document.getElementById('heartCount');
const btnReplay = document.getElementById('btnReplay');
const musicToggle = document.getElementById('musicToggle');

// --- HỆ THỐNG ÂM THANH TỔNG HỢP (WEB AUDIO API) ---
// Không cần tải file ngoài, cam kết không lỗi 404, chạy ngon lành trên iOS Safari & Android
function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// Âm thanh nảy / tưng tưng khi bấm nút Người code
function playBoingSound() {
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    
    // Tần số trượt từ cao xuống thấp
    const now = audioCtx.currentTime;
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.18);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  } catch (e) {
    console.warn(e);
  }
}

// Âm thanh chúc mừng keng keng khi chọn đúng "Thu Hà"
function playCelebrationSound() {
  if (!audioCtx) return;
  try {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // Đô - Mi - Sol - Đố
    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const now = audioCtx.currentTime + idx * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    });
  } catch (e) {
    console.warn(e);
  }
}

// Âm thanh pop nhỏ khi thả tim
function playPopSound() {
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const now = audioCtx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600 + Math.random() * 200, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.1);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  } catch (e) {
    console.warn(e);
  }
}

// Nhạc nền du dương dạng hộp nhạc nhẹ nhàng
const MUSIC_BOX_NOTES = [
  659.25, 783.99, 880.00, 1046.50, // E5, G5, A5, C6
  880.00, 783.99, 659.25, 587.33, // A5, G5, E5, D5
  523.25, 659.25, 783.99, 880.00, // C5, E5, G5, A5
  1046.50, 1174.66, 1046.50, 880.00
];
let musicNoteIdx = 0;

function playMelodyNote() {
  if (!isAudioPlaying || !audioCtx) return;
  try {
    const freq = MUSIC_BOX_NOTES[musicNoteIdx % MUSIC_BOX_NOTES.length];
    musicNoteIdx++;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const now = audioCtx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Dáng âm thanh hộp nhạc (nhẹ nhàng, ấm cúng)
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.8);
  } catch (e) {}
}

function startBackgroundMusic() {
  initAudio();
  if (melodyInterval) clearInterval(melodyInterval);
  isAudioPlaying = true;
  musicToggle.classList.remove('muted');
  melodyInterval = setInterval(playMelodyNote, 480);
}

function stopBackgroundMusic() {
  isAudioPlaying = false;
  musicToggle.classList.add('muted');
  if (melodyInterval) {
    clearInterval(melodyInterval);
    melodyInterval = null;
  }
}

musicToggle.addEventListener('click', () => {
  if (isAudioPlaying) {
    stopBackgroundMusic();
  } else {
    startBackgroundMusic();
  }
});

// --- CHUYỂN ĐỔI MÀN HÌNH ---
function switchScreen(fromScreen, toScreen) {
  fromScreen.classList.remove('active');
  setTimeout(() => {
    toScreen.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 250);
}

// Bắt đầu
btnStart.addEventListener('click', () => {
  startBackgroundMusic();
  switchScreen(screenIntro, screenQuiz);
  loadQuestion(0);
});

// Nút Thoát
btnExit.addEventListener('click', () => {
  // Thử đóng tab trước (chỉ hoạt động nếu được mở từ script)
  window.close();
  // Nếu trình duyệt chặn, mở modal trêu bạn Hà
  exitModal.classList.add('show');
});

btnStay.addEventListener('click', () => {
  exitModal.classList.remove('show');
  startBackgroundMusic();
  switchScreen(screenIntro, screenQuiz);
  loadQuestion(0);
});

// --- LOGIC CÂU HỎI & NÚT LẦY LỘI ---
function loadQuestion(index) {
  currentQuestionIndex = index;
  coderClickCount = 0;
  
  const data = QUIZ_DATA[index];
  quizBadge.textContent = data.badge;
  questionEmoji.textContent = data.emoji;
  questionTitle.textContent = data.title;
  reactionText.textContent = data.reaction;
  reactionText.style.color = '#636e72';

  // Cập nhật progress bar
  const progressPercent = ((index + 1) / QUIZ_DATA.length) * 100;
  progressBarFill.style.width = `${progressPercent}%`;

  // Reset nút Người code & nút Thu Hà
  resetButtons();
  hideToast();
}

function resetButtons() {
  btnCoder.style.transform = 'scale(1) translate(0px, 0px)';
  btnCoder.style.opacity = '1';
  btnCoder.style.pointerEvents = 'auto';
  btnCoder.style.display = 'inline-flex';

  btnHa.style.transform = 'scale(1)';
  btnHa.style.pointerEvents = 'auto';
}

function showToast(text) {
  coderToast.textContent = text;
  coderToast.classList.add('show');
}

function hideToast() {
  coderToast.classList.remove('show');
}

// Sự kiện khi bấm/chạm nút Người code:
// Nút này sẽ nhỏ dần đi sau mỗi lần bấm cho đến khi biến mất (sau 6 lần)
// Kèm theo nhảy linh tinh quanh vùng chứa
function handleCoderClick(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  initAudio();
  playBoingSound();

  coderClickCount++;
  const messageIdx = Math.min(coderClickCount - 1, CODER_SNARK_MESSAGES.length - 1);
  showToast(CODER_SNARK_MESSAGES[messageIdx]);

  // Tính toán độ thu nhỏ: 1.0 -> 0.8 -> 0.6 -> 0.45 -> 0.3 -> 0.15 -> 0
  const scale = Math.max(0, 1 - (coderClickCount * 0.165));
  
  // Tính toán toạ độ dịch chuyển ngẫu nhiên (từ lần 2 trở đi sẽ nhảy loạn xạ)
  let randomX = 0;
  let randomY = 0;
  if (coderClickCount >= 2) {
    // Nhảy trong khoảng từ -120px đến 120px theo chiều ngang, -40px đến 40px chiều dọc
    const maxShiftX = Math.min(130, answersArena.clientWidth / 2 - 40);
    randomX = (Math.random() - 0.5) * (maxShiftX * 2);
    randomY = (Math.random() - 0.5) * 80;
  }

  // Nút Người code biến hóa
  btnCoder.style.transform = `translate(${randomX}px, ${randomY}px) scale(${scale})`;

  // Đồng thời làm nút "Thu Hà" to hơn một chút để kích thích bấm
  const haScale = 1 + (coderClickCount * 0.05);
  btnHa.style.transform = `scale(${haScale})`;

  // Nếu bấm đủ 6 lần, nút Người code biến mất hoàn toàn
  if (coderClickCount >= MAX_CODER_CLICKS || scale <= 0.05) {
    setTimeout(() => {
      btnCoder.style.opacity = '0';
      btnCoder.style.pointerEvents = 'none';
      btnCoder.style.display = 'none';
      btnHa.style.transform = 'scale(1.15)';
    }, 200);
  }
}

// Hỗ trợ cả sự kiện click và touch trên điện thoại
btnCoder.addEventListener('click', handleCoderClick);
btnCoder.addEventListener('touchstart', (e) => {
  // Khi người dùng cố chạm vào nút người code trên điện thoại
  handleCoderClick(e);
}, { passive: false });

// Sự kiện khi chọn đúng "Thu Hà"
btnHa.addEventListener('click', () => {
  initAudio();
  playCelebrationSound();

  // Bắn pháo hoa ăn mừng
  spawnConfetti(window.innerWidth / 2, window.innerHeight / 2, 45);

  const data = QUIZ_DATA[currentQuestionIndex];
  reactionText.textContent = data.winReaction;
  reactionText.style.color = '#ff477e';
  reactionText.style.fontWeight = '700';

  btnHa.style.transform = 'scale(1.15)';
  btnHa.style.pointerEvents = 'none';
  btnCoder.style.pointerEvents = 'none';

  setTimeout(() => {
    if (currentQuestionIndex < QUIZ_DATA.length - 1) {
      loadQuestion(currentQuestionIndex + 1);
    } else {
      // Hết 3 câu hỏi -> Chuyển sang trang Lời chúc
      switchScreen(screenQuiz, screenWishes);
      triggerGrandCelebration();
    }
  }, 1200);
});

// --- TRANG CUỐI: LỜI CHÚC & THẢ TIM ---
function triggerGrandCelebration() {
  // Bắn nhiều đợt pháo hoa lấp lánh mừng 20/10
  for (let i = 0; i < 4; i++) {
    setTimeout(() => {
      const posX = 0.2 + Math.random() * 0.6;
      const posY = 0.3 + Math.random() * 0.4;
      spawnConfetti(posX * window.innerWidth, posY * window.innerHeight, 50);
    }, i * 350);
  }
}

// Nút thả tim tặng Hà
btnSendLove.addEventListener('click', (e) => {
  initAudio();
  playPopSound();
  heartSendCount++;
  heartCount.textContent = `Thả tim tặng Hà (${heartSendCount})`;

  // Tạo trái tim bay lên từ vị trí bấm
  const rect = btnSendLove.getBoundingClientRect();
  const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 60;
  const y = rect.top;
  createFloatingHeart(x, y);

  // Cứ mỗi 5 lần bấm tặng thêm chùm pháo hoa mini
  if (heartSendCount % 5 === 0) {
    spawnConfetti(x, y, 25);
  }
});

function createFloatingHeart(x, y) {
  const heart = document.createElement('div');
  heart.className = 'floating-click-heart';
  const heartIcons = ['💖', '💕', '🌸', '✨', '👑', '🌷', '💐'];
  heart.textContent = heartIcons[Math.floor(Math.random() * heartIcons.length)];
  heart.style.left = `${x - 16}px`;
  heart.style.top = `${y}px`;
  document.body.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 1200);
}

// Nút chơi lại từ đầu
btnReplay.addEventListener('click', () => {
  switchScreen(screenWishes, screenIntro);
  heartSendCount = 0;
  heartCount.textContent = `Thả tim tặng Hà (0)`;
});

// ================= CANVAS HIỆU ỨNG PHÁO HOA & HOA RƠI =================
const canvas = document.getElementById('fxCanvas');
const ctx = canvas.getContext('2d');

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

// Danh sách các hạt pháo hoa & cánh hoa/trái tim trôi nền
const particles = [];
const backgroundPetals = [];

class Petal {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * width;
    this.y = -20;
    this.size = 8 + Math.random() * 12;
    this.speedY = 1 + Math.random() * 1.5;
    this.speedX = (Math.random() - 0.5) * 1.2;
    this.angle = Math.random() * Math.PI * 2;
    this.spinSpeed = (Math.random() - 0.5) * 0.04;
    this.color = ['#ffccd5', '#ffb3c1', '#ffc2d1', '#ffe5ec'][Math.floor(Math.random() * 4)];
    this.isHeart = Math.random() > 0.6;
  }
  update() {
    this.y += this.speedY;
    this.x += Math.sin(this.angle) * 0.8 + this.speedX;
    this.angle += this.spinSpeed;
    if (this.y > height + 20) {
      this.reset();
    }
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = 0.55;

    if (this.isHeart) {
      ctx.beginPath();
      const topCurveHeight = this.size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
      ctx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, (this.size + topCurveHeight) / 2, 0, this.size);
      ctx.bezierCurveTo(0, (this.size + topCurveHeight) / 2, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
      ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
      ctx.closePath();
      ctx.fill();
    } else {
      // Cánh hoa mềm
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size * 0.6, this.size, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

// Khởi tạo 25 cánh hoa nền bay nhè nhẹ
for (let i = 0; i < 25; i++) {
  const p = new Petal();
  p.y = Math.random() * height; // Rải đều khắp màn hình lúc đầu
  backgroundPetals.push(p);
}

// Bắn pháo hoa giấy (Confetti)
class ConfettiParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 9;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - 2;
    this.gravity = 0.22;
    this.size = 6 + Math.random() * 6;
    this.color = ['#ff477e', '#ff758c', '#ffd166', '#06d6a0', '#118ab2', '#a29bfe'][
      Math.floor(Math.random() * 6)
    ];
    this.alpha = 1;
    this.decay = 0.015 + Math.random() * 0.015;
    this.angle = Math.random() * Math.PI * 2;
    this.spin = (Math.random() - 0.5) * 0.2;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.vx *= 0.98;
    this.angle += this.spin;
    this.alpha -= this.decay;
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
    ctx.restore();
  }
}

function spawnConfetti(x, y, count = 35) {
  for (let i = 0; i < count; i++) {
    particles.push(new ConfettiParticle(x, y));
  }
}

// Loop render hiệu ứng liên tục
function loop() {
  ctx.clearRect(0, 0, width, height);

  // Vẽ hoa bay nền
  backgroundPetals.forEach((p) => {
    p.update();
    p.draw();
  });

  // Vẽ pháo hoa
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.update();
    p.draw();
    if (p.alpha <= 0) {
      particles.splice(i, 1);
    }
  }

  requestAnimationFrame(loop);
}

loop();
