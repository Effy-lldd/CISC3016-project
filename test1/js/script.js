// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 1. 初始化K线图
    initStockChart();
    // 2. 绑定标签切换事件
    bindTabEvents();
    // 3. 绑定侧边栏图标点击事件
    // bindSidebarEvents();

        // 预激活音频（可选）
    const silentAudio = new Audio('../test1/source/sounds/click2.mp3');
    silentAudio.volume = 0;
    const activateAudio = () => {
        silentAudio.play().catch(() => {});
        window.removeEventListener('click', activateAudio);
        window.removeEventListener('touchstart', activateAudio);
    };
    window.addEventListener('click', activateAudio, { once: true });
    window.addEventListener('touchstart', activateAudio, { once: true });
});

/**
 * 初始化股票K线图（修改为基础柱状图模拟K线）
 */
// 全局暴露函数，供货币切换时重绘
window.initStockChart = initStockChart;

async function initStockChart() {
    const ctx = document.getElementById('stockChart').getContext('2d');
    if(!ctx) return;

    // 获取当前选中的货币对
    const base = document.getElementById('baseCurrency')?.value || 'USD';
    const quote = document.getElementById('quoteCurrency')?.value || 'CNY';
    
    // 从全局获取数据方法（修复import报错）
    const pairData = await window.currencyApi?.getCurrencyPairData(base, quote);
    if(!pairData || !pairData.historyData) return;

    // 从动态数据中提取图表数据
    const timeLabels = pairData.historyData.map(item => item.date);
    const rates = pairData.historyData.map(item => parseFloat(item.rate));
    
    // 销毁旧图表（防止重复渲染）
    if(window.forexChart) window.forexChart.destroy();

    // 创建动态汇率图表
    window.forexChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [
                {
                    label: 'Rate',
                    data: rates,
                    borderColor: '#00FF88',
                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                    borderWidth: 2,
                    tension: 0.1,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: { display: false, color: '#383838' },
                    ticks: { color: '#B0B0B0' }
                },
                y: {
                    position: 'right',
                    grid: { color: '#383838' },
                    ticks: { color: '#B0B0B0' }
                }
            },
            plugins: { legend: { display: false } },
            interaction: { mode: 'index', intersect: false }
        }
    });
}


/**
 * 绑定标签切换事件（核心修改）
 */
function bindTabEvents() {
    const clickSound = new Audio('../test1/source/sounds/click2.mp3'); // 路径按实际调整
    clickSound.volume = 1;                                 // 音量 0~1
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            clickSound.currentTime = 0;   // 重置播放位置，允许快速连点
            clickSound.play().catch(e => console.debug('音频播放失败:', e));
            // 1. 移除所有标签的active类
            tabBtns.forEach(b => b.classList.remove('active'));
            // 2. 给当前点击的标签添加active类
            this.classList.add('active');
            
            // 3. 获取当前标签对应的面板ID
            const tabId = this.getAttribute('data-tab');
            
            // 4. 隐藏所有标签面板
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
            });
            
            // 5. 显示当前标签对应的面板
            const activePane = document.getElementById(tabId);
            if (activePane) {
                activePane.classList.add('active');
            }
            
            // 控制台日志（可选）
            console.log(`切换到 ${tabId} 标签`);
        });
    });
}

/**
 * 绑定侧边栏图标点击事件
 */
// function bindSidebarEvents() {
//     const sidebarIcons = document.querySelectorAll('.sidebar-icon');
    
//     sidebarIcons.forEach(icon => {
//         icon.addEventListener('click', function() {
//             // 移除所有图标的active类
//             sidebarIcons.forEach(i => i.classList.remove('active'));
//             // 给当前点击的图标添加active类
//             this.classList.add('active');
            
//             // 这里可以扩展：根据图标切换不同的主内容
//             const iconType = this.querySelector('i').classList[1];
//             console.log(`点击了侧边栏图标: ${iconType}`);
//         });
//     });
// }

