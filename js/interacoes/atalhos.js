/* ==================================================================
   Link "Pular para o conteúdo"
   ------------------------------------------------------------------
   Na SPA, o hash do endereço guarda a rota (#/projetos). Se o link
   seguisse o href="#conteudo", a rota seria trocada por "#conteudo".
   Por isso o clique é tratado aqui: o foco vai para o <main> sem
   alterar o endereço. Sem JavaScript, o href continua funcionando.
   ================================================================== */

export const iniciarAtalhoConteudo = () => {
  document.addEventListener('click', (evento) => {
    const atalho = evento.target.closest('.pular-conteudo');
    if (!atalho) return;

    const conteudo = document.getElementById('conteudo');
    if (!conteudo) return;

    evento.preventDefault();
    conteudo.focus({ preventScroll: true });
    conteudo.scrollIntoView();
  });
};
