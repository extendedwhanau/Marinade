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

  function paneByTab(tabKey) {
    return document.querySelector('.w-tab-pane[data-w-tab="' + tabKey + '"]');
  }

  function setContributors(tabKey, text) {
    var p = paneByTab(tabKey);
    if (!p || !text) return;
    var h = p.querySelector(".issue-text-div .h1");
    if (h) h.textContent = text;
  }

  function setIssueTitle(tabKey, title) {
    if (!title) return;
    var p = paneByTab(tabKey);
    if (!p) return;
    var em = p.querySelector(".issue-title-div .h1 em");
    if (em) em.textContent = title;
  }

  function setBuyUrl(tabKey, url) {
    if (!url) return;
    var p = paneByTab(tabKey);
    if (!p) return;
    var a = p.querySelector(".link-div a._02");
    if (a) a.href = url;
  }

  function setBuyLabel(tabKey, label) {
    if (!label) return;
    var p = paneByTab(tabKey);
    if (!p) return;
    var a = p.querySelector(".link-div a._02");
    if (!a) return;
    var em = a.querySelector("em");
    var div = a.querySelector("div.h1");
    if (em) em.textContent = label;
    else if (div) div.textContent = label;
    else a.textContent = label;
  }

  /** One place to sync DOM from `MARINADE_ISSUES` — edit js/issues-config.js only. */
  function applyIssueCopy() {
    var root = document.documentElement;

    Object.keys(issues).forEach(function (id) {
      var cfg = issues[id];
      if (!cfg || !cfg.tabKey) return;

      setContributors(cfg.tabKey, cfg.contributors);
      setBuyUrl(cfg.tabKey, cfg.buyUrl);
      setIssueTitle(cfg.tabKey, cfg.title);
      setBuyLabel(cfg.tabKey, cfg.buyLabel);

      if (id === "international" && cfg.stutterImage) {
        var p2 = paneByTab(cfg.tabKey);
        var stImg = p2 && p2.querySelector(".stutter-image");
        if (stImg) stImg.src = cfg.stutterImage;
      }

      if (id === "friendship" && cfg.comparison && cfg.comparison.base && cfg.comparison.overlay) {
        root.style.setProperty("--mar-compare-base", 'url("' + cfg.comparison.base + '")');
        root.style.setProperty("--mar-compare-overlay", 'url("' + cfg.comparison.overlay + '")');
      }

      if (id === "fourth") {
        var letterSrc = cfg.coverLetterSvg || cfg.coverImage;
        if (letterSrc) {
          var p4 = paneByTab(cfg.tabKey);
          var letterImg = p4 && p4.querySelector(".issue-04-letter-img");
          if (letterImg) letterImg.src = letterSrc;
        }
        if (cfg.coverBackground) {
          root.style.setProperty("--mar-issue-04-cover-bg", cfg.coverBackground);
        } else {
          root.style.removeProperty("--mar-issue-04-cover-bg");
        }
      }
    });
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

        document.dispatchEvent(
          new CustomEvent("marinade:tabchange", { detail: { tab: tab } })
        );
      });
    });
  }

  function initStutterCanvas() {
    var canvas = document.querySelector(".html-embed-2 canvas");
    if (!canvas) return;

    /** Original eased trail (0–1). Lower = more “drag”, which is the intended look. */
    var STUTTER_FOLLOW = 0.34;
    var STUTTER_TRAIL_GAP = 36;
    /** ~20% smaller than the original 800×114 stamp. */
    var STAMP_W = 640;
    var STAMP_H = 91;
    /** Full opacity for this long (shared by every stamp on the canvas), then all snap-fade together. */
    var STAMP_HOLD_MS = 2000;
    /** Fade-out duration (ms) — keep short for a snappy exit. */
    var STAMP_FADE_OUT_MS = 380;
    var STAMP_LIFETIME_MS = STAMP_HOLD_MS + STAMP_FADE_OUT_MS;
    /** Hard cap so work per frame stays predictable (longer hold = more stamps possible). */
    var MAX_STAMPS = 120;

    var internationalTabKey =
      issues.international && issues.international.tabKey
        ? issues.international.tabKey
        : "International";

    var stutterLinks = document.querySelectorAll(".stutter-item");
    var goalX = null;
    var goalY = null;
    var mouseX = null;
    var mouseY = null;
    var newImage = null;
    var newWidth = STAMP_W;
    var newHeight = STAMP_H;
    var context;
    var rafId = null;
    var issue02TabActive = false;
    var lastStampX = null;
    var lastStampY = null;
    var logicalW = 0;
    var logicalH = 0;
    /** { x, y } in logical px — opacity is global (see waveStart), so all fade together. */
    var stamps = [];
    /** When the current “wave” of stamps began; all stamps share one fade timeline. */
    var waveStart = null;

    function stampOpacity(ageMs) {
      if (ageMs >= STAMP_LIFETIME_MS) return 0;
      if (ageMs <= STAMP_HOLD_MS) return 1;
      var u = (ageMs - STAMP_HOLD_MS) / STAMP_FADE_OUT_MS;
      if (u >= 1) return 0;
      // Ease-in: stays near full opacity for most of the fade window, then snaps away.
      return 1 - u * u * u;
    }

    function resize() {
      logicalW = window.innerWidth;
      logicalH = window.innerHeight;
      canvas.width = window.innerWidth * 2;
      canvas.height = window.innerHeight * 2;
      canvas.style.width = logicalW + "px";
      canvas.style.height = logicalH + "px";
      context = canvas.getContext("2d", { alpha: true, desynchronized: true });
      if (!context) {
        context = canvas.getContext("2d");
      }
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.scale(2, 2);
    }

    resize();

    function onMouseMove(event) {
      goalX = event.pageX;
      goalY = event.pageY;
      if (mouseX === null) {
        mouseX = event.pageX;
        mouseY = event.pageY;
      }
    }

    var moveListenerOpts = { passive: true };

    function stopIssue02Stutter() {
      issue02TabActive = false;
      document.removeEventListener("mousemove", onMouseMove, moveListenerOpts);
      if (rafId != null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      stamps.length = 0;
      waveStart = null;
      if (context) {
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.scale(2, 2);
      }
      lastStampX = null;
      lastStampY = null;
    }

    function startIssue02Stutter() {
      if (issue02TabActive) return;
      issue02TabActive = true;
      document.addEventListener("mousemove", onMouseMove, moveListenerOpts);
      if (rafId == null) {
        rafId = requestAnimationFrame(stutter);
      }
    }

    document.addEventListener("marinade:tabchange", function (e) {
      var tab = e.detail && e.detail.tab;
      if (tab === internationalTabKey) {
        startIssue02Stutter();
      } else {
        stopIssue02Stutter();
      }
    });

    stutterLinks.forEach(function (link) {
      var imgEl = link.getElementsByTagName("img")[0];
      if (!imgEl) return;
      var imageSource = imgEl.src;
      link.addEventListener("mouseenter", function () {
        var image = document.createElement("img");
        image.src = imageSource;
        image.decoding = "async";
        newImage = image;
        newWidth = STAMP_W;
        newHeight = STAMP_H;
        waveStart = null;
      });
      link.addEventListener("mouseleave", function () {
        newWidth = STAMP_W;
        newHeight = STAMP_H;
        stamps.length = 0;
        waveStart = null;
        if (context) {
          context.setTransform(1, 0, 0, 1, 0, 0);
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.scale(2, 2);
        }
        lastStampX = null;
        lastStampY = null;
      });
    });

    window.addEventListener("resize", resize);

    function stutter() {
      if (!issue02TabActive || !context) {
        rafId = null;
        return;
      }

      var now = performance.now();
      var i;

      if (waveStart != null && now - waveStart >= STAMP_LIFETIME_MS) {
        stamps.length = 0;
        waveStart = null;
      }

      if (mouseX != null) {
        if (goalX != null) {
          mouseX = mouseX + (goalX - mouseX) * STUTTER_FOLLOW;
          mouseY = mouseY + (goalY - mouseY) * STUTTER_FOLLOW;
        }

        if (newImage && newImage.complete) {
          var stamp =
            lastStampX == null ||
            Math.hypot(mouseX - lastStampX, mouseY - lastStampY) >= STUTTER_TRAIL_GAP;
          if (stamp) {
            if (waveStart == null) {
              waveStart = now;
            }
            stamps.push({ x: mouseX, y: mouseY });
            while (stamps.length > MAX_STAMPS) {
              stamps.shift();
            }
            lastStampX = mouseX;
            lastStampY = mouseY;
          }
        }
      }

      context.clearRect(0, 0, logicalW, logicalH);

      if (newImage && newImage.complete && stamps.length && waveStart != null) {
        var layerOp = stampOpacity(now - waveStart);
        if (layerOp > 0.008) {
          context.globalAlpha = layerOp;
          for (i = 0; i < stamps.length; i++) {
            var s = stamps[i];
            context.drawImage(
              newImage,
              s.x - 0.5 * newWidth,
              s.y - 0.5 * newHeight,
              newWidth,
              newHeight
            );
          }
          context.globalAlpha = 1;
        } else {
          stamps.length = 0;
          waveStart = null;
        }
      }

      if (issue02TabActive) {
        rafId = requestAnimationFrame(stutter);
      } else {
        rafId = null;
      }
    }
  }

  /** Issue 04: slow spin + zoom on cover art; pointer tilts / skews the SVG (Fourth tab only). */
  function initIssueFourthLetter() {
    var fourthKey =
      issues.fourth && issues.fourth.tabKey ? issues.fourth.tabKey : "Fourth";
    var tilt = document.querySelector(".issue-04-letter-tilt");
    if (!tilt) return;

    var active = false;
    var rafId = null;
    var targetX = 0;
    var targetY = 0;
    var targetSk = 0;
    var curX = 0;
    var curY = 0;
    var curSk = 0;
    var ease = 0.12;

    function clamp(n, lo, hi) {
      return Math.max(lo, Math.min(hi, n));
    }

    function onPointer(clientX, clientY) {
      var cx = window.innerWidth * 0.5;
      var cy = window.innerHeight * 0.5;
      var nx = (clientX - cx) / (window.innerWidth * 0.5 || 1);
      var ny = (clientY - cy) / (window.innerHeight * 0.5 || 1);
      nx = clamp(nx, -1, 1);
      ny = clamp(ny, -1, 1);
      targetX = ny * -18;
      targetY = nx * 18;
      targetSk = nx * 8;
    }

    function onMove(e) {
      if (!active) return;
      var x = e.clientX;
      var y = e.clientY;
      if (e.touches && e.touches[0]) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      }
      if (typeof x === "number") onPointer(x, y);
    }

    function tick() {
      curX += (targetX - curX) * ease;
      curY += (targetY - curY) * ease;
      curSk += (targetSk - curSk) * ease;
      tilt.style.transform =
        "perspective(1100px) rotateX(" +
        curX.toFixed(2) +
        "deg) rotateY(" +
        curY.toFixed(2) +
        "deg) skewX(" +
        curSk.toFixed(2) +
        "deg)";

      var mag = Math.abs(curX) + Math.abs(curY) + Math.abs(curSk);
      if (!active && mag < 0.2) {
        tilt.style.transform = "";
        rafId = null;
        return;
      }
      rafId = requestAnimationFrame(tick);
    }

    function ensureTick() {
      if (rafId == null) rafId = requestAnimationFrame(tick);
    }

    function start() {
      if (active) return;
      active = true;
      window.addEventListener("mousemove", onMove);
      window.addEventListener("touchmove", onMove, { passive: true });
      ensureTick();
    }

    function stop() {
      active = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      targetX = 0;
      targetY = 0;
      targetSk = 0;
      ensureTick();
    }

    function setFromTab(tab) {
      if (tab === fourthKey) start();
      else stop();
    }

    document.addEventListener("marinade:tabchange", function (e) {
      var tab = e.detail && e.detail.tab;
      setFromTab(tab);
    });

    var initial = document.querySelector(".w-tab-content .w-tab-pane.w--tab-active");
    if (initial) setFromTab(initial.getAttribute("data-w-tab"));
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
    initIssueFourthLetter();
    initComparisonSlider();
  });
})();
