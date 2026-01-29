// ==================== main.js - 全站通用JavaScript ====================

// 等待DOM完全加载
document.addEventListener('DOMContentLoaded', function() {
  console.log('JF Gadai - 页面加载完成');
  
  // ==================== 表单处理 ====================
  const form = document.getElementById('consultationForm');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // 简单表单验证
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const item = document.getElementById('item').value.trim();
      
      if (!name || !phone || !item) {
        alert('Harap isi nama, nomor telepon, dan barang yang ingin digadaikan.');
        return;
      }
      
      const formData = {
        name: name,
        phone: phone,
        item: item,
        message: document.getElementById('message').value.trim()
      };
      
      const whatsappNumber = '6289515692586';
      const message = `Halo JF Gadai, saya ${formData.name} ingin konsultasi tentang gadai ${formData.item}. Nomor saya: ${formData.phone}. Pesan: ${formData.message || 'Tidak ada pesan tambahan'}`;
      const encodedMessage = encodeURIComponent(message);
      
      window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
      this.reset();
      alert('Terima kasih! Anda akan diarahkan ke WhatsApp untuk konsultasi langsung.');
    });
  }
  
  // ==================== 滚动动画 ====================
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.quick-action-card, .grid-item').forEach(item => {
      observer.observe(item);
    });
  } else {
    // 降级方案
    document.querySelectorAll('.quick-action-card, .grid-item').forEach(item => {
      item.classList.add('fade-in');
    });
  }
  
  // ==================== 平滑滚动锚点 ====================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // ==================== 防误触导航处理 ====================
  const navButtons = document.querySelectorAll('.edu-navigation-btn');
  
  navButtons.forEach(button => {
    if (button.dataset.navBound) return;
    button.dataset.navBound = 'true';
    
    const parentContainer = button.closest('.service-edu-container');
    if (parentContainer) {
      const oldIntro = parentContainer.querySelector('.service-edu-intro');
      if (oldIntro) {
        oldIntro.removeAttribute('onclick');
        oldIntro.style.cursor = 'default';
      }
    }
    
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
  
  // ==================== 外部链接安全处理 ====================
  const currentHost = window.location.host;
  const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + currentHost + '"])');
  
  externalLinks.forEach(link => {
    // 跳过带有特定类名的链接
    if (link.classList.contains('no-external')) return;
    
    if (!link.hasAttribute('rel')) {
      link.setAttribute('rel', 'noopener noreferrer');
    }
    
    if (!link.hasAttribute('target')) {
      link.setAttribute('target', '_blank');
    }
  });
  
  // ==================== 图片加载错误处理 ====================
  const images = document.querySelectorAll('img');
  
  images.forEach(img => {
    img.addEventListener('error', function() {
      console.warn('图片加载失败:', this.src);
      
      // 如果是logo图片，用文本替代
      if (this.classList.contains('logo-image') || this.alt.includes('logo') || this.alt.includes('Logo')) {
        this.style.display = 'none';
        const parent = this.parentElement;
        if (parent && parent.tagName === 'A') {
          const text = document.createElement('span');
          text.textContent = 'JF Gadai';
          text.style.fontWeight = 'bold';
          text.style.color = '#f5c542';
          parent.prepend(text);
        }
      }
    });
  });
  
  // ==================== WhatsApp链接优化 ====================
  const whatsappLinks = document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"], a[href*="api.whatsapp"]');
  
  whatsappLinks.forEach(link => {
    // 确保所有WhatsApp链接都有适当的属性
    if (!link.hasAttribute('rel')) {
      link.setAttribute('rel', 'noopener noreferrer');
    }
    
    if (!link.hasAttribute('target')) {
      link.setAttribute('target', '_blank');
    }
    
    // 添加点击事件跟踪
    link.addEventListener('click', function() {
      console.log('WhatsApp链接被点击:', this.href);
      // 可以在这里添加Google Analytics或其他跟踪代码
    });
  });
  
  // ==================== 打印按钮处理 ====================
  const printBtn = document.getElementById('printPageBtn');
  if (printBtn) {
    // 移除可能的重复事件
    printBtn.removeAttribute('onclick');
    
    printBtn.addEventListener('click', function() {
      console.log('准备打印页面...');
      // 打印前执行的操作（如果有）
      setTimeout(() => {
        window.print();
      }, 100);
    });
  }
  
  // ==================== 增强的动画效果 ====================
  const fadeElements = document.querySelectorAll('.fade-in');
  
  fadeElements.forEach(el => {
    // 确保元素初始状态
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    
    if ('IntersectionObserver' in window) {
      const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // 添加延迟动画
            const delay = entry.target.classList.contains('delay-1') ? 100 :
                         entry.target.classList.contains('delay-2') ? 200 :
                         entry.target.classList.contains('delay-3') ? 300 :
                         entry.target.classList.contains('delay-4') ? 400 :
                         entry.target.classList.contains('delay-5') ? 500 :
                         entry.target.classList.contains('delay-6') ? 600 : 0;
            
            setTimeout(() => {
              entry.target.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }, delay);
            
            fadeObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });
      
      fadeObserver.observe(el);
    } else {
      // 兼容性处理
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }
  });
});

// ==================== 工具函数 ====================

/**
 * 防抖函数 - 防止函数频繁执行
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} - 防抖后的函数
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 节流函数 - 控制函数执行频率
 * @param {Function} func - 要节流的函数
 * @param {number} limit - 限制时间（毫秒）
 * @returns {Function} - 节流后的函数
 */
function throttle(func, limit) {
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
}

/**
 * 格式化手机号码为WhatsApp链接
 * @param {string} phone - 手机号码
 * @returns {string} - WhatsApp链接
 */
function formatWhatsAppLink(phone) {
  // 移除所有非数字字符
  const cleanPhone = phone.replace(/\D/g, '');
  
  // 确保以62开头（印尼国家代码）
  let formattedPhone = cleanPhone;
  if (formattedPhone.startsWith('0')) {
    formattedPhone = '62' + formattedPhone.substring(1);
  } else if (formattedPhone.startsWith('8')) {
    formattedPhone = '62' + formattedPhone;
  }
  
  return `https://wa.me/${formattedPhone}`;
}

// 导出函数（如果使用模块化）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    debounce,
    throttle,
    formatWhatsAppLink
  };
}