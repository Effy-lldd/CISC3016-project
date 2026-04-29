// 获取DOM元素
const modal = document.getElementById('imgModal');
const modalImg = document.getElementById('modalImg');
const newsImg = document.querySelector('.news-full-img');
const closeBtn = document.querySelector('.close-btn');
const backBtn = document.getElementById('backBtn');

// 打开图片模态框
newsImg.addEventListener('click', () => {
    modalImg.src = newsImg.src;
    modal.style.display = 'flex';
});

// 关闭模态框
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// 点击空白处关闭
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// 返回上一页
backBtn.addEventListener('click', () => {
    window.history.back();
});