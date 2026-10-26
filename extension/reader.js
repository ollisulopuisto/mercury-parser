/* eslint-disable */
(async function() {
  const existing = document.getElementById('selkokieli-overlay');
  if (existing) {
    existing.remove();
    document.documentElement.classList.remove('selkokieli-active');
    return;
  }

  try {
    if (typeof Mercury === 'undefined' || !Mercury.parse) {
      alert('Selkokieli-jäsennintä ei voitu ladata.');
      return;
    }

    const article = await Mercury.parse();
    if (!article || (!article.content && !article.title)) {
      alert('Selkokieli ei löytänyt artikkelisisältöä tältä sivulta.');
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
          <button class="selkokieli-close-btn" type="button" aria-label="Sulje lukutila">✕ Sulje</button>
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

    document.addEventListener('keydown', function escListener(e) {
      if (e.key === 'Escape' && document.getElementById('selkokieli-overlay')) {
        closeHandler();
        document.removeEventListener('keydown', escListener);
      }
    });

    document.body.appendChild(overlay);
    document.documentElement.classList.add('selkokieli-active');
  } catch (err) {
    console.error('Selkokieli parsing error:', err);
    alert(`Virhe sivun jäsennyksessä: ${err.message}`);
  }
})();
