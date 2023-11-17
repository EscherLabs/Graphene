import { ref, createApp, h } from "vue";
import project from "./components/project.vue";

createApp({
  render: () => h(project, document.initialData),
}).mount("#app");
