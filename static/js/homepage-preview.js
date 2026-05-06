/**
 * Homepage Terminal Preview — Theme Switcher
 * Renders an interactive terminal mock with 6 switchable glass themes.
 */
(function () {
'use strict';

var HP = {
  'relay-dark': {
    win:  { bg: '#0c0c0f', chrome: '#111115', border: '#1e1e26', tab: '#0a0a0d' },
    term: { bg: '#0a0a0d', fg: '#e2e2ea', path: '#5d8bff', acc: '#4af09a', out: '#6a6a80', cursor: '#4af09a' },
    aurora: 'rgba(74,240,154,0.14)',
    font: "'Geist Mono','JetBrains Mono',monospace"
  },
  'midnight': {
    win:  { bg: '#070810', chrome: '#0c0e1a', border: '#191d35', tab: '#060711' },
    term: { bg: '#060711', fg: '#dde2f5', path: '#7ba7ff', acc: '#6c8fff', out: '#5a6080', cursor: '#6c8fff' },
    aurora: 'rgba(108,143,255,0.14)',
    font: "'Geist Mono','JetBrains Mono',monospace"
  },
  'aurora': {
    win:  { bg: '#08080e', chrome: '#0f0d18', border: '#211a33', tab: '#07060d' },
    term: { bg: '#07060d', fg: '#e8e0f5', path: '#d49fff', acc: '#c084fc', out: '#6b5a80', cursor: '#c084fc' },
    aurora: 'rgba(192,132,252,0.14)',
    font: "'Geist Mono','JetBrains Mono',monospace"
  },
  'obsidian': {
    win:  { bg: '#0d0d0d', chrome: '#141414', border: '#222222', tab: '#0a0a0a' },
    term: { bg: '#0a0a0a', fg: '#e8e8e8', path: '#83a598', acc: '#f59e0b', out: '#666666', cursor: '#f59e0b' },
    aurora: 'rgba(245,158,11,0.12)',
    font: "'IBM Plex Mono','Geist Mono',monospace"
  },
  'sunset': {
    win:  { bg: '#0f0a09', chrome: '#18100e', border: '#2e1a16', tab: '#0c0807' },
    term: { bg: '#0c0807', fg: '#f0e8e6', path: '#ff9c8a', acc: '#ff6b6b', out: '#7a5a55', cursor: '#ff6b6b' },
    aurora: 'rgba(255,107,107,0.14)',
    font: "'Geist Mono','JetBrains Mono',monospace"
  },
  'arctic': {
    win:  { bg: '#01050a', chrome: '#050d17', border: '#0d1f33', tab: '#030810' },
    term: { bg: '#030810', fg: '#d8eeff', path: '#81c8ff', acc: '#67e8f9', out: '#4a6a80', cursor: '#67e8f9' },
    aurora: 'rgba(103,232,249,0.12)',
    font: "'Space Mono','Geist Mono',monospace"
  }
};

// DOM refs
var elWin       = document.getElementById('hpWin');
var elChrome    = document.getElementById('hpChrome');
var elSbar      = document.getElementById('hpSidebar');
var elPaneBadge = document.getElementById('hpPaneBadge');
var elTabActive = document.getElementById('hpTabActive');
var elTerm      = document.getElementById('hpTerm');
var elAurora    = document.getElementById('hpAurora');
var elInfoPanel = document.getElementById('hpInfoPanel');
var elInfoPane  = document.getElementById('hpInfoPane');

if (!elWin) return;

function span(text, color) {
  var s = document.createElement('span');
  s.textContent = text;
  if (color) s.style.color = color;
  return s;
}

function buildTermLines(t) {
  var frag = document.createDocumentFragment();
  var lines = [
    { type: 'prompt', path: '~', cmd: 'ls -l' },
    { type: 'out', text: 'total 256' },
    { type: 'out', text: 'drwxr-xr-x  10 dev  staff   320 Jun  4  2025 ' },
    { type: 'dir', text: 'Applications' },
    { type: 'out', text: 'drwxr-xr-x   5 dev  staff   160 Mar  3 16:02 ' },
    { type: 'dir', text: 'Projects' },
    { type: 'out', text: 'drwxr-xr-x  80 dev  staff  2560 Mar 27 12:44 ' },
    { type: 'hl', text: 'WebDev' },
    { type: 'out', text: 'drwxr-xr-x  15 dev  staff   480 Apr  3 15:05 ' },
    { type: 'dir', text: 'dotfiles' },
    { type: 'prompt', path: '~', cmd: 'cd webdev/notethecode' },
    { type: 'prompt-active', path: '~/webdev/notethecode' },
  ];
  lines.forEach(function (l) {
    var row = document.createElement('div');
    row.className = 'term-line';
    if (l.type === 'prompt') {
      row.appendChild(span('[', t.term.out));
      row.appendChild(span(l.path, t.term.path));
      row.appendChild(span(']', t.term.out));
      row.appendChild(span(' > ', t.term.fg));
      row.appendChild(span(l.cmd, t.term.fg));
    } else if (l.type === 'prompt-active') {
      row.appendChild(span('[', t.term.out));
      row.appendChild(span(l.path, t.term.path));
      row.appendChild(span(']', t.term.out));
      row.appendChild(span(' > ', t.term.fg));
      var cur = span('\u2588', t.term.cursor);
      cur.style.animation = 'blink 1.1s step-end infinite';
      row.appendChild(cur);
    } else if (l.type === 'out') {
      row.style.color = t.term.out;
      row.textContent = l.text;
    } else if (l.type === 'dir') {
      row.style.color = t.term.path;
      row.style.fontWeight = '600';
      row.textContent = l.text;
    } else if (l.type === 'hl') {
      row.style.color = '#0a0a0d';
      row.style.background = '#ffbd2e';
      row.style.display = 'inline';
      row.style.padding = '0 2px';
      row.textContent = l.text;
    }
    frag.appendChild(row);
  });
  return frag;
}

function applyHP(id) {
  var t = HP[id];
  if (!t) return;

  elWin.style.background             = t.win.bg;
  elWin.style.borderColor            = t.win.border;
  elChrome.style.background          = t.win.chrome;
  elChrome.style.borderBottomColor   = t.win.border + '66';

  elSbar.style.background            = t.win.chrome + 'aa';
  elSbar.style.borderRightColor      = t.win.border;
  elTabActive.style.color            = t.term.acc;
  elTabActive.style.background       = t.term.acc + '18';

  elPaneBadge.style.color            = t.term.acc;
  elPaneBadge.style.background       = t.term.acc + '18';
  elPaneBadge.style.borderColor      = t.term.acc + '44';

  elInfoPanel.style.borderLeftColor  = t.win.border;
  elInfoPane.style.background        = t.term.acc + '12';
  elInfoPane.style.borderColor       = t.term.acc + '33';
  elInfoPanel.style.setProperty('--theme-acc', t.term.acc);

  elAurora.style.background =
    'radial-gradient(ellipse at 50% 40%, ' + t.aurora + ' 0%, transparent 65%)';

  elTerm.style.background  = t.term.bg;
  elTerm.style.fontFamily  = t.font;
  elTerm.style.color       = t.term.fg;
  elTerm.style.transition  = 'opacity .14s';

  while (elTerm.firstChild) elTerm.removeChild(elTerm.firstChild);
  elTerm.appendChild(buildTermLines(t));

  document.querySelectorAll('.hp-chip[data-theme]').forEach(function (c) {
    c.classList.toggle('hp-chip--active', c.dataset.theme === id);
  });
}

// Chip click handlers
document.querySelectorAll('.hp-chip[data-theme]').forEach(function (chip) {
  chip.addEventListener('click', function () {
    elTerm.style.opacity = '0';
    elWin.style.transition = 'background .28s, border-color .28s';
    setTimeout(function () {
      applyHP(chip.dataset.theme);
      elTerm.style.opacity = '1';
    }, 140);
  });
});

// Init
applyHP('relay-dark');

}());
