// rules.js - 条款页面专用脚本
document.addEventListener('DOMContentLoaded', function() {
  // 手风琴功能
  const accordionItems = document.querySelectorAll('.accordion-item');
  
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    
    header.addEventListener('click', () => {
      // 关闭其他打开的手风琴项
      accordionItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.accordion-content').style.maxHeight = null;
        }
      });
      
      // 切换当前项
      item.classList.toggle('active');
      
      if (item.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = null;
      }
    });
  });
  
  // 打印按钮功能
  const printBtn = document.querySelector('.print-btn');
  if (printBtn) {
    printBtn.addEventListener('click', function(e) {
      e.preventDefault();
         
      // 打印页面
      window.print();
    });
  }
  
  // WhatsApp按钮点击事件
  const whatsappBtns = document.querySelectorAll('.action-btn');
  whatsappBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      if (this.href.includes('wa.me')) {
      }
    });
  });
  
  // 页面加载动画
  const cards = document.querySelectorAll('.rules-card, .case-study-link, .print-suggestion');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100);
  });
  
  // 自动打开第一个手风琴项
  if (accordionItems.length > 0) {
    setTimeout(() => {
      accordionItems[0].classList.add('active');
      accordionItems[0].querySelector('.accordion-content').style.maxHeight = 
        accordionItems[0].querySelector('.accordion-content').scrollHeight + 'px';
    }, 500);
  }
  
  // 为条款项目添加悬停效果
  const clauseItems = document.querySelectorAll('.clause-item');
  clauseItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
      this.style.transform = 'translateX(5px)';
      this.style.transition = 'all 0.3s ease';
    });
    
    item.addEventListener('mouseleave', function() {
      this.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
      this.style.transform = 'translateX(0)';
    });
  });
});
