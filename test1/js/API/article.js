// 路径：test1/js/API/news.js
// 【二选一模式切换】
const MODE = "TEST"; // TEST = 读本地JSON文件 | PROD = 读浏览器缓存
const LOCAL_JSON_PATH = '../../../Backend/Data/news.json'; // 测试文件路径，请根据实际存放位置调整
const CACHE_KEY = 'NEWS_LOCAL_DATA';

/**
 * 获取新闻列表（双模式自动切换）
 * - TEST模式：读取本地JSON文件
 * - PROD模式：读取浏览器本地缓存
 */
export async function getNewsList() {
  try {
    let data;
    if (MODE === "TEST") {
      const response = await fetch(LOCAL_JSON_PATH);
      data = await response.json();
      // 兼容不同 JSON 结构：若根为数组则直接返回，否则尝试提取常见字段
      return Array.isArray(data) ? data : (data?.list || data?.news || []);
    } else {
      const cachedData = localStorage.getItem(CACHE_KEY);
      data = cachedData ? JSON.parse(cachedData) : [];
      return data;
    }
  } catch (error) {
    console.error('新闻数据读取失败：', error);
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