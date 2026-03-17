// ==================== faq.js - FAQ功能独立模块 ====================
// 此文件可被任何需要FAQ功能的页面引用，轻量且独立

(function() {
  'use strict';

  /**
   * 初始化FAQ功能
   * @param {string} containerSelector - FAQ容器的选择器（可选，默认为'.faq-section'）
   * @param {Object} options - 配置选项
   */
  function initFAQ(containerSelector = '.faq-section', options = {}) {
    const defaults = {
      itemClass: '.faq-item',
      questionClass: '.faq-question',
      answerClass: '.faq-answer',
      activeClass: 'active',
      closeOthers: false, // 是否在打开一个时关闭其他
      onToggle: null      // 切换时的回调函数
    };

    const config = { ...defaults, ...options };
    
    // 获取FAQ容器
    const container = typeof containerSelector === 'string' 
      ? document.querySelector(containerSelector)
      : containerSelector;
    
    if (!container) {
      console.warn('FAQ container not found:', containerSelector);
      return;
    }

    // 获取所有FAQ项目
    const faqItems = container.querySelectorAll(config.itemClass);
    
    if (!faqItems.length) {
      console.warn('No FAQ items found');
      return;
    }

    // 为每个FAQ项添加点击事件
    faqItems.forEach(item => {
      const question = item.querySelector(config.questionClass);
      
      if (!question) return;

      // 移除可能存在的旧事件监听器（使用新方法）
      question.removeEventListener('click', handleQuestionClick);
      question.addEventListener('click', handleQuestionClick);

      // 存储配置到元素上，供事件处理函数使用
      question._faqConfig = config;
      question._faqItem = item;
      question._faqContainer = container;
    });

    console.log(`✅ FAQ initialized with ${faqItems.length} items`);
  }

  /**
   * 点击问题的事件处理函数
   */
  function handleQuestionClick(e) {
    e.preventDefault();
    
    const question = e.currentTarget;
    const config = question._faqConfig;
    const item = question._faqItem;
    const container = question._faqContainer;

    if (!item || !config) return;

    // 如果配置为关闭其他，则关闭所有其他FAQ项
    if (config.closeOthers) {
      const allItems = container.querySelectorAll(config.itemClass);
      allItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove(config.activeClass);
        }
      });
    }

    // 切换当前项的active类
    item.classList.toggle(config.activeClass);

    // 如果有回调函数，执行它
    if (typeof config.onToggle === 'function') {
      config.onToggle(item, item.classList.contains(config.activeClass));
    }
  }

  /**
   * 手动打开指定的FAQ项
   * @param {HTMLElement} item - FAQ项元素
   */
  function openFAQItem(item) {
    if (item && !item.classList.contains('active')) {
      item.classList.add('active');
    }
  }

  /**
   * 手动关闭指定的FAQ项
   * @param {HTMLElement} item - FAQ项元素
   */
  function closeFAQItem(item) {
    if (item && item.classList.contains('active')) {
      item.classList.remove('active');
    }
  }

  /**
   * 打开所有FAQ项
   * @param {string|HTMLElement} container - FAQ容器
   */
  function openAllFAQ(container) {
    const items = typeof container === 'string' 
      ? document.querySelectorAll(`${container} .faq-item`)
      : container.querySelectorAll('.faq-item');
    
    items.forEach(item => item.classList.add('active'));
  }

  /**
   * 关闭所有FAQ项
   * @param {string|HTMLElement} container - FAQ容器
   */
  function closeAllFAQ(container) {
    const items = typeof container === 'string' 
      ? document.querySelectorAll(`${container} .faq-item`)
      : container.querySelectorAll('.faq-item');
    
    items.forEach(item => item.classList.remove('active'));
  }

  // 导出公共API
  window.FAQ = {
    init: initFAQ,
    openItem: openFAQItem,
    closeItem: closeFAQItem,
    openAll: openAllFAQ,
    closeAll: closeAllFAQ
  };

  // 自动初始化（如果页面中有FAQ）
document.addEventListener('DOMContentLoaded', function() {
  if (document.querySelector('.faq-section')) {
    // 自定义配置
    initFAQ('.faq-section', {
      closeOthers: true,           // 一次只打开一个
      activeClass: 'active',       // 激活状态的类名
      onToggle: function(item, isOpen) {
        // 可选：添加切换时的回调函数
        console.log('FAQ toggled:', isOpen ? '打开' : '关闭');
      }
    });
  }
});

console.log('✅ faq.js loaded - FAQ module ready');
