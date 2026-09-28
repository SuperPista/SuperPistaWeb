// As mesmas regras de senha que o servidor aplica em models/user.js. Conferir
// no navegador só poupa uma ida e volta; quem decide é a API.
export const SENHA_MINIMA = 8;
export const SENHA_MAXIMA = 72;

export const DICA_DA_SENHA = `De ${SENHA_MINIMA} a ${SENHA_MAXIMA} caracteres.`;

export function conferirSenha(senha) {
  if (senha.length < SENHA_MINIMA) {
    return `A senha precisa ter pelo menos ${SENHA_MINIMA} caracteres.`;
  }
  if (senha.length > SENHA_MAXIMA) {
    return `A senha pode ter no máximo ${SENHA_MAXIMA} caracteres.`;
  }
  return null;
}

export const SENHAS_DIFERENTES = "As duas senhas não são iguais.";
