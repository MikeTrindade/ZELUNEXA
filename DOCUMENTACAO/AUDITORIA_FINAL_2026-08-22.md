# Auditoria final — Site Oficial Zelunexa v4

**Data:** 22/08/2026  
**Escopo:** Home, Zelunexa Monitor, Zelunexa Guia, Sobre, Contato, Privacidade, Termos, 404, CSS, JavaScript, imagens, vídeos, SEO técnico inicial, acessibilidade, segurança e preparação para deploy.

## Resultado

A versão v4 foi consolidada a partir do pacote completo v3 e revisada para publicação técnica. As correções abaixo foram aplicadas sem alterar decisões consolidadas de marca ou inventar funcionalidades, integrações, números ou contatos.

## Correções e verificações aplicadas

- Restaurado e validado o pacote completo de assets da v3 antes da auditoria final.
- Validada a existência de todos os arquivos locais referenciados por HTML, CSS e vídeo.
- Corrigida a proporção intrínseca do logo/imagem do Zelunexa Guia utilizada nas páginas.
- Mantido exatamente um `h1` por página e hierarquia sem saltos problemáticos.
- Verificados IDs duplicados e referências ARIA (`aria-controls`/`aria-labelledby`).
- Tornada explícita a associação `label`/campo nos formulários por `for` e `id`.
- Mantidos textos alternativos em imagens informativas e labels nos controles interativos.
- Melhorado o menu móvel: `aria-expanded`, `aria-hidden`, rótulo dinâmico, Escape, clique externo, foco contido e fechamento ao retornar ao desktop.
- Adicionado fallback de navegação móvel para cenário sem JavaScript.
- Links externos com nova aba protegidos por `noopener noreferrer`.
- Links do Portal do Cliente permanecem ocultos enquanto a URL oficial não estiver configurada, evitando CTA quebrado.
- Formulário comercial simplificado: sem checkbox redundante de consentimento; aviso de privacidade transparente; envio só ocorre após confirmação do usuário no WhatsApp.
- Adicionado fallback do formulário sem JavaScript e fallback quando o navegador bloqueia popup.
- Parâmetro `?interesse=monitor|guia|ambas` passa a pré-selecionar corretamente a solução no contato.
- WhatsApp das páginas Monitor e Guia recebe mensagem contextualizada por produto.
- Ajustada a copy do Guia para não prometer integração automática em todos os cenários (`pode transformar` e ressalvas de viabilidade técnica).
- Removida afirmação quantitativa não comprovada sobre frequência de orientações na portaria.
- Mantida a cautela comercial de não publicar preços/limites enquanto os materiais de origem apresentarem divergências.
- Open Graph recebeu dimensões e texto alternativo da imagem social 1200x630.
- Página 404 marcada com `noindex,follow`.
- Aviso de Privacidade e Termos tiveram data e redações técnicas atualizadas, sem fingir que há backend de formulário ou portal integrado no site institucional.
- Manifesto ajustado para comportamento de site (`display: browser`).
- Vídeos continuam com carregamento sob demanda, poster, pausa fora da viewport, controles, `playsinline`, economia de dados e `prefers-reduced-motion`.
- Segundo visual do Hero deixou de competir por `fetchpriority=high`; prioridade ficou concentrada no conteúdo crítico.
- Acrescentados fallbacks `-webkit-mask-image` para compatibilidade visual.
- Removido código/markup de toast que deixou de ser necessário após ocultação segura do Portal.
- Adicionado `vercel.json` com headers de segurança: CSP, HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy e Permissions-Policy.
- Adicionado `.vercelignore` para não publicar prévias e documentação desnecessárias no site público.

## Itens deliberadamente não inventados

- domínio/canonical;
- URL do Portal do Cliente;
- e-mail institucional;
- redes sociais;
- dados definitivos da pessoa jurídica;
- preço e limites comerciais conflitantes;
- integrações não confirmadas;
- métricas de clientes/resultados não comprovadas.

## Validação visual

As prévias desktop e mobile existentes no pacote foram revisadas como referência de composição, contraste, hierarquia, consistência de marca e responsividade. A validação de Core Web Vitals/Lighthouse deve ser repetida no endereço HTTPS real depois do deploy, pois depende do servidor, rede, cache e domínio efetivamente usados.

## Status para deploy

**Pronto para deploy técnico.** A versão pode ser publicada em uma URL temporária da hospedagem para inspeção final. Para publicação definitiva no domínio oficial, concluir as pendências listadas em `PENDENCIAS_ANTES_DA_PUBLICACAO.txt`.
