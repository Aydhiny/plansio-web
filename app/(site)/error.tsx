"use client";

import { useEffect } from "react";

// Client error boundary — can't read the server locale, so it carries a tiny
// bilingual map keyed off <html lang>.
const T = {
  en: { title: "Something broke", body: "An unexpected error occurred on our end.", retry: "Try again" },
  bs: { title: "Nešto se pokvarilo", body: "Došlo je do neočekivane greške na našoj strani.", retry: "Pokušaj ponovo" },
};

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  const lang = typeof document !== "undefined" && document.documentElement.lang === "bs" ? "bs" : "en";
  const t = T[lang];
  return (
    <main className="page errpage">
      <div className="wrap err-wrap">
        <div className="err-code grad-t">500</div>
        <h1 className="err-title">{t.title}</h1>
        <p className="err-body">{t.body}</p>
        <div className="err-acts">
          <button className="btn solid" onClick={() => reset()}>
            <span>{t.retry}</span> <span className="ar">↺</span>
          </button>
        </div>
      </div>
    </main>
  );
}
