// Os poucos ícones do site, no traço grosso da marca. São enfeite ao lado de
// um texto que já diz o que é, então ficam fora do leitor de tela.
const DESENHOS = {
  sacola: (
    <>
      <path d="M5 8h14l-1 12.5H6L5 8Z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </>
  ),
  conta: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5c0-3.6 3.4-5.5 7.5-5.5s7.5 1.9 7.5 5.5" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  fechar: <path d="M6 6l12 12M18 6 6 18" />,
  seta: <path d="M6 9.5l6 6 6-6" />,
};

function Icone({ nome, tamanho = 22, className }) {
  return (
    <svg
      className={className}
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {DESENHOS[nome]}
    </svg>
  );
}

export default Icone;
