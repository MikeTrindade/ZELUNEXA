from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse
import sys

ROOT = Path(__file__).resolve().parents[1]
HTML_FILES = sorted(ROOT.glob('*.html'))
IGNORE_PREFIXES = ('http://', 'https://', 'mailto:', 'tel:', 'javascript:', '#', 'data:')


class PageAudit(HTMLParser):
    def __init__(self, path: Path):
        super().__init__(convert_charrefs=True)
        self.path = path
        self.title = ''
        self._in_title = False
        self.meta_description = False
        self.viewport = False
        self.canonical = False
        self.ids: list[str] = []
        self.refs: list[tuple[str, str]] = []
        self.images_without_alt: list[str] = []

    def handle_starttag(self, tag: str, attrs):
        attrs = dict(attrs)
        if tag == 'title':
            self._in_title = True
        if tag == 'meta':
            if attrs.get('name') == 'description' and attrs.get('content', '').strip():
                self.meta_description = True
            if attrs.get('name') == 'viewport' and attrs.get('content', '').strip():
                self.viewport = True
        if tag == 'link' and attrs.get('rel') == 'canonical' and attrs.get('href', '').strip():
            self.canonical = True
        if attrs.get('id'):
            self.ids.append(attrs['id'])
        for attr in ('href', 'src', 'poster'):
            value = attrs.get(attr)
            if value:
                self.refs.append((attr, value.strip()))
        if tag == 'img' and 'alt' not in attrs:
            self.images_without_alt.append(attrs.get('src', '<img sem src>'))

    def handle_endtag(self, tag: str):
        if tag == 'title':
            self._in_title = False

    def handle_data(self, data: str):
        if self._in_title:
            self.title += data


def local_target_exists(page: Path, value: str) -> bool:
    if not value or value.startswith(IGNORE_PREFIXES):
        return True
    parsed = urlparse(value)
    if parsed.scheme or parsed.netloc:
        return True
    clean = parsed.path
    if not clean:
        return True
    target = (page.parent / clean).resolve()
    try:
        target.relative_to(ROOT.resolve())
    except ValueError:
        return False
    return target.exists()


def main() -> int:
    errors: list[str] = []
    warnings: list[str] = []

    if not HTML_FILES:
        errors.append('Nenhum arquivo HTML encontrado na raiz do projeto.')

    for path in HTML_FILES:
        parser = PageAudit(path)
        parser.feed(path.read_text(encoding='utf-8'))

        if not parser.title.strip():
            errors.append(f'{path.name}: <title> ausente ou vazio.')
        if not parser.meta_description:
            errors.append(f'{path.name}: meta description ausente.')
        if not parser.viewport:
            errors.append(f'{path.name}: meta viewport ausente.')
        if path.name != '404.html' and not parser.canonical:
            errors.append(f'{path.name}: canonical ausente.')

        duplicates = sorted({item for item in parser.ids if parser.ids.count(item) > 1})
        if duplicates:
            errors.append(f"{path.name}: IDs duplicados: {', '.join(duplicates)}")

        for src in parser.images_without_alt:
            warnings.append(f'{path.name}: imagem sem alt: {src}')

        for attr, value in parser.refs:
            if not local_target_exists(path, value):
                errors.append(f'{path.name}: referência local inexistente em {attr}="{value}"')

    required = ['robots.txt', 'sitemap.xml', 'manifest.webmanifest', 'vercel.json']
    for filename in required:
        if not (ROOT / filename).exists():
            errors.append(f'Arquivo obrigatório ausente: {filename}')

    print(f'Auditados {len(HTML_FILES)} arquivos HTML.')
    for warning in warnings:
        print(f'AVISO: {warning}')
    if errors:
        for error in errors:
            print(f'ERRO: {error}', file=sys.stderr)
        print(f'Falha: {len(errors)} erro(s) encontrado(s).', file=sys.stderr)
        return 1

    print('OK: estrutura HTML, metadados e referências locais validados.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
