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
  instagram: (
    <>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </>
  ),
  facebook: (
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  ),
  tiktok: <path d="M9 12a4 4 0 1 0 4 4V3a5 5 0 0 0 5 5" />,
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
