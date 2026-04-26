/* ============================================================
   Navigation shared partial — injected via JS on all pages
   ============================================================ */

(function () {
  'use strict';

  /* ---- Inject nav ---- */
  var pages = [
    { href: 'index.html',                 label: 'Home' },
    { href: 'about.html',                 label: 'About Me' },
    { href: 'web-design.html',            label: 'Web Design' },
    { href: 'professional-writing.html',  label: 'Professional Writing' },
    { href: 'visualizations.html',        label: 'Visualizations' }
  ];

  function currentPage() {
    var parts = window.location.pathname.split('/');
    return parts[parts.length - 1] || 'index.html';
  }

  function buildNav() {
    var cur = currentPage();
    var linksHtml = pages.map(function (p) {
      var active = (cur === p.href) ? ' class="active"' : '';
      return '<li><a href="' + p.href + '"' + active + '>' + p.label + '</a></li>';
    }).join('');

    return (
      '<nav class="site-nav" aria-label="Main navigation">' +
        '<div class="nav-inner">' +
          '<a href="index.html" class="nav-logo" aria-label="Madison Ceriani — Home">Madison Ceriani</a>' +
          '<button class="nav-toggle" aria-controls="nav-links" aria-expanded="false" aria-label="Toggle navigation">' +
            '<span></span><span></span><span></span>' +
          '</button>' +
          '<ul class="nav-links" id="nav-links">' + linksHtml + '</ul>' +
        '</div>' +
      '</nav>'
    );
  }

  function buildFooter() {
    return (
      '<footer class="site-footer">' +
        '<p class="footer-heading">Contact Me</p>' +
        '<p><a href="mailto:made.ceriani@gmail.com">made.ceriani@gmail.com</a></p>' +
        '<p style="margin-top:0.5rem;font-size:0.8rem;color:#9e8a8a;">' +
          '&copy; ' + new Date().getFullYear() + ' Madison Ceriani. All rights reserved.' +
        '</p>' +
      '</footer>'
    );
  }

  document.addEventListener('DOMContentLoaded', function () {
    /* Inject nav before first element in body */
    var body = document.body;
    var firstChild = body.firstChild;
    var navEl = document.createElement('div');
    navEl.innerHTML = buildNav();
    body.insertBefore(navEl.firstChild, firstChild);

    /* Inject footer at end of body */
    var footerEl = document.createElement('div');
    footerEl.innerHTML = buildFooter();
    body.appendChild(footerEl.firstChild);

    /* Mobile toggle */
    var toggle = document.querySelector('.nav-toggle');
    var navLinks = document.getElementById('nav-links');
    if (toggle && navLinks) {
      toggle.addEventListener('click', function () {
        var isOpen = navLinks.classList.toggle('open');
        toggle.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
      });

      /* Close on outside click */
      document.addEventListener('click', function (e) {
        if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
          navLinks.classList.remove('open');
          toggle.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });

  /* ---- Resume upload preview ---- */
  document.addEventListener('DOMContentLoaded', function () {
    var input = document.getElementById('resume-upload');
    if (!input) return;
    var filenameEl = document.getElementById('resume-filename');
    var viewLink   = document.getElementById('resume-view-link');
    var currentObjectUrl = null;

    /* Open the stored blob URL in a new tab when the view button is clicked.
       The href attribute is never set to user-derived data; navigation is
       handled entirely here after an explicit protocol check. */
    if (viewLink) {
      viewLink.addEventListener('click', function (e) {
        e.preventDefault();
        if (currentObjectUrl && currentObjectUrl.indexOf('blob:') === 0) {
          window.open(currentObjectUrl, '_blank', 'noopener,noreferrer');
        }
      });
    }

    input.addEventListener('change', function () {
      var file = this.files && this.files[0];
      if (!file) return;
      if (filenameEl) filenameEl.textContent = file.name;

      /* Revoke the previous object URL to prevent memory leaks. */
      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
        currentObjectUrl = null;
      }

      /* URL.createObjectURL always returns a blob: URL; store it only in a
         JS variable so that no user-derived value is ever written to a DOM
         property or attribute. */
      if (viewLink) {
        var url = URL.createObjectURL(file);
        if (typeof url === 'string' && url.indexOf('blob:') === 0) {
          currentObjectUrl = url;
          viewLink.style.display = 'inline-flex';
        } else {
          URL.revokeObjectURL(url);
        }
      }
    });
  });

}());
