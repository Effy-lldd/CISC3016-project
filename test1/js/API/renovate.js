// 路径：test1/js/API/api-sync.js
// ==================== 配置项 ====================
// 新闻接口（原有，AI慢接口）
const NEWS_API_URL = 'http://127.0.0.1:54844/api/news';
const NEWS_CACHE_KEY = 'NEWS_LOCAL_DATA';
// 外汇接口（新增，快接口）
const FOREX_API_URL = 'http://127.0.0.1:54844/api/data';
const FOREX_CACHE_KEY = 'DATA_LOCAL_DATA';

// ==================== 独立同步工具 ====================
async function syncData(apiUrl, cacheKey, eventName) {
  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    localStorage.setItem(cacheKey, JSON.stringify(data));
    console.log(`✅ ${eventName.split('-')[0]} 数据同步完成`);
  } catch (err) {
    console.log(`⚠️ ${eventName.split('-')[0]} API请求失败，使用本地缓存`);
  } finally {
    // 独立触发事件，不等待其他接口
    window.dispatchEvent(new Event(eventName));
  }
}

// ==================== 独立启动，互不等待 ====================
window.addEventListener('load', () => {
  // 🔥 外汇数据（快）：独立执行，立刻触发
  syncData(FOREX_API_URL, FOREX_CACHE_KEY, 'data-data-ready');
  
  // 📰 新闻数据（慢，AI）：后台独立执行，不阻塞页面
  syncData(NEWS_API_URL, NEWS_CACHE_KEY, 'news-data-ready');
});