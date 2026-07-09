import type { Metadata } from "next";
import { isAuthed } from "@/lib/auth";
import { getSettings, DEFAULT_SETTINGS } from "@/lib/studio";
import { getAllProducts, DEFAULT_PRODUCTS } from "@/lib/products";
import StudioApp from "./StudioApp";
import StudioLogin from "./StudioLogin";

export const metadata: Metadata = { title: "Studio", robots: { index: false, follow: false } };

export default async function StudioPage() {
  if (!(await isAuthed())) return <StudioLogin />;
  const [settings, products] = await Promise.all([getSettings(), getAllProducts()]);
  return (
    <StudioApp
      initialSettings={settings}
      initialProducts={products}
      defaultSettings={DEFAULT_SETTINGS}
      defaultProducts={DEFAULT_PRODUCTS}
    />
  );
}
