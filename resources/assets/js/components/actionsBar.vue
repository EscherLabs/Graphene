<template>
  <section class="h-12 shrink-0">
    <ul class="flex gap-4 px-4 items-center h-full">
      <li
        v-for="action in actions"
        class="px-4 h-8 py-1 flex rounded-md items-center gap-2 border cursor-pointer"
        :class="[
          !action.style && false
            ? 'bg-blue-100 hover:bg-blue-200 hover:text-blue-900 text-blue-700 bg-red-100 hover:bg-red-200 hover:text-red-900 text-red-700 bg-green-100 hover:bg-green-200 hover:text-green-900 text-green-700 border-green-500 border-blue-500 border-red-500'
            : getStyle(action.style),
          (!('min' in action) || selected >= action.min) &&
          (!('max' in action) || selected <= action.max)
            ? ''
            : 'opacity-50 ',
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
const getStyle = (color = "blue") => {
  return `bg-${color}-100 hover:bg-${color}-200 hover:text-${color}-900 text-${color}-700 border-${color}-500`;
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
        style: "green",
      },
      { label: "Delete", name: "delete", min: 1, style: "red" },
      { label: "View", name: "view", max: 1 },
    ],
  },
});
const take = action => {
  emit("action", action);
};

// onMounted(e => {
//   console.log("Cobler Mounted");
// });
</script>
