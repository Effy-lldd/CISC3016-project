// 路径：test1/js/API/api-sync.js
const API_URL = 'http://127.0.0.1:54844/api/news';
const CACHE_KEY = 'NEWS_LOCAL_DATA';

// 页面加载时：自动请求API + 覆盖保存本地
window.addEventListener('load', async () => {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    // 覆盖式保存本地缓存
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    console.log('✅ 数据同步完成：已从API更新本地缓存');
    window.dispatchEvent(new Event('news-data-ready'));
  } catch (err) {
    console.log('⚠️ API请求失败，使用旧本地数据');
    window.dispatchEvent(new Event('news-data-ready'));
  }
});