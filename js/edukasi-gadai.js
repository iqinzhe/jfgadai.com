/**
 * Edukasi Gadai - Accordion (方案 A：class 驱动)
 */

document.addEventListener('DOMContentLoaded', initAccordion);

function initAccordion() {
  const headers = document.querySelectorAll('.accordion-header');

  if (!headers.length) return;

  headers.forEach((header, index) => {
    // 序号（你原本的功能，保留）
    if (!header.querySelector('.accordion-number')) {
      const num = document.createElement('span');
      num.className = 'accordion-number';
      num.textContent = index + 1;
      header.insertBefore(num, header.firstChild);
    }

    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');

      // 单开模式：先关所有
      closeAllAccordions();

      // 再打开当前（如果原本没开）
      if (!item.classList.contains('active')) {
        item.classList.add('active');
        updateUrlHash(header);
        sendAnalyticsEvent('accordion_open', header.textContent.trim());
      }
    });
  });

  // 默认打开第一个
  const firstItem = headers[0].closest('.accordion-item');
  if (firstItem) firstItem.classList.add('active');

  initHashSupport();
}

function closeAllAccordions() {
  document.querySelectorAll('.accordion-item.active')
    .forEach(item => item.classList.remove('active'));
}

/* ===== 以下功能逻辑保留（与你原本一致） ===== */

function initHashSupport() {
  if (!window.location.hash) return;

  const id = window.location.hash.substring(1);
  const section = document.getElementById(id);
  if (!section) return;

  const header = section.querySelector('.accordion-header');
  if (header) header.click();
}

function updateUrlHash(header) {
  const section = header.closest('.accordion-item');
  if (section?.id) {
    history.replaceState(null, '', `#${section.id}`);
  }
}

function sendAnalyticsEvent(action, label) {
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      event_category: 'accordion_interaction',
      event_label: label
    });
  }
}
