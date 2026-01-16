/**
 * Edukasi Gadai - 手风琴折叠功能
 * 文件：js/edukasi-accordion.js
 */

document.addEventListener('DOMContentLoaded', function() {
  // 等待DOM完全加载
  setTimeout(() => {
    initAccordion();
    initOutlineNavigation();
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
  
function initAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  
  if (accordionHeaders.length === 0) return;
  
  // 默认全部闭合
  closeAllAccordions();
  
  // 为每个标题添加点击事件
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
      
      // 关闭其他所有手风琴（单开模式）
      closeAllAccordions();
      
      // 如果当前不是激活状态，打开它
      if (!isActive) {
        openAccordion(this, content);
      }
    });
  });
  
  // 添加URL哈希支持（可选功能）
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
    header.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest'
    });
  }, 300);
  
  // 更新URL哈希（可选）
  updateUrlHash(header);
  
  // 发送分析事件（可选）
  sendAnalyticsEvent('accordion_open', header.textContent.trim());
}

/**
 * 关闭手风琴
 */
function closeAccordion(header, content) {
  header.classList.remove('active');
  content.style.maxHeight = null;
  content.setAttribute('data-state', 'closed');
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
 * 初始化大纲导航
 */
function initOutlineNavigation() {
  const outlineNav = document.querySelector('.outline-nav');
  if (!outlineNav) return;
  
  const sections = document.querySelectorAll('.accordion-item');
  let navHTML = '<ul>';
  
  sections.forEach((section, index) => {
    const header = section.querySelector('.accordion-header');
    const headerText = header.textContent.replace(/^\d+\s*/, '').trim(); // 移除序号
    const sectionId = `section-${index + 1}`;
    
    // 为每个部分设置ID
    section.id = sectionId;
    
    navHTML += `
      <li>
        <a href="#${sectionId}" 
           class="outline-link" 
           data-index="${index}">
          ${index + 1}. ${headerText}
        </a>
      </li>
    `;
  });
  
  navHTML += '</ul>';
  outlineNav.innerHTML = navHTML;
  
  // 为导航链接添加点击事件
  document.querySelectorAll('.outline-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        // 关闭所有手风琴
        closeAllAccordions();
        
        // 找到对应的手风琴标题并点击
        const targetHeader = targetSection.querySelector('.accordion-header');
        if (targetHeader) {
          targetHeader.click();
        }
      }
    });
  });
}

/**
 * URL哈希支持（可选）
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
      }, 500);
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
 * 更新URL哈希（可选）
 */
function updateUrlHash(header) {
  const section = header.closest('.accordion-item');
  if (section && section.id) {
    window.history.pushState(null, null, `#${section.id}`);
  }
}

/**
 * 发送分析事件（可选）
 */
function sendAnalyticsEvent(action, label) {
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      'event_category': 'accordion_interaction',
      'event_label': label
    });
  }
  
  // 控制台日志（开发时有用）
  console.log(`Accordion action: ${action} - ${label}`);
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

// 暴露全局函数（可选）
window.eduAccordion = {
  init: initAccordion,
  openAll: function() {
    document.querySelectorAll('.accordion-header').forEach((header, index) => {
      if (index === 0) {
        const content = header.nextElementSibling;
        openAccordion(header, content);
      }
    });
  },
  closeAll: closeAllAccordions,
  openByIndex: openAccordionByIndex,
  reset: resetAccordions
};
