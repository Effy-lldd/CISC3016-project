// test1/js/Module/news-detail.js
import { getNewsDetailById } from '../API/article.js';

// 页面加载后执行
window.addEventListener('DOMContentLoaded', async () => {
  // 1. 获取地址栏中的新闻ID
  const urlParams = new URLSearchParams(window.location.search);
  const newsId = urlParams.get('id');

  if (!newsId) {
    alert('未找到新闻ID');
    return;
  }

  // 2. 获取新闻详情数据
  const news = await getNewsDetailById(newsId);
  if (!news) {
    alert('新闻不存在');
    return;
  }

  // 3. 动态填充数据
  document.querySelector('.news-full-title').textContent = news.title;
  document.querySelector('.news-source').textContent = `${news.source} · Published: ${news.publishTime}`;

  // 音频处理（无音频则隐藏）
  const audioPlayer = document.querySelector('.audio-player');
  const audioSource = audioPlayer.querySelector('source');
  if (news.audioUrl) {
    audioSource.src = news.audioUrl;
    audioPlayer.load();
  } else {
    audioPlayer.style.display = 'none';
  }

  // 图片处理（无图片则隐藏）
  const newsImg = document.querySelector('.news-full-img');
  if (news.image) {
    newsImg.src = `/test1/${news.image}`;
    newsImg.alt = news.title;
  } else {
    newsImg.style.display = 'none';
  }

  // 新闻正文
  document.querySelector('.news-full-content').innerHTML = news.content.replace(/\n/g, '<br><br>');

  // 专家评论（最多3条）
  const commentList = document.querySelector('.comment-list');
  const comments = news.comments?.slice(0, 3) || [];
  comments.forEach(item => {
    const div = document.createElement('div');
    div.className = 'llm-comment-item';
    div.textContent = `• ${item}`;
    commentList.appendChild(div);
  });

  // 4. 保留原有图片放大功能
  const modal = document.getElementById('imgModal');
  const modalImg = document.getElementById('modalImg');
  const closeBtn = document.querySelector('.close-btn');

  newsImg.onclick = () => {
    modal.style.display = 'block';
    modalImg.src = newsImg.src;
  };

  closeBtn.onclick = () => modal.style.display = 'none';
  modal.onclick = (e) => {
    if (e.target === modal) modal.style.display = 'none';
  };

  // 5. 返回按钮
  document.getElementById('backBtn').onclick = () => window.history.back();
});