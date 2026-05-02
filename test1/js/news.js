// 获取DOM元素
const modal = document.getElementById('imgModal');
const modalImg = document.getElementById('modalImg');
const newsImg = document.querySelector('.news-full-img');
const closeBtn = document.querySelector('.close-btn');
const backBtn = document.getElementById('backBtn');

// ========== 新增：加载点击音效（WAV 文件） ==========
// 请将 'assets/sounds/click.wav' 替换为你实际的 WAV 文件路径
const clickSound1 = new Audio('../test1/source/sounds/click2.mp3'); // 路径按实际调整
clickSound1.volume = 1;       
const clickSound = new Audio('../test1/source/sounds/page.wav');
clickSound.volume = 0.3;  // 音量可调，范围 0~1

function playNewsClickSound() {
    clickSound.currentTime = 0;  // 重置播放位置，允许快速连点
    clickSound.play().catch(e => console.debug('图片点击音效播放失败:', e));
}
// =================================================

// 打开图片模态框
newsImg.addEventListener('click', () => {
    modalImg.src = newsImg.src;
    modal.style.display = 'flex';
    playNewsClickSound();
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
    clickSound1.currentTime = 0;   // 重置播放位置，允许快速连点
    clickSound1.play().catch(e => console.debug('音频播放失败:', e));

    setTimeout(() => {
        window.location.href = document.referrer || 'index.html';
      }, 200);
});