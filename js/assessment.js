// ==================== JF Gadai - Penilaian Online Motor ====================
// File: js/assessment.js
// Tanggal: 2025
// Fungsi: Sistem penilaian online motor untuk gadai

// Database model motor Indonesia
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

// Faktor penyesuaian harga
const adjustmentFactors = {
  year: {
    '2024': 1.0, '2023': 0.9, '2022': 0.85, '2021': 0.8, '2020': 0.75,
    '2019': 0.7, '2018': 0.65, '2017': 0.6, '2016': 0.55, '2015': 0.5,
    '2014': 0.45, '2013': 0.4, '2012': 0.35, '2011': 0.3, '2010': 0.25
  },
  mileage: {
    '0-10000': 1.0, '10001-20000': 0.95, '20001-30000': 0.9,
    '30001-50000': 0.85, '50001-70000': 0.8, '70001-100000': 0.75, '100000+': 0.7
  },
  engine: {
    'baik': 0.95, 'sedang': 0.85, 'perbaikan': 0.7
  },
  body: {
    'mulus': 0.95, 'baret_sedikit': 0.88, 'rusak': 0.75
  },
  documents: {
    'lengkap': 1.0, 'stnk_saja': 0.8, 'hilang': 0.6
  },
  cc: {
    '110': 0.9, '125': 0.95, '150': 1.0, '155': 1.05,
    '160': 1.1, '200': 1.2, '250': 1.3, '300': 1.4, '500': 1.5
  }
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
  console.log('JF Gadai - Penilaian Online Motor loaded');
  
  // Inisialisasi semua fungsi
  initBrandSelection();
  initYearSelect();
  initMileageSlider();
  initPhotoUpload();
  initFAQ();
  initFormNavigation();
  
  // Set tahun default ke 2022
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
      // Remove active class from all options
      brandOptions.forEach(opt => opt.classList.remove('active'));
      
      // Add active class to clicked option
      this.classList.add('active');
      
      // Set hidden input value
      const brand = this.dataset.brand;
      document.getElementById('brand').value = brand;
      
      // Enable and populate model selection
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
      
      // Auto-select first model for better UX
      setTimeout(() => {
        if (modelSelect.options.length > 1) {
          modelSelect.selectedIndex = 1;
        }
      }, 100);
    });
  });
  
  // Auto-select Honda as default
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
  
  // Clear existing options
  yearSelect.innerHTML = '<option value="">Pilih tahun</option>';
  
  // Add years from current to 2010
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
  
  // Reset all labels
  labels.forEach(label => {
    label.style.fontWeight = 'normal';
    label.style.color = '';
  });
  
  // Highlight appropriate label
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

// ==================== PHOTO UPLOAD ====================
function initPhotoUpload() {
  const uploadAreas = document.querySelectorAll('.upload-area');
  const fileInput = document.getElementById('photoInput');
  
  if (!uploadAreas.length || !fileInput) return;
  
  uploadAreas.forEach(area => {
    area.addEventListener('click', function() {
      fileInput.click();
    });
  });
  
  fileInput.addEventListener('change', function(e) {
    if (this.files.length > 0) {
      // Mark first upload area as uploaded
      uploadAreas[0].classList.add('has-photo');
      uploadAreas[0].innerHTML = '<span class="upload-icon">✅</span><span class="upload-text">Terupload</span>';
      
      // Optional: show file names
      console.log(`${this.files.length} foto dipilih`);
    }
  });
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

// ==================== FORM NAVIGATION ====================
function initFormNavigation() {
  // Next/Prev button event listeners are handled by onclick attributes
}

function nextStep(step) {
  // Validate current step
  if (!validateStep(step - 1)) {
    return; // Validation will show alert
  }
  
  // Update progress bar
  updateProgressBar(step);
  
  // Switch steps
  const currentStep = document.querySelector('.form-step.active');
  const nextStep = document.getElementById(`step${step}`);
  
  if (currentStep && nextStep) {
    currentStep.classList.remove('active');
    nextStep.classList.add('active');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function prevStep(step) {
  // Update progress bar
  updateProgressBar(step);
  
  // Switch steps
  const currentStep = document.querySelector('.form-step.active');
  const prevStep = document.getElementById(`step${step}`);
  
  if (currentStep && prevStep) {
    currentStep.classList.remove('active');
    prevStep.classList.add('active');
    
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
  // Step 1: Motor Information
  if (stepNumber === 0) {
    if (!document.getElementById('brand').value) {
      alert('🚫 Silakan pilih merek motor (Honda/Yamaha/Suzuki/Lainnya)');
      return false;
    }
    if (!document.getElementById('model').value) {
      alert('🚫 Silakan pilih model motor sesuai merek yang dipilih');
      return false;
    }
    if (!document.getElementById('year').value) {
      alert('🚫 Silakan pilih tahun produksi motor');
      return false;
    }
    if (!document.getElementById('cc').value) {
      alert('🚫 Silakan pilih kapasitas mesin (CC)');
      return false;
    }
    const mileage = document.getElementById('mileage').value;
    if (!mileage || mileage < 0 || mileage > 1000000) {
      alert('🚫 Silakan isi kilometer tempuh (0 - 1,000,000 KM)');
      return false;
    }
    return true;
  }
  
  // Step 2: Condition Selection
  else if (stepNumber === 1) {
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
  
  // Step 3: Personal Information
  else if (stepNumber === 2) {
    const fullName = document.getElementById('fullName').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const location = document.getElementById('location').value;
    
    if (!fullName) {
      alert('👤 Silakan isi nama lengkap Anda (sesuai KTP)');
      document.getElementById('fullName').focus();
      return false;
    }
    
    if (!phoneNumber) {
      alert('📱 Silakan isi nomor WhatsApp Anda');
      document.getElementById('phoneNumber').focus();
      return false;
    }
    
    // Simple phone validation for Indonesia
    const phoneDigits = phoneNumber.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 13) {
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
  
  // Step 4: Always valid
  else if (stepNumber === 3) {
    return true;
  }
  
  return false;
}

// ==================== VALUATION CALCULATION ====================
function calculateEstimation() {
  console.log('Calculating estimation...');
  
  // Validate all steps
  if (!validateStep(0) || !validateStep(1) || !validateStep(2)) {
    console.log('Validation failed');
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
  
  console.log('Form data:', formData);
  
  // Calculate valuation
  const result = calculateValuation(formData);
  
  // Display results
  displayEstimation(result);
  
  // Go to results step
  nextStep(4);
}

function calculateValuation(formData) {
  // Get base price
  const modelOption = document.getElementById('model').selectedOptions[0];
  let basePrice = modelOption?.dataset.basePrice ? parseInt(modelOption.dataset.basePrice) : 8000000;
  
  console.log('Base price:', basePrice);
  
  // Calculate adjustments
  const adjustments = {
    year: calculateYearAdjustment(formData.year, basePrice),
    mileage: calculateMileageAdjustment(formData.mileage, basePrice),
    engine: calculateConditionAdjustment(formData.engine, 'engine', basePrice),
    body: calculateConditionAdjustment(formData.body, 'body', basePrice),
    cc: calculateCCAdjustment(formData.cc, basePrice),
    documents: calculateDocumentAdjustment(formData.documents, basePrice)
  };
  
  console.log('Adjustments:', adjustments);
  
  // Calculate total adjustment
  let totalAdjustment = Object.values(adjustments).reduce((a, b) => a + b, 0);
  console.log('Total adjustment:', totalAdjustment);
  
  // Calculate estimated value (minimum 1,000,000)
  let estimatedValue = Math.max(basePrice + totalAdjustment, 1000000);
  console.log('Estimated value:', estimatedValue);
  
  // Add realistic range (±15-25%)
  let minValue = Math.round(estimatedValue * 0.75);
  let maxValue = Math.round(estimatedValue * 1.25);
  
  // Ensure reasonable values
  minValue = Math.max(minValue, 1000000);
  maxValue = Math.max(maxValue, minValue + 1000000);
  
  console.log('Final range:', minValue, '-', maxValue);
  
  return {
    minValue,
    maxValue,
    basePrice,
    adjustments,
    formData
  };
}

// Calculation helper functions
function calculateYearAdjustment(year, basePrice) {
  const currentYear = new Date().getFullYear();
  const age = currentYear - parseInt(year);
  const depreciation = Math.min(age * 0.08, 0.7); // Max 70% depreciation
  return -basePrice * depreciation;
}

function calculateMileageAdjustment(mileage, basePrice) {
  if (mileage <= 10000) return 0;
  else if (mileage <= 30000) return -basePrice * 0.05;
  else if (mileage <= 50000) return -basePrice * 0.1;
  else if (mileage <= 70000) return -basePrice * 0.15;
  else if (mileage <= 100000) return -basePrice * 0.2;
  else return -basePrice * 0.3;
}

function calculateConditionAdjustment(condition, type, basePrice) {
  const factors = {
    engine: { 'baik': 0, 'sedang': -0.1, 'perbaikan': -0.25 },
    body: { 'mulus': 0, 'baret_sedikit': -0.05, 'rusak': -0.15 },
    documents: { 'lengkap': 0, 'stnk_saja': -0.1, 'hilang': -0.3 }
  };
  
  const factor = factors[type]?.[condition] || 0;
  return basePrice * factor;
}

function calculateCCAdjustment(cc, basePrice) {
  const ccFactor = {
    '110': -0.05, '125': -0.02, '150': 0, '155': 0.03,
    '160': 0.05, '200': 0.1, '250': 0.15, '300': 0.2, '500': 0.3
  }[cc] || 0;
  
  return basePrice * ccFactor;
}

function calculateDocumentAdjustment(documents, basePrice) {
  return calculateConditionAdjustment(documents, 'documents', basePrice);
}

// ==================== DISPLAY RESULTS ====================
function displayEstimation(result) {
  console.log('Displaying estimation:', result);
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };
  
  // Update value displays
  document.getElementById('estimatedValue').textContent = formatCurrency(result.minValue);
  document.getElementById('estimatedValueMax').textContent = formatCurrency(result.maxValue);
  
  // Update breakdown
  document.getElementById('basePrice').textContent = `Rp ${formatCurrency(result.basePrice)}`;
  document.getElementById('yearAdjustment').textContent = `Rp ${formatCurrency(result.adjustments.year)}`;
  document.getElementById('mileageAdjustment').textContent = `Rp ${formatCurrency(result.adjustments.mileage)}`;
  document.getElementById('engineAdjustment').textContent = `Rp ${formatCurrency(result.adjustments.engine)}`;
  document.getElementById('bodyAdjustment').textContent = `Rp ${formatCurrency(result.adjustments.body)}`;
  
  // Update WhatsApp link with all information
  const whatsappBtn = document.querySelector('.btn-whatsapp');
  const message = `Halo JF Gadai, saya ${result.formData.fullName} telah melakukan penilaian online.

📋 Data Motor:
• Merek: ${result.formData.brand.toUpperCase()}
• Model: ${result.formData.modelName}
• Tahun: ${result.formData.year}
• CC: ${result.formData.cc}cc
• Kilometer: ${formatCurrency(result.formData.mileage)} KM

💰 Perkiraan Nilai:
Rp ${formatCurrency(result.minValue)} - Rp ${formatCurrency(result.maxValue)}

📞 Kontak:
• Nama: ${result.formData.fullName}
• WhatsApp: ${result.formData.phoneNumber}
• Lokasi: ${document.getElementById('location').selectedOptions[0]?.textContent || result.formData.location}

Saya tertarik untuk konsultasi lebih lanjut. Terima kasih!`;
  
  const encodedMessage = encodeURIComponent(message);
  whatsappBtn.href = `https://wa.me/6289515692586?text=${encodedMessage}`;
  console.log('WhatsApp link updated');
  
  // Show success animation
  const estimationCard = document.querySelector('.estimation-card');
  if (estimationCard) {
    estimationCard.style.animation = 'none';
    setTimeout(() => {
      estimationCard.style.animation = 'resultAppear 0.8s ease';
    }, 10);
  }
}

// ==================== FORM RESET ====================
function resetForm() {
  console.log('Resetting form...');
  
  // Reset form inputs
  document.getElementById('motorAssessmentForm').reset();
  
  // Reset brand selection
  document.querySelectorAll('.brand-option').forEach(opt => opt.classList.remove('active'));
  document.getElementById('brand').value = '';
  
  // Reset model selection
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
    area.classList.remove('has-photo');
    const text = area.id === 'uploadFront' ? 'Depan' : 
                 area.id === 'uploadBack' ? 'Belakang' : 'Samping';
    area.innerHTML = `<span class="upload-icon">📷</span><span class="upload-text">${text}</span>`;
  });
  
  // Reset progress
  updateProgressBar(1);
  
  // Go back to step 1
  document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
  document.getElementById('step1').classList.add('active');
  
  // Auto-select Honda and default values
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

// ==================== UTILITY FUNCTIONS ====================
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Initialize when page loads
console.log('JF Gadai Assessment System Ready');