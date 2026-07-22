const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const partialsDir = path.join(__dirname, 'partials');
const distDir = path.join(__dirname, 'dist');

const header = fs.readFileSync(path.join(partialsDir, 'header.html'), 'utf8').trimEnd();
const footer = fs.readFileSync(path.join(partialsDir, 'footer.html'), 'utf8').trimEnd();
const sidebarPromo = fs.readFileSync(path.join(partialsDir, 'sidebar-promo.html'), 'utf8').trimEnd();
const categories = require(path.join(partialsDir, 'articles-data.js'));

// ---------- Articles page generation ----------
// Builds the #jump-nav pills and the per-category sections (article cards +
// coming-soon fillers) straight from partials/articles-data.js, so the
// Articles page never needs hand-edited markup for a new post.

function renderJumpNav() {
  const pills = categories
    .map((cat) => `    <a href="#${cat.id}" class="jump-pill">${cat.title}</a>`)
    .join('\n');
  return `<nav class="jump-nav" aria-label="Article topics">\n  <div class="wrap jump-track">\n${pills}\n  </div>\n</nav>`;
}

function renderArticleCard(article) {
  return `      <a href="${article.file}" class="article-card">
        <div class="ac-img"><img src="https://picsum.photos/seed/${article.image}/800/500" alt="${article.alt}" loading="lazy"></div>
        <div class="ac-body">
          <span class="ac-tag">${article.tag}</span>
          <div class="ac-title">${article.title}</div>
          <div class="ac-meta">${article.date} · ${article.readTime}</div>
        </div>
      </a>`;
}

function renderComingSoonCard(text) {
  return `      <div class="coming-soon-card">
        <div class="cs-icon">Coming Soon</div>
        <p>${text}</p>
      </div>`;
}

function renderCategorySection(cat) {
  const headerRight = cat.sectionLink
    ? `<a href="${cat.sectionLink.href}" class="section-link">${cat.sectionLink.label}</a>`
    : `<div class="cat-grid-count">${cat.articles.length} article${cat.articles.length === 1 ? '' : 's'}</div>`;

  const cards = [
    ...cat.articles.map(renderArticleCard),
    ...cat.comingSoon.map(renderComingSoonCard)
  ].join('\n\n');

  return `<section class="cat-section" id="${cat.id}">
  <div class="wrap">
    <div class="cat-grid-header">
      <div class="cat-grid-title">${cat.title}</div>
      ${headerRight}
    </div>
    <div class="cat-article-grid">

${cards}

    </div>
  </div>
</section>`;
}

function renderArticleSections() {
  return categories.map(renderCategorySection).join('\n\n');
}

// ---------- Homepage "Latest Articles" generation ----------
// Flattens every article across every category, sorts newest-first by
// `date`, and renders the top 3 (one featured + two side-list) so the
// homepage always reflects the newest posts without manual edits.

function getAllArticlesSorted() {
  return categories
    .flatMap((cat) => cat.articles)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function renderLatestArticles(count = 3) {
  const latest = getAllArticlesSorted().slice(0, count);
  const [featured, ...rest] = latest;

  const featuredHtml = `      <a href="${featured.file}" class="article-card article-featured">
        <div class="article-thumb"><img src="https://picsum.photos/seed/${featured.image}/1400/700" alt="${featured.alt}" loading="lazy"></div>
        <span class="article-cat">${featured.tag}</span>
        <h3>${featured.title}</h3>
        <p>${featured.excerpt || ''}</p>
      </a>`;

  const sideHtml = rest
    .map((a) => `        <a href="${a.file}" class="article-card">
          <div class="article-thumb"><img src="https://picsum.photos/seed/${a.image}/800/500" alt="${a.alt}" loading="lazy"></div>
          <span class="article-cat">${a.tag}</span>
          <h3>${a.title}</h3>
          <p>${a.excerpt || ''}</p>
        </a>`)
    .join('\n');

  return `${featuredHtml}\n      <div class="article-side-list">\n${sideHtml}\n      </div>`;
}

// ---------- Main build ----------

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

fs.copyFileSync(path.join(partialsDir, 'chrome.css'), path.join(distDir, 'chrome.css'));

for (const file of fs.readdirSync(srcDir)) {
  if (!file.endsWith('.html')) continue;
  let html = fs.readFileSync(path.join(srcDir, file), 'utf8');
  html = html
    .replace('<!--@@HEADER@@-->', header)
    .replace('<!--@@FOOTER@@-->', footer)
    .replace('<!--@@SIDEBAR_PROMO@@-->', sidebarPromo);

  if (html.includes('<!--@@JUMP_NAV@@-->')) {
    html = html.replace('<!--@@JUMP_NAV@@-->', renderJumpNav());
  }
  if (html.includes('<!--@@ARTICLE_SECTIONS@@-->')) {
    html = html.replace('<!--@@ARTICLE_SECTIONS@@-->', renderArticleSections());
  }
  if (html.includes('<!--@@LATEST_ARTICLES@@-->')) {
    html = html.replace('<!--@@LATEST_ARTICLES@@-->', renderLatestArticles());
  }

  fs.writeFileSync(path.join(distDir, file), html);
  console.log(`built ${file}`);
}
