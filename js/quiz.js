let flexboxLevels = [
  { instruction: 'Elementləri mərkəzə yerləşdir', hint: 'justify-content: center, align-items: center', answer: { jc: 'center', ai: 'center', fd: '' } },
  { instruction: 'Elementləri sağa yerləşdir', hint: 'justify-content: flex-end', answer: { jc: 'flex-end', ai: '', fd: '' } },
  { instruction: 'Elementləri arasında boşluq', hint: 'justify-content: space-between', answer: { jc: 'space-between', ai: '', fd: '' } },
  { instruction: 'Elementləri sütun şəklində', hint: 'flex-direction: column', answer: { jc: '', ai: '', fd: 'column' } },
  { instruction: 'Tam mərkəzləşdirmə + sütun', hint: 'Hər üçünü düzgün seç', answer: { jc: 'center', ai: 'center', fd: 'column' } }
];

let jsQuestions = [
  { code: 'console.log(typeof [])', options: ['array', 'object', 'undefined', 'null'], correct: 1 },
  { code: 'console.log(2 + "2")', options: ['4', '22', 'NaN', 'Error'], correct: 1 },
  { code: 'console.log([] == false)', options: ['true', 'false', 'undefined', 'Error'], correct: 0 },
  { code: 'let x = 10; console.log(x++)', options: ['10', '11', 'undefined', 'Error'], correct: 0 },
  { code: 'console.log("5" - 3)', options: ['53', '2', 'NaN', 'Error'], correct: 1 }
];

let bugCodes = [
  { code: ['let x = 10;', 'console.log(x);', 'x = x + 1', 'console.log(x);'], bugLine: 2, hint: 'Nöqtəli vergül unudulub' },
  { code: ['const name = "Test";', 'name = "Yeni";', 'console.log(name);'], bugLine: 1, hint: 'const dəyişənə yenidən dəyər verilə bilməz' },
  { code: ['if (x = 5) {', '  console.log("Ok");', '}'], bugLine: 0, hint: '= əvəzinə === olmalıdır' },
  { code: ['let x = 5;', 'let y = 10', 'console.log(x + y);'], bugLine: 1, hint: 'Nöqtəli vergül unudulub' },
  { code: ['function greet(name) {', '  console.log("Salam " + Name);', '}'], bugLine: 1, hint: 'Dəyişən adı səhvdir' }
];

let flexState = { level: 0, score: 0 };
let jsState = { q: 0, score: 0 };
let bugState = { level: 0, score: 0, timer: 60, interval: null };

function openGame(game) {
  let modal = document.getElementById(game + '-modal');
  if (modal) {
    modal.classList.add('active');
    if (game === 'flexbox') initFlexbox();
    if (game === 'jsquiz') initJsQuiz();
    if (game === 'bughunter') initBugHunter();
  }
}

function closeGame(game) {
  let modal = document.getElementById(game + '-modal');
  if (modal) modal.classList.remove('active');
  if (game === 'bughunter' && bugState.interval) clearInterval(bugState.interval);
}

function initFlexbox() {
  flexState = { level: 0, score: 0 };
  document.getElementById('flexbox-result').style.display = 'none';
  document.querySelector('#flexbox-modal .flexbox-challenge').style.display = 'block';
  loadFlexboxLevel();
}

function loadFlexboxLevel() {
  let l = flexboxLevels[flexState.level];
  document.getElementById('flexbox-level').textContent = flexState.level + 1;
  document.getElementById('flexbox-score').textContent = flexState.score;
  document.getElementById('flexbox-instruction').textContent = l.instruction;
  document.getElementById('flexbox-hint').textContent = 'İpucu: ' + l.hint;
  
  document.getElementById('justify-content').value = '';
  document.getElementById('align-items').value = '';
  document.getElementById('flex-direction').value = '';
  
  let uc = document.getElementById('user-container');
  uc.style.justifyContent = '';
  uc.style.alignItems = '';
  uc.style.flexDirection = '';
  
  let tc = document.getElementById('target-container');
  tc.style.justifyContent = l.answer.jc || 'flex-start';
  tc.style.alignItems = l.answer.ai || 'flex-start';
  tc.style.flexDirection = l.answer.fd || 'row';
}

function updateFlexbox() {
  let uc = document.getElementById('user-container');
  uc.style.justifyContent = document.getElementById('justify-content').value;
  uc.style.alignItems = document.getElementById('align-items').value;
  uc.style.flexDirection = document.getElementById('flex-direction').value;
}

function checkFlexboxAnswer() {
  let l = flexboxLevels[flexState.level];
  let jc = document.getElementById('justify-content').value;
  let ai = document.getElementById('align-items').value;
  let fd = document.getElementById('flex-direction').value;
  
  let ok = (!l.answer.jc || jc === l.answer.jc) && (!l.answer.ai || ai === l.answer.ai) && (!l.answer.fd || fd === l.answer.fd);
  
  if (ok) {
    flexState.score += 10;
    showToast('Doğru! +10 xal', 'success');
    if (flexState.level < flexboxLevels.length - 1) {
      flexState.level++;
      setTimeout(loadFlexboxLevel, 1000);
    } else {
      document.querySelector('#flexbox-modal .flexbox-challenge').style.display = 'none';
      document.getElementById('flexbox-result').style.display = 'block';
      document.getElementById('flexbox-result-title').textContent = '🎉 Təbriklər!';
      document.getElementById('flexbox-result-text').textContent = 'Xal: ' + flexState.score;
    }
  } else {
    showToast('Səhv! Yenidən cəhd et', 'error');
  }
}

function restartFlexbox() { initFlexbox(); }

function initJsQuiz() {
  jsState = { q: 0, score: 0 };
  document.getElementById('jsquiz-result').style.display = 'none';
  document.querySelector('#jsquiz-modal .js-challenge').style.display = 'block';
  loadJsQuestion();
}

function loadJsQuestion() {
  let q = jsQuestions[jsState.q];
  document.getElementById('js-question-num').textContent = jsState.q + 1;
  document.getElementById('js-score').textContent = jsState.score;
  document.getElementById('js-question-code').textContent = q.code;
  document.getElementById('js-feedback').style.display = 'none';
  
  let opts = document.getElementById('js-options');
  opts.innerHTML = '';
  for (let i = 0; i < q.options.length; i++) {
    let btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = q.options[i];
    btn.onclick = function() { checkJsAnswer(i); };
    opts.appendChild(btn);
  }
}

function checkJsAnswer(sel) {
  let q = jsQuestions[jsState.q];
  let fb = document.getElementById('js-feedback');
  let btns = document.querySelectorAll('.option-btn');
  
  for (let i = 0; i < btns.length; i++) {
    btns[i].disabled = true;
    if (i === q.correct) btns[i].classList.add('correct');
    else if (i === sel) btns[i].classList.add('wrong');
  }
  
  if (sel === q.correct) {
    jsState.score += 10;
    fb.textContent = '✅ Doğru!';
    fb.className = 'feedback success';
  } else {
    fb.textContent = '❌ Səhv! Cavab: ' + q.options[q.correct];
    fb.className = 'feedback error';
  }
  fb.style.display = 'block';
  
  setTimeout(function() {
    if (jsState.q < jsQuestions.length - 1) { jsState.q++; loadJsQuestion(); }
    else {
      document.querySelector('#jsquiz-modal .js-challenge').style.display = 'none';
      document.getElementById('jsquiz-result').style.display = 'block';
      document.getElementById('jsquiz-result-title').textContent = '🎉 Quiz Bitdi!';
      document.getElementById('jsquiz-result-text').textContent = 'Xal: ' + jsState.score + '/50';
    }
  }, 1500);
}

function restartJsQuiz() { initJsQuiz(); }

function initBugHunter() {
  bugState = { level: 0, score: 0, timer: 60, interval: null };
  document.getElementById('bughunter-result').style.display = 'none';
  document.querySelector('#bughunter-modal .bug-challenge').style.display = 'block';
  loadBugLevel();
  startBugTimer();
}

function loadBugLevel() {
  let b = bugCodes[bugState.level];
  document.getElementById('bug-level').textContent = bugState.level + 1;
  document.getElementById('bug-score').textContent = bugState.score;
  document.getElementById('bug-hint').textContent = b.hint;
  document.getElementById('bug-hint').style.display = 'none';
  document.getElementById('bug-feedback').style.display = 'none';
  
  let code = document.getElementById('bug-code');
  code.innerHTML = '';
  for (let i = 0; i < b.code.length; i++) {
    let line = document.createElement('div');
    line.className = 'code-line';
    line.innerHTML = '<span class="line-num">' + (i+1) + '</span><code>' + b.code[i] + '</code>';
    line.onclick = function() { checkBugLine(i); };
    code.appendChild(line);
  }
}

function startBugTimer() {
  if (bugState.interval) clearInterval(bugState.interval);
  bugState.timer = 60;
  document.getElementById('bug-timer').textContent = bugState.timer;
  bugState.interval = setInterval(function() {
    bugState.timer--;
    document.getElementById('bug-timer').textContent = bugState.timer;
    if (bugState.timer <= 0) { clearInterval(bugState.interval); showBugResult(); }
  }, 1000);
}

function checkBugLine(idx) {
  let b = bugCodes[bugState.level];
  let fb = document.getElementById('bug-feedback');
  let lines = document.querySelectorAll('.code-line');
  
  if (idx === b.bugLine) {
    bugState.score += 10;
    lines[idx].classList.add('correct-line');
    fb.textContent = '✅ Doğru!';
    fb.className = 'feedback success';
    fb.style.display = 'block';
    setTimeout(function() {
      if (bugState.level < bugCodes.length - 1) { bugState.level++; loadBugLevel(); }
      else { clearInterval(bugState.interval); showBugResult(); }
    }, 1000);
  } else {
    lines[idx].classList.add('wrong-line');
    fb.textContent = '❌ Səhv!';
    fb.className = 'feedback error';
    fb.style.display = 'block';
    setTimeout(function() { lines[idx].classList.remove('wrong-line'); }, 500);
  }
}

function showBugHint() {
  document.getElementById('bug-hint').style.display = 'block';
}

function showBugResult() {
  document.querySelector('#bughunter-modal .bug-challenge').style.display = 'none';
  document.getElementById('bughunter-result').style.display = 'block';
  document.getElementById('bughunter-result-title').textContent = '🐛 Oyun Bitdi!';
  document.getElementById('bughunter-result-text').textContent = 'Xal: ' + bugState.score;
}

function restartBugHunter() { initBugHunter(); }

document.addEventListener('click', function(e) {
  if (e.target.classList.contains('game-modal')) {
    closeGame(e.target.id.replace('-modal', ''));
  }
});
