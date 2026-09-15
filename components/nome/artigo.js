// Palpite de "da" ou "do" antes do nome da criança. O campo só aceita letras de
// A a Z, sem acento, então o palpite vem de como o nome termina, do jeito que
// se faz de ouvido em português: nome terminado em A é de menina e o resto é
// de menino. As listas abaixo guardam o que foge dessa regra.

function lista(nomes) {
  return new Set(nomes.trim().split(/\s+/));
}

// Nomes e apelidos de menina que a regra dos finais erraria.
const FEMININOS = lista(`
  ester nair flor pilar leonor jennifer jenifer jeniffer amber
  mel carol abigail cristal crystal ingrid astrid
  isis iris doris ines inez agnes elis lis luz gladys mercedes dolores lourdes lurdes
  carmen karen keren miriam mirian lilian liliam vivian viviam beatrix
  rose grace joyce dulce kate jade solange monique angelique florence claire
  zoe zoey chloe cloe rute nazare heidi anahi
  helo cleo socorro consuelo rocio amparo conceicao assuncao
  malu madu lulu juju manu lu ju pri mari ceci luci juci araci aracy geni jeni
  gabi babi bibi tati nati kati beti sayuri
  mary lucy suzy susy daisy nancy ruby joy wendy cindy betty amy mandy
  jenny anny abby gaby ashley hailey haley kaylee
  scarlet scarlett violet juliet margaret janet
`);

// Nomes e apelidos de menino que a regra dos finais erraria.
const MASCULINOS = lista(`
  joshua josua nikita ilya ezra akira nicola mustafa
  juca zeca joca tuca jeca kaka dida bira maneca rafinha
  noah jonah elijah josiah isaiah judah micah seth keith kenneth
  abel michel eli ali sami rene gene eugene maurice allen glen
  luther walther gunther kiko marko mirko darko
  charlie eddie willie archie frankie ronnie bernie
`);

// Finais de nome de menino mesmo terminando em A, como Kaua e Gianluca.
const FINAIS_MASCULINOS = lista(`aua luca lucca luka`);

// Finais de nome de menina fora o A, como Beatriz, Alice, Emilly e Yumi.
const FINAIS_FEMININOS = lista(`
  ah th triz liz ais smin smim len leen lyn elin bel quel chel ther
  ane ine ene one nne ele lle ile ole ie ise isse ice ete tte ite eide aide ilde
  ly any li mi ko
`);

function terminaCom(nome, finais) {
  return [...finais].some((final) => nome.endsWith(final));
}

export function artigoDoNome(nome) {
  const minusculo = nome.trim().toLowerCase();

  if (FEMININOS.has(minusculo)) {
    return "da";
  }

  if (MASCULINOS.has(minusculo) || terminaCom(minusculo, FINAIS_MASCULINOS)) {
    return "do";
  }

  if (minusculo.endsWith("a") || terminaCom(minusculo, FINAIS_FEMININOS)) {
    return "da";
  }

  return "do";
}
