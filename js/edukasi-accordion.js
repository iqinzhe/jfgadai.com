/**
 * Edukasi Gadai - 手风琴折叠功能
 */

document.addEventListener('DOMContentLoaded', function() {
  // 初始化手风琴功能
  initAccordion();
  
  // 初始化大纲导航
  initOutlineNavigation();
});

/**
 * 手风琴功能
 */
function initAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  
  // 默认全部闭合
  closeAllAccordions();
  
  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const item = this.parentElement;
      const content = this.nextElementSibling;
      const isActive = this.classList.contains('active');
      
      // 如果点击的是已激活的，则关闭它
      if (isActive) {
        closeAccordion(this, content);
      } else {
        // 先关闭所有其他的
        closeAllAccordions();
        // 再打开当前这个
        openAccordion(this, content);
      }
    });
  });
}

/**
 * 打开手风琴
 */
function openAccordion(header, content) {
  header.classList.add('active');
  content.style.maxHeight = content.scrollHeight + 'px';
  
  // 添加一个小的延迟，确保DOM更新后再滚动
  setTimeout(() => {
    header.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }, 100);
}

/**
 * 关闭手风琴
 */
function closeAccordion(header, content) {
  header.classList.remove('active');
  content.style.maxHeight = null;
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
  });
}

/**
 * 初始化大纲导航
 */
function initOutlineNavigation() {
  const outlineLinks = document.querySelectorAll('.outline-nav a');
  
  outlineLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetHeader = document.querySelector(`[data-section="${targetId}"]`);
      
      if (targetHeader) {
        // 关闭所有手风琴
        closeAllAccordions();
        // 点击目标手风琴
        targetHeader.click();
      }
    });
  });
}

/**
 * 创建大纲导航（可选功能）
 */
function createOutlineNavigation() {
  const outlineContainer = document.querySelector('.outline-nav');
  if (!outlineContainer) return;
  
  const sections = document.querySelectorAll('.accordion-item');
  let html = '<ul>';
  
  sections.forEach(section => {
    const header = section.querySelector('.accordion-header');
    const sectionId = header.textContent.toLowerCase().replace(/\s+/g, '-');
    const sectionTitle = header.textContent;
    
    // 添加data-section属性以便导航
    header.setAttribute('data-section', sectionId);
    
    html += `
      <li>
        <a href="#${sectionId}" class="outline-link">${sectionTitle}</a>
      </li>
    `;
  });
  
  html += '</ul>';
  outlineContainer.innerHTML = html;
}