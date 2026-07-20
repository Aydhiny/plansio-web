import type { Metadata } from "next";
import { isAuthed } from "@/lib/auth";
import { getSettings, DEFAULT_SETTINGS } from "@/lib/studio";
import { getAllProducts, DEFAULT_PRODUCTS } from "@/lib/products";
import { getAllPosts, DEFAULT_POSTS } from "@/lib/blog";
import { getAllProjects, DEFAULT_PROJECTS } from "@/lib/projects";
import StudioApp from "./StudioApp";
import StudioLogin from "./StudioLogin";

export const metadata: Metadata = { title: "Studio", robots: { index: false, follow: false } };

export default async function StudioPage() {
  if (!(await isAuthed())) return <StudioLogin />;
  const [settings, products, projects, posts] = await Promise.all([
    getSettings(),
    getAllProducts(),
    getAllProjects(),
    getAllPosts(),
  ]);
  return (
    <StudioApp
      initialSettings={settings}
      initialProducts={products}
      initialProjects={projects}
      initialPosts={posts}
      defaultSettings={DEFAULT_SETTINGS}
      defaultProducts={DEFAULT_PRODUCTS}
      defaultProjects={DEFAULT_PROJECTS}
      defaultPosts={DEFAULT_POSTS}
    />
  );
}
