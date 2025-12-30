// js/main.js
// JF Gadai - Main JavaScript with FontFaceObserver

(function() {
  'use strict';
  
  // ========================================
  // 配置
  // ========================================
  const CONFIG = {
    fonts: {
      timeout: 4000, // 字体加载超时时间（毫秒）
      retryCount: 2  // 重试次数
    },
    animation: {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    },
    scrollOffset: 80
  };
  
  // ========================================
  // 状态管理
  // ========================================
  const STATE = {
    fontsLoaded: false,
    pageLoaded: false,
    animationsInitialized: false
  };
  
  // ========================================
  // DOM 缓存
  // ========================================
  const DOM = {
    html: document.documentElement,
    body: document.body
  };
  
  // ========================================
  // 字体管理器
  // ========================================
  const FontManager = {
    // 需要加载的字体配置
    fontConfigs: [
      {
        family: 'Inter',
        weight: 400,
        style: 'normal'
      },
      {
        family: 'Inter',
        weight: 600,
        style: 'normal'
      },
      {
        family: 'Poppins',
        weight: 600,
        style: 'normal'
      },
      {
        family: 'Poppins',
        weight: 700,
        style: 'normal'
      }
    ],
    
    // 初始化字体加载
    init() {
      if (typeof FontFaceObserver === 'undefined') {
        console.warn('FontFaceObserver未加载，使用回退方案');
        this.fallback();
        return;
      }
      
      this.loadFontsWithRetry();
    },
    
    // 使用重试机制加载字体
    async loadFontsWithRetry(retryCount = CONFIG.fonts.retryCount) {
      try {
        await this.loadFonts();
        this.onSuccess();
      } catch (error) {
        console.warn(`字体加载失败，剩余重试次数: ${retryCount}`, error);
        
        if (retryCount > 0) {
          // 等待一段时间后重试
          await this.delay(1000);
          await this.loadFontsWithRetry(retryCount - 1);
        } else {
          this.onFailure();
        }
      }
    },
    
    // 加载所有字体
    async loadFonts() {
      const fontPromises = this.fontConfigs.map(config => {
        const font = new FontFaceObserver(config.family, {
          weight: config.weight,
          style: config.style
        });
        
        return font.load(null, CONFIG.fonts.timeout);
      });
      
      await Promise.all(fontPromises);
    },
    
    // 字体加载成功
    onSuccess() {
      STATE.fontsLoaded = true;
      DOM.html.classList.remove('fonts-loading');
      DOM.html.classList.add('fonts-loaded');
      console.log('✅ 所有字体加载成功');
      
      // 触发自定义事件
      this.emitEvent('fonts:loaded');
    },
    
    // 字体加载失败
    onFailure() {
      DOM.html.classList.remove('fonts-loading');
      DOM.html.classList.add('fonts-fallback');
      console.log('⚠️ 字体加载失败，使用回退字体');
      
      // 触发自定义事件
      this.emitEvent('fonts:failed');
    },
    
    // 回退方案
    fallback() {
      setTimeout(() => {
        this.onSuccess(); // 即使没有FontFaceObserver也当作成功
      }, 1000);
    },
    
    // 延迟函数
    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    // 触发自定义事件
    emitEvent(eventName, detail = {}) {
      const event = new CustomEvent(eventName, { detail });
      document.dispatchEvent(event);
    }
  };
  
  // ========================================
  // 动画管理器
  // ========================================
  const AnimationManager = {
    observer: null,
    
    init() {
      if (STATE.animationsInitialized) return;
      
      this.setupIntersectionObserver();
      this.setupScrollAnimations();
      this.setupHoverEffects();
      
      STATE.animationsInitialized = true;
    },
    
    // 设置Intersection Observer
    setupIntersectionObserver() {
      if (!('IntersectionObserver' in window)) {
        this.fallbackAnimations();
        return;
      }
      
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateElement(entry.target);
          }
        });
      }, CONFIG.animation);
      
      // 观察需要动画的元素
      this.observeElements();
    },
    
    // 观察所有需要动画的元素
    observeElements() {
      const elements = document.querySelectorAll(
        '.fade-in, .feature-card, .service-area, section'
      );
      
      elements.forEach(element => {
        if (element.classList.contains('fade-in')) {
          element.classList.remove('fade-in');
        }
        this.observer.observe(element);
      });
    },
    
    // 动画元素
    animateElement(element) {
      element.classList.add('fade-in');
      
      // 为特定元素添加延迟动画
      if (element.classList.contains('feature-card')) {
        setTimeout(() => {
          element.classList.add('float-animation');
        }, 300);
      }
      
      // 停止观察已动画的元素
      this.observer.unobserve(element);
    },
    
    // 设置滚动动画
    setupScrollAnimations() {
      let lastScrollTop = 0;
      let ticking = false;
      
      const updateScrollState = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 添加滚动类
        if (scrollTop > 100) {
          DOM.body.classList.add('scrolled');
        } else {
          DOM.body.classList.remove('scrolled');
        }
        
        // 滚动方向
        if (scrollTop > lastScrollTop) {
          DOM.body.classList.add('scrolling-down');
          DOM.body.classList.remove('scrolling-up');
        } else {
          DOM.body.classList.add('scrolling-up');
          DOM.body.classList.remove('scrolling-down');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        ticking = false;
      };
      
      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(updateScrollState);
          ticking = true;
        }
      });
      
      // 初始调用
      updateScrollState();
    },
    
    // 设置悬停效果
    setupHoverEffects() {
      // 按钮悬停效果
      document.querySelectorAll('.btn, .contact-link').forEach(element => {
        element.addEventListener('mouseenter', () => {
          element.classList.add('hover');
        });
        
        element.addEventListener('mouseleave', () => {
          element.classList.remove('hover');
        });
      });
    },
    
    // 回退动画方案
    fallbackAnimations() {
      const elements = document.querySelectorAll('.fade-in');
      
      elements.forEach((element, index) => {
        setTimeout(() => {
          element.classList.add('fade-in');
        }, index * 150);
      });
    },
    
    // 平滑滚动到元素
    scrollToElement(selector, offset = CONFIG.scrollOffset) {
      const element = document.querySelector(selector);
      if (!element) return;
      
      const targetPosition = element.offsetTop - offset;
      
      if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      } else {
        // 回退方案
        window.scrollTo(0, targetPosition);
      }
    }
  };
  
  // ========================================
  // 事件管理器
  // ========================================
  const EventManager = {
    init() {
      this.setupClickEvents();
      this.setupKeyboardEvents();
      this.setupAnalytics();
    },
    
    // 设置点击事件
    setupClickEvents() {
      // 平滑滚动
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const href = anchor.getAttribute('href');
          if (href === '#') return;
          
          e.preventDefault();
          AnimationManager.scrollToElement(href);
        });
      });
      
      // WhatsApp 点击跟踪
      document.querySelectorAll('[href*="whatsapp"], [href*="wa.me"]').forEach(link => {
        link.addEventListener('click', () => {
          this.trackEvent('whatsapp_click', {
            category: 'engagement',
            label: 'whatsapp_consultation'
          });
        });
      });
    },
    
    // 设置键盘事件
    setupKeyboardEvents() {
      // Tab 键导航指示
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          DOM.body.classList.add('keyboard-navigation');
        }
      });
      
      document.addEventListener('mousedown', () => {
        DOM.body.classList.remove('keyboard-navigation');
      });
    },
    
    // 设置分析事件
    setupAnalytics() {
      // 页面加载完成事件
      window.addEventListener('load', () => {
        this.trackEvent('page_load', {
          category: 'engagement',
          value: performance.now()
        });
      });
      
      // 字体加载事件
      document.addEventListener('fonts:loaded', () => {
        this.trackEvent('fonts_loaded', {
          category: 'performance'
        });
      });
    },
    
    // 跟踪事件（可根据需要集成Google Analytics等）
    trackEvent(action, params = {}) {
      console.log('📊 事件跟踪:', { action, ...params });
      
      // 如果使用Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', action, params);
      }
    }
  };
  
  // ========================================
  // 性能监控
  // ========================================
  const PerformanceMonitor = {
    init() {
      this.measureLoadTime();
      this.setupVisibilityListener();
    },
    
    // 测量加载时间
    measureLoadTime() {
      window.addEventListener('load', () => {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        
        console.log(`⏱️ 页面加载时间: ${loadTime}ms`);
        
        // 根据加载时间调整性能预算
        if (loadTime > 3000) {
          console.warn('⚠️ 页面加载较慢，考虑优化资源');
        }
      });
    },
    
    // 设置页面可见性监听
    setupVisibilityListener() {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          console.log('👁️ 页面恢复可见');
          // 可以在这里添加恢复功能
        }
      });
    }
  };
  
  // ========================================
  // 错误处理
  // ========================================
  const ErrorHandler = {
    init() {
      window.addEventListener('error', this.handleError.bind(this));
      window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
    },
    
    handleError(event) {
      console.error('❌ 全局错误:', event.error || event.message);
      this.reportError(event.error, 'global_error');
    },
    
    handlePromiseRejection(event) {
      console.error('❌ Promise拒绝:', event.reason);
      this.reportError(event.reason, 'promise_rejection');
    },
    
    reportError(error, type) {
      // 这里可以添加错误上报到服务器
      const errorData = {
        type,
        message: error?.message || String(error),
        stack: error?.stack,
        url: window.location.href,
        timestamp: new Date().toISOString()
      };
      
      console.log('📤 错误报告:', errorData);
      
      // 示例：发送到错误收集服务
      // this.sendToErrorService(errorData);
    },
    
    sendToErrorService(data) {
      // 实现错误上报逻辑
      // fetch('/api/error-log', { method: 'POST', body: JSON.stringify(data) })
    }
  };
  
  // ========================================
  // 主初始化流程
  // ========================================
  class App {
    constructor() {
      this.init();
    }
    
    async init() {
      console.log('🚀 JF Gadai - 应用初始化');
      
      try {
        // 1. 初始化字体管理器
        FontManager.init();
        
        // 2. 等待字体加载或超时
        await this.waitForFonts();
        
        // 3. 初始化其他模块
        this.initModules();
        
        // 4. 设置页面加载状态
        this.setPageLoaded();
        
      } catch (error) {
        console.error('初始化失败:', error);
        this.handleInitError(error);
      }
    }
    
    // 等待字体加载（有超时）
    async waitForFonts() {
      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.log('⏰ 字体加载超时，继续初始化');
          resolve();
        }, 5000); // 5秒超时
        
        // 如果字体已加载，立即解析
        if (STATE.fontsLoaded) {
          clearTimeout(timeout);
          resolve();
          return;
        }
        
        // 监听字体加载事件
        document.addEventListener('fonts:loaded', () => {
          clearTimeout(timeout);
          resolve();
        });
        
        document.addEventListener('fonts:failed', () => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }
    
    // 初始化其他模块
    initModules() {
      AnimationManager.init();
      EventManager.init();
      PerformanceMonitor.init();
      ErrorHandler.init();
    }
    
    // 设置页面加载完成状态
    setPageLoaded() {
      STATE.pageLoaded = true;
      DOM.html.classList.add('page-loaded');
      
      // 延迟移除加载状态，确保平滑过渡
      setTimeout(() => {
        DOM.html.classList.remove('fonts-loading');
      }, 300);
      
      console.log('✅ 应用初始化完成');
    }
    
    // 处理初始化错误
    handleInitError(error) {
      // 确保页面仍然可用
      DOM.html.classList.remove('fonts-loading');
      DOM.html.classList.add('fonts-fallback');
      DOM.html.classList.add('page-loaded');
      
      console.error('应用初始化错误，已启用回退模式:', error);
    }
    
    // 公共API
    static get API() {
      return {
        scrollTo: AnimationManager.scrollToElement,
        trackEvent: EventManager.trackEvent,
        getState: () => ({ ...STATE }),
        reloadFonts: FontManager.init.bind(FontManager)
      };
    }
  }
  
  // ========================================
  // 启动应用
  // ========================================
  // 确保DOM已加载
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.JFApp = new App();
    });
  } else {
    window.JFApp = new App();
  }
  
  // 导出到全局
  window.JFGadai = App.API;
  
})();
