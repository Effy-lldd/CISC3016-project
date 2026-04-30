// 路径：test1/js/API/news.js
const CACHE_KEY = 'NEWS_LOCAL_DATA';

/**
 * 获取新闻列表（仅读取本地缓存，永不请求API）
 */
export async function getNewsList() {
  try {
    // 读取本地缓存
    const cachedData = localStorage.getItem(CACHE_KEY);
    return cachedData ? JSON.parse(cachedData) : [];
  } catch (error) {
    console.error('本地新闻数据读取失败：', error);
    return [];
  }
}

/**
 * 根据ID获取新闻详情（纯本地读取）
 */
export async function getNewsDetailById(id) {
  try {
    const list = await getNewsList();
    return list.find(item => item.id === Number(id)) || null;
  } catch (error) {
    console.error('新闻详情获取失败：', error);
    return null;
  }
}

export default {
  getNewsList,
  getNewsDetailById
};