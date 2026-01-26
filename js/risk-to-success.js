// ==================== risk-to-success.js ====================
// 合并版：包含基础功能 + 增强功能

document.addEventListener('DOMContentLoaded', function() {
  // 1. 基础功能
  initCaseToggles();
  initScrollAnimations();
  
  // 2. 增强功能
  initStoryFilter();
  initQuizFunction();
  initRuleLinks();
  
  // 3. 防重复初始化
  if (window.riskToSuccessInitialized) {
    console.warn('风险成功页面交互已初始化，跳过重复初始化');
    return;
  }
  window.riskToSuccessInitialized = true;
});

// ==================== 基础功能 ====================

/**
 * 初始化案例下拉切换功能
 */
function initCaseToggles() {
  const caseHeaders = document.querySelectorAll('.case-header-toggle');
  
  caseHeaders.forEach(header => {
    header.removeEventListener('click', toggleCaseHandler);
    header.addEventListener('click', toggleCaseHandler);
  });
  
  // 初始状态设置
  setTimeout(() => {
    const isMobile = window.innerWidth <= 768;
    
    // 所有设备默认都闭合
    document.querySelectorAll('.case-card').forEach(card => {
      card.classList.remove('expanded');
      const header = card.querySelector('.case-header-toggle');
      if (header) {
        header.setAttribute('aria-expanded', 'false');
        const icon = header.querySelector('.toggle-icon');
        if (icon) icon.textContent = '▼';
      }
    });
    
    console.log(`设备检测: ${isMobile ? '移动端' : '桌面端'}，所有案例默认闭合`);
  }, 300);
}

/**
 * 处理案例展开/收起的点击事件
 */
function toggleCaseHandler(e) {
  e.stopPropagation();
  const caseCard = this.closest('.case-card');
  const icon = this.querySelector('.toggle-icon');
  
  if (caseCard.classList.contains('expanded')) {
    // 收起案例
    caseCard.classList.remove('expanded');
    this.setAttribute('aria-expanded', 'false');
    if (icon) icon.textContent = '▼';
  } else {
    // 展开案例
    caseCard.classList.add('expanded');
    this.setAttribute('aria-expanded', 'true');
    if (icon) icon.textContent = '▲';
  }
}

/**
 * 初始化滚动动画
 */
function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) return;
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        
        // 为案例卡片添加延迟动画
        if (entry.target.classList.contains('case-card')) {
          const parent = entry.target.parentNode;
          if (parent && parent.children) {
            const index = Array.from(parent.children).indexOf(entry.target);
            const delay = index * 0.1;
            entry.target.style.animationDelay = `${delay}s`;
          }
        }
      }
    });
  }, observerOptions);
  
  // 观察所有需要动画的元素
  document.querySelectorAll('.case-card, .factor-card, .cta-option').forEach(item => {
    observer.observe(item);
  });
}

// ==================== 增强功能 ====================

/**
 * 故事筛选功能
 */
function initStoryFilter() {
  const storyBtns = document.querySelectorAll('.story-btn');
  if (storyBtns.length === 0) return;
  
  const caseCards = document.querySelectorAll('.case-card');
  
  storyBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // 移除所有按钮的active状态
      storyBtns.forEach(b => b.classList.remove('active'));
      // 添加当前按钮的active状态
      this.classList.add('active');
      
      const filter = this.dataset.story;
      
      // 筛选显示案例
      caseCards.forEach(card => {
        if (filter === 'all') {
          card.style.display = 'flex';
        } else {
          const cardType = card.classList.contains('risk-card') ? 'risk' : 
                          card.classList.contains('success-card') ? 'success' : 'lesson';
          
          if (card.dataset.story === filter || cardType === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        }
      });
    });
  });
}

/**
 * 问答功能
 */
function initQuizFunction() {
  const checkBtn = document.getElementById('check-quiz');
  if (!checkBtn) return;
  
  checkBtn.addEventListener('click', function() {
    const answers = {
      q1: 'b', // Urus duplikat STNK dulu
      q2: 'b',  // Jujur beri tahu sejak awal
      q3: 'b'   // Komunikasi terbuka dan jujur
    };
    
    let correctCount = 0;
    const totalQuestions = Object.keys(answers).length;
    
    // 检查每个问题
    Object.keys(answers).forEach(questionId => {
      const selected = document.querySelector(`input[name="${questionId}"]:checked`);
      const feedbackEl = document.getElementById(`feedback-${questionId}`);
      
      if (feedbackEl) {
        if (!selected) {
          feedbackEl.innerHTML = '⚠️ <em>Anda belum memilih jawaban</em>';
          feedbackEl.className = 'quiz-feedback warning';
        } else if (selected.value === answers[questionId]) {
          feedbackEl.innerHTML = '✅ <strong>Benar!</strong> Jawaban Anda tepat.';
          feedbackEl.className = 'quiz-feedback correct';
          correctCount++;
        } else {
          feedbackEl.innerHTML = '❌ <strong>Salah.</strong> Pelajari kembali kasus terkait.';
          feedbackEl.className = 'quiz-feedback wrong';
        }
      }
    });
    
    // 显示结果
    const resultEl = document.getElementById('quiz-result');
    if (resultEl) {
      const percentage = Math.round((correctCount / totalQuestions) * 100);
      let message = '';
      
      if (percentage === 100) {
        message = '🎉 <strong>Luar biasa!</strong> Anda sudah memahami semua pelajaran penting!';
      } else if (percentage >= 50) {
        message = '👍 <strong>Bagus!</strong> Anda sudah memahami sebagian besar pelajaran.';
      } else {
        message = '📚 <strong>Perlu belajar lagi.</strong> Baca ulang kasus-kasus di atas.';
      }
      
      resultEl.innerHTML = `
        <h4>Hasil: ${correctCount} dari ${totalQuestions} benar (${percentage}%)</h4>
        <p>${message}</p>
        <p><small><a href="#cases">👆 Kembali ke kasus</a> | <a href="rules.html">📖 Baca aturan lengkap</a></small></p>
      `;
      resultEl.className = 'quiz-result show';
    }
  });
}

/**
 * 规则链接高亮
 */
function initRuleLinks() {
  const ruleLinks = document.querySelectorAll('.rules-link-box a, .legal-link, .rules-link-box.small a');
  
  ruleLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // 跟踪点击（可用于分析）
      console.log(`User clicked rule link: ${this.href}`);
      
      // 可选：添加短暂视觉反馈
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 200);
    });
  });
}

/**
 * 分享案例功能
 */
function shareCase(caseId) {
  const caseCard = document.querySelector(`#${caseId}`);
  if (!caseCard) return;
  
  const title = caseCard.querySelector('h3').textContent;
  const url = window.location.href.split('#')[0] + `#${caseId}`;
  const text = `Pelajari dari kisah nyata gadai motor di JF Gadai: "${title}"`;
  
  if (navigator.share) {
    navigator.share({
      title: 'Kisah Gadai Motor - JF Gadai',
      text: text,
      url: url
    });
  } else {
    // 降级方案：复制链接
    navigator.clipboard.writeText(url).then(() => {
      alert('Link kisah berhasil disalin!');
    });
  }
}

// ==================== 辅助功能 ====================

/**
 * 展开所有案例（可选功能）
 */
function expandAllCases() {
  document.querySelectorAll('.case-card').forEach(card => {
    card.classList.add('expanded');
    const header = card.querySelector('.case-header-toggle');
    const icon = header ? header.querySelector('.toggle-icon') : null;
    if (header) header.setAttribute('aria-expanded', 'true');
    if (icon) icon.textContent = '▲';
  });
}

/**
 * 收起所有案例（可选功能）
 */
function collapseAllCases() {
  document.querySelectorAll('.case-card').forEach(card => {
    card.classList.remove('expanded');
    const header = card.querySelector('.case-header-toggle');
    const icon = header ? header.querySelector('.toggle-icon') : null;
    if (header) header.setAttribute('aria-expanded', 'false');
    if (icon) icon.textContent = '▼';
  });
}

// 添加窗口大小变化监听
let resizeTimeout;
window.addEventListener('resize', function() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(function() {
    // 窗口大小变化时，保持所有案例闭合状态
    document.querySelectorAll('.case-card').forEach(card => {
      if (!card.classList.contains('expanded')) {
        const header = card.querySelector('.case-header-toggle');
        if (header) {
          header.setAttribute('aria-expanded', 'false');
          const icon = header.querySelector('.toggle-icon');
          if (icon) icon.textContent = '▼';
        }
      }
    });
  }, 150);
});

// 导出函数供其他脚本使用
window.riskToSuccess = {
  expandAllCases,
  collapseAllCases,
  initCaseToggles,
  shareCase,
  initStoryFilter
};
