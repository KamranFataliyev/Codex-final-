let canvas = document.getElementById('matrix-canvas');
let ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fontSize = 14;
let columns = canvas.width / fontSize;
let drops = [];

for (let i = 0; i < columns; i++) {
  drops[i] = Math.random() * -100;
}

function drawMatrix() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = fontSize + 'px monospace';
  ctx.fillStyle = '#00ff41';

  for (let i = 0; i < drops.length; i++) {
    let char = Math.random() > 0.5 ? '0' : '1';
    ctx.fillText(char, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

setInterval(drawMatrix, 50);

window.onresize = function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};
