import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: "autoUpdate",
			includeAssets: ["logo-gapsi.png", "pwa-192x192.png", "pwa-512x512.png"],
			workbox: {
				globPatterns: ["**/*.{js,css,html,png,svg,ico,webp,jpg}"],
			},
			manifest: {
				name: "e-Commerce Gapsi",
				short_name: "Gapsi",
				description: "Administración de proveedores de e-Commerce Gapsi.",
				theme_color: "#078bb5",
				background_color: "#f7f8fa",
				display: "standalone",
				start_url: "/",
				icons: [
					{
						src: "/pwa-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "/pwa-512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
				],
			},
		}),
	],
});
