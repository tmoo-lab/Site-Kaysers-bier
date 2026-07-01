// Kaysers'Bier - interactions (nav, menu tabs, scroll reveal)
(function () {
  "use strict";

  /* ---- Année du footer ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Nav: état "scrolled" ---- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (window.scrollY > 40) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Menu mobile ---- */
  var burger = document.getElementById("navBurger");
  var links = document.getElementById("navLinks");
  function closeMenu() {
    links.classList.remove("is-open");
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  }
  if (burger && links) {
    burger.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }

  /* ---- Onglets de la carte ---- */
  var tabs = document.querySelectorAll(".tab");
  var panels = document.querySelectorAll(".menu-panel");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var targetId = tab.getAttribute("data-target");

      tabs.forEach(function (t) {
        var active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", active ? "true" : "false");
      });

      panels.forEach(function (p) {
        var show = p.id === targetId;
        p.classList.toggle("is-active", show);
        p.hidden = !show;
      });
    });
  });

  /* ---- Vidéos: lecture quand visibles (pause sinon) ---- */
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var vids = document.querySelectorAll(".video-card video");
  if (vids.length && "IntersectionObserver" in window) {
    var vio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var v = entry.target;
          if (entry.isIntersecting) {
            if (v.preload === "none") v.preload = "metadata";
            if (!prefersReduced) {
              var p = v.play();
              if (p && p.catch) p.catch(function () {});
            }
          } else {
            v.pause();
          }
        });
      },
      { threshold: 0.4 }
    );
    vids.forEach(function (v) { vio.observe(v); });
  }

  /* ---- Carte MapLibre ---- */
  var mapEl = document.getElementById("map");
  if (mapEl && window.maplibregl) {
    var LNG = 7.2597, LAT = 48.1381;
    var addr = "20A Rue du Général de Gaulle 68240 Kaysersberg";
    var dirUrl = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(addr);
    var placeUrl = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Kaysers'Bier " + addr);

    var map = new maplibregl.Map({
      container: "map",
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center: [LNG, LAT],
      zoom: 15.3,
      attributionControl: true
    });
    map.scrollZoom.disable();
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    var pin = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>';
    var nav = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>';
    var ext = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>';

    var popupHtml =
      '<div class="mappop">' +
        '<div class="mappop__img"><img src="images/still-enseigne.jpg" alt="Kaysers\'Bier" /></div>' +
        '<div class="mappop__body">' +
          '<p class="mappop__cat">Restaurant alsacien</p>' +
          '<h3 class="mappop__name">Kaysers\'Bier</h3>' +
          '<div class="mappop__row">' + pin + '<span>20 A rue du Général de Gaulle, Kaysersberg</span></div>' +
          '<div class="mappop__actions">' +
            '<a class="mappop__btn" href="' + dirUrl + '" target="_blank" rel="noopener">' + nav + 'Itinéraire</a>' +
            '<a class="mappop__btn mappop__btn--icon" href="' + placeUrl + '" target="_blank" rel="noopener" aria-label="Voir sur Google Maps">' + ext + '</a>' +
          '</div>' +
        '</div>' +
      '</div>';

    var popup = new maplibregl.Popup({ offset: 26, closeButton: true, maxWidth: "260px" }).setHTML(popupHtml);

    var el = document.createElement("div");
    el.className = "map-marker";
    el.innerHTML = '<div class="map-marker__dot"></div><div class="map-marker__label">Kaysers\'Bier</div>';

    new maplibregl.Marker({ element: el, anchor: "center" })
      .setLngLat([LNG, LAT])
      .setPopup(popup)
      .addTo(map);

    map.on("load", function () { popup.setLngLat([LNG, LAT]).addTo(map); });
  }

  /* ---- Reveal au scroll ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("reveal-in"); });
  }
})();
