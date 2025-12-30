// js/main.js
// JF Gadai - Main JavaScript

(function() {
  'use strict';
  
  // ========================================
  // 配置和全局变量
  // ========================================
  const config = {
    animation: {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    },
    scrollOffset: 80,
    whatsappNumber: '6289515692586',
    googleMapsQuery: 'Bangil, Pasuruan'
  };
  
  // ========================================
  // DOM 元素缓存
  // ========================================
  const DOM = {
    html: document.documentElement,
    body: document.body,
    heroSection: document.getElementById('hero'),
    serviceArea: document.getElementById('lokasi')
  };
  
  // ========================================
  // 工具函数
  // ========================================
  const utils = {
    // 节流函数
    throttle: function(func, limit) {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    },
    
    // 防抖函数
    debounce: function(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
    
    // 检测是否支持某些特性
    supports: {
      intersectionObserver: 'IntersectionObserver' in window,
      smoothScroll: 'scrollBehavior' in document.documentElement.style
    },
    
    // 生成WhatsApp链接
    generateWhatsAppLink: function(message = 'Halo, saya tertarik dengan layanan JF Gadai. Bisa konsultasi?') {
      const encodedMessage = encodeURIComponent(message);
      return `https://wa.me/${config.whatsappNumber}?text=${encodedMessage}`;
    },
    
    // 生成Google Maps链接
    generateMapsLink: function() {
      return `https://maps.google.com/?q=${encodeURIComponent(config.googleMapsQuery)}`;
    }
  };
  
  // ========================================
  // 动画和滚动效果
  // ========================================
  const animations = {
    init: function() {
      if (!utils.supports.intersectionObserver) {
        this.fallbackAnimation();
        return;
      }
      
      this.setupIntersectionObserver();
      this.setupScrollEffects();
    },
    
    // 设置Intersection Observer
    setupIntersectionObserver: function() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            
            // 添加浮动动画到特定元素
            if (entry.target.classList.contains('feature-card')) {
              setTimeout(() => {
                entry.target.classList.add('float-animation');
              }, 500);
            }
            
            // 停止观察已动画的元素
            observer.unobserve(entry.target);
          }
        });
      }, config.animation);
      
      // 观察所有需要动画的元素
      document.querySelectorAll('.fade-in').forEach(element => {
        element.classList.remove('fade-in');
        observer.observe(element);
      });
      
      // 观察section元素
      document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
      });
    },
    
    // 设置滚动效果
    setupScrollEffects: function() {
      let lastScrollTop = 0;
      
      const handleScroll = utils.throttle(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 添加/移除滚动类到body
        if (scrollTop > 100) {
          DOM.body.classList.add('scrolled');
        } else {
          DOM.body.classList.remove('scrolled');
        }
        
        // 添加/移除向下滚动类
        if (scrollTop > lastScrollTop && scrollTop > 200) {
          DOM.body.classList.add('scrolling-down');
          DOM.body.classList.remove('scrolling-up');
        } else {
          DOM.body.classList.add('scrolling-up');
          DOM.body.classList.remove('scrolling-down');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
      }, 100);
      
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // 初始调用
    },
    
    // 回退动画方案
    fallbackAnimation: function() {
      document.querySelectorAll('.fade-in').forEach((element, index) => {
        setTimeout(() => {
          element.classList.add('fade-in');
        }, index * 200);
      });
    },
    
    // 平滑滚动
    smoothScroll: function(targetElement, offset = config.scrollOffset) {
      if (!targetElement) return;
      
      if (utils.supports.smoothScroll) {
        window.scrollTo({
          top: targetElement.offsetTop - offset,
          behavior: 'smooth'
        });
      } else {
        // 回退方案
        const targetPosition = targetElement.offsetTop - offset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 500;
        let start = null;
        
        function step(timestamp) {
          if (!start) start = timestamp;
          const progress = timestamp - start;
          const percentage = Math.min(progress / duration, 1);
          
          // 缓动函数
          const easeInOutCubic = t => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1;
          
          window.scrollTo(0, startPosition + distance * easeInOutCubic(percentage));
          
          if (progress < duration) {
            window.requestAnimationFrame(step);
          }
        }
        
        window.requestAnimationFrame(step);
      }
    }
  };
  
  // ========================================
  // 事件处理
  // ========================================
  const events = {
    init: function() {
      this.setupClickEvents();
      this.setupFormEvents();
      this.setupKeyboardEvents();
    },
    
    // 设置点击事件
    setupClickEvents: function() {
      // 平滑滚动锚点链接
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const targetId = anchor.getAttribute('href');
          if (targetId === '#') return;
          
          e.preventDefault();
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            animations.smoothScroll(targetElement);
          }
        });
      });
      
      // WhatsApp CTA 按钮
      document.querySelectorAll('[href*="whatsapp"], [href*="wa.me"]').forEach(link => {
        link.addEventListener('click', function(e) {
          // 添加点击跟踪
          console.log('WhatsApp点击:', this.href);
          
          // 可选: 发送分析事件
          if (typeof gtag !== 'undefined') {
            gtag('event', 'whatsapp_click', {
              'event_category': 'engagement',
              'event_label': 'whatsapp_consultation'
            });
          }
        });
      });
      
      // 添加悬停效果到按钮
      document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
          this.classList.add('hover');
        });
        
        btn.addEventListener('mouseleave', function() {
          this.classList.remove('hover');
        });
      });
    },
    
    // 设置表单事件（如果需要的话）
    setupFormEvents: function() {
      // 这里可以添加联系表单处理
      console.log('表单事件初始化');
    },
    
    // 设置键盘事件
    setupKeyboardEvents: function() {
      document.addEventListener('keydown', (e) => {
        // Escape键关闭模态框（如果有的话）
        if (e.key === 'Escape') {
          this.closeAllModals();
        }
        
        // Tab键导航焦点管理
        if (e.key === 'Tab') {
          DOM.body.classList.add('tab-navigation');
        }
      });
      
      document.addEventListener('click', () => {
        DOM.body.classList.remove('tab-navigation');
      });
    },
    
    // 关闭所有模态框
    closeAllModals: function() {
      document.querySelectorAll('.modal.open').forEach(modal => {
        modal.classList.remove('open');
      });
    }
  };
  
  // ========================================
  // 字体加载处理
  // ========================================
  const fonts = {
    init: function() {
      if ('fonts' in document) {
        // 检查关键字体是否已加载
        const inter = new FontFaceObserver('Inter', {
          weight: 400
        });
        
        const poppins = new FontFaceObserver('Poppins', {
          weight: 600
        });
        
        Promise.all([
          inter.load(null, 3000),
          poppins.load(null, 3000)
        ]).then(() => {
          this.onFontsLoaded();
        }).catch(() => {
          this.onFontsFailed();
        });
      } else {
        // 不支持FontFaceObserver的回退方案
        setTimeout(() => {
          this.onFontsLoaded();
        }, 1000);
      }
    },
    
    onFontsLoaded: function() {
      DOM.html.classList.remove('fonts-loading');
      DOM.html.classList.add('fonts-loaded');
      console.log('字体加载完成');
    },
    
    onFontsFailed: function() {
      DOM.html.classList.remove('fonts-loading');
      DOM.html.classList.add('fonts-fallback');
      console.log('字体加载失败，使用回退字体');
    }
  };
  
  // ========================================
  // 性能监控
  // ========================================
  const performanceMonitor = {
    init: function() {
      if ('performance' in window) {
        this.measureLoadTime();
      }
      
      // 监听页面可见性变化
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          this.onPageVisible();
        }
      });
    },
    
    measureLoadTime: function() {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const timing = performance.timing;
          const loadTime = timing.loadEventEnd - timing.navigationStart;
          
          console.log(`页面加载时间: ${loadTime}ms`);
          
          // 发送到分析工具（可选）
          if (typeof gtag !== 'undefined' && loadTime < 10000) {
            gtag('event', 'timing_complete', {
              'name': 'page_load',
              'value': loadTime,
              'event_category': 'Performance'
            });
          }
        }, 0);
      });
    },
    
    onPageVisible: function() {
      console.log('页面变为可见');
      // 可以在这里添加恢复动画或更新数据
    }
  };
  
  // ========================================
  // 错误处理
  // ========================================
  const errorHandler = {
    init: function() {
      // 全局错误捕获
      window.addEventListener('error', (e) => {
        this.logError(e.error || e.message, 'global_error');
      });
      
      // Promise拒绝捕获
      window.addEventListener('unhandledrejection', (e) => {
        this.logError(e.reason, 'promise_rejection');
      });
    },
    
    logError: function(error, type) {
      console.error(`[${type}]`, error);
      
      // 这里可以添加错误报告到服务器
      // this.reportErrorToServer(error, type);
    },
    
    reportErrorToServer: function(error, type) {
      // 实现错误报告逻辑
    }
  };
  
  // ========================================
  // 主初始化函数
  // ========================================
  function init() {
    console.log('JF Gadai - 初始化中...');
    
    // 初始化顺序
    fonts.init();
    animations.init();
    events.init();
    performanceMonitor.init();
    errorHandler.init();
    
    // 页面加载完成
    window.addEventListener('load', () => {
      DOM.html.classList.add('page-loaded');
      console.log('页面加载完成');
    });
    
    // 导出一些有用的函数到全局（可选）
    window.JFGadai = {
      utils: utils,
      scrollTo: animations.smoothScroll,
      getWhatsAppLink: utils.generateWhatsAppLink,
      getMapsLink: utils.generateMapsLink
    };
  }
  
  // ========================================
  // 启动应用
  // ========================================
  // 确保DOM已加载
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();

// FontFaceObserver 回退（如果未加载）
if (typeof FontFaceObserver === 'undefined') {
  console.warn('FontFaceObserver未加载，使用回退字体加载策略');
  // 可以在这里添加回退逻辑
}