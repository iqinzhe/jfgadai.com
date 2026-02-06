// ==================== electronics.js - 电子设备页面专用 ====================
document.addEventListener('DOMContentLoaded', function() {
  console.log('electronics.js - 电子设备页面加载');
  
  // 检查是否在电子设备页面
  if (!document.querySelector('.brand-tag')) {
    console.log('不在电子设备页面，跳过初始化');
    return;
  }
  
  // 初始化品牌标签效果
  initBrandTags();
});

// ==================== 品牌标签效果 ====================
function initBrandTags() {
  const brandTags = document.querySelectorAll('.brand-tag');
  
  brandTags.forEach(tag => {
    // 添加品牌标签点击效果
    tag.addEventListener('click', function(e) {
      e.preventDefault();
      const brand = this.textContent.trim();
      console.log('品牌选择:', brand);
      
      // 可以添加品牌筛选功能
      highlightSelectedBrand(this);
    });
  });
  
  console.log(`电子设备品牌标签: ${brandTags.length}个`);
}

// 高亮选中的品牌
function highlightSelectedBrand(selectedTag) {
  // 移除所有品牌的高亮
  document.querySelectorAll('.brand-tag').forEach(tag => {
    tag.classList.remove('selected');
  });
  
  // 高亮选中的品牌
  selectedTag.classList.add('selected');
}

console.log('✅ electronics.js - 电子设备页面脚本加载完成');