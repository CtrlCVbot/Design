import type { MetadataRoute } from "next";
const routes = ["", "/services", "/reviews", "/conditions", "/about", "/contact"];
export default function sitemap(): MetadataRoute.Sitemap { return routes.map((route) => ({ url: `https://alliance-homecare.vercel.app${route}` })); }
