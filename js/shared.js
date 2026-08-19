/* ============================================================
   SOX IT Audit Platform — shared.js
   Nav, theme, search, back-to-top — one file for all pages
   ============================================================ */

(function () {
  'use strict';

  // ── THEME ───────────────────────────────────────────────
  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    const icon = document.getElementById('themeIcon');
    if (icon) icon.className = t === 'dark' ? 'ti ti-moon' : 'ti ti-sun';
    localStorage.setItem('sox-theme', t);
  }
  const savedTheme = localStorage.getItem('sox-theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  setTheme(savedTheme);

  document.addEventListener('DOMContentLoaded', function () {

    // Theme toggle
    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () =>
        setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark')
      );
    }

    // ── MOBILE MENU ────────────────────────────────────────
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
      mobileMenu.querySelectorAll('a').forEach(a =>
        a.addEventListener('click', () => mobileMenu.classList.remove('open'))
      );
    }

    // ── ACTIVE NAV LINK ────────────────────────────────────
    // Mark the current page link active based on pathname
    const path = window.location.pathname;
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
      const href = a.getAttribute('href') || '';
      // Match exact page or index
      const match =
        (href === 'index.html' || href === '/' || href === '../index.html') && (path.endsWith('/') || path.endsWith('index.html')) ||
        (href !== 'index.html' && href !== '/' && path.includes(href.replace('../', '').replace('.html', '')));
      if (match) a.classList.add('active');
    });

    // ── BACK TO TOP ────────────────────────────────────────
    const backTop = document.getElementById('backTop');
    if (backTop) {
      window.addEventListener('scroll', () =>
        backTop.classList.toggle('visible', window.scrollY > 450), { passive: true }
      );
      backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // ── SCROLL REVEAL ──────────────────────────────────────
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
      });
    }, { threshold: 0.06 });
    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

    // ── TABS ────────────────────────────────────────────────
    document.querySelectorAll('.tab-nav').forEach(nav => {
      nav.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const tab = btn.dataset.tab;
          nav.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const section = btn.closest('section') || btn.closest('.tab-host') || document;
          section.querySelectorAll('.tab-panel').forEach(p =>
            p.classList.toggle('active', p.id === 'tab-' + tab)
          );
        });
      });
    });

    // ── ACCORDION (wp-header, playbook-header) ─────────────
    document.querySelectorAll('.wp-header, .playbook-header').forEach(header => {
      header.addEventListener('click', () => {
        const body = header.nextElementSibling;
        if (body) body.classList.toggle('open');
        const icon = header.querySelector('.toggle-icon');
        if (icon) icon.style.transform = body && body.classList.contains('open') ? 'rotate(180deg)' : '';
      });
    });

    // ── SEARCH OVERLAY ─────────────────────────────────────
    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput   = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const searchBtn     = document.getElementById('searchBtn');

    const SITE_SEARCH_INDEX = [
      // Pages
      { section: 'Page', title: 'Home — SOX IT Audit Hub', preview: 'Full platform overview, ITGC domains, RCM, tools', href: '../index.html' },
      { section: 'Page', title: 'Evidence Workpaper Templates', preview: 'Printable blank workpaper shells for LA, CM, CO, PD, JE testing', href: 'workpapers.html' },
      { section: 'Page', title: 'Application Controls vs. ITGC', preview: 'Key differences, dependency relationship, how each is tested', href: 'app-controls.html' },
      { section: 'Page', title: 'Common ITGC Mistakes', preview: 'Most frequent deficiencies by domain with fix guidance', href: 'mistakes.html' },
      { section: 'Page', title: 'Remediation Playbook', preview: 'Step-by-step remediation for CD, SD, and material weakness', href: 'remediation.html' },
      { section: 'Page', title: 'Cyber → SOX ITGC Bridge', preview: 'How SOC 2, ISO 27001, NIST map to SOX ITGC controls', href: 'cyber-sox.html' },
      // Key terms
      { section: 'Glossary', title: 'IPE — Information produced by entity', preview: 'Reports or extracts used in controls — must be validated per AS 1105.10A', href: '../index.html#glossary' },
      { section: 'Glossary', title: 'Material weakness', preview: 'Reasonable possibility of material misstatement not detected on a timely basis', href: '../index.html#glossary' },
      { section: 'Glossary', title: 'Walkthrough', preview: 'Trace one transaction end-to-end to confirm design understanding per AS 2201.34', href: '../index.html#glossary' },
      { section: 'Glossary', title: 'SoD — Segregation of duties', preview: 'No single individual can both execute and conceal errors or fraud', href: '../index.html#glossary' },
      { section: 'Standards', title: 'PCAOB AS 2201 Amendment (Dec 2026)', preview: 'Strengthens link between ICFR control testing and FS audit conclusions', href: '../index.html#standards' },
      { section: 'Standards', title: 'PCAOB AS 1105 — IPE Para .10A', preview: 'New requirement to validate reliability of company-provided electronic information', href: '../index.html#standards' },
      { section: 'Standards', title: 'PCAOB QC 1000 (Dec 2026)', preview: 'New firm-level quality control standard — Form QC due Nov 2027', href: '../index.html#standards' },
    ];

    function openSearch() {
      if (searchOverlay) { searchOverlay.classList.add('open'); if (searchInput) searchInput.focus(); }
    }

    if (searchBtn)     searchBtn.addEventListener('click', openSearch);
    if (searchOverlay) searchOverlay.addEventListener('click', e => {
      if (e.target === searchOverlay) searchOverlay.classList.remove('open');
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && searchOverlay) searchOverlay.classList.remove('open');
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
    });

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const q = searchInput.value.trim().toLowerCase();
        if (!q) {
          if (searchResults) searchResults.innerHTML = '<div class="search-empty">Start typing to search pages, controls, standards, and glossary terms.</div>';
          return;
        }
        const hits = SITE_SEARCH_INDEX.filter(i =>
          i.title.toLowerCase().includes(q) || i.preview.toLowerCase().includes(q) || i.section.toLowerCase().includes(q)
        ).slice(0, 8);
        if (searchResults) {
          searchResults.innerHTML = hits.length
            ? hits.map(h => `
                <div class="search-result-item" onclick="searchOverlay.classList.remove('open');window.location='${h.href}'">
                  <div class="sr-section">${h.section}</div>
                  <div class="sr-title">${h.title}</div>
                  <div class="sr-preview">${h.preview}</div>
                </div>
              `).join('')
            : '<div class="search-empty">No results. Try a different term.</div>';
        }
      });
    }

  }); // end DOMContentLoaded

})();
