/**
 * Jeu d'icônes SVG inline (trait 1.8, 24×24, couleur courante). Aucune police d'icônes, aucun emoji.
 * Usage : icon('lock') → chaîne SVG ; dans le HTML statique : <span data-icon="lock"></span>.
 */
const PATHS = {
  usb: '<rect x="6" y="9" width="12" height="12" rx="2"/><path d="M9 9V5h6v4M10 3h4"/>',
  package: '<path d="M21 16V8l-9-5-9 5v8l9 5 9-5z"/><path d="M3.3 7.5 12 12l8.7-4.5M12 22V12"/>',
  radio: '<circle cx="12" cy="12" r="2"/><path d="M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4M19 5a10 10 0 0 1 0 14M5 19A10 10 0 0 1 5 5"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  toolbox: '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M8 8V5h8v3M3 13h18"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
  award: '<circle cx="12" cy="9" r="5"/><path d="M9 13.5 8 21l4-2 4 2-1-7.5"/>',
  infinity: '<path d="M6.5 9.5c-3 0-3 5 0 5 3 0 4-2.5 5.5-2.5S14.5 14.5 17.5 14.5s3-5 0-5c-3 0-4 2.5-5.5 2.5S9.5 9.5 6.5 9.5z"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  zap: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6"/>',
  refresh: '<path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5"/>',
  message: '<path d="M21 12a8 8 0 0 1-11.6 7.2L4 21l1.8-5.4A8 8 0 1 1 21 12z"/>',
  hash: '<path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4.5-6.2"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>',
  edit: '<path d="M4 20h4l10-10-4-4L4 16zM13 7l4 4"/>',
  paperclip: '<path d="M21 11.5 12.5 20a5 5 0 0 1-7-7l9-9a3.5 3.5 0 0 1 5 5l-9 9a2 2 0 0 1-3-3l8-8"/>',
  flame: '<path d="M12 3s5 4 5 9.5a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3 1-6 1-8z"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
  alert: '<path d="M12 3 2 21h20zM12 10v5M12 18v.5"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5zM3 13l9 5 9-5M3 17l9 5 9-5"/>',
};

export function icon(name, size = 20) {
  const body = PATHS[name];
  if (!body) return '';
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
}

/** Remplit chaque élément portant data-icon="nom" (idempotent). */
export function applyIcons(root = document) {
  for (const el of root.querySelectorAll('[data-icon]')) {
    if (el.dataset.iconDone) continue;
    el.innerHTML = icon(el.dataset.icon, Number(el.dataset.iconSize) || 20);
    el.dataset.iconDone = '1';
  }
}
