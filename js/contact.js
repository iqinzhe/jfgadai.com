// ==================== contact.js - 联系页面专用 ====================

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
  console.log('contact.js - 联系页面加载');
  
  // 初始化FAQ功能
  initFaqAccordion();
  
  // 初始化联系表单
  initContactForm();
});

// ==================== FAQ手风琴功能 ====================
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  if (!faqItems.length) {
    console.log('没有找到FAQ元素');
    return;
  }
  
  faqItems.forEach(function(item) {
    const question = item.querySelector('.faq-question');
    
    if (question) {
      question.addEventListener('click', function(e) {
        e.preventDefault();
        
        // 切换当前项的open类
        if (item.classList.contains('open')) {
          item.classList.remove('open');
        } else {
          item.classList.add('open');
        }
      });
    }
  });
  
  console.log('FAQ初始化完成');
}

// ==================== 表单验证工具 ====================
const formValidator = {
  // 验证必填字段
  validateRequired: function(value) {
    return value && value.trim() !== '';
  },
  
  // 验证最小长度
  validateMinLength: function(value, min) {
    return value && value.trim().length >= min;
  },
  
  // 验证印尼手机号 (简单版)
  validatePhoneID: function(phone) {
    const phoneStr = phone.replace(/\D/g, '');
    return phoneStr.length >= 10 && phoneStr.length <= 13;
  },
  
  // 验证KTP (16位数字)
  validateKTP: function(ktp) {
    const ktpStr = ktp.replace(/\D/g, '');
    return ktpStr.length === 16;
  },
  
  // 显示错误信息
  showError: function(fieldId, message) {
    const errorDiv = document.getElementById(fieldId + 'Error');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
    }
  },
  
  // 清除错误信息
  clearError: function(fieldId) {
    const errorDiv = document.getElementById(fieldId + 'Error');
    if (errorDiv) {
      errorDiv.style.display = 'none';
    }
  }
};

// ==================== WhatsApp工具 ====================
const whatsappUtils = {
  // 构建WhatsApp URL
  buildURL: function(phone, message) {
    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.substring(1) : cleanPhone;
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
  }
};

// ==================== 联系人表单功能 ====================
function initContactForm() {
  const form = document.getElementById('whatsappForm');
  
  if (!form) {
    console.log('不在联系页面，跳过表单初始化');
    return;
  }
  
  const submitBtn = document.getElementById('submitBtn');
  const loadingText = document.getElementById('loadingText');
  const formSuccess = document.getElementById('formSuccess');
  
  // 物品类型映射
  const itemTypes = {
    'motor': 'Motor / Kendaraan',
    'emas': 'Emas / Perhiasan',
    'hp': 'HP / Smartphone',
    'laptop': 'Laptop / Komputer',
    'elektronik': 'Barang Elektronik Lainnya',
    'lainnya': 'Barang Berharga Lainnya'
  };
  
  // 表单提交处理
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 收集表单数据
    const formData = {
      name: document.getElementById('name')?.value || '',
      phone: document.getElementById('phone')?.value || '',
      item: document.getElementById('item')?.value || '',
      description: document.getElementById('description')?.value || ''
    };
    
    // 验证表单
    if (!validateContactForm(formData)) {
      return;
    }
    
    // 显示加载状态
    if (submitBtn) {
      submitBtn.disabled = true;
      const submitText = submitBtn.querySelector('span:first-child');
      if (submitText) submitText.style.display = 'none';
      if (loadingText) loadingText.style.display = 'inline';
    }
    
    // 模拟发送延迟
    setTimeout(function() {
      // 构建WhatsApp消息
      const message = buildContactMessage(formData);
      const adminPhone = '6289515692586'; // 管理员手机号
      const whatsappUrl = whatsappUtils.buildURL(adminPhone, message);
      
      // 隐藏表单，显示成功消息
      form.style.display = 'none';
      if (formSuccess) {
        formSuccess.style.display = 'block';
        
        // 更新成功消息中的链接
        const successLink = formSuccess.querySelector('.whatsapp-link');
        if (successLink) {
          successLink.href = whatsappUrl;
        }
      }
      
      // 延迟打开WhatsApp
      setTimeout(function() {
        window.open(whatsappUrl, '_blank');
      }, 1500);
      
      // 重置按钮状态
      if (submitBtn) {
        submitBtn.disabled = false;
        const submitText = submitBtn.querySelector('span:first-child');
        if (submitText) submitText.style.display = 'inline';
        if (loadingText) loadingText.style.display = 'none';
      }
      
    }, 1000);
  });
  
  // 实时验证
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(function(input) {
    input.addEventListener('blur', function() {
      validateContactField(this.id, this.value);
    });
    
    input.addEventListener('input', function() {
      formValidator.clearError(this.id);
    });
  });
  
  console.log('联系表单初始化完成');
}

// 联系人表单验证
function validateContactForm(formData) {
  let isValid = true;
  
  // 验证姓名
  if (!formValidator.validateRequired(formData.name)) {
    formValidator.showError('name', 'Nama lengkap harus diisi');
    isValid = false;
  } else {
    formValidator.clearError('name');
  }
  
  // 验证手机号码
  if (!formValidator.validateRequired(formData.phone)) {
    formValidator.showError('phone', 'Nomor WhatsApp harus diisi');
    isValid = false;
  } else if (!formValidator.validatePhoneID(formData.phone)) {
    formValidator.showError('phone', 'Format nomor WhatsApp tidak valid. Contoh: 081234567890');
    isValid = false;
  } else {
    formValidator.clearError('phone');
  }
  
  // 验证物品类型
  if (!formData.item) {
    formValidator.showError('item', 'Pilih jenis barang yang akan digadaikan');
    isValid = false;
  } else {
    formValidator.clearError('item');
  }
  
  // 验证描述
  if (!formValidator.validateRequired(formData.description)) {
    formValidator.showError('description', 'Deskripsi barang harus diisi');
    isValid = false;
  } else if (!formValidator.validateMinLength(formData.description, 10)) {
    formValidator.showError('description', 'Deskripsi terlalu singkat. Minimal 10 karakter');
    isValid = false;
  } else {
    formValidator.clearError('description');
  }
  
  return isValid;
}

// 验证单个字段
function validateContactField(fieldId, value) {
  switch(fieldId) {
    case 'name':
      if (!formValidator.validateRequired(value)) {
        formValidator.showError('name', 'Nama lengkap harus diisi');
      } else {
        formValidator.clearError('name');
      }
      break;
      
    case 'phone':
      if (!formValidator.validateRequired(value)) {
        formValidator.showError('phone', 'Nomor WhatsApp harus diisi');
      } else if (!formValidator.validatePhoneID(value)) {
        formValidator.showError('phone', 'Format nomor WhatsApp tidak valid');
      } else {
        formValidator.clearError('phone');
      }
      break;
      
    case 'item':
      if (!value) {
        formValidator.showError('item', 'Pilih jenis barang');
      } else {
        formValidator.clearError('item');
      }
      break;
      
    case 'description':
      if (!formValidator.validateRequired(value)) {
        formValidator.showError('description', 'Deskripsi barang harus diisi');
      } else if (!formValidator.validateMinLength(value, 10)) {
        formValidator.showError('description', 'Deskripsi terlalu singkat');
      } else {
        formValidator.clearError('description');
      }
      break;
  }
}

// 构建联系人消息
function buildContactMessage(formData) {
  const itemTypes = {
    'motor': 'Motor / Kendaraan',
    'emas': 'Emas / Perhiasan',
    'hp': 'HP / Smartphone',
    'laptop': 'Laptop / Komputer',
    'elektronik': 'Barang Elektronik Lainnya',
    'lainnya': 'Barang Berharga Lainnya'
  };
  
  const itemTypeText = itemTypes[formData.item] || formData.item;
  
  return `Halo JF Gadai, saya ingin konsultasi tentang gadai barang.

*DATA KONSULTASI:*
👤 Nama: ${formData.name}
📱 WhatsApp: ${formData.phone}
🏷️ Jenis Barang: ${itemTypeText}

📝 Deskripsi Barang:
${formData.description}

Mohon info mengenai:
1. Perkiraan nilai taksiran
2. Prosedur dan persyaratan
3. Biaya administrasi

Terima kasih.`;
}

console.log('✅ contact.js - 联系页面脚本加载完成');