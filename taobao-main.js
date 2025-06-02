/**
 * 淘宝网主页面JavaScript
 * 功能说明：
 * 1. 轮播图自动播放和手动控制
 * 2. 搜索功能实现
 * 3. 分类框展开/收起功能
 * 4. 分类点击跳转搜索功能
 */

// 全局商品数据
let productData = {
    products: [],
    categories: []
};

// ================= 轮播图功能 =================
const CAROUSEL_INTERVAL = 5000; // 轮播间隔5秒
const carousel = document.querySelector('.carousel');
const images = carousel?.querySelectorAll('.carousel-images img');
const dotsContainer = carousel?.querySelector('.carousel-dots');
const prevBtn = carousel?.querySelector('.carousel-prev');
const nextBtn = carousel?.querySelector('.carousel-next');

let currentIndex = 0;
let autoPlayTimer;

/**
 * 初始化轮播图
 */
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

/**
 * 切换幻灯片
 */
function switchSlide(newIndex) {
    images[currentIndex].classList.remove('active');
    dotsContainer.children[currentIndex].classList.remove('active');

    // 处理边界
    newIndex = (newIndex + images.length) % images.length;

    // 更新状态
    currentIndex = newIndex;
    images[currentIndex].classList.add('active');
    dotsContainer.children[currentIndex].classList.add('active');
}

/**
 * 开始自动播放
 */
function startAutoPlay() {
    autoPlayTimer = setInterval(() => switchSlide(currentIndex + 1), CAROUSEL_INTERVAL);
}

// ================= 搜索功能 =================
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

/**
 * 初始化搜索功能
 */
function initSearch() {
    if (!searchForm) return;
    
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const keyword = searchInput.value.trim();
        if (keyword) {
            window.location.href = `taobao-search.html?q=${encodeURIComponent(keyword)}`;
        }
    });
}

// ================= 分类框交互功能 =================
/**
 * 初始化分类框交互功能
 */
function initCategoryAccordion() {
    const groupTitles = document.querySelectorAll('.group-title');
    
    groupTitles.forEach(title => {
        title.addEventListener('click', function() {
            const subCategory = this.nextElementSibling;
            const arrowIcon = this.querySelector('.arrow-icon');
            
            subCategory.classList.toggle('expanded');
            
            if (arrowIcon) {
                arrowIcon.classList.toggle('rotate');
            }
        });
        
        // 默认展开第一个分类组
        if (title.parentElement === document.querySelector('.category-group')) {
            title.click();
        }
    });

    // 为所有子分类链接添加点击事件
    const subCategoryLinks = document.querySelectorAll('.sub-category a');
    subCategoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const categoryName = this.textContent;
            window.location.href = `taobao-search.html?q=${encodeURIComponent(categoryName)}&category=true`;
        });
    });
}

// ================= 商品展示功能 =================
/**
 * 加载商品数据
 */
async function loadProductData() {
    try {
        const response = await fetch('taobao-search.json');
        productData = await response.json();
        displayFeaturedProducts();
    } catch (error) {
        console.error('加载商品数据失败:', error);
    }
}

/**
 * 展示精选商品
 */
function displayFeaturedProducts() {
    const productList = document.querySelector('.product-list');
    if (!productList) return;

    // 获取前4个商品作为精选商品
    const featuredProducts = productData.products.slice(0, 4);
    
    productList.innerHTML = featuredProducts.map(product => `
        <div class="product-item">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-title">${product.name}</div>
            <div class="product-price">¥${product.price.toFixed(2)}</div>
            <div class="product-desc">${product.desc}</div>
        </div>
    `).join('');
}

// ================= 页面初始化 =================
document.addEventListener('DOMContentLoaded', () => {
    initializeCarousel();
    initSearch();
    initCategoryAccordion();
    loadProductData();
});