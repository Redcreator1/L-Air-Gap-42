/**
 * Rendu Markdown minimaliste, sans dépendance ni CDN (l'espace membre fonctionne hors-ligne).
 * Supporte : titres, paragraphes, gras/italique/code, liens, listes (à puces, numérotées,
 * cases à cocher), citations, blocs de code, tableaux, séparateurs, et blocs :::type Titre ... :::
 * Tout le texte est échappé : le HTML brut n'est jamais interprété.
 */
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function slugify(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function inline(text) {
  let s = esc(text);
  s = s.replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`);
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*\w])\*([^*\n]+)\*(?!\w)/g, '$1<em>$2</em>');
  s = s.replace(/_([^_\n]+)_(?!\w)/g, '<em>$1</em>');
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+|#[^)\s]*|\.{0,2}\/[^)\s]*)\)/g, (_, t, u) => {
    const ext = /^https?:/.test(u) ? ' target="_blank" rel="noopener"' : '';
    return `<a href="${u}"${ext}>${t}</a>`;
  });
  return s;
}

export function renderMarkdown(src) {
  const lines = src.replace(/\r\n?/g, '\n').split('\n');
  const out = [];
  let i = 0;
  const peek = () => lines[i];

  const flushList = (ordered) => {
    const items = [];
    const re = ordered ? /^\s*\d+[.)]\s+(.*)$/ : /^\s*[-*+]\s+(.*)$/;
    while (i < lines.length && re.test(peek())) {
      let body = peek().match(re)[1];
      i++;
      // continuation indentée
      while (i < lines.length && /^\s{2,}\S/.test(peek()) && !re.test(peek())) body += ' ' + peek().trim(), i++;
      const task = body.match(/^\[( |x|X)\]\s+(.*)$/);
      if (task) body = `<input type="checkbox" disabled ${task[1] !== ' ' ? 'checked' : ''}> ${inline(task[2])}`;
      else body = inline(body);
      items.push(`<li>${body}</li>`);
    }
    out.push(`<${ordered ? 'ol' : 'ul'}>${items.join('')}</${ordered ? 'ol' : 'ul'}>`);
  };

  while (i < lines.length) {
    const line = peek();
    if (!line.trim()) {
      i++;
      continue;
    }
    // Bloc de code
    let m = line.match(/^```(\w*)\s*$/);
    if (m) {
      const lang = m[1];
      i++;
      const buf = [];
      while (i < lines.length && !/^```\s*$/.test(peek())) buf.push(lines[i++]);
      i++;
      out.push(`<pre><code class="lang-${esc(lang)}">${esc(buf.join('\n'))}</code></pre>`);
      continue;
    }
    // Callout :::type Titre
    m = line.match(/^:::(\w+)\s*(.*)$/);
    if (m) {
      i++;
      const buf = [];
      while (i < lines.length && !/^:::\s*$/.test(peek())) buf.push(lines[i++]);
      i++;
      out.push(`<div class="callout callout-${esc(m[1])}"><div class="callout-title">${esc(m[2] || m[1])}</div>${renderMarkdown(buf.join('\n'))}</div>`);
      continue;
    }
    // Titres
    m = line.match(/^(#{1,4})\s+(.*)$/);
    if (m) {
      const lvl = Math.min(Math.max(m[1].length, 2), 4); // # et ## → h2, ### → h3 (h1 réservé au titre de leçon)
      out.push(`<h${lvl} id="${slugify(m[2])}">${inline(m[2])}</h${lvl}>`);
      i++;
      continue;
    }
    if (/^(-{3,}|\*{3,})\s*$/.test(line)) {
      out.push('<hr>');
      i++;
      continue;
    }
    if (/^\s*>/.test(line)) {
      const buf = [];
      while (i < lines.length && /^\s*>/.test(peek())) buf.push(lines[i++].replace(/^\s*>\s?/, ''));
      out.push(`<blockquote>${renderMarkdown(buf.join('\n'))}</blockquote>`);
      continue;
    }
    if (/^\s*[-*+]\s+/.test(line)) {
      flushList(false);
      continue;
    }
    if (/^\s*\d+[.)]\s+/.test(line)) {
      flushList(true);
      continue;
    }
    // Tableau
    if (/^\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\|?\s*:?-{2,}/.test(lines[i + 1])) {
      const cells = (l) =>
        l
          .trim()
          .replace(/^\||\|$/g, '')
          .split('|')
          .map((c) => inline(c.trim()));
      const head = cells(line);
      i += 2;
      const rows = [];
      while (i < lines.length && /^\|.*\|\s*$/.test(peek())) rows.push(cells(lines[i++]));
      out.push(
        `<table><thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows
          .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`)
          .join('')}</tbody></table>`,
      );
      continue;
    }
    // Paragraphe
    const buf = [];
    while (i < lines.length && peek().trim() && !/^(#{1,4}\s|```|:::|\s*>|\s*[-*+]\s|\s*\d+[.)]\s|\|)/.test(peek())) buf.push(lines[i++].trim());
    if (buf.length) out.push(`<p>${inline(buf.join(' '))}</p>`);
    else i++;
  }
  return out.join('\n');
}
