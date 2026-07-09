import Link from "next/link";
import { getDict, getLocale } from "./i18n";
import "./globals.css";

// Root not-found — catches fully unmatched URLs (renders without site chrome).
export default async function NotFound() {
  const d = getDict(await getLocale());
  return (
    <main className="page errpage">
      <div className="wrap err-wrap">
        <div className="err-code grad-t">404</div>
        <h1 className="err-title">{d.ui.notFoundTitle}</h1>
        <p className="err-body">{d.ui.notFoundBody}</p>
        <div className="err-acts">
          <Link className="btn solid" href="/">
            <span>{d.ui.home}</span> <span className="ar">↗</span>
          </Link>
          <Link className="btn ghost" href="/products">
            <span>{d.nav.products}</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
