// js/Module/module-data.js
import { getCurrencyPairData, getDataUpdateTime } from '../API/data.js';

// 本地测试模式：页面加载直接渲染（不监听后端事件）
document.addEventListener('DOMContentLoaded', async () => {
  // 1. 获取元素
  const loading = document.getElementById('loading');
  const baseSelect = document.getElementById('baseCurrency');
  const quoteSelect = document.getElementById('quoteCurrency');

  // 2. 隐藏加载动画
  if (loading) loading.style.display = 'none';

  // 核心渲染函数
  async function renderAllData(baseCur, quoteCur) {
    const data = await getCurrencyPairData(baseCur, quoteCur);
    if (!data) return;

    // 更新全局更新时间
    const updateTime = await getDataUpdateTime();
    document.querySelector('.delay-info').textContent = updateTime;

    // ======================================
    // 左侧卡片数据渲染
    // ======================================
    document.querySelector('.stock-name').textContent = `${baseCur} / ${quoteCur}`;
    document.querySelector('.stock-ticker').textContent = `${baseCur}/${quoteCur}`;
    document.querySelector('.stock-price').textContent = data.realTimeRate;
    
    const changeEl = document.querySelector('.stock-change');
    changeEl.textContent = `${data.rateChange} (${data.rateChangePercent})`;
    changeEl.className = data.rateChange.startsWith('-') ? 'stock-change negative' : 'stock-change positive';
    document.querySelector('.stock-time').textContent = updateTime;

    // 左侧 7日高低/年度指标
    const metrics = document.querySelectorAll('.metric-value');
    metrics[0].textContent = data.leftPanel.sevenDayHigh;
    metrics[1].textContent = data.leftPanel.sevenDayLow;
    metrics[2].textContent = data.leftPanel.ytdChange;
    metrics[3].textContent = data.leftPanel.twentyDayChange;

    // ======================================
    // Details 面板渲染
    // ======================================
    document.querySelector('.detail-title').textContent = `${baseCur} / ${quoteCur}`;
    document.querySelector('.detail-price').textContent = data.realTimeRate;
    
    const detailChange = document.querySelector('.detail-change');
    detailChange.textContent = `${data.rateChange} (${data.rateChangePercent})`;
    detailChange.className = data.rateChange.startsWith('-') ? 'detail-change negative' : 'detail-change positive';
    document.querySelector('.detail-time').textContent = updateTime;

    const details = document.querySelectorAll('.detail-value');
    details[0].textContent = data.rightDetail.openingRate;
    details[1].textContent = data.rightDetail.closingRate;
    details[2].textContent = data.rightDetail.volume24h;
    details[3].textContent = data.rightDetail.bankBuyRate;
    details[4].textContent = data.rightDetail.bankSellRate;
    details[5].textContent = data.rightDetail.yearlyQuantile;


    // ======================================
    // Profile 面板：渲染基准货币对其他所有货币的汇率
    // ======================================
    const profileContainer = document.querySelector('.profile-details');
    // 清空旧数据（保留表头）
    const headerItem = profileContainer.querySelector('.profile-item');
    profileContainer.innerHTML = '';
    profileContainer.appendChild(headerItem);
    // 添加分隔线
    const divider = document.createElement('div');
    divider.style.cssText = 'width: 100%; height: 1px; background: #333; margin: 0.8rem 0;';
    profileContainer.appendChild(divider);

    // 获取全部货币列表 → 排除当前目标货币
    const allCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CNY'];
    const otherCurrencies = allCurrencies.filter(cur => cur !== quoteCur);

    // 循环渲染汇率
    for (const targetCur of otherCurrencies) {
    const pair = await getCurrencyPairData(baseCur, targetCur);
        if (pair) {
            const item = document.createElement('div');
            item.className = 'profile-item';
            item.innerHTML = `
            <span class="profile-label">${targetCur}</span>
            <span class="profile-value">${pair.realTimeRate}</span>
            `;
            profileContainer.appendChild(item);
        }
    }

    // ======================================
    // 重绘图表
    // ======================================
    window.initStockChart();
  }

  // 初始化渲染
  await renderAllData(baseSelect.value, quoteSelect.value);

  // 切换货币自动刷新所有数据
  baseSelect.addEventListener('change', () => renderAllData(baseSelect.value, quoteSelect.value));
  quoteSelect.addEventListener('change', () => renderAllData(baseSelect.value, quoteSelect.value));
});