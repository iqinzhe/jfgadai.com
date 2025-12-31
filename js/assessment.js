// ==================== JF Gadai - Penilaian Online Motor ====================
// File: js/assessment.js (已修复照片上传问题)
// Tanggal: 2025
// Fungsi: Sistem penilaian online motor untuk gadai

// Database model motor Indonesia (只保留Honda和Yamaha)
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

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
  console.log('JF Gadai - Penilaian Online Motor loaded');
  
  // Inisialisasi semua fungsi
  initBrandSelection();
  initYearSelect();
  initMileageSlider();
  initPhotoUpload(); // 已修复
  initFAQ();
  
  // Set default values
  setTimeout(() => {
    document.getElementById('year').value = '2022';
    document.getElementById('cc').value = '150';
    document.getElementById('mileage').value = '20000';
    updateMileageLabels(20000);
  }, 100);
});

// ==================== BRAND SELECTION ====================
function initBrandSelection() {
  const brandOptions = document.querySelectorAll('.brand-option');
  const modelSelect = document.getElementById('model');
  
  brandOptions.forEach(option => {
    option.addEventListener('click', function() {
      brandOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
      
      const brand = this.dataset.brand;
      document.getElementById('brand').value = brand;
      
      modelSelect.disabled = false;
      modelSelect.innerHTML = '<option value="">Pilih model motor</option>';
      
      if (motorModels[brand]) {
        motorModels[brand].forEach(model => {
          const option = document.createElement('option');
          option.value = model.id;
          option.textContent = model.name;
          option.dataset.basePrice = model.basePrice;
          modelSelect.appendChild(option);
        });
      }
      
      setTimeout(() => {
        if (modelSelect.options.length > 1) {
          modelSelect.selectedIndex = 1;
        }
      }, 100);
    });
  });
  
  setTimeout(() => {
    const hondaOption = document.querySelector('.brand-option[data-brand="honda"]');
    if (hondaOption) {
      hondaOption.click();
    }
  }, 200);
}

// ==================== YEAR SELECTION ====================
function initYearSelect() {
  const yearSelect = document.getElementById('year');
  const currentYear = new Date().getFullYear();
  
  yearSelect.innerHTML = '<option value="">Pilih tahun</option>';
  
  for (let year = currentYear; year >= 2010; year--) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }
}

// ==================== MILEAGE SLIDER ====================
function initMileageSlider() {
  const mileageInput = document.getElementById('mileage');
  const mileageSlider = document.getElementById('mileageSlider');
  
  if (!mileageSlider) return;
  
  mileageSlider.addEventListener('input', function() {
    mileageInput.value = this.value;
    updateMileageLabels(this.value);
  });
  
  mileageInput.addEventListener('input', function() {
    const value = Math.min(Math.max(this.value, 0), 100000);
    this.value = value;
    mileageSlider.value = value;
    updateMileageLabels(value);
  });
}

function updateMileageLabels(value) {
  const labels = document.querySelectorAll('.mileage-labels span');
  if (!labels.length) return;
  
  labels.forEach(label => {
    label.style.fontWeight = 'normal';
    label.style.color = '';
  });
  
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

// ==================== PHOTO UPLOAD - 已修复 ====================
function initPhotoUpload() {
  const uploadAreas = document.querySelectorAll('.upload-area');
  const fileInput = document.getElementById('photoInput');
  
  if (!uploadAreas.length || !fileInput) return;
  
  // 为每个上传区域添加点击事件
  uploadAreas.forEach(area => {
    area.addEventListener('click', function(e) {
      // 阻止事件冒泡，防止移除按钮触发上传
      if (e.target.closest('.remove-photo')) return;
      
      currentUploadArea = this.id; // 记录当前点击的区域
      fileInput.click(); // 触发文件选择
    });
    
    // 添加移除照片按钮
    const removeBtn = document.createElement('div');
    removeBtn.className = 'remove-photo';
    removeBtn.innerHTML = '×';
    removeBtn.addEventListener('click', function(e) {
      e.stopPropagation(); // 阻止冒泡
      
      const areaId = this.parentElement.id;
      clearPhoto(areaId);
    });
    area.appendChild(removeBtn);
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
    
    // 重置文件输入，允许再次选择同一文件
    this.value = '';
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

// 获取所有照片数据
function getPhotoData() {
  return photoData;
}

// ==================== FAQ INTERACTION ====================
function initFAQ() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const faqItem = this.parentElement;
      faqItem.classList.toggle('active');
    });
  });
}

// ==================== STEP NAVIGATION ====================
function nextStep(step) {
  console.log(`Moving to step ${step}, validating current step`);
  
  // Validate CURRENT step (not the next one!)
  const currentStep = document.querySelector('.form-step.active');
  const currentStepNumber = parseInt(currentStep.id.replace('step', ''));
  
  console.log(`Currently on step ${currentStepNumber}, validating...`);
  
  if (!validateStep(currentStepNumber - 1)) {
    console.log(`Validation failed for step ${currentStepNumber}`);
    return;
  }
  
  console.log(`Validation passed, moving to step ${step}`);
  
  // Update progress bar
  updateProgressBar(step);
  
  // Switch steps
  const nextStepElement = document.getElementById(`step${step}`);
  
  if (currentStep && nextStepElement) {
    currentStep.classList.remove('active');
    nextStepElement.classList.add('active');
    
    console.log(`Switched from step${currentStepNumber} to step${step}`);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function prevStep(step) {
  console.log(`Moving back to step ${step}`);
  
  // Update progress bar
  updateProgressBar(step);
  
  // Switch steps
  const currentStep = document.querySelector('.form-step.active');
  const prevStepElement = document.getElementById(`step${step}`);
  
  if (currentStep && prevStepElement) {
    currentStep.classList.remove('active');
    prevStepElement.classList.add('active');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function updateProgressBar(step) {
  const progressSteps = document.querySelectorAll('.progress-step');
  
  progressSteps.forEach(progressStep => {
    const stepNumber = parseInt(progressStep.dataset.step);
    progressStep.classList.toggle('active', stepNumber === step);
  });
}

// ==================== FORM VALIDATION ====================
function validateStep(stepNumber) {
  console.log(`Validating step ${stepNumber}`);
  
  // Step 1: Motor Information
  if (stepNumber === 0) {
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
  
  // Step 2: Condition Selection
  else if (stepNumber === 1) {
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
  
  // Step 3: Personal Information
  else if (stepNumber === 2) {
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
    
    const phoneDigits = phoneNumber.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
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
  
  // Step 4: Always valid
  else if (stepNumber === 3) {
    return true;
  }
  
  console.log(`Step ${stepNumber} validation failed`);
  return false;
}

// ==================== VALUATION CALCULATION ====================
function calculateEstimation() {
  console.log('Starting estimation calculation...');
  
  // First validate step 3 (current step)
  if (!validateStep(2)) {
    console.log('Step 3 validation failed');
    return;
  }
  
  // Get form data
  const formData = {
    brand: document.getElementById('brand').value,
    model: document.getElementById('model').value,
    modelName: document.getElementById('model').selectedOptions[0]?.textContent || 'Motor',
    year: document.getElementById('year').value,
    cc: document.getElementById('cc').value,
    mileage: parseInt(document.getElementById('mileage').value),
    engine: document.querySelector('input[name="engine"]:checked')?.value,
    body: document.querySelector('input[name="body"]:checked')?.value,
    documents: document.querySelector('input[name="documents"]:checked')?.value,
    fullName: document.getElementById('fullName').value.trim(),
    phoneNumber: document.getElementById('phoneNumber').value.trim(),
    location: document.getElementById('location').value
  };
  
  console.log('Form data collected:', formData);
  
  // Calculate valuation
  const basePrice = parseInt(document.getElementById('model').selectedOptions[0]?.dataset.basePrice) || 8000000;
  
  // Simple calculation
  let estimatedValue = basePrice;
  
  // Year adjustment
  const currentYear = new Date().getFullYear();
  const age = currentYear - parseInt(formData.year);
  estimatedValue *= Math.max(1 - (age * 0.05), 0.3); // Max 70% depreciation
  
  // Mileage adjustment
  if (formData.mileage > 50000) {
    estimatedValue *= 0.9;
  } else if (formData.mileage > 30000) {
    estimatedValue *= 0.95;
  }
  
  // Condition adjustments
  if (formData.engine === 'sedang') estimatedValue *= 0.9;
  if (formData.engine === 'perbaikan') estimatedValue *= 0.7;
  
  if (formData.body === 'baret_sedikit') estimatedValue *= 0.95;
  if (formData.body === 'rusak') estimatedValue *= 0.8;
  
  if (formData.documents === 'stnk_saja') estimatedValue *= 0.9;
  if (formData.documents === 'hilang') estimatedValue *= 0.7;
  
  // Ensure minimum value
  estimatedValue = Math.max(estimatedValue, 1000000);
  
  // Calculate range
  const minValue = Math.round(estimatedValue * 0.85);
  const maxValue = Math.round(estimatedValue * 1.15);
  
  console.log('Calculation complete:', minValue, '-', maxValue);
  
  // Display results
  displayEstimation({
    minValue,
    maxValue,
    basePrice,
    formData
  });
  
  // Go to results step
  nextStep(4);
}

function displayEstimation(result) {
  console.log('Displaying estimation results');
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };
  
  // Update value displays
  document.getElementById('estimatedValue').textContent = formatCurrency(result.minValue);
  document.getElementById('estimatedValueMax').textContent = formatCurrency(result.maxValue);
  
  // Update breakdown
  document.getElementById('basePrice').textContent = `Rp ${formatCurrency(result.basePrice)}`;
  document.getElementById('yearAdjustment').textContent = `Rp ${formatCurrency(result.basePrice * 0.1)}`;
  document.getElementById('mileageAdjustment').textContent = `Rp ${formatCurrency(result.basePrice * 0.05)}`;
  document.getElementById('engineAdjustment').textContent = `Rp ${formatCurrency(result.basePrice * 0.1)}`;
  document.getElementById('bodyAdjustment').textContent = `Rp ${formatCurrency(result.basePrice * 0.05)}`;
  
  // Update WhatsApp link
  const whatsappBtn = document.querySelector('.btn-whatsapp');
  const message = `Halo JF Gadai, saya ${result.formData.fullName} telah melakukan penilaian online.

📋 Data Motor:
• Merek: ${result.formData.brand.toUpperCase()}
• Model: ${result.formData.modelName}
• Tahun: ${result.formData.year}
• CC: ${result.formData.cc}cc
• Kilometer: ${formatCurrency(result.formData.mileage)} KM

💰 Perkiraan Nilai Gadai:
Rp ${formatCurrency(result.minValue)} - Rp ${formatCurrency(result.maxValue)}

📞 Kontak:
• Nama: ${result.formData.fullName}
• WhatsApp: ${result.formData.phoneNumber}
• Lokasi: ${document.getElementById('location').selectedOptions[0]?.textContent || result.formData.location}

Saya tertarik untuk konsultasi lebih lanjut. Terima kasih!`;
  
  const encodedMessage = encodeURIComponent(message);
  whatsappBtn.href = `https://wa.me/6289515692586?text=${encodedMessage}`;
  
  console.log('Results displayed successfully');
}

// ==================== FORM RESET ====================
function resetForm() {
  console.log('Resetting form...');
  
  // Reset form
  document.getElementById('motorAssessmentForm').reset();
  
  // Reset brand
  document.querySelectorAll('.brand-option').forEach(opt => opt.classList.remove('active'));
  document.getElementById('brand').value = '';
  
  // Reset model
  const modelSelect = document.getElementById('model');
  modelSelect.innerHTML = '<option value="">Pilih merek terlebih dahulu</option>';
  modelSelect.disabled = true;
  
  // Reset mileage
  document.getElementById('mileage').value = '20000';
  if (document.getElementById('mileageSlider')) {
    document.getElementById('mileageSlider').value = '20000';
  }
  updateMileageLabels(20000);
  
  // Reset photos
  document.querySelectorAll('.upload-area').forEach(area => {
    area.classList.remove('has-image');
    const preview = area.querySelector('.upload-preview');
    if (preview) preview.remove();
    
    const text = area.id === 'uploadFront' ? 'Depan' : 
                 area.id === 'uploadBack' ? 'Belakang' : 'Samping';
    area.innerHTML = `<span class="upload-icon">📷</span><span class="upload-text">${text}</span>`;
    
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
  
  // Reset progress
  updateProgressBar(1);
  
  // Go to step 1
  document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
  document.getElementById('step1').classList.add('active');
  
  // Set defaults
  setTimeout(() => {
    const hondaOption = document.querySelector('.brand-option[data-brand="honda"]');
    if (hondaOption) {
      hondaOption.click();
    }
    document.getElementById('year').value = '2022';
    document.getElementById('cc').value = '150';
  }, 300);
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  console.log('Form reset complete');
}

// ==================== UTILITY ====================
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

console.log('JF Gadai Assessment System Ready');