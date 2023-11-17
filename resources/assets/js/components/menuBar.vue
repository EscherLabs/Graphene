<template>
  <section class="border-b border-slate-200" id="basic" style="">
    <div
      class="py-3 px-4 flex sticky top-0 bg-slate-50 z-10"
      @click="isOpen = !isOpen"
    >
      <div class="flex w-full items-center">
        <span class="font-semibold text-sm uppercase text-slate-700"
          >Reports</span
        >
        <div class="ml-auto -my-1"></div>
        <span class="w-8 items-end">
          <svg
            class="float-right h-5 text-gray-800 transition-all"
            :class="{ 'rotate-90': isOpen }"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </span>
      </div>
    </div>

    <ul
      v-show="isOpen"
      id="reports"
      class="flex flex-col gap-1 mb-2 px-4 max-h-52 overflow-x-auto"
    >
      <li
        v-for="report in reports"
        class="px-4 py-2 flex rounded-md items-center gap-2 border border-transparent hover:border-white cursor-pointer"
        :class="
          report.id == id
            ? 'bg-blue-100 hover:bg-blue-200 hover:text-blue-800 text-blue-500'
            : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100 '
        "
        @click="go(report)"
      >
        <TableCellsIcon
          class="h-5 w-5 flex-shrink-0 opacity-75"
          v-if="report.config.display == 'grid'"
          aria-hidden="true"
        />
        <QueueListIcon
          class="h-5 w-5 flex-shrink-0 opacity-75"
          v-if="report.config.display == 'list'"
          aria-hidden="true"
        />
        <CalendarIcon
          class="h-5 w-5 flex-shrink-0 opacity-75"
          v-if="report.config.display == 'calendar'"
          aria-hidden="true"
        />

        <span class="truncate">{{ report.title }}</span>
        <span class="ml-auto flex-shrink-0"
          >({{ report.config.resource.id }})</span
        >
      </li>
    </ul>
  </section>
</template>

<script setup>
import {
  TableCellsIcon,
  CalendarIcon,
  QueueListIcon,
} from "@heroicons/vue/24/outline";

const emit = defineEmits(["report"]);

const props = defineProps({
  reports: Array,
  id: Object,
  isOpen: { default: true, type: Boolean },
  // apps: Array,
  // forms: Array,
  // resources: Array,
});
const go = report => {
  emit("report", report);
};
</script>
