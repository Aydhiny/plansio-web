"use client";

import { useState } from "react";

export default function StudioLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(false);
    const res = await fetch("/api/studio/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      window.location.reload();
    } else {
      setError(true);
      setBusy(false);
    }
  };

  return (
    <div className="st-login">
      <form className="st-login-card" onSubmit={submit}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="st-login-logo" src="/assets/plansio-logo.png" alt="" />
        <h1 className="st-login-title">Plansio Studio</h1>
        <p className="st-login-sub">Enter your password to customize the site.</p>
        <input
          type="password"
          className="st-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
        {error && <p className="st-login-err">Wrong password. Try again.</p>}
        <button className="st-btn st-btn-solid" type="submit" disabled={busy}>
          {busy ? "Checking…" : "Enter Studio"}
        </button>
      </form>
    </div>
  );
}
