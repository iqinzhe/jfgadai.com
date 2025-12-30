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
  
  // 观察所有元素
  document.querySelectorAll('.quick-action-card, .grid-item').forEach(item => {
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
  
  // 横幅高度调整
  function adjustBannerHeight() {
    const banner = document.querySelector('.full-banner');
    const screenHeight = window.innerHeight;
    const screenWidth = window.innerWidth;
    
    if (screenWidth < 768) {
      banner.style.height = '50vh';
    } else if (screenHeight > 900) {
      banner.style.height = '65vh';
    } else {
      banner.style.height = '70vh';
    }
  }
  
  // 窗口大小变化时调整
  window.addEventListener('resize', adjustBannerHeight);
  window.addEventListener('load', adjustBannerHeight);
});