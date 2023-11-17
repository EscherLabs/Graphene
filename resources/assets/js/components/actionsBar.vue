<template>
  <section class="border-b border-gray-300 bg-white h-12 shrink-0">
    <ul class="flex gap-4 px-4 items-center h-full">
      <li
        v-for="action in actions"
        class="px-4 h-8 py-1 flex rounded-md items-center gap-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 border border-transparent hover:border-white cursor-pointer"
        :class="'bg-blue-100 hover:bg-blue-200 hover:text-blue-900 text-blue-700'"
        @click="take(action)"
      >
        <span class="truncate"> {{ action.label }}</span>
      </li>
    </ul>
  </section>
</template>

<script setup>
// import { Icon } from "@iconify/vue";
import {
  TableCellsIcon,
  CalendarIcon,
  QueueListIcon,
} from "@heroicons/vue/20/solid";

const emit = defineEmits(["action"]);

const props = defineProps({
  actions: {
    type: Array,
    default: [
      { label: "Edit", name: "edit" },
      { label: "View", name: "view" },
    ],
  },
});
const take = report => {
  emit("action", report);

  // document.location = "./" + report.id;
};

// onMounted(e => {
//   console.log("Cobler Mounted");
// });
</script>
