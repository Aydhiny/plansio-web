/*
 * Sanity Studio schema for the `product` document — mirrors lib/products.ts.
 * Drop this into a Sanity Studio (v3+) schemaTypes, then set these env vars on
 * the site (e.g. Vercel):
 *   SANITY_PROJECT_ID=xxxx
 *   SANITY_DATASET=production
 * The site's data layer (lib/products.ts) auto-switches to Sanity once
 * SANITY_PROJECT_ID is present, and falls back to local seed data otherwise.
 */
import { defineField, defineType } from "sanity";

const localizedString = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    fields: [
      { name: "en", title: "English", type: "string" },
      { name: "bs", title: "Bosnian", type: "string" },
    ],
  });

const localizedText = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    fields: [
      { name: "en", title: "English", type: "text" },
      { name: "bs", title: "Bosnian", type: "text" },
    ],
  });

export default defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "order", title: "Order", type: "number" }),
    defineField({ name: "featured", title: "Featured on home", type: "boolean", initialValue: false }),
    localizedString("category", "Category"),
    localizedString("tagline", "Tagline"),
    localizedText("description", "Description"),
    defineField({ name: "url", title: "Live URL", type: "url", validation: (r) => r.required() }),
    defineField({ name: "liveEmbed", title: "Embed live app", type: "boolean", initialValue: true }),
    defineField({ name: "poster", title: "Poster image URL", type: "string" }),
    defineField({ name: "accent", title: "Accent colour (hex)", type: "string", initialValue: "#6a22d8" }),
    defineField({ name: "year", title: "Year", type: "string" }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["live", "beta", "wip"] },
      initialValue: "live",
    }),
    defineField({ name: "platforms", title: "Platforms", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "tech", title: "Tech stack", type: "array", of: [{ type: "string" }] }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [
        {
          type: "object",
          fields: [localizedString("title", "Title"), localizedText("body", "Body")],
        },
      ],
    }),
    defineField({
      name: "metrics",
      title: "Metrics",
      type: "array",
      of: [
        {
          type: "object",
          fields: [{ name: "value", title: "Value", type: "string" }, localizedString("label", "Label")],
        },
      ],
    }),
    defineField({
      name: "related",
      title: "Related products",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    }),
  ],
});
