import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const { SITE_URL = 'http://127.0.0.1:5173' } = loadEnv(mode, process.cwd(), 'SITE_');
  const siteUrl = new URL(SITE_URL);
  if (!['http:', 'https:'].includes(siteUrl.protocol)) {
    throw new Error('SITE_URL должен быть HTTP- или HTTPS-адресом сайта.');
  }
  const baseUrl = siteUrl.href.replace(/\/$/, '');
  return {
    base: './',
    plugins: [
      {
        name: 'verdora-social-metadata',
        transformIndexHtml(html) {
          return html.replaceAll(
            '__SITE_URL__',
            baseUrl.replaceAll('&', '&amp;').replaceAll('"', '&quot;'),
          );
        },
      },
    ],
    server: { port: 5173, strictPort: true },
    preview: { port: 4173, strictPort: true },
  };
});
