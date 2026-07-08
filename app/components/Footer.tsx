const EMAIL = "hello@plansio.studio";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="fgrid">
          <div className="fbrand">
            <div className="wm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/plansio-logo.png" alt="" />
              Plansio
            </div>
            <p>
              One team across marketing, design and software — so your brand isn&apos;t stitched together from five
              different agencies.
            </p>
          </div>
          <div className="fcol">
            <h4>Studio</h4>
            <a href="#work">Work</a>
            <a href="#studio">About</a>
            <a href="#pricing">Pricing</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="fcol">
            <h4>Services</h4>
            <a href="#work">Marketing</a>
            <a href="#work">Graphic design</a>
            <a href="#work">Software</a>
          </div>
          <div className="fcol">
            <h4>Connect</h4>
            <a href="#">Instagram</a>
            <a href="#">LinkedIn</a>
            <a href="#">Dribbble</a>
            <a href={`mailto:${EMAIL}`}>Email</a>
          </div>
        </div>
        <div className="fword parallax" data-speed="0.05">
          Plansio
        </div>
        <div className="fbot">
          <span>© 2026 Plansio Studio</span>
          <span>Design, code &amp; strategy under one roof</span>
        </div>
      </div>
    </footer>
  );
}
