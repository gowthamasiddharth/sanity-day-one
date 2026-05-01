import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "8ltev99m",
  dataset: "production",
  apiVersion: "2026-05-01",
  useCdn: false,
});