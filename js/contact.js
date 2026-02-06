// ==================== contact.js - 联系页面专用 ====================
document.addEventListener('DOMContentLoaded', function() {
  console.log('contact.js - 联系页面加载');
  
  // 检查是否在联系页面
  const form = document.getElementById('whatsappForm');
  if (!form) {
    console.log('不在联系页面，跳过初始化');
    return;
  }
  
  // 初始化联系表单
  initContactForm();
});

// ==================== 联系人表单功能 ====================
function initContactForm() {
  const form = document.getElementById('whatsappForm');
  const submitBtn = document.getElementById('submitBtn');
  const loadingText = document.getElementById('loadingText');
  const formSuccess = document.getElementById('formSuccess');
  
  if (!form) return;
  
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
      name: document.getElementById('name').value,
      ktp: document.getElementById('ktp').value,
      phone: document.getElementById('phone').value,
      item: document.getElementById('item').value,
      description: document.getElementById('description').value
    };
    
    // 验证表单
    if (!validateContactForm(formData)) {
      return;
    }
    
    // 显示加载状态
    if (submitBtn) {
      submitBtn.disabled = true;
      const submitText = submitBtn.querySelector('span');
      if (submitText) submitText.style.display = 'none';
      if (loadingText) loadingText.style.display = 'inline';
    }
    
    // 延迟执行
    setTimeout(() => {
      // 构建WhatsApp消息
      const message = buildContactMessage(formData);
      const whatsappUrl = window.whatsappUtils.buildURL(formData.phone, message);
      
      // 显示成功消息
      form.style.display = 'none';
      if (formSuccess) formSuccess.style.display = 'block';
      
      // 延迟打开WhatsApp
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1500);
      
    }, 1000);
  });
  
  // 实时验证
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      validateContactField(this.id, this.value);
    });
    
    input.addEventListener('input', function() {
      window.formValidator.clearError(this.id);
    });
  });
}

// 联系人表单验证
function validateContactForm(formData) {
  const validator = window.formValidator;
  let isValid = true;
  
  // 验证姓名
  if (!validator.validateRequired(formData.name)) {
    validator.showError('name', 'Nama lengkap harus diisi');
    isValid = false;
  } else {
    validator.clearError('name');
  }
  
  // 验证KTP
  if (!validator.validateRequired(formData.ktp)) {
    validator.showError('ktp', 'Nomor KTP harus diisi');
    isValid = false;
  } else if (!validator.validateKTP(formData.ktp)) {
    validator.showError('ktp', 'Nomor KTP harus 16 digit angka');
    isValid = false;
  } else {
    validator.clearError('ktp');
  }
  
  // 验证手机号码
  if (!validator.validateRequired(formData.phone)) {
    validator.showError('phone', 'Nomor WhatsApp harus diisi');
    isValid = false;
  } else if (!validator.validatePhoneID(formData.phone)) {
    validator.showError('phone', 'Format nomor WhatsApp tidak valid. Contoh: 081234567890');
    isValid = false;
  } else {
    validator.clearError('phone');
  }
  
  // 验证物品类型
  if (!formData.item) {
    validator.showError('item', 'Pilih jenis barang yang akan digadaikan');
    isValid = false;
  } else {
    validator.clearError('item');
  }
  
  // 验证描述
  if (!validator.validateRequired(formData.description)) {
    validator.showError('description', 'Deskripsi barang harus diisi');
    isValid = false;
  } else if (!validator.validateMinLength(formData.description, 10)) {
    validator.showError('description', 'Deskripsi terlalu singkat. Minimal 10 karakter');
    isValid = false;
  } else {
    validator.clearError('description');
  }
  
  return isValid;
}

// 验证单个字段
function validateContactField(fieldId, value) {
  const validator = window.formValidator;
  
  switch(fieldId) {
    case 'name':
      if (!validator.validateRequired(value)) {
        validator.showError('name', 'Nama lengkap harus diisi');
      } else {
        validator.clearError('name');
      }
      break;
      
    case 'ktp':
      if (!validator.validateRequired(value)) {
        validator.showError('ktp', 'Nomor KTP harus diisi');
      } else if (!validator.validateKTP(value)) {
        validator.showError('ktp', 'Nomor KTP harus 16 digit angka');
      } else {
        validator.clearError('ktp');
      }
      break;
      
    case 'phone':
      if (!validator.validateRequired(value)) {
        validator.showError('phone', 'Nomor WhatsApp harus diisi');
      } else if (!validator.validatePhoneID(value)) {
        validator.showError('phone', 'Format nomor WhatsApp tidak valid');
      } else {
        validator.clearError('phone');
      }
      break;
      
    case 'item':
      if (!value) {
        validator.showError('item', 'Pilih jenis barang');
      } else {
        validator.clearError('item');
      }
      break;
      
    case 'description':
      if (!validator.validateRequired(value)) {
        validator.showError('description', 'Deskripsi barang harus diisi');
      } else if (!validator.validateMinLength(value, 10)) {
        validator.showError('description', 'Deskripsi terlalu singkat');
      } else {
        validator.clearError('description');
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
}

console.log('✅ contact.js - 联系页面脚本加载完成');