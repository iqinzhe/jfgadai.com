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

// ==================== 辅助函数 ====================
function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID').format(num);
}

// ==================== 加载车型 ====================
function loadModelsForBrand(brand) {
  const modelSelect = document.getElementById('model');
  if (!modelSelect) return;

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

  // 默认选择第一个车型
  if (modelSelect.options.length > 1) {
    modelSelect.selectedIndex = 1;
  }
}

// ==================== 页面初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
  console.log('assessment.js - 摩托车估价页面加载');
  
  if (!document.getElementById('motorAssessmentForm')) {
    console.log('不在估价页面，跳过初始化');
    return;
  }
  
  initBrandSelection();
  initYearSelect();
  initMileageSlider();
  initPhotoUpload();
  initStepNavigation();
  
  // 自动加载默认品牌（Honda）的车型
  const defaultBrand = document.querySelector('.brand-option.active');
  if (defaultBrand) {
    const brand = defaultBrand.dataset.brand;
    loadModelsForBrand(brand);
    document.getElementById('brand').value = brand;
  }
});

// ==================== 品牌选择 ====================
function initBrandSelection() {
  const brandOptions = document.querySelectorAll('.brand-option');
  const brandInput = document.getElementById('brand');
  
  if (!brandOptions.length) return;

  brandOptions.forEach(option => {
    option.addEventListener('click', function(e) {
      e.stopPropagation();
      
      brandOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
      
      const brand = this.dataset.brand;
      if (brandInput) brandInput.value = brand;
      
      loadModelsForBrand(brand);
    });
  });
}

// ==================== 年份选择 ====================
function initYearSelect() {
  const yearSelect = document.getElementById('year');
  if (!yearSelect) return;
  
  while (yearSelect.options.length > 1) yearSelect.remove(1);
  
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= 2010; year--) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }
  yearSelect.value = '2022';
}

// ==================== 里程滑块 ====================
function initMileageSlider() {
  const mileageInput = document.getElementById('mileage');
  const mileageSlider = document.getElementById('mileageSlider');
  if (!mileageSlider) return;
  
  mileageSlider.addEventListener('input', function() {
    mileageInput.value = this.value;
    updateMileageLabels(this.value);
  });
  
  mileageInput.addEventListener('input', function() {
    let value = parseInt(this.value) || 0;
    value = Math.min(Math.max(value, 0), 100000);
    this.value = value;
    mileageSlider.value = value;
    updateMileageLabels(value);
  });
  
  updateMileageLabels(mileageSlider.value);
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

// ==================== 照片上传 ====================
function initPhotoUpload() {
  const uploadAreas = document.querySelectorAll('.upload-area');
  if (!uploadAreas.length) return;
  
  uploadAreas.forEach(area => {
    // 避免重复添加移除按钮
    if (area.querySelector('.remove-photo')) return;
    
    const fileInput = area.querySelector('input[type="file"]');
    
    area.addEventListener('click', function(e) {
      if (e.target.closest('.remove-photo')) return;
      currentUploadArea = area.id;
      fileInput.click();
    });
    
    fileInput.addEventListener('change', function(e) {
      if (!currentUploadArea || !this.files || this.files.length === 0) return;
      const file = this.files[0];
      if (!file.type.startsWith('image/')) {
        alert('Silakan pilih file gambar (JPG, PNG, dll.)');
        return;
      }
      previewPhoto(file, currentUploadArea);
      const reader = new FileReader();
      reader.onload = function(e) {
        photoData[currentUploadArea] = e.target.result;
      };
      reader.readAsDataURL(file);
      this.value = ''; // 允许重复上传同一文件
    });
    
    // 添加移除按钮（如果还没有）
    if (!area.querySelector('.remove-photo')) {
      const removeBtn = document.createElement('div');
      removeBtn.className = 'remove-photo';
      removeBtn.innerHTML = '×';
      removeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        clearPhoto(area.id);
      });
      area.appendChild(removeBtn);
    }
  });
}

function previewPhoto(file, areaId) {
  const area = document.getElementById(areaId);
  if (!area) return;
  
  const existingPreview = area.querySelector('.upload-preview');
  if (existingPreview) existingPreview.remove();
  
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
  if (preview) preview.remove();
  area.classList.remove('has-image');
  photoData[areaId] = null;
  
  // 重置对应的 file input
  const fileInput = area.querySelector('input[type="file"]');
  if (fileInput) fileInput.value = '';
}

// ==================== 步骤导航 ====================
function initStepNavigation() {
  // 下一步按钮
  document.querySelectorAll('.btn-next').forEach(btn => {
    btn.removeEventListener('click', handleNextClick);
    btn.addEventListener('click', handleNextClick);
  });
  // 上一步按钮
  document.querySelectorAll('.btn-prev').forEach(btn => {
    btn.removeEventListener('click', handlePrevClick);
    btn.addEventListener('click', handlePrevClick);
  });
  // 提交/计算按钮
  const submitBtn = document.querySelector('.btn-submit');
  if (submitBtn) {
    submitBtn.removeEventListener('click', calculateEstimation);
    submitBtn.addEventListener('click', calculateEstimation);
  }
  // 重置按钮
  const resetBtn = document.querySelector('.btn-recalculate');
  if (resetBtn) {
    resetBtn.removeEventListener('click', resetAssessmentForm);
    resetBtn.addEventListener('click', resetAssessmentForm);
  }
}

function handleNextClick(e) {
  e.preventDefault();
  const currentStep = document.querySelector('.form-step.active');
  const currentStepNumber = parseInt(currentStep.id.replace('step', ''));
  if (validateAssessmentStep(currentStepNumber)) {
    const nextStepNumber = currentStepNumber + 1;
    if (nextStepNumber <= 4) {
      updateProgressBar(nextStepNumber);
      const nextStepElement = document.getElementById(`step${nextStepNumber}`);
      if (nextStepElement) {
        currentStep.classList.remove('active');
        nextStepElement.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }
}

function handlePrevClick(e) {
  e.preventDefault();
  const currentStep = document.querySelector('.form-step.active');
  const currentStepNumber = parseInt(currentStep.id.replace('step', ''));
  const prevStepNumber = currentStepNumber - 1;
  if (prevStepNumber >= 1) {
    updateProgressBar(prevStepNumber);
    const prevStepElement = document.getElementById(`step${prevStepNumber}`);
    if (prevStepElement) {
      currentStep.classList.remove('active');
      prevStepElement.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
  if (stepNumber === 1) {
    const brand = document.getElementById('brand').value;
    const model = document.getElementById('model').value;
    const year = document.getElementById('year').value;
    const cc = document.getElementById('cc').value;
    const mileage = document.getElementById('mileage').value;
    
    if (!brand) { alert('🚫 Silakan pilih merek motor'); return false; }
    if (!model) { alert('🚫 Silakan pilih model motor'); return false; }
    if (!year) { alert('🚫 Silakan pilih tahun produksi'); return false; }
    if (!cc) { alert('🚫 Silakan pilih kapasitas mesin (CC)'); return false; }
    if (!mileage || isNaN(mileage) || mileage < 0) { alert('🚫 Silakan isi kilometer tempuh yang valid'); return false; }
    return true;
  }
  else if (stepNumber === 2) {
    if (!document.querySelector('input[name="engine"]:checked')) { alert('🔧 Silakan pilih kondisi mesin motor Anda'); return false; }
    if (!document.querySelector('input[name="body"]:checked')) { alert('🎨 Silakan pilih kondisi body & cat motor Anda'); return false; }
    if (!document.querySelector('input[name="documents"]:checked')) { alert('📋 Silakan pilih kelengkapan dokumen (STNK & BPKB)'); return false; }
    return true;
  }
  else if (stepNumber === 3) {
    const fullName = document.getElementById('fullName').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const location = document.getElementById('location').value;
    if (!fullName) { alert('👤 Silakan isi nama lengkap Anda'); return false; }
    if (!phoneNumber || !/^[0-9]{10,13}$/.test(phoneNumber)) { alert('📱 Silakan isi nomor WhatsApp yang valid (10-13 digit)'); return false; }
    if (!location) { alert('📍 Silakan pilih lokasi kota terdekat Anda'); return false; }
    return true;
  }
  return true;
}

// ==================== 估价计算 ====================
function calculateEstimation() {
  if (!validateAssessmentStep(3)) return;
  
  // 获取表单数据
  const brand = document.getElementById('brand').value;
  const modelSelect = document.getElementById('model');
  const modelId = modelSelect.value;
  const modelName = modelSelect.selectedOptions[0]?.textContent || 'Motor';
  const yearRaw = document.getElementById('year').value;
  const ccRaw = document.getElementById('cc').value;
  const mileageRaw = document.getElementById('mileage').value;
  const engine = document.querySelector('input[name="engine"]:checked')?.value;
  const body = document.querySelector('input[name="body"]:checked')?.value;
  const documents = document.querySelector('input[name="documents"]:checked')?.value;
  const fullName = document.getElementById('fullName').value.trim();
  const phoneNumber = document.getElementById('phoneNumber').value.trim();
  const location = document.getElementById('location').value;
  
  // 数值校验
  const year = parseInt(yearRaw);
  const cc = parseInt(ccRaw);
  const mileage = parseInt(mileageRaw);
  if (isNaN(year) || isNaN(mileage)) {
    alert('Data tahun atau kilometer tidak valid, silakan periksa kembali.');
    return;
  }
  
  const basePrice = parseInt(modelSelect.selectedOptions[0]?.dataset.basePrice) || 8000000;
  let estimatedValue = basePrice;
  
  // 年份调整
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  const yearDepreciation = Math.min(age * 0.05, 0.7);
  estimatedValue *= (1 - yearDepreciation);
  
  // 里程调整
  let mileageDepreciation = 0;
  if (mileage > 80000) mileageDepreciation = 0.15;
  else if (mileage > 50000) mileageDepreciation = 0.10;
  else if (mileage > 30000) mileageDepreciation = 0.05;
  else if (mileage > 10000) mileageDepreciation = 0.02;
  estimatedValue *= (1 - mileageDepreciation);
  
  // 引擎状况调整
  let engineDepreciation = 0;
  if (engine === 'sedang') engineDepreciation = 0.08;
  if (engine === 'perbaikan') engineDepreciation = 0.20;
  estimatedValue *= (1 - engineDepreciation);
  
  // 车身状况调整
  let bodyDepreciation = 0;
  if (body === 'baret_sedikit') bodyDepreciation = 0.05;
  if (body === 'rusak') bodyDepreciation = 0.15;
  estimatedValue *= (1 - bodyDepreciation);
  
  // 文件调整
  let docDepreciation = 0;
  if (documents === 'stnk_saja') docDepreciation = 0.10;
  if (documents === 'hilang') docDepreciation = 0.25;
  estimatedValue *= (1 - docDepreciation);
  
  estimatedValue = Math.max(estimatedValue, 1000000);
  
  // 计算范围（±15%）
  const marketVolatility = 0.15;
  const minValue = Math.round(estimatedValue * (1 - marketVolatility));
  const maxValue = Math.round(estimatedValue * (1 + marketVolatility));
  
  displayEstimationResult({
    minValue,
    maxValue,
    basePrice,
    formData: {
      brand,
      modelName,
      year,
      cc,
      mileage,
      engine,
      body,
      documents,
      fullName,
      phoneNumber,
      location
    },
    estimatedValue
  });
  
  // 转到结果步骤
  const currentStep = document.querySelector('.form-step.active');
  const step4 = document.getElementById('step4');
  if (currentStep && step4) {
    currentStep.classList.remove('active');
    step4.classList.add('active');
    updateProgressBar(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function displayEstimationResult(result) {
  const middleValue = Math.round((result.minValue + result.maxValue) / 2);
  
  document.getElementById('estimatedValueMin').textContent = formatRupiah(result.minValue);
  document.getElementById('estimatedValueMax').textContent = formatRupiah(result.maxValue);
  document.getElementById('estimatedValueAvg').textContent = formatRupiah(middleValue);
  
  const locationText = document.getElementById('location').selectedOptions[0]?.textContent || result.formData.location;
  
  const message = `Halo JF Gadai, saya ${result.formData.fullName} telah melakukan penilaian online.

📋 DATA MOTOR:
• Merek: ${result.formData.brand.toUpperCase()}
• Model: ${result.formData.modelName}
• Tahun: ${result.formData.year}
• CC: ${result.formData.cc}cc
• Kilometer: ${formatRupiah(result.formData.mileage)} KM
• Kondisi Mesin: ${result.formData.engine === 'baik' ? 'Baik' : result.formData.engine === 'sedang' ? 'Sedang' : 'Butuh Perbaikan'}
• Kondisi Body: ${result.formData.body === 'mulus' ? 'Mulus' : result.formData.body === 'baret_sedikit' ? 'Baret Sedikit' : 'Rusak/Penyok'}
• Dokumen: ${result.formData.documents === 'lengkap' ? 'Lengkap (STNK+BPKB)' : result.formData.documents === 'stnk_saja' ? 'STNK Saja' : 'Belum Ada'}

💰 PERKIRAAN NILAI GADAI (RANGE):
${formatRupiah(result.minValue)} - ${formatRupiah(result.maxValue)}
(Nilai tengah: ${formatRupiah(middleValue)})

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
  
  // 重置品牌高亮
  document.querySelectorAll('.brand-option').forEach(opt => opt.classList.remove('active'));
  const defaultBrand = document.querySelector('.brand-option[data-brand="honda"]');
  if (defaultBrand) {
    defaultBrand.classList.add('active');
    document.getElementById('brand').value = 'honda';
    loadModelsForBrand('honda');
  }
  
  // 重置年份
  document.getElementById('year').value = '2022';
  
  // 重置里程
  document.getElementById('mileage').value = '20000';
  const mileageSlider = document.getElementById('mileageSlider');
  if (mileageSlider) mileageSlider.value = '20000';
  updateMileageLabels(20000);
  
  // 重置单选按钮
  document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
  
  // 重置照片
  document.querySelectorAll('.upload-area').forEach(area => {
    clearPhoto(area.id);
  });
  Object.keys(photoData).forEach(key => photoData[key] = null);
  
  // 重置进度条并回到步骤1
  updateProgressBar(1);
  document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
  document.getElementById('step1').classList.add('active');
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

console.log('✅ assessment.js - 摩托车估价脚本加载完成');