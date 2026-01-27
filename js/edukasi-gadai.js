/* Edukasi Gadai - Accordion */

document.addEventListener('DOMContentLoaded', () => {
  const headers = document.querySelectorAll('.accordion-header');

  if (!headers.length) return;

  headers.forEach((header, index) => {
    if (!header.querySelector('.accordion-number')) {
      const num = document.createElement('span');
      num.className = 'accordion-number';
      num.textContent = index + 1;
      header.insertBefore(num, header.firstChild);
    }

    header.addEventListener('click', () => {
      const item = header.parentElement; // ⚠️ 你的真实结构就是直接父级

      const isOpen = item.classList.contains('active');

      // 先关闭所有
      document.querySelectorAll('.accordion-item.active')
        .forEach(el => el.classList.remove('active'));

      // 如果刚才是关闭状态 → 打开它
      if (!isOpen) {
        item.classList.add('active');
        updateUrlHash(item);
        sendAnalyticsEvent('accordion_open', header.innerText.trim());
      }
    });
  });
});

function updateUrlHash(item) {
  if (item.id) {
    history.replaceState(null, '', `#${item.id}`);
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
