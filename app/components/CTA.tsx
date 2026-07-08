// Original page hid the address behind Cloudflare email-protection. Decoded, it
// is hello@plansio.studio — surfaced here as a real mailto: (better UX + no
// client-side decode script needed).
const EMAIL = "hello@plansio.studio";

export default function CTA() {
  return (
    <section className="cta" id="contact" data-screen-label="Contact">
      {/* eslint-disable @next/next/no-img-element */}
      <img className="palm-img p-cta-l parallax" data-speed="0.07" src="/assets/palm-d.png" alt="" aria-hidden="true" />
      <img className="palm-img p-cta-r parallax" data-speed="0.1" src="/assets/palm-c.png" alt="" aria-hidden="true" />
      <div className="wrap">
        <img className="mk rv" src="/assets/plansio-logo.png" alt="Plansio mark" />
        {/* eslint-enable @next/next/no-img-element */}
        <h2 className="rv d1">
          let&apos;s build something
          <br />
          <span className="serif grad-t">human.</span>
        </h2>
        <p className="sub rv d2">
          Tell us what you&apos;re making. We&apos;ll bring the strategy, the craft, and the code.
        </p>
        <div className="acts rv d3">
          <a className="btn solid" href={`mailto:${EMAIL}`}>
            <span>{EMAIL}</span> <span className="ar">↗</span>
          </a>
          <a className="btn ghost" href="#top">
            <span>Back to top</span>
          </a>
        </div>
      </div>
    </section>
  );
}
