// ===============================
// INITIALIZE CONFIG
// ===============================
const config = window.VALENTINE_CONFIG;

// ===============================
// VALIDATE CONFIG
// ===============================
function validateConfig() {
    const warnings = [];

    if (!config || !config.valentineName) {
        warnings.push("Valentine's name not set. Using default.");
        config.valentineName = "Moi Moi";
    }

    const isValidHex = (hex) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);

    if (config.colors) {
        Object.entries(config.colors).forEach(([key, value]) => {
            if (!isValidHex(value)) {
                warnings.push(`Invalid color for ${key}. Using default.`);
                config.colors[key] = getDefaultColor(key);
            }
        });
    }

    if (parseFloat(config.animations.floatDuration) < 5) {
        config.animations.floatDuration = "5s";
    }

    if (
        config.animations.heartExplosionSize < 1 ||
        config.animations.heartExplosionSize > 3
    ) {
        config.animations.heartExplosionSize = 1.5;
    }

    if (warnings.length > 0) {
        console.warn("⚠️ Config Warnings:");
        warnings.forEach(w => console.warn(w));
    }
}

// ===============================
// DEFAULT COLORS
// ===============================
function getDefaultColor(key) {
    const defaults = {
        backgroundStart: "#ffafbd",
        backgroundEnd: "#ffc3a0",
        buttonBackground: "#ff6b6b",
        buttonHover: "#ff8787",
        textColor: "#ff4757"
    };
    return defaults[key];
}

// ===============================
// PAGE INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    validateConfig();

    if (config.pageTitle) {
        document.title = config.pageTitle;
    }

    // Text Setup
    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };

    setText("valentineTitle", `${config.valentineName}, my love...`);

    setText("question1Text", config.questions.first.text);
    setText("yesBtn1", config.questions.first.yesBtn);
    setText("noBtn1", config.questions.first.noBtn);
    setText("secretAnswerBtn", config.questions.first.secretAnswer);

    setText("question2Text", config.questions.second.text);
    setText("startText", config.questions.second.startText);
    setText("nextBtn", config.questions.second.nextBtn);

    setText("question3Text", config.questions.third.text);
    setText("yesBtn3", config.questions.third.yesBtn);
    setText("noBtn3", config.questions.third.noBtn);

    createFloatingElements();
    setupMusicPlayer();
    setupButtons();
    setupLoveMeter();
});

// ===============================
// FLOATING EMOJIS
// ===============================
function createFloatingElements() {
    const container = document.querySelector(".floating-elements");
    if (!container) return;

    [...config.floatingEmojis.hearts, ...config.floatingEmojis.bears].forEach(emoji => {
        const div = document.createElement("div");
        div.className = "floating";
        div.innerHTML = emoji;
        setRandomPosition(div);
        container.appendChild(div);
    });
}

function setRandomPosition(element) {
    element.style.left = Math.random() * 100 + "vw";
    element.style.animationDelay = Math.random() * 5 + "s";
    element.style.animationDuration = 10 + Math.random() * 20 + "s";
}

// ===============================
// BUTTON FLOW
// ===============================
function setupButtons() {
    const yesBtn1 = document.getElementById("yesBtn1");
    const noBtn1 = document.getElementById("noBtn1");
    const nextBtn = document.getElementById("nextBtn");
    const yesBtn3 = document.getElementById("yesBtn3");
    const noBtn3 = document.getElementById("noBtn3");

    if (yesBtn1) yesBtn1.onclick = () => showNextQuestion(2);
    if (nextBtn) nextBtn.onclick = () => showNextQuestion(3);
    if (yesBtn3) yesBtn3.onclick = celebrate;

    if (noBtn1) {
        noBtn1.onmouseover = () => moveButton(noBtn1);
        noBtn1.onclick = () => moveButton(noBtn1);
    }

    if (noBtn3) {
        noBtn3.onmouseover = () => moveButton(noBtn3);
        noBtn3.onclick = () => moveButton(noBtn3);
    }
}

function showNextQuestion(num) {
    document.querySelectorAll(".question-section").forEach(q =>
        q.classList.add("hidden")
    );
    const next = document.getElementById(`question${num}`);
    if (next) next.classList.remove("hidden");
}

function moveButton(button) {
    const x = Math.random() * (window.innerWidth - button.offsetWidth);
    const y = Math.random() * (window.innerHeight - button.offsetHeight);
    button.style.position = "fixed";
    button.style.left = x + "px";
    button.style.top = y + "px";
}

// ===============================
// LOVE METER
// ===============================
function setupLoveMeter() {
    const loveMeter = document.getElementById("loveMeter");
    const loveValue = document.getElementById("loveValue");
    const extraLove = document.getElementById("extraLove");

    if (!loveMeter) return;

    loveMeter.value = 100;
    if (loveValue) loveValue.textContent = 100;

    loveMeter.addEventListener("input", () => {
        const value = parseInt(loveMeter.value);
        if (loveValue) loveValue.textContent = value;

        if (!extraLove) return;

        if (value > 100) {
            extraLove.classList.remove("hidden");

            if (value >= 5000) {
                extraLove.textContent = config.loveMessages.extreme;
            } else if (value > 1000) {
                extraLove.textContent = config.loveMessages.high;
            } else {
                extraLove.textContent = config.loveMessages.normal;
            }
        } else {
            extraLove.classList.add("hidden");
        }
    });
}

// ===============================
// CELEBRATION
// ===============================
function celebrate() {
    document.querySelectorAll(".question-section").forEach(q =>
        q.classList.add("hidden")
    );

    const celebration = document.getElementById("celebration");
    if (!celebration) return;

    celebration.classList.remove("hidden");

    document.getElementById("celebrationTitle").textContent =
        config.celebration.title;
    document.getElementById("celebrationMessage").textContent =
        config.celebration.message;
    document.getElementById("celebrationEmojis").textContent =
        config.celebration.emojis;

    createHeartExplosion();
}

function createHeartExplosion() {
    const container = document.querySelector(".floating-elements");
    if (!container) return;

    for (let i = 0; i < 50; i++) {
        const heart = document.createElement("div");
        heart.className = "floating";
        heart.innerHTML =
            config.floatingEmojis.hearts[
                Math.floor(Math.random() * config.floatingEmojis.hearts.length)
            ];
        setRandomPosition(heart);
        container.appendChild(heart);
    }
}

// ===============================
// MUSIC
// ===============================
function setupMusicPlayer() {
    if (!config.music.enabled) return;

    const musicToggle = document.getElementById("musicToggle");
    const bgMusic = document.getElementById("bgMusic");
    const musicSource = document.getElementById("musicSource");

    if (!bgMusic || !musicSource) return;

    musicSource.src = config.music.musicUrl;
    bgMusic.volume = config.music.volume || 0.5;
    bgMusic.load();

    if (config.music.autoplay) {
        bgMusic.play().catch(() => {
            if (musicToggle) {
                musicToggle.textContent = config.music.startText;
            }
        });
    }

    if (musicToggle) {
        musicToggle.onclick = () => {
            if (bgMusic.paused) {
                bgMusic.play();
                musicToggle.textContent = config.music.stopText;
            } else {
                bgMusic.pause();
                musicToggle.textContent = config.music.startText;
            }
        };
    }
}
