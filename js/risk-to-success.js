// ==================== rules.js - 规则和案例页面专用 ====================
document.addEventListener('DOMContentLoaded', function() {
  console.log('rules.js - 规则和案例页面加载');
  
  // 检查是否在规则页面
  if (!document.querySelector('.case-card, .rules-card')) {
    console.log('不在规则页面，跳过初始化');
    return;
  }
  
  // 初始化规则页面功能
  initCaseToggles();
  initPrintFunctionality();
  initClauseEffects();
});

// ==================== 案例下拉切换 ====================
function initCaseToggles() {
  const caseHeaders = document.querySelectorAll('.case-header-toggle');
  
  if (!caseHeaders.length) return;
  
  caseHeaders.forEach(header => {
    header.addEventListener('click', toggleCaseHandler);
    
    // 可访问性属性
    header.setAttribute('role', 'button');
    header.setAttribute('aria-expanded', 'false');
  });
  
  // 初始状态：所有案例默认闭合
  setTimeout(() => {
    document.querySelectorAll('.case-card').forEach(card => {
      card.classList.remove('expanded');
      const header = card.querySelector('.case-header-toggle');
      if (header) {
        header.setAttribute('aria-expanded', 'false');
        const icon = header.querySelector('.toggle-icon');
        if (icon) icon.textContent = '▼';
      }
    });
  }, 300);
}

function toggleCaseHandler(e) {
  e.preventDefault();
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

// ==================== 打印功能 ====================
function initPrintFunctionality() {
  const printBtn = document.querySelector('.print-btn');
  
  if (printBtn) {
    printBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('打印功能触发');
      window.print();
    });
  }
}

// ==================== 条款项目效果 ====================
function initClauseEffects() {
  const clauseItems = document.querySelectorAll('.clause-item');
  
  clauseItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
      this.style.transform = 'translateX(5px)';
      this.style.transition = 'all 0.3s ease';
    });
    
    item.addEventListener('mouseleave', function() {
      this.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
      this.style.transform = 'translateX(0)';
    });
    
    // 条款点击效果
    item.addEventListener('click', function() {
      console.log('条款点击:', this.textContent);
    });
  });
}

// ==================== 全局工具函数 ====================
window.rulesPage = {
  // 展开所有案例
  expandAllCases: function() {
    document.querySelectorAll('.case-card').forEach(card => {
      card.classList.add('expanded');
      const header = card.querySelector('.case-header-toggle');
      const icon = header ? header.querySelector('.toggle-icon') : null;
      if (header) header.setAttribute('aria-expanded', 'true');
      if (icon) icon.textContent = '▲';
    });
  },
  
  // 收起所有案例
  collapseAllCases: function() {
    document.querySelectorAll('.case-card').forEach(card => {
      card.classList.remove('expanded');
      const header = card.querySelector('.case-header-toggle');
      const icon = header ? header.querySelector('.toggle-icon') : null;
      if (header) header.setAttribute('aria-expanded', 'false');
      if (icon) icon.textContent = '▼';
    });
  }
};

console.log('✅ rules.js - 规则和案例页面脚本加载完成');
