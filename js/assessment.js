// ==================== assessment.js - 摩托车估价页面专用 ====================
// 摩托车型号数据
const motorModels = {
  honda: [
    { id: 'beat', name: 'Honda Beat', basePrice: 8000000 },
    { id: 'scoopy', name: 'Honda Scoopy', basePrice: 9000000 },
    { id: 'vario', name: 'Honda Vario', basePrice: 10000000 },
    { id: 'genio', name: 'Honda Genio', basePrice: 9500000 },
    { id: 'pcx', name: 'Honda PCX', basePrice: 15000000 },
    { id: 'adv', name: 'Honda ADV', basePrice: 18000000 },
    { id: 'cbr150r', name: 'Honda CBR150R', basePrice: 12000000 },
    { id: 'rebel', name: 'Honda Rebel', basePrice: 25000000 },
    { id: 'supra', name: 'Honda Supra', basePrice: 6000000 }
  ],
  yamaha: [
    { id: 'mio', name: 'Yamaha Mio', basePrice: 8500000 },
    { id: 'gear', name: 'Yamaha Gear', basePrice: 8200000 },
    { id: 'fino', name: 'Yamaha Fino', basePrice: 8800000 },
    { id: 'nmax', name: 'Yamaha NMAX', basePrice: 16000000 },
    { id: 'aerox', name: 'Yamaha Aerox', basePrice: 17000000 },
    { id: 'r15', name: 'Yamaha R15', basePrice: 14000000 },
    { id: 'mt15', name: 'Yamaha MT-15', basePrice: 14500000 },
    { id: 'xmax', name: 'Yamaha XMAX', basePrice: 28000000 },
    { id: 'jupiter', name: 'Yamaha Jupiter', basePrice: 7000000 }
  ]
};

// 照片数据存储
const photoData = {
  uploadFront: null,
  uploadBack: null,
  uploadSide: null
};

let currentUploadArea = null;

document.addEventListener('DOMContentLoaded', function() {
  console.log('assessment.js - 摩托车估价页面加载');
  
  // 检查是否在估价页面
  if (!document.getElementById('motorAssessmentForm')) {
    console.log('不在估价页面，跳过初始化');
    return;
  }
  
  // 初始化所有估价功能
  initBrandSelection();
  initYearSelect();
  initMileageSlider();
  initPhotoUpload();
  initStepNavigation();

// ==================== 品牌选择 ====================
function initBrandSelection() {
  const brandOptions = document.querySelectorAll('.brand-option');
  const brandInput = document.getElementById('brand');
  const modelSelect = document.getElementById('model');
  
  if (!brandOptions.length || !modelSelect) return;

  brandOptions.forEach(option => {
    option.addEventListener('click', function(e) {
      e.stopPropagation();
      
      // 移除其他选项的active类
      brandOptions.forEach(opt => opt.classList.remove('active'));
      
      // 添加active类到当前选项
      this.classList.add('active');

      const brand = this.dataset.brand;

      // 更新隐藏的输入字段
      if (brandInput) {
        brandInput.value = brand;
      }

      // 启用车型选择并加载相应型号
      modelSelect.disabled = false;
      modelSelect.innerHTML = '<option value="">Pilih model motor</option>';

      if (motorModels[brand]) {
        motorModels[brand].forEach(model => {
          const opt = document.createElement('option');
          opt.value = model.id;
          opt.textContent = model.name;
          opt.dataset.basePrice = model.basePrice;
          modelSelect.appendChild(opt);
        });
      }

      // 默认选择第一个型号
      if (modelSelect.options.length > 1) {
        modelSelect.selectedIndex = 1;
      }
    });
  });
}

// ==================== 年份选择 ====================
function initYearSelect() {
  const yearSelect = document.getElementById('year');
  const currentYear = new Date().getFullYear();
  
  if (!yearSelect) return;
  
  // 清除现有选项（除了第一个）
  while (yearSelect.options.length > 1) {
    yearSelect.remove(1);
  }
  
  // 添加年份选项（从当前年份到2010年）
  for (let year = currentYear; year >= 2010; year--) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }
  
  // 默认选中2022年
  yearSelect.value = '2022';
}

// ==================== 里程滑块 ====================
function initMileageSlider() {
  const mileageInput = document.getElementById('mileage');
  const mileageSlider = document.getElementById('mileageSlider');
  
  if (!mileageSlider) return;
  
  // 滑块变化事件
  mileageSlider.addEventListener('input', function() {
    mileageInput.value = this.value;
    updateMileageLabels(this.value);
  });
  
  // 输入框变化事件
  mileageInput.addEventListener('input', function() {
    let value = parseInt(this.value) || 0;
    value = Math.min(Math.max(value, 0), 100000);
    this.value = value;
    mileageSlider.value = value;
    updateMileageLabels(value);
  });
  
  // 初始更新标签
  updateMileageLabels(mileageSlider.value);
}

function updateMileageLabels(value) {
  const labels = document.querySelectorAll('.mileage-labels span');
  if (!labels.length) return;
  
  // 重置所有标签
  labels.forEach(label => {
    label.style.fontWeight = 'normal';
    label.style.color = '';
  });
  
  // 根据值高亮对应的标签
  if (value < 50000) {
    labels[0].style.fontWeight = 'bold';
    labels[0].style.color = 'var(--secondary-color)';
  } else if (value < 100000) {
    labels[1].style.fontWeight = 'bold';
    labels[1].style.color = 'var(--secondary-color)';
  } else {
    labels[2].style.fontWeight = 'bold';
    labels[2].style.color = 'var(--secondary-color)';
  }
}

// ==================== 照片上传 ====================
function initPhotoUpload() {
  const uploadAreas = document.querySelectorAll('.upload-area');
  
  if (!uploadAreas.length) return;
  
  uploadAreas.forEach(area => {
    const fileInput = area.querySelector('input[type="file"]');
    
    // 点击区域触发文件选择
    area.addEventListener('click', function(e) {
      if (e.target.closest('.remove-photo')) return;
      currentUploadArea = area.id;
      fileInput.click();
    });
    
    // 文件选择变化事件
    fileInput.addEventListener('change', function(e) {
      if (!currentUploadArea || !this.files || this.files.length === 0) return;
      
      const file = this.files[0];
      if (!file.type.startsWith('image/')) {
        alert('Silakan pilih file gambar (JPG, PNG, dll.)');
        return;
      }
      
      // 预览照片
      previewPhoto(file, currentUploadArea);
      
      // 存储照片数据
      const reader = new FileReader();
      reader.onload = function(e) {
        photoData[currentUploadArea] = e.target.result;
      };
      reader.readAsDataURL(file);
      
      // 重置文件输入
      this.value = '';
    });
    
    // 添加移除照片按钮
    const removeBtn = document.createElement('div');
    removeBtn.className = 'remove-photo';
    removeBtn.innerHTML = '×';
    removeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      clearPhoto(area.id);
    });
    area.appendChild(removeBtn);
  });
}

function previewPhoto(file, areaId) {
  const area = document.getElementById(areaId);
  if (!area) return;
  
  // 移除已有的预览
  const existingPreview = area.querySelector('.upload-preview');
  if (existingPreview) {
    existingPreview.remove();
  }
  
  // 创建新的预览
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = document.createElement('img');
    img.className = 'upload-preview';
    img.src = e.target.result;
    img.alt = 'Preview foto motor';
    
    area.appendChild(img);
    area.classList.add('has-image');
  };
  reader.readAsDataURL(file);
}

function clearPhoto(areaId) {
  const area = document.getElementById(areaId);
  if (!area) return;
  
  const preview = area.querySelector('.upload-preview');
  if (preview) {
    preview.remove();
  }
  
  area.classList.remove('has-image');
  photoData[areaId] = null;
}

// ==================== 步骤导航 ====================
function initStepNavigation() {
  // 绑定步骤按钮事件
  document.querySelectorAll('[onclick^="nextStep"]').forEach(btn => {
    const match = btn.getAttribute('onclick').match(/nextStep\((\d+)\)/);
    if (match) {
      const step = parseInt(match[1]);
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        nextStep(step);
      });
    }
  });
  
  document.querySelectorAll('[onclick^="prevStep"]').forEach(btn => {
    const match = btn.getAttribute('onclick').match(/prevStep\((\d+)\)/);
    if (match) {
      const step = parseInt(match[1]);
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        prevStep(step);
      });
    }
  });
  
  // 绑定计算按钮
  const calculateBtn = document.querySelector('[onclick="calculateEstimation()"]');
  if (calculateBtn) {
    calculateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      calculateEstimation();
    });
  }
  
  // 绑定重置按钮
  const resetBtn = document.querySelector('[onclick="resetForm()"]');
  if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      resetAssessmentForm();
    });
  }
}

function nextStep(step) {
  const currentStep = document.querySelector('.form-step.active');
  const currentStepNumber = parseInt(currentStep.id.replace('step', ''));
  
  if (!validateAssessmentStep(currentStepNumber)) {
    return;
  }
  
  // 更新进度条
  updateProgressBar(step);
  
  // 切换步骤
  const nextStepElement = document.getElementById(`step${step}`);
  
  if (currentStep && nextStepElement) {
    currentStep.classList.remove('active');
    nextStepElement.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function prevStep(step) {
  updateProgressBar(step);
  
  const currentStep = document.querySelector('.form-step.active');
  const prevStepElement = document.getElementById(`step${step}`);
  
  if (currentStep && prevStepElement) {
    currentStep.classList.remove('active');
    prevStepElement.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function updateProgressBar(step) {
  const progressSteps = document.querySelectorAll('.progress-step');
  progressSteps.forEach(progressStep => {
    const stepNumber = parseInt(progressStep.dataset.step);
    progressStep.classList.toggle('active', stepNumber <= step);
  });
}

// ==================== 表单验证 ====================
function validateAssessmentStep(stepNumber) {
  // 确保全局验证器存在
  if (typeof window.formValidator === 'undefined') {
    console.warn('formValidator未找到，使用简单验证');
    return simpleValidateStep(stepNumber);
  }
  
  const validator = window.formValidator;
  
  if (stepNumber === 1) {
    if (!document.getElementById('brand').value) {
      alert('🚫 Silakan pilih merek motor');
      return false;
    }
    
    if (!document.getElementById('model').value) {
      alert('🚫 Silakan pilih model motor');
      return false;
    }
    
    if (!document.getElementById('year').value) {
      alert('🚫 Silakan pilih tahun produksi');
      return false;
    }
    
    if (!document.getElementById('cc').value) {
      alert('🚫 Silakan pilih kapasitas mesin (CC)');
      return false;
    }
    
    const mileage = document.getElementById('mileage').value;
    if (!mileage || mileage < 0) {
      alert('🚫 Silakan isi kilometer tempuh motor Anda');
      return false;
    }
    
    return true;
  }
  
  else if (stepNumber === 2) {
    if (!document.querySelector('input[name="engine"]:checked')) {
      alert('🔧 Silakan pilih kondisi mesin motor Anda');
      return false;
    }
    
    if (!document.querySelector('input[name="body"]:checked')) {
      alert('🎨 Silakan pilih kondisi body & cat motor Anda');
      return false;
    }
    
    if (!document.querySelector('input[name="documents"]:checked')) {
      alert('📋 Silakan pilih kelengkapan dokumen (STNK & BPKB)');
      return false;
    }
    
    return true;
  }
  
  else if (stepNumber === 3) {
    const fullName = document.getElementById('fullName').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const location = document.getElementById('location').value;
    
    if (!fullName) {
      alert('👤 Silakan isi nama lengkap Anda');
      document.getElementById('fullName').focus();
      return false;
    }
    
    if (!phoneNumber) {
      alert('📱 Silakan isi nomor WhatsApp Anda');
      document.getElementById('phoneNumber').focus();
      return false;
    }
    
    if (!validator.validatePhoneID(phoneNumber)) {
      alert('📱 Format nomor WhatsApp tidak valid. Contoh: 081234567890');
      document.getElementById('phoneNumber').focus();
      return false;
    }
    
    if (!location) {
      alert('📍 Silakan pilih lokasi kota terdekat Anda');
      return false;
    }
    
    return true;
  }
  
  else if (stepNumber === 4) {
    return true;
  }
  
  return false;
}

// 简单验证（当formValidator不存在时使用）
function simpleValidateStep(stepNumber) {
  if (stepNumber === 1) {
    if (!document.getElementById('brand').value) {
      alert('🚫 Silakan pilih merek motor');
      return false;
    }
    if (!document.getElementById('model').value) {
      alert('🚫 Silakan pilih model motor');
      return false;
    }
    return true;
  }
  
  else if (stepNumber === 2) {
    if (!document.querySelector('input[name="engine"]:checked')) {
      alert('🔧 Silakan pilih kondisi mesin motor Anda');
      return false;
    }
    if (!document.querySelector('input[name="body"]:checked')) {
      alert('🎨 Silakan pilih kondisi body & cat motor Anda');
      return false;
    }
    if (!document.querySelector('input[name="documents"]:checked')) {
      alert('📋 Silakan pilih kelengkapan dokumen (STNK & BPKB)');
      return false;
    }
    return true;
  }
  
  else if (stepNumber === 3) {
    const fullName = document.getElementById('fullName').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const location = document.getElementById('location').value;
    
    if (!fullName) {
      alert('👤 Silakan isi nama lengkap Anda');
      return false;
    }
    if (!phoneNumber || phoneNumber.length < 10) {
      alert('📱 Silakan isi nomor WhatsApp yang valid (min. 10 digit)');
      return false;
    }
    if (!location) {
      alert('📍 Silakan pilih lokasi kota terdekat Anda');
      return false;
    }
    return true;
  }
  
  return false;
}

// ==================== 估价计算 ====================
function calculateEstimation() {
  if (!validateAssessmentStep(3)) {
    return;
  }
  
  // 获取表单数据
  const formData = {
    brand: document.getElementById('brand').value,
    model: document.getElementById('model').value,
    modelName: document.getElementById('model').selectedOptions[0]?.textContent || 'Motor',
    year: parseInt(document.getElementById('year').value),
    cc: parseInt(document.getElementById('cc').value),
    mileage: parseInt(document.getElementById('mileage').value),
    engine: document.querySelector('input[name="engine"]:checked')?.value,
    body: document.querySelector('input[name="body"]:checked')?.value,
    documents: document.querySelector('input[name="documents"]:checked')?.value,
    fullName: document.getElementById('fullName').value.trim(),
    phoneNumber: document.getElementById('phoneNumber').value.trim(),
    location: document.getElementById('location').value
  };
  
  // 计算基础估价
  const basePrice = parseInt(document.getElementById('model').selectedOptions[0]?.dataset.basePrice) || 8000000;
  let estimatedValue = basePrice;
  
  // 年份调整
  const currentYear = new Date().getFullYear();
  const age = currentYear - formData.year;
  const yearDepreciation = Math.min(age * 0.05, 0.7);
  estimatedValue *= (1 - yearDepreciation);
  
  // 里程调整
  let mileageDepreciation = 0;
  if (formData.mileage > 80000) mileageDepreciation = 0.15;
  else if (formData.mileage > 50000) mileageDepreciation = 0.10;
  else if (formData.mileage > 30000) mileageDepreciation = 0.05;
  else if (formData.mileage > 10000) mileageDepreciation = 0.02;
  estimatedValue *= (1 - mileageDepreciation);
  
  // 引擎状况调整
  let engineDepreciation = 0;
  if (formData.engine === 'sedang') engineDepreciation = 0.08;
  if (formData.engine === 'perbaikan') engineDepreciation = 0.20;
  estimatedValue *= (1 - engineDepreciation);
  
  // 车身状况调整
  let bodyDepreciation = 0;
  if (formData.body === 'baret_sedikit') bodyDepreciation = 0.05;
  if (formData.body === 'rusak') bodyDepreciation = 0.15;
  estimatedValue *= (1 - bodyDepreciation);
  
  // 文件调整
  let docDepreciation = 0;
  if (formData.documents === 'stnk_saja') docDepreciation = 0.10;
  if (formData.documents === 'hilang') docDepreciation = 0.25;
  estimatedValue *= (1 - docDepreciation);
  
  // 确保最小值
  estimatedValue = Math.max(estimatedValue, 1000000);
  
  // 计算范围（±15%）
  const marketVolatility = 0.15;
  const minValue = Math.round(estimatedValue * (1 - marketVolatility));
  const maxValue = Math.round(estimatedValue * (1 + marketVolatility));
  
  // 显示结果
  displayEstimationResult({
    minValue,
    maxValue,
    basePrice,
    formData,
    estimatedValue
  });
  
  // 转到结果步骤
  nextStep(4);
}

function displayEstimationResult(result) {
  // 确保货币格式化工具存在
  const formatter = window.currencyUtils || {
    formatSimple: (num) => {
      return new Intl.NumberFormat('id-ID').format(num);
    }
  };
  
  const middleValue = Math.round((result.minValue + result.maxValue) / 2);
  
  // 更新价值显示
  document.getElementById('estimatedValueMin').textContent = formatter.formatSimple(result.minValue);
  document.getElementById('estimatedValueMax').textContent = formatter.formatSimple(result.maxValue);
  document.getElementById('estimatedValueAvg').textContent = formatter.formatSimple(middleValue);
  
  // 构建WhatsApp消息
  const locationText = document.getElementById('location').selectedOptions[0]?.textContent || result.formData.location;
  
  const message = `Halo JF Gadai, saya ${result.formData.fullName} telah melakukan penilaian online.

📋 DATA MOTOR:
• Merek: ${result.formData.brand.toUpperCase()}
• Model: ${result.formData.modelName}
• Tahun: ${result.formData.year}
• CC: ${result.formData.cc}cc
• Kilometer: ${formatter.formatSimple(result.formData.mileage)} KM
• Kondisi Mesin: ${result.formData.engine === 'baik' ? 'Baik' : result.formData.engine === 'sedang' ? 'Sedang' : 'Butuh Perbaikan'}
• Kondisi Body: ${result.formData.body === 'mulus' ? 'Mulus' : result.formData.body === 'baret_sedikit' ? 'Baret Sedikit' : 'Rusak/Penyok'}
• Dokumen: ${result.formData.documents === 'lengkap' ? 'Lengkap (STNK+BPKB)' : result.formData.documents === 'stnk_saja' ? 'STNK Saja' : 'Belum Ada'}

💰 PERKIRAAN NILAI GADAI (RANGE):
${formatter.formatSimple(result.minValue)} - ${formatter.formatSimple(result.maxValue)}
(Nilai tengah: ${formatter.formatSimple(middleValue)})

⚠️ CATATAN PROFESIONAL:
• Ini adalah perkiraan awal (75-85% akurat)
• Nilai final dapat disesuaikan ±15% setelah inspeksi fisik
• Estimasi berdasarkan data yang diberikan

📞 KONTAK:
• Nama: ${result.formData.fullName}
• WhatsApp: ${result.formData.phoneNumber}
• Lokasi: ${locationText}

Saya ingin melakukan konsultasi lebih lanjut dan penjadwalan inspeksi fisik untuk penyesuaian nilai yang lebih akurat. Terima kasih!`;
  
  const encodedMessage = encodeURIComponent(message);
  const whatsappBtn = document.getElementById('whatsappButton');
  if (whatsappBtn) {
    whatsappBtn.href = `https://wa.me/6289515692586?text=${encodedMessage}`;
  }
}

// ==================== 表单重置 ====================
function resetAssessmentForm() {
  console.log('重置估价表单...');
  
  document.getElementById('motorAssessmentForm').reset();
  
  // 重置品牌选择
  document.querySelectorAll('.brand-option').forEach(opt => opt.classList.remove('active'));
  document.getElementById('brand').value = '';
  
  // 重置车型选择
  const modelSelect = document.getElementById('model');
  modelSelect.innerHTML = '<option value="">Pilih model motor</option>';
  modelSelect.disabled = false;
  
  // 重置年份选择
  document.getElementById('year').value = '2022';
  
  // 重置里程
  document.getElementById('mileage').value = '20000';
  if (document.getElementById('mileageSlider')) {
    document.getElementById('mileageSlider').value = '20000';
  }
  updateMileageLabels(20000);
  
  // 重置单选按钮
  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.checked = false;
  });
  
  // 重置照片
  document.querySelectorAll('.upload-area').forEach(area => {
    area.classList.remove('has-image');
    const preview = area.querySelector('.upload-preview');
    if (preview) preview.remove();
  });
  
  // 重置照片数据
  photoData.uploadFront = null;
  photoData.uploadBack = null;
  photoData.uploadSide = null;
  currentUploadArea = null;
  
  // 重置进度条
  updateProgressBar(1);
  
  // 转到步骤1
  document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
  document.getElementById('step1').classList.add('active');
  
  // 设置默认值
  setTimeout(() => {
    const hondaOption = document.querySelector('.brand-option[data-brand="honda"]');
    if (hondaOption) {
      hondaOption.click();
    }
    document.getElementById('cc').value = '125';
  }, 300);
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

console.log('✅ assessment.js - 摩托车估价脚本加载完成');
