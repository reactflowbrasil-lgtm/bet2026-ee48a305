import { useEffect, useState } from "react";

interface PreloaderProps {
  onFinish: () => void;
}

const Preloader = ({ onFinish }: PreloaderProps) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onFinish, 500);
    }, 3500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background ${
        fadeOut ? "animate-fade-out" : ""
      }`}
    >
      {/* Spinner */}
      <div className="relative mb-8">
        <div className="h-16 w-16 rounded-full border-4 border-secondary" />
        <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-transparent border-t-primary animate-spin-slow" />
      </div>

      {/* Title */}
      <h1 className="font-display text-2xl font-bold animate-shimmer mb-4">
        Plataforma Pagante
      </h1>

      {/* Message */}
      <p className="text-muted-foreground text-sm animate-pulse-gold text-center px-8">
        Carregando plataforma pagante — Boa sorte em suas apostas!
      </p>

      {/* Decorative dots */}
      <div className="flex gap-2 mt-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full bg-primary"
            style={{
              animation: `pulse-gold 1.5s ease-in-out ${i * 0.3}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Preloader;
