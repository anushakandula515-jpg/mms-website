// Gentle motion: sections fade up as they scroll into view, with a soft stagger inside groups.
// Without JavaScript, or with "reduce motion" switched on, everything simply shows.
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var groups = [
    '.section-head',
    '.steps .step',
    '.screens figure',
    '.legend',
    '.ages .age',
    '.features .feature',
    '.promises .promise',
    '.cta .box'
  ];
  var items = [];
  groups.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el, i) {
      el.setAttribute('data-reveal', '');
      el.style.setProperty('--d', Math.min(i, 5) * 90 + 'ms');
      items.push(el);
    });
  });

  function show(el) { el.classList.add('is-in'); }

  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(show);
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  items.forEach(function (el) { io.observe(el); });

  // Safety net: anything already scrolled past or on screen is shown on scroll,
  // so content can never stay hidden (for example after jumping to a #section link).
  var ticking = false;
  function sweep() {
    ticking = false;
    var h = window.innerHeight;
    items.forEach(function (el) {
      if (!el.classList.contains('is-in') && el.getBoundingClientRect().top < h * 0.95) show(el);
    });
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; setTimeout(sweep, 120); }
  }, { passive: true });
  window.addEventListener('load', sweep);
})();
