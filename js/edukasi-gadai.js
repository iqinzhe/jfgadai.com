/**
 * Edukasi Gadai - 手风琴折叠功能
 * 文件：js/edukasi-accordion.js
 */

document.addEventListener('DOMContentLoaded', function() {
  // 等待DOM完全加载
  setTimeout(() => {
    initAccordion();
  }, 100);
});

/**
 * 初始化手风琴功能
 */
function initAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  
  if (accordionHeaders.length === 0) {
    console.log('未找到手风琴元素，等待DOM加载...');
    setTimeout(initAccordion, 500);
    return;
  }
  
  console.log(`找到 ${accordionHeaders.length} 个手风琴项`);
  
  // 为每个标题添加点击事件和序号
  accordionHeaders.forEach((header, index) => {
    // 添加序号
    const numberSpan = document.createElement('span');
    numberSpan.className = 'accordion-number';
    numberSpan.textContent = index + 1;
    header.insertBefore(numberSpan, header.firstChild);
    
    // 点击事件
    header.addEventListener('click', function() {
      const item = this.parentElement;
      const content = this.nextElementSibling;
      const isActive = this.classList.contains('active');
      
      if (isActive) {
        // 如果已激活，关闭它
        closeAccordion(this, content);
      } else {
        // 否则关闭所有，然后打开这个
        closeAllAccordions();
        openAccordion(this, content);
      }
    });
  });
  
  // 默认打开第一个手风琴
  setTimeout(() => {
    if (accordionHeaders.length > 0) {
      const firstHeader = accordionHeaders[0];
      const firstContent = firstHeader.nextElementSibling;
      openAccordion(firstHeader, firstContent);
    }
  }, 300);
  
  // 添加URL哈希支持
  initHashSupport();
}

/**
 * 打开手风琴
 */
function openAccordion(header, content) {
  // 添加激活状态
  header.classList.add('active');
  
  // 计算内容高度并设置
  content.style.maxHeight = content.scrollHeight + 'px';
  
  // 添加打开状态标记
  content.setAttribute('data-state', 'open');
  
  // 平滑滚动到该部分
  setTimeout(() => {
    const headerTop = header.getBoundingClientRect().top + window.pageYOffset;
    const navHeight = document.querySelector('.edu-header')?.offsetHeight || 70;
    
    // 如果内容在导航栏下面，滚动到合适位置
    if (headerTop < navHeight + 20) {
      window.scrollTo({
        top: headerTop - navHeight - 10,
        behavior: 'smooth'
      });
    }
  }, 100);
  
  // 更新URL哈希
  updateUrlHash(header);
  
  // 发送分析事件
  sendAnalyticsEvent('accordion_open', header.textContent.trim());
}

/**
 * 关闭手风琴
 */
function closeAccordion(header, content) {
  header.classList.remove('active');
  content.style.maxHeight = null;
  content.setAttribute('data-state', 'closed');
  sendAnalyticsEvent('accordion_close', header.textContent.trim());
}

/**
 * 关闭所有手风琴
 */
function closeAllAccordions() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.classList.remove('active');
  });
  
  document.querySelectorAll('.accordion-content').forEach(content => {
    content.style.maxHeight = null;
    content.setAttribute('data-state', 'closed');
  });
}

/**
 * URL哈希支持
 */
function initHashSupport() {
  // 检查URL中的哈希
  if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    const targetSection = document.getElementById(hash);
    
    if (targetSection) {
      // 延迟执行，确保DOM完全加载
      setTimeout(() => {
        const targetHeader = targetSection.querySelector('.accordion-header');
        if (targetHeader) {
          closeAllAccordions();
          targetHeader.click();
        }
      }, 800);
    }
  }
  
  // 监听哈希变化
  window.addEventListener('hashchange', function() {
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      const targetSection = document.getElementById(hash);
      
      if (targetSection) {
        const targetHeader = targetSection.querySelector('.accordion-header');
        if (targetHeader && !targetHeader.classList.contains('active')) {
          closeAllAccordions();
          targetHeader.click();
        }
      }
    }
  });
}

/**
 * 更新URL哈希
 */
function updateUrlHash(header) {
  const section = header.closest('.accordion-item');
  if (section && section.id) {
    const newHash = `#${section.id}`;
    if (window.location.hash !== newHash) {
      window.history.pushState(null, null, newHash);
    }
  }
}

/**
 * 发送分析事件
 */
function sendAnalyticsEvent(action, label) {
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      'event_category': 'accordion_interaction',
      'event_label': label
    });
  }
  
  // 控制台日志（开发时有用）
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log(`手风琴交互: ${action} - ${label}`);
  }
}

/**
 * 重置所有手风琴到闭合状态
 */
function resetAccordions() {
  closeAllAccordions();
}

/**
 * 打开特定索引的手风琴
 * @param {number} index - 手风琴索引（从0开始）
 */
function openAccordionByIndex(index) {
  const headers = document.querySelectorAll('.accordion-header');
  if (headers[index]) {
    closeAllAccordions();
    headers[index].click();
  }
}

/**
 * 打开特定ID的手风琴
 * @param {string} sectionId - 手风琴ID
 */
function openAccordionById(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    const header = section.querySelector('.accordion-header');
    if (header) {
      closeAllAccordions();
      header.click();
    }
  }
}

// 暴露全局函数
window.eduAccordion = {
  init: initAccordion,
  openAll: function() {
    // 保持单开模式，只打开第一个
    const headers = document.querySelectorAll('.accordion-header');
    if (headers.length > 0) {
      closeAllAccordions();
      const content = headers[0].nextElementSibling;
      openAccordion(headers[0], content);
    }
  },
  closeAll: closeAllAccordions,
  openByIndex: openAccordionByIndex,
  openById: openAccordionById,
  reset: resetAccordions
};

// 初始化手风琴
initAccordion();