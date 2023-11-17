import { ref, createApp, h } from "vue";
import reports from "./components/reports.vue";

createApp({
  render: () => h(reports, document.initialData),
}).mount("#app");
