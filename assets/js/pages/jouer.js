/** Page Jouer : empreinte et taille de l'archive, lues depuis le build. */
import { url } from '../site.js';

try {
  const r = await fetch(url('data/niveaux.json'));
  if (r.ok) {
    const { archive } = await r.json();
    const emp = document.getElementById('empreinte');
    if (emp) emp.textContent = archive.sha256;
    const taille = document.getElementById('taille-archive');
    if (taille) taille.textContent = `${Math.round(archive.octets / 1024)} Ko`;
  }
} catch {
  /* page ouverte hors du site construit */
}
