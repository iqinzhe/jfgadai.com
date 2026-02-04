// electronics.js - 电子设备页面专用脚本
document.addEventListener('DOMContentLoaded', function() {
  // 为品牌标签添加悬停效果
  const brandTags = document.querySelectorAll('.brand-tag');
  brandTags.forEach(tag => {
    tag.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
      this.style.boxShadow = '0 4px 8px rgba(245, 197, 66, 0.2)';
      this.style.backgroundColor = 'rgba(245, 197, 66, 0.25)';
    });
    
    tag.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = 'none';
      this.style.backgroundColor = 'rgba(245, 197, 66, 0.15)';
    });
  });

  // 为WhatsApp按钮添加点击事件
  const whatsappBtn = document.querySelector('.whatsapp-btn');
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', function(e) {
    });
  }

  // 页面加载动画
  const introCard = document.querySelector('.intro-card');
  if (introCard) {
    introCard.style.opacity = '0';
    introCard.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      introCard.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      introCard.style.opacity = '1';
      introCard.style.transform = 'translateY(0)';
    }, 100);
  }

  // 信息卡片加载动画
  const infoCards = document.querySelectorAll('.info-card');
  infoCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(15px)';
    
    setTimeout(() => {
      card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 300);
  });
});
