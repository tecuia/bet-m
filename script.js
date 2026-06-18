// ============================================================
//  ПЕРЕКЛЮЧЕНИЕ ЭКРАНОВ
// ============================================================
const mainScreen = document.getElementById('main-screen');
const rulesScreen = document.getElementById('rules-screen');
const gameScreen = document.getElementById('game-screen');

const btnStart = document.querySelector('.btn-start');
const btnContinue = document.querySelector('.btn-continue');

btnStart.addEventListener('click', () => {
    mainScreen.classList.add('hidden');
    rulesScreen.classList.remove('hidden');
});

btnContinue.addEventListener('click', () => {
    rulesScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    loadEpisode(currentEpisodeIndex);
});

// ============================================================
//  ИГРОВАЯ ЛОГИКА
// ============================================================
const video = document.getElementById('game-video');
const quizOverlay = document.getElementById('quiz-overlay');
const playZone = document.getElementById('play-zone');
const resultZone = document.getElementById('result-zone');
const bonusZone = document.getElementById('bonus-zone');
const episodeCounter = document.getElementById('episode-counter');

const btnNext = document.getElementById('btn-next');
const btnActionContinue = document.getElementById('btn-action-continue');
const btnActionBonus = document.getElementById('btn-action-bonus');
const btnGetBonusFinal = document.getElementById('btn-get-bonus-final');

const resultTitle = document.getElementById('result-title');
const resultSubtitle = document.getElementById('result-subtitle');
const resultImage = document.getElementById('result-image');
const quizButtons = document.querySelectorAll('.quiz-btn');
const quizOptionsContainer = document.querySelector('.quiz-options');

const bonusTitle = document.querySelector('.bonus-title');
const bonusSubtitle = document.querySelector('.bonus-subtitle');

let currentEpisodeIndex = 0;
let selectedAnswer = null;
let isPausedForQuiz = false;
let userGuessedCorrectly = false;
let correctAnswersCount = 0;

const episodes = [
    {
        videoSrc: 'vid/video1.mp4',
        pauseTime: 4.07,
        correctAnswer: 'Гол',
        imageSrc: 'imgs/1.jpg',
        winTitle: 'ВЫ УГАДАЛИ!',
        winText: 'Ван Перси забил один из самых эффектных голов <br class="mobile-break">ЧМ-2014 — ударом головой в прыжке<br>в матче Нидерланды — Испания',
        loseTitle: 'Почти, но момент оказался хитрее',
        loseText: 'Ван Перси выбрал неожиданное продолжение<br>и забил легендарный головой в прыжке<br>на ЧМ-2014'
    },
    {
        videoSrc: 'vid/video2.mp4',
        pauseTime: 1.5,
        correctAnswer: 'Сейв',
        imageSrc: 'imgs/2.jpg',
        winTitle: 'ВЫ УГАДАЛИ!',
        winText: 'Касильяс совершил один из самых важных<br>сейвов ЧМ-2010 — отбил удар Роббена ногой<br>в финале Испания — Нидерланды',
        loseTitle: 'Почти, но момент оказался хитрее',
        loseText: 'Касильяс успел среагировать в один из самых<br>напряжённых моментов финала ЧМ-2010<br>и отбил удар Роббена ногой'
    },
    {
        videoSrc: 'vid/video3.mp4',
        pauseTime: 3.5,
        correctAnswer: 'Гол',
        imageSrc: 'imgs/3.jpg',
        winTitle: 'ВЫ УГАДАЛИ!',
        winText: 'Мбаппе забил один из самых ярких голов<br>ЧМ-2022 — ударом с лёта в финале<br>Аргентина — Франция',
        loseTitle: 'Почти, но момент оказался хитрее',
        loseText: 'Мбаппе выбрал эффектное продолжение атаки<br>и забил с лёта в финале ЧМ-2022,<br>вернув Францию в игру'
    }
];

function loadEpisode(index) {
    if (index >= episodes.length) {
        showBonusScreen(true);
        return;
    }

    const episode = episodes[index];
    episodeCounter.textContent = `${index + 1}/${episodes.length}`;

    quizOverlay.classList.add('hidden');
    resultZone.classList.add('hidden');
    bonusZone.classList.add('hidden');
    playZone.classList.remove('hidden');

    // Принудительно скрываем обе кнопки (на случай, если они остались от предыдущего результата)
    btnActionContinue.classList.add('hidden');
    btnActionBonus.classList.add('hidden');

    selectedAnswer = null;
    isPausedForQuiz = false;
    userGuessedCorrectly = false;
    quizButtons.forEach(btn => btn.classList.remove('selected'));

    if (episode.noVideo) {
        video.src = '';
        isPausedForQuiz = true;
        quizOverlay.classList.remove('hidden');
    } else {
        video.src = episode.videoSrc;
        video.currentTime = 0;
        video.load();
        video.play();
    }
}

video.addEventListener('timeupdate', () => {
    const episode = episodes[currentEpisodeIndex];
    if (episode.noVideo) return;

    if (!isPausedForQuiz && video.currentTime >= episode.pauseTime) {
        video.pause();
        isPausedForQuiz = true;
        quizOverlay.classList.remove('hidden');
    }
});

video.addEventListener('ended', () => {
    showResultScreen();
});

quizOptionsContainer.addEventListener('click', (e) => {
    const clickedBtn = e.target.closest('.quiz-btn');
    if (!clickedBtn) return;

    quizButtons.forEach(btn => btn.classList.remove('selected'));
    clickedBtn.classList.add('selected');
    selectedAnswer = clickedBtn.dataset.answer;
});

btnNext.addEventListener('click', () => {
    if (!selectedAnswer) return;

    const episode = episodes[currentEpisodeIndex];
    userGuessedCorrectly = (selectedAnswer === episode.correctAnswer);

    if (userGuessedCorrectly) {
        correctAnswersCount++;
    }

    quizOverlay.classList.add('hidden');

    if (episode.noVideo) {
        showResultScreen();
    } else {
        video.play();
    }
});

function showResultScreen() {
    const episode = episodes[currentEpisodeIndex];
    resultImage.src = episode.imageSrc;
    playZone.classList.add('hidden');

    resultTitle.innerHTML = userGuessedCorrectly ? episode.winTitle : episode.loseTitle;
    resultSubtitle.innerHTML = userGuessedCorrectly ? episode.winText : episode.loseText;

    if (currentEpisodeIndex === episodes.length - 1) {
        btnActionContinue.classList.add('hidden');
        btnActionBonus.classList.remove('hidden');
    } else {
        btnActionContinue.classList.remove('hidden');
        if (userGuessedCorrectly) {
            btnActionBonus.classList.remove('hidden');
        } else {
            btnActionBonus.classList.add('hidden');
        }
    }

    resultZone.classList.remove('hidden');
}

function showBonusScreen(isFinishedAllRounds = false) {
    playZone.classList.add('hidden');
    resultZone.classList.add('hidden');

    if (!isFinishedAllRounds) {
        bonusTitle.innerHTML = 'БОНУС ЖДЁТ ТЕБЯ';
        bonusSubtitle.innerHTML = 'Переходи на сайт Бет-М, забирай фрибет и делай просмотр матчей ярче';
    } else {
        if (correctAnswersCount === 3) {
            bonusTitle.innerHTML = 'ИДЕАЛЬНОЕ ПОПАДАНИЕ';
            bonusSubtitle.innerHTML = 'Три из трёх: ты угадал все развязки легендарных моментов ЧМ!<br>Забирай бонус от Бет-М';
        } else if (correctAnswersCount === 2) {
            bonusTitle.innerHTML = 'ВЫ ХОРОШО<br class="mobile-break"> ЧИТАЕТЕ ИГРУ';
            bonusSubtitle.innerHTML = 'Два точных прогноза из трёх — сильный <br class="mobile-break"> результат. Забирай бонус от Бет-М <br> и продолжай следить за матчами';
        } else if (correctAnswersCount === 1) {
            bonusTitle.innerHTML = 'БОНУС ЖДЁТ ТЕБЯ';
            bonusSubtitle.innerHTML = 'Один точный прогноз из трёх. Забирай бонус от Бет-М и продолжай следить за матчами';
        } else {
            bonusTitle.innerHTML = 'Футбол умеет удивлять';
            bonusSubtitle.innerHTML = 'Забирайте приз от Бет-М и смотрите матчи с большим интересом';
        }
    }

    bonusZone.classList.remove('hidden');
}

btnActionContinue.addEventListener('click', () => {
    currentEpisodeIndex++;
    loadEpisode(currentEpisodeIndex);
});

btnActionBonus.addEventListener('click', () => {
    const isFinished = (currentEpisodeIndex === episodes.length - 1);
    showBonusScreen(isFinished);
});

btnGetBonusFinal.addEventListener('click', () => {
    window.location.href = 'https://tracker.betmpartners.ru/link?btag=100226937_498568';
});