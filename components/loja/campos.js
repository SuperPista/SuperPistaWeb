// Máscaras e conferências dos campos do checkout. Conferir no navegador só
// poupa uma ida e volta: quando o backend da loja existir, quem decide é ele.

export const ESTADOS = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

function digitos(texto, limite) {
  return texto.replace(/\D/g, "").slice(0, limite);
}

export function formatarCpf(texto) {
  const d = digitos(texto, 11);
  const blocos = [d.slice(0, 3), d.slice(3, 6), d.slice(6, 9)]
    .filter(Boolean)
    .join(".");

  return d.length > 9 ? `${blocos}-${d.slice(9)}` : blocos;
}

export function formatarCep(texto) {
  const d = digitos(texto, 8);

  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

// Celular com nove dígitos ou fixo com oito, sempre com o DDD na frente.
export function formatarCelular(texto) {
  const d = digitos(texto, 11);

  if (d.length <= 2) {
    return d === "" ? "" : `(${d}`;
  }

  const ddd = `(${d.slice(0, 2)}) `;
  const numero = d.slice(2);

  if (numero.length <= 4) {
    return ddd + numero;
  }

  const corte = numero.length === 9 ? 5 : 4;

  return `${ddd}${numero.slice(0, corte)}-${numero.slice(corte)}`;
}

// Os dois últimos dígitos do CPF saem de uma conta com os nove primeiros.
export function cpfValido(texto) {
  const d = digitos(texto, 11);

  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) {
    return false;
  }

  function verificador(tamanho) {
    let soma = 0;

    for (let i = 0; i < tamanho; i += 1) {
      soma += Number(d[i]) * (tamanho + 1 - i);
    }

    const resto = (soma * 10) % 11;

    return resto === 10 ? 0 : resto;
  }

  return verificador(9) === Number(d[9]) && verificador(10) === Number(d[10]);
}

export const DADOS_VAZIOS = {
  nome: "",
  email: "",
  celular: "",
  cpf: "",
  cep: "",
  rua: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: "",
};

// Devolve um erro por campo, com o nome do campo como chave, na ordem em que
// aparecem na tela. Sem erro, o objeto volta vazio. O complemento é o único
// campo opcional.
export function conferirDados(dados) {
  const erros = {};

  if (dados.nome.trim().split(/\s+/).length < 2) {
    erros.nome = "Escreva o nome e o sobrenome de quem vai receber.";
  }
  if (!/^\S+@\S+\.\S+$/.test(dados.email.trim())) {
    erros.email = "Confira o e-mail: é para ele que vai o rastreio.";
  }
  if (digitos(dados.celular, 11).length < 10) {
    erros.celular = "Escreva o número com o DDD.";
  }
  if (!cpfValido(dados.cpf)) {
    erros.cpf = "Esse CPF não confere. Veja se algum número ficou trocado.";
  }
  if (digitos(dados.cep, 8).length !== 8) {
    erros.cep = "O CEP tem 8 números.";
  }
  if (dados.rua.trim() === "") {
    erros.rua = "Escreva a rua ou avenida.";
  }
  if (dados.numero.trim() === "") {
    erros.numero = "Escreva o número, ou s/n.";
  }
  if (dados.bairro.trim() === "") {
    erros.bairro = "Escreva o bairro.";
  }
  if (dados.cidade.trim() === "") {
    erros.cidade = "Escreva a cidade.";
  }
  if (!ESTADOS.includes(dados.estado)) {
    erros.estado = "Escolha o estado.";
  }

  return erros;
}
