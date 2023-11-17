<template>
  <tr
    class="h-16 flex items-stretch flex-shrink-0 odd:bg-slate-50 even:bg-white group hover:bg-blue-200 text-slate-600 hover:text-slate-700 divide-x border-gray-300"
  >
    <td
      @click.stop="mark()"
      class="w-14 flex items-center justify-center flex-grow-0 flex-shrink-0"
    >
      <span :class="checked ? 'hidden' : 'group-hover:hidden text-slate-500'">{{
        index
      }}</span>
      <CheckIcon
        :class="[
          'h-5 w-5 bg-white rounded border border-slate-400',
          checked
            ? 'block text-emerald-500'
            : 'hidden group-hover:block text-white ',
        ]"
        aria-hidden="true"
      />
    </td>
    <td
      v-for="field in schema"
      :data-col="field.name"
      :style="'width:var(--col-' + field.name + '-width)'"
      :class="[
        'grid-cell truncate',
        'px-4 py-2 w-72 flex flex-col flex-grow-0 flex-shrink-0',
      ]"
    >
      <div>{{ data[field.name] }}</div>
      <div>{{ data[field.secondary] }}</div>
    </td>
    <td class="flex-1"></td>
  </tr>
</template>
<script setup>
import { ref, watch } from "vue";

import { CheckIcon } from "@heroicons/vue/20/solid";
const mark = target => {
  // props.checked = !props.checked;
  emit("check", props.id);
};
const emit = defineEmits(["check"]);
// watch(
//   () => props.checked,
//   newVal => {
//     emit("check", newVal);
//   }
// );
var props = defineProps({
  data: {
    default: {},
    type: Object,
  },
  schema: {
    type: Array,
    default: [],
  },
  index: null,
  checked: false,
  id: null,
  key: null,
  // checked: false,
});
</script>
