/* ==================================================================
   Projetos sociais do instituto
   Cada objeto gera um cartão na página de projetos e um item no
   submenu. Para incluir um projeto, basta adicionar um objeto aqui.
   ================================================================== */

export const projetos = [
  {
    id: 'rua-arborizada',
    titulo: 'Rua Arborizada',
    situacao: { texto: 'Em andamento', tipo: 'sucesso' },
    area: 'Plantio',
    imagem: {
      nome: 'projeto-rua-arborizada',
      alt: 'Rua residencial com fileira de árvores jovens plantadas junto à calçada',
      legenda: 'Rua Tuiuti, Tatuapé, depois de dois anos de plantio.'
    },
    descricao:
      'Plantio de árvores de porte médio em calçadas residenciais, com escolha de ' +
      'espécies compatível com a fiação elétrica e a largura do passeio. Cada morador ' +
      'assina um termo de cuidado da muda em frente à sua casa.',
    ficha: [
      { termo: 'Início', valor: 'março de 2019', data: '2019-03' },
      { termo: 'Meta anual', valor: '1.200 mudas' },
      { termo: 'Bairros', valor: 'Tatuapé, Vila Formosa, Carrão' }
    ]
  },
  {
    id: 'viveiro-escola',
    titulo: 'Viveiro Escola',
    situacao: { texto: 'Em andamento', tipo: 'sucesso' },
    area: 'Educação ambiental',
    imagem: {
      nome: 'projeto-viveiro',
      alt: 'Bancada de viveiro com fileiras de sacos de muda e plantas pequenas',
      legenda: 'Viveiro mantido junto à EMEF Mário de Andrade.'
    },
    descricao:
      'Estudantes do ensino fundamental acompanham a semente até a muda pronta para ' +
      'plantio. O viveiro produz espécies nativas da Mata Atlântica e abastece todos os ' +
      'demais projetos do instituto.',
    ficha: [
      { termo: 'Início', valor: 'agosto de 2016', data: '2016-08' },
      { termo: 'Meta anual', valor: '4.000 mudas' },
      { termo: 'Escolas parceiras', valor: '7' }
    ]
  },
  {
    id: 'calcada-fresca',
    titulo: 'Calçada Fresca',
    situacao: { texto: 'Em andamento', tipo: 'sucesso' },
    area: 'Drenagem',
    imagem: {
      nome: 'projeto-calcada-fresca',
      alt: 'Trecho de calçada com piso drenante e canteiro vegetado junto ao meio-fio',
      legenda: 'Piso drenante instalado na Rua Serra de Bragança.'
    },
    descricao:
      'Substituição de concreto por piso drenante e abertura de canteiros no meio-fio. ' +
      'A água da chuva volta ao solo em vez de sobrecarregar a galeria, e a temperatura ' +
      'da calçada cai em média 6 °C nos dias de verão.',
    ficha: [
      { termo: 'Início', valor: 'janeiro de 2023', data: '2023-01' },
      { termo: 'Meta anual', valor: '3 km de calçada' },
      { termo: 'Parceria', valor: 'Subprefeitura da Mooca' }
    ]
  },
  {
    id: 'cuidadores-da-quadra',
    titulo: 'Cuidadores da Quadra',
    situacao: { texto: 'Em andamento', tipo: 'sucesso' },
    area: 'Formação',
    imagem: {
      nome: 'projeto-cuidadores',
      alt: 'Grupo de moradores em oficina ao ar livre observando a poda de uma árvore',
      legenda: 'Oficina de poda aberta à comunidade, realizada aos sábados.'
    },
    descricao:
      'Formação gratuita de moradores em poda, rega, identificação de pragas e denúncia ' +
      'de supressão irregular. Quem conclui o curso recebe certificado e passa a ser ' +
      'referência técnica da própria quadra.',
    ficha: [
      { termo: 'Início', valor: 'maio de 2021', data: '2021-05' },
      { termo: 'Meta anual', valor: '240 pessoas formadas' },
      { termo: 'Carga horária', valor: '16 horas' }
    ]
  }
];
