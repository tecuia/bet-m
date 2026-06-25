// ============================================================
//  ПОСЛЕДОВАТЕЛЬНЫЙ ПРЕЛОАДЕР ВИДЕО (С ИСПОЛЬЗОВАНИЕМ КЕША)
// ============================================================
const preloaderScreen = document.getElementById('preloader-screen');
const preloaderProgress = document.getElementById('preloader-progress');
const preloaderPercent = document.getElementById('preloader-percent');
const appContent = document.getElementById('app-content');

const episodes = [
    {
        videoSrc: 'vid/video1.mp4',
        pauseTime: 4.07,
        correctAnswer: 'Гол',
        imageSrc: 'imgs/1.jpg',
        winTitle: 'ТЫ УГАДАЛ!',
        winText: 'Ван Перси забил один из самых эффектных голов <br class="mobile-break">ЧМ-2014 —&nbsp;ударом головой в&nbsp;прыжке в&nbspматче Нидерланды —&nbsp;Испания',
        loseTitle: 'Почти, но момент оказался хитрее',
        loseText: 'Ван Перси выбрал неожиданное продолжение и&nbsp;забил легендарный гол головой в&nbsp;прыжке на&nbsp;ЧМ-2014'
    },
    {
        videoSrc: 'vid/video2.mp4',
        pauseTime: 4.3,
        correctAnswer: 'Сейв',
        imageSrc: 'imgs/2.jpg',
        winTitle: 'ТЫ УГАДАЛ!',
        winText: 'Касильяс совершил один из самых важных<br>сейвов ЧМ-2010&nbsp;—&nbsp;отбил удар Роббена ногой<br>в&nbsp;финале Испания —&nbsp;Нидерланды',
        loseTitle: 'Почти, но момент оказался хитрее',
        loseText: 'Касильяс успел среагировать в один из самых<br>напряжённых моментов финала ЧМ-2010<br>и отбил удар Роббена ногой'
    },
    {
        videoSrc: 'vid/video3.mp4',
        pauseTime: 3.5,
        correctAnswer: 'Гол',
        imageSrc: 'imgs/3.jpg',
        winTitle: 'ТЫ УГАДАЛ!',
        winText: 'Мбаппе забил один из самых ярких голов<br>ЧМ-2022 — ударом с&nbsp;лёта в&nbsp;финале<br>Аргентина — Франция',
        loseTitle: 'Почти, но момент оказался хитрее',
        loseText: 'Мбаппе выбрал эффектное продолжение атаки<br>и забил с&nbsp;лёта в&nbsp;финале ЧМ-2022,<br>вернув Францию в игру'
    }
];

// Хранилище для blob URL загруженных видео
const videoBlobCache = {};

// Функция загрузки видео через fetch и создание blob URL
async function loadVideoAsBlob(src) {
    // Убираем #t=0.001 для корректной загрузки
    const cleanSrc = src.split('#')[0];
    
    // Если уже есть blob URL - возвращаем его
    if (videoBlobCache[cleanSrc]) {
        return videoBlobCache[cleanSrc];
    }

    try {
        const response = await fetch(cleanSrc);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        videoBlobCache[cleanSrc] = blobUrl;
        return blobUrl;
    } catch (error) {
        console.error('Error loading video:', error);
        return null;
    }
}

// Обновление прогресс-бара
function updatePreloaderProgress(current, total) {
    const percent = Math.round((current / total) * 100);
    preloaderProgress.style.width = percent + '%';
    preloaderPercent.textContent = percent + '%';
}

// Последовательная загрузка всех видео
async function preloadAllVideosSequentially() {
    const videosToLoad = episodes.filter(ep => ep.videoSrc);
    const totalVideos = videosToLoad.length;
    
    // Этап 1: Загружаем только первое видео
    updatePreloaderProgress(0, totalVideos);
    preloaderPercent.textContent = 'Загрузка игры...';
    
    if (videosToLoad.length > 0) {
        const cleanSrc = videosToLoad[0].videoSrc.split('#')[0];
        await loadVideoAsBlob(cleanSrc);
        updatePreloaderProgress(1, totalVideos);
    }
    
    // Показываем страницу после загрузки первого видео
    showApp();
    
    // Этап 2: Загружаем остальные видео последовательно в фоне
    for (let i = 1; i < videosToLoad.length; i++) {
        const cleanSrc = videosToLoad[i].videoSrc.split('#')[0];
        await loadVideoAsBlob(cleanSrc);
        updatePreloaderProgress(i + 1, totalVideos);
        
        // Небольшая пауза между загрузками для стабильности
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log('Все видео загружены');
}

// Показ приложения
function showApp() {
    preloaderScreen.style.opacity = '0';
    preloaderScreen.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        preloaderScreen.style.display = 'none';
        appContent.classList.remove('hidden');
    }, 300);
}

// Запуск инициализации
preloadAllVideosSequentially();

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

function loadEpisode(index) {
    if (index >= episodes.length) {
        showBonusScreen(true);
        return;
    }

    const episode = episodes[index];
    episodeCounter.textContent = `${index + 1}/${episodes.length}`;

    quizOverlay.classList.add('hidden');
    quizOverlay.classList.remove('active');
    resultZone.classList.add('hidden');
    
    document.querySelector('.result-info').classList.remove('active');
    document.querySelector('.result-media').classList.remove('active');
    bonusZone.classList.add('hidden');
    playZone.classList.remove('hidden');
    playZone.classList.add('active');

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
        quizOverlay.classList.add('active');
    } else {
        // Используем blob URL из кеша для мгновенного воспроизведения
        const cleanSrc = episode.videoSrc.split('#')[0];
        const blobUrl = videoBlobCache[cleanSrc];
        
        if (blobUrl) {
            // Если видео уже загружено - используем blob URL
            video.src = blobUrl;
            video.currentTime = 0;
            video.play().catch(err => {
                console.warn('Autoplay prevented:', err);
            });
        } else {
            // Если видео еще не загружено - используем обычный URL
            console.warn('Видео еще не загружено, используем прямую ссылку');
            video.src = episode.videoSrc;
            video.currentTime = 0;
            video.play().catch(err => {
                console.warn('Autoplay prevented:', err);
            });
        }
    }
}

video.addEventListener('timeupdate', () => {
    const episode = episodes[currentEpisodeIndex];
    if (episode.noVideo) return;

    if (!isPausedForQuiz && video.currentTime >= episode.pauseTime) {
        video.pause();
        isPausedForQuiz = true;
        quizOverlay.classList.remove('hidden');
        quizOverlay.classList.add('active');
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
    quizOverlay.classList.remove('active');

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
    playZone.classList.remove('active');

    resultTitle.innerHTML = userGuessedCorrectly ? episode.winTitle : episode.loseTitle;
    resultSubtitle.innerHTML = userGuessedCorrectly ? episode.winText : episode.loseText;

    if (currentEpisodeIndex === episodes.length - 1) {
        btnActionContinue.classList.add('hidden');
        btnActionBonus.classList.remove('hidden');
    } else {
        btnActionContinue.classList.remove('hidden');
        if (correctAnswersCount >= 1) {
            btnActionBonus.classList.remove('hidden');
        } else {
            btnActionBonus.classList.add('hidden');
        }
    }

    resultZone.classList.remove('hidden');
    document.querySelector('.result-info').classList.add('active');
    document.querySelector('.result-media').classList.add('active');
}

function showBonusScreen(isFinishedAllRounds = false) {
    playZone.classList.add('hidden');
    playZone.classList.remove('active');
    resultZone.classList.add('hidden');
    document.querySelector('.result-info').classList.remove('active');
    document.querySelector('.result-media').classList.remove('active');

    if (!isFinishedAllRounds) {
        bonusTitle.innerHTML = 'БОНУС ЖДЁТ ТЕБЯ';
        bonusSubtitle.innerHTML =
            'на первый депозит от Бет-М <br> и делай просмотр матчей ярче';
    } else {
        if (correctAnswersCount === 3) {
            bonusTitle.innerHTML = 'ИДЕАЛЬНОЕ<br class="mobile-break"> ПОПАДАНИЕ';
            bonusSubtitle.innerHTML = 'на первый депозит от Бет-М <br> и смотри матчи с большим интересом';
        } else if (correctAnswersCount === 2) {
            bonusTitle.innerHTML = 'ТЫ ХОРОШО<br class="mobile-break"> ЧИТАЕШЬ ИГРУ';
            bonusSubtitle.innerHTML = 'на первый депозит от Бет-М <br и продолжай следить за матчами';
        } else if (correctAnswersCount === 1) {
            bonusTitle.innerHTML = 'ФУТБОЛ УМЕЕТ УДИВЛЯТЬ';
            bonusSubtitle.innerHTML = 'на первый депозит от Бет-М <br> и смотри матчи с большим интересом';
        } else {
            bonusTitle.innerHTML = 'БОНУС ЖДЁТ ТЕБЯ';
            bonusSubtitle.innerHTML = 'на первый депозит от Бет-М <br и делай просмотр матчей ярче';
        }
    }

    bonusZone.classList.remove('hidden');
    bonusZone.classList.add('active');
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

// Очистка blob URL при уходе со страницы
window.addEventListener('beforeunload', () => {
    Object.values(videoBlobCache).forEach(blobUrl => {
        URL.revokeObjectURL(blobUrl);
    });
});