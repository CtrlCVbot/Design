import type { MetadataRoute } from "next";
const routes = ["", "/v1", "/v2", "/services", "/reviews", "/conditions", "/about", "/contact"];
export default function sitemap(): MetadataRoute.Sitemap { return routes.map((route) => ({ url: `https://alliance-homecare.vercel.app${route}` })); }
