/* ═══════════════════════════════════════════════════════════
   Interactions: starfield · sticky nav · fade-in on scroll · publication filters
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

  /* ── Satellite crossing the sky (visible over the hero) ── */
  var sat = { p: 0.02, wait: 0 };
  var ACC = "47,224,181";

  // The path follows the name in the hero: a shallow arc just above it.
  var nameEl = document.querySelector(".hero__name");
  var baseY = 0;
  function satPos(p) {
    var y = baseY - Math.sin(Math.PI * p) * 30 * dpr;
    return { x: (-0.06 + 1.12 * p) * w, y: y };
  }

  function drawSat() {
    var vis = 1 - window.pageYOffset / (innerHeight * 0.85);
    if (sat.wait > 0) { sat.wait--; return; }
    sat.p += 1 / (60 * 26);                       // ~26 s per crossing
    if (sat.p > 1) { sat.p = 0; sat.wait = 60 * 8; return; }
    if (vis <= 0) return;

    var top = nameEl ? nameEl.getBoundingClientRect().top : innerHeight * 0.3;
    baseY = (top - 18) * dpr;

    var a = satPos(sat.p), b = satPos(sat.p + 0.002);
    var ang = Math.atan2(b.y - a.y, b.x - a.x);

    // fading orbit trail, recomputed each frame so it stays on the path
    ctx.lineWidth = dpr;
    var prev = a, steps = 40;
    for (var i = 1; i <= steps; i++) {
      var pp = sat.p - i * 0.004;
      if (pp < 0) break;
      var q = satPos(pp), f = 1 - i / steps;
      ctx.strokeStyle = "rgba(" + ACC + "," + (f * 0.3 * vis).toFixed(3) + ")";
      ctx.beginPath(); ctx.moveTo(prev.x, prev.y); ctx.lineTo(q.x, q.y); ctx.stroke();
      prev = q;
    }

    // spacecraft: body + two solar panels, panels perpendicular to heading
    var k = Math.max(0.8, Math.min(1.25, innerWidth / 1200)) * dpr;
    ctx.save();
    ctx.translate(a.x, a.y);
    ctx.rotate(ang + Math.PI / 2);
    ctx.scale(k, k);
    ctx.globalAlpha = Math.min(1, vis);
    ctx.fillStyle = "#cfd8e6";
    ctx.fillRect(-4, -5, 8, 10);                                  // body
    ctx.fillStyle = "rgba(" + ACC + ",0.55)";
    ctx.fillRect(-19, -3, 13, 6);                                 // left panel
    ctx.fillRect(6, -3, 13, 6);                                   // right panel
    ctx.strokeStyle = "rgba(12,13,17,0.7)";
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    for (var x = -15; x <= 15; x += 4.5) {
      if (Math.abs(x) < 5) continue;
      ctx.moveTo(x, -3); ctx.lineTo(x, 3);
    }
    ctx.stroke();
    ctx.strokeStyle = "#cfd8e6";
    ctx.beginPath(); ctx.moveTo(0, -5); ctx.lineTo(0, -9); ctx.stroke();   // antenna
    var blink = Math.max(0, Math.sin(t * 5));                             // beacon
    ctx.fillStyle = "rgba(" + ACC + "," + blink.toFixed(2) + ")";
    ctx.beginPath(); ctx.arc(0, -9.5, 1.4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
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
    drawSat();
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);
  requestAnimationFrame(draw);
})();
