import { defineConfig } from "vite";
// import laravel from "laravel-vite-plugin";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  optimizeDeps: {
    // exclude: ["lodash"],
  },
  build: {
    target: "es2020",
    commonjsOptions: {
      sourceMap: false,
    },
  },
  plugins: [
    vue({
      template: {
        transformAssetUrls: {
          base: null,
          includeAbsolute: false,
        },
      },
    }),
  ],
});
