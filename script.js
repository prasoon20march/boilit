let selectedBoilType = 'soft';
let selectedTime = 6;
let timerInterval = null;
let timeRemaining = 0;
let totalTime = 0;

const numEggsInput = document.getElementById('numEggs');
const waterAmountText = document.getElementById('waterAmount');
const boilButtons = document.querySelectorAll('.boil-btn');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const setupScreen = document.getElementById('setupScreen');
const timerScreen = document.getElementById('timerScreen');
const timeText = document.getElementById('timeText');
const timerInfo = document.getElementById('timerInfo');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

let alarmAudio = null;

function calculateWater() {
    const numEggs = parseInt(numEggsInput.value) || 1;
    const waterCups = numEggs * 0.5; // 0.5 cups per egg
    waterAmountText.textContent = waterCups + ' cups';
}

numEggsInput.addEventListener('input', calculateWater);

boilButtons.forEach(button => {
    button.addEventListener('click', function() {
        boilButtons.forEach(btn => btn.classList.remove('active'));
        
        this.classList.add('active');
        
        selectedBoilType = this.getAttribute('data-type');
        selectedTime = parseInt(this.getAttribute('data-time'));
    });
});

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return minutes + ':' + (secs < 10 ? '0' : '') + secs;
}

function startTimer() {
    const numEggs = parseInt(numEggsInput.value) || 1;
    
    totalTime = selectedTime * 60;
    timeRemaining = totalTime;
    
    const boilTypeName = selectedBoilType.charAt(0).toUpperCase() + selectedBoilType.slice(1);
    timerInfo.textContent = boilTypeName + ' Boiled • ' + numEggs + ' egg' + (numEggs > 1 ? 's' : '');
    
    setupScreen.classList.add('hidden');
    timerScreen.classList.remove('hidden');
    
    updateTimerDisplay();
    
    timerInterval = setInterval(function() {
        timeRemaining--;
        
        if (timeRemaining <= 0) {
            stopTimer();
            showNotification();
        } else {
            updateTimerDisplay();
        }
    }, 1000);
}

function updateTimerDisplay() {
    timeText.textContent = formatTime(timeRemaining);
    
    const progress = ((totalTime - timeRemaining) / totalTime) * 100;
    progressFill.style.width = progress + '%';
    progressText.textContent = Math.round(progress) + '% Complete';
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    timeRemaining = 0;
    
    setupScreen.classList.remove('hidden');
    timerScreen.classList.add('hidden');
    
    progressFill.style.width = '0%';
}

function playSound() {
    if (!alarmAudio) {
        alarmAudio = new Audio('https://cdn.pixabay.com/download/audio/2024/08/08/audio_68dd4e0ef3.mp3');
        alarmAudio.loop = true;
        alarmAudio.volume = 0.5;
    }
    
    alarmAudio.play().catch(error => {
        console.log('Audio play failed:', error);
    });
}

function stopSound() {
    if (alarmAudio) {
        alarmAudio.pause();
        alarmAudio.currentTime = 0;
    }
}

function showNotification() {
    playSound();
    alert('🎉 Your eggs are ready!');
    stopSound();
}

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);

calculateWater();