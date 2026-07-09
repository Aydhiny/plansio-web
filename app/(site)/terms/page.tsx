import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms", alternates: { canonical: "/terms" } };

export default function Terms() {
  return (
    <main className="page legal">
      <div className="wrap">
        <h1>Terms of Use</h1>
        <p className="legal-updated">Last updated: 2026</p>
        <p>By using this website you agree to the following terms.</p>

        <h2>Content</h2>
        <p>
          The content, branding, code and product previews on this site are the property of Plansio Studio unless
          stated otherwise, and may not be reproduced without permission.
        </p>

        <h2>Product previews</h2>
        <p>
          Live product embeds link to third-party applications operated by us or our partners; their availability and
          behaviour may change at any time.
        </p>

        <h2>No warranty</h2>
        <p>
          The site is provided &quot;as is&quot; without warranties of any kind. We are not liable for any loss arising
          from its use.
        </p>

        <h2>Contact</h2>
        <p>
          Questions? Email <a href="mailto:hello@plansio.studio">hello@plansio.studio</a>.
        </p>

        <p className="legal-note">
          This is a general template and not legal advice — have it reviewed for your jurisdiction before launch.
        </p>
      </div>
    </main>
  );
}
