let API_URL = 'https://69580360f7ea690182d3bd04.mockapi.io/teacherApi';
let container = document.getElementById('teacherContainer');
let filterTags = document.querySelectorAll('.filter-tag');
let searchInput = document.getElementById('searchInput');
let allTeachers = [];

function createTeacherCard(teacher, index) {
  let card = document.createElement('div');
  card.className = 'teacher-card';
  card.dataset.category = teacher.category || 'all';
  card.dataset.index = index;

  let status = teacher.status === 'online' ? 'online' : 'offline';
  let rating = teacher.star || teacher.rating || '';
  let experience = teacher.experience || '';
  let price = teacher.price ? teacher.price + ' AZN' : '';
  let avatar = teacher.imageUrl || teacher.image || teacher.avatar || 'https://via.placeholder.com/150?text=Avatar';
  let role = teacher.profession || teacher.role || '';
  let name = teacher.name || '';
  
  let skills = '';
  if (teacher.knowledge1) skills += '<span class="skill-tag">' + teacher.knowledge1 + '</span>';
  if (teacher.knowledge2) skills += '<span class="skill-tag">' + teacher.knowledge2 + '</span>';
  if (teacher.knowledge3) skills += '<span class="skill-tag">' + teacher.knowledge3 + '</span>';

  let stars = '<div class="rating"><span style="color:#ffc107">★</span> <span style="font-weight:600;color:#ffc107">' + (rating || '—') + '</span></div>';

  let priceHtml = '';
  if (price) {
    priceHtml = '<div class="price-info"><span class="price">' + price + '<small>/saat</small></span></div>';
  }

  let linkedin = '';
  let github = '';
  if (teacher.linkedin) {
    linkedin = '<a href="' + teacher.linkedin + '" target="_blank" title="LinkedIn"><svg fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>';
  }
  if (teacher.github) {
    github = '<a href="' + teacher.github + '" target="_blank" title="GitHub"><svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>';
  }

  card.innerHTML = 
    '<div class="card-header">' +
      '<div class="avatar-container">' +
        '<img src="' + avatar + '" alt="' + name + '">' +
        '<span class="status-badge ' + status + '"></span>' +
      '</div>' +
      stars +
    '</div>' +
    '<div class="card-body">' +
      '<h3>' + name + '</h3>' +
      '<p class="role">' + role + '</p>' +
      '<p class="experience">' + experience + ' il təcrübə</p>' +
      '<div class="skills">' + skills + '</div>' +
      priceHtml +
    '</div>' +
    '<div class="card-footer">' +
      '<button class="btn-profile" onclick="openTeacherProfile(' + index + ')">Profil</button>' +
      '<button class="btn-contact" onclick="contactTeacher(' + index + ')">Əlaqə</button>' +
    '</div>' +
    '<div class="social-links">' + linkedin + github + '</div>';

  return card;
}

function openTeacherProfile(index) {
  let teacher = allTeachers[index];
  if (!teacher) return;
  
  let modal = document.getElementById('teacherModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'teacherModal';
    modal.className = 'teacher-modal';
    document.body.appendChild(modal);
  }
  
  let avatar = teacher.imageUrl || teacher.image || teacher.avatar || 'https://via.placeholder.com/150?text=Avatar';
  let name = teacher.name || '';
  let role = teacher.profession || teacher.role || '';
  let experience = teacher.experience || '';
  let price = teacher.price ? teacher.price + ' AZN/saat' : 'Razılaşma ilə';
  let rating = teacher.star || teacher.rating || '—';
  let status = teacher.status === 'online' ? 'Online' : 'Offline';
  let statusClass = teacher.status === 'online' ? 'online' : 'offline';
  
  let skills = '';
  if (teacher.knowledge1) skills += '<span class="modal-skill">' + teacher.knowledge1 + '</span>';
  if (teacher.knowledge2) skills += '<span class="modal-skill">' + teacher.knowledge2 + '</span>';
  if (teacher.knowledge3) skills += '<span class="modal-skill">' + teacher.knowledge3 + '</span>';
  
  let socialLinks = '';
  if (teacher.linkedin) {
    socialLinks += '<a href="' + teacher.linkedin + '" target="_blank" class="modal-social linkedin">LinkedIn</a>';
  }
  if (teacher.github) {
    socialLinks += '<a href="' + teacher.github + '" target="_blank" class="modal-social github">GitHub</a>';
  }
  
  modal.innerHTML = 
    '<div class="modal-overlay" onclick="closeTeacherModal()"></div>' +
    '<div class="modal-content">' +
      '<button class="modal-close" onclick="closeTeacherModal()">✕</button>' +
      '<div class="modal-header">' +
        '<img src="' + avatar + '" alt="' + name + '" class="modal-avatar">' +
        '<div class="modal-info">' +
          '<h2>' + name + '</h2>' +
          '<p class="modal-role">' + role + '</p>' +
          '<span class="modal-status ' + statusClass + '">' + status + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="modal-body">' +
        '<div class="modal-stats">' +
          '<div class="modal-stat"><span class="stat-value">⭐ ' + rating + '</span><span class="stat-label">Reytinq</span></div>' +
          '<div class="modal-stat"><span class="stat-value">' + experience + ' il</span><span class="stat-label">Təcrübə</span></div>' +
          '<div class="modal-stat"><span class="stat-value">' + price + '</span><span class="stat-label">Qiymət</span></div>' +
        '</div>' +
        '<div class="modal-section">' +
          '<h3>Bacarıqlar</h3>' +
          '<div class="modal-skills">' + (skills || '<span style="color:#666">Məlumat yoxdur</span>') + '</div>' +
        '</div>' +
        '<div class="modal-section">' +
          '<h3>Sosial</h3>' +
          '<div class="modal-socials">' + (socialLinks || '<span style="color:#666">Məlumat yoxdur</span>') + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="modal-footer">' +
        '<button class="btn-modal-contact" onclick="contactTeacher(' + index + '); closeTeacherModal();">💬 Əlaqə saxla</button>' +
      '</div>' +
    '</div>';
  
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeTeacherModal() {
  let modal = document.getElementById('teacherModal');
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }
}

function contactTeacher(index) {
  let teacher = allTeachers[index];
  if (!teacher) return;
  
  let user = localStorage.getItem('user');
  if (!user) {
    if (typeof showToast === 'function') {
      showToast('Əlaqə üçün daxil olun!', 'warning');
    } else {
      alert('Əlaqə üçün daxil olun!');
    }
    return;
  }
  
  if (typeof toggleFloatingChat === 'function') {
    if (typeof teachersList !== 'undefined') {
      let exists = false;
      for (let i = 0; i < teachersList.length; i++) {
        if (teachersList[i].name === teacher.name) {
          exists = true;
          break;
        }
      }
      if (!exists) {
        teachersList.push({
          id: teachersList.length + 1,
          name: teacher.name,
          subject: teacher.profession || teacher.role || 'Müəllim',
          price: teacher.price ? teacher.price + ' AZN/saat' : 'Razılaşma ilə',
          status: teacher.status || 'offline'
        });
      }
    }
    
    if (!floatingChatOpen) {
      toggleFloatingChat();
    }
    switchChatTab('teachers');
    
    if (typeof showToast === 'function') {
      showToast(teacher.name + ' ilə söhbət açıldı', 'success');
    }
  } else {
    if (typeof showToast === 'function') {
      showToast(teacher.name + ' ilə əlaqə: ' + (teacher.linkedin || teacher.github || 'Məlumat yoxdur'), 'info');
    }
  }
}

function renderTeachers(list) {
  container.innerHTML = '';
  for (let i = 0; i < list.length; i++) {
    let card = createTeacherCard(list[i], i);
    container.appendChild(card);
  }
}

function filterByTag(filter) {
  let cards = container.querySelectorAll('.teacher-card');
  for (let i = 0; i < cards.length; i++) {
    if (filter === 'all' || cards[i].dataset.category === filter) {
      cards[i].style.display = 'block';
    } else {
      cards[i].style.display = 'none';
    }
  }
}

function setupFilters() {
  for (let i = 0; i < filterTags.length; i++) {
    filterTags[i].onclick = function() {
      for (let j = 0; j < filterTags.length; j++) {
        filterTags[j].classList.remove('active');
      }
      this.classList.add('active');
      filterByTag(this.dataset.filter);
    };
  }
}

function setupSearch() {
  if (!searchInput) return;
  searchInput.oninput = function() {
    let term = this.value.toLowerCase();
    let cards = container.querySelectorAll('.teacher-card');
    for (let i = 0; i < cards.length; i++) {
      let name = cards[i].querySelector('h3').textContent.toLowerCase();
      let role = cards[i].querySelector('.role').textContent.toLowerCase();
      if (name.includes(term) || role.includes(term)) {
        cards[i].style.display = 'block';
      } else {
        cards[i].style.display = 'none';
      }
    }
  };
}

function loadTeachers() {
  fetch(API_URL)
    .then(function(res) { return res.json(); })
    .then(function(data) {
      allTeachers = data;
      renderTeachers(data);
      setupFilters();
      setupSearch();
    })
    .catch(function() {
      container.innerHTML = '<p style="color:#9ca3af">Yükləmək mümkün olmadı</p>';
    });
}

document.onkeydown = function(e) {
  if (e.key === 'Escape') closeTeacherModal();
};

loadTeachers();
