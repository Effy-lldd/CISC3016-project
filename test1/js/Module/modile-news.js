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


  // ========== 实时朗读（Web Speech API）==========
  const fullText = `${news.title}. ${news.content.replace(/<[^>]*>/g, '')}`;
  if (!fullText.trim()) return;

  // 获取或创建朗读按钮
  let readBtn = document.getElementById('readAloudBtn');
  if (!readBtn) {
    readBtn = document.createElement('button');
    readBtn.id = 'readAloudBtn';
    readBtn.className = 'read-aloud-btn';
    // 使用 Font Awesome 图标 + 英文文字
    readBtn.innerHTML = '<i class="fas fa-play"></i> Read Aloud';
    const titleEl = document.querySelector('.news-full-title');
    if (titleEl) titleEl.insertAdjacentElement('afterend', readBtn);
  }

  let isSpeaking = false;
  let utterance = null;

  function stopReading() {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    if (utterance) {
      utterance.onend = null;
      utterance.onerror = null;
      utterance = null;
    }
    isSpeaking = false;
    readBtn.innerHTML = '<i class="fas fa-play"></i> Read Aloud';
  }

  function startReading() {
    stopReading(); // 确保任何正在进行的朗读被停止
    utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 0.2;
    utterance.onend = () => {
      isSpeaking = false;
      readBtn.innerHTML = '<i class="fas fa-play"></i> Read Aloud';
      utterance = null;
    };
    utterance.onerror = (err) => {
      console.warn('朗读出错', err);
      isSpeaking = false;
      readBtn.innerHTML = '<i class="fas fa-play"></i> Read Aloud';
      utterance = null;
    };
    window.speechSynthesis.speak(utterance);
    isSpeaking = true;
    readBtn.innerHTML = '<i class="fas fa-stop"></i> Stop';
  }

  readBtn.addEventListener('click', () => {
    if (isSpeaking) {
      stopReading();
    } else {
      startReading();
    }
  });
});