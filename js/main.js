// 表单处理
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('consultationForm');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // 简单表单验证
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const item = document.getElementById('item').value.trim();
      
      if (!name || !phone || !item) {
        alert('Harap isi nama, nomor telepon, dan barang yang ingin digadaikan.');
        return;
      }
      
      const formData = {
        name: name,
        phone: phone,
        item: item,
        message: document.getElementById('message').value.trim()
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
  
  // ==================== 防误触导航处理 ====================
  const navButtons = document.querySelectorAll('.edu-navigation-btn');
  
  navButtons.forEach(button => {
    // 防止重复绑定
    if (button.dataset.navBound) return;
    button.dataset.navBound = 'true';
    
    // 移除旧的onclick事件
    const parentContainer = button.closest('.service-edu-container');
    if (parentContainer) {
      const oldIntro = parentContainer.querySelector('.service-edu-intro');
      if (oldIntro) {
        oldIntro.removeAttribute('onclick');
        oldIntro.style.cursor = 'default';
      }
    }
    
    // 绑定新的事件
    button.addEventListener('click', function() {
      const url = this.getAttribute('data-url');
      if (url) {
        // 视觉反馈
        this.style.transform = 'scale(0.98)';
        this.style.transition = 'transform 0.1s ease';
        
        // 延迟跳转，让用户看到反馈
        setTimeout(() => {
          window.location.href = url;
        }, 150);
      }
    });
  });
  
  // ==================== IntersectionObserver 兼容性处理 ====================
  if (!('IntersectionObserver' in window)) {
    // 降级方案：直接显示所有元素
    document.querySelectorAll('.quick-action-card, .grid-item').forEach(item => {
      item.classList.add('fade-in');
    });
  }
});
