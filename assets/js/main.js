/* ═══════════════════════════════════════════════════════════
   Interactions: starfield · sticky nav · scroll reveal ·
   publication filters · card glow · spectral equalizer bars
   ═══════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Sticky nav state ─────────────────────────────── */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (nav) nav.classList.toggle("is-stuck", window.scrollY > 30);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ── Reveal on scroll ─────────────────────────────── */
  var revealEls = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ── Card cursor glow ─────────────────────────────── */
  document.querySelectorAll(".card").forEach(function (card) {
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
    });
  });

  /* ── Spectral equalizer bars in the profile card ──── */
  var eq = document.querySelector(".about__spectral");
  if (eq) {
    for (var i = 0; i < 12; i++) {
      var li = document.createElement("li");
      li.style.animationDelay = (i * 0.12) + "s";
      li.style.animationDuration = (2 + (i % 4) * 0.35) + "s";
      eq.appendChild(li);
    }
  }

  /* ── Publication filters (built from data-tags) ───── */
  var list = document.getElementById("pubList");
  var filters = document.getElementById("pubFilters");
  if (list && filters) {
    var pubs = Array.prototype.slice.call(list.querySelectorAll(".pub"));
    var tagSet = {};
    pubs.forEach(function (p) {
      (p.getAttribute("data-tags") || "").split(",").forEach(function (t) {
        t = t.trim(); if (t) tagSet[t] = true;
      });
    });
    var tags = Object.keys(tagSet).sort();

    function makeBtn(label, value, active) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = label;
      b.dataset.filter = value;
      if (active) b.classList.add("is-active");
      b.addEventListener("click", function () {
        filters.querySelectorAll("button").forEach(function (x) { x.classList.remove("is-active"); });
        b.classList.add("is-active");
        pubs.forEach(function (p) {
          var show = value === "*" ||
            (p.getAttribute("data-tags") || "").split(",").map(function (s) { return s.trim(); }).indexOf(value) > -1;
          p.classList.toggle("is-hidden", !show);
        });
      });
      return b;
    }

    if (tags.length) {
      filters.appendChild(makeBtn("All", "*", true));
      tags.forEach(function (t) {
        // Title-case the label for display
        var label = t.replace(/\b\w/g, function (c) { return c.toUpperCase(); });
        filters.appendChild(makeBtn(label, t, false));
      });
    }
  }

  /* ── Starfield canvas ─────────────────────────────── */
  var canvas = document.getElementById("starfield");
  if (!canvas || reduce) { if (canvas) canvas.style.display = "none"; return; }
  var ctx = canvas.getContext("2d");
  var stars = [], w, h, dpr;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = Math.floor(innerWidth * dpr);
    h = canvas.height = Math.floor(innerHeight * dpr);
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
    var count = Math.round((innerWidth * innerHeight) / 9000);
    stars = [];
    for (var i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 0.9 + 0.1,       // depth → size & brightness
        tw: Math.random() * Math.PI * 2,     // twinkle phase
        sp: Math.random() * 0.02 + 0.004
      });
    }
  }

  var t = 0;
  function draw() {
    t += 0.016;
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      // slow parallax drift downward
      s.y += s.z * 0.12 * dpr;
      if (s.y > h) { s.y = 0; s.x = Math.random() * w; }
      var a = 0.35 + Math.sin(s.tw + t * s.sp * 60) * 0.35 + s.z * 0.3;
      var r = s.z * 1.5 * dpr;
      // tint the brighter/nearer stars toward cyan-green
      ctx.beginPath();
      ctx.fillStyle = s.z > 0.75
        ? "rgba(150,240,220," + a.toFixed(3) + ")"
        : "rgba(200,220,255," + (a * 0.8).toFixed(3) + ")";
      ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);
  requestAnimationFrame(draw);
})();
