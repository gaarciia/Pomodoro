document.addEventListener("DOMContentLoaded", () => {
  const startEl    = document.getElementById("start");
  const stopEl     = document.getElementById("stop");
  const resetEl    = document.getElementById("reset");
  const shortEl    = document.getElementById("short-break");
  const longEl     = document.getElementById("long-break");
  const backEl     = document.getElementById("back");
  const timerEl    = document.getElementById("timer");
  const setup      = document.getElementById("setup-screen");
  const timeBtns   = document.querySelectorAll(".time-btn");
  const container  = document.getElementById("timer-container");
  const alarmSound = document.getElementById("alarm-sound");

  let interval       = null;
  let timeLeft       = 0;
  let initialTime    = 0;
  let isPaused       = false;
  let audioUnlocked  = false;

  // Destrava o autoplay do áudio após a primeira interação
  function unlockAudio() {
    if (audioUnlocked) return;
    alarmSound.play()
      .then(() => {
        alarmSound.pause();
        alarmSound.currentTime = 0;
        audioUnlocked = true;
      })
      .catch(() => {
        // falha silenciosa se o browser ainda bloquear autoplay
      });
  }

  function updateTimer() {
    const m = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const s = String(timeLeft % 60).padStart(2, "0");
    timerEl.textContent = `${m}:${s}`;
  }

  function startTimer() {
    if (interval || isPaused) return;
    interval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimer();
      } else {
        clearInterval(interval);
        interval = null;
        // toca o alarme sem bloqueio
        alarmSound.currentTime = 0;
        alarmSound.play().catch(()=>{});
      }
    }, 1000);
  }

  function stopTimer() {
    if (!interval && isPaused) {
      startTimer();
      isPaused = false;
    } else if (interval) {
      clearInterval(interval);
      interval = null;
      isPaused = true;
    }
  }

  function resetTimer() {
    clearInterval(interval);
    interval = null;
    isPaused = false;
    timeLeft = initialTime;
    updateTimer();
  }

  function selectTime() {
    timeBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        unlockAudio();
        timeLeft    = initialTime = parseInt(btn.dataset.time, 10);
        updateTimer();
        setup.style.display     = "none";
        container.style.display = "flex";
      });
    });
  }

  function startBreak(sec) {
    clearInterval(interval);
    interval = null;
    isPaused = false;
    timeLeft    = initialTime = sec;
    updateTimer();
    startTimer();
  }

  // eventos de controle
  startEl.addEventListener("click", () => {
    unlockAudio();
    startTimer();
  });

  stopEl.addEventListener("click", () => {
    unlockAudio();
    stopTimer();
  });

  resetEl.addEventListener("click", () => {
    unlockAudio();
    resetTimer();
  });

  // PAUSAS AGORA CORRETAS: 5 e 10 minutos
  shortEl.addEventListener("click", () => {
    unlockAudio();
    startBreak(5 * 60);
  });

  longEl.addEventListener("click", () => {
    unlockAudio();
    startBreak(10 * 60);
  });

  backEl.addEventListener("click", () => {
    unlockAudio();
    clearInterval(interval);
    interval = null;
    isPaused = false;
    setup.style.display     = "flex";
    container.style.display = "none";
  });

  // inicia oculto e aguarda escolha
  container.style.display = "none";
  selectTime();
});
