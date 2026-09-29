# Instituto Raiz Viva

Plataforma web institucional de uma ONG fictícia de reflorestamento urbano e
educação ambiental, desenvolvida na disciplina de Desenvolvimento Front-End:

- **Experiência Prática I** — estrutura em HTML5 semântico e formulário com validações.
- **Experiência Prática II** — estilização com CSS3, a partir de um design system em variáveis CSS.

## Estrutura de diretórios

```
instituto-raiz-viva/
├── index.html              Página inicial: apresentação, missão, atuação e contato
├── projetos.html           Quatro projetos sociais com ficha técnica
├── cadastro.html           Formulário de doadores e voluntários
├── README.md
└── assets/
    ├── css/
    │   └── style.css       Folha de estilo única, com o design system no :root
    ├── js/
    │   └── mascaras.js     Máscaras de CPF, telefone e CEP + validações
    └── img/
        ├── favicon.ico                   Ícone do navegador, 32x32
        ├── logo-raiz-viva.png            Logotipo, 112x112 (exibido em 56x56)
        ├── mutirao-plantio.webp / .jpg   Página inicial
        ├── projeto-rua-arborizada.webp / .jpg
        ├── projeto-viveiro.webp / .jpg
        ├── projeto-calcada-fresca.webp / .jpg
        └── projeto-cuidadores.webp / .jpg
```

## Tags semânticas utilizadas

`header`, `nav`, `main`, `section`, `article`, `aside`, `figure`, `figcaption`,
`picture`, `address`, `time`, `dl`/`dt`/`dd`, `form`, `fieldset`, `legend`,
`label`, `footer`.

## Hierarquia de títulos

- `h1` — um por página, dentro do `header`, identificando o documento.
- `h2` — cada `section` e `aside` do `main`.
- `h3` — blocos internos: cada projeto (`article`) e cada card de atuação.

Nenhum nível é pulado. A escolha é semântica; o tamanho da fonte fica no CSS.

## Design system

Todas as decisões visuais ficam em variáveis CSS no `:root` de
`assets/css/style.css`. Fora delas, as regras não usam cor, tamanho de fonte ou
espaçamento com valor fixo; os únicos valores soltos são larguras de layout
(`max-width`, `minmax`).

### Cores

| Grupo | Variável | Valor | Uso |
|---|---|---|---|
| Primária | `--folha` | `#2e6b4f` | Bordas de destaque, hover de links, marcadores |
| Primária | `--folha-forte` | `#1d4733` | Cabeçalho, bloco de apoio, links, foco em fundo claro |
| Primária | `--folha-clara` | `#e3f0e6` | Fundo da mensagem de sucesso |
| Secundária | `--sinal` | `#d98b0a` | Botão principal, item ativo do menu, foco em fundo escuro |
| Secundária | `--sinal-forte` | `#c47c08` | Hover do botão principal |
| Neutra | `--tinta` | `#16241b` | Texto principal, rodapé |
| Neutra | `--tinta-fraca` | `#4b5b50` | Texto secundário, legendas |
| Neutra | `--papel` | `#f2f4ef` | Fundo da página |
| Neutra | `--papel-alto` | `#ffffff` | Fundo de cartões e formulários |
| Neutra | `--papel-suave` | `#c6d8cb` | Texto claro sobre fundo escuro |
| Neutra | `--borda` | `#d3dacd` | Divisórias decorativas |
| Neutra | `--borda-campo` | `#75827a` | Contorno dos campos do formulário |
| Feedback | `--erro` | `#a32c1c` | Texto e borda de erro |
| Feedback | `--erro-claro` | `#fbeae7` | Fundo de erro |

A variável `--foco` define a cor do contorno de foco. Vale `--folha-forte` por
padrão e é redefinida como `--sinal` no cabeçalho, no bloco de apoio e no rodapé.

### Tipografia

Fraunces (serifada) nos títulos e Public Sans no texto, com escala de razão
aproximada de 1,25:

| Variável | Valor | Uso |
|---|---|---|
| `--tamanho-pequeno` | `0.875rem` (14px) | Legendas, textos de ajuda, rótulos de dados |
| `--tamanho-base` | `1rem` (16px) | Texto corrido, campos, botões |
| `--tamanho-medio` | `1.25rem` (20px) | `h3`, `legend`, texto de destaque |
| `--tamanho-grande` | `clamp(1.4rem, 1.1rem + 1.2vw, 1.5625rem)` (22–25px) | `h2` |
| `--tamanho-titulo` | `clamp(1.75rem, 1.3rem + 2vw, 2.4375rem)` (28–39px) | `h1`, números de impacto |

Pesos: `--peso-normal` (400), `--peso-medio` (500), `--peso-forte` (600) e
`--peso-negrito` (700). Altura de linha: `--altura-linha` (1.65) e
`--altura-linha-titulo` (1.2).

### Espaçamentos

Escala modular de base 4px, usada em todas as margens, paddings e gaps:

| Variável | Valor |
|---|---|
| `--espaco-1` | `0.25rem` (4px) |
| `--espaco-2` | `0.5rem` (8px) |
| `--espaco-3` | `0.75rem` (12px) |
| `--espaco-4` | `1rem` (16px) |
| `--espaco-5` | `1.5rem` (24px) |
| `--espaco-6` | `2rem` (32px) |
| `--espaco-7` | `3rem` (48px) |

Estrutura: `--largura` (68rem, largura máxima do conteúdo) e `--raio` (4px).

## Validações nativas do formulário

| Campo | Validação |
|---|---|
| Nome completo | `required`, `minlength`, `maxlength`, `pattern` (nome e sobrenome) |
| CPF | `required`, `pattern` `\d{3}\.\d{3}\.\d{3}-\d{2}`, dígitos verificadores em JS |
| Data de nascimento | `type="date"`, `min`, `max` (maior de 18 anos) |
| E-mail | `type="email"`, `required`, `maxlength` |
| Telefone | `type="tel"`, `pattern` `\(\d{2}\)\s\d{4,5}-\d{4}` |
| CEP | `required`, `pattern` `\d{5}-\d{3}`, busca de endereço, cidade e estado via ViaCEP |
| Endereço | `type="text"`, `required`, `maxlength`, `autocomplete="address-line1"` |
| Cidade | `type="text"`, `required`, `maxlength` |
| Estado | `select` com `required` |
| Tipo de participação | grupo de `radio` com `required` |
| Doação mensal | `type="number"`, `min="10"`, `max="10000"`, `step="5"` |
| Mensagem | `textarea` com `maxlength="500"` |
| Aceite dos termos | `checkbox` com `required` |

## Máscaras

Implementadas em `assets/js/mascaras.js`, sem bibliotecas externas, aplicadas
pelo atributo `data-mascara` no HTML:

- **CPF** — `000.000.000-00`, com validação dos dois dígitos verificadores.
- **Telefone** — `(00) 0000-0000` e `(00) 00000-0000`, alternando conforme o número de dígitos.
- **CEP** — `00000-000`, com preenchimento automático de endereço, cidade e estado
  pela API ViaCEP.

## Imagens

Três formatos, cada um onde rende melhor:

- **WebP** como formato principal das cinco fotografias, entregue por
  `<picture>`/`<source type="image/webp">`.
- **JPEG** como fallback no `<img>`, para navegadores sem suporte a WebP.
  Fotografia em PNG ficaria cerca de três vezes maior, já que o formato não
  aplica compressão com perda.
- **ICO** no favicon e **PNG** no logotipo, por serem gráficos pequenos com
  áreas chapadas e transparência.

Todas as imagens declaram `width` e `height` no HTML para o navegador reservar o
espaço antes do carregamento e evitar deslocamento de layout. O logotipo é
servido em 112x112 para telas de alta densidade, embora exibido em 56x56.

## Acessibilidade

- Todo `input` tem `label` associado por `for`/`id`.
- Campos obrigatórios marcados com `abbr title="obrigatório"`.
- `alt` descritivo em todas as imagens.
- Foco visível no teclado (`:focus-visible`), com a cor do contorno ajustada ao
  fundo pela variável `--foco`.
- Contraste de texto acima do mínimo AA da WCAG 2.1 (4,5:1), calculado pela
  fórmula de luminância relativa: texto principal 14,6:1, texto secundário 6,5:1,
  links 9,5:1, mensagem de erro 6,1:1 e texto do botão principal 5,9:1 (4,8:1 no hover).
- Contorno dos campos com 4,0:1, acima dos 3:1 exigidos para limites de
  componentes.
- Tamanhos de fonte em `rem`, respeitando o zoom e a fonte padrão do navegador.
- `aria-current="page"` no item ativo do menu e `aria-label` nos dois `nav`.
- `role="status"` na mensagem de retorno do formulário.
- `prefers-reduced-motion` respeitado.

## Como executar

Abrir `index.html` em qualquer navegador. Não há build nem dependência de servidor.
A consulta de CEP exige conexão com a internet; sem ela, o endereço é preenchido
manualmente sem quebrar o formulário.

## Validação W3C

As três páginas foram verificadas em https://validator.w3.org/ e a folha de estilo
em https://jigsaw.w3.org/css-validator/, ambas sem erros nem avisos.
Após a refatoração da Experiência Prática II, a folha de estilo foi verificada
com o csstree-validator, também sem erros.
