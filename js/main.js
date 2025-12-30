// js/main.js - 简化版

(function() {
  'use strict';
  
  console.log('🚀 JF Gadai - 应用初始化');
  
  // =========================
  // 1. 动画效果
  // =========================
  function initAnimations() {
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offset = 80; // 导航栏高度
          const targetPosition = target.offsetTop - offset;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
    
    // 淡入动画
    function initFadeInAnimations() {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };
      
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('fade-in');
              observer.unobserve(entry.target);
            }
          });
        }, observerOptions);
        
        document.querySelectorAll('.fade-in').forEach(el => {
          el.classList.remove('fade-in');
          observer.observe(el);
        });
      } else {
        // 回退方案：直接显示
        document.querySelectorAll('.fade-in').forEach((el, index) => {
          setTimeout(() => {
            el.classList.add('fade-in');
          }, index * 200);
        });
      }
    }
    
    // 按钮悬停效果
    function initButtonEffects() {
      document.querySelectorAll('.btn, .contact-link').forEach(button => {
        button.addEventListener('mouseenter', function() {
          this.classList.add('hover');
        });
        
        button.addEventListener('mouseleave', function() {
          this.classList.remove('hover');
        });
      });
    }
    
    initFadeInAnimations();
    initButtonEffects();
  }
  
  // =========================
  // 2. WhatsApp 点击跟踪
  // =========================
  function initAnalytics() {
    document.querySelectorAll('[href*="whatsapp"], [href*="wa.me"]').forEach(link => {
      link.addEventListener('click', function() {
        console.log('WhatsApp 咨询点击');
        // 可以在这里添加Google Analytics跟踪
        // if (typeof gtag !== 'undefined') {
        //   gtag('event', 'whatsapp_click', {...});
        // }
      });
    });
  }
  
  // =========================
  // 3. 性能监控
  // =========================
  function initPerformance() {
    // 页面加载时间
    window.addEventListener('load', function() {
      if ('performance' in window) {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        console.log(`⏱️ 页面加载时间: ${loadTime}ms`);
      }
    });
    
    // 页面可见性
    document.addEventListener('visibilitychange', function() {
      if (document.visibilityState === 'visible') {
        console.log('👁️ 页面恢复可见');
      }
    });
  }
  
  // =========================
  // 4. 错误处理
  // =========================
  function initErrorHandling() {
    window.addEventListener('error', function(e) {
      console.error('页面错误:', e.message);
    });
    
    window.addEventListener('unhandledrejection', function(e) {
      console.error('Promise错误:', e.reason);
    });
  }
  
  // =========================
  // 5. 主初始化
  // =========================
  function init() {
    initAnimations();
    initAnalytics();
    initPerformance();
    initErrorHandling();
    
    // 全局API（如果需要）
    window.JFGadai = {
      scrollTo: function(selector) {
        const target = document.querySelector(selector);
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      }
    };
    
    console.log('✅ JF Gadai 应用初始化完成');
  }
  
  // =========================
  // 启动应用
  // =========================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();
