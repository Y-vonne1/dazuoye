// 缩略图点击切换主图
document.addEventListener('DOMContentLoaded', function() {
    const thumbs = document.querySelectorAll('.thumbs img');
    const mainImage = document.querySelector('.main-image img');
    thumbs.forEach(thumb => {
        thumb.addEventListener('click', function() {
            if (thumb.src) {
                mainImage.src = thumb.src;
            }
        });
    });

    // 规格选择
    const specBtns = document.querySelectorAll('.spec-btn');
    specBtns.entriesforEach(btn => {
        btn.addEventListener('click', function() {
            specBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // 数量加减
    const decreaseBtn = document.getElementById('decrease');
    const increaseBtn = document.getElementById('increase');
    const qtyInput = document.getElementById('qty-input');
    decreaseBtn.addEventListener('click', () => {
        let qty = parseInt(qtyInput.value, 10);
        if (qty > 1) qtyInput.value = qty - 1;
    });
    increaseBtn.addEventListener('click', () => {
        let qty = parseInt(qtyInput.value, 10);
        qtyInput.value = qty + 1;
    });

    // 图集/参数 tab 切换（仅样式，无内容切换，后续可扩展）
    const galleryTabs = document.querySelectorAll('.gallery-tab');
    galleryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            galleryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
});