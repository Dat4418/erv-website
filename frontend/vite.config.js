// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    configureServer: (server) => {
      server.middlewares.use((req, res, next) => {
        res.setHeader(
          "Content-Security-Policy",
          [
            "default-src 'self';",
            "img-src 'self' http://localhost:3001 data:;",
            "script-src 'self' 'unsafe-inline' https://apis.google.com;",
            "style-src 'self' 'unsafe-inline';",
          ].join(" ")
        );
        next();
      });
    },
  },
});
