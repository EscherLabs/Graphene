<template>
  <section class="border-b border-gray-300 bg-white h-12 shrink-0">
    <ul class="flex gap-4 px-4 items-center h-full">
      <li
        v-for="action in actions"
        class="px-4 h-8 py-1 flex rounded-md items-center gap-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 border border-transparent hover:border-white cursor-pointer"
        :class="[
          !action.style
            ? 'bg-blue-100 hover:bg-blue-200 hover:text-blue-900 text-blue-700'
            : getStyle(action.style),
          (!('min' in action) || selected >= action.min) &&
          (!('max' in action) || selected <= action.max)
            ? ''
            : 'opacity-50',
        ]"
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
const getStyle = color => {
  return `bg-${color}-100 hover:bg-${color}-200 hover:text-${color}-900 text-${color}-700`;
};
const props = defineProps({
  selected: {
    type: Number,
    default: 0,
  },
  actions: {
    type: Array,
    default: [
      {
        label: "Edit",
        name: "edit",
        min: 1,
        max: 1,
        style: "emerald",
      },
      { label: "Delete", name: "delete", min: 1, style: "red" },
      { label: "View", name: "view", max: 1 },
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
