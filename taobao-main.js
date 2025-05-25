// ================= 轮播图功能 =================
const CAROUSEL_INTERVAL = 5000;
const carousel = document.querySelector('.carousel');
const images = carousel?.querySelectorAll('.carousel-images img');
const dotsContainer = carousel?.querySelector('.carousel-dots');
const prevBtn = carousel?.querySelector('.carousel-prev');
const nextBtn = carousel?.querySelector('.carousel-next');

let currentIndex = 0;
let autoPlayTimer;

// 初始化轮播图
function initializeCarousel() {
    if (!images || images.length === 0) return;

    // 创建指示点
    images.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'carousel-dot';
        dot.addEventListener('click', () => switchSlide(index));
        dotsContainer.appendChild(dot);
    });

    // 设置初始状态
    images[0].classList.add('active');
    dotsContainer.children[0].classList.add('active');
    startAutoPlay();
}

// 切换幻灯片
function switchSlide(newIndex) {
    // 移除当前激活状态
    images[currentIndex].classList.remove('active');
    dotsContainer.children[currentIndex].classList.remove('active');

    // 处理边界
    newIndex = (newIndex + images.length) % images.length;

    // 更新状态
    currentIndex = newIndex;
    images[currentIndex].classList.add('active');
    dotsContainer.children[currentIndex].classList.add('active');
}

// 自动播放控制
function startAutoPlay() {
    autoPlayTimer = setInterval(() => switchSlide(currentIndex + 1), CAROUSEL_INTERVAL);
}

// 事件监听
if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        clearInterval(autoPlayTimer);
        switchSlide(currentIndex - 1);
        startAutoPlay();
    });

    nextBtn.addEventListener('click', () => {
        clearInterval(autoPlayTimer);
        switchSlide(currentIndex + 1);
        startAutoPlay();
    });
}

if (carousel) {
    carousel.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
    carousel.addEventListener('mouseleave', startAutoPlay);
}

// ================= 搜索功能 =================
const searchForm = document.querySelector('.search-bar form');
const searchInput = document.querySelector('.search-bar input');
const suggestionsBox = document.createElement('div');
suggestionsBox.className = 'search-suggestions';

// 初始化搜索建议框
function initSearch() {
    if (!searchForm) return;

    // 添加建议框到DOM
    searchForm.parentNode.insertBefore(suggestionsBox, searchForm.nextSibling);

    // 输入事件监听
    searchInput.addEventListener('input', handleSearchInput);
    searchForm.addEventListener('submit', handleSearchSubmit);
}

// 处理搜索输入
async function handleSearchInput(e) {
    const keyword = e.target.value.trim();
    if (keyword.length === 0) {
        suggestionsBox.style.display = 'none';
        return;
    }

    try {
        const products = await loadProducts();
        const suggestions = getSuggestions(products, keyword);
        showSuggestions(suggestions);
    } catch (error) {
        console.error('加载商品数据失败:', error);
    }
}

// 处理表单提交
function handleSearchSubmit(e) {
    e.preventDefault();
    const keyword = searchInput.value.trim();
    if (keyword) {
        window.location.href = `search.html?q=${encodeURIComponent(keyword)}`;
    }
}

// 加载商品数据
async function loadProducts() {
    const response = await fetch('products.json');
    if (!response.ok) throw new Error('网络响应异常');
    return response.json();
}

// 获取搜索建议
function getSuggestions(products, keyword) {
    return products.filter(product => 
        product.name.toLowerCase().includes(keyword.toLowerCase()) ||
        product.desc.toLowerCase().includes(keyword.toLowerCase())
    ).slice(0, 5);
}

// 显示搜索建议
function showSuggestions(items) {
    suggestionsBox.innerHTML = items.length > 0 
        ? items.map(item => `
            <div class="suggestion-item" data-keyword="${item.name}">
                ${item.name} <span class="suggestion-price">¥${item.price.toFixed(1)}</span>
            </div>
        `).join('')
        : '<div class="no-suggestion">暂无相关商品</div>';

    suggestionsBox.style.display = 'block';
    
    // 添加点击事件
    suggestionsBox.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
            searchInput.value = item.dataset.keyword;
            suggestionsBox.style.display = 'none';
            searchForm.requestSubmit();
        });
    });
}

// ================= 初始化 =================
document.addEventListener('DOMContentLoaded', () => {
    initializeCarousel();
    initSearch();
});
