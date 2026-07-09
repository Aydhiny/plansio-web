"use client";

// Root error boundary — must render its own <html>/<body> and can't rely on
// the site CSS, so it's fully self-contained with inline styles.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#fff",
          color: "#141018",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div>
          <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: "-0.04em" }}>500</div>
          <p style={{ color: "#4a4558", margin: "8px 0 24px" }}>{error.message || "Something went very wrong."}</p>
          <button
            onClick={() => reset()}
            style={{
              border: "none",
              borderRadius: 100,
              padding: "12px 22px",
              fontWeight: 600,
              cursor: "pointer",
              color: "#2a1206",
              background: "linear-gradient(180deg,#f7b231,#f36844 48%,#d93d72)",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
