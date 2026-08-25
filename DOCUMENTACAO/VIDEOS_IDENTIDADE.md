# Vídeos de identidade Zelunexa

Foram integrados dois vídeos institucionais fornecidos em MP4 e convertidos para versões mais adequadas à web.

## Uso atual no site — V5

- `assets/video/zelunexa-motion-institucional.mp4`
  - Origem: `VIDEO .mp4`
  - Uso: **Hero da Home**, como primeiro impacto visual da marca
  - Versão web: 960x540, 24 fps, H.264
  - Reprodução: automática, silenciosa, em loop, sem controles aparentes

- `assets/video/zelunexa-motion-home.mp4`
  - Origem: `VIDEO  (2).mp4`
  - Uso: página **Sobre**, como reforço institucional
  - Versão web: 1280x720, 30 fps, H.264
  - Reprodução: silenciosa, automática quando a seção entra em visualização, sem controles aparentes

## Performance e acessibilidade

O vídeo do Hero é carregado imediatamente porque faz parte da experiência de entrada do site. O vídeo da página Sobre é hidratado sob demanda para reduzir transferência desnecessária.

O autoplay é obrigatoriamente `muted`, requisito dos navegadores modernos para reprodução automática confiável. Não há botões visíveis de pausa, som, barra de progresso ou interface de player.

Quando o visitante utiliza `prefers-reduced-motion`, o Hero exibe o poster estático em vez da animação. O segundo vídeo não recebe autoplay nesse modo.

Os arquivos originais de aproximadamente 81 MB e 155 MB não fazem parte do pacote de publicação; o site usa apenas as versões otimizadas.
