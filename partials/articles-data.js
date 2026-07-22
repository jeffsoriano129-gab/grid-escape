// Grid Escape — Articles page data
//
// This file is the single source of truth for the Articles index page
// (src/articles.html). To publish a new article:
//   1. Add the article's .html file to src/
//   2. Add one entry to the correct category's `articles` array below
//      (or create a new category block if it's a new topic)
//   3. Run `node build.js`
//
// The jump-nav pills, section headers, article cards, and coming-soon
// filler cards are all generated automatically from this file — you
// never need to hand-edit the markup in src/articles.html again.
//
// This file also drives the homepage's "Latest Articles" section — the
// 3 most recent articles (by `date`, across every category) are rendered
// automatically, so a new post shows up on the homepage with no edits
// to src/index.html.
//
// Field reference for each article entry:
//   file      - filename in src/ (e.g. "my-article.html")
//   title     - card headline (shown as ac-title)
//   tag       - small label shown on the card (usually matches category)
//   image     - picsum.photos seed OR a full image URL
//   alt       - alt text for the image
//   date      - display date (e.g. "July 23, 2026") — also used to sort
//               homepage "Latest Articles", so keep it a real, parseable date
//   readTime  - display read time (e.g. "7 min read")
//   excerpt   - one-sentence teaser used on the homepage article cards
//
// Category-level fields:
//   id          - anchor id, used for #jump links (must be unique)
//   title       - category label shown in the jump-nav pill and section header
//   sectionLink - optional { href, label } shown instead of an article count
//                 (used by Solar, which links out to solar.html)
//   articles    - array of article entries, newest first
//   comingSoon  - array of strings, each rendered as a "Coming Soon" filler
//                 card after the real articles (grid is 3 columns — keep
//                 articles.length + comingSoon.length at 3 for a full row,
//                 though it's not required)

module.exports = [
  {
    id: 'camping',
    title: 'Camping',
    articles: [
      {
        file: 'first-time-hikers-guide.html',
        title: 'Things to Consider for First-Time Hikers',
        tag: 'Camping',
        image: 'gridescape-first-time-hikers',
        alt: 'Hiker on a forest trail wearing a daypack and hiking boots',
        date: 'July 23, 2026',
        readTime: '7 min read',
        excerpt: 'A practical guide for first-time hikers — trail choice, day-pack essentials, and safety basics before you set out.'
      },
      {
        file: 'e-trikes-camping-glamping.html',
        title: 'Bringing Grandma and Grandpa Along: E-Trikes for Camping &amp; Glamping',
        tag: 'Camping',
        image: 'gridescape-etrike-campground',
        alt: 'Older couple riding an electric trike along a campground road',
        date: 'July 10, 2026',
        readTime: '7 min read',
        excerpt: 'How a stable, easy-to-ride e-trike can help older relatives get around a campground or glamping resort comfortably.'
      },
      {
        file: 'camping-power-watt-hours-guide.html',
        title: 'How Much Power Do You Actually Need for Camping?',
        tag: 'Camping',
        image: 'gridescape-camping',
        alt: 'Campsite setup with portable power equipment',
        date: 'July 4, 2026',
        readTime: '6 min read',
        excerpt: 'A practical way to calculate power needs for any camping trip.'
      }
    ],
    comingSoon: []
  },
  {
    id: 'vanlife',
    title: 'Van Life',
    articles: [
      {
        file: 'van-life-electrical-basics.html',
        title: 'Van Life Electrical Systems Explained: The Basics Before You Build',
        tag: 'Van Life',
        image: 'gridescape-vanlife',
        alt: 'Van interior electrical setup with wiring and battery components',
        date: 'July 3, 2026',
        readTime: '8 min read',
        excerpt: 'The core components of a reliable van electrical system, explained simply.'
      }
    ],
    comingSoon: [
      'Solar-on-a-van wiring diagrams and battery bank sizing guides are on the way.',
      'Have a van life topic you want covered? Reach out through the contact page.'
    ]
  },
  {
    id: 'solar',
    title: 'Solar',
    sectionLink: { href: 'solar.html', label: 'All Solar Guides' },
    articles: [
      {
        file: 'solar-power-101-off-grid-basics.html',
        title: 'Solar Power 101: How Off-Grid Solar Systems Actually Work',
        tag: 'Solar',
        image: 'gridescape-solar101',
        alt: 'Solar panels and battery bank set up for an off-grid power system',
        date: 'July 2, 2026',
        readTime: '7 min read',
        excerpt: 'A plain-language guide to how off-grid solar panels, charge controllers, batteries, and inverters work together.'
      }
    ],
    comingSoon: [
      'Panel sizing, battery chemistry, and charge controller comparisons are on the way.',
      'Have a solar topic you want covered? Reach out through the contact page.'
    ]
  },
  {
    id: 'batteries',
    title: 'Batteries',
    articles: [
      {
        file: 'best-portable-power-stations-campers.html',
        title: 'Best Portable Power Stations for Campers',
        tag: 'Batteries',
        image: 'gridescape-portable-power-campsite',
        alt: 'Portable power station set up on a table at a campsite',
        date: 'July 22, 2026',
        readTime: '8 min read',
        excerpt: 'Compare portable power stations built for camping trips, including Bluetti and EcoFlow models.'
      }
    ],
    comingSoon: [
      'Battery chemistry, capacity math, and longevity guides are on the way.',
      'Have a battery topic you want covered? Reach out through the contact page.'
    ]
  },
  {
    id: 'generators',
    title: 'Generators',
    articles: [],
    comingSoon: [
      'Gas vs. propane vs. solar generator comparisons are on the way.',
      'Noise levels, runtime, and maintenance guides are on the way.',
      'Have a generator topic you want covered? Reach out through the contact page.'
    ]
  },
  {
    id: 'gear',
    title: 'Gear Reviews',
    articles: [],
    comingSoon: [
      'Hands-on reviews of power stations, panels, and camping gear are on the way.',
      'Head to the homepage for our current Top Gear Picks.',
      'Have a product you want reviewed? Reach out through the contact page.'
    ]
  }
];
