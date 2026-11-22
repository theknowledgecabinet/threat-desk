// Theme switch (remembered per browser) and the search page. Both work without storage.
(function () {
  var root = document.documentElement;
  try { var t = localStorage.getItem("theme"); if (t) root.setAttribute("data-theme", t); } catch (e) {}
  document.addEventListener("DOMContentLoaded", function () {
    var b = document.querySelector(".theme-toggle");
    if (b) b.addEventListener("click", function () {
      var cur = root.getAttribute("data-theme") ||
        (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      if (root.getAttribute("data-site") === "soc" && !root.getAttribute("data-theme") &&
          !matchMedia("(prefers-color-scheme: light)").matches) cur = "dark";
      var next = cur === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
    var q = document.getElementById("q");
    if (!q) return;
    var base = (document.querySelector(".brand") || {}).getAttribute("href") || "/";
    var list = document.getElementById("results"), data = [];
    fetch(base + "search.json").then(function (r) { return r.json(); }).then(function (d) { data = d; });
    q.addEventListener("input", function () {
      var words = q.value.toLowerCase().split(/\s+/).filter(Boolean);
      list.innerHTML = "";
      if (!words.length) return;
      data.filter(function (s) {
        var t = (s.title + " " + s.text + " " + s.places).toLowerCase();
        return words.every(function (w) { return t.indexOf(w) >= 0; });
      }).slice(0, 40).forEach(function (s) {
        var li = document.createElement("li"), a = document.createElement("a");
        a.href = s.url; a.textContent = s.title;
        li.appendChild(a);
        li.appendChild(document.createTextNode(" — " + s.section + ", " + s.date));
        list.appendChild(li);
      });
    });
  });
})();
