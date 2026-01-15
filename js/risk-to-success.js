// ==================== risk-to-success.js ====================
// 专门用于 risk-to-success.html 的交互功能

document.addEventListener('DOMContentLoaded', function() {
  // 自我评估工具逻辑
  initSelfAssessment();
  
  // 滚动动画
  initScrollAnimations();
  
  // 案例卡片悬停效果
  initCaseHoverEffects();
});

/**
 * 初始化自我评估工具
 */
function initSelfAssessment() {
  const optionButtons = document.querySelectorAll('.option-btn');
  const questionGroups = document.querySelectorAll('.question-group');
  const resultContainer = document.getElementById('assessmentResult');
  const resultMessage = document.getElementById('resultMessage');
  
  if (!optionButtons.length) return;
  
  let userAnswers = {
    docStatus: null,
    accidentHistory: null,
    usageType: null
  };
  
  // 为每个选项按钮添加点击事件
  optionButtons.forEach(button => {
    button.addEventListener('click', function() {
      const questionNumber = parseInt(this.closest('.question-group').dataset.question);
      const answerValue = this.dataset.value;
      const nextQuestion = this.dataset.next;
      
      // 保存答案
      switch(questionNumber) {
        case 1:
          userAnswers.docStatus = answerValue;
          break;
        case 2:
          userAnswers.accidentHistory = answerValue;
          break;
        case 3:
          userAnswers.usageType = answerValue;
          break;
      }
      
      // 添加点击反馈
      this.classList.add('clicked');
      setTimeout(() => {
        this.classList.remove('clicked');
      }, 200);
      
      // 显示下一题或结果
      if (nextQuestion === 'result') {
        showAssessmentResult(userAnswers);
      } else {
        showNextQuestion(questionNumber, parseInt(nextQuestion));
      }
    });
  });
  
  /**
   * 显示下一题
   */
  function showNextQuestion(currentQ, nextQ) {
    // 隐藏当前问题
    const currentQuestion = document.querySelector(`.question-group[data-question="${currentQ}"]`);
    currentQuestion.style.opacity = '0';
    currentQuestion.style.transform = 'translateX(-20px)';
    
    setTimeout(() => {
      currentQuestion.style.display = 'none';
      
      // 显示下一题
      const nextQuestion = document.querySelector(`.question-group[data-question="${nextQ}"]`);
      if (nextQuestion) {
        nextQuestion.style.display = 'block';
        setTimeout(() => {
          nextQuestion.style.opacity = '1';
          nextQuestion.style.transform = 'translateX(0)';
          nextQuestion.classList.add('active');
          
          // 滚动到下一题
          nextQuestion.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }, 50);
      }
    }, 300);
  }
  
  /**
   * 显示评估结果
   */
  function showAssessmentResult(answers) {
    // 隐藏所有问题
    questionGroups.forEach(q => {
      q.style.opacity = '0';
      q.style.transform = 'translateX(-20px)';
      setTimeout(() => {
        q.style.display = 'none';
      }, 300);
    });
    
    // 计算结果
    const result = calculateResult(answers);
    
    // 显示结果
    setTimeout(() => {
      resultMessage.innerHTML = result.message;
      resultContainer.style.display = 'block';
      
      setTimeout(() => {
        resultContainer.style.opacity = '1';
        resultContainer.style.transform = 'translateY(0)';
        
        // 滚动到结果
        resultContainer.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 50);
    }, 400);
  }
  
  /**
   * 计算结果
   */
  function calculateResult(answers) {
    let score = 0;
    let feedback = [];
    let recommendation = '';
    
    // 评估文档状态
    if (answers.docStatus === 'good') {
      score += 3;
      feedback.push('✅ <strong>Dokumen lengkap</strong> - Ini sangat baik!');
    } else if (answers.docStatus === 'warning') {
      score += 1;
      feedback.push('⚠️ <strong>Dokumen kurang satu</strong> - Perlu dilengkapi sebelum gadai.');
    } else {
      score += 0;
      feedback.push('❌ <strong>Dokumen tidak lengkap</strong> - Tidak bisa lanjut tanpa dokumen.');
    }
    
    // 评估事故历史
    if (answers.accidentHistory === 'good') {
      score += 3;
      feedback.push('✅ <strong>Tidak pernah kecelakaan</strong> - Nilai motor akan optimal.');
    } else if (answers.accidentHistory === 'warning') {
      score += 1;
      feedback.push('⚠️ <strong>Kecelakaan kecil</strong> - Mungkin ada sedikit pengurangan nilai.');
    } else {
      score += 0;
      feedback.push('❌ <strong>Kecelakaan serius</strong> - Nilai akan turun signifikan.');
    }
    
    // 评估使用类型
    if (answers.usageType === 'good') {
      score += 3;
      feedback.push('✅ <strong>Penggunaan pribadi</strong> - Motor Anda dalam kondisi terbaik.');
    } else if (answers.usageType === 'warning') {
      score += 1;
      feedback.push('⚠️ <strong>Daily use</strong> - Normal wear and tear, nilai standar.');
    } else {
      score += 0;
      feedback.push('❌ <strong>Ojol full-time</strong> - Depresiasi cepat, nilai lebih rendah.');
    }
    
    // 根据分数生成推荐
    if (score >= 7) {
      recommendation = '🎉 <strong>Sangat baik!</strong> Motor Anda memiliki potensi tinggi untuk gadai sukses. Gunakan sistem penilaian kami untuk mendapatkan nilai akurat.';
    } else if (score >= 4) {
      recommendation = '📝 <strong>Cukup baik</strong> dengan beberapa catatan. Beberapa faktor mungkin mempengaruhi nilai. Konsultasi gratis bisa membantu memahami detailnya.';
    } else {
      recommendation = '🤔 <strong>Perlu persiapan lebih.</strong> Motor Anda mungkin menghadapi kendala dalam proses gadai. Kami sarankan konsultasi dulu sebelum menggunakan sistem penilaian.';
    }
    
    // 添加鼓励语
    const encouragement = '<br><br><em>Ingat: Ini hanya perkiraan awal. Penilaian final ditentukan setelah pemeriksaan fisik oleh tim ahli kami.</em>';
    
    return {
      message: `
        <p><strong>Skor Anda: ${score}/9</strong></p>
        <div style="text-align: left; margin: 1rem 0;">
          ${feedback.join('<br>')}
        </div>
        <p>${recommendation}</p>
        ${encouragement}
      `
    };
  }
}

/**
 * 初始化滚动动画
 */
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        
        // 为案例卡片添加延迟动画
        if (entry.target.classList.contains('case-card')) {
          const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 0.1;
          entry.target.style.animationDelay = `${delay}s`;
        }
      }
    });
  }, observerOptions);
  
  // 观察所有需要动画的元素
  document.querySelectorAll('.case-card, .factor-card, .cta-option').forEach(item => {
    observer.observe(item);
  });
}

/**
 * 初始化案例卡片悬停效果
 */
function initCaseHoverEffects() {
  const caseCards = document.querySelectorAll('.case-card');
  
  caseCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.zIndex = '10';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.zIndex = '1';
    });
  });
}

/**
 * 重置评估工具（如果需要的话）
 */
function resetAssessment() {
  const questionGroups = document.querySelectorAll('.question-group');
  const resultContainer = document.getElementById('assessmentResult');
  
  // 显示第一题，隐藏其他
  questionGroups.forEach((q, index) => {
    q.style.display = index === 0 ? 'block' : 'none';
    q.style.opacity = index === 0 ? '1' : '0';
    q.style.transform = 'translateX(0)';
    q.classList.remove('active');
  });
  
  // 隐藏结果
  if (resultContainer) {
    resultContainer.style.display = 'none';
  }
  
  // 滚动到顶部
  document.querySelector('.self-assessment-section').scrollIntoView({ 
    behavior: 'smooth' 
  });
}

// 如果需要，可以导出函数供其他脚本使用
window.riskToSuccess = {
  resetAssessment
};