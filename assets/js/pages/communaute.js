/** Page Communauté : widget Discord si un identifiant de serveur est configuré. */
import { config } from '../site.js';

if (config.community.discordServerId) {
  const host = document.getElementById('discord-widget-host');
  const f = document.createElement('iframe');
  f.src = `https://discord.com/widget?id=${encodeURIComponent(config.community.discordServerId)}&theme=dark`;
  f.title = 'Serveur Discord';
  f.width = '100%';
  f.height = '400';
  f.loading = 'lazy';
  f.setAttribute('sandbox', 'allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts');
  f.className = 'discord-widget';
  host.appendChild(f);
}
