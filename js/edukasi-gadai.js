/**
 * Edukasi Gadai - 手风琴折叠功能（默认全部关闭版）
 * 文件：js/edukasi-gadai.js
 * 特点：默认全部关闭，用户自主点击打开
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
  
  // 确保所有手风琴初始状态为关闭
  closeAllAccordions();
  
  // 为每个标题添加点击事件和序号
  accordionHeaders.forEach((header, index) => {
    setupAccordionHeader(header, index);
  });
  
  // 移除默认打开第一个的逻辑
  // 用户需要点击才能打开，提高二次访问体验
  
  // 添加URL哈希支持（用户可以通过URL直接打开特定部分）
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
    header.insertBefore(numberSpan, header.firstChild);
  }
  
  // 2. 确保箭头元素存在
  let arrowElement = header.querySelector('.accordion-arrow');
  if (!arrowElement) {
    arrowElement = document.createElement('span');
    arrowElement.className = 'accordion-arrow';
    arrowElement.textContent = '▼';
    header.appendChild(arrowElement);
  }
  
  // 3. 移除旧的点击事件
  const oldListener = clickListeners.get(header);
  if (oldListener) {
    header.removeEventListener('click', oldListener);
  }
  
  // 4. 创建新的点击事件处理函数（单开模式）
  const clickHandler = function() {
    const content = this.nextElementSibling;
    const isActive = this.classList.contains('active');
    
    if (isActive) {
      // 如果已打开，关闭它
      closeAccordion(this, content);
    } else {
      // 单开模式：先关闭所有，再打开这个
      closeAllAccordions();
      openAccordion(this, content);
    }
  };
  
  // 5. 添加点击事件
  header.addEventListener('click', clickHandler);
  clickListeners.set(header, clickHandler);
  
  // 6. 初始化状态（确保关闭）
  const content = header.nextElementSibling;
  if (content && content.classList.contains('accordion-content')) {
    header.classList.remove('active');
    content.style.maxHeight = null;
    content.setAttribute('data-state', 'closed');
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
  
  // 3. 平滑滚动（考虑导航栏高度）- 只在需要时滚动
  setTimeout(() => {
    const headerTop = header.getBoundingClientRect().top + window.pageYOffset;
    const navHeight = document.querySelector('.edu-header')?.offsetHeight || 70;
    const viewportHeight = window.innerHeight;
    
    // 如果header在导航栏下面不远，或者完全在视窗外，才滚动
    if (headerTop < navHeight + 50 || headerTop > window.pageYOffset + viewportHeight - 100) {
      window.scrollTo({
        top: headerTop - navHeight - 20,
        behavior: 'smooth'
      });
    }
  }, 150);
  
  // 4. 更新URL哈希（这样用户可以分享链接直接打开特定部分）
  updateUrlHash(header);
  
  // 5. 发送分析事件
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
  
  // 可选：从URL移除哈希
  removeUrlHashIfMatches(header);
  
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
  
  // 清除URL哈希
  clearUrlHash();
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
          // 先关闭所有
          closeAllAccordions();
          // 然后打开目标手风琴
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
    } else {
      // 如果哈希被清除了，关闭所有手风琴
      closeAllAccordions();
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
 * 从URL移除哈希（如果匹配）
 */
function removeUrlHashIfMatches(header) {
  const section = header.closest('.accordion-item');
  if (section && section.id && window.location.hash === `#${section.id}`) {
    // 使用replaceState而不是pushState，这样不会记录到历史记录
    window.history.replaceState(null, null, window.location.pathname + window.location.search);
  }
}

/**
 * 清除URL哈希
 */
function clearUrlHash() {
  if (window.location.hash) {
    window.history.replaceState(null, null, window.location.pathname + window.location.search);
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
    // 关闭其他所有
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
      // 关闭其他所有
      closeAllAccordions();
      const content = header.nextElementSibling;
      if (content) {
        openAccordion(header, content);
      }
    }
  }
}

/**
 * 切换手风琴状态（开/关）
 * @param {number} index - 手风琴索引
 */
function toggleAccordionByIndex(index) {
  const headers = document.querySelectorAll('.accordion-header');
  if (headers[index]) {
    const header = headers[index];
    const content = header.nextElementSibling;
    if (content) {
      if (header.classList.contains('active')) {
        closeAccordion(header, content);
      } else {
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
  
  // 打开/关闭功能
  openAll: function() {
    // 打开所有手风琴（多开模式）
    document.querySelectorAll('.accordion-header').forEach(header => {
      const content = header.nextElementSibling;
      if (content && !header.classList.contains('active')) {
        openAccordion(header, content);
      }
    });
  },
  
  closeAll: closeAllAccordions,
  
  // 控制特定手风琴
  openByIndex: openAccordionByIndex,
  openById: openAccordionById,
  toggleByIndex: toggleAccordionByIndex,
  
  // 重置
  reset: resetAccordions,
  
  // 查询状态
  getState: function() {
    const states = {};
    document.querySelectorAll('.accordion-item').forEach((item, index) => {
      const header = item.querySelector('.accordion-header');
      states[index + 1] = {
        id: item.id,
        title: header.textContent.trim(),
        isOpen: header.classList.contains('active')
      };
    });
    return states;
  }
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

// 添加键盘支持（可选功能）
document.addEventListener('keydown', function(e) {
  // 如果用户按ESC键，关闭所有手风琴
  if (e.key === 'Escape') {
    closeAllAccordions();
  }
  
  // 如果用户按数字键1-9，打开对应手风琴（可选）
  if (e.key >= '1' && e.key <= '9' && !e.ctrlKey && !e.altKey && !e.metaKey) {
    const index = parseInt(e.key) - 1;
    const headers = document.querySelectorAll('.accordion-header');
    if (headers[index]) {
      e.preventDefault();
      toggleAccordionByIndex(index);
    }
  }
});
