let floatingChatOpen = false;
let currentChatTab = 'friends';
let selectedFriend = null;
let selectedTeacher = null;

let friendsList = [
  { id: 1, name: 'Leyla', status: 'online', lastMessage: 'Salam, necəsən?' },
  { id: 2, name: 'Vusal', status: 'online', lastMessage: 'React öyrənirsən?' },
  { id: 3, name: 'Tural', status: 'offline', lastMessage: 'Sabah görüşərik' },
  { id: 4, name: 'Aysu', status: 'online', lastMessage: 'Kod hazırdır!' }
];

let teachersList = [
  { id: 1, name: 'Əli Məmmədov', subject: 'Frontend', price: '15 AZN/saat', status: 'online' },
  { id: 2, name: 'Nigar Həsənova', subject: 'Backend', price: '20 AZN/saat', status: 'online' },
  { id: 3, name: 'Rəşad Əliyev', subject: 'Mobile', price: '18 AZN/saat', status: 'offline' }
];

function getFloatingChatMessages(type, id) {
  let key = 'floating_chat_' + type + '_' + id;
  let data = localStorage.getItem(key);
  if (data) return JSON.parse(data);
  return [];
}

function saveFloatingChatMessages(type, id, messages) {
  let key = 'floating_chat_' + type + '_' + id;
  localStorage.setItem(key, JSON.stringify(messages));
}

function toggleFloatingChat() {
  floatingChatOpen = !floatingChatOpen;
  let chatWidget = document.getElementById('floatingChatWidget');
  let chatBtn = document.getElementById('floatingChatBtn');
  
  if (floatingChatOpen) {
    chatWidget.classList.add('open');
    chatBtn.innerHTML = '✕';
  } else {
    chatWidget.classList.remove('open');
    chatBtn.innerHTML = '💬';
    selectedFriend = null;
    selectedTeacher = null;
  }
  renderFloatingChatContent();
}

function switchChatTab(tab) {
  currentChatTab = tab;
  selectedFriend = null;
  selectedTeacher = null;
  
  let tabs = document.querySelectorAll('.fc-tab');
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove('active');
    if (tabs[i].dataset.tab === tab) {
      tabs[i].classList.add('active');
    }
  }
  renderFloatingChatContent();
}

function selectFriend(friendId) {
  selectedFriend = friendId;
  renderFloatingChatContent();
}

function selectTeacher(teacherId) {
  selectedTeacher = teacherId;
  renderFloatingChatContent();
}

function goBackToList() {
  selectedFriend = null;
  selectedTeacher = null;
  renderFloatingChatContent();
}

function removeFriend(friendId, event) {
  event.stopPropagation();
  
  for (let i = 0; i < friendsList.length; i++) {
    if (friendsList[i].id === friendId) {
      friendsList.splice(i, 1);
      break;
    }
  }
  localStorage.removeItem('floating_chat_friend_' + friendId);
  renderFloatingChatContent();
  if (typeof showToast === 'function') showToast('Silindi', 'success');
}

function removeTeacher(teacherId, event) {
  event.stopPropagation();
  
  for (let i = 0; i < teachersList.length; i++) {
    if (teachersList[i].id === teacherId) {
      teachersList.splice(i, 1);
      break;
    }
  }
  localStorage.removeItem('floating_chat_teacher_' + teacherId);
  renderFloatingChatContent();
  if (typeof showToast === 'function') showToast('Silindi', 'success');
}

function sendFloatingMessage() {
  let input = document.getElementById('fcMessageInput');
  let text = input.value.trim();
  if (!text) return;
  
  let user = localStorage.getItem('user');
  if (!user) {
    alert('Mesaj yazmaq üçün daxil olun!');
    return;
  }
  let userData = JSON.parse(user);
  
  let type = currentChatTab === 'friends' ? 'friend' : 'teacher';
  let id = currentChatTab === 'friends' ? selectedFriend : selectedTeacher;
  
  let messages = getFloatingChatMessages(type, id);
  messages.push({
    id: Date.now(),
    text: text,
    sender: 'me',
    senderName: userData.username || userData.name || 'Mən',
    time: new Date().toISOString()
  });
  saveFloatingChatMessages(type, id, messages);
  
  input.value = '';
  renderFloatingChatContent();
  
  let msgContainer = document.getElementById('fcMessages');
  if (msgContainer) {
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }
}

function formatChatTime(date) {
  let d = new Date(date);
  let hours = String(d.getHours()).padStart(2, '0');
  let minutes = String(d.getMinutes()).padStart(2, '0');
  return hours + ':' + minutes;
}

function getInitials(name) {
  let words = name.split(' ');
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

function renderFloatingChatContent() {
  let content = document.getElementById('fcContent');
  if (!content) return;
  
  let html = '';
  
  if (currentChatTab === 'friends' && selectedFriend) {
    let friend = null;
    for (let i = 0; i < friendsList.length; i++) {
      if (friendsList[i].id === selectedFriend) {
        friend = friendsList[i];
        break;
      }
    }
    if (!friend) return;
    
    let messages = getFloatingChatMessages('friend', selectedFriend);
    
    html = '<div class="fc-chat-view">';
    html += '<div class="fc-chat-header">';
    html += '<button class="fc-back-btn" onclick="goBackToList()">←</button>';
    html += '<div class="fc-chat-user">';
    html += '<div class="fc-avatar">' + getInitials(friend.name) + '</div>';
    html += '<div class="fc-user-info">';
    html += '<span class="fc-user-name">' + friend.name + '</span>';
    html += '<span class="fc-user-status ' + friend.status + '">' + (friend.status === 'online' ? 'Online' : 'Offline') + '</span>';
    html += '</div></div></div>';
    
    html += '<div class="fc-messages" id="fcMessages">';
    if (messages.length === 0) {
      html += '<div class="fc-empty">Hələ mesaj yoxdur</div>';
    } else {
      for (let i = 0; i < messages.length; i++) {
        let msg = messages[i];
        let msgClass = msg.sender === 'me' ? 'fc-msg sent' : 'fc-msg received';
        html += '<div class="' + msgClass + '">';
        html += '<div class="fc-msg-text">' + msg.text + '</div>';
        html += '<div class="fc-msg-time">' + formatChatTime(msg.time) + '</div>';
        html += '</div>';
      }
    }
    html += '</div>';
    
    html += '<div class="fc-input-area">';
    html += '<input type="text" id="fcMessageInput" placeholder="Mesaj yazın..." onkeydown="if(event.key===\'Enter\')sendFloatingMessage()">';
    html += '<button onclick="sendFloatingMessage()">➤</button>';
    html += '</div></div>';
    
  } else if (currentChatTab === 'teachers' && selectedTeacher) {
    let teacher = null;
    for (let i = 0; i < teachersList.length; i++) {
      if (teachersList[i].id === selectedTeacher) {
        teacher = teachersList[i];
        break;
      }
    }
    if (!teacher) return;
    
    let messages = getFloatingChatMessages('teacher', selectedTeacher);
    
    html = '<div class="fc-chat-view">';
    html += '<div class="fc-chat-header">';
    html += '<button class="fc-back-btn" onclick="goBackToList()">←</button>';
    html += '<div class="fc-chat-user">';
    html += '<div class="fc-avatar teacher">' + getInitials(teacher.name) + '</div>';
    html += '<div class="fc-user-info">';
    html += '<span class="fc-user-name">' + teacher.name + '</span>';
    html += '<span class="fc-user-subject">' + teacher.subject + ' • ' + teacher.price + '</span>';
    html += '</div></div></div>';
    
    html += '<div class="fc-messages" id="fcMessages">';
    if (messages.length === 0) {
      html += '<div class="fc-empty">Müəllimlə danışmağa başlayın</div>';
    } else {
      for (let i = 0; i < messages.length; i++) {
        let msg = messages[i];
        let msgClass = msg.sender === 'me' ? 'fc-msg sent' : 'fc-msg received';
        html += '<div class="' + msgClass + '">';
        html += '<div class="fc-msg-text">' + msg.text + '</div>';
        html += '<div class="fc-msg-time">' + formatChatTime(msg.time) + '</div>';
        html += '</div>';
      }
    }
    html += '</div>';
    
    html += '<div class="fc-input-area">';
    html += '<input type="text" id="fcMessageInput" placeholder="Müəllimə yazın..." onkeydown="if(event.key===\'Enter\')sendFloatingMessage()">';
    html += '<button onclick="sendFloatingMessage()">➤</button>';
    html += '</div></div>';
    
  } else if (currentChatTab === 'friends') {
    html = '<div class="fc-list">';
    for (let i = 0; i < friendsList.length; i++) {
      let friend = friendsList[i];
      html += '<div class="fc-list-item" onclick="selectFriend(' + friend.id + ')">';
      html += '<div class="fc-avatar">' + getInitials(friend.name) + '</div>';
      html += '<div class="fc-item-info">';
      html += '<div class="fc-item-top">';
      html += '<span class="fc-item-name">' + friend.name + '</span>';
      html += '<span class="fc-status-dot ' + friend.status + '"></span>';
      html += '</div>';
      html += '<span class="fc-item-preview">' + friend.lastMessage + '</span>';
      html += '</div>';
      html += '<button class="fc-delete-btn" onclick="removeFriend(' + friend.id + ', event)">✕</button>';
      html += '</div>';
    }
    if (friendsList.length === 0) {
      html += '<div class="fc-empty">Hələ dost yoxdur</div>';
    }
    html += '</div>';
    
  } else if (currentChatTab === 'teachers') {
    html = '<div class="fc-list">';
    for (let i = 0; i < teachersList.length; i++) {
      let teacher = teachersList[i];
      html += '<div class="fc-list-item" onclick="selectTeacher(' + teacher.id + ')">';
      html += '<div class="fc-avatar teacher">' + getInitials(teacher.name) + '</div>';
      html += '<div class="fc-item-info">';
      html += '<div class="fc-item-top">';
      html += '<span class="fc-item-name">' + teacher.name + '</span>';
      html += '<span class="fc-status-dot ' + teacher.status + '"></span>';
      html += '</div>';
      html += '<span class="fc-item-preview">' + teacher.subject + ' • ' + teacher.price + '</span>';
      html += '</div>';
      html += '<button class="fc-delete-btn" onclick="removeTeacher(' + teacher.id + ', event)">✕</button>';
      html += '</div>';
    }
    html += '</div>';
  }
  
  content.innerHTML = html;
  
  let msgContainer = document.getElementById('fcMessages');
  if (msgContainer) {
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }
}

function createFloatingChatWidget() {
  let widget = document.createElement('div');
  widget.id = 'floatingChatWidget';
  widget.className = 'floating-chat-widget';
  
  widget.innerHTML = 
    '<div class="fc-header">' +
      '<span class="fc-title">💬 Mesajlar</span>' +
      '<button class="fc-close" onclick="toggleFloatingChat()">✕</button>' +
    '</div>' +
    '<div class="fc-tabs">' +
      '<button class="fc-tab active" data-tab="friends" onclick="switchChatTab(\'friends\')">👥 Dostlar</button>' +
      '<button class="fc-tab" data-tab="teachers" onclick="switchChatTab(\'teachers\')">👨‍🏫 Müəllimlər</button>' +
    '</div>' +
    '<div class="fc-content" id="fcContent"></div>';
  
  let btn = document.createElement('button');
  btn.id = 'floatingChatBtn';
  btn.className = 'floating-chat-btn';
  btn.innerHTML = '💬';
  btn.onclick = toggleFloatingChat;
  
  document.body.appendChild(widget);
  document.body.appendChild(btn);
  
  renderFloatingChatContent();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createFloatingChatWidget);
} else {
  createFloatingChatWidget();
}

