const btnStart = document.querySelector('.btn-start');
const btnContinue = document.querySelector('.btn-continue');
const mainScreen = document.getElementById('main-screen');
const rulesScreen = document.getElementById('rules-screen');

btnStart.addEventListener('click', () => {
    mainScreen.classList.add('hidden');
    rulesScreen.classList.remove('hidden');
});

btnContinue.addEventListener('click', () => {
    window.location.href = 'mechanics.html';
});