import { Archivo } from "next/font/google";

// Uma definição compartilhada pela home, landing e moldura das demais páginas.
export const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--fonte-pista",
});
