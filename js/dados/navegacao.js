/* ==================================================================
   Itens do menu principal e do rodapé
   O submenu de Projetos é gerado a partir da lista de projetos:
   um projeto novo aparece no menu sem editar o HTML.
   ================================================================== */

import { projetos } from './projetos.js';

export const navegacao = [
  { rotulo: 'Início', rota: '/' },
  {
    rotulo: 'Projetos',
    rota: '/projetos',
    subitens: [
      ...projetos.map((projeto) => ({ rotulo: projeto.titulo, ancora: projeto.id })),
      { rotulo: 'Como doar', ancora: 'como-doar' },
      { rotulo: 'Como ser voluntário', ancora: 'voluntariado' }
    ]
  },
  { rotulo: 'Cadastre-se', rota: '/cadastro' }
];
