let messagesContainer;
let messageInput;
let sendBtn;
let currentChannel = 'general';

function getMessages() {
  let messages = localStorage.getItem('chat_' + currentChannel);
  if (messages) return JSON.parse(messages);
  return [];
}

function saveMessages(messages) {
  localStorage.setItem('chat_' + currentChannel, JSON.stringify(messages));
}

function isLoggedIn() {
  return localStorage.getItem('user') !== null;
}

function getCurrentUser() {
  let userData = localStorage.getItem('user');
  if (userData) {
    let user = JSON.parse(userData);
    return {
      name: user.username || user.name || 'İstifadəçi',
      badge: user.badge || 'frontend',
      avatar: user.avatar || null,
      color: user.color || getUserColor(user.username || user.name || 'İstifadəçi')
    };
  }
  return null;
}

function getInitials(name) {
  let words = name.split(' ');
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

function getUserColor(username) {
  let colors = ['#10b981', '#3b82f6', '#22c55e', '#a855f7', '#f59e0b', '#06b6d4', '#ec4899', '#8b5cf6'];
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function formatDate(date) {
  let d = new Date(date);
  let day = String(d.getDate()).padStart(2, '0');
  let month = String(d.getMonth() + 1).padStart(2, '0');
  let hours = String(d.getHours()).padStart(2, '0');
  let minutes = String(d.getMinutes()).padStart(2, '0');
  return day + '.' + month + '.' + d.getFullYear() + ' ' + hours + ':' + minutes;
}

function createMessageElement(msg) {
  let div = document.createElement('div');
  div.className = 'message';
  div.dataset.id = msg.id;
  
  let color = msg.color || getUserColor(msg.author);
  let currentUser = getCurrentUser();
  let isOwnMessage = currentUser && currentUser.name === msg.author;
  
  let avatar = '';
  if (msg.avatar) {
    avatar = '<img src="' + msg.avatar + '" class="message-avatar-img">';
  } else {
    avatar = '<div class="message-avatar" style="background:' + color + '">' + getInitials(msg.author) + '</div>';
  }
  
  let authorClick = '';
  if (!isOwnMessage) {
    authorClick = ' onclick="startPrivateChat(\'' + msg.author.replace(/'/g, "\\'") + '\')" class="message-author clickable"';
  } else {
    authorClick = ' class="message-author"';
  }
  
  let deleteBtn = '';
  if (isOwnMessage) {
    deleteBtn = '<button class="msg-delete" onclick="deleteMessage(' + msg.id + ')">sil</button>';
  }
  
  div.innerHTML = avatar +
    '<div class="message-content">' +
      '<div class="message-header">' +
        '<span' + authorClick + '>' + msg.author + '</span>' +
        '<span class="user-badge ' + msg.badge + '">' + msg.badge + '</span>' +
        '<span class="message-time">' + formatDate(msg.createdAt) + '</span>' +
      '</div>' +
      '<div class="message-text">' + msg.text + '</div>' +
    '</div>' +
    deleteBtn;
  
  return div;
}

function renderMessages() {
  let messages = getMessages();
  messagesContainer.innerHTML = '';
  
  if (messages.length === 0) {
    messagesContainer.innerHTML = '<div class="empty-messages"><p>Hələ mesaj yoxdur</p></div>';
    return;
  }
  
  for (let i = 0; i < messages.length; i++) {
    messagesContainer.appendChild(createMessageElement(messages[i]));
  }
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function checkLoginStatus() {
  let profileSection = document.getElementById('sidebarProfileSection');
  
  if (!isLoggedIn()) {
    messageInput.disabled = true;
    messageInput.placeholder = 'Mesaj yazmaq üçün daxil olun';
    sendBtn.disabled = true;
    if (profileSection) profileSection.style.display = 'none';
    
    let warning = document.querySelector('.login-warning');
    if (!warning) {
      warning = document.createElement('div');
      warning.className = 'login-warning';
      warning.innerHTML = '<span>Mesaj yazmaq üçün <a href="login.html">daxil olun</a></span>';
      let wrapper = document.querySelector('.chat-input-wrapper');
      if (wrapper) wrapper.parentNode.insertBefore(warning, wrapper);
    }
  } else {
    messageInput.disabled = false;
    messageInput.placeholder = '#' + currentChannel + ' kanalına mesaj göndər';
    sendBtn.disabled = false;
    if (profileSection) profileSection.style.display = 'block';
    
    let warning = document.querySelector('.login-warning');
    if (warning) warning.remove();
  }
}

function sendMessage() {
  if (!isLoggedIn()) {
    showToast('Daxil olmalısınız!', 'warning');
    return;
  }
  
  let text = messageInput.value.trim();
  if (!text) return;
  
  let user = getCurrentUser();
  let msg = {
    id: Date.now(),
    text: text,
    author: user.name,
    badge: user.badge,
    color: user.color,
    avatar: user.avatar || null,
    createdAt: new Date().toISOString()
  };
  
  messageInput.value = '';
  
  let messages = getMessages();
  messages.push(msg);
  saveMessages(messages);
  
  let emptyEl = messagesContainer.querySelector('.empty-messages');
  if (emptyEl) emptyEl.remove();
  
  messagesContainer.appendChild(createMessageElement(msg));
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function toggleMessageMenu(messageId) {
  let allMenus = document.querySelectorAll('.menu-dropdown');
  for (let i = 0; i < allMenus.length; i++) {
    if (allMenus[i].id !== 'menu-' + messageId) {
      allMenus[i].classList.remove('show');
    }
  }
  let menu = document.getElementById('menu-' + messageId);
  if (menu) menu.classList.toggle('show');
}

function deleteMessage(messageId) {
  let menu = document.getElementById('menu-' + messageId);
  if (menu) menu.classList.remove('show');
  
  let messages = getMessages();
  let index = -1;
  for (let i = 0; i < messages.length; i++) {
    if (messages[i].id === messageId) {
      index = i;
      break;
    }
  }
  if (index === -1) return;
  
  messages.splice(index, 1);
  saveMessages(messages);
  
  let el = document.querySelector('[data-id="' + messageId + '"]');
  if (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateX(-20px)';
    el.style.transition = 'all 0.3s ease';
    setTimeout(function() {
      el.remove();
      if (messages.length === 0) renderMessages();
    }, 300);
  }
  
  showToast('Mesaj silindi', 'success');
}

function startPrivateChat(authorName) {
  if (!isLoggedIn()) {
    showToast('Daxil olmalısınız!', 'warning');
    return;
  }
  
  let currentUser = getCurrentUser();
  if (currentUser && currentUser.name === authorName) {
    showToast('Özünüzə mesaj göndərə bilməzsiniz', 'warning');
    return;
  }
  
  if (typeof friendsList !== 'undefined') {
    let exists = false;
    let friendId = null;
    for (let i = 0; i < friendsList.length; i++) {
      if (friendsList[i].name === authorName) {
        exists = true;
        friendId = friendsList[i].id;
        break;
      }
    }
    
    if (!exists) {
      friendId = Date.now();
      friendsList.push({
        id: friendId,
        name: authorName,
        status: 'online',
        lastMessage: 'Yeni söhbət'
      });
    }
    
    if (typeof floatingChatOpen !== 'undefined' && !floatingChatOpen) {
      toggleFloatingChat();
    }
    
    if (typeof switchChatTab === 'function') {
      switchChatTab('friends');
    }
    
    if (typeof selectFriend === 'function') {
      selectFriend(friendId);
    }
    
    showToast(authorName + ' ilə söhbət açıldı', 'success');
  } else {
    showToast('Chat widget mövcud deyil', 'error');
  }
}

function changeChannel(channelName) {
  currentChannel = channelName.replace('#', '').replace(' ', '-');
  document.querySelector('.channel-name').textContent = channelName;
  if (isLoggedIn()) messageInput.placeholder = channelName + ' kanalına mesaj göndər';
  renderMessages();
}

function toggleChannelDropdown() {
  document.getElementById('channelDropdown').classList.toggle('show');
}

function addSampleMessages() {
  let hasData = localStorage.getItem('chat_initialized');
  if (hasData) return;
  
  let messages = getMessages();
  if (messages.length === 0) {
    let aysuAvatar = 'https://i.pinimg.com/736x/5c/78/5b/5c785b4e7c2f161d6dbf5ab6fa7b2647.jpg';
    let sampleMessages = [
      { id: 1, text: 'Salam uşaqlar! 👋', author: 'Leyla', badge: 'frontend', color: getUserColor('Leyla'), createdAt: new Date(Date.now() - 7200000).toISOString() },
      { id: 2, text: 'Salam! Necəsən?', author: 'Vusal', badge: 'frontend', color: getUserColor('Vusal'), createdAt: new Date(Date.now() - 7100000).toISOString() },
      { id: 3, text: 'React öyrənirəm 🚀', author: 'Tural', badge: 'frontend', color: getUserColor('Tural'), createdAt: new Date(Date.now() - 7000000).toISOString() },
      { id: 4, text: 'Aysu gəlir? 👀', author: 'Leyla', badge: 'frontend', color: getUserColor('Leyla'), createdAt: new Date(Date.now() - 6000000).toISOString() },
      { id: 5, text: 'YALAN!', author: 'Aysu', badge: 'student', color: getUserColor('Aysu'), avatar: aysuAvatar, createdAt: new Date(Date.now() - 5700000).toISOString() },
      { id: 6, text: 'HAHA 😂', author: 'Kamran', badge: 'backend', color: getUserColor('Kamran'), createdAt: new Date(Date.now() - 5600000).toISOString() }
    ];
    saveMessages(sampleMessages);
  }
  localStorage.setItem('chat_initialized', 'true');
}

function initChat() {
  messagesContainer = document.getElementById('messagesContainer');
  messageInput = document.getElementById('messageInput');
  sendBtn = document.getElementById('sendBtn');
  
  if (!messagesContainer || !messageInput || !sendBtn) {
    console.log('Chat elements not found');
    return;
  }
  
  addSampleMessages();
  checkLoginStatus();
  renderMessages();
  
  sendBtn.onclick = sendMessage;
  
  messageInput.onkeydown = function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };
  
  let channelItems = document.querySelectorAll('.channel-dropdown-item');
  for (let i = 0; i < channelItems.length; i++) {
    channelItems[i].onclick = function() {
      for (let j = 0; j < channelItems.length; j++) {
        channelItems[j].classList.remove('active');
      }
      this.classList.add('active');
      changeChannel(this.textContent);
      document.getElementById('channelDropdown').classList.remove('show');
    };
  }
  
  let sidebarRight = document.querySelector('.sidebar-right');
  if (sidebarRight) {
    let userItems = sidebarRight.querySelectorAll('.user-item');
    for (let i = 0; i < userItems.length; i++) {
      userItems[i].onclick = function() {
        let userName = this.querySelector('.user-name');
        if (userName) {
          startPrivateChat(userName.textContent);
        }
      };
    }
  }
  
  document.onclick = function(e) {
    let selector = document.querySelector('.channel-selector');
    if (selector && !selector.contains(e.target)) {
      document.getElementById('channelDropdown').classList.remove('show');
    }
    if (!e.target.closest('.message-menu')) {
      let allMenus = document.querySelectorAll('.menu-dropdown');
      for (let i = 0; i < allMenus.length; i++) {
        allMenus[i].classList.remove('show');
      }
    }
  };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChat);
} else {
  initChat();
}

function openProfileModal() {
  if (!isLoggedIn()) {
    showToast('Daxil olmalısınız!', 'warning');
    return;
  }
  
  let modal = document.getElementById('profileModal');
  let user = getCurrentUser();
  let userData = JSON.parse(localStorage.getItem('user'));
  let avatarPreview = document.getElementById('avatarPreview');
  let removeBtn = document.getElementById('removeAvatarBtn');
  
  if (userData.avatar) {
    avatarPreview.innerHTML = '<img src="' + userData.avatar + '">';
    removeBtn.style.display = 'block';
  } else {
    avatarPreview.innerHTML = '<span>' + getInitials(user.name) + '</span>';
    removeBtn.style.display = 'none';
  }
  
  document.getElementById('badgeSelect').value = userData.badge || 'frontend';
  modal.classList.add('show');
}

function closeProfileModal() {
  document.getElementById('profileModal').classList.remove('show');
}

function removeAvatar() {
  let avatarPreview = document.getElementById('avatarPreview');
  let user = getCurrentUser();
  avatarPreview.innerHTML = '<span>' + getInitials(user.name) + '</span>';
  avatarPreview.dataset.newAvatar = '';
  document.getElementById('removeAvatarBtn').style.display = 'none';
}

function saveProfile() {
  let userData = JSON.parse(localStorage.getItem('user'));
  let avatarPreview = document.getElementById('avatarPreview');
  
  if (avatarPreview.dataset.newAvatar !== undefined) {
    userData.avatar = avatarPreview.dataset.newAvatar || null;
  }
  userData.badge = document.getElementById('badgeSelect').value;
  if (!userData.color) userData.color = getUserColor(userData.username || userData.name);
  
  localStorage.setItem('user', JSON.stringify(userData));
  showToast('Profil yeniləndi!', 'success');
  closeProfileModal();
  checkLoginStatus();
  if (typeof updateAuthButtons === 'function') updateAuthButtons();
}

document.addEventListener('DOMContentLoaded', function() {
  let avatarInput = document.getElementById('avatarInput');
  if (avatarInput) {
    avatarInput.onchange = function() {
      if (this.files && this.files[0]) {
        let file = this.files[0];
        if (file.size > 2 * 1024 * 1024) {
          showToast('Şəkil 2MB-dan böyük olmamalıdır!', 'error');
          return;
        }
        let reader = new FileReader();
        reader.onload = function(e) {
          let avatarPreview = document.getElementById('avatarPreview');
          avatarPreview.innerHTML = '<img src="' + e.target.result + '">';
          document.getElementById('removeAvatarBtn').style.display = 'block';
          avatarPreview.dataset.newAvatar = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    };
  }
});

document.onkeydown = function(e) {
  if (e.key === 'Escape') closeProfileModal();
};
