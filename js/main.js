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
  
  // ==================== 通用触摸反馈函数 ====================
  function addTouchFeedback(element, targetUrl) {
    if (!element || !targetUrl) return;
    
    // 检测是否为触摸设备
    const isTouchDevice = 'ontouchstart' in window || 
                          (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
    
    if (isTouchDevice) {
      // 防止重复绑定事件
      if (element.dataset.touchBound) return;
      element.dataset.touchBound = 'true';
      
      // 添加触摸事件
      element.addEventListener('touchstart', function() {
        this.classList.add('touch-active');
      });
      
      element.addEventListener('touchend', function() {
        this.classList.remove('touch-active');
        this.classList.add('clicked');
        
        // 延迟跳转，让用户看到反馈
        setTimeout(() => {
          if (targetUrl) {
            window.location.href = targetUrl;
          }
        }, 200);
      });
      
      element.addEventListener('touchcancel', function() {
        this.classList.remove('touch-active');
      });
    } else {
      // 防止重复绑定事件
      if (element.dataset.clickBound) return;
      element.dataset.clickBound = 'true';
      
      // 为非触摸设备添加点击效果
      element.addEventListener('click', function() {
        this.classList.add('clicked');
        setTimeout(() => {
          this.classList.remove('clicked');
          if (targetUrl) {
            window.location.href = targetUrl;
          }
        }, 200);
      });
    }
  }
  
  // 教育导航触摸反馈
  const eduIntro = document.querySelector('.service-edu-intro');
  addTouchFeedback(eduIntro, '/edukasi-gadai.html');
  
  // 风险案例导航触摸反馈（确保不与上面的选择器重复选择同一个元素）
  const riskEduIntro = document.querySelector('.contact-form-section .service-edu-intro');
  if (riskEduIntro && riskEduIntro !== eduIntro) {
    addTouchFeedback(riskEduIntro, '/risk-to-success.html');
  }
  
  // ==================== IntersectionObserver 兼容性处理 ====================
  if (!('IntersectionObserver' in window)) {
    // 降级方案：直接显示所有元素
    document.querySelectorAll('.quick-action-card, .grid-item').forEach(item => {
      item.classList.add('fade-in');
    });
  }
});
