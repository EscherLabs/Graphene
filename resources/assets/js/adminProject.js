import { ref, createApp, h } from "vue";
import adminProject from "./components/adminProject.vue";

createApp({
  render: () => h(adminProject, document.initialData),
}).mount("#app");
