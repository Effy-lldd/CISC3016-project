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
 * 初始化股票K线图
 */
function initStockChart() {
    const ctx = document.getElementById('stockChart').getContext('2d');
    
    // 模拟K线数据（时间轴）
    const timeLabels = [
        '16:00', '17:00', '18:00', '19:00', '20:00', 
        '21:00', '22:00', '23:00', '24:00', '01:00', '02:00'
    ];
    
    // 模拟价格数据（高开低收）
    const priceData = [
        { open: 4.18, high: 4.30, low: 4.15, close: 4.25 },
        { open: 4.25, high: 4.35, low: 4.20, close: 4.32 },
        { open: 4.32, high: 4.40, low: 4.28, close: 4.38 },
        { open: 4.38, high: 4.45, low: 4.30, close: 4.42 },
        { open: 4.42, high: 4.50, low: 4.35, close: 4.45 },
        { open: 4.45, high: 4.48, low: 4.38, close: 4.40 },
        { open: 4.40, high: 4.46, low: 4.35, close: 4.42 },
        { open: 4.42, high: 4.49, low: 4.38, close: 4.45 },
        { open: 4.45, high: 4.47, low: 4.36, close: 4.40 },
        { open: 4.40, high: 4.43, low: 4.30, close: 4.35 },
        { open: 4.35, high: 4.38, low: 4.25, close: 4.29 }
    ];

    // 提取开盘/最高/最低/收盘数据
    const openPrices = priceData.map(item => item.open);
    const highPrices = priceData.map(item => item.high);
    const lowPrices = priceData.map(item => item.low);
    const closePrices = priceData.map(item => item.close);

    // 创建K线图（使用Chart.js的蜡烛图）
    new Chart(ctx, {
        type: 'candlestick',
        data: {
            datasets: [{
                label: 'PPSI Price',
                data: priceData.map((item, index) => ({
                    x: timeLabels[index],
                    o: item.open,
                    h: item.high,
                    l: item.low,
                    c: item.close
                })),
                color: {
                    up: '#00FF88',    // 上涨绿色
                    down: '#FF4444',  // 下跌红色
                    unchanged: '#B0B0B0'
                },
                borderColor: {
                    up: '#00FF88',
                    down: '#FF4444',
                    unchanged: '#B0B0B0'
                }
            }]
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
                            const data = context.raw;
                            return [
                                `Open: $${data.o.toFixed(2)}`,
                                `High: $${data.h.toFixed(2)}`,
                                `Low: $${data.l.toFixed(2)}`,
                                `Close: $${data.c.toFixed(2)}`
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

// 扩展：Chart.js蜡烛图适配器（解决Chart.js默认不支持candlestick的问题）
// 注：实际使用时需要引入chartjs-chart-financial插件，这里简化模拟
if (!Chart.controllers.candlestick) {
    Chart.register({
        id: 'candlestick',
        beforeInit: function(chart) {
            chart.data.datasets.forEach(dataset => {
                dataset.type = 'bar';
                dataset.data = dataset.data.map(item => ({
                    x: item.x,
                    y: [item.l, item.h],
                    open: item.o,
                    close: item.c
                }));
            });
        },
        draw: function() {
            const meta = this.getMeta();
            const ctx = this.chart.ctx;
            
            meta.data.forEach((bar, index) => {
                const data = this.dataset.data[index];
                const x = bar.x;
                const openY = this.chart.scales.y.getPixelForValue(data.open);
                const closeY = this.chart.scales.y.getPixelForValue(data.close);
                const highY = this.chart.scales.y.getPixelForValue(data.y[1]);
                const lowY = this.chart.scales.y.getPixelForValue(data.y[0]);
                
                // 绘制高低线
                ctx.beginPath();
                ctx.moveTo(x, highY);
                ctx.lineTo(x, lowY);
                ctx.strokeStyle = data.close >= data.open ? '#00FF88' : '#FF4444';
                ctx.lineWidth = 1;
                ctx.stroke();
                
                // 绘制开盘收盘矩形
                ctx.fillStyle = data.close >= data.open ? '#00FF88' : '#FF4444';
                ctx.fillRect(x - 5, Math.min(openY, closeY), 10, Math.abs(openY - closeY));
            });
        }
    });
}