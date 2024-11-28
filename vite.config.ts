import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), svgLoader()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    proxy: {
      "/api/naver": {
        target: "https://naveropenapi.apigw.ntruss.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/naver/, ""), // /api/naver 경로를 제거
      },
      "/api": {
        target: "https://openapi.naver.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // /api 경로를 제거
      },
    },
  },
});
