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

  /* ---- Hero: agrandissement au défilement ---- */
  var xReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var xhero = document.querySelector(".xhero");
  var xsticky = document.getElementById("xheroSticky");
  var xreveal = document.getElementById("xheroReveal");
  if (xhero && xsticky && !xReduce) {
    var xTicking = false;
    var updateHero = function () {
      var total = xhero.offsetHeight - window.innerHeight;
      var passed = -xhero.getBoundingClientRect().top;
      var p = total > 0 ? Math.min(Math.max(passed / total, 0), 1) : 0;
      var pe = Math.min(p / 0.9, 1); // agrandissement terminé un peu avant la fin
      xsticky.style.setProperty("--p", pe.toFixed(4));
      if (xreveal) xreveal.classList.toggle("is-live", pe > 0.92);
      xTicking = false;
    };
    window.addEventListener("scroll", function () {
      if (!xTicking) { xTicking = true; requestAnimationFrame(updateHero); }
    }, { passive: true });
    window.addEventListener("resize", updateHero);
    updateHero();
  } else if (xreveal) {
    xreveal.classList.add("is-live");
  }

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

  /* ---- Carte: navigation "hover slider" ---- */
  var hsItems = document.querySelectorAll(".hs-item");
  var hsImgs = document.querySelectorAll(".hs-img");
  var panels = document.querySelectorAll(".menu-panel");

  // Animation lettre par lettre (effet stagger au survol / à la sélection)
  document.querySelectorAll(".hs-roll").forEach(function (roll) {
    var text = roll.getAttribute("data-text") || "";
    var frag = document.createDocumentFragment();
    text.split("").forEach(function (ch, i) {
      var wrap = document.createElement("span");
      wrap.className = "hs-char";
      var display = ch === " " ? " " : ch;
      var a = document.createElement("span");
      a.className = "hs-a";
      a.textContent = display;
      var b = document.createElement("span");
      b.className = "hs-b";
      b.textContent = display;
      var delay = (i * 0.025).toFixed(3) + "s";
      a.style.transitionDelay = delay;
      b.style.transitionDelay = delay;
      wrap.appendChild(a);
      wrap.appendChild(b);
      frag.appendChild(wrap);
    });
    roll.appendChild(frag);
  });

  function activateCategory(target) {
    hsItems.forEach(function (it) {
      var on = it.getAttribute("data-target") === target;
      it.classList.toggle("is-active", on);
      it.setAttribute("aria-selected", on ? "true" : "false");
    });
    hsImgs.forEach(function (im) {
      im.classList.toggle("is-active", im.getAttribute("data-target") === target);
    });
    panels.forEach(function (p) {
      var on = p.id === target;
      p.classList.toggle("is-active", on);
      p.hidden = !on;
    });
  }
  hsItems.forEach(function (it) {
    var t = it.getAttribute("data-target");
    it.addEventListener("mouseenter", function () { activateCategory(t); });
    it.addEventListener("click", function () { activateCategory(t); });
    it.addEventListener("focus", function () { activateCategory(t); });
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
    var star = '<svg viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="1.5" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';

    var popupHtml =
      '<div class="mappop">' +
        '<div class="mappop__img"><img src="images/still-enseigne.jpg" alt="Kaysers\'Bier" /></div>' +
        '<div class="mappop__body">' +
          '<p class="mappop__cat">Restaurant alsacien</p>' +
          '<h3 class="mappop__name">Kaysers\'Bier</h3>' +
          '<div class="mappop__rating">' + star + '<strong>4,4</strong><span>/ 5</span><span class="mappop__muted">Avis Google</span></div>' +
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
    // La popup reste fermée par défaut pour ne pas masquer la carte.
    // Un clic sur le marqueur (ou son libellé) l'ouvre.
    el.addEventListener("click", function () { map.flyTo({ center: [LNG, LAT], zoom: 16, duration: 600 }); });
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

  /* ---- Scrollspy: surligne le lien de la section visible ---- */
  var spyLinks = {};
  document.querySelectorAll(".nav__links a").forEach(function (a) {
    if (a.classList.contains("btn")) return;
    var href = a.getAttribute("href") || "";
    if (href.charAt(0) === "#") spyLinks[href.slice(1)] = a;
  });
  var spyIds = Object.keys(spyLinks);
  if (spyIds.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            spyIds.forEach(function (k) {
              spyLinks[k].classList.toggle("is-current", k === id);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    spyIds.forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) spy.observe(sec);
    });
  }
})();
