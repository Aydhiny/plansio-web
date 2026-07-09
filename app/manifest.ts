import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Plansio — Marketing · Design · Software · Games",
    short_name: "Plansio",
    description: "A full-stack studio for marketing, design, software and games.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [{ src: "/icon.png", sizes: "256x256", type: "image/png", purpose: "any" }],
  };
}
