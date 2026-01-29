// ==================== edukasi-gadai.js - 教育页面特定JS ====================

document.addEventListener('DOMContentLoaded', function() {
  console.log('教育页面加载完成');
  
  // 初始化教育页面功能
  initEdukasiPage();
});

/**
 * 初始化教育页面
 */
function initEdukasiPage() {
  // 防误触导航按钮处理
  const navButtons = document.querySelectorAll('.edu-navigation-btn');
  
  navButtons.forEach(button => {
    if (button.dataset.navBound) return;
    button.dataset.navBound = 'true';
    
    // 移除父容器的旧事件
    const parentContainer = button.closest('.service-edu-container');
    if (parentContainer) {
      const oldIntro = parentContainer.querySelector('.service-edu-intro');
      if (oldIntro) {
        oldIntro.removeAttribute('onclick');
        oldIntro.style.cursor = 'default';
      }
    }
    
    // 绑定新事件
    button.addEventListener('click', function() {
      const url = this.getAttribute('data-url');
      if (url) {
        this.style.transform = 'scale(0.98)';
        this.style.transition = 'transform 0.1s ease';
        
        setTimeout(() => {
          window.location.href = url;
        }, 150);
      }
    });
  });
  
  // 初始化动画效果
  initEdukasiAnimations();
}

/**
 * 初始化教育页面动画
 */
function initEdukasiAnimations() {
  const fadeElements = document.querySelectorAll('.fade-in');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      observer.observe(el);
    });
  } else {
    // 兼容性处理
    fadeElements.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }
}