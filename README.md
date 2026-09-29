# Instituto Raiz Viva

Plataforma web institucional de uma ONG fictícia de reflorestamento urbano e
educação ambiental, desenvolvida para a Experiência Prática I da disciplina de
Desenvolvimento Front-End.

## Estrutura de diretórios

```
instituto-raiz-viva/
├── index.html              Página inicial: apresentação, missão, atuação e contato
├── projetos.html           Quatro projetos sociais com ficha técnica
├── cadastro.html           Formulário de doadores e voluntários
├── README.md
└── assets/
    ├── css/
    │   └── style.css       Folha de estilo única
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
- Foco visível no teclado (`:focus-visible`).
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