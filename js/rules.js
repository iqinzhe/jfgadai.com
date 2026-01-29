// ==================== rules.js - 规则页面JavaScript ====================

// 等待DOM完全加载
document.addEventListener('DOMContentLoaded', function() {
  console.log('规则页面加载完成');
  
  // 手风琴功能
  initAccordion();
  
  // 打印按钮事件
  initPrintButton();
  
  // 打开第一个手风琴项
  openFirstAccordion();
});

/**
 * 初始化手风琴功能
 */
function initAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');
  
  if (accordionItems.length === 0) {
    console.warn('未找到手风琴项');
    return;
  }
  
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    
    if (!header || !content) {
      console.warn('手风琴项缺少header或content元素');
      return;
    }
    
    header.addEventListener('click', () => {
      // 关闭其他打开的手风琴项
      accordionItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherContent = otherItem.querySelector('.accordion-content');
          if (otherContent) {
            otherContent.style.maxHeight = null;
          }
        }
      });
      
      // 切换当前项
      item.classList.toggle('active');
      
      if (item.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = null;
      }
    });
  });
  
  console.log(`手风琴功能已初始化，共 ${accordionItems.length} 个项`);
}

/**
 * 初始化打印按钮事件
 */
function initPrintButton() {
  const printBtn = document.querySelector('button[onclick="window.print()"]');
  if (printBtn) {
    // 移除内联onclick属性，添加事件监听器
    printBtn.removeAttribute('onclick');
    printBtn.addEventListener('click', function() {
      console.log('准备打印页面...');
      // 打印前执行的操作（如果有）
      setTimeout(() => {
        window.print();
      }, 100);
    });
    
    console.log('打印按钮事件已初始化');
  }
}

/**
 * 打开第一个手风琴项
 */
function openFirstAccordion() {
  const firstAccordionItem = document.querySelector('.accordion-item');
  if (firstAccordionItem) {
    const firstContent = firstAccordionItem.querySelector('.accordion-content');
    if (firstContent) {
      firstAccordionItem.classList.add('active');
      firstContent.style.maxHeight = firstContent.scrollHeight + 'px';
      console.log('已打开第一个手风琴项');
    }
  }
}

/**
 * 页面加载动画
 */
function initPageAnimations() {
  // 为带有延迟类名的元素添加动画
  const fadeElements = document.querySelectorAll('.fade-in');
  fadeElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    
    // 使用requestAnimationFrame确保动画流畅
    requestAnimationFrame(() => {
      setTimeout(() => {
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 100);
    });
  });
}