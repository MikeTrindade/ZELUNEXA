# Zelunexa — Site Oficial V5

Pacote final do site institucional e comercial da Zelunexa, revisado após a integração do vídeo de identidade no Hero e a consolidação do indicador público de economia operacional.

## Como visualizar

Abra `index.html` em um navegador moderno. Para testar rotas e recursos em um servidor local, execute na raiz da pasta:

```bash
python -m http.server 8080
```

Depois acesse `http://localhost:8080`.

## Estrutura principal

- `index.html` — Home comercial
- `monitor.html` — Zelunexa Monitor
- `guia.html` — Zelunexa Guia
- `sobre.html` — empresa e fundadores
- `contato.html` — contato e solicitação de apresentação
- `privacidade.html` — Aviso de Privacidade
- `termos.html` — Termos de Uso
- `404.html` — página de erro
- `assets/css/` — estilos
- `assets/js/` — interações e formulário
- `assets/img/` — logos, imagens, telas e ícones
- `assets/video/` — vídeos otimizados e posters
- `DOCUMENTACAO/` — auditoria, vídeos e pendências
- `vercel.json` — cabeçalhos de segurança para deploy na Vercel
- `.vercelignore` — itens de documentação/prévia excluídos do deploy
- `manifest.webmanifest` — manifesto do site
- `robots.txt` — regras iniciais de indexação
- `sitemap.template.xml` — modelo para o sitemap após definição do domínio

## Formulário comercial

O formulário não envia dados silenciosamente a um servidor e não grava os campos em banco de dados próprio. Ele organiza a solicitação e abre o WhatsApp; o usuário confirma o envio no próprio WhatsApp. Há fallback sem JavaScript por link direto.

## Portal do Cliente

Os links de Portal do Cliente ficam ocultos enquanto `CONFIG.portalUrl` estiver vazio em `assets/js/main.js`. Isso evita um botão quebrado em produção. Assim que a URL oficial existir, basta configurá-la e o site habilita os links automaticamente.

## SEO e domínio

O pacote possui títulos, descrições, Open Graph, dados estruturados e robots. Canonical, `og:url`, URLs absolutas dos dados estruturados e `sitemap.xml` devem ser finalizados quando o domínio oficial estiver definido. Não foi inventada uma URL provisória como endereço canônico.

## Vídeos

Os dois MP4 originais foram convertidos para versões adequadas à web. O vídeo principal da Home carrega no Hero para produzir impacto imediato; o segundo vídeo permanece com carregamento sob demanda na página Sobre. Ambos respeitam `prefers-reduced-motion`. Consulte `DOCUMENTACAO/VIDEOS_IDENTIDADE.md`.

## Auditoria

Consulte `DOCUMENTACAO/AUDITORIA_FINAL_2026-08-22.md` para o registro das verificações e correções aplicadas.


## Atualização V5 — 22/08/2026

- A Home agora utiliza o vídeo de movimentação da identidade visual já na primeira dobra, como elemento de impacto tecnológico.
- O vídeo é reproduzido automaticamente sem som, em loop, sem botões, barra ou aparência de player.
- A página Sobre mantém o segundo vídeo como reforço institucional, também sem controles aparentes.
- O case público não expõe mais os valores monetários de custo técnico; o terceiro indicador passou a ser um gráfico circular de **70% de economia operacional**.

## V6 — vídeos integrados ao layout
A Home e a página Sobre usam as animações como parte da própria composição visual. Não há moldura, controles, barra de player ou botões de som/pausa; as bordas são dissolvidas no fundo para evitar aparência de vídeo incorporado.


## Área do Cliente

Nesta versão, o botão de Área do Cliente já está habilitado e aponta temporariamente para `area-do-cliente.html`, uma página interna preparada para servir como ponte até a URL definitiva do portal externo.
