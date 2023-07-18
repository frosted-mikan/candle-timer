const ipc = require('electron').ipcRenderer;

const flame = document.getElementById('flame');
const wick = document.getElementById('wick');
const wax = document.getElementById('wax');
const timer = document.getElementById('hms');
const start = document.getElementById('start');
const reset = document.getElementById('reset');
const smoke = document.getElementById('smoke');
const flameShadows = document.getElementById('shadows');
const flameTop = document.getElementById('top');
const flameBottom = document.getElementById('bottom');
const close = document.getElementById('close');

close.onclick = function(e) {
  e.preventDefault();
  ipc.send('close');
}

start.onclick = function() {
  const timeInput = timer.value;
  const time = validateTimeInput(timeInput);

  if (time) {  
    startAnimate(time);

    let currentTime = time;
    let timer = setInterval(() => {
      currentTime = currentTime - 1;

      if (currentTime === 1) {
        extinguish();
      }

      if (currentTime <= 0) {
        smoke.style.opacity = 1;
        smoke.style.display = 'block';

        clearInterval(timer);
      }
    }, 1000);
  } else {
    timer.focus();
    timer.style.backgroundColor = '#e1a4a4';
  }
};

reset.onclick = function() {
  timer.value = '00:00:00';

  flame.style.removeProperty('transition-duration');
  wick.style.removeProperty('transition-duration');
  wax.style.removeProperty('transition-duration');

  flame.style.removeProperty('top');
  wick.style.removeProperty('top');
  wax.style.removeProperty('top');

  smoke.style.removeProperty('display');
  smoke.style.removeProperty('opacity');

  flameShadows.classList.remove('animate');
  flameShadows.style.removeProperty('opacity');
  flameShadows.style.removeProperty('height');

  flameTop.classList.remove('animate');
  flameTop.style.removeProperty('opacity');
  flameTop.style.removeProperty('height');

  flameBottom.classList.remove('animate');
  flameBottom.style.removeProperty('opacity');
  flameBottom.style.removeProperty('height');
}

function extinguish() {
  flameShadows.classList.add('animate');
  flameShadows.style.opacity = 0;
  flameShadows.style.height = 0;

  flameTop.classList.add('animate');
  flameTop.style.opacity = 0;
  flameTop.style.height = 0;

  flameBottom.classList.add('animate');
  flameBottom.style.opacity = 0;
  flameBottom.style.height = 0;
}

function validateTimeInput(input) {
  const pattern = /^\d?\d:\d{2}:\d{2}$/;
  if (!input.match(pattern)) {
    return false;
  }

  const time = hmsToSeconds(input);

  if (time < 2) {
    return false;
  }

  return time;
}

function startAnimate(time) {
  flame.style.transitionDuration = time + 's';
  wick.style.transitionDuration = time + 's';
  wax.style.transitionDuration = time + 's';

  flame.style.top = '550px'; // 0 + 550
  wick.style.top = '680px'; // 130 + 550;
  wax.style.top = '565px'; // 15 + 550;
}

function hmsToSeconds(str) {
  const p = str.split(':');

  if (p.length === 1) {
    return parseInt(str, 10);
  } else if (p.length === 2) {
    return parseInt(p[1], 10) + (parseInt(p[0], 10) * 60);
  }

  return parseInt(p[2], 10) + (parseInt(p[1], 10) * 60) + (parseInt(p[0], 10) * 60 * 60);
}
