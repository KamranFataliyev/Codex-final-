let canvas = document.getElementById('matrix-canvas');
let ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let characters = '01';
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

    for (let i = 0; i < drops.length; i++) {
        let char = characters.charAt(Math.floor(Math.random() * characters.length));
        
        let gradient = ctx.createLinearGradient(0, drops[i] * fontSize, 0, (drops[i] + 1) * fontSize);
        gradient.addColorStop(0, '#00ff41');
        gradient.addColorStop(1, 'rgba(0, 255, 65, 0.3)');
        ctx.fillStyle = gradient;

        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }

        drops[i]++;
    }
}

setInterval(drawMatrix, 50);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

function togglePassword(id) {
    let input = document.getElementById(id);
    input.type = input.type === 'password' ? 'text' : 'password';
}
window.togglePassword = togglePassword;

const API_URL = 'https://69580360f7ea690182d3bd04.mockapi.io/login';
let form = document.getElementById('registerForm');
let errorMsg = document.getElementById('errorMsg');
let submitBtn = document.querySelector('.register-btn');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    let email = document.getElementById('email').value.trim();
    let username = document.getElementById('username').value.trim();
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirm-password').value;
    
    errorMsg.style.display = 'none';
    
    if (password !== confirmPassword) {
        errorMsg.textContent = 'Passwords do not match!';
        errorMsg.style.display = 'block';
        return;
    }
    
    if (password.length < 6) {
        errorMsg.textContent = 'Password must be at least 6 characters!';
        errorMsg.style.display = 'block';
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Loading...';
    
    try {
        let checkRes = await fetch(API_URL);
        let users = await checkRes.json();
        let exists = users.find(u => u.email === email);
        
        if (exists) {
            errorMsg.textContent = 'This email is already registered!';
            errorMsg.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Register';
            return;
        }
        
        let res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, username, password, createdAt: new Date().toISOString() })
        });
        
        if (res.ok) {
            showToast('Qeydiyyat uğurlu! İndi daxil ola bilərsiniz.', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        } else {
            throw new Error('Something went wrong');
        }
    } catch (err) {
        errorMsg.textContent = 'Registration error: ' + err.message;
        errorMsg.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register';
    }
});
