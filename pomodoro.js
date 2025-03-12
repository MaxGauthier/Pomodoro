document.addEventListener('DOMContentLoaded', () => {
    const timerDisplay = document.getElementById('timer');
    const startBtn = document.getElementById('start');
    const pauseBtn = document.getElementById('pause');
    const resetBtn = document.getElementById('reset');
    const pomodoroBtn = document.getElementById('pomodoro');
    const shortBreakBtn = document.getElementById('short-break');
    const longBreakBtn = document.getElementById('long-break');
    const slider = document.getElementById('startTimeRange');
    const sessionsDisplay = document.getElementById('sessions');

    let countdown;
    let isRunning = false;
    let timeLeft;
    let sessionsCount = 0;
    let currentMode = 'pomodoro';

    // Default values
    let pomodoroTime = 25;
    let shortBreakTime = 5;
    let longBreakTime = 15;

    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        const seconds = (timeLeft % 60).toString().padStart(2, '0');
        timerDisplay.textContent = `${minutes}:${seconds}`;
    }

    function startTimer() {
        if (isRunning) return;
        isRunning = true;

        countdown = setInterval(() => {
            timeLeft--;
            updateDisplay();

            if (timeLeft <= 0) {
                completeTimer();
            }
        }, 1000);
    }

    function pauseTimer() {
        clearInterval(countdown);
        isRunning = false;
    }

    function resetTimer() {
        pauseTimer();
        setTimeByMode(currentMode);
    }

    function completeTimer() {
        pauseTimer();
        if (currentMode === 'pomodoro') {
            sessionsCount++;
            sessionsDisplay.textContent = sessionsCount;
            currentMode = sessionsCount % 4 === 0 ? 'long-break' : 'short-break';
        } else {
            currentMode = 'pomodoro';
        }
        setMode(currentMode);
    }

    function setTimeByMode(mode) {
        if (mode === 'pomodoro') {
            timeLeft = pomodoroTime * 60;
        } else if (mode === 'short-break') {
            timeLeft = shortBreakTime * 60;
        } else if (mode === 'long-break') {
            timeLeft = longBreakTime * 60;
        }
        updateDisplay();
    }

    function updateSliderLabel(mode) {
        let val = 0;
        if (mode === 'pomodoro') {
            val = pomodoroTime;
        } else if (mode === 'short-break') {
            val = shortBreakTime;
        } else if (mode === 'long-break') {
            val = longBreakTime;
        }
        slider.value = val;
    }

    function setMode(mode) {
        currentMode = mode;

        pomodoroBtn.classList.remove('active');
        shortBreakBtn.classList.remove('active');
        longBreakBtn.classList.remove('active');

        if (mode === 'pomodoro') {
            slider.max = 120;
            timerDuration = slider.value * 60; 
            pomodoroBtn.classList.add('active');
            document.body.style.backgroundColor = '#f5f5f5';
        } else if (mode === 'short-break') {
            slider.max = 20;
            if (slider.value > 20) slider.value = 5; 
            timerDuration = slider.value * 60; 
            shortBreakBtn.classList.add('active');
            document.body.style.backgroundColor = '#e8f5e9';
        } else if (mode === 'long-break') {
            slider.max = 45;
            if (slider.value > 45) slider.value = 15;
            timerDuration = slider.value * 60;
            longBreakBtn.classList.add('active');
            document.body.style.backgroundColor = '#e3f2fd';
        }

        updateSliderLabel(mode);
        setTimeByMode(mode);
        pauseTimer();
        updateDisplay();
    }

    slider.addEventListener('input', () => {
        const newValue = parseInt(slider.value);
        if (currentMode === 'pomodoro') {
            pomodoroTime = newValue;
        } else if (currentMode === 'short-break') {
            shortBreakTime = newValue;
        } else if (currentMode === 'long-break') {
            longBreakTime = newValue;
        }

        if (!isRunning) {
            timeLeft = newValue * 60;
            updateDisplay();
        }
    });

    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);

    pomodoroBtn.addEventListener('click', () => setMode('pomodoro'));
    shortBreakBtn.addEventListener('click', () => setMode('short-break'));
    longBreakBtn.addEventListener('click', () => setMode('long-break'));

    setMode('pomodoro');
});
