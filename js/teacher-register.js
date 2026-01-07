    let form = document.getElementById('teacherForm');
    let submitBtn = document.getElementById('submitBtn');
    let successMessage = document.getElementById('successMessage');
    let cvInput = document.getElementById('cv');
    let fileName = document.getElementById('fileName');

if (cvInput) {
    cvInput.addEventListener('change', function() {
      if (this.files[0]) {
        const file = this.files[0];
        if (file.size > 5 * 1024 * 1024) {
        showToast('Fayl 5MB-dan böyük olmamalıdır!', 'error');
          this.value = '';
          fileName.textContent = '';
          return;
        }
        fileName.textContent = file.name;
      } else {
        fileName.textContent = '';
      }
    });
}

form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let btnText = submitBtn.querySelector('.btn-text');
      let btnLoader = submitBtn.querySelector('.btn-loader');
      
      btnText.style.display = 'none';
      btnLoader.style.display = 'inline';
      submitBtn.disabled = true;

  setTimeout(() => {
          form.style.display = 'none';
          successMessage.style.display = 'block';
  }, 1000);
});
