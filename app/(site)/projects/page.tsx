import type { Metadata } from "next";
import ProjectCard from "@/app/components/ProjectCard";
import { getDict, getLocale } from "@/app/i18n";
import { getAllProjects } from "@/lib/projects";

export async function generateMetadata(): Promise<Metadata> {
  const d = getDict(await getLocale());
  const title = `${d.projects.title} ${d.projects.accent}`.trim();
  return { title, description: d.projects.lead, alternates: { canonical: "/projects" } };
}

export default async function ProjectsPage() {
  const locale = await getLocale();
  const d = getDict(locale);
  const projects = await getAllProjects();
  return (
    <main className="page">
      <section className="products" data-screen-label="Projects">
        <div className="wrap">
          <div className="shead rv">
            <h2>
              {d.projects.title} <span className="serif grad-t">{d.projects.accent}</span>
            </h2>
            <p>{d.projects.lead}</p>
          </div>
          <div className="prgrid">
            {projects.map((p) => (
              <div className="rv" key={p.slug}>
                <ProjectCard p={p} locale={locale} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
