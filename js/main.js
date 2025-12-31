// 表单处理
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('consultationForm');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        item: document.getElementById('item').value,
        message: document.getElementById('message').value
      };
      
      const whatsappNumber = '6289515692586';
      const message = `Halo JF Gadai, saya ${formData.name} ingin konsultasi tentang gadai ${formData.item}. Nomor saya: ${formData.phone}. Pesan: ${formData.message || 'Tidak ada pesan tambahan'}`;
      const encodedMessage = encodeURIComponent(message);
      
      window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
      this.reset();
      alert('Terima kasih! Anda akan diarahkan ke WhatsApp untuk konsultasi langsung.');
    });
  }
  
  // 滚动动画
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  }, { threshold: 0.1 });
  
  // 观察所有需要动画的元素
  document.querySelectorAll('.quick-action-card, .grid-item, .assessment-card').forEach(item => {
    observer.observe(item);
  });
  
  // 平滑滚动到位置
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // ==================== 横幅高度调整（改进版） ====================
  // 根据屏幕尺寸动态设置横幅高度
  function adjustBannerHeight() {
    const banner = document.querySelector('.full-banner');
    if (!banner) return;
    
    const screenHeight = window.innerHeight;
    const screenWidth = window.innerWidth;
    
// ==================== 横幅高度调整（优化版） ====================
function adjustBannerHeight() {
  const banner = document.querySelector('.full-banner');
  if (!banner) return;
  
  const screenHeight = window.innerHeight;
  const screenWidth = window.innerWidth;
  
  // 调整横幅栏框高度（可根据需要修改）
  if (screenWidth < 480) { // 超小手机
    banner.style.height = '30vh'; // 增加高度
  } else if (screenWidth < 768) { // 手机
    banner.style.height = '35vh';
  } else if (screenWidth < 1024) { // 平板
    banner.style.height = '40vh';
  } else { // 桌面
    if (screenHeight > 1000) {
      banner.style.height = '50vh'; // 大屏幕增加高度
    } else if (screenHeight > 800) {
      banner.style.height = '45vh';
    } else {
      banner.style.height = '40vh';
    }
  }
  
  // 强制图片填满整个栏框
  const bannerImg = banner.querySelector('img');
  if (bannerImg) {
    bannerImg.style.width = '100%';
    bannerImg.style.height = '100%';
    bannerImg.style.objectFit = 'cover'; // 确保填满
    bannerImg.style.objectPosition = 'center center';
    bannerImg.style.display = 'block';
  }
}
  // 初始化横幅高度
  adjustBannerHeight();
  
  // 窗口大小变化时调整（防抖处理，避免频繁触发）
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      adjustBannerHeight();
    }, 250);
  });
  
  // 页面完全加载后再次调整（确保图片已加载）
  window.addEventListener('load', function() {
    setTimeout(adjustBannerHeight, 100);
  });
});
