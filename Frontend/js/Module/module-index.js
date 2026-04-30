import { getNewsList } from '../API/article.js';

window.addEventListener('news-data-ready', async () => {
  // 1. 获取元素
  const loading = document.getElementById('loading');
  const newsContent = document.getElementById('news-content');
  const newsContainer = document.querySelector('.news-container');

  // 2. 隐藏加载，显示新闻区域
  if (loading) loading.style.display = 'none';
  if (newsContent) newsContent.style.display = 'block';

  const newsList = await getNewsList();
  if (!Array.isArray(newsList) || newsList.length === 0) return;

  // 渲染新闻到 news-content 里
  newsList.forEach(news => {
    const cardClass = news.image ? 'news-card' : 'news-card no-img';
    const showComments = news.comments?.slice(0, 2) || [];
    let commentHtml = '';
    showComments.forEach(item => {
      commentHtml += `<div class="comment-item">${item}</div>`;
    });

    let cardHtml = `
      <div class="${cardClass}" data-id="${news.id}">
        <div class="news-top">
          <h4 class="news-title">${news.title}</h4>
          <span class="news-source">${news.source} · ${news.publishTime}</span>
        </div>
        <div class="news-body">
    `;

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

    // 🔥 渲染到 news-content 里
    newsContent.innerHTML += cardHtml;
  });

  // 绑定点击
  document.querySelectorAll('.news-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      window.open(`news.html?id=${id}`, '_blank');
    });
  });
});