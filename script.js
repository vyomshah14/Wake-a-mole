let holes = document.querySelectorAll('.hole');
let scoreDisplay = document.getElementById('score');
let highScoreDisplay = document.getElementById('high-score');
let timerDisplay = document.getElementById('timer-value');
let timerBar = document.getElementById('timer-bar-fill');

let score = 0;
let highScore = localStorage.getItem('wack-a-mole-highscore') || 0;
highScoreDisplay.innerText = highScore;

let gameInterval = null;
let countdownInterval = null;
let moleIndex = -1;
let timeLeft = 30; // 30 seconds game
let isGameActive = false;
let speed = 800; // Medium default
let soundEnabled = true;

// Web Audio API Synth Sound Effects
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playSound(type) {
    if (!soundEnabled) return;
    initAudio();
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if (type === 'hit') {
            // High-pitched pop/coin sound
            osc.type = 'sine';
            osc.frequency.setValueAtTime(500, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.08);
            gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.08);
        } else if (type === 'miss') {
            // Low error feedback buzzer sound
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(180, audioCtx.currentTime);
            osc.frequency.linearRampToValueAtTime(100, audioCtx.currentTime + 0.12);
            gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.12);
        } else if (type === 'start') {
            // Retro synth startup tune
            const notes = [261.63, 329.63, 392.00, 523.25];
            notes.forEach((freq, i) => {
                const o = audioCtx.createOscillator();
                const g = audioCtx.createGain();
                o.connect(g);
                g.connect(audioCtx.destination);
                o.type = 'triangle';
                o.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.07);
                g.gain.setValueAtTime(0.08, audioCtx.currentTime + i * 0.07);
                g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.07 + 0.15);
                o.start(audioCtx.currentTime + i * 0.07);
                o.stop(audioCtx.currentTime + i * 0.07 + 0.15);
            });
        } else if (type === 'gameover') {
            // Descending arcade finish melody
            const notes = [523.25, 392.00, 329.63, 261.63];
            notes.forEach((freq, i) => {
                const o = audioCtx.createOscillator();
                const g = audioCtx.createGain();
                o.connect(g);
                g.connect(audioCtx.destination);
                o.type = 'sawtooth';
                o.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.1);
                g.gain.setValueAtTime(0.06, audioCtx.currentTime + i * 0.1);
                g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.1 + 0.2);
                o.start(audioCtx.currentTime + i * 0.1);
                o.stop(audioCtx.currentTime + i * 0.1 + 0.2);
            });
        }
    } catch (e) {
        console.warn("Audio context not initialized", e);
    }
}

// Set difficulty level
function setDifficulty(lvl) {
    if (isGameActive) return; // Block difficulty changes mid-game
    document.querySelectorAll('.diff-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`diff-${lvl}`).classList.add('active');
    
    if (lvl === 'easy') speed = 1100;
    else if (lvl === 'medium') speed = 800;
    else if (lvl === 'hard') speed = 520;
}

// Toggle sound effects
function toggleSound() {
    soundEnabled = !soundEnabled;
    const btn = document.getElementById('sound-toggle');
    if (soundEnabled) {
        btn.innerHTML = '🔊';
        btn.classList.remove('muted');
        initAudio();
    } else {
        btn.innerHTML = '🔇';
        btn.classList.add('muted');
    }
}

// Start the game
function startGame() {
    initAudio();
    if (isGameActive) return;
    isGameActive = true;
    score = 0;
    timeLeft = 30;
    scoreDisplay.innerText = score;
    timerDisplay.innerText = timeLeft + 's';
    timerBar.style.width = '100%';
    
    playSound('start');

    if (gameInterval) clearInterval(gameInterval);
    if (countdownInterval) clearInterval(countdownInterval);

    holes.forEach(h => {
        h.innerHTML = '';
        h.classList.remove('has-mole', 'wacked');
    });

    gameInterval = setInterval(showMole, speed);
    countdownInterval = setInterval(updateTimer, 1000);
}

// Stop the game
function stopGame(isTimeUp = false) {
    if (!isGameActive) return;
    isGameActive = false;

    clearInterval(gameInterval);
    clearInterval(countdownInterval);

    holes.forEach(h => {
        h.innerHTML = '';
        h.classList.remove('has-mole');
    });
    moleIndex = -1;

    playSound('gameover');

    if (isTimeUp) {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('wack-a-mole-highscore', highScore);
            highScoreDisplay.innerText = highScore;
            setTimeout(() => {
                alert(`🏆 NEW HIGH SCORE! You whacked ${score} moles!`);
            }, 100);
        } else {
            setTimeout(() => {
                alert(`Game Over! You whacked ${score} moles.`);
            }, 100);
        }
    }
    
    timerDisplay.innerText = '0s';
    timerBar.style.width = '0%';
}

// Spawns a mole in a random hole
function showMole() {
    holes.forEach(h => {
        h.innerHTML = '';
        h.classList.remove('has-mole', 'wacked');
    });

    if (!isGameActive) return;

    let nextIndex;
    do {
        nextIndex = Math.floor(Math.random() * 9);
    } while (nextIndex === moleIndex); // Always pick a different hole

    moleIndex = nextIndex;
    holes[moleIndex].innerHTML = '<span class="mole">🦔</span>';
    holes[moleIndex].classList.add('has-mole');
}

// Update game countdown timer
function updateTimer() {
    timeLeft--;
    timerDisplay.innerText = timeLeft + 's';
    const percent = (timeLeft / 30) * 100;
    timerBar.style.width = percent + '%';

    if (timeLeft <= 0) {
        stopGame(true);
    }
}

// Event listeners for hitting moles
holes.forEach((hole, index) => {
    hole.addEventListener('click', () => {
        if (!isGameActive) return;

        if (index === moleIndex) {
            score++;
            scoreDisplay.innerText = score;
            playSound('hit');

            hole.classList.remove('has-mole');
            hole.classList.add('wacked');
            hole.innerHTML = '';
            moleIndex = -1;

            if (score > highScore) {
                highScore = score;
                localStorage.setItem('wack-a-mole-highscore', highScore);
                highScoreDisplay.innerText = highScore;
            }
        } else {
            playSound('miss');
        }
    });
});
