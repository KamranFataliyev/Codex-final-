window.onload = function() {
  updateAuthButtons();
};

function updateAuthButtons() {
  let authButtons = document.querySelector('.auth-buttons');
  if (!authButtons) return;

  let user = localStorage.getItem('user');

  if (user) {
    let userData = JSON.parse(user);
    let username = userData.username || userData.name || 'İstifadəçi';
    let initials = getInitials(username);

    let avatar = '';
    if (userData.avatar) {
      avatar = '<img src="' + userData.avatar + '" class="user-avatar-nav-img">';
    } else {
      avatar = '<span class="user-avatar-nav">' + initials + '</span>';
    }

    authButtons.innerHTML = 
      '<div class="user-info-nav">' + avatar +
      '<span class="user-name-nav">' + username + '</span></div>' +
      '<button class="btn-logout" onclick="logout()">Çıxış</button>';
  } else {
    authButtons.innerHTML = 
      '<a href="login.html" class="btn-login">Daxil ol</a>' +
      '<a href="register.html" class="btn-register">Qeydiyyat</a>';
  }
}

function getInitials(name) {
  let words = name.split(' ');
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function logout() {
  localStorage.removeItem('user');
  showToast('Uğurla çıxış etdiniz!', 'success');
  setTimeout(function() {
    window.location.href = 'index.html';
  }, 1000);
}
