const canvas = document.getElementById("matrix-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const characters = "01";
const fontSize = 14;
let columns = Math.floor(canvas.width / fontSize);

const drops = [];
for (let i = 0; i < columns; i++) {
  if (Math.random() > 0.7) {
    drops[i] = Math.random() * -100;
  }
}

function drawMatrix() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    if (drops[i] === undefined) continue;

    const char = characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
    const brightness = Math.random() * 0.2 + 0.1;
    ctx.fillStyle = `rgba(0, 255, 65, ${brightness})`;

    ctx.fillText(char, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.98) {
      drops[i] = 0;
    }

    drops[i]++;
  }
}

setInterval(drawMatrix, 50);

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  columns = Math.floor(canvas.width / fontSize);
});

const cardInput = document.getElementById("cardNum");
const cardDisplay = document.getElementById("cardDisplay");

cardInput.addEventListener("input", function (e) {
  let value = e.target.value.replace(/\s/g, "");
  let formatted = value.match(/.{1,4}/g)?.join(" ") || value;
  e.target.value = formatted;

  if (value.length > 0) {
    let masked = value
      .split("")
      .map((d, i) => (i < value.length - 4 ? "•" : d))
      .join("");
    cardDisplay.textContent = masked.match(/.{1,4}/g)?.join(" ") || masked;
  } else {
    cardDisplay.textContent = "•••• •••• •••• ••••";
  }
});

document.querySelectorAll(".method-card").forEach((card) => {
  card.addEventListener("click", function () {
    document
      .querySelectorAll(".method-card")
      .forEach((c) => c.classList.remove("active"));
    this.classList.add("active");
  });
});

document.querySelector(".checkout-btn").addEventListener("click", function (e) {
  e.preventDefault();
  alert("Payment processing demo. No actual transaction will occur.");
});
