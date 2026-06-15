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
let correctAnswersCount = 0; // Счетчик правильных ответов

const episodes = [
    {
        videoSrc: 'vid/video1.mp4',
        pauseTime: 5.0, 
        correctAnswer: 'Гол',
        imageSrc: 'imgs/1.png',
        winTitle: 'ВЫ УГАДАЛИ!',
        winText: 'Ван Перси забил один из самых эффектных голов ЧМ-2014 — ударом головой в прыжке в матче Нидерланды — Испания',
        loseTitle: 'Почти, но момент оказался хитрее',
        loseText: 'Ван Перси выбрал неожиданное продолжение и забил легендарный головой в прыжке на ЧМ-2014'
    },
    {
        videoSrc: 'vid/video2.mp4',
        pauseTime: 3.4,
        correctAnswer: 'Сейв',
        imageSrc: 'imgs/2.png',
        winTitle: 'ВЫ УГАДАЛИ!',
        winText: 'Касильяс совершил один из самых важных сейвов ЧМ-2010 — отбил удар Роббена ногой в финале Испания — Нидерланды',
        loseTitle: 'Почти, но момент оказался хитрее',
        loseText: 'Касильяс успел среагировать в один из самых напряжённых моментов финала ЧМ-2010 и отбил удар Роббена ногой'
    },
    {
        videoSrc: 'vid/video3.mp4',
        pauseTime: 6.0,
        correctAnswer: 'Гол',
        imageSrc: 'imgs/3.png',
        winTitle: 'ВЫ УГАДАЛИ!',
        winText: 'Мбаппе забил один из самых ярких голов ЧМ-2022 — ударом с лёта в финале Аргентина — Франция',
        loseTitle: 'Почти, но момент оказался хитрее',
        loseText: 'Мбаппе выбрал эффектное продолжение атаки и забил с лёта в финале ЧМ-2022, вернув Францию в игру'
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
    
    selectedAnswer = null;
    isPausedForQuiz = false;
    
    quizButtons.forEach(btn => btn.classList.remove('selected'));
    
    if (episode.noVideo) {
        video.src = '';
        isPausedForQuiz = true;
        quizOverlay.classList.remove('hidden');
    } else {
        video.src = episode.videoSrc;
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

    resultTitle.textContent = userGuessedCorrectly ? episode.winTitle : episode.loseTitle;
    resultSubtitle.textContent = userGuessedCorrectly ? episode.winText : episode.loseText;

    // Проверка: если это последний эпизод (индекс 2)
    if (currentEpisodeIndex === episodes.length - 1) {
        btnActionContinue.classList.add('hidden'); // Убираем кнопку "Продолжить"
        btnActionBonus.classList.remove('hidden');   // Оставляем только кнопку "Забрать бонус"
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
        // Если игрок нажал "Забрать бонус" раньше времени (не дойдя до конца)
        bonusTitle.textContent = 'БОНУС ЖДЁТ ТЕБЯ';
        bonusSubtitle.textContent = 'Переходи на сайт Бет-М, забирай фрибет и делай просмотр матчей ярче';
    } else {
        // Игрок дошел до самого конца, проверяем количество правильных прогнозов
        if (correctAnswersCount === 3) {
            bonusTitle.textContent = 'ИДЕАЛЬНОЕ ПОПАДАНИЕ';
            bonusSubtitle.textContent = 'Три из трёх: ты угадал все развязки легендарных моментов ЧМ! Забирай бонус от Бет-М';
        } else if (correctAnswersCount === 2) {
            bonusTitle.textContent = 'ВЫ ХОРОШО ЧИТАЕТЕ ИГРУ';
            bonusSubtitle.textContent = 'Два точных прогноза из трёх — сильный результат. Забирай бонус от Бет-М и продолжай следить за матчами';
        } else if (correctAnswersCount === 1) {
            bonusTitle.textContent = 'БОНУС ЖДЁТ ТЕБЯ';
            bonusSubtitle.textContent = 'Один точный прогноз из трёх. Забирай бонус от Бет-М и продолжай следить за матчами';
        } else {
            bonusTitle.textContent = 'Футбол умеет удивлять';
            bonusSubtitle.textContent = 'Забирайте приз от Бет-М и смотрите матчи с большим интересом';
        }
    }

    bonusZone.classList.remove('hidden');
}

btnActionContinue.addEventListener('click', () => {
    currentEpisodeIndex++;
    loadEpisode(currentEpisodeIndex);
});

btnActionBonus.addEventListener('click', () => {
    // Определяем, кликнули ли по бонусу в самом конце или посреди игры
    const isFinished = (currentEpisodeIndex === episodes.length - 1);
    showBonusScreen(isFinished);
});

btnGetBonusFinal.addEventListener('click', () => {
    window.location.href = 'https://tracker.betmpartners.ru/link?btag=100226937_498568';
});

document.addEventListener('DOMContentLoaded', () => {
    loadEpisode(currentEpisodeIndex);
});