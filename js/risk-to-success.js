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
  
  // 清除之前可能绑定的事件
  caseHeaders.forEach(header => {
    header.removeEventListener('click', toggleCaseHandler);
  });
  
  caseHeaders.forEach(header => {
    // 确保每个标题都有点击事件
    header.addEventListener('click', toggleCaseHandler);
  });
  
  // 初始状态设置
  setTimeout(() => {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // 手机端：默认展开所有案例
      document.querySelectorAll('.case-card').forEach(card => {
        card.classList.add('expanded');
        const header = card.querySelector('.case-header-toggle');
        if (header) {
          header.setAttribute('aria-expanded', 'true');
          // 确保手机端箭头向下
          const icon = header.querySelector('.toggle-icon');
          if (icon) icon.textContent = '▲';
        }
      });
    } else {
      // 电脑端：全部收起
      document.querySelectorAll('.case-card').forEach(card => {
        card.classList.remove('expanded');
        const header = card.querySelector('.case-header-toggle');
        if (header) {
          header.setAttribute('aria-expanded', 'false');
          // 确保电脑端箭头向右
          const icon = header.querySelector('.toggle-icon');
          if (icon) icon.textContent = '▼';
        }
      });
    }
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
  // 检查浏览器是否支持 IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    return;
  }
  
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

// 如果需要，可以导出函数供其他脚本使用
window.riskToSuccess = {
  expandAllCases,
  collapseAllCases,
  initCaseToggles
};

// 添加窗口大小变化监听，重新设置默认状态
let resizeTimeout;
window.addEventListener('resize', function() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(function() {
    initCaseToggles();
  }, 150);
});

// 添加页面可见性变化监听
document.addEventListener('visibilitychange', function() {
  if (!document.hidden) {
    // 页面重新可见时重新初始化
    setTimeout(initCaseToggles, 100);
  }
});

// 防止多次初始化
if (window.riskToSuccessInitialized) {
  console.warn('风险成功页面交互已初始化，跳过重复初始化');
} else {
  window.riskToSuccessInitialized = true;
}
