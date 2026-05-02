/**
 * ==================== APP DASHBOARD CORE ====================
 * 核心仪表盘框架管理
 * 
 * 功能：
 * - renderShell() - 初始化仪表盘壳层（侧边栏 + 主内容区）
 * - setPageContent() - 动态设置主内容
 * - toggleSidebar() - 移动端切换侧边栏
 * - ensureLayout() - 确保任何页面都有正确的布局
 */

(function() {
  'use strict';

  // ==================== 全局配置 ====================
  const config = {
    shellSelector: '#dashboard-shell',
    sidebarSelector: '.dashboard-sidebar',
    mainContentSelector: '.dashboard-main-content',
    breakpoint: 768 // 手机/桌面端分界点
  };

  // ==================== 仪表盘壳层结构 ====================
  const shellHTML = `
    <div class="dashboard-v2">
      <aside class="dashboard-sidebar">
        <!-- 侧边栏内容由原始 dashboard.html 提供或注入 -->
        <div class="sidebar-content"></div>
      </aside>
      <main class="dashboard-main-content">
        <!-- 页面主内容将注入到这里 -->
        <div class="main-content-wrapper"></div>
      </main>
    </div>
  `;

  // ==================== API 对象 ====================
  window.DashboardApp = {
    /**
     * 初始化仪表盘壳层
     * @param {HTMLElement|string} container - 容器元素或选择器
     * @param {Object} options - 配置选项
     */
    renderShell: function(container, options = {}) {
      const opts = { ...config, ...options };
      const targetContainer = typeof container === 'string' 
        ? document.querySelector(container) 
        : container;

      if (!targetContainer) {
        console.error('❌ Dashboard shell container not found');
        return false;
      }

      // 插入壳层HTML
      targetContainer.innerHTML = shellHTML;

      // 初始化响应式行为
      this._initResponsiveBehavior();
      console.log('✅ Dashboard shell rendered');
      return true;
    },

    /**
     * 设置主内容区的内容
     * @param {string|HTMLElement} content - 内容HTML或元素
     * @param {Object} options - 选项
     */
    setPageContent: function(content, options = {}) {
      const mainWrapper = document.querySelector(
        `${config.shellSelector} .main-content-wrapper`
      );

      if (!mainWrapper) {
        console.error('❌ Main content wrapper not found');
        return false;
      }

      if (typeof content === 'string') {
        mainWrapper.innerHTML = content;
      } else if (content instanceof HTMLElement) {
        mainWrapper.innerHTML = '';
        mainWrapper.appendChild(content);
      }

      // 重新初始化页面特定脚本
      this._reinitializePageScripts();
      console.log('✅ Page content updated');
      return true;
    },

    /**
     * 设置侧边栏内容（支持动态注入）
     * @param {string|HTMLElement} content - 侧边栏内容
     */
    setSidebarContent: function(content) {
      const sidebarContent = document.querySelector(
        `${config.shellSelector} .sidebar-content`
      );

      if (!sidebarContent) {
        console.error('❌ Sidebar content area not found');
        return false;
      }

      if (typeof content === 'string') {
        sidebarContent.innerHTML = content;
      } else if (content instanceof HTMLElement) {
        sidebarContent.innerHTML = '';
        sidebarContent.appendChild(content);
      }

      console.log('✅ Sidebar content updated');
      return true;
    },

    /**
     * 切换侧边栏（移动端）
     */
    toggleSidebar: function() {
      const dashboard = document.querySelector(config.shellSelector);
      if (dashboard) {
        dashboard.classList.toggle('sidebar-open');
      }
    },

    /**
     * 关闭侧边栏（移动端）
     */
    closeSidebar: function() {
      const dashboard = document.querySelector(config.shellSelector);
      if (dashboard) {
        dashboard.classList.remove('sidebar-open');
      }
    },

    /**
     * 确保页面拥有正确的布局框架
     * 如果页面不是 dashboard 页面，则注入布局框架
     */
    ensureLayout: function() {
      const existingShell = document.querySelector(config.shellSelector);
      
      // 如果已存在壳层，不再重复创建
      if (existingShell) {
        return true;
      }

      // 创建容器并插入壳层
      const container = document.createElement('div');
      container.id = 'dashboard-shell';
      document.body.innerHTML = '';
      document.body.appendChild(container);

      return this.renderShell(container);
    },

    /**
     * 获取当前视口大小
     */
    getViewportSize: function() {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth <= config.breakpoint
      };
    },

    /**
     * 内部：初始化响应式行为
     */
    _initResponsiveBehavior: function() {
      const dashboard = document.querySelector(config.shellSelector);
      if (!dashboard) return;

      // 监听窗口大小变化
      window.addEventListener('resize', () => {
        const viewport = this.getViewportSize();
        
        // 桌面端自动关闭侧边栏菜单
        if (!viewport.isMobile) {
          dashboard.classList.remove('sidebar-open');
        }
      });

      // 移动端：点击主内容区关闭侧边栏
      const mainContent = dashboard.querySelector(config.mainContentSelector);
      if (mainContent && this.getViewportSize().isMobile) {
        mainContent.addEventListener('click', () => {
          this.closeSidebar();
        });
      }

      console.log('✅ Responsive behavior initialized');
    },

    /**
     * 内部：重新初始化页面特定脚本
     * 在动态加载内容后调用此方法以重新绑定事件处理程序
     */
    _reinitializePageScripts: function() {
      // 触发自定义事件，允许页面脚本监听
      const event = new Event('pageContentLoaded', { bubbles: true });
      document.dispatchEvent(event);

      // 重新初始化常见模块
      if (typeof FAQ !== 'undefined' && FAQ.init) {
        FAQ.init('.faq-section', { closeOthers: true });
      }

      // 重新初始化其他需要的模块（根据需要扩展）
      if (typeof initBrandTags !== 'undefined') {
        initBrandTags();
      }

      if (typeof initCaseToggles !== 'undefined') {
        initCaseToggles();
      }

      console.log('✅ Page scripts reinitialized');
    }
  };

  // ==================== 页面加载时自动初始化 ====================
  document.addEventListener('DOMContentLoaded', function() {
    // 检查是否存在 dashboard shell
    if (!document.querySelector('#dashboard-shell')) {
      console.log('ℹ️ No dashboard shell found on page load');
      return;
    }

    // 初始化响应式行为
    DashboardApp._initResponsiveBehavior();
  });

  console.log('✅ app-dashboard-core.js loaded');
})();
