import { useEffect, useRef } from "react";

// Vídeo mudo em loop que só toca enquanto está visível, para a home não baixar
// e rodar os cinco vídeos ao mesmo tempo. Com o movimento reduzido ligado no
// sistema, ele fica parado no pôster.
function VideoEmLoop({ className, src, poster, rotulo }) {
  const referencia = useRef(null);

  useEffect(() => {
    const video = referencia.current;
    const movimentoReduzido = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting && !movimentoReduzido.matches) {
          // o play() é rejeitado quando um pause() chega antes dele terminar
          video.play().catch(() => {});
          return;
        }

        video.pause();
      },
      { threshold: 0.2 },
    );

    observador.observe(video);

    return () => observador.disconnect();
  }, []);

  return (
    <video
      ref={referencia}
      className={className}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={rotulo}
      aria-hidden={rotulo ? undefined : true}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

export default VideoEmLoop;
