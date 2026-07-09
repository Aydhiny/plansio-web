"use client";

import { useEffect, useState } from "react";

export default function CookieConsent({ text, ok }: { text: string; ok: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem("plansio-consent")) setShow(true);
    } catch {}
  }, []);

  const accept = () => {
    try {
      localStorage.setItem("plansio-consent", "1");
    } catch {}
    setShow(false);
  };

  if (!show) return null;
  return (
    <div className="consent" role="dialog" aria-label="Cookie notice">
      <p>{text}</p>
      <button className="btn ghost consent-btn" onClick={accept}>
        <span>{ok}</span>
      </button>
    </div>
  );
}
