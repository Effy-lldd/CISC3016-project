/**
 * news.js 新闻数据接口层
 * 功能：读取本地 news.json 数据 / 对接后端Java接口
 * 存放路径：与 news.json 同一级目录
 */

/**
 * 获取新闻列表（读取本地news.json）
 */
export async function getNewsList() {
  try {
    // 直接请求本地的 news.json 文件
    const response = await fetch('http://localhost:63839/api/news');
    // const response = await fetch('/Backend/Data/news.json');
    const newsList = await response.json();
    return newsList;
  } catch (error) {
    console.error('新闻数据请求失败：', error);
    return [];
  }
}

/**
 * 根据ID获取新闻详情
 * @param {number|string} id 新闻ID
 */
export async function getNewsDetailById(id) {
  try {
    const list = await getNewsList();
    // 匹配ID返回对应新闻详情
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