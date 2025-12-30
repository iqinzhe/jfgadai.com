// 摩托车型号数据库（印尼市场常见型号）
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
  ],
  suzuki: [
    { id: 'nex', name: 'Suzuki Nex', basePrice: 8000000 },
    { id: 'address', name: 'Suzuki Address', basePrice: 8500000 },
    { id: 'gsx', name: 'Suzuki GSX', basePrice: 13000000 },
    { id: 'satria', name: 'Suzuki Satria', basePrice: 7500000 }
  ],
  lainnya: [
    { id: 'vespa', name: 'Vespa', basePrice: 20000000 },
    { id: 'kawasaki', name: 'Kawasaki', basePrice: 12000000 },
    { id: 'lainnya', name: 'Lainnya', basePrice: 7000000 }
  ]
};

// 调整系数
const adjustmentFactors = {
  year: {
    '2024': 1.0, '2023': 0.9, '2022': 0.8, '2021': 0.7, '2020': 0.6,
    '2019': 0.5, '2018': 0.4, '2017': 0.35, '2016': 0.3, '2015': 0.25
  },
  mileage: {
    '0-10000': 1.0, '10001-20000': 0.9, '20001-30000': 0.8,
    '30001-50000': 0.7, '50001-70000': 0.6, '70001-100000': 0.5, '100000+': 0.4
  },
  engine: {
    'baik': 0.95, 'sedang': 0.8, 'perbaikan': 0.6
  },
  body: {
    'mulus': 0.95, 'baret_sedikit': 0.85, 'rusak': 0.7
  },
  documents: {
    'lengkap': 1.0, 'stnk_saja': 0.7, 'hilang': 0.5
  },
  cc: {
    '110': 0.9, '125': 0.95, '150': 1.0, '155': 1.05,
    '160': 1.1, '200': 1.2, '250': 1.3, '300': 1.4, '500': 1.5
  }
};

document.addEventListener('DOMContentLoaded', function() {
  // 初始化品牌选择
  initBrandSelection();
  
  // 初始化年份选择
  initYearSelect();
  
  // 初始化里程滑块
  initMileageSlider();
  
  // 初始化照片上传
  initPhotoUpload();
  
  // 初始化FAQ交互
  initFAQ();
  
  // 初始化表单验证
  initFormValidation();
});

// 品牌选择
function initBrandSelection() {
  const brandOptions = document.querySelectorAll('.brand-option');
  const modelSelect = document.getElementById('model');
  
  brandOptions.forEach(option => {
    option.addEventListener('click', function() {
      // 移除其他选项的active类
      brandOptions.forEach(opt => opt.classList.remove('active'));
      
      // 添加active类到当前选项
      this.classList.add('active');
      
      // 设置隐藏输入框的值
      const brand = this.dataset.brand;
      document.getElementById('brand').value = brand;
      
      // 启用并填充车型选择
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
    });
  });
}

// 年份选择初始化
function initYearSelect() {
  const yearSelect = document.getElementById('year');
  const currentYear = new Date().getFullYear();
  
  for (let year = currentYear; year >= 2010; year--) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }
}

// 里程滑块
function initMileageSlider() {
  const mileageInput = document.getElementById('mileage');
  const mileageSlider = document.getElementById('mileageSlider');
  
  mileageSlider.addEventListener('input', function() {
    mileageInput.value = this.value;
    updateMileageLabels(this.value);
  });
  
  mileageInput.addEventListener('input', function() {
    const value = Math.min(Math.max(this.value, 0), 100000);
    mileageSlider.value = value;
    updateMileageLabels(value);
  });
}

function updateMileageLabels(value) {
  const labels = document.querySelectorAll('.mileage-labels span');
  if (value < 50000) {
    labels[0].style.fontWeight = 'bold';
    labels[0].style.color = 'var(--secondary-color)';
    labels[1].style.fontWeight = 'normal';
    labels[2].style.fontWeight = 'normal';
  } else if (value < 100000) {
    labels[1].style.fontWeight = 'bold';
    labels[1].style.color = 'var(--secondary-color)';
    labels[0].style.fontWeight = 'normal';
    labels[2].style.fontWeight = 'normal';
  } else {
    labels[2].style.fontWeight = 'bold';
    labels[2].style.color = 'var(--secondary-color)';
    labels[0].style.fontWeight = 'normal';
    labels[1].style.fontWeight = 'normal';
  }
}

// 照片上传
function initPhotoUpload() {
  const uploadAreas = document.querySelectorAll('.upload-area');
  const fileInput = document.getElementById('photoInput');
  
  uploadAreas.forEach(area => {
    area.addEventListener('click', function() {
      fileInput.click();
    });
  });
  
  fileInput.addEventListener('change', function(e) {
    if (this.files.length > 0) {
      // 这里可以添加文件上传处理逻辑
      alert(`Berhasil memilih ${this.files.length} foto`);
      
      // 标记已上传的区域（示例）
      uploadAreas[0].classList.add('has-photo');
      uploadAreas[0].innerHTML = '<span class="upload-icon">✅</span><span class="upload-text">Terupload</span>';
    }
  });
}

// FAQ交互
function initFAQ() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const faqItem = this.parentElement;
      faqItem.classList.toggle('active');
    });
  });
}

// 表单验证
function initFormValidation() {
  const form = document.getElementById('motorAssessmentForm');
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    calculateEstimation();
  });
}

// 步骤导航
function nextStep(step) {
  const currentStep = document.querySelector('.form-step.active');
  const nextStep = document.getElementById(`step${step}`);
  
  // 验证当前步骤
  if (!validateStep(step - 1)) {
    alert('Silakan lengkapi semua data di langkah ini.');
    return;
  }
  
  // 更新进度条
  updateProgressBar(step);
  
  // 切换步骤
  currentStep.classList.remove('active');
  nextStep.classList.add('active');
  
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep(step) {
  const currentStep = document.querySelector('.form-step.active');
  const prevStep = document.getElementById(`step${step}`);
  
  // 更新进度条
  updateProgressBar(step);
  
  // 切换步骤
  currentStep.classList.remove('active');
  prevStep.classList.add('active');
  
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgressBar(step) {
  const progressSteps = document.querySelectorAll('.progress-step');
  
  progressSteps.forEach(progressStep => {
    const stepNumber = parseInt(progressStep.dataset.step);
    progressStep.classList.toggle('active', stepNumber === step);
  });
}

function validateStep(stepNumber) {
  const stepElement = document.getElementById(`step${stepNumber + 1}`);
  const requiredInputs = stepElement.querySelectorAll('[required]');
  
  for (let input of requiredInputs) {
    if (!input.value && !input.checked) {
      input.classList.add('error');
      return false;
    } else {
      input.classList.remove('error');
    }
  }
  
  return true;
}

// 计算估值
function calculateEstimation() {
  // 验证所有步骤
  if (!validateStep(0) || !validateStep(1) || !validateStep(2)) {
    alert('Silakan lengkapi semua data terlebih dahulu.');
    return;
  }
  
  // 获取表单数据
  const formData = {
    brand: document.getElementById('brand').value,
    model: document.getElementById('model').value,
    modelName: document.getElementById('model').selectedOptions[0]?.textContent || '',
    year: document.getElementById('year').value,
    cc: document.getElementById('cc').value,
    mileage: document.getElementById('mileage').value,
    engine: document.querySelector('input[name="engine"]:checked')?.value,
    body: document.querySelector('input[name="body"]:checked')?.value,
    documents: document.querySelector('input[name="documents"]:checked')?.value,
    fullName: document.getElementById('fullName').value,
    phoneNumber: document.getElementById('phoneNumber').value,
    location: document.getElementById('location').value
  };
  
  // 获取基础价格
  const modelOption = document.getElementById('model').selectedOptions[0];
  let basePrice = modelOption?.dataset.basePrice ? parseInt(modelOption.dataset.basePrice) : 8000000;
  
  // 应用调整系数
  let adjustments = {
    year: calculateYearAdjustment(formData.year, basePrice),
    mileage: calculateMileageAdjustment(formData.mileage, basePrice),
    engine: calculateConditionAdjustment(formData.engine, 'engine', basePrice),
    body: calculateConditionAdjustment(formData.body, 'body', basePrice),
    cc: calculateCCAdjustment(formData.cc, basePrice),
    documents: calculateDocumentAdjustment(formData.documents, basePrice)
  };
  
  // 计算最终估值
  let totalAdjustment = Object.values(adjustments).reduce((a, b) => a + b, 0);
  let estimatedValue = Math.max(basePrice + totalAdjustment, 1000000); // 最低100万
  
  // 添加随机范围（±15%）
  let minValue = Math.round(estimatedValue * 0.85);
  let maxValue = Math.round(estimatedValue * 1.15);
  
  // 显示结果
  displayEstimation({
    minValue,
    maxValue,
    basePrice,
    adjustments,
    formData
  });
  
  // 跳转到结果步骤
  nextStep(4);
}

// 计算各项调整
function calculateYearAdjustment(year, basePrice) {
  const factor = adjustmentFactors.year[year] || 0.2;
  return (factor - 1) * basePrice;
}

function calculateMileageAdjustment(mileage, basePrice) {
  let mileageRange = '100000+';
  const mileageNum = parseInt(mileage);
  
  if (mileageNum <= 10000) mileageRange = '0-10000';
  else if (mileageNum <= 20000) mileageRange = '10001-20000';
  else if (mileageNum <= 30000) mileageRange = '20001-30000';
  else if (mileageNum <= 50000) mileageRange = '30001-50000';
  else if (mileageNum <= 70000) mileageRange = '50001-70000';
  else if (mileageNum <= 100000) mileageRange = '70001-100000';
  
  const factor = adjustmentFactors.mileage[mileageRange] || 0.4;
  return (factor - 1) * basePrice;
}

function calculateConditionAdjustment(condition, type, basePrice) {
  const factor = adjustmentFactors[type][condition] || 0.8;
  return (factor - 1) * basePrice;
}

function calculateCCAdjustment(cc, basePrice) {
  const factor = adjustmentFactors.cc[cc] || 1.0;
  return (factor - 1) * basePrice * 0.3; // CC影响相对较小
}

function calculateDocumentAdjustment(documents, basePrice) {
  const factor = adjustmentFactors.documents[documents] || 0.5;
  return (factor - 1) * basePrice * 0.4; // 文档影响中等
}

// 显示估值结果
function displayEstimation(result) {
  // 格式化货币
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };
  
  // 更新估值显示
  document.getElementById('estimatedValue').textContent = formatCurrency(result.minValue);
  document.getElementById('estimatedValueMax').textContent = formatCurrency(result.maxValue);
  
  // 更新详细调整
  document.getElementById('basePrice').textContent = `Rp ${formatCurrency(result.basePrice)}`;
  document.getElementById('yearAdjustment').textContent = `Rp ${formatCurrency(result.adjustments.year)}`;
  document.getElementById('mileageAdjustment').textContent = `Rp ${formatCurrency(result.adjustments.mileage)}`;
  document.getElementById('engineAdjustment').textContent = `Rp ${formatCurrency(result.adjustments.engine)}`;
  document.getElementById('bodyAdjustment').textContent = `Rp ${formatCurrency(result.adjustments.body)}`;
  
  // 更新WhatsApp链接
  const whatsappBtn = document.querySelector('.btn-whatsapp');
  const message = `Halo JF Gadai, saya ${result.formData.fullName} telah melakukan penilaian online untuk motor ${result.formData.modelName} ${result.formData.year}. Hasil perkiraan: Rp ${formatCurrency(result.minValue)} - Rp ${formatCurrency(result.maxValue)}. Nomor saya: ${result.formData.phoneNumber}.`;
  const encodedMessage = encodeURIComponent(message);
  whatsappBtn.href = `https://wa.me/6289515692586?text=${encodedMessage}`;
}

// 重置表单
function resetForm() {
  // 重置表单数据
  document.getElementById('motorAssessmentForm').reset();
  
  // 重置品牌选择
  document.querySelectorAll('.brand-option').forEach(opt => opt.classList.remove('active'));
  document.getElementById('brand').value = '';
  
  // 重置车型选择
  const modelSelect = document.getElementById('model');
  modelSelect.innerHTML = '<option value="">Pilih merek terlebih dahulu</option>';
  modelSelect.disabled = true;
  
  // 重置里程滑块
  document.getElementById('mileage').value = '15000';
  document.getElementById('mileageSlider').value = '15000';
  updateMileageLabels('15000');
  
  // 重置照片上传
  document.querySelectorAll('.upload-area').forEach(area => {
    area.classList.remove('has-photo');
    area.innerHTML = '<span class="upload-icon">📷</span><span class="upload-text">' + area.dataset.text + '</span>';
  });
  
  // 重置进度条
  updateProgressBar(1);
  
  // 回到第一步
  document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
  document.getElementById('step1').classList.add('active');
  
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' });
}