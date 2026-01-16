// ==================== risk-to-success.js ====================
// 专门用于 risk-to-success.html 的交互功能

document.addEventListener('DOMContentLoaded', function() {
  // 初始化案例下拉功能
  initCaseToggles();
  
  // 滚动动画
  initScrollAnimations();
});

/**
 * 初始化案例下拉切换功能
 */
function initCaseToggles() {
  const caseHeaders = document.querySelectorAll('.case-header-toggle');
  
  caseHeaders.forEach(header => {
    header.addEventListener('click', function(e) {
      e.stopPropagation();
      const caseCard = this.closest('.case-card');
      
      // 切换展开/收起状态
      if (caseCard.classList.contains('expanded')) {
        caseCard.classList.remove('expanded');
      } else {
        // 展开当前卡片
        caseCard.classList.add('expanded');
      }
    });
  });
  
  // 电脑端默认全部收起，手机端默认展开第一个案例
  setTimeout(() => {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // 手机端：展开第一个风险案例和第一个成功案例
      const firstRiskCase = document.querySelector('.risk-cases .case-card');
      const firstSuccessCase = document.querySelector('.success-cases .case-card');
      
      if (firstRiskCase) firstRiskCase.classList.add('expanded');
      if (firstSuccessCase) firstSuccessCase.classList.add('expanded');
    } else {
      // 电脑端：全部收起
      document.querySelectorAll('.case-card').forEach(card => {
        card.classList.remove('expanded');
      });
    }
  }, 300);
}

/**
 * 初始化滚动动画
 */
function initScrollAnimations() {
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
          const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 0.1;
          entry.target.style.animationDelay = `${delay}s`;
        }
      }
    });
  }, observerOptions);
  
  // 观察所有需要动画的元素
  document.querySelectorAll('.case-card, .factor-card, .cta-option').forEach(item => {
    observer.observe(item);
  });
}

/**
 * 展开所有案例（可选功能）
 */
function expandAllCases() {
  document.querySelectorAll('.case-card').forEach(card => {
    card.classList.add('expanded');
  });
}

/**
 * 收起所有案例（可选功能）
 */
function collapseAllCases() {
  document.querySelectorAll('.case-card').forEach(card => {
    card.classList.remove('expanded');
  });
}

// 如果需要，可以导出函数供其他脚本使用
window.riskToSuccess = {
  expandAllCases,
  collapseAllCases
};

// 添加窗口大小变化监听，重新设置默认状态
window.addEventListener('resize', function() {
  setTimeout(initCaseToggles, 100);
});
