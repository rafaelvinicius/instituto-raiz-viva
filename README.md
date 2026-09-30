# Instituto Raiz Viva

Plataforma web institucional de uma ONG fictícia de reflorestamento urbano e
educação ambiental, desenvolvida na disciplina de Desenvolvimento Front-End:

- **Experiência Prática I** — estrutura em HTML5 semântico e formulário com validações.
- **Experiência Prática II** — estilização com CSS3, a partir de um design system em variáveis CSS.
- **Experiência Prática III** — interatividade com JavaScript: Single Page Application,
  templates dinâmicos, eventos, validação e armazenamento local (em andamento).

As versões entregues ficam marcadas com as tags `ep1` e `ep2`.

## Estrutura de diretórios

```
instituto-raiz-viva/
├── index.html              Só redireciona para html/ (o GitHub Pages exige um index na raiz)
├── README.md
├── html/                   Páginas HTML
│   ├── index.html          Casca da SPA: cabeçalho, <main> e rodapé preenchidos por JavaScript
│   └── componentes.html    Guia de componentes de feedback (etiquetas, alertas, toast, modal)
├── css/
│   └── style.css           Folha de estilo única, com o design system no :root
├── imagens/
│   ├── favicon.ico                   Ícone do navegador, 32x32
│   ├── logo-raiz-viva.png            Logotipo, 112x112 (exibido em 56x56)
│   ├── mutirao-plantio.webp / .jpg   Página inicial
│   └── projeto-*.webp / .jpg         Uma foto por projeto
└── js/
    ├── app.js              Ponto de entrada: monta o layout e inicia o roteador
    ├── roteador.js         Navegação por hash (#/rota/ancora)
    ├── rotas.js            Tabela endereço → página
    ├── config.js           Caminhos compartilhados (pasta de imagens)
    ├── guia.js             Entrada do componentes.html (reaproveita cabeçalho e rodapé)
    ├── views/              Uma página por arquivo: inicio, projetos, cadastro, nao-encontrada
    ├── componentes/        Templates reutilizáveis: cabecalho, rodape, figura, cartao,
    │                       cartao-projeto, lista-definicoes, lista-valores, chamada-apoio
    ├── dados/              Conteúdo estruturado: projetos, instituto, navegacao, estados
    ├── interacoes/         Comportamentos: menu, feedback (toast/modal), mascaras,
    │                       validacao, persistencia-cadastro e formulario-cadastro
    └── utils/
        ├── html.js         escapar() e renderizarLista()
        └── armazenamento.js  salvar() / ler() / remover() no localStorage
```

## Single Page Application (Experiência Prática III)

### Navegação

O site passou a ter um único HTML (`html/index.html`). O JavaScript lê o endereço e
troca apenas o conteúdo do `<main>` e o título do cabeçalho, sem recarregar a página.

| Endereço | Página |
|---|---|
| `#/` | Início |
| `#/projetos` | Projetos sociais |
| `#/projetos/viveiro-escola` | Projetos, já rolando até o projeto |
| `#/cadastro` | Cadastro de doadores e voluntários |
| qualquer outro | Página não encontrada |

As rotas usam o **hash** (`#/...`) porque o site é publicado no GitHub Pages, que
não devolve o `index.html` para caminhos desconhecidos. Com o hash, atualizar a
página, abrir um link direto e usar os botões Voltar/Avançar do navegador funcionam
sem configuração no servidor.

A cada troca de página o roteador:

1. atualiza `document.title`, a meta description e o `aria-current` do menu;
2. renderiza a página no `<main>` e chama `aoMontar()`, quando a página precisa
   ligar eventos (caso do formulário de cadastro);
3. rola para o topo e leva o foco ao `h1`, para que leitores de tela percebam a
   mudança. Com âncora, rola e leva o foco até a seção indicada.

Na Experiência Prática III, os arquivos foram separados em pastas por
responsabilidade: `html/`, `css/`, `imagens/` e `js/`. O `index.html` da raiz só
redireciona para `html/`, preservando a rota (`/#/projetos` → `/html/#/projetos`).
As páginas `projetos.html` e `cadastro.html` deixaram de existir; as versões
anteriores continuam disponíveis pelas tags `ep1` e `ep2`.

### Templates dinâmicos

Cada componente é uma função que recebe dados e devolve uma string de HTML
(template literal). As páginas são montadas combinando esses componentes:

| Componente | Reaproveitado em |
|---|---|
| `cabecalho` / `rodape` | Todas as páginas da SPA e o `componentes.html` |
| `figura` (WebP + JPG) | Destaque da página inicial e os quatro projetos |
| `listaDefinicoes` | Números do instituto, ficha técnica dos projetos e valores de doação |
| `listaValores` | Missão, frentes de voluntariado e primeiros passos |
| `cartaoProjeto` | Um cartão por item de `dados/projetos.js` |
| `chamadaApoio` | Bloco "Apoie" da página inicial e da página de projetos |

O submenu de Projetos e os cartões são gerados a partir do mesmo arquivo de dados:
incluir um projeto em `dados/projetos.js` faz ele aparecer nos dois lugares. As
opções do campo Estado também vêm de uma lista (`dados/estados.js`).

Todo texto vindo de dados passa por `escapar()` antes de entrar no template, o que
impede que um conteúdo seja interpretado como HTML.

### Módulos

O JavaScript usa módulos ES (`import`/`export`), carregados com
`<script type="module">`. Os eventos globais (menu, toast e modal) usam delegação
no `document`, então continuam funcionando quando o cabeçalho e o conteúdo são
renderizados de novo.

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
`css/style.css`. Fora delas, as regras não usam cor, tamanho de fonte ou
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

## Layout: grid de 12 colunas

O layout macro usa CSS Grid com 12 colunas, definido pelas variáveis
`--grade-colunas` (12) e `--grade-espaco` (espaço entre colunas):

```css
grid-template-columns: repeat(var(--grade-colunas), minmax(0, 1fr));
column-gap: var(--grade-espaco);
```

A mesma grade é aplicada ao `main` das três páginas e aos blocos internos
`.destaque`, `.numeros`, `.atuacao`, `.projetos` e aos `fieldset` do formulário.
O `minmax(0, 1fr)` impede que conteúdo longo force uma coluna a crescer além da tela.

A folha segue a abordagem **mobile first**: sem media query, todo filho da grade
ocupa as 12 colunas (`grid-column: 1 / -1`). Cada breakpoint usa `min-width` e
só redistribui as colunas. A ordem visual acompanha a ordem do HTML, para que a
navegação por teclado e o leitor de tela sigam a mesma sequência vista na tela.

### Breakpoints

| # | Largura | Dispositivo | O que muda |
|---|---|---|---|
| — | até 479px | Celulares | Uma coluna; botões do formulário com largura total |
| 1 | `min-width: 480px` | Celulares grandes | Números de impacto em 2 × 2 (6 colunas cada); botões lado a lado |
| 2 | `min-width: 640px` | Tablets em retrato | Logo e título em linha; campos do formulário lado a lado (6, 8 e 4 colunas) |
| 3 | `min-width: 768px` | Tablets em paisagem | Gap maior; números em 4 colunas (3 cada); cartões de atuação em 3 colunas (4 cada); projeto com foto em 5 colunas e texto em 7 |
| 4 | `min-width: 1024px` | Desktop | Início: foto 7 + texto 5, missão 8, apoio 5 + contato 7. Projetos: 2 por linha (6 cada), doação 6 + voluntariado 6. Cadastro: introdução 4 + formulário 8 |
| 5 | `min-width: 1280px` | Telas largas | `--largura` de 68rem para 76rem e gap de 32px |

Classes modificadoras usadas no HTML para posicionar elementos na grade:
`.apoie--lateral` (index), `.intro--lateral` (cadastro) e, nos campos do
formulário, `.campo--metade` (6 colunas), `.campo--longo` (8) e `.campo--curto` (4).

O layout foi conferido em 360, 480, 640, 768, 1024, 1280 e 1440px, sem rolagem
horizontal em nenhuma das três páginas.

## Componentes com Flexbox

O Grid organiza as áreas da página; o Flexbox alinha os elementos dentro de cada
componente, em um único eixo.

| Componente | Seletor | Propriedades principais |
|---|---|---|
| Marca do cabeçalho | `.cabecalho__marca` | `flex-direction: column` no celular e `row` a partir de 640px; `align-items`; `gap` |
| Menu principal | `.menu ul` | `display: flex`; `flex-wrap: wrap`; `gap` |
| Cartão de projeto | `.projeto` (a partir de 1024px) | `flex-direction: column`; `flex-grow: 1` no parágrafo, que empurra a ficha técnica para a base e alinha os cartões lado a lado |
| Opções do formulário | `.opcao` | `align-items: flex-start` entre o `input` e o `label`; `gap` |
| Botões do formulário | `.acoes` | `flex-wrap: wrap`; `flex: 1 1 100%` nos botões no celular e `flex: 0 0 auto` a partir de 480px |
| Links do rodapé | `.rodape ul` | `display: flex`; `flex-wrap: wrap`; `gap` |

## Menu de navegação

O menu principal é o mesmo nas três páginas e muda de formato em 768px.

**Até 767px (hambúrguer):** um `button.menu__botao` com ícone de três barras e o
texto "Menu" abre um painel (`.menu__lista`) posicionado com `position: absolute`
logo abaixo do cabeçalho. O painel fica escondido com `opacity: 0`,
`visibility: hidden` e `transform: translateY(-0.5rem)` e aparece com
`transition` quando o botão tem `aria-expanded="true"`. O ícone vira um X pelos
pseudo-elementos `::before` e `::after`. Os itens do submenu aparecem abertos e
recuados sob "Projetos".

**A partir de 768px (dropdown):** o botão some e a lista volta a ser horizontal
(`flex-direction: row`). O submenu de "Projetos" (`.submenu`) usa
`position: absolute` e fica escondido até o item receber `:hover` ou
`:focus-within`, o que permite abri-lo com o mouse ou com a tecla Tab.

O `app.js` adiciona a classe `js` ao `<html>` e o `interacoes/menu.js`, alterna o `aria-expanded` do botão
que fecha o painel com Esc, com clique fora do menu ou ao escolher um link. Sem
JavaScript, a classe não é adicionada e o menu fica sempre visível. As transições
são desligadas por `prefers-reduced-motion`.

## Estados interativos de botões e formulário

**Botões (`.botao`):** `transition` de 0.2s em fundo, borda, cor e sombra.

| Estado | Efeito |
|---|---|
| `:hover` | Fundo `--sinal-forte` e `box-shadow: 0 4px 10px` (no secundário, fundo verde e texto claro) |
| `:focus-visible` | Contorno global de 3px na cor `--foco` e anel branco de 2px separando o contorno do botão |
| `:active` | `transform: translateY(1px)` e sem sombra, dando a sensação de clique |
| `:disabled` | `opacity: 0.55`, `cursor: not-allowed`, sem sombra; hover e active não se aplicam (`:not(:disabled)`) |

O botão "Enviar cadastro" fica desabilitado até o aceite da política de
privacidade. O texto de ajuda ligado por `aria-describedby` explica o motivo.
O `disabled` é aplicado pelo JavaScript; sem ele, o botão fica ativo.

**Campos:**

- `:hover` escurece a borda e `:focus` aplica borda verde e anel `--folha-clara`.
- `:user-valid` nos campos obrigatórios: borda verde e ícone de confirmação.
- `:user-invalid`: borda `--erro`, fundo `--erro-claro` e ícone de alerta.
  Cor e ícone juntos, para o erro não depender só da cor.
- Quando o envio falha, o JavaScript adiciona `.formulario--verificado` ao
  formulário, e os campos obrigatórios que ficaram em branco também são
  marcados, incluindo o grupo de rádio (`:has(input:invalid)`).
- A mensagem de erro do envio usa o componente de alerta (`.alerta--erro`), com
  `role="status"` para ser anunciada por leitores de tela. O sucesso abre um modal.

## Componentes de feedback

Documentados com exemplos e HTML em `html/componentes.html`. Todos compartilham três
variáveis locais, `--feedback-cor`, `--feedback-fundo` e `--feedback-icone`, e
cada variante (`--sucesso`, `--aviso`, `--erro`; sem modificador = informação)
só troca esses valores.

| Componente | Classe | Onde é usado |
|---|---|---|
| Etiqueta (badge) | `.etiqueta`, `.etiqueta--sucesso` | Situação e área de cada projeto na página de projetos |
| Alerta | `.alerta`, `.alerta--info`, `--sucesso`, `--aviso`, `--erro` | Prestação de contas (página de projetos) e erro de envio do cadastro |
| Toast | `.alerta.toast` (criado por `toast()`) | Aviso de "Formulário limpo" no cadastro |
| Modal | `dialog.modal` (aberto por `abrirModal()`) | Confirmação de cadastro com os próximos passos |

O ícone dos alertas é um SVG aplicado com `mask`, pintado com a cor da variante.
O modal usa o `<dialog>` nativo, que prende o foco, fecha com Esc e devolve o
foco ao elemento de origem; o fundo usa `::backdrop`. Os toasts ficam em uma
região `role="status"` / `aria-live="polite"` e somem depois de 5 segundos.
Novas cores: `--sinal-escuro` (#8a5a00, 5,3:1 sobre `--sinal-claro`) e
`--sinal-claro` (#fdf1dc).

Para um desenvolvedor back-end, basta gerar o HTML da tabela acima ou chamar:

```js
import { toast, abrirModal } from '../js/interacoes/feedback.js';

toast('Cadastro enviado com sucesso.', 'sucesso');
abrirModal('modal-sucesso');
```

## Validação do formulário

Os atributos HTML da EP1 (`required`, `pattern`, `min`, `max`...) continuam no
formulário. Na EP3, a verificação passou a ser feita por JavaScript, em
`js/interacoes/validacao.js`, com uma regra por campo:

| Campo | Critério | Mensagem quando falha |
|---|---|---|
| Nome completo | Nome e sobrenome, só letras (RegEx), mínimo de 6 caracteres | "Informe nome e sobrenome, usando apenas letras." |
| CPF | Formato `000.000.000-00` (RegEx) e dígitos verificadores | "Este CPF não existe. Confira os números digitados." |
| Data de nascimento | 18 anos completos, calculados a partir da data de hoje | "É preciso ter 18 anos ou mais para participar." |
| E-mail | `algo@dominio.ext` (RegEx) | "Digite um e-mail válido, como maria@exemplo.com.br." |
| Telefone | `(00) 0000-0000` ou `(00) 00000-0000` (RegEx) | "Informe o DDD e o número, com 10 ou 11 dígitos." |
| CEP | `00000-000` (RegEx) | "Digite os 8 números do CEP." |
| Endereço | Obrigatório e com número do imóvel | "Inclua o número do imóvel." |
| Cidade | Só letras (RegEx) | "Use apenas letras no nome da cidade." |
| Estado / Tipo de participação | Uma opção escolhida | "Selecione o estado." / "Escolha como você quer contribuir." |
| Doação mensal | Obrigatória para doador ou "das duas formas"; de R$ 10 a R$ 10.000, múltiplo de 5 | "Informe o valor da doação mensal." |
| Mensagem | Até 500 caracteres, com contador | "Use no máximo 500 caracteres." |
| Aceite dos termos | Marcado | "É preciso aceitar a política de privacidade." |

**Quando verifica:** ao sair do campo; enquanto a pessoa digita, só nos campos
já visitados (o erro some assim que o valor é corrigido); e em todos os campos
ao enviar. Os eventos usam delegação no próprio `<form>`.

**Como avisa:** o contêiner do campo recebe `.campo--erro` (borda vermelha,
fundo rosado e ícone) ou `.campo--valido` (borda verde e ícone de confirmação),
e uma mensagem `.campo__erro` é inserida logo abaixo. O campo recebe
`aria-invalid="true"` e `aria-describedby` apontando para a mensagem, para que
o leitor de tela a anuncie. No envio com erro, um alerta resume quantos campos
precisam de correção e o foco vai para o primeiro deles. A regra também chama
`setCustomValidity()`, mantendo a validação nativa coerente com o JavaScript.

## Dados salvos no navegador (localStorage)

| Chave | Formato | Quando grava | Quando lê |
|---|---|---|---|
| `raizviva:rascunho-cadastro` | objeto `{ salvoEm, campos }` | 400 ms depois de cada alteração no formulário | Ao abrir a página de cadastro: devolve os valores aos campos |
| `raizviva:cadastros` | array de `{ nome, email, perfil, valor, enviadoEm }` | No envio válido (um novo envio com o mesmo e-mail substitui o anterior) | Ao abrir a página de cadastro: lista os cadastros ao lado do formulário |

`js/utils/armazenamento.js` concentra o acesso: `salvar()` converte com
`JSON.stringify` e chama `setItem`; `ler()` chama `getItem`, converte com
`JSON.parse` e confere o formato (objeto ou array). Se o dado estiver corrompido,
em outro formato ou se o navegador bloquear o armazenamento, a função devolve um
valor padrão e a página continua funcionando.

O rascunho é apagado no envio e no botão "Limpar formulário", e o histórico tem
o botão "Apagar histórico". Por privacidade, o CPF e o aceite dos termos nunca
são gravados, e o histórico guarda só o necessário para ser exibido. Os textos
lidos do armazenamento passam por `escapar()` antes de entrar no HTML.

## Máscaras

Implementadas em `js/interacoes/mascaras.js`, sem bibliotecas externas, aplicadas
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

Versão publicada: https://rafaelvinicius.github.io/instituto-raiz-viva/ (abre em `/html/`)

Localmente, é preciso um servidor HTTP, porque os navegadores bloqueiam módulos ES
abertos direto do disco (`file://`). Qualquer uma destas opções funciona, na pasta
do projeto:

```bash
npx serve .
# ou
python3 -m http.server 8000
```

No VS Code, a extensão Live Server também resolve. Não há etapa de build.
A consulta de CEP exige conexão com a internet; sem ela, o endereço é preenchido
manualmente sem quebrar o formulário.

## Validação W3C

As três páginas foram verificadas em https://validator.w3.org/ e a folha de estilo
em https://jigsaw.w3.org/css-validator/, ambas sem erros nem avisos.
Após a refatoração da Experiência Prática II, a folha de estilo foi verificada
com o csstree-validator, também sem erros.
