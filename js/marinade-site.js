(function () {
  "use strict";

  var issues = window.MARINADE_ISSUES || {};

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  function setHtmlLoaded() {
    document.documentElement.classList.add("webflow-loaded");
  }

  function showBody() {
    document.body.style.opacity = "1";
  }

  function applyIssueCopy() {
    function pane(tabKey) {
      return document.querySelector('.w-tab-pane[data-w-tab="' + tabKey + '"]');
    }

    function setContributors(tabKey, text) {
      var p = pane(tabKey);
      if (!p || !text) return;
      var h = p.querySelector(".issue-text-div .h1");
      if (h) h.textContent = text;
    }

    function setBuyUrl(tabKey, url) {
      if (!url) return;
      var p = pane(tabKey);
      if (!p) return;
      var a = p.querySelector(".link-div a._02");
      if (a) a.href = url;
    }

    if (issues.writing) {
      setContributors(issues.writing.tabKey, issues.writing.contributors);
      setBuyUrl(issues.writing.tabKey, issues.writing.buyUrl);
    }
    if (issues.international) {
      setContributors(issues.international.tabKey, issues.international.contributors);
      setBuyUrl(issues.international.tabKey, issues.international.buyUrl);
      if (issues.international.stutterImage) {
        var p2 = pane(issues.international.tabKey);
        var stImg = p2 && p2.querySelector(".stutter-image");
        if (stImg) stImg.src = issues.international.stutterImage;
      }
    }
    if (issues.friendship) {
      setContributors(issues.friendship.tabKey, issues.friendship.contributors);
      setBuyUrl(issues.friendship.tabKey, issues.friendship.buyUrl);
      var c = issues.friendship.comparison;
      if (c && c.base && c.overlay) {
        var root = document.documentElement;
        root.style.setProperty("--mar-compare-base", 'url("' + c.base + '")');
        root.style.setProperty("--mar-compare-overlay", 'url("' + c.overlay + '")');
      }
    }
  }

  /** Minimal Webflow-compatible tabs (same classes as exported HTML). */
  function initTabs() {
    var root = document.querySelector(".w-tabs");
    if (!root) return;

    var links = root.querySelectorAll(".w-tab-menu .w-tab-link");
    var panes = root.querySelectorAll(".w-tab-content .w-tab-pane");

    links.forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        var tab = link.getAttribute("data-w-tab");
        if (!tab) return;

        links.forEach(function (l) {
          l.classList.remove("w--current");
        });
        link.classList.add("w--current");

        panes.forEach(function (pane) {
          if (pane.getAttribute("data-w-tab") === tab) {
            pane.classList.add("w--tab-active");
          } else {
            pane.classList.remove("w--tab-active");
          }
        });
      });
    });
  }

  function initStutterCanvas() {
    var canvas = document.querySelector(".html-embed-2 canvas");
    if (!canvas) return;

    var stutterLinks = document.querySelectorAll(".stutter-item");
    var goalX = null;
    var goalY = null;
    var mouseX = null;
    var mouseY = null;
    var newImage = null;
    var newWidth = 800;
    var newHeight = 114;
    var context;

    function resize() {
      canvas.width = window.innerWidth * 2;
      canvas.height = window.innerHeight * 2;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      context = canvas.getContext("2d");
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.scale(2, 2);
    }

    resize();

    stutterLinks.forEach(function (link) {
      var imgEl = link.getElementsByTagName("img")[0];
      if (!imgEl) return;
      var imageSource = imgEl.src;
      link.addEventListener("mouseenter", function () {
        var image = document.createElement("img");
        image.src = imageSource;
        newImage = image;
        newWidth = 800;
        newHeight = 114;
      });
      link.addEventListener("mouseleave", function () {
        newWidth = 800;
        newHeight = 114;
        if (context) {
          context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        }
      });
    });

    document.addEventListener("mousemove", function (event) {
      goalX = event.pageX;
      goalY = event.pageY;
      if (mouseX === null) {
        mouseX = event.pageX;
        mouseY = event.pageY;
      }
    });

    window.addEventListener("resize", resize);

    function stutter() {
      if (mouseX != null && context) {
        if (newImage && newImage.complete) {
          context.drawImage(
            newImage,
            mouseX - 0.5 * newWidth,
            mouseY - 0.5 * newHeight,
            newWidth,
            newHeight
          );
        }
        if (goalX != null) {
          mouseX = mouseX + (goalX - mouseX) * 0.22;
          mouseY = mouseY + (goalY - mouseY) * 0.22;
        }
      }
      requestAnimationFrame(stutter);
    }
    stutter();
  }

  function initComparisonSlider() {
    var comparison = document.getElementById("comparison");
    var divisor = document.getElementById("divisor");
    if (!comparison || !divisor) return;

    function moveDivisor(e) {
      var w = comparison.clientWidth;
      if (!w) return;
      var x = typeof e.offsetX === "number" ? e.offsetX : e.clientX - comparison.getBoundingClientRect().left;
      divisor.style.width = (x * 100) / w + "%";
    }

    comparison.addEventListener("mousemove", moveDivisor);
    comparison.addEventListener("touchmove", function (e) {
      if (!e.touches || !e.touches[0]) return;
      var r = comparison.getBoundingClientRect();
      var x = e.touches[0].clientX - r.left;
      var w = comparison.clientWidth;
      if (w) divisor.style.width = (x * 100) / w + "%";
    });
  }

  ready(function () {
    setHtmlLoaded();
    showBody();
    applyIssueCopy();
    initTabs();
    initStutterCanvas();
    initComparisonSlider();
  });
})();
