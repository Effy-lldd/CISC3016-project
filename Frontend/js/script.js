document.addEventListener("DOMContentLoaded", () => {
    // 处理右侧 Tabs 切换
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 移除所有 active 类
            tabs.forEach(t => t.classList.remove('active'));
            // 给当前点击的加上 active 类
            tab.classList.add('active');
        });
    });

    // 绘制主 K 线图 (Candlestick Chart)
    const canvas = document.getElementById('stockChart');
    const ctx = canvas.getContext('2d');

    // 调整canvas大小匹配其容器
    function resizeCanvas() {
        const parent = canvas.parentElement;
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        drawChart();
    }

    window.addEventListener('resize', resizeCanvas);

    // 绘制模拟的K线图数据
    function drawChart() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const padding = { top: 20, bottom: 40, left: 10, right: 60 };
        const chartWidth = canvas.width - padding.left - padding.right;
        const chartHeight = canvas.height - padding.top - padding.bottom;

        // 模拟蜡烛图数据
        const dataPoints = 35; 
        const barWidth = (chartWidth / dataPoints) * 0.6;
        const spacing = (chartWidth / dataPoints);

        // 颜色配置
        const colorUp = '#d2ff00'; // 荧光绿
        const colorDown = '#ff9500'; // 橙黄色

        let currentY = chartHeight * 0.7; // 起始高度

        for (let i = 0; i < dataPoints; i++) {
            // 随机生成K线数据
            const isUp = Math.random() > 0.45; 
            const bodyHeight = Math.random() * 30 + 5;
            const wickHeight = bodyHeight + Math.random() * 20;
            
            if(isUp) {
                currentY -= Math.random() * 15; // 趋势向上
            } else {
                currentY += Math.random() * 15; // 趋势向下
            }

            // 限制在图表区域内
            currentY = Math.max(0, Math.min(chartHeight - bodyHeight, currentY));

            const x = padding.left + i * spacing;
            const y = currentY;
            const color = isUp ? colorUp : colorDown;

            // 绘制影线 (Wick)
            ctx.beginPath();
            ctx.moveTo(x + barWidth / 2, y - (wickHeight - bodyHeight)/2);
            ctx.lineTo(x + barWidth / 2, y + bodyHeight + (wickHeight - bodyHeight)/2);
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();

            // 绘制实体 (Body)
            ctx.fillStyle = color;
            ctx.fillRect(x, y, barWidth, bodyHeight);

            // 绘制底部的发光特效模拟 (针对绿色实体)
            if (isUp) {
                ctx.shadowColor = colorUp;
                ctx.shadowBlur = 10;
                ctx.fillRect(x, y, barWidth, bodyHeight);
                ctx.shadowBlur = 0; // 重置
            }
        }

        // 绘制辅助网格线
        ctx.beginPath();
        for(let i=1; i<4; i++) {
            const lineY = padding.top + (chartHeight / 4) * i;
            ctx.moveTo(padding.left, lineY);
            ctx.lineTo(canvas.width - padding.right, lineY);
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    // 初始化渲染
    resizeCanvas();
});