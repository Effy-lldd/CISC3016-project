// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 1. 初始化K线图
    initStockChart();
    
    // 2. 绑定标签切换事件
    bindTabEvents();
    
    // 3. 绑定侧边栏图标点击事件
    bindSidebarEvents();
    
    // 4. 模拟数据更新（每5秒刷新一次成交量）
    simulateDataUpdate();
});

/**
 * 初始化股票K线图（修改为基础柱状图模拟K线）
 */
function initStockChart() {
    const ctx = document.getElementById('stockChart').getContext('2d');
    
    // 模拟K线数据（时间轴）
    const timeLabels = [
        '16:00', '17:00', '18:00', '19:00', '20:00', 
        '21:00', '22:00', '23:00', '24:00', '01:00', '02:00'
    ];
    
    // 模拟收盘价（用于绘制折线/柱状图）
    const closePrices = [4.25, 4.32, 4.38, 4.42, 4.45, 4.40, 4.42, 4.45, 4.40, 4.35, 4.29];
    // 模拟高低价（用于绘制误差线）
    const highPrices = [4.30, 4.35, 4.40, 4.45, 4.50, 4.48, 4.46, 4.49, 4.47, 4.43, 4.38];
    const lowPrices = [4.15, 4.20, 4.28, 4.30, 4.35, 4.38, 4.35, 4.38, 4.36, 4.30, 4.25];

    // 创建模拟K线图（使用折线+误差线）
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [
                {
                    label: 'Price',
                    data: closePrices,
                    borderColor: '#00FF88',
                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                    borderWidth: 2,
                    tension: 0.1,
                    fill: true
                },
                {
                    label: 'High-Low Range',
                    data: highPrices.map((h, i) => ({ x: timeLabels[i], y: [lowPrices[i], h] })),
                    type: 'bar',
                    backgroundColor: 'rgba(255, 68, 68, 0.2)',
                    borderColor: '#FF4444',
                    borderWidth: 1,
                    barPercentage: 0.2,
                    categoryPercentage: 0.5
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        display: false,
                        color: '#383838'
                    },
                    ticks: {
                        color: '#B0B0B0'
                    }
                },
                y: {
                    position: 'right',
                    grid: {
                        color: '#383838'
                    },
                    ticks: {
                        color: '#B0B0B0',
                        callback: function(value) {
                            return '$' + value.toFixed(2);
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#1E1E1E',
                    borderColor: '#383838',
                    borderWidth: 1,
                    titleColor: '#FFFFFF',
                    bodyColor: '#FFFFFF',
                    callbacks: {
                        label: function(context) {
                            const index = context.dataIndex;
                            return [
                                `Close: $${closePrices[index].toFixed(2)}`,
                                `High: $${highPrices[index].toFixed(2)}`,
                                `Low: $${lowPrices[index].toFixed(2)}`
                            ];
                        }
                    }
                }
            },
            interaction: {
                mode: 'index',
                intersect: false
            }
        }
    });
}


/**
 * 绑定标签切换事件（核心修改）
 */
function bindTabEvents() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
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
function bindSidebarEvents() {
    const sidebarIcons = document.querySelectorAll('.sidebar-icon');
    
    sidebarIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            // 移除所有图标的active类
            sidebarIcons.forEach(i => i.classList.remove('active'));
            // 给当前点击的图标添加active类
            this.classList.add('active');
            
            // 这里可以扩展：根据图标切换不同的主内容
            const iconType = this.querySelector('i').classList[1];
            console.log(`点击了侧边栏图标: ${iconType}`);
        });
    });
}

/**
 * 模拟数据更新
 */
function simulateDataUpdate() {
    setInterval(() => {
        // 随机更新成交量（±0.5M）
        const volumeElements = document.querySelectorAll('.metric-value:last-child, .detail-value:nth-child(2)');
        const baseVolume = 97.00;
        const randomChange = (Math.random() - 0.5).toFixed(2);
        const newVolume = (baseVolume + parseFloat(randomChange)).toFixed(2) + 'M';
        
        volumeElements.forEach(el => {
            el.textContent = newVolume;
        });
        
        // 随机更新价格（±0.05）
        const priceElements = document.querySelectorAll('.stock-price, .detail-price');
        const basePrice = 4.29;
        const randomPriceChange = (Math.random() - 0.5) * 0.1;
        const newPrice = (basePrice + randomPriceChange).toFixed(2);
        
        priceElements.forEach(el => {
            el.textContent = newPrice;
            
            // 更新涨跌状态
            const changeElements = document.querySelectorAll('.stock-change, .detail-change');
            const changeValue = (randomPriceChange).toFixed(2);
            const changePercent = ((randomPriceChange / basePrice) * 100).toFixed(2);
            
            changeElements.forEach(changeEl => {
                if (randomPriceChange >= 0) {
                    changeEl.textContent = `+${changeValue} (+${changePercent}%)`;
                    changeEl.classList.remove('negative');
                    changeEl.classList.add('positive');
                } else {
                    changeEl.textContent = `${changeValue} (${changePercent}%)`;
                    changeEl.classList.remove('positive');
                    changeEl.classList.add('negative');
                }
            });
        });
    }, 5000);
}

