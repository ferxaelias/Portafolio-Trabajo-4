(function () {
  'use strict';

  var PHONE_DISPLAY = '+503 7255 8351';
  var MENU_QUERY = window.matchMedia('(max-width: 859px)');

  /* ---------- Menú móvil ---------- */
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('site-nav');

  function setMenu(open, returnFocus) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    nav.classList.toggle('is-open', open);
    if (!open && returnFocus) toggle.focus();
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false, true);
      }
    });
    document.addEventListener('click', function (e) {
      if (toggle.getAttribute('aria-expanded') === 'true' && !nav.contains(e.target) && !toggle.contains(e.target)) {
        setMenu(false);
      }
    });
    var onViewport = function () { if (!MENU_QUERY.matches) setMenu(false); };
    if (MENU_QUERY.addEventListener) MENU_QUERY.addEventListener('change', onViewport);
    else if (MENU_QUERY.addListener) MENU_QUERY.addListener(onViewport);
  }

  /* ---------- Enlace activo ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));
  var sectionIds = ['inicio', 'habilidades', 'proyectos', 'formacion', 'contacto'];
  var sections = sectionIds.map(function (id) { return document.getElementById(id); }).filter(Boolean);

  function setActive(id) {
    navLinks.forEach(function (a) {
      if (a.getAttribute('data-nav') === id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  function updateActive() {
    var line = window.innerHeight * 0.35;
    var current = sections[0] && sections[0].id;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top <= line) current = sections[i].id;
    }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4 && sections.length) {
      current = sections[sections.length - 1].id;
    }
    setActive(current);
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { ticking = false; updateActive(); });
  }, { passive: true });
  window.addEventListener('resize', updateActive);
  updateActive();

  /* ---------- Pestañas ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('#skills-tabs [role="tab"]'));

  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
    if (focus) tab.focus();
  }

  if (tabs.length) {
    var initial = tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0];
    selectTab(initial, false);
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { selectTab(tab, false); });
      tab.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = tabs[(i + 1) % tabs.length];
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === 'Home') next = tabs[0];
        else if (e.key === 'End') next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); selectTab(next, true); }
      });
    });
  }

  /* ---------- Diálogo "Sobre mí" ---------- */
  var dialog = document.getElementById('about-dialog');
  var openBtn = document.getElementById('about-open');
  var lastFocus = null;

  function closeDialog() {
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
    restoreFocus();
  }
  function restoreFocus() {
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
    lastFocus = null;
  }

  if (dialog && openBtn) {
    openBtn.addEventListener('click', function () {
      lastFocus = openBtn;
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    });
    ['about-close', 'about-close-2'].forEach(function (id) {
      var b = document.getElementById(id);
      if (b) b.addEventListener('click', closeDialog);
    });
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) closeDialog();
    });
    dialog.addEventListener('close', restoreFocus);
    dialog.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && typeof dialog.showModal !== 'function') closeDialog();
    });
  }

  /* ---------- Copiar teléfono ---------- */
  var copyBtn = document.getElementById('copy-btn');
  var phoneLink = document.getElementById('phone-link');
  var statusEl = document.getElementById('copy-status');
  var fallback = document.getElementById('copy-fallback');
  var fallbackInput = document.getElementById('copy-input');
  var statusTimer = null;
  var copyLabel = copyBtn ? copyBtn.querySelector('.copy-label') : null;

  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.setAttribute('aria-hidden', 'true');
    ta.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none';
    document.body.appendChild(ta);
    var active = document.activeElement;
    ta.select();
    ta.setSelectionRange(0, text.length);
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
    document.body.removeChild(ta);
    if (active && typeof active.focus === 'function') { try { active.focus({ preventScroll: true }); } catch (e2) { active.focus(); } }
    return ok;
  }

  function onCopied() {
    if (fallback) fallback.hidden = true;
    if (statusEl) {
      statusEl.textContent = '';
      window.setTimeout(function () { statusEl.textContent = 'Número copiado: ' + PHONE_DISPLAY; }, 30);
    }
    if (copyBtn) {
      copyBtn.classList.add('is-done');
      if (copyLabel) copyLabel.textContent = 'Copiado';
    }
    window.clearTimeout(statusTimer);
    statusTimer = window.setTimeout(function () {
      if (statusEl) statusEl.textContent = '';
      if (copyBtn) copyBtn.classList.remove('is-done');
      if (copyLabel) copyLabel.textContent = 'Copiar';
    }, 4000);
  }

  function onCopyBlocked() {
    if (statusEl) statusEl.textContent = '';
    if (copyBtn) copyBtn.classList.remove('is-done');
    if (copyLabel) copyLabel.textContent = 'Copiar';
    if (fallback && fallbackInput) {
      fallback.hidden = false;
      fallbackInput.focus({ preventScroll: true });
      fallbackInput.select();
    }
  }

  function copyPhone() {
    var done = false;
    function finish(ok) {
      if (done) return;
      done = true;
      if (ok) onCopied(); else onCopyBlocked();
    }
    if (navigator.clipboard && window.isSecureContext && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(PHONE_DISPLAY).then(function () { finish(true); }, function () { finish(legacyCopy(PHONE_DISPLAY)); });
    } else {
      finish(legacyCopy(PHONE_DISPLAY));
    }
  }

  if (copyBtn) copyBtn.addEventListener('click', copyPhone);
  if (phoneLink) phoneLink.addEventListener('click', copyPhone);
})();
