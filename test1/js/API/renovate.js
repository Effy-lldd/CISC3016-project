// 路径：test1/js/API/api-sync.js
// ==================== 配置项 ====================
const MODE = "PROD"; // 切换模式："TEST" 读本地文件 | "PROD" 读后端 API

// 本地文件路径（TEST 模式使用）
const LOCAL_DATA_PATH = './source/datas/data.json';   // 外汇数据本地文件
const LOCAL_NEWS_PATH = './source/datas/news.json';  // 新闻数据本地文件

// 新闻接口（原有，AI慢接口）
const NEWS_API_URL = 'http://127.0.0.1:54844/api/news';
const NEWS_CACHE_KEY = 'NEWS_LOCAL_DATA';
// 外汇接口（新增，快接口）
const FOREX_API_URL = 'http://127.0.0.1:54844/api/data';
const FOREX_CACHE_KEY = 'DATA_LOCAL_DATA';

// ==================== 独立同步工具（增加本地文件支持） ====================
async function loadFromLocalFile(filePath) {
  const response = await fetch(filePath);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.json();
}

async function syncData(apiUrl, cacheKey, eventName, localFilePath = null) {
  try {
    let data;
    if (MODE === "TEST" && localFilePath) {
      // 测试模式：读取本地 JSON 文件
      data = await loadFromLocalFile(localFilePath);
      console.log(`📁 从本地文件加载 ${eventName.split('-')[0]} 数据: ${localFilePath}`);
    } else {
      // 正常模式：请求后端 API
      const res = await fetch(apiUrl);
      data = await res.json();
      console.log(`✅ ${eventName.split('-')[0]} 数据同步完成 (API)`);
    }
    localStorage.setItem(cacheKey, JSON.stringify(data));
  } catch (err) {
    console.log(`⚠️ ${eventName.split('-')[0]} 数据获取失败，使用已有本地缓存`, err);
  } finally {
    // 独立触发事件，不等待其他接口
    window.dispatchEvent(new Event(eventName));
  }
}

// ==================== 独立启动，互不等待 ====================
window.addEventListener('load', () => {
  // 🔥 外汇数据（快）：独立执行，立刻触发
  syncData(FOREX_API_URL, FOREX_CACHE_KEY, 'data-data-ready', LOCAL_DATA_PATH);
  
  // 📰 新闻数据（慢，AI）：后台独立执行，不阻塞页面
  syncData(NEWS_API_URL, NEWS_CACHE_KEY, 'news-data-ready', LOCAL_NEWS_PATH);
});
