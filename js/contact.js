// ==================== contact.js - 联系页面特定JS ====================

document.addEventListener('DOMContentLoaded', function() {
  console.log('联系页面加载完成');
  
  // 复用 rules.js 的手风琴功能
  if (typeof initAccordion === 'function') {
    initAccordion();
  } else {
    // 备用方案
    initSimpleAccordion();
  }
  
  // 初始化表单
  initContactForm();
});

/**
 * 简化版手风琴（备用）
 */
function initSimpleAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');
  
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    if (!header) return;
    
    header.addEventListener('click', () => {
      item.classList.toggle('active');
    });
  });
}

/**
 * 联系表单处理
 */
function initContactForm() {
  const form = document.getElementById('whatsappForm');
  if (!form) return;
  
  // 使用 main.js 中的工具函数（如果可用）
  const whatsappNumber = '6289515692586';
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 收集表单数据
    const formData = {
      name: document.getElementById('name').value.trim(),
      ktp: document.getElementById('ktp').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      item: document.getElementById('item').value,
      description: document.getElementById('description').value.trim()
    };
    
    // 简单验证
    if (!formData.name || !formData.ktp || !formData.phone || !formData.item || !formData.description) {
      alert('Harap isi semua field yang diperlukan.');
      return;
    }
    
    // 构建消息
    const itemTypeText = {
      'motor': 'Motor / Kendaraan',
      'emas': 'Emas / Perhiasan',
      'hp': 'HP / Smartphone',
      'laptop': 'Laptop / Komputer',
      'elektronik': 'Barang Elektronik Lainnya',
      'lainnya': 'Barang Berharga Lainnya'
    }[formData.item] || formData.item;
    
    const message = `Halo JF Gadai, saya ingin konsultasi tentang gadai barang.

*DATA KONSULTASI:*
👤 Nama: ${formData.name}
🆔 KTP: ${formData.ktp}
📱 WhatsApp: ${formData.phone}
🏷️ Jenis Barang: ${itemTypeText}

📝 Deskripsi Barang:
${formData.description}

Mohon info mengenai:
1. Perkiraan nilai taksiran
2. Prosedur dan persyaratan
3. Biaya administrasi

Terima kasih.`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // 显示成功信息
    const formSuccess = document.getElementById('formSuccess');
    if (formSuccess) {
      form.style.display = 'none';
      formSuccess.style.display = 'block';
      
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1000);
    } else {
      window.open(whatsappUrl, '_blank');
    }
    
    // 重置表单
    this.reset();
  });
}