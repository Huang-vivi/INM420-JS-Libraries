/* ============================================================
   BANFF — Wild & Refined  |  banff-main.js
   Dependencies (load before this file):
     1. Glide.js         cdnjs …/Glide.js/3.6.0/glide.min.js
     2. Masonry          cdnjs …/masonry/4.2.2/masonry.pkgd.min.js
     3. Leaflet          cdnjs …/leaflet/1.9.4/leaflet.min.js
     4. AOS              cdnjs …/aos/2.3.4/aos.js
   ============================================================ */

(function () {
  'use strict';

  /*  AOS — Scroll-triggered animations */
  AOS.init({
    duration: 750,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    once: true,
    offset: 60
  });


  /* Glide.js — Hero image slider */
  const glide = new Glide('#hero-glide', {
    type: 'carousel',
    perView: 1,
    gap: 0,
    autoplay: 5000,
    animationDuration: 1800, // A calm, but not excessively slow, transition
    animationTimingFunc: 'cubic-bezier(0.165, 0.840, 0.440, 1.000)',
    hoverpause: true
  });

  glide.mount();


  /*  Nav — Scroll-aware glass effect */
  const nav = document.getElementById('nav');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });


  /* Masonry.js — Activity card grid */
  const grid = document.getElementById('masonry-grid');
  let msnry;

  // Use native window load event instead of imagesLoaded library
  window.addEventListener('load', () => {
    msnry = new Masonry(grid, {
      itemSelector: '.masonry-item',
      columnWidth: '.grid-sizer',
      gutter: '.gutter-sizer',
      percentPosition: true,
      transitionDuration: '0.4s'
    });
  });

  /* Filter Buttons — Show/hide cards + re-layout Masonry */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {

      // Toggle active state
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filter = this.dataset.filter;

      document.querySelectorAll('.masonry-item').forEach(item => {
        const cat = item.dataset.category || '';
        item.style.display = (filter === 'all' || cat.includes(filter)) ? '' : 'none';
      });

      // Give browser one tick to apply display changes, then re-layout
      setTimeout(() => {
        if (msnry) msnry.layout();
      }, 50);
    });
  });


  /* Leaflet.js — Interactive Banff map */
  const map = L.map('map', {
    center: [51.1784, -115.5708],
    zoom: 12,
    zoomControl: true
  });

  // Soft CartoDB Positron tile layer
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors © CartoDB',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  /**
   * Creates a teardrop-shaped DivIcon marker in the given colour.
   * @param {string} color  CSS hex colour
   * @returns {L.DivIcon}
   */
  function makeIcon(color = '#2d4a3e') {
    return L.divIcon({
      className: '',
      html: `<div style="
        width: 32px;
        height: 32px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      "></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -36]
    });
  }

  /** Activity/POI data for map markers */
  const locations = [
    {
      lat: 51.4153, lng: -116.2152,
      title: 'Lake Louise',
      desc: 'Canoeing & Hiking trailhead',
      color: '#7ab3c4'
    },
    {
      lat: 51.1784, lng: -115.5708,
      title: 'Banff Townsite',
      desc: 'Hot Springs & Bow River access',
      color: '#2d4a3e'
    },
    {
      lat: 51.1915, lng: -115.5622,
      title: 'Banff Hot Springs',
      desc: 'Upper Hot Springs mineral pool',
      color: '#c4884a'
    },
    {
      lat: 51.0867, lng: -115.3614,
      title: 'Mt. Norquay',
      desc: 'Skiing · Closest resort to Banff',
      color: '#5a7da0'
    },
    {
      lat: 51.0933, lng: -115.7693,
      title: 'Sunshine Village',
      desc: 'Skiing · Longest season in Canada',
      color: '#5a7da0'
    },
    {
      lat: 51.3044, lng: -116.1822,
      title: 'Lake Louise Ski Resort',
      desc: 'Skiing · 4,200 acres of terrain',
      color: '#5a7da0'
    },
    {
      lat: 51.2364, lng: -115.9274,
      title: 'Icefields Parkway',
      desc: 'Cycling start point (Hwy 93)',
      color: '#3d6b52'
    }
  ];

  locations.forEach(loc => {
    L.marker([loc.lat, loc.lng], { icon: makeIcon(loc.color) })
      .addTo(map)
      .bindPopup(`
        <div class="popup-title">${loc.title}</div>
        <div class="popup-meta">${loc.desc}</div>
      `);
  });


  /* Utility — Smooth scroll to booking section
        Called from card hover overlay "Book Now" buttons */
  window.scrollToBook = function () {
    document.getElementById('booking-section')
      .scrollIntoView({ behavior: 'smooth' });
  };

})();
