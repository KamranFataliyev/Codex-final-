let API_URL = 'https://6958f8f56c3282d9f1d646c3.mockapi.io/blog';
let container = document.getElementById('blogContainer');
let postCount = document.getElementById('postCount');
let searchInput = document.getElementById('searchInput');
let categoryLinks = document.querySelectorAll('.category-list a');
let articleModal = document.getElementById('articleModal');
let allPosts = [];

function formatDate(dateStr) {
  if (!dateStr) return '';
  let date = new Date(dateStr);
  return date.toLocaleDateString('az-AZ', { year: 'numeric', month: 'long', day: 'numeric' });
}

function getIcon(title) {
  if (!title) return '📝';
  let t = title.toLowerCase();
  if (t.includes('react')) return '⚛️';
  if (t.includes('api')) return '🔌';
  if (t.includes('javascript')) return '📜';
  if (t.includes('python')) return '🐍';
  if (t.includes('mobile')) return '📱';
  if (t.includes('ai')) return '🤖';
  if (t.includes('css')) return '🎨';
  return '📝';
}

function createBlogCard(post) {
  let card = document.createElement('div');
  card.className = 'blog-card';
  
  card.innerHTML = 
    '<div class="blog-card-image">' + getIcon(post.title) + '</div>' +
    '<div class="blog-card-content">' +
      '<div class="blog-card-meta">' +
        '<span class="category">' + (post.category || 'Digər') + '</span>' +
        '<span>📅 ' + formatDate(post.date) + '</span>' +
      '</div>' +
      '<h3 class="blog-card-title">' + (post.title || 'Başlıqsız') + '</h3>' +
      '<p class="blog-card-info">' + (post.information || '') + '</p>' +
      '<div class="blog-card-footer"><span class="read-more">Daha ətraflı →</span></div>' +
    '</div>';
  
  card.onclick = function() { openArticle(post); };
  return card;
}

function renderPosts(posts) {
  container.innerHTML = '';
  
  if (!posts || posts.length === 0) {
    container.innerHTML = '<div class="loading">Məqalə tapılmadı</div>';
    postCount.textContent = '0';
    return;
  }
  
  for (let i = 0; i < posts.length; i++) {
    let card = createBlogCard(posts[i]);
    container.appendChild(card);
  }
  postCount.textContent = posts.length;
}

function loadPosts() {
  container.innerHTML = '<div class="loading"><div class="spinner"></div><p>Yüklənir...</p></div>';
  
  fetch(API_URL)
    .then(function(res) { return res.json(); })
    .then(function(data) {
      allPosts = data;
      renderPosts(allPosts);
    })
    .catch(function() {
      container.innerHTML = '<div class="loading"><p style="color:#ef4444">Yükləmək mümkün olmadı</p></div>';
    });
}

function openArticle(post) {
  document.getElementById('articleContent').innerHTML = 
    '<div class="article-image">' + getIcon(post.title) + '</div>' +
    '<div class="article-meta"><span>📅 ' + formatDate(post.date) + '</span><span>📂 ' + (post.category || 'Digər') + '</span></div>' +
    '<h1 class="article-title">' + (post.title || 'Başlıqsız') + '</h1>' +
    '<div class="article-text">' + (post.information || '') + '</div>';
  
  articleModal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  articleModal.classList.remove('show');
  document.body.style.overflow = '';
}

searchInput.oninput = function() {
  let term = this.value.toLowerCase();
  if (!term) {
    renderPosts(allPosts);
    return;
  }
  let filtered = [];
  for (let i = 0; i < allPosts.length; i++) {
    let p = allPosts[i];
    let title = (p.title || '').toLowerCase();
    let info = (p.information || '').toLowerCase();
    if (title.includes(term) || info.includes(term)) {
      filtered.push(p);
    }
  }
  renderPosts(filtered);
};

for (let i = 0; i < categoryLinks.length; i++) {
  categoryLinks[i].onclick = function(e) {
    e.preventDefault();
    for (let j = 0; j < categoryLinks.length; j++) {
      categoryLinks[j].classList.remove('active');
    }
    this.classList.add('active');
    
    let cat = this.dataset.category;
    if (cat === 'all') {
      renderPosts(allPosts);
    } else {
      let filtered = [];
      for (let k = 0; k < allPosts.length; k++) {
        let postCat = (allPosts[k].category || '').toLowerCase();
        if (postCat.includes(cat.toLowerCase())) {
          filtered.push(allPosts[k]);
        }
      }
      renderPosts(filtered);
    }
  };
}

document.getElementById('closeArticleBtn').onclick = closeModal;
articleModal.onclick = function(e) {
  if (e.target === articleModal) closeModal();
};
document.onkeydown = function(e) {
  if (e.key === 'Escape') closeModal();
};

loadPosts();
