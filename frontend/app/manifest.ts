import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Convert Any File to Markdown`,
    short_name: SITE_NAME,
    description: "Free online tool to convert any file to Markdown",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4281A4",
    orientation: "portrait-primary",
    categories: ["productivity", "utilities"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
