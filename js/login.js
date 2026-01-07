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

function showToast(message, type = 'info') {
    let notification = document.createElement('div');
    notification.className = 'notification notification-' + type;
    
    let icon = '💬';
    if (type === 'success') icon = '✓';
    else if (type === 'warning') icon = '⚠';
    else if (type === 'error') icon = '✕';
    else if (type === 'info') icon = 'ℹ';
    
    notification.innerHTML = 
        '<span class="notif-icon">' + icon + '</span>' +
        '<span class="notif-text">' + message + '</span>';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

const API_URL = 'https://69580360f7ea690182d3bd04.mockapi.io/login';
let form = document.getElementById('loginForm');
let errorMsg = document.getElementById('errorMsg');
let submitBtn = document.querySelector('.sign-in-btn');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    let email = document.getElementById('email').value.trim();
    let password = document.getElementById('password').value;
    
    if (!email || !password) {
        showToast('Bütün xanaları doldurun!', 'warning');
        return;
    }
    
    errorMsg.style.display = 'none';
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Yoxlanılır...';
    
    try {
        let res = await fetch(API_URL);
        let users = await res.json();
        
        let user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            let userData = {
                id: user.id,
                email: user.email,
                username: user.username
            };
            localStorage.setItem('user', JSON.stringify(userData));
            
            showToast('Xoş gəldiniz, ' + user.username + '!', 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            showToast('Email və ya şifrə yanlışdır!', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Daxil ol';
        }
    } catch (err) {
        showToast('Xəta baş verdi: ' + err.message, 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Daxil ol';
    }
});