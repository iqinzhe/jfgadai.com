// ==================== JF Gadai - Penilaian Online Motor ====================
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
  const brandInput = document.getElementById('brand');
  const modelSelect = document.getElementById('model');
setTimeout(() => {
  if (modelSelect.options.length > 1) {
    modelSelect.selectedIndex = 1;    modelSelect.dispatchEvent(new Event('change')); // ← 关键
  }
}, 100);
  if (!brandOptions.length || !modelSelect) {
    console.warn('Brand or model element missing');
    return;
  }

  brandOptions.forEach(option => {
    option.addEventListener('click', function () {
      brandOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');

      const brand = this.dataset.brand;

      if (brandInput) {
        brandInput.value = brand;
      }

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

      if (modelSelect.options.length > 1) {
        modelSelect.selectedIndex = 1;
      }
    });
  });

  // 默认选中 Honda
  const hondaOption = document.querySelector('.brand-option[data-brand="honda"]');
  if (hondaOption) {
    hondaOption.click();
  }
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
function
console.log('STEP1 CHECK', {
  brand: brand.value,
  model: model.value,
  year: year.value,
  cc: cc.value,
  mileage: mileage.value
});
 validateStep(stepNumber) {
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

// ==================== VALUATION CALCULATION (PROFESSIONAL VERSION) ====================
function calculateEstimation() {
  console.log('Starting professional estimation calculation...');
  
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
  
  // Calculate base valuation
  const basePrice = parseInt(document.getElementById('model').selectedOptions[0]?.dataset.basePrice) || 8000000;
  
  // Start with base price
  let estimatedValue = basePrice;
  
  // Year adjustment (5% per year, max 70% depreciation)
  const currentYear = new Date().getFullYear();
  const age = currentYear - parseInt(formData.year);
  const yearDepreciation = Math.min(age * 0.05, 0.7);
  estimatedValue *= (1 - yearDepreciation);
  
  // Mileage adjustment
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
  
  // Engine condition adjustments
  let engineDepreciation = 0;
  if (formData.engine === 'sedang') engineDepreciation = 0.08;
  if (formData.engine === 'perbaikan') engineDepreciation = 0.20;
  estimatedValue *= (1 - engineDepreciation);
  
  // Body condition adjustments
  let bodyDepreciation = 0;
  if (formData.body === 'baret_sedikit') bodyDepreciation = 0.05;
  if (formData.body === 'rusak') bodyDepreciation = 0.15;
  estimatedValue *= (1 - bodyDepreciation);
  
  // Documents adjustments
  let docDepreciation = 0;
  if (formData.documents === 'stnk_saja') docDepreciation = 0.10;
  if (formData.documents === 'hilang') docDepreciation = 0.25;
  estimatedValue *= (1 - docDepreciation);
  
  // Ensure minimum value
  estimatedValue = Math.max(estimatedValue, 1000000);
  
  // Calculate range (±15% from average for professional assessment)
  const marketVolatility = 0.15; // 15% market fluctuation
  const minValue = Math.round(estimatedValue * (1 - marketVolatility));
  const maxValue = Math.round(estimatedValue * (1 + marketVolatility));
  
  console.log('Professional calculation complete:', minValue, '-', maxValue, '(Range)');
  console.log('Base price:', basePrice);
  console.log('Adjusted value:', estimatedValue);
  
  // Display results with professional range
  displayEstimation({
    minValue,
    maxValue,
    basePrice,
    formData,
    estimatedValue // Pass the calculated value for percentage calculations
  });
  
  // Go to results step
  nextStep(4);
}

function displayEstimation(result) {
  console.log('Displaying professional estimation results');
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };
  
  // Calculate middle value
  const middleValue = Math.round((result.minValue + result.maxValue) / 2);
  
  // Calculate percentages based on actual adjustments
  const totalAdjustment = result.basePrice - result.estimatedValue;
  const yearPercent = result.formData.year ? Math.round((2025 - result.formData.year) * 5) : 0;
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
  
  // Update value displays
  document.getElementById('estimatedValueMin').textContent = formatCurrency(result.minValue);
  document.getElementById('estimatedValueMax').textContent = formatCurrency(result.maxValue);
  document.getElementById('estimatedValueAvg').textContent = formatCurrency(middleValue);
  
  // Update breakdown with dynamic percentages
  document.getElementById('basePrice').textContent = `Rp ${formatCurrency(result.basePrice)}`;
  
  // Year adjustment
  const yearAdjustmentValue = Math.round(result.basePrice * (yearPercent / 100));
  document.getElementById('yearAdjustment').textContent = `-Rp ${formatCurrency(yearAdjustmentValue)}`;
  document.getElementById('yearPercent').textContent = yearPercent;
  
  // Mileage adjustment
  const mileageAdjustmentValue = Math.round(result.basePrice * (mileagePercent / 100));
  document.getElementById('mileageAdjustment').textContent = `-Rp ${formatCurrency(mileageAdjustmentValue)}`;
  document.getElementById('mileagePercent').textContent = mileagePercent;
  
  // Engine adjustment
  const engineAdjustmentValue = Math.round(result.basePrice * (enginePercent / 100));
  document.getElementById('engineAdjustment').textContent = `-Rp ${formatCurrency(engineAdjustmentValue)}`;
  document.getElementById('enginePercent').textContent = enginePercent;
  
  // Body adjustment
  const bodyAdjustmentValue = Math.round(result.basePrice * (bodyPercent / 100));
  document.getElementById('bodyAdjustment').textContent = `-Rp ${formatCurrency(bodyAdjustmentValue)}`;
  document.getElementById('bodyPercent').textContent = bodyPercent;
  
  // Document adjustment
  const docAdjustmentValue = Math.round(result.basePrice * (docPercent / 100));
  document.getElementById('docAdjustment').textContent = docAdjustmentValue > 0 ? `-Rp ${formatCurrency(docAdjustmentValue)}` : 'Rp 0';
  document.getElementById('docPercent').textContent = docPercent;
  
  // Total adjustment
  const totalAdjValue = yearAdjustmentValue + mileageAdjustmentValue + engineAdjustmentValue + bodyAdjustmentValue + docAdjustmentValue;
  document.getElementById('totalAdjustment').textContent = `-Rp ${formatCurrency(totalAdjValue)}`;
  
  // Update WhatsApp link with professional message
  const whatsappBtn = document.querySelector('.btn-whatsapp');
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
• Lokasi: ${document.getElementById('location').selectedOptions[0]?.textContent || result.formData.location}

Saya ingin melakukan konsultasi lebih lanjut dan penjadwalan inspeksi fisik untuk penyesuaian nilai yang lebih akurat. Terima kasih!`;
  
  const encodedMessage = encodeURIComponent(message);
  whatsappBtn.href = `https://wa.me/6289515692586?text=${encodedMessage}`;
  
  console.log('Professional results displayed successfully with range:', result.minValue, '-', result.maxValue);
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

console.log('JF Gadai Professional Assessment System Ready');
