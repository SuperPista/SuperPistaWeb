// A sacola, o pedido e o nome da criança ficam guardados no navegador. Eles
// nascem vazios, iguais no servidor e no navegador, e só leem o que estava
// guardado depois de a página montar: sem isso o HTML do servidor e a primeira
// renderização sairiam diferentes. Quem chama é o pages/_app.js, uma vez só.
//
// `pronto` avisa as telas que a leitura terminou, para a sacola não aparecer
// vazia por um instante antes de mostrar o que tem dentro.
export function acordar(estado) {
  const pronto = () => estado.setState({ pronto: true });

  // sem armazenamento (navegador que bloqueia), o estado segue só na memória
  if (!estado.persist) {
    pronto();
    return;
  }

  Promise.resolve(estado.persist.rehydrate()).then(pronto, pronto);
}
