// ==================== faq.js - FIXED ====================
(function () {
  'use strict';

  function initFAQ(containerSelector = '.faq-section', options = {}) {
    const defaults = {
      itemClass: '.faq-item',
      questionClass: '.faq-question',
      activeClass: 'active',
      closeOthers: false,
      onToggle: null
    };

    const config = { ...defaults, ...options };

    const container =
      typeof containerSelector === 'string'
        ? document.querySelector(containerSelector)
        : containerSelector;

    if (!container) {
      console.warn('❌ FAQ container not found:', containerSelector);
      return;
    }

    const faqItems = container.querySelectorAll(config.itemClass);

    if (!faqItems.length) {
      console.warn('❌ No FAQ items found');
      return;
    }

    faqItems.forEach((item) => {
      const question = item.querySelector(config.questionClass);
      if (!question) return;

      // ⭐ 防止重复绑定
      if (question.dataset.faqBound === 'true') return;

      question.addEventListener('click', function (e) {
        e.preventDefault();

        // 👉 关闭其他
        if (config.closeOthers) {
          faqItems.forEach((otherItem) => {
            if (otherItem !== item) {
              otherItem.classList.remove(config.activeClass);
            }
          });
        }

        // 👉 切换当前
        item.classList.toggle(config.activeClass);

        // 👉 回调
        if (typeof config.onToggle === 'function') {
          config.onToggle(item, item.classList.contains(config.activeClass));
        }
      });

      // 标记已绑定
      question.dataset.faqBound = 'true';
    });

    console.log(`✅ FAQ initialized (${faqItems.length})`);
  }

  // 暴露API
  window.FAQ = {
    init: initFAQ
  };

  // ⭐ 更稳：页面完全加载后再执行
  window.addEventListener('load', function () {
    if (document.querySelector('.faq-section')) {
      initFAQ('.faq-section', {
        closeOthers: true
      });
    }
  });
})();
