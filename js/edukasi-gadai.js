/**
 * Edukasi Gadai - 手风琴折叠功能
 * 文件：js/edukasi-accordion.js
 */

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    initAccordion();
  }, 100);
});

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
  
  // 默认打开第一个手风琴（从gadai.js中提取）
  setTimeout(() => {
    if (accordionHeaders.length > 0) {
      const firstHeader = accordionHeaders[0];
      const firstContent = firstHeader.nextElementSibling;
      openAccordion(firstHeader, firstContent);
    }
  }, 300);
  
  initHashSupport();
}

function openAccordion(header, content) {
  header.classList.add('active');
  content.style.maxHeight = content.scrollHeight + 'px';
  content.setAttribute('data-state', 'open');
  
  // 改进的滚动逻辑（从gadai.js中提取）
  setTimeout(() => {
    const headerTop = header.getBoundingClientRect().top + window.pageYOffset;
    const navHeight = document.querySelector('.edu-header')?.offsetHeight || 70;
    
    if (headerTop < navHeight + 20) {
      window.scrollTo({
        top: headerTop - navHeight - 10,
        behavior: 'smooth'
      });
    }
  }, 100);
  
  updateUrlHash(header);
  sendAnalyticsEvent('accordion_open', header.textContent.trim());
}

function closeAccordion(header, content) {
  header.classList.remove('active');
  content.style.maxHeight = null;
  content.setAttribute('data-state', 'closed');
  sendAnalyticsEvent('accordion_close', header.textContent.trim());
}

function closeAllAccordions() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.classList.remove('active');
  });
  
  document.querySelectorAll('.accordion-content').forEach(content => {
    content.style.maxHeight = null;
    content.setAttribute('data-state', 'closed');
  });
}

function initHashSupport() {
  if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    const targetSection = document.getElementById(hash);
    
    if (targetSection) {
      setTimeout(() => {
        const targetHeader = targetSection.querySelector('.accordion-header');
        if (targetHeader) {
          closeAllAccordions();
          targetHeader.click();
        }
      }, 800);
    }
  }
  
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

function updateUrlHash(header) {
  const section = header.closest('.accordion-item');
  if (section && section.id) {
    const newHash = `#${section.id}`;
    if (window.location.hash !== newHash) {
      window.history.pushState(null, null, newHash);
    }
  }
}

function sendAnalyticsEvent(action, label) {
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      'event_category': 'accordion_interaction',
      'event_label': label
    });
  }
  
  // 改进的控制台日志（从gadai.js中提取）
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log(`手风琴交互: ${action} - ${label}`);
  }
}

function resetAccordions() {
  closeAllAccordions();
}

function openAccordionByIndex(index) {
  const headers = document.querySelectorAll('.accordion-header');
  if (headers[index]) {
    closeAllAccordions();
    headers[index].click();
  }
}

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

window.eduAccordion = {
  init: initAccordion,
  openAll: function() {
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

// 确保初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAccordion);
} else {
  initAccordion();
}
