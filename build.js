const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const partialsDir = path.join(__dirname, 'partials');
const distDir = path.join(__dirname, 'dist');

const header = fs.readFileSync(path.join(partialsDir, 'header.html'), 'utf8').trimEnd();
const footer = fs.readFileSync(path.join(partialsDir, 'footer.html'), 'utf8').trimEnd();
const sidebarPromo = fs.readFileSync(path.join(partialsDir, 'sidebar-promo.html'), 'utf8').trimEnd();
const categories = require(path.join(partialsDir, 'articles-data.js'));

const SITE_URL = 'https://grid-escape.com';
const LOGO_URL = 'https://pub-0ad734e16c6e4b9083861efedef42f08.r2.dev/Grid-escape%20logo.png';

// file -> article-data entry, used to enrich SEO tags/sitemap for article pages
const articleMeta = {};
for (const cat of categories) {
  for (const article of cat.articles) {
    articleMeta[article.file] = article;
  }
}

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

function imageUrl(image, size) {
  return image.startsWith('http') ? image : `https://picsum.photos/seed/${image}/${size}`;
}

function renderArticleCard(article) {
  return `      <a href="${article.file}" class="article-card">
        <div class="ac-img"><img src="${imageUrl(article.image, '800/500')}" alt="${article.alt}" loading="lazy"></div>
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
        <div class="article-thumb"><img src="${imageUrl(featured.image, '1400/700')}" alt="${featured.alt}" loading="lazy"></div>
        <span class="article-cat">${featured.tag}</span>
        <h3>${featured.title}</h3>
        <p>${featured.excerpt || ''}</p>
      </a>`;

  const sideHtml = rest
    .map((a) => `        <a href="${a.file}" class="article-card">
          <div class="article-thumb"><img src="${imageUrl(a.image, '800/500')}" alt="${a.alt}" loading="lazy"></div>
          <span class="article-cat">${a.tag}</span>
          <h3>${a.title}</h3>
          <p>${a.excerpt || ''}</p>
        </a>`)
    .join('\n');

  return `${featuredHtml}\n      <div class="article-side-list">\n${sideHtml}\n      </div>`;
}

// ---------- SEO tag generation ----------
// Auto-injects a canonical link, Open Graph / Twitter Card tags, and
// JSON-LD structured data into every page's <head> based on that page's
// own <title>/<meta description>/hero image — no per-page SEO markup to
// maintain. Article pages (anything listed in articles-data.js) get
// Article structured data; the homepage gets WebSite structured data.

function escapeHtmlAttr(str) {
  return str.replace(/&(?!amp;|#39;|quot;|lt;|gt;)/g, '&amp;');
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function canonicalUrlFor(file) {
  return file === 'index.html' ? `${SITE_URL}/` : `${SITE_URL}/${file}`;
}

function injectSeoTags(html, file) {
  const canonical = canonicalUrlFor(file);
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/);
  const title = escapeHtmlAttr((titleMatch ? titleMatch[1] : 'Grid Escape').trim());
  const descMatch = html.match(/<meta name="description" content="([^"]*)">/);
  const description = descMatch ? descMatch[1] : '';
  const heroMatch = html.match(/<div class="hero-img-wrap">\s*<img src="([^"]+)"/);
  const image = heroMatch ? heroMatch[1] : LOGO_URL;
  const article = articleMeta[file];

  let tags = `  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="${article ? 'article' : 'website'}">
  <meta property="og:site_name" content="Grid Escape">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${image}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">`;

  if (article) {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: decodeEntities(article.title),
      description: decodeEntities(description),
      image,
      datePublished: new Date(article.date).toISOString().split('T')[0],
      author: { '@type': 'Organization', name: 'Grid Escape' },
      publisher: {
        '@type': 'Organization',
        name: 'Grid Escape',
        logo: { '@type': 'ImageObject', url: LOGO_URL }
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical }
    };
    tags += `\n  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;
  } else if (file === 'index.html') {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Grid Escape',
      url: SITE_URL,
      description: decodeEntities(description)
    };
    tags += `\n  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;
  }

  return html.replace('</head>', `${tags}\n</head>`);
}

// ---------- sitemap.xml / robots.txt generation ----------
// Rebuilt every run from whatever's actually in src/, so a new page or
// article is picked up automatically with no manual sitemap edits.

function buildSitemap(files) {
  const urls = files.map((file) => {
    const article = articleMeta[file];
    const lastmod = article
      ? new Date(article.date).toISOString().split('T')[0]
      : fs.statSync(path.join(srcDir, file)).mtime.toISOString().split('T')[0];
    return `  <url>\n    <loc>${canonicalUrlFor(file)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

function buildRobotsTxt() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}

// ---------- Main build ----------

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

fs.copyFileSync(path.join(partialsDir, 'chrome.css'), path.join(distDir, 'chrome.css'));

const srcFiles = fs.readdirSync(srcDir).filter((file) => file.endsWith('.html'));

for (const file of srcFiles) {
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

  html = injectSeoTags(html, file);

  fs.writeFileSync(path.join(distDir, file), html);
  console.log(`built ${file}`);
}

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), buildSitemap(srcFiles));
fs.writeFileSync(path.join(distDir, 'robots.txt'), buildRobotsTxt());
console.log('built sitemap.xml');
console.log('built robots.txt');
