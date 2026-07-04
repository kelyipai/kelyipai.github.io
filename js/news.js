/* ============================================
   news.js — 運動新聞獲取 + 卡片渲染
   ============================================ */

(function () {
  'use strict';

  const RSS2JSON = 'https://api.rss2json.com/v1/api.json';

  const SPORTS_CONFIG = [
    { id: 'marathon',   name: '馬拉松', en: 'MARATHON',   keyword: '馬拉松',   fallback: '馬拉松賽事', color: '#00f0ff', image: 'assets/sport-marathon.jpg' },
    { id: 'cycling',    name: '單車',   en: 'CYCLING',    keyword: '單車',   fallback: '單車賽事',   color: '#ff00ff', image: 'assets/sport-cycling.jpg' },
    { id: 'swimming',   name: '游泳',   en: 'SWIMMING',   keyword: '游泳',   fallback: '游泳比賽',   color: '#00aaff', image: 'assets/sport-swimming.jpg' },
    { id: 'hiking',     name: '行山',   en: 'HIKING',     keyword: '行山',   fallback: '登山',       color: '#00ff88', image: 'assets/sport-hiking.jpg' },
    { id: 'pickleball', name: '匹克球', en: 'PICKLEBALL', keyword: '匹克球', fallback: 'pickleball', color: '#7b2ff7', image: 'assets/sport-pickleball.jpg' }
  ];

  function formatDate(pubDate) {
    const date = new Date(pubDate);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return '剛剛';
    if (minutes < 60) return minutes + ' 分鐘前';
    if (hours < 24) return hours + ' 小時前';
    if (days < 7) return days + ' 天前';
    return date.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' });
  }

  function extractSource(link) {
    try {
      const url = new URL(link);
      return url.hostname.replace('www.', '');
    } catch {
      return '';
    }
  }

  async function fetchNewsByKeyword(keyword) {
    const rssUrl = 'https://news.google.com/rss/search?q=' + encodeURIComponent(keyword) + '&hl=zh-Hant&gl=TW&ceid=TW:zh-Hant';
    const apiUrl = RSS2JSON + '?rss_url=' + encodeURIComponent(rssUrl);

    const res = await fetch(apiUrl, { cache: 'no-store' });
    const data = await res.json();

    if (data.status === 'ok' && data.items && data.items.length > 0) {
      return data.items.slice(0, 5).map(function (item) {
        return {
          title: item.title,
          link: item.link,
          date: formatDate(item.pubDate),
          source: item.author || extractSource(item.link)
        };
      });
    }
    return [];
  }

  async function fetchSportNews(sport, attempt) {
    attempt = attempt || 1;
    const maxAttempts = 3;

    try {
      // Primary keyword
      var news = await fetchNewsByKeyword(sport.keyword);
      if (news.length > 0) return news;

      // Fallback keyword
      if (sport.fallback && sport.fallback !== sport.keyword) {
        news = await fetchNewsByKeyword(sport.fallback);
        if (news.length > 0) return news;
      }

      // If empty but API responded, no retry needed
      return [];
    } catch (err) {
      if (attempt < maxAttempts) {
        // Exponential backoff: 1s, 2s
        var delay = attempt * 1000;
        await new Promise(function (resolve) { setTimeout(resolve, delay); });
        return fetchSportNews(sport, attempt + 1);
      }
      throw err;
    }
  }

  function renderNewsList(container, news, isError) {
    if (isError) {
      container.innerHTML = '<div class="news-error">載入失敗，請點擊刷新重試</div>';
      return;
    }
    if (!news || news.length === 0) {
      container.innerHTML = '<div class="news-empty">暫無相關新聞</div>';
      return;
    }

    container.innerHTML = news.map(function (item, idx) {
      return '<li class="news-item" style="animation-delay:' + (idx * 0.08) + 's">' +
        '<a href="' + item.link + '" target="_blank" rel="noopener">' + item.title + '</a>' +
        '<div class="news-meta">' +
          '<span class="news-date">' + item.date + '</span>' +
          (item.source ? '<span class="news-source">· ' + item.source + '</span>' : '') +
        '</div>' +
      '</li>';
    }).join('');
  }

  function createSportCard(sport) {
    var card = document.createElement('div');
    card.className = 'sport-card fade-in';
    card.setAttribute('data-sport', sport.id);
    card.style.setProperty('--card-color', sport.color);

    card.innerHTML =
      '<div class="sport-image-wrapper">' +
        '<img src="' + sport.image + '" alt="' + sport.name + '" loading="lazy">' +
        '<div class="sport-image-overlay"></div>' +
      '</div>' +
      '<div class="sport-name">' +
        '<h3>' + sport.name + '</h3>' +
        '<span class="en">' + sport.en + '</span>' +
      '</div>' +
      '<div class="sport-news-header">' +
        '<span>最新消息</span>' +
        '<button class="refresh-btn" aria-label="刷新新聞" data-sport-id="' + sport.id + '">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
            '<polyline points="23 4 23 10 17 10"></polyline>' +
            '<polyline points="1 20 1 14 7 14"></polyline>' +
            '<path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>' +
          '</svg>' +
        '</button>' +
      '</div>' +
      '<ul class="sport-news-list" id="news-' + sport.id + '">' +
        '<div class="news-loading">載入中...</div>' +
      '</ul>';

    return card;
  }

  async function handleRefresh(sport, button) {
    var list = document.getElementById('news-' + sport.id);
    if (!list) return;

    // Spinning animation
    if (button) {
      button.classList.add('spinning');
      button.disabled = true;
    }
    list.innerHTML = '<div class="news-loading">載入中...</div>';

    try {
      var news = await fetchSportNews(sport);
      renderNewsList(list, news, false);
    } catch (err) {
      console.error('News fetch error for ' + sport.id + ':', err);
      renderNewsList(list, null, true);
    } finally {
      if (button) {
        setTimeout(function () {
          button.classList.remove('spinning');
          button.disabled = false;
        }, 800);
      }
    }
  }

  function init() {
    var grid = document.getElementById('sportsGrid');
    if (!grid) return;

    // Render all cards
    SPORTS_CONFIG.forEach(function (sport) {
      var card = createSportCard(sport);
      grid.appendChild(card);

      // Attach refresh button handler
      var btn = card.querySelector('.refresh-btn');
      btn.addEventListener('click', function () {
        handleRefresh(sport, btn);
      });
    });

    // Auto-load news with 1000ms interval to avoid rss2json rate limits
    SPORTS_CONFIG.forEach(function (sport, idx) {
      setTimeout(function () {
        var btn = document.querySelector('.refresh-btn[data-sport-id="' + sport.id + '"]');
        handleRefresh(sport, btn);
      }, idx * 1000);
    });
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
