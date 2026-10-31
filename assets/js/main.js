/* Publication filters (built from data-tags), only active if #pubList exists. */
(function () {
  "use strict";
  var list = document.getElementById("pubList");
  var filters = document.getElementById("pubFilters");
  if (!list || !filters) return;

  var pubs = Array.prototype.slice.call(list.querySelectorAll(".pub"));
  var tagSet = {};
  pubs.forEach(function (p) {
    (p.getAttribute("data-tags") || "").split(",").forEach(function (t) {
      t = t.trim(); if (t) tagSet[t] = true;
    });
  });

  function makeBtn(label, value, active) {
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    if (active) b.classList.add("is-active");
    b.addEventListener("click", function () {
      filters.querySelectorAll("button").forEach(function (x) { x.classList.remove("is-active"); });
      b.classList.add("is-active");
      pubs.forEach(function (p) {
        var tags = (p.getAttribute("data-tags") || "").split(",").map(function (s) { return s.trim(); });
        p.style.display = value === "*" || tags.indexOf(value) > -1 ? "" : "none";
      });
    });
    return b;
  }

  var tags = Object.keys(tagSet).sort();
  if (tags.length) {
    filters.appendChild(makeBtn("All", "*", true));
    tags.forEach(function (t) { filters.appendChild(makeBtn(t, t, false)); });
  }
})();
