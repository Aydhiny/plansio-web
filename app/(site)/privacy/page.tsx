import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy", alternates: { canonical: "/privacy" } };

export default function Privacy() {
  return (
    <main className="page legal">
      <div className="wrap">
        <h1>Privacy Policy</h1>
        <p className="legal-updated">Last updated: 2026</p>
        <p>
          Plansio Studio (&quot;we&quot;) keeps data collection to an absolute minimum. This page explains what we
          store and why.
        </p>

        <h2>Cookies</h2>
        <p>
          We store a single cookie, <code>NEXT_LOCALE</code>, to remember whether you prefer English or Bosnian. It
          contains no personal data and is not used for advertising or tracking.
        </p>

        <h2>Contact form</h2>
        <p>
          When you send a message, the name, email and text you provide are used solely to reply to you. We don&apos;t
          sell or share it. Delivery is handled by our email provider.
        </p>

        <h2>Analytics</h2>
        <p>
          We use privacy-friendly, aggregate analytics (page views and performance metrics) that do not build a profile
          of you or use tracking cookies.
        </p>

        <h2>Your rights</h2>
        <p>
          You can request access to or deletion of any data you&apos;ve sent us at any time — email{" "}
          <a href="mailto:hello@plansio.studio">hello@plansio.studio</a>.
        </p>

        <p className="legal-note">
          This is a general template and not legal advice — have it reviewed for your jurisdiction before launch.
        </p>
      </div>
    </main>
  );
}
