import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

const host = process.env.TAURI_DEV_HOST;

export default defineConfig(async () => ({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },

    clearScreen: false,
    server: {
        port: 1420,
        strictPort: true,
        host: host || false,
        hmr: host
            ? {
                  protocol: "ws",
                  host,
                  port: 1421,
              }
            : undefined,
        watch: {
            ignored: ["**/src-tauri/**"],
        },
        proxy: {
            "/antp": {
                target: "http://127.0.0.1:18888",
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/antp/, ""),
                configure: (proxy, options) => {
                    proxy.on("proxyRes", (proxyRes, req, res) => {
                        if (req.url?.endsWith(".css")) {
                            proxyRes.headers["content-type"] = "text/css";
                        }
                        if (req.url?.endsWith(".js")) {
                            proxyRes.headers["content-type"] =
                                "application/javascript";
                        }
                    });
                },
            },
        },
    },
}));
