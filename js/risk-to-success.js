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
    header.addEventListener('click', function() {
      const caseCard = this.closest('.case-card');
      const isExpanded = caseCard.classList.contains('expanded');
      
      // 如果点击的是已展开的卡片，则关闭
      if (isExpanded) {
        caseCard.classList.remove('expanded');
      } else {
        // 关闭其他已展开的卡片
        document.querySelectorAll('.case-card.expanded').forEach(expandedCard => {
          expandedCard.classList.remove('expanded');
        });
        
        // 展开当前卡片
        caseCard.classList.add('expanded');
        
        // 滚动到卡片位置（如果不在视图中）
        const rect = caseCard.getBoundingClientRect();
        if (rect.top < 100 || rect.bottom > window.innerHeight - 100) {
          caseCard.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }
    });
  });
  
  // 默认展开第一个风险案例和第一个成功案例
  setTimeout(() => {
    const firstRiskCase = document.querySelector('.risk-cases .case-card');
    const firstSuccessCase = document.querySelector('.success-cases .case-card');
    
    if (firstRiskCase) firstRiskCase.classList.add('expanded');
    if (firstSuccessCase) firstSuccessCase.classList.add('expanded');
  }, 500);
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
