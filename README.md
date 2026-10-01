# Instituto Raiz Viva

Plataforma web institucional de uma ONG fictícia de reflorestamento urbano e
educação ambiental, desenvolvida na disciplina de Desenvolvimento Front-End:

- **Experiência Prática 1** — estrutura em HTML5 semântico e formulário com validações.
- **Experiência Prática 2** — estilização com CSS3, a partir de um design system em variáveis CSS.
- **Experiência Prática 3** — interatividade com JavaScript: Single Page Application,
  templates dinâmicos, eventos, validação, armazenamento local, biblioteca
  externa e código modular.
- **Experiência Prática 4** — controle de versões com Git e GitHub, organização de commits
  e branches, acessibilidade e preparação para produção.

Cada entrega é uma versão marcada com tag. A lista completa está em [Versões](#versões),
e o fluxo de trabalho do repositório em [Fluxo de trabalho com GitFlow](#fluxo-de-trabalho-com-gitflow).

## Tecnologias utilizadas

| Tecnologia | Uso no projeto |
|---|---|
| HTML5 | Estrutura semântica das páginas e do formulário |
| CSS3 | Design system em variáveis, layout com Grid e Flexbox, mobile first |
| JavaScript (ES Modules) | SPA com roteamento por hash, templates, validação e localStorage, sem frameworks |
| [Day.js](https://day.js.org) 1.11.23 (CDN jsDelivr) | Cálculo de idade e tempo relativo |
| API [ViaCEP](https://viacep.com.br) | Preenchimento automático do endereço pelo CEP |
| Google Fonts | Fontes Fraunces e Public Sans |
| Node.js (`node:test`) | Testes automatizados, sem dependências instaladas |
| Git e GitHub | Versionamento com GitFlow, issues, milestones e pull requests |
| GitHub Pages | Hospedagem da versão publicada |

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
    ├── interacoes/         DOM e eventos: menu, feedback (toast/modal), mascaras,
    │                       campos-formulario e formulario-cadastro
    ├── regras/
    │   └── validacao.js    Regras de consistência (lógica pura, sem DOM)
    ├── servicos/           Rede e armazenamento, sem DOM
    │   ├── armazenamento.js  salvar() / ler() / remover() no localStorage
    │   ├── cadastros.js    Rascunho e histórico de cadastros
    │   └── viacep.js       Consulta de CEP na API ViaCEP
    └── utils/
        ├── html.js         escapar() e renderizarLista()
        └── datas.js        Integração com a biblioteca Day.js (com alternativa nativa)

testes/
└── modulos.test.mjs        Testes automatizados das regras, máscaras e serviços
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
anteriores continuam disponíveis pelas tags `ep1`/`v1.0.0` e `ep2`/`v1.1.0`.

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
`<script type="module">`. Cada pasta tem uma responsabilidade, e as dependências
seguem um sentido só:

```
app.js → roteador / rotas → views → componentes + interacoes
interacoes → regras + servicos + utils
servicos, regras, dados, utils → não importam nada das camadas de cima
```

| Camada | Pode usar o DOM? | Acessa rede ou localStorage? |
|---|---|---|
| `views/`, `componentes/` | Só geram strings de HTML | Não |
| `interacoes/` | Sim (eventos, classes, foco) | Não, pede aos serviços |
| `regras/` | Não | Não |
| `servicos/` | Não | Sim, é o único lugar que acessa |
| `dados/`, `utils/` | Não | Não (exceto o carregamento do Day.js) |

Não há importações circulares nem variáveis globais. Os módulos trocam
informação por parâmetros e retornos de funções. Os eventos globais (menu, toast
e modal) usam delegação no `document`, então continuam funcionando quando o
cabeçalho e o conteúdo são renderizados de novo.

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
`js/regras/validacao.js`, com uma regra por campo. A exibição do resultado na
tela fica em `js/interacoes/campos-formulario.js`:

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

`js/servicos/armazenamento.js` concentra o acesso: `salvar()` converte com
`JSON.stringify` e chama `setItem`; `ler()` chama `getItem`, converte com
`JSON.parse` e confere o formato (objeto ou array). Se o dado estiver corrompido,
em outro formato ou se o navegador bloquear o armazenamento, a função devolve um
valor padrão e a página continua funcionando.

O rascunho é apagado no envio e no botão "Limpar formulário", e o histórico tem
o botão "Apagar histórico". Por privacidade, o CPF e o aceite dos termos nunca
são gravados, e o histórico guarda só o necessário para ser exibido. Os textos
lidos do armazenamento passam por `escapar()` antes de entrar no HTML.

## Biblioteca externa: Day.js

O [Day.js](https://day.js.org) (versão 1.11.23) cuida das datas:

- **idade exata** a partir da data de nascimento, usada na regra de 18 anos
  (`dayjs().diff(nascimento, 'year')`);
- **tempo relativo** no histórico de cadastros, com o plugin `relativeTime` e
  textos em português ("Enviado há 5 minutos"; a data completa fica no `title`).

Toda a integração fica em `js/utils/datas.js`:

1. a biblioteca e o plugin são importados do CDN jsDelivr como módulos ES
   (`+esm`), com a versão fixa na URL. Nada é criado em `window`, então não há
   conflito com outras variáveis;
2. o carregamento usa `import()` dinâmico, iniciado pelo `app.js` sem esperar o
   resultado, para não atrasar a primeira renderização;
3. depois de carregar, `dayjs.extend(relativeTime)` ativa o plugin e
   `dayjs.locale(...)` define os textos em português;
4. se o CDN estiver fora do ar ou bloqueado, `carregarDatas()` resolve `false` e
   as funções usam `Date` e `Intl` nativos. O site continua funcionando, e o
   histórico mostra a data completa em vez do tempo relativo.

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

### Pré-requisitos

- [Git](https://git-scm.com/), para clonar o repositório;
- um navegador atualizado (Chrome, Firefox, Edge ou Safari);
- um servidor HTTP local: [Node.js](https://nodejs.org/) 18 ou superior (que também
  roda os testes) **ou** Python 3;
- conexão com a internet para as fontes, o Day.js e a consulta de CEP. Sem ela, o
  site funciona com fontes do sistema, datas nativas e endereço digitado à mão.

### Instalação local

O projeto não tem dependências para instalar (não há `package.json` nem `npm install`).

```bash
# 1. clonar o repositório e entrar na pasta
git clone https://github.com/rafaelvinicius/instituto-raiz-viva.git
cd instituto-raiz-viva

# 2. subir um servidor HTTP na pasta do projeto (escolha uma opção)
npx serve .
# ou
python3 -m http.server 8000

# 3. abrir no navegador o endereço exibido no terminal
#    (com Python: http://localhost:8000)
```

O servidor é necessário porque os navegadores bloqueiam módulos ES abertos direto do
disco (`file://`). No VS Code, a extensão Live Server também resolve. Por enquanto não
há etapa de build: os arquivos são servidos como estão.

## Testes

As regras, as máscaras e os serviços não dependem do navegador, então têm testes
automatizados com o test runner nativo do Node (versão 18 ou superior, sem
instalar nada):

```bash
node --test testes/modulos.test.mjs
```

São 15 testes, que cobrem: CPF válido e inválido, formatos de e-mail, telefone e
CEP, idade mínima, a regra condicional da doação, as máscaras, o `escapar()`, o
rascunho sem CPF, o histórico sem duplicidade, a leitura de JSON corrompido e as
respostas do ViaCEP (com `fetch` simulado).

### Falhas encontradas nos testes da interface e corrigidas

| Problema | Correção |
|---|---|
| Ao sair da página de cadastro enquanto o CEP era consultado, a resposta preenchia e focava um formulário que já não estava na tela e gravava esse estado no rascunho | `formulario.isConnected` é conferido depois do `await`; se a página mudou, nada é feito |
| Digitar "1e" no campo de doação: o navegador entrega `value = ''` e a regra aceitava como vazio | Checagem de `validity.badInput` antes da regra, com mensagem própria (vale também para data incompleta) |
| Contorno de foco no título a cada troca de página | `[tabindex="-1"]:focus { outline: none; }` |
| Data máxima de nascimento fixa em 31/12/2008, que bloqueava quem já tinha 18 anos | `max` calculado a partir de hoje |
| Esse cálculo usava `toISOString()` (UTC): depois das 21h em São Paulo, a data saía adiantada em um dia | Data montada com os métodos locais (`getFullYear`, `getMonth`, `getDate`) |
| Sem acesso ao CDN, o Day.js não carrega | `import()` dinâmico com alternativa nativa (`Date`/`Intl`) |

## Validação W3C

As três páginas foram verificadas em https://validator.w3.org/ e a folha de estilo
em https://jigsaw.w3.org/css-validator/, ambas sem erros nem avisos.
Após a refatoração da Experiência Prática II, a folha de estilo foi verificada
com o csstree-validator, também sem erros.

## Fluxo de trabalho com GitFlow

A partir da Experiência Prática 4, o repositório segue o modelo GitFlow, mesmo com
uma pessoa só desenvolvendo:

| Branch | Função | Recebe código de |
|---|---|---|
| `main` | Versões de lançamento. É a versão publicada no GitHub Pages | `release/*` e `hotfix/*` |
| `develop` | Desenvolvimento contínuo, com as funcionalidades já concluídas | `feature/*` (por pull request) |
| `feature/*` | Uma tarefa por branch, criada a partir da `develop` | — |
| `release/*` | Preparação de uma versão (revisão final, número de versão) | `develop` |
| `hotfix/*` | Correção urgente de uma falha em produção, criada a partir da `main` | — |

Nenhum commit é feito diretamente na `main`. O caminho de uma alteração é:

```bash
# 1. criar a branch da tarefa a partir da develop atualizada
git checkout develop
git pull
git checkout -b feature/nome-da-tarefa

# 2. trabalhar com commits pequenos e semânticos
git commit -m "feat: descrição curta da mudança"

# 3. enviar e abrir um pull request para a develop no GitHub
git push -u origin feature/nome-da-tarefa
```

O pull request descreve o motivo da mudança, o que foi alterado e como revisar, e
cita a issue relacionada (`Closes #n`), que é fechada no merge. Depois do merge, a
branch da tarefa é apagada.

Para lançar uma versão, a `develop` estável vira uma `release/*`, que é mesclada
na `main` e marcada com a tag da versão. Uma `hotfix/*` sai da `main` e, depois de
corrigida, é mesclada na `main` e na `develop`, para a correção não se perder.

As tarefas de cada entrega são registradas em issues e agrupadas em um milestone
(por exemplo, "EP4 · v2.1.0").

## Convenção de commits

As mensagens seguem o padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/):
`tipo: descrição no imperativo ou no presente, em minúsculas e sem ponto final`.

| Tipo | Quando usar | Exemplo do projeto |
|---|---|---|
| `feat` | Nova funcionalidade | `feat: persiste rascunho e histórico do cadastro no localStorage` |
| `fix` | Correção de falha | `fix: resposta tardia do CEP após navegação e entrada inválida em campos numéricos e de data` |
| `refactor` | Mudança de código sem alterar o comportamento | `refactor: separa serviços, regras e interação em módulos e adiciona testes` |
| `docs` | Somente documentação | `docs: atualiza o README com GitFlow, convenção de commits e versões` |
| `style` | Formatação, sem mudar a lógica | — |
| `perf` | Melhoria de desempenho | — |
| `test` | Criação ou ajuste de testes | — |
| `chore` | Configuração e manutenção do repositório | — |

O tipo também indica o impacto na versão: `fix` gera uma versão PATCH, `feat` gera
uma MINOR e uma mudança incompatível gera uma MAJOR.

## Versões

O projeto usa [versionamento semântico](https://semver.org/lang/pt-BR/)
(`MAJOR.MINOR.PATCH`). As tags `ep1` a `ep3` foram mantidas para identificar as
entregas da disciplina e apontam para os mesmos commits das versões semânticas.

| Versão | Entrega | Conteúdo | Por que esse número |
|---|---|---|---|
| `v1.0.0` | `ep1` | Estrutura em HTML5 semântico e formulário de cadastro com validações e máscaras | Primeira versão publicada |
| `v1.1.0` | `ep2` | Design system em CSS3, layout com Grid e Flexbox, menu responsivo e componentes de feedback | MINOR: acrescenta recursos sem mudar páginas nem endereços |
| `v2.0.0` | `ep3` | Single Page Application com roteamento por hash, validação em JavaScript, localStorage e módulos | MAJOR: os endereços antigos (`projetos.html`, `cadastro.html`) deixaram de existir |

Para ver o código de uma versão anterior:

```bash
git checkout v1.0.0   # volta para a versão da EP1 (modo somente leitura)
git checkout main     # retorna à versão atual
```

## Deploy

O site é publicado pelo GitHub Pages a partir da branch `main`, na raiz do
repositório: https://rafaelvinicius.github.io/instituto-raiz-viva/

Como a `main` só recebe versões de lançamento, o que está no ar corresponde
sempre à última versão marcada com tag.

## Autoria

Desenvolvido por Rafael Vinicius da Silva para a disciplina de Desenvolvimento
Front-End do curso de Análise e Desenvolvimento de Sistemas da Cruzeiro do Sul.
