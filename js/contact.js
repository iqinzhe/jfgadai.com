// contact.js - WhatsApp表单处理脚本
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('whatsappForm');
  const submitBtn = document.getElementById('submitBtn');
  const loadingText = document.getElementById('loadingText');
  const formSuccess = document.getElementById('formSuccess');
  
  // 验证KTP号码（16位数字）
  function validateKTP(ktp) {
    const ktpRegex = /^\d{16}$/;
    return ktpRegex.test(ktp);
  }
  
  // 验证手机号码（印尼格式）
  function validatePhone(phone) {
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  }
  
  // 显示错误信息
  function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  }
  
  // 清除错误信息
  function clearError(fieldId) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
  }
  
  // 验证表单
  function validateForm(formData) {
    let isValid = true;
    
    // 验证姓名
    if (!formData.name.trim()) {
      showError('name', 'Nama lengkap harus diisi');
      isValid = false;
    } else {
      clearError('name');
    }
    
    // 验证KTP
    if (!formData.ktp.trim()) {
      showError('ktp', 'Nomor KTP harus diisi');
      isValid = false;
    } else if (!validateKTP(formData.ktp)) {
      showError('ktp', 'Nomor KTP harus 16 digit angka');
      isValid = false;
    } else {
      clearError('ktp');
    }
    
    // 验证手机号码
    if (!formData.phone.trim()) {
      showError('phone', 'Nomor WhatsApp harus diisi');
      isValid = false;
    } else if (!validatePhone(formData.phone)) {
      showError('phone', 'Format nomor WhatsApp tidak valid. Contoh: 081234567890');
      isValid = false;
    } else {
      clearError('phone');
    }
    
    // 验证物品类型
    if (!formData.item) {
      showError('item', 'Pilih jenis barang yang akan digadaikan');
      isValid = false;
    } else {
      clearError('item');
    }
    
    // 验证描述
    if (!formData.description.trim()) {
      showError('description', 'Deskripsi barang harus diisi');
      isValid = false;
    } else if (formData.description.trim().length < 10) {
      showError('description', 'Deskripsi terlalu singkat. Minimal 10 karakter');
      isValid = false;
    } else {
      clearError('description');
    }
    
    return isValid;
  }
  
  // 格式化手机号码
  function formatPhoneNumber(phone) {
    let formattedPhone = phone.replace(/\s+/g, '');
    
    // 如果以0开头，改为62
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '62' + formattedPhone.substring(1);
    }
    // 如果以+62开头，移除+
    else if (formattedPhone.startsWith('+62')) {
      formattedPhone = formattedPhone.substring(1);
    }
    // 如果已经是62开头，保持原样
    
    return formattedPhone;
  }
  
  // 获取物品类型文本
  function getItemTypeText(itemValue) {
    const itemTypes = {
      'motor': 'Motor / Kendaraan',
      'emas': 'Emas / Perhiasan',
      'hp': 'HP / Smartphone',
      'laptop': 'Laptop / Komputer',
      'elektronik': 'Barang Elektronik Lainnya',
      'lainnya': 'Barang Berharga Lainnya'
    };
    return itemTypes[itemValue] || itemValue;
  }
  
  // 构建WhatsApp消息
  function buildWhatsAppMessage(formData) {
    const formattedPhone = formatPhoneNumber(formData.phone);
    const itemTypeText = getItemTypeText(formData.item);
    
    // 构建消息内容
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

    // 编码消息内容
    const encodedMessage = encodeURIComponent(message);
    
    // 构建WhatsApp URL
    return `https://wa.me/6289515692586?text=${encodedMessage}`;
  }
  
  // FAQ功能初始化
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      
      question.addEventListener('click', () => {
        // 如果当前FAQ项已经是激活状态，则关闭它
        if (item.classList.contains('active')) {
          item.classList.remove('active');
        } else {
          // 关闭所有其他FAQ项
          faqItems.forEach(otherItem => {
            if (otherItem !== item) {
              otherItem.classList.remove('active');
            }
          });
          
          // 打开当前FAQ项
          item.classList.add('active');
        }
      });
    });
  }
  
  // 表单提交处理
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // 收集表单数据
      const formData = {
        name: document.getElementById('name').value,
        ktp: document.getElementById('ktp').value,
        phone: document.getElementById('phone').value,
        item: document.getElementById('item').value,
        description: document.getElementById('description').value
      };
      
      // 验证表单
      if (!validateForm(formData)) {
        return;
      }
      
      // 显示加载状态
      if (submitBtn) {
        submitBtn.disabled = true;
        const submitText = submitBtn.querySelector('span');
        if (submitText) submitText.style.display = 'none';
        if (loadingText) loadingText.style.display = 'inline';
      }
            
      // 延迟执行，让用户看到加载状态
      setTimeout(() => {
        // 构建WhatsApp URL
        const whatsappUrl = buildWhatsAppMessage(formData);
        
        // 隐藏表单，显示成功消息
        form.style.display = 'none';
        if (formSuccess) formSuccess.style.display = 'block';
        
        // 在显示成功消息后延迟打开WhatsApp
        setTimeout(() => {
          window.open(whatsappUrl, '_blank');
        }, 1500);
        
      }, 1000);
    });
    
    // 实时验证输入
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        const formData = {
          name: document.getElementById('name').value,
          ktp: document.getElementById('ktp').value,
          phone: document.getElementById('phone').value,
          item: document.getElementById('item').value,
          description: document.getElementById('description').value
        };
        
        // 只验证当前字段
        if (this.id === 'name' && !formData.name.trim()) {
          showError('name', 'Nama lengkap harus diisi');
        } else if (this.id === 'name') {
          clearError('name');
        }
        
        if (this.id === 'ktp' && !formData.ktp.trim()) {
          showError('ktp', 'Nomor KTP harus diisi');
        } else if (this.id === 'ktp' && !validateKTP(formData.ktp)) {
          showError('ktp', 'Nomor KTP harus 16 digit angka');
        } else if (this.id === 'ktp') {
          clearError('ktp');
        }
        
        if (this.id === 'phone' && !formData.phone.trim()) {
          showError('phone', 'Nomor WhatsApp harus diisi');
        } else if (this.id === 'phone' && !validatePhone(formData.phone)) {
          showError('phone', 'Format nomor WhatsApp tidak valid');
        } else if (this.id === 'phone') {
          clearError('phone');
        }
        
        if (this.id === 'item' && !formData.item) {
          showError('item', 'Pilih jenis barang');
        } else if (this.id === 'item') {
          clearError('item');
        }
        
        if (this.id === 'description' && !formData.description.trim()) {
          showError('description', 'Deskripsi barang harus diisi');
        } else if (this.id === 'description' && formData.description.trim().length < 10) {
          showError('description', 'Deskripsi terlalu singkat');
        } else if (this.id === 'description') {
          clearError('description');
        }
      });
      
      // 清除错误信息当用户开始输入时
      input.addEventListener('input', function() {
        clearError(this.id);
      });
    });
  }
  
  // 初始化FAQ功能
  initFAQ();
});
