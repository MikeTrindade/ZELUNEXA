# Alterações V7 — 24/08/2026

## Ajustes realizados
- Reduzido o vídeo do hero da home para uma escala mais proporcional, mantendo integração visual com o site e eliminando a sensação de quadro de player destacado.
- Integrados 2 novos vídeos nativos em outras partes do site:
  - `assets/video/zelunexa-motion-monitor.mp4` na página `monitor.html`
  - `assets/video/zelunexa-motion-guia.mp4` na página `guia.html`
- Gerados posters correspondentes para carregamento inicial mais suave.
- Habilitado o botão **Área do Cliente** em todo o site.
- Criada a página interna `area-do-cliente.html` como destino provisório do botão, já pronta para substituição futura pela URL oficial do portal externo.

## Observações
- O vídeo `zelunexa-motion-monitor.mp4` recebeu tratamento visual via CSS para manter melhor integração e reduzir destaque do watermark original no canto inferior direito.
- Caso a URL oficial do portal do cliente seja definida, basta substituir `CONFIG.portalUrl` em `assets/js/main.js`.
