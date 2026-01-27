/**
 * Edukasi Gadai - 手风琴折叠功能（修复版）
 * 文件：js/edukasi-gadai.js
 * 修复：解决三角符号不旋转和序号重复问题
 */

// 防止重复初始化的标记
let accordionInitialized = false;
let clickListeners = new WeakMap(); // 用于存储事件监听器，避免重复添加

document.addEventListener('DOMContentLoaded', function() {
  // 给DOM更多时间加载
  setTimeout(initAccordion, 200);
});

/**
 * 初始化手风琴功能
 */
function initAccordion() {
  // 防止重复初始化
  if (accordionInitialized) {
    console.log('手风琴已经初始化，跳过');
    return;
  }

  const accordionHeaders = document.querySelectorAll('.accordion-header');
  
  if (accordionHeaders.length === 0) {
    console.log('未找到手风琴元素，等待DOM加载...');
    setTimeout(initAccordion, 500);
    return;
  }
  
  console.log(`找到 ${accordionHeaders.length} 个手风琴项，开始初始化...`);
  
  // 清理可能存在的重复序号
  cleanupDuplicateNumbers();
  
  // 为每个标题添加点击事件和序号
  accordionHeaders.forEach((header, index) => {
    setupAccordionHeader(header, index);
  });
  
  // 默认打开第一个手风琴
  setTimeout(() => {
    const activeHeader = document.querySelector('.accordion-header.active');
    if (!activeHeader && accordionHeaders.length > 0) {
      const firstHeader = accordionHeaders[0];
      const firstContent = firstHeader.nextElementSibling;
      if (firstContent && firstContent.classList.contains('accordion-content')) {
        openAccordion(firstHeader, firstContent);
      }
    }
  }, 400);
  
  // 添加URL哈希支持
  initHashSupport();
  
  // 标记为已初始化
  accordionInitialized = true;
}

/**
 * 设置单个手风琴标题
 */
function setupAccordionHeader(header, index) {
  // 1. 添加序号（如果不存在）
  const existingNumber = header.querySelector('.accordion-number');
  if (!existingNumber) {
    const numberSpan = document.createElement('span');
    numberSpan.className = 'accordion-number';
    numberSpan.textContent = index + 1;
    // 插入到最前面（在文本前面）
    header.insertBefore(numberSpan, header.firstChild);
  }
  
  // 2. 确保箭头元素存在（从HTML中获取，不要重复创建）
  let arrowElement = header.querySelector('.accordion-arrow');
  if (!arrowElement) {
    // 如果没有箭头元素，创建一个
    arrowElement = document.createElement('span');
    arrowElement.className = 'accordion-arrow';
    arrowElement.textContent = '▼';
    header.appendChild(arrowElement);
  }
  
  // 3. 移除旧的点击事件（如果存在）
  const oldListener = clickListeners.get(header);
  if (oldListener) {
    header.removeEventListener('click', oldListener);
  }
  
  // 4. 创建新的点击事件处理函数
  const clickHandler = function() {
    const content = this.nextElementSibling;
    const isActive = this.classList.contains('active');
    
    console.log('点击手风琴:', index + 1, '当前状态:', isActive ? '打开' : '关闭');
    
    if (isActive) {
      // 如果已激活，关闭它
      closeAccordion(this, content);
    } else {
      // 否则关闭所有，然后打开这个
      closeAllAccordions();
      openAccordion(this, content);
    }
  };
  
  // 5. 添加点击事件
  header.addEventListener('click', clickHandler);
  clickListeners.set(header, clickHandler);
  
  // 6. 初始化状态
  const content = header.nextElementSibling;
  if (content && content.classList.contains('accordion-content')) {
    const isActive = header.classList.contains('active');
    if (isActive) {
      content.style.maxHeight = content.scrollHeight + 'px';
      content.setAttribute('data-state', 'open');
    } else {
      content.style.maxHeight = null;
      content.setAttribute('data-state', 'closed');
    }
  }
}

/**
 * 打开手风琴
 */
function openAccordion(header, content) {
  if (!header || !content) {
    console.error('无法打开手风琴: header或content为空');
    return;
  }
  
  console.log('打开手风琴:', header.textContent.trim());
  
  // 1. 添加激活状态
  header.classList.add('active');
  
  // 2. 设置内容高度
  content.style.maxHeight = content.scrollHeight + 'px';
  content.setAttribute('data-state', 'open');
  
  // 3. 调试日志
  console.log('Header类列表:', header.classList.toString());
  console.log('箭头元素:', header.querySelector('.accordion-arrow'));
  
  // 4. 平滑滚动（考虑导航栏高度）
  setTimeout(() => {
    const headerTop = header.getBoundingClientRect().top + window.pageYOffset;
    const navHeight = document.querySelector('.edu-header')?.offsetHeight || 70;
    
    if (headerTop < navHeight + 20) {
      window.scrollTo({
        top: headerTop - navHeight - 10,
        behavior: 'smooth'
      });
    }
  }, 150);
  
  // 5. 更新URL哈希
  updateUrlHash(header);
  
  // 6. 发送分析事件
  sendAnalyticsEvent('accordion_open', header.textContent.trim());
}

/**
 * 关闭手风琴
 */
function closeAccordion(header, content) {
  if (!header || !content) return;
  
  console.log('关闭手风琴:', header.textContent.trim());
  
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
    const content = header.nextElementSibling;
    if (content && content.classList.contains('accordion-content')) {
      content.style.maxHeight = null;
      content.setAttribute('data-state', 'closed');
    }
  });
}

/**
 * 清理重复的序号元素
 */
function cleanupDuplicateNumbers() {
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    if (header) {
      const numbers = header.querySelectorAll('.accordion-number');
      // 如果找到多个序号元素，只保留第一个
      if (numbers.length > 1) {
        for (let i = 1; i < numbers.length; i++) {
          numbers[i].remove();
        }
      }
    }
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
          const targetContent = targetHeader.nextElementSibling;
          if (targetContent) {
            openAccordion(targetHeader, targetContent);
          }
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
          const targetContent = targetHeader.nextElementSibling;
          if (targetContent) {
            openAccordion(targetHeader, targetContent);
          }
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
  accordionInitialized = false;
}

/**
 * 打开特定索引的手风琴
 * @param {number} index - 手风琴索引（从0开始）
 */
function openAccordionByIndex(index) {
  const headers = document.querySelectorAll('.accordion-header');
  if (headers[index]) {
    closeAllAccordions();
    const content = headers[index].nextElementSibling;
    if (content) {
      openAccordion(headers[index], content);
    }
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
      const content = header.nextElementSibling;
      if (content) {
        openAccordion(header, content);
      }
    }
  }
}

/**
 * 重新初始化手风琴（用于动态内容）
 */
function reinitializeAccordion() {
  accordionInitialized = false;
  initAccordion();
}

// 暴露全局函数
window.eduAccordion = {
  init: initAccordion,
  reinit: reinitializeAccordion,
  openAll: function() {
    // 单开模式：只打开第一个
    const headers = document.querySelectorAll('.accordion-header');
    if (headers.length > 0) {
      closeAllAccordions();
      const content = headers[0].nextElementSibling;
      if (content) {
        openAccordion(headers[0], content);
      }
    }
  },
  closeAll: closeAllAccordions,
  openByIndex: openAccordionByIndex,
  openById: openAccordionById,
  reset: resetAccordions
};

// 如果DOM已经加载完成，直接初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAccordion);
} else {
  // DOM已经加载完成
  setTimeout(initAccordion, 100);
}

// 添加一个重试机制，防止某些元素加载较慢
setTimeout(() => {
  const headers = document.querySelectorAll('.accordion-header');
  if (headers.length > 0 && !accordionInitialized) {
    console.log('延迟初始化手风琴...');
    initAccordion();
  }
}, 1000);
