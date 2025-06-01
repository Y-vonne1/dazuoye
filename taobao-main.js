const CAROUSEL_INTERVAL = 5000;
const carousel = document.querySelector('.carousel');
const slides = document.querySelectorAll('.carousel-images a')
const dots = document.querySelectorAll('.carousel-dot');
let currentSlide = 0;
let autoPlay;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

function startAutoPlay() {
    autoPlay = setInterval(nextSlide, CAROUSEL_INTERVAL);
}

// 初始化事件
document.querySelector('.carousel-next').addEventListener('click', () => {
    clearInterval(autoPlay);
    nextSlide();
    startAutoPlay();
});

document.querySelector('.carousel-prev').addEventListener('click', () => {
    clearInterval(autoPlay);
    prevSlide();
    startAutoPlay();
});

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        clearInterval(autoPlay);
        currentSlide = index;
        showSlide(currentSlide);
        startAutoPlay();
    });
});

// 初始化轮播
startAutoPlay();
carousel.addEventListener('mouseenter', () => clearInterval(autoPlay));
carousel.addEventListener('mouseleave', startAutoPlay);
    
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