# Aurora Café — Landing page de portfólio

Landing page demonstrativa de uma cafeteria fictícia, inspirada no protótipo editorial aprovado. Construída **somente com HTML, CSS e JavaScript**, sem Tailwind, React, pacotes, CDN ou backend.

## Visualização

1. Descompacte a pasta `aurora-cafe`.
2. Abra `index.html` no navegador **ou**, para reproduzir um ambiente de hospedagem, use um servidor HTTP local:
   ```sh
   cd aurora-cafe
   python3 -m http.server 8000
   ```
3. Acesse `http://localhost:8000`.

Não é necessário instalar dependências e todas as imagens são carregadas localmente.

## Estrutura

```text
 aurora-cafe/
 ├── index.html
 ├── README.md
 └── arquivos/
     ├── assets/
     │   ├── logo.svg
     │   └── favicon.svg
     ├── img/
     │   ├── referencia-prototipo.webp  # imagem aprovada como referência visual
     │   ├── hero-cafe.webp
     │   ├── banner-croissants.webp
     │   ├── latte-classico.webp
     │   ├── caramelo-gelado.webp
     │   ├── mocha.webp
     │   ├── matcha.webp
     │   ├── croissant.webp
     │   ├── bolo-chocolate.webp
     │   ├── detalhe-cafe.webp
     │   ├── graos.webp
     │   ├── artesanal.webp
     │   └── ambiente-cafe.webp
     ├── css/
     │   └── style.css
     └── js/
         └── script.js
```

A imagem original do protótipo aprovado está em `arquivos/img/referencia-prototipo.webp`, apenas como referência. A página é construída por componentes reais HTML/CSS e não usa uma captura como fundo.

## Funcionalidades

- Layout responsivo, navegação mobile acessível e links internos entre seções.
- Filtros de cardápio em JS (cafés, doces e todos).
- Adicionar/remover itens, alterar quantidades e calcular total em **pedido de demonstração**.
- Seleção persistida apenas no navegador, via `localStorage`.
- Carrinho lateral com fechamento pela tecla `Escape`, retorno de foco e navegação por teclado.
- Animações suaves e respeito à configuração de movimento reduzido.
- Metadados descritivos, títulos semânticos, texto alternativo e imagens otimizadas.

## Avisos importantes

- **A Aurora Café é fictícia** e não representa uma cafeteria real.
- **Não há checkout, pagamentos, API, coleta ou envio de dados pessoais.** O pedido demonstrativo não é enviado a lugar nenhum.
- Preços, nomes dos produtos e história da marca são ilustrativos.
- **As fotografias deste protótipo são imagens digitais geradas para o conceito visual**, não registros de uma cafeteria física. Para um site real, substitua-as por fotografias reais próprias ou devidamente licenciadas e confira os textos.
- Antes de publicar um negócio real, inclua dados comerciais verídicos, política de privacidade se necessário, contatos reais, domínio canônico e dados estruturados apropriados. Não crie avaliações ou endereço fictícios como se fossem reais.

## Personalização

- **Cores, fontes e tamanhos**: altere as variáveis no começo de `arquivos/css/style.css`.
- **Marca**: substitua `arquivos/assets/logo.svg` e `favicon.svg`.
- **Fotos**: troque cada WebP dentro de `arquivos/img` mantendo os nomes, ou atualize os caminhos no HTML/CSS.
- **Produtos/preços**: para manter o carrinho consistente, atualize tanto os cards HTML quanto o objeto `products` em `arquivos/js/script.js` (os preços JS são em centavos).
- **Textos/estrutura/SEO**: modifique `index.html`.

## Hospedagem

É possível publicar como site estático no GitHub Pages, Cloudflare Pages ou Netlify. No GitHub Pages, a raiz do repositório deve conter o `index.html`. Não há processo de build.

## Referência visual

Conceito editorial **Aurora Café** desenvolvido a partir de três referências enviadas e do protótipo visual aprovado. Este código é uma implementação própria da composição, não uma cópia dos layouts de terceiros.
