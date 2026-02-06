// ==================== main.js - 核心通用功能模块 ====================

// 全局工具对象
window.JFUtils = {
  version: '1.0.0',
  initTime: new Date().toISOString()
};

document.addEventListener('DOMContentLoaded', function() {
  console.log('JF Gadai - 通用功能模块加载 v' + JFUtils.version);
  
  // ==================== 1. 通用滚动动画 ====================
  initScrollAnimations();
  
  // ==================== 2. 平滑滚动 ====================
  initSmoothScrolling();
  
  // ==================== 3. 通用FAQ功能 ====================
  initGenericFAQ();
  
  // ==================== 4. 通用悬停效果 ====================
  initHoverEffects();
  
  // ==================== 5. 页面加载动画 ====================
  initPageTransitions();
  
  // ==================== 6. 表单验证工具 ====================
  initFormValidationUtils();
  
  // ==================== 7. WhatsApp工具 ====================
  initWhatsAppUtils();
  
  // ==================== 8. 防误触导航 ====================
  initNavigationButtons();
  
  // ==================== 9. 错误处理 ====================
  initErrorHandling();
  
  // ==================== 10. 设备检测 ====================
  initDeviceDetection();
  
  // ==================== 11. 货币格式化工具 ====================
  initCurrencyUtils();
});

// ==================== 1. 通用滚动动画 ====================
function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) {
    // 降级方案
    setTimeout(() => {
      document.querySelectorAll('.fade-in, .slide-up').forEach(el => {
        el.classList.add('animated');
      });
    }, 300);
    return;
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        
        // 支持延迟动画
        const delay = entry.target.dataset.delay || 0;
        if (delay > 0) {
          entry.target.style.animationDelay = delay + 's';
        }
        
        // 动画后取消观察
        observer.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  // 观察需要动画的元素
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

// ==================== 2. 平滑滚动 ====================
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const targetElement = document.querySelector(href);
      if (targetElement) {
        e.preventDefault();
        
        // 计算滚动位置（考虑固定导航栏）
        const navHeight = document.querySelector('header')?.offsetHeight || 80;
        const targetPosition = targetElement.offsetTop - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ==================== 3. 通用FAQ功能 ====================
function initGenericFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  if (!faqItems.length) return;
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    if (question) {
      question.addEventListener('click', function() {
        const isActive = item.classList.contains('active');
        
        // 关闭其他FAQ项（如果支持单开模式）
        if (!isActive && this.dataset.single !== 'false') {
          document.querySelectorAll('.faq-item.active').forEach(otherItem => {
            if (otherItem !== item) {
              otherItem.classList.remove('active');
              otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            }
          });
        }
        
        // 切换当前项
        item.classList.toggle('active');
        this.setAttribute('aria-expanded', (!isActive).toString());
      });
      
      // 可访问性属性
      question.setAttribute('role', 'button');
      question.setAttribute('aria-expanded', 'false');
    }
  });
  
  // 初始状态：默认所有闭合
  setTimeout(() => {
    faqItems.forEach(item => {
      item.classList.remove('active');
      const question = item.querySelector('.faq-question');
      if (question) question.setAttribute('aria-expanded', 'false');
    });
  }, 100);
}

// ==================== 4. 通用悬停效果 ====================
function initHoverEffects() {
  // 为特定class的元素添加悬停效果
  document.querySelectorAll('.hover-lift, .card, .btn').forEach(element => {
    element.addEventListener('mouseenter', function() {
      if (this.classList.contains('hover-lift') || this.classList.contains('card')) {
        this.style.transform = 'translateY(-4px)';
        this.style.transition = 'transform 0.2s ease';
        this.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
      }
    });
    
    element.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '';
    });
  });
}

// ==================== 5. 页面加载动画 ====================
function initPageTransitions() {
  // 页面加载时的淡入效果
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.3s ease';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 50);
  
  // 为卡片添加渐进式加载动画
  const cards = document.querySelectorAll('.card, .service-card, .grid-item');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(15px)';
    
    setTimeout(() => {
      card.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100 + (index * 30));
  });
}

// ==================== 6. 表单验证工具 ====================
function initFormValidationUtils() {
  window.formValidator = {
    // 验证印尼手机号码
    validatePhoneID: function(phone) {
      const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
      return phoneRegex.test(phone.replace(/\s+/g, ''));
    },
    
    // 验证KTP号码（16位数字）
    validateKTP: function(ktp) {
      const ktpRegex = /^\d{16}$/;
      return ktpRegex.test(ktp);
    },
    
    // 验证必填字段
    validateRequired: function(value) {
      return value && value.trim().length > 0;
    },
    
    // 验证最小长度
    validateMinLength: function(value, minLength) {
      return value && value.trim().length >= minLength;
    },
    
    // 显示错误信息
    showError: function(fieldId, message) {
      const errorElement = document.getElementById(fieldId + 'Error');
      if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.setAttribute('role', 'alert');
      }
    },
    
    // 清除错误信息
    clearError: function(fieldId) {
      const errorElement = document.getElementById(fieldId + 'Error');
      if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
      }
    },
    
    // 格式化手机号码为印尼标准
    formatPhoneID: function(phone) {
      let formatted = phone.replace(/\s+/g, '');
      
      if (formatted.startsWith('0')) {
        formatted = '62' + formatted.substring(1);
      } else if (formatted.startsWith('+62')) {
        formatted = formatted.substring(1);
      }
      
      return formatted;
    }
  };
}

// ==================== 7. WhatsApp工具 ====================
function initWhatsAppUtils() {
  window.whatsappUtils = {
    defaultNumber: '6289515692586',
    
    // 构建WhatsApp消息
    buildMessage: function(data) {
      const defaults = {
        name: '',
        phone: '',
        product: '',
        description: '',
        type: 'konsultasi'
      };
      
      const config = { ...defaults, ...data };
      
      let message = `Halo JF Gadai, saya ${config.name} ingin ${config.type} tentang gadai ${config.product}.\n\n`;
      message += `📋 DATA:\n`;
      message += `• Nama: ${config.name}\n`;
      message += `• WhatsApp: ${config.phone}\n`;
      message += `• Barang: ${config.product}\n`;
      
      if (config.description) {
        message += `• Deskripsi: ${config.description}\n`;
      }
      
      message += `\nMohon info lebih lanjut. Terima kasih!`;
      
      return message;
    },
    
    // 构建WhatsApp URL
    buildURL: function(phone, message) {
      const formattedPhone = window.formValidator?.formatPhoneID(phone) || phone;
      const encodedMessage = encodeURIComponent(message);
      return `https://wa.me/${this.defaultNumber}?text=${encodedMessage}`;
    }
  };
}

// ==================== 8. 防误触导航 ====================
function initNavigationButtons() {
  const navButtons = document.querySelectorAll('a[href$=".html"]:not([target="_blank"])');
  
  navButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      // 添加点击反馈
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  });
}

// ==================== 9. 错误处理 ====================
function initErrorHandling() {
  window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', {
      message: e.message,
      filename: e.filename,
      lineno: e.lineno,
      error: e.error?.toString()
    });
  });
  
  window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
  });
}

// ==================== 10. 设备检测 ====================
function initDeviceDetection() {
  window.deviceInfo = {
    isMobile: () => window.innerWidth <= 768,
    isTablet: () => window.innerWidth > 768 && window.innerWidth <= 1024,
    isDesktop: () => window.innerWidth > 1024,
    
    getType: function() {
      if (this.isMobile()) return 'mobile';
      if (this.isTablet()) return 'tablet';
      return 'desktop';
    }
  };
  
  // 初始调整
  if (window.deviceInfo.isMobile()) {
    document.body.classList.add('is-mobile');
  }
}

// ==================== 11. 货币格式化工具 ====================
function initCurrencyUtils() {
  window.currencyUtils = {
    formatIDR: function(amount) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(amount);
    },
    
    formatSimple: function(amount) {
      return 'Rp ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
  };
}

console.log('✅ main.js - 通用功能模块加载完成');