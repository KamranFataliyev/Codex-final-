function showToast(message, type) {
  type = type || 'info';
  
  let existing = document.querySelector('.toast');
  if (existing) existing.remove();
  
  let toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  
  let icon = '💬';
  if (type === 'success') icon = '✅';
  if (type === 'error') icon = '❌';
  if (type === 'warning') icon = '⚠️';
  
  toast.innerHTML = '<span class="toast-icon">' + icon + '</span><span>' + message + '</span>';
  
  toast.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#1a1a1a;color:#fff;padding:12px 24px;border-radius:8px;display:flex;align-items:center;gap:10px;z-index:99999;box-shadow:0 4px 20px rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);font-size:0.95rem;animation:toastSlide 0.3s ease;';
  
  if (type === 'success') toast.style.borderColor = '#10b981';
  if (type === 'error') toast.style.borderColor = '#ef4444';
  if (type === 'warning') toast.style.borderColor = '#f59e0b';
  
  document.body.appendChild(toast);
  
  setTimeout(function() {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(function() {
      toast.remove();
    }, 300);
  }, 3000);
}

let style = document.createElement('style');
style.textContent = '@keyframes toastSlide{from{opacity:0;transform:translateX(-50%) translateY(20px);}to{opacity:1;transform:translateX(-50%) translateY(0);}}';
document.head.appendChild(style);