// test1/js/Module/news-detail.js
import { getNewsDetailById } from '../API/article.js';

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

  // 图片处理
  const newsImg = document.querySelector('.news-full-img');
  if (news.image) {
    newsImg.src = `${news.image}`;
    newsImg.alt = news.title;
  } else {
    newsImg.style.display = 'none';
  }

  // 新闻正文
  document.querySelector('.news-full-content').innerHTML = news.content.replace(/\n/g, '<br><br>');

  // 专家评论
  const commentList = document.querySelector('.comment-list');
  const comments = news.comments?.slice(0, 3) || [];
  comments.forEach(item => {
    const div = document.createElement('div');
    div.className = 'llm-comment-item';
    div.textContent = `• ${item}`;
    commentList.appendChild(div);
  });

  // 图片放大
  // const modal = document.getElementById('imgModal');
  // const modalImg = document.getElementById('modalImg');
  // const closeBtn = document.querySelector('.close-btn');
  // newsImg.onclick = () => { modal.style.display = 'block'; modalImg.src = newsImg.src; };
  // closeBtn.onclick = () => modal.style.display = 'none';
  // modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

  // 返回按钮
  // document.getElementById('backBtn').onclick = () => window.history.back();

  // ===================== 👇 仅这一段是语音代码（极简！） =====================
  // const audio = document.querySelector('.audio-player');
  // const synth = window.speechSynthesis;
  // const text = document.querySelector('.news-full-title').innerText + '. ' + document.querySelector('.news-full-content').innerText;
  
  // // 初始化英文语音
  // const utterance = new SpeechSynthesisUtterance(text);
  // utterance.lang = 'en-US';

  // // 绑定播放器按钮（核心）
  // audio.onplay = () => synth.speak(utterance);
  // audio.onpause = () => synth.pause();
  // audio.onvolumechange = () => utterance.volume = audio.volume;
  // audio.onratechange = () => utterance.rate = audio.playbackRate;
  // // ===================== 👆 语音代码结束 =====================
});