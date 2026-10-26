/* eslint-disable */
(async function() {
  const existing = document.getElementById('selkokieli-overlay');
  if (existing) {
    existing.remove();
    document.documentElement.classList.remove('selkokieli-active');
    return;
  }

  function showToast(message, isError = false, timeout = 4000) {
    const prev = document.getElementById('selkokieli-toast');
    if (prev) prev.remove();

    const toast = document.createElement('div');
    toast.id = 'selkokieli-toast';
    toast.className = isError
      ? 'selkokieli-toast-error'
      : 'selkokieli-toast-info';
    toast.textContent = message;
    document.body.appendChild(toast);

    if (timeout > 0) {
      setTimeout(() => {
        if (toast.parentNode) toast.remove();
      }, timeout);
    }
    return toast;
  }

  const loadingToast = showToast(
    '📖 Selkokieli: Jäsennetään sivua...',
    false,
    0
  );

  try {
    const parser =
      (typeof window !== 'undefined' && window.Mercury) ||
      (typeof globalThis !== 'undefined' && globalThis.Mercury) ||
      (typeof Mercury !== 'undefined' ? Mercury : null);

    if (!parser || typeof parser.parse !== 'function') {
      if (loadingToast.parentNode) loadingToast.remove();
      showToast('⚠️ Selkokieli-jäsennintä ei voitu ladata.', true);
      return;
    }

    const currentHtml = document.documentElement
      ? document.documentElement.outerHTML
      : '';
    const article = await parser.parse(window.location.href, {
      html: currentHtml,
    });

    if (loadingToast.parentNode) loadingToast.remove();

    if (!article || (!article.content && !article.title)) {
      showToast(
        'ℹ️ Selkokieli ei löytänyt artikkelisisältöä tältä sivulta.',
        true
      );
      return;
    }

    const overlay = document.createElement('div');
    overlay.id = 'selkokieli-overlay';

    let formattedDate = '';
    if (article.date_published) {
      try {
        formattedDate = new Date(article.date_published).toLocaleDateString(
          'fi-FI',
          {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }
        );
      } catch (e) {
        formattedDate = article.date_published;
      }
    }

    overlay.innerHTML = `
      <div class="selkokieli-backdrop"></div>
      <div class="selkokieli-modal">
        <div class="selkokieli-toolbar">
          <button class="selkokieli-btn selkokieli-theme-btn" type="button" title="Vaihda teemaa (tumma/vaalea)">🌓 Teema</button>
          <button class="selkokieli-btn selkokieli-close-btn" type="button" aria-label="Sulje lukutila">✕ Sulje</button>
        </div>
        <header class="selkokieli-header">
          ${
            article.domain
              ? `<div class="selkokieli-domain">${article.domain}</div>`
              : ''
          }
          <h1 class="selkokieli-title">${article.title || document.title}</h1>
          <div class="selkokieli-meta">
            ${
              article.author
                ? `<span class="selkokieli-author">${article.author}</span>`
                : ''
            }
            ${
              formattedDate
                ? `<span class="selkokieli-date">${formattedDate}</span>`
                : ''
            }
            ${
              article.word_count
                ? `<span class="selkokieli-words">${
                    article.word_count
                  } sanaa</span>`
                : ''
            }
          </div>
        </header>
        ${
          article.lead_image_url
            ? `<div class="selkokieli-lead-image-wrap"><img class="selkokieli-lead-image" src="${
                article.lead_image_url
              }" alt="" /></div>`
            : ''
        }
        <div class="selkokieli-content" dir="${article.direction || 'ltr'}">
          ${article.content || '<p>Ei tekstisisältöä.</p>'}
        </div>
      </div>
    `;

    const closeHandler = () => {
      overlay.remove();
      document.documentElement.classList.remove('selkokieli-active');
    };

    overlay
      .querySelector('.selkokieli-close-btn')
      .addEventListener('click', closeHandler);
    overlay
      .querySelector('.selkokieli-backdrop')
      .addEventListener('click', closeHandler);

    const themeBtn = overlay.querySelector('.selkokieli-theme-btn');
    themeBtn.addEventListener('click', () => {
      const currentTheme = overlay.getAttribute('data-theme');
      const isSystemDark =
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      let nextTheme;

      if (!currentTheme) {
        nextTheme = isSystemDark ? 'light' : 'dark';
      } else if (currentTheme === 'dark') {
        nextTheme = 'light';
      } else {
        nextTheme = 'dark';
      }

      overlay.setAttribute('data-theme', nextTheme);
    });

    document.addEventListener('keydown', function escListener(e) {
      if (e.key === 'Escape' && document.getElementById('selkokieli-overlay')) {
        closeHandler();
        document.removeEventListener('keydown', escListener);
      }
    });

    document.body.appendChild(overlay);
    document.documentElement.classList.add('selkokieli-active');
  } catch (err) {
    if (loadingToast.parentNode) loadingToast.remove();
    console.error('Selkokieli parsing error:', err);
    showToast(`⚠️ Virhe sivun jäsennyksessä: ${err.message}`, true, 6000);
  }
})();
