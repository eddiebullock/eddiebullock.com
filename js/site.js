(function () {
  var root = document.documentElement;
  var button = document.getElementById("theme");
  function apply(dark) {
    if (dark) root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    if (button) {
      button.setAttribute("aria-pressed", dark ? "true" : "false");
      button.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", dark ? "#141210" : "#fbfaf9");
  }
  apply(root.getAttribute("data-theme") === "dark");
  if (!button) return;
  button.addEventListener("click", function () {
    var dark = root.getAttribute("data-theme") !== "dark";
    apply(dark);
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch (e) {}
  });
})();
(function () {
  var root = document.getElementById("highlights");
  if (!root) return;
  var viewport = root.querySelector(".reel-viewport");
  var slides = Array.prototype.slice.call(root.querySelectorAll(".reel-slide"));
  var dots = root.querySelectorAll(".reel-dot");
  var prev = root.querySelector(".reel-prev");
  var next = root.querySelector(".reel-next");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var index = -1;
  var visible = true;
  function offset(i) {
    var slide = slides[i];
    var max = viewport.scrollWidth - viewport.clientWidth;
    var left = slide.offsetLeft - slides[0].offsetLeft + slide.offsetWidth / 2 - viewport.clientWidth / 2;
    return Math.max(0, Math.min(max, left));
  }
  function go(i) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    viewport.scrollTo({ left: offset(i), behavior: reduce ? "auto" : "smooth" });
  }
  function sync() {
    var left = viewport.scrollLeft;
    var max = viewport.scrollWidth - viewport.clientWidth;
    var best = 0;
    slides.forEach(function (slide, i) {
      if (Math.abs(offset(i) - left) < Math.abs(offset(best) - left)) best = i;
    });
    prev.disabled = left <= 2;
    next.disabled = left >= max - 2;
    if (best === index) return;
    index = best;
    slides.forEach(function (slide, i) {
      slide.classList.toggle("is-active", i === index);
      var video = slide.querySelector("video");
      if (!video) return;
      if (i === index && visible && !reduce) {
        video.preload = "auto";
        video.play().catch(function () {});
      } else video.pause();
    });
    dots.forEach(function (dot, i) {
      if (i === index) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
  }
  var pending = false;
  viewport.addEventListener("scroll", function () {
    if (pending) return;
    pending = true;
    requestAnimationFrame(function () {
      pending = false;
      sync();
    });
  }, { passive: true });
  prev.addEventListener("click", function () { go(index - 1); });
  next.addEventListener("click", function () { go(index + 1); });
  dots.forEach(function (dot, i) {
    dot.addEventListener("click", function () { go(i); });
  });
  slides.forEach(function (slide, i) {
    slide.addEventListener("click", function () { if (i !== index) go(i); });
  });
  viewport.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); }
  });
  window.addEventListener("resize", function () { index = -1; sync(); });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      index = -1;
      sync();
    }, { threshold: 0.25 }).observe(root);
  }
  sync();
})();
