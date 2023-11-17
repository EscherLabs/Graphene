import { defineConfig } from "vite";
// import laravel from "laravel-vite-plugin";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  optimizeDeps: {
    // exclude: ["lodash"],
  },
  publicDir: "fake_dir_so_nothing_gets_copied",

  build: {
    manifest: true,
    minify: false,
    outDir: "public/build",
    rollupOptions: {
      input: [
        // "resources/assets/js/components/configBar.vue",
        "resources/assets/js/reports.js",
        "resources/assets/js/project.js",
        "resources/assets/js/adminProject.js",
      ],
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
