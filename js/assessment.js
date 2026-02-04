// ==================== JF Gadai - Penilaian Online Motor ====================
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

// 存储照片数据
const photoData = {
  uploadFront: null,
  uploadBack: null,
  uploadSide: null
};

let currentUploadArea = null;

// ==================== 错误处理 ====================
// 全局错误处理
window.addEventListener('error', function(e) {
  console.error('Global error caught:', e.error);
  console.error('Message:', e.message);
  console.error('File:', e.filename);
  console.error('Line:', e.lineno);
  
});

// 未处理的Promise错误
window.addEventListener('unhandledrejection', function(e) {
  console.error('Unhandled promise rejection:', e.reason);
});

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
  console.log('JF Gadai - Penilaian Online Motor loaded');
  
  // 系统验证
  console.log('=== 系统初始化验证开始 ===');
  
  try {
    // 初始化所有功能
    initBrandSelection();
    initYearSelect();
    initMileageSlider();
    initPhotoUpload();
    initFAQ();
    
    // 设置默认值
    setTimeout(() => {
      // 默认选中第一个车型
      const modelSelect = document.getElementById('model');
      if (modelSelect && modelSelect.options.length > 1) {
        modelSelect.selectedIndex = 1;
      }
      
      // 触发里程标签更新
      updateMileageLabels(20000);
    }, 100);
    
    // 运行系统验证
    setTimeout(validateSystem, 500);
    
    console.log('✅ 系统初始化完成');
  } catch (error) {
    console.error('❌ 系统初始化失败:', error);
  }
});

// ==================== 品牌选择 ====================
function initBrandSelection() {
  const brandOptions = document.querySelectorAll('.brand-option');
  const brandInput = document.getElementById('brand');
  const modelSelect = document.getElementById('model');
  
  if (!brandOptions.length || !modelSelect) {
    console.warn('Brand or model element missing');
    return;
  }

  // 品牌选择事件处理
  brandOptions.forEach(option => {
    option.addEventListener('click', function(e) {
      e.stopPropagation();
      
      // 移除其他选项的active类
      brandOptions.forEach(opt => opt.classList.remove('active'));
      
      // 添加active类到当前选项
      this.classList.add('active');

      const brand = this.dataset.brand;
      console.log('Brand selected:', brand);

      // 更新隐藏的输入字段
      if (brandInput) {
        brandInput.value = brand;
      }

      // 启用车型选择并加载相应型号
      modelSelect.disabled = false;
      modelSelect.innerHTML = '<option value="">Pilih model motor</option>';

      if (motorModels && motorModels[brand]) {
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

  // 默认选中 Honda
  setTimeout(() => {
    const hondaOption = document.querySelector('.brand-option[data-brand="honda"]');
    if (hondaOption) {
      hondaOption.click();
    }
  }, 100);
}

// ==================== 年份选择 ====================
function initYearSelect() {
  const yearSelect = document.getElementById('year');
  const currentYear = new Date().getFullYear();
  
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
  
  // 为每个上传区域添加事件
  uploadAreas.forEach(area => {
    const fileInput = area.querySelector('input[type="file"]');
    
    // 点击区域触发文件选择
    area.addEventListener('click', function(e) {
      // 如果点击的是移除按钮，不触发文件选择
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

// 预览照片函数
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

// 清除照片函数
function clearPhoto(areaId) {
  const area = document.getElementById(areaId);
  if (!area) return;
  
  // 移除预览
  const preview = area.querySelector('.upload-preview');
  if (preview) {
    preview.remove();
  }
  
  // 移除has-image类
  area.classList.remove('has-image');
  
  // 清除存储的数据
  photoData[areaId] = null;
}

// ==================== FAQ交互 ====================
function initFAQ() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const faqItem = this.parentElement;
      
      // 关闭其他打开的FAQ
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
          item.classList.remove('active');
        }
      });
      
      // 切换当前FAQ
      faqItem.classList.toggle('active');
    });
  });
}

// ==================== 步骤导航 ====================
function nextStep(step) {
  console.log(`Moving to step ${step}`);
  
  // 验证当前步骤
  const currentStep = document.querySelector('.form-step.active');
  const currentStepNumber = parseInt(currentStep.id.replace('step', ''));
  
  console.log(`Currently on step ${currentStepNumber}, validating...`);
  
  if (!validateStep(currentStepNumber)) {
    console.log(`Validation failed for step ${currentStepNumber}`);
    return;
  }
  
  console.log(`Validation passed, moving to step ${step}`);
  
  // 更新进度条
  updateProgressBar(step);
  
  // 切换步骤
  const nextStepElement = document.getElementById(`step${step}`);
  
  if (currentStep && nextStepElement) {
    currentStep.classList.remove('active');
    nextStepElement.classList.add('active');
    
    console.log(`Switched from step${currentStepNumber} to step${step}`);
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function prevStep(step) {
  console.log(`Moving back to step ${step}`);
  
  // 更新进度条
  updateProgressBar(step);
  
  // 切换步骤
  const currentStep = document.querySelector('.form-step.active');
  const prevStepElement = document.getElementById(`step${step}`);
  
  if (currentStep && prevStepElement) {
    currentStep.classList.remove('active');
    prevStepElement.classList.add('active');
    
    // 滚动到顶部
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
function validateStep(stepNumber) {
  console.log(`Validating step ${stepNumber}`);
  
  // Step 1: 摩托车信息
  if (stepNumber === 1) {
    console.log('Checking step 1 fields...');
    
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
    
    console.log('Step 1 validation passed');
    return true;
  }
  
  // Step 2: 车况选择
  else if (stepNumber === 2) {
    console.log('Checking step 2 conditions...');
    
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
    
    console.log('Step 2 validation passed');
    return true;
  }
  
  // Step 3: 个人信息
  else if (stepNumber === 3) {
    console.log('Checking step 3 personal info...');
    
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
    
    // 验证电话号码格式
    const phoneDigits = phoneNumber.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      alert('📱 Format nomor WhatsApp tidak valid. Contoh: 081234567890');
      document.getElementById('phoneNumber').focus();
      return false;
    }
    
    if (!location) {
      alert('📍 Silakan pilih lokasi kota terdekat Anda');
      return false;
    }
    
    console.log('Step 3 validation passed');
    return true;
  }
  
  // Step 4: 总是有效
  else if (stepNumber === 4) {
    return true;
  }
  
  console.log(`Step ${stepNumber} validation failed`);
  return false;
}

// ==================== 估价计算 ====================
function calculateEstimation() {
  console.log('Starting professional estimation calculation...');
  
  // 首先验证步骤3（当前步骤）
  if (!validateStep(3)) {
    console.log('Step 3 validation failed');
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
  
  console.log('Form data collected:', formData);
  
  // 计算基础估价
  const basePrice = parseInt(document.getElementById('model').selectedOptions[0]?.dataset.basePrice) || 8000000;
  
  // 从基础价格开始
  let estimatedValue = basePrice;
  
  // 年份调整（每年5%，最多70%折旧）
  const currentYear = new Date().getFullYear();
  const age = currentYear - formData.year;
  const yearDepreciation = Math.min(age * 0.05, 0.7);
  estimatedValue *= (1 - yearDepreciation);
  
  // 里程调整
  let mileageDepreciation = 0;
  if (formData.mileage > 80000) {
    mileageDepreciation = 0.15;
  } else if (formData.mileage > 50000) {
    mileageDepreciation = 0.10;
  } else if (formData.mileage > 30000) {
    mileageDepreciation = 0.05;
  } else if (formData.mileage > 10000) {
    mileageDepreciation = 0.02;
  }
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
  
  // 计算范围（±15%用于专业评估）
  const marketVolatility = 0.15; // 15%市场波动
  const minValue = Math.round(estimatedValue * (1 - marketVolatility));
  const maxValue = Math.round(estimatedValue * (1 + marketVolatility));
  
  console.log('Professional calculation complete:', {
    minValue,
    maxValue,
    basePrice,
    estimatedValue
  });
  
  // 显示结果
  displayEstimation({
    minValue,
    maxValue,
    basePrice,
    formData,
    estimatedValue
  });
  
  // 转到结果步骤
  nextStep(4);
}

function displayEstimation(result) {
  console.log('Displaying professional estimation results');
  
  // 货币格式化
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };
  
  // 计算中间值
  const middleValue = Math.round((result.minValue + result.maxValue) / 2);
  
  // 基于实际调整计算百分比
  const currentYear = new Date().getFullYear();
  const yearPercent = result.formData.year ? Math.round((currentYear - result.formData.year) * 5) : 0;
  
  const mileagePercent = result.formData.mileage > 80000 ? 15 : 
                        result.formData.mileage > 50000 ? 10 :
                        result.formData.mileage > 30000 ? 5 :
                        result.formData.mileage > 10000 ? 2 : 0;
  
  let enginePercent = 0;
  if (result.formData.engine === 'sedang') enginePercent = 8;
  if (result.formData.engine === 'perbaikan') enginePercent = 20;
  
  let bodyPercent = 0;
  if (result.formData.body === 'baret_sedikit') bodyPercent = 5;
  if (result.formData.body === 'rusak') bodyPercent = 15;
  
  let docPercent = 0;
  if (result.formData.documents === 'stnk_saja') docPercent = 10;
  if (result.formData.documents === 'hilang') docPercent = 25;
  
  // 更新价值显示
  document.getElementById('estimatedValueMin').textContent = formatCurrency(result.minValue);
  document.getElementById('estimatedValueMax').textContent = formatCurrency(result.maxValue);
  document.getElementById('estimatedValueAvg').textContent = formatCurrency(middleValue);
  
  // 更新明细和动态百分比
  document.getElementById('basePrice').textContent = `Rp ${formatCurrency(result.basePrice)}`;
  
  // 年份调整
  const yearAdjustmentValue = Math.round(result.basePrice * (yearPercent / 100));
  document.getElementById('yearAdjustment').textContent = `-Rp ${formatCurrency(yearAdjustmentValue)}`;
  document.getElementById('yearPercent').textContent = yearPercent;
  
  // 里程调整
  const mileageAdjustmentValue = Math.round(result.basePrice * (mileagePercent / 100));
  document.getElementById('mileageAdjustment').textContent = `-Rp ${formatCurrency(mileageAdjustmentValue)}`;
  document.getElementById('mileagePercent').textContent = mileagePercent;
  
  // 引擎调整
  const engineAdjustmentValue = Math.round(result.basePrice * (enginePercent / 100));
  document.getElementById('engineAdjustment').textContent = `-Rp ${formatCurrency(engineAdjustmentValue)}`;
  document.getElementById('enginePercent').textContent = enginePercent;
  
  // 车身调整
  const bodyAdjustmentValue = Math.round(result.basePrice * (bodyPercent / 100));
  document.getElementById('bodyAdjustment').textContent = `-Rp ${formatCurrency(bodyAdjustmentValue)}`;
  document.getElementById('bodyPercent').textContent = bodyPercent;
  
  // 文件调整
  const docAdjustmentValue = Math.round(result.basePrice * (docPercent / 100));
  document.getElementById('docAdjustment').textContent = docAdjustmentValue > 0 ? `-Rp ${formatCurrency(docAdjustmentValue)}` : 'Rp 0';
  document.getElementById('docPercent').textContent = docPercent;
  
  // 总调整
  const totalAdjValue = yearAdjustmentValue + mileageAdjustmentValue + engineAdjustmentValue + bodyAdjustmentValue + docAdjustmentValue;
  document.getElementById('totalAdjustment').textContent = `-Rp ${formatCurrency(totalAdjValue)}`;
  
  // 更新WhatsApp链接
  const whatsappBtn = document.getElementById('whatsappButton');
  const locationText = document.getElementById('location').selectedOptions[0]?.textContent || result.formData.location;
  
  const message = `Halo JF Gadai, saya ${result.formData.fullName} telah melakukan penilaian online.

📋 DATA MOTOR:
• Merek: ${result.formData.brand.toUpperCase()}
• Model: ${result.formData.modelName}
• Tahun: ${result.formData.year}
• CC: ${result.formData.cc}cc
• Kilometer: ${formatCurrency(result.formData.mileage)} KM
• Kondisi Mesin: ${result.formData.engine === 'baik' ? 'Baik' : result.formData.engine === 'sedang' ? 'Sedang' : 'Butuh Perbaikan'}
• Kondisi Body: ${result.formData.body === 'mulus' ? 'Mulus' : result.formData.body === 'baret_sedikit' ? 'Baret Sedikit' : 'Rusak/Penyok'}
• Dokumen: ${result.formData.documents === 'lengkap' ? 'Lengkap (STNK+BPKB)' : result.formData.documents === 'stnk_saja' ? 'STNK Saja' : 'Belum Ada'}

💰 PERKIRAAN NILAI GADAI (RANGE):
Rp ${formatCurrency(result.minValue)} - Rp ${formatCurrency(result.maxValue)}
(Nilai tengah: Rp ${formatCurrency(middleValue)})

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
  whatsappBtn.href = `https://wa.me/6289515692586?text=${encodedMessage}`;
  
  console.log('Professional results displayed successfully with range:', result.minValue, '-', result.maxValue);
}

// ==================== 表单重置 ====================
function resetForm() {
  console.log('Resetting form...');
  
  // 重置表单
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
    
    // 重新添加图标和文本
    const position = area.getAttribute('data-position');
    const text = position === 'depan' ? 'Depan' : 
                 position === 'belakang' ? 'Belakang' : 'Samping';
    
    // 清除现有内容（除了文件输入）
    const fileInput = area.querySelector('input[type="file"]');
    area.innerHTML = '';
    
    // 重新添加内容
    const icon = document.createElement('span');
    icon.className = 'upload-icon';
    icon.textContent = '📷';
    
    const textSpan = document.createElement('span');
    textSpan.className = 'upload-text';
    textSpan.textContent = text;
    
    area.appendChild(icon);
    area.appendChild(textSpan);
    if (fileInput) area.appendChild(fileInput);
    
    // 重新添加移除按钮
    const removeBtn = document.createElement('div');
    removeBtn.className = 'remove-photo';
    removeBtn.innerHTML = '×';
    removeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      clearPhoto(area.id);
    });
    area.appendChild(removeBtn);
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
  
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  console.log('Form reset complete');
}

// ==================== 系统验证 ====================
function validateSystem() {
  console.log('=== 系统验证开始 ===');
  
  const checks = {
    googleAnalytics: typeof gtag !== 'undefined',
    dataLayer: typeof dataLayer !== 'undefined',
    formValidation: typeof validateStep === 'function',
    calculationEngine: typeof calculateEstimation === 'function',
    photoUpload: typeof initPhotoUpload === 'function',
    stepNavigation: typeof nextStep === 'function',
    brandSelection: typeof initBrandSelection === 'function'
  };

  console.log('检查结果:', checks);
  
  const allValid = Object.values(checks).every(v => v === true);
  
  if (allValid) {
    console.log('✅ 系统验证通过：所有核心功能正常');
    
    // 显示系统就绪消息
    console.log('💰 系统已准备就绪，可以开始评估');
    
    return true;
  } else {
    console.error('❌ 系统验证失败，请检查以下功能：');
    Object.entries(checks).forEach(([key, value]) => {
      if (!value) console.error(`  - ${key}: 失败`);
    });
    
    return false;
  }
  
  console.log('=== 系统验证结束 ===');
}

// ==================== 实用函数 ====================
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

console.log('JF Gadai Professional Assessment System Ready');
