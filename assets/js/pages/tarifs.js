/** Page Tarifs : compte à rebours compact dans la pastille d'en-tête. */
import { config } from '../site.js';

const el = document.getElementById('cd-inline');
const end = new Date(config.cohort.closesAt).getTime();
const tick = () => {
  const d = Math.max(0, end - Date.now());
  el.textContent = d ? `${Math.floor(d / 864e5)} j ${Math.floor((d / 36e5) % 24)} h ${Math.floor((d / 6e4) % 60)} min` : 'closes';
};
tick();
setInterval(tick, 30_000);
