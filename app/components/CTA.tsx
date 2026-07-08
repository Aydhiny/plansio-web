import ContactForm from "./ContactForm";

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
          let&apos;s build the thing
          <br />
          <span className="serif grad-t">you keep describing.</span>
        </h2>
        <p className="sub rv d2">
          Tell us what you&apos;re making. We&apos;ll bring the strategy, the craft, and the code.
        </p>
        <div className="acts rv d3">
          <ContactForm />
          <p className="cta-alt">
            Prefer email? <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </p>
        </div>
      </div>
    </section>
  );
}
