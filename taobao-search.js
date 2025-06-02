// 全局商品数据
let productData = {
    products: [],
    categories: []
};

// 当前页码和排序方式
let currentPage = 1;
const itemsPerPage = 4;
let currentSort = "default";
let currentResults = [];

// 从URL获取参数
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        q: params.get('q') || '',
        category: params.get('category') === 'true'
    };
}

// 页面加载完成后执行
document.addEventListener("DOMContentLoaded", async function() {
    // 加载商品数据
    try {
        const response = await fetch('taobao-search.json');
        productData = await response.json();
        
        // 从URL获取参数
        const { q, category } = getUrlParams();
        document.getElementById("search-input").value = q;
        
        // 如果有搜索词则执行搜索
        if (q) {
            if (category) {
                searchByCategory(q);
            } else {
                searchProducts();
            }
        } else {
            showAllProducts();
        }
    } catch (error) {
        console.error('加载商品数据失败:', error);
    }
    
    // 搜索表单提交事件
    document.getElementById("search-form").addEventListener("submit", function(e) {
        e.preventDefault();
        const keyword = document.getElementById("search-input").value.trim();
        if (keyword) {
            window.location.href = `taobao-search.html?q=${encodeURIComponent(keyword)}`;
        } else {
            window.location.href = "taobao-search.html";
        }
    });
    
    // 筛选按钮点击事件
    document.querySelectorAll(".filter").forEach(btn => {
        btn.addEventListener("click", function() {
            document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            
            const sortType = this.textContent === "销量" ? "sales" :
                            this.textContent === "价格从低到高" ? "price-low" :
                            this.textContent === "价格从高到低" ? "price-high" : "default";
            
            sortAndShowProducts(sortType);
        });
    });
    
    // 分页按钮点击事件
    document.querySelectorAll(".page-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            if (this.textContent === "上一页" && currentPage > 1) {
                currentPage--;
            } else if (this.textContent === "下一页") {
                currentPage++;
            } else if (!isNaN(parseInt(this.textContent))) {
                currentPage = parseInt(this.textContent);
            }
            
            updatePagination();
            showProducts(paginateProducts(currentResults));
        });
    });
});

// 按分类搜索
function searchByCategory(categoryName) {
    // 获取该分类的商品
    currentResults = productData.products.filter(product => 
        product.category === categoryName
    );
    
    // 更新页面标题
    document.title = `${categoryName} - 淘宝搜索`;
    
    // 显示分类标题
    const categoryTitle = document.getElementById('category-title');
    categoryTitle.style.display = 'block';
    categoryTitle.textContent = `当前分类: ${categoryName}`;
    
    // 显示商品
    showProducts(paginateProducts(currentResults));
    updatePagination();
}

// 显示所有商品函数
function showAllProducts() {
    currentResults = [...productData.products];
    showProducts(paginateProducts(currentResults));
    updatePagination();
}

// 搜索商品函数
function searchProducts() {
    const keyword = document.getElementById("search-input").value.trim().toLowerCase();
    
    if (keyword === "") {
        showAllProducts();
        return;
    }
    
    currentResults = productData.products.filter(product => 
        product.name.toLowerCase().includes(keyword) || 
        product.desc.toLowerCase().includes(keyword)
    );
    
    showProducts(paginateProducts(currentResults));
    updatePagination();
}

// 排序并显示商品函数
function sortAndShowProducts(sortType) {
    let sortedProducts;
    
    // 如果是默认排序，从原始数据重新获取当前结果
    if (sortType === "default") {
        const { q, category } = getUrlParams();
        if (q) {
            if (category) {
                sortedProducts = productData.products.filter(product => 
                    product.category === q
                );
            } else {
                const keyword = q.toLowerCase();
                sortedProducts = productData.products.filter(product => 
                    product.name.toLowerCase().includes(keyword) || 
                    product.desc.toLowerCase().includes(keyword)
                );
            }
        } else {
            sortedProducts = [...productData.products];
        }
    } else {
        // 其他排序方式保持不变
        sortedProducts = [...currentResults];
        
        switch(sortType) {
            case "sales":
                sortedProducts.sort((a, b) => b.sales - a.sales);
                break;
            case "price-low":
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case "price-high":
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
        }
    }
    
    currentSort = sortType;
    currentResults = sortedProducts;
    currentPage = 1;
    showProducts(paginateProducts(currentResults));
    updatePagination();
}

// 显示商品函数
function showProducts(productsToShow) {
    const resultsContainer = document.getElementById("search-results");
    
    if (productsToShow.length === 0) {
        resultsContainer.innerHTML = "<p class='no-results'>没有找到相关商品</p>";
        return;
    }
    
    let html = "";
    productsToShow.forEach(product => {
        html += `
            <div class="product-item">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p>${product.desc}</p>
                    <div class="product-price">¥${product.price.toFixed(2)}</div>
                    <div class="product-sales">月销${product.sales}笔</div>
                </div>
            </div>
        `;
    });
    
    resultsContainer.innerHTML = html;
}

// 分页函数
function paginateProducts(allProducts) {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return allProducts.slice(start, end);
}

// 更新分页按钮 - 初学者友好版
function updatePagination() {
    // 1. 计算总页数
    const totalItems = currentResults.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pagination = document.getElementById("pagination");
    
    // 2. 清空现有分页按钮
    pagination.innerHTML = "";

    // 3. 添加上一页按钮
    const prevBtn = createPageButton("上一页", currentPage > 1);
    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            updateProductsDisplay();
        }
    });
    pagination.appendChild(prevBtn);

    // 4. 添加数字页码按钮
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = createPageButton(i, true);
        if (i === currentPage) {
            pageBtn.classList.add("active");
        }
        
        pageBtn.addEventListener("click", () => {
            currentPage = i;
            updateProductsDisplay();
        });
        pagination.appendChild(pageBtn);
    }

    // 5. 添加下一页按钮
    const nextBtn = createPageButton("下一页", currentPage < totalPages);
    nextBtn.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            updateProductsDisplay();
        }
    });
    pagination.appendChild(nextBtn);
}

// 辅助函数：创建分页按钮
function createPageButton(text, isEnabled) {
    const button = document.createElement("button");
    button.className = "page-btn";
    button.textContent = text;
    if (!isEnabled) {
        button.classList.add("disabled");
    }
    return button;
}

// 辅助函数：更新商品显示
function updateProductsDisplay() {
    showProducts(paginateProducts(currentResults));
    updatePagination();
}