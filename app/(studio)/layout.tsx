import "@/app/globals.css";
import "./studio.css";

// Studio (admin) group — no site chrome, no Lenis. Imports globals for the
// design tokens + theme variables so the admin matches the site's look.
export default function StudioGroupLayout({ children }: { children: React.ReactNode }) {
  return <div className="studio-root">{children}</div>;
}
