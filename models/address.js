import viacep from "infra/viacep.js";
import { NotFoundError, ValidationError } from "infra/errors.js";
import { ESTADOS, formatarCep } from "components/loja/campos.js";

// O endereço de um CEP, para o checkout preencher rua, bairro, cidade e
// estado. CEP de cidade pequena vale para a cidade toda e vem sem rua e sem
// bairro: aí a pessoa escreve os dois.
async function findByZipCode(zipCode) {
  if (!/^\d{5}-?\d{3}$/.test(String(zipCode))) {
    throw new ValidationError({
      message: "O CEP tem 8 números.",
      action: "Envie o CEP só com os números, ou no formato 00000-000.",
    });
  }

  const found = await viacep.findAddress(zipCode.replace("-", ""));

  if (!found) {
    throw new NotFoundError({
      message: "Não achamos esse CEP.",
      action: "Confira os números ou escreva o endereço à mão.",
    });
  }

  return {
    zip_code: formatarCep(found.cep || zipCode),
    street: found.logradouro || "",
    neighborhood: found.bairro || "",
    city: found.localidade || "",
    state: ESTADOS.includes(found.uf) ? found.uf : "",
  };
}

const address = {
  findByZipCode,
};

export default address;
