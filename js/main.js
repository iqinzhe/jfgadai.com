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
  
  // ==================== 新增：教育导航触摸反馈 ====================
  const eduIntro = document.querySelector('.service-edu-intro');
  
  if (eduIntro) {
    // 检测是否为触摸设备
    const isTouchDevice = 'ontouchstart' in window || 
                          (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
    
    if (isTouchDevice) {
      // 添加触摸事件
      eduIntro.addEventListener('touchstart', function() {
        this.classList.add('touch-active');
      });
      
      eduIntro.addEventListener('touchend', function() {
        this.classList.remove('touch-active');
        this.classList.add('clicked');
        
        // 延迟跳转，让用户看到反馈
        setTimeout(() => {
          window.location.href = '/edukasi-gadai.html';
        }, 200);
      });
      
      eduIntro.addEventListener('touchcancel', function() {
        this.classList.remove('touch-active');
      });
    }
    
    // 为非触摸设备添加点击效果（可选）
    if (!isTouchDevice) {
      eduIntro.addEventListener('click', function() {
        this.classList.add('clicked');
        setTimeout(() => {
          this.classList.remove('clicked');
        }, 200);
      });
    }
  }
  // ==================== 新增结束 ====================
});

  // ==================== 新增：风险案例导航触摸反馈 ====================
  const riskEduIntro = document.querySelector('.contact-form-section .service-edu-intro');
  
  if (riskEduIntro) {
    // 检测是否为触摸设备
    const isTouchDevice = 'ontouchstart' in window || 
                          (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
    
    if (isTouchDevice) {
      // 添加触摸事件
      riskEduIntro.addEventListener('touchstart', function() {
        this.classList.add('touch-active');
      });
      
      riskEduIntro.addEventListener('touchend', function() {
        this.classList.remove('touch-active');
        this.classList.add('clicked');
        
        // 延迟跳转，让用户看到反馈
        setTimeout(() => {
          window.location.href = '/risk-to-success.html';
        }, 200);
      });
      
      riskEduIntro.addEventListener('touchcancel', function() {
        this.classList.remove('touch-active');
      });
    }
    
    // 为非触摸设备添加点击效果（可选）
    if (!isTouchDevice) {
      riskEduIntro.addEventListener('click', function() {
        this.classList.add('clicked');
        setTimeout(() => {
          this.classList.remove('clicked');
        }, 200);
      });
    }
  }
}); 
  // ==================== 新增结束 ====================
