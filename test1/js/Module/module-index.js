// js/index-news.js
import { getNewsList } from '../API/article.js';

// 页面加载完成后渲染新闻
window.addEventListener('DOMContentLoaded', async () => {
  const newsContainer = document.querySelector('.news-container');
  const newsList = await getNewsList();

  if (!Array.isArray(newsList) || newsList.length === 0) return;

  // 循环生成新闻卡片
  newsList.forEach(news => {
    // 有图 / 无图 自动加类
    const cardClass = news.image ? 'news-card' : 'news-card no-img';

    // 只取前两条评论
    const showComments = news.comments?.slice(0, 2) || [];

    // 拼接评论HTML
    let commentHtml = '';
    showComments.forEach(item => {
      commentHtml += `<div class="comment-item">${item}</div>`;
    });

    // 拼接新闻卡片HTML（完全沿用你原来的结构和样式类）
    let cardHtml = `
      <div class="${cardClass}" data-id="${news.id}">
        <div class="news-top">
          <h4 class="news-title">${news.title}</h4>
          <span class="news-source">${news.source} · ${news.publishTime}</span>
        </div>
        <div class="news-body">
    `;

    // 有图才插入图片
    if (news.image) {
      cardHtml += `<img src="${news.image}" class="news-img" alt="news">`;
    }

    cardHtml += `
          <div class="news-content">
            <p class="news-desc">${news.content}</p>
          </div>
        </div>
        <div class="news-comments">
          ${commentHtml}
        </div>
      </div>
    `;

    newsContainer.innerHTML += cardHtml;
  });

  // 绑定卡片点击跳转
  document.querySelectorAll('.news-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      window.open(`news.html?id=${id}`, '_blank');
    });
  });
});