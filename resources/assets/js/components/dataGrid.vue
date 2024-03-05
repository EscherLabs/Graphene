<template>
  <table class="block relative flex-grow overflow-x-auto">
    <thead class="block w-fit min-w-full">
      <tr
        class="noselect flex h-10 divide-x items-center bg-slate-50 border-b border-b-slate-300"
      >
        <th
          class="cursor-pointer select-col w-14 text-slate-600 font-normal flex-grow-0 flex-shrink-0 flex justify-center"
          @click="toggleAll"
        >
          <div
            class="h-5 w-5 bg-white rounded border border-slate-400 items-center justify-center inline-flex"
            :title="selected"
          >
            <CheckIcon
              class="text-emerald-500 block"
              v-if="selected >= computedRecords.length"
              aria-hidden="true"
            />
            <span
              class="text-blue-500"
              v-show="selected > 0 && selected < computedRecords.length"
              >-</span
            >
            <span class="text-white hover:text-gray-200" v-show="selected == 0"
              >+</span
            >
          </div>
        </th>
        <th
          v-for="field in schema"
          :data-col="field.name"
          :style="'width:var(--col-' + field.name + '-width)'"
          class="empty:hidden grid-cell px-4 text-slate-600 whitespace-nowrap flex items-center gap-2 font-normal w-72 flex-grow-0 flex-shrink-0 truncate"
        >
          <span
            v-if="!('include' in field) || field.include"
            class="cursor-pointer"
            @click="sortBy(field)"
            >{{ field.label }}</span
          >
          <div
            class="flex flex-col cursor-pointer"
            v-if="field.include || !('include' in field)"
          >
            <ChevronUpIcon
              @click="sortBy(field, 1)"
              class="h-5 w-5 hover:text-slate-400 relative top-1"
              aria-hidden="true"
            /><ChevronDownIcon
              @click="sortBy(field, -1)"
              class="h-5 w-5 hover:text-slate-400 relative bottom-1"
              aria-hidden="true"
            />
          </div>
        </th>
        <th class="flex-grow h-10"></th>
      </tr>
    </thead>

    <tbody
      class="overflow-x-hidden flex flex-col absolute bottom-0 top-10 overflow-auto divide-y min-w-full"
      v-if="status == ''"
    >
      <gridRow
        v-for="(record, index) in computedRecords"
        :index="index"
        :key="record.id"
        :id="record.id"
        :data="record.data"
        :checked="record.checked"
        @check="check"
        @click="rowClick(record)"
        ref="rows"
        :schema="schema"
      ></gridRow>
    </tbody>
  </table>

  <div
    class="empty:hidden absolute inset-x-0 top-10 bottom-auto h-56 flex items-center justify-center"
  >
    <div role="status" v-if="status == 'waiting'">
      <svg
        aria-hidden="true"
        class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-brand-700"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span class="sr-only">Loading...</span>
    </div>
    <p
      class="text-error-600 bg-error-100 p-4 rounded-md"
      v-if="status && status !== 'waiting'"
    >
      {{ status }}
    </p>
    <span
      class="bg-orange-100 text-orange-600 p-4 rounded-md"
      v-if="!records.length && status == ''"
    >
      No matching records found
    </span>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, toRaw } from "vue";
import {
  ChevronUpDownIcon,
  CheckIcon,
  MinusIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/vue/20/solid";

import {
  format,
  endOfMonth,
  startOfMonth,
  getDay,
  addDays,
  addMonths,
  // getMonth,
  // getYear,
  isSameMonth,
  getDate,
  parseISO,
  parse,
} from "date-fns";

import gridRow from "./gridRow.vue";

const emit = defineEmits(["selection"]);

const table = ref(null);
const computedRecords = ref([]);

const rows = ref(null);
const selected = ref(0);
var props = defineProps({
  records: {
    default: [],
    type: Array,
  },
  schema: {
    default: [
      {
        name: "title",
        label: "Title",
        locked: true,
      },
      {
        name: "state",
        label: "State",
        locked: false,
      },
      {
        name: "status",
        label: "Status",
        locked: false,
      },
      {
        name: "opened_at",
        label: "Opened At",
        type: "date",
        locked: false,
      },
    ],
    type: Array,
  },

  status: {
    default: "",
    type: String,
  },
  // navInfo: {
  //   type: Object,
  //   default: {},
  // },
  config: {
    type: Object,
    default: {},
  },
});

// const lockedSchema = ref(_.filter(props.schema, { locked: true }));
watch(
  () => props.records,
  newRecords => {
    // computedRecords.value = newRecords;
    if (
      !("map" in props.config) ||
      typeof props.config.map !== "object" ||
      !props.config.map.length
    ) {
      computedRecords.value = newRecords;
      return;
    }
    computedRecords.value = _.map(newRecords, item => {
      const record = item.data;
      record.start = getDate(parseISO(record["created_at"]));
      record.end = getDate(
        parseISO(record["opened_at"] || record["created_at"])
      );
      item.data = $g.etl(
        $g.selectPath(record, props.config.path || ""),
        record,
        props.config.map
      );
      return item;
    });

    selected.value = 0;
    emit("selection", selected.value);
  }
);

const loadSchema = schema => {
  _.each(schema, field => {
    document
      .querySelector(":root")
      .style.setProperty(
        "--col-" + field.name + "-width",
        field.width || "24rem"
      );
  });
};

watch(() => props.schema, loadSchema);
onMounted(e => {
  loadSchema(props.schema);
});
const check = (id, target) => {
  const record = _.find(computedRecords.value, { id });
  if (record == null) return;
  record.checked = typeof target == "boolean" ? target : !record.checked;

  updateSelected();
};

const rowClick = record => {
  console.log("Clicked on row:" + record.id);
};
const updateSelected = () => {
  selected.value = _.filter(computedRecords.value, "checked").length;
  emit("selection", selected.value);
};
const toggleAll = () => {
  const targetChecked = selected.value == 0;

  _.each(computedRecords.value, record => {
    record.checked = targetChecked;
  });
  selected.value = targetChecked ? computedRecords.value.length : 0;
  emit("selection", selected.value);
};

const sortBy = (field, direction = 0) => {
  console.log(field.name + (direction ? direction : "toggle"));
};

const colorClaim = (col, index) => {
  const root = document.querySelector(":root");

  root.style.setProperty(
    `--col-${col}-color`,
    _.map(["slate-5", "green-5", "red-50"], i => `var(--color-${i}0)`)[index] //_.random(0, 9)
  );
};
const colorRelease = (col, index) => {
  const root = document.querySelector(":root");

  root.style.setProperty(
    `--col-${col}-color`,
    _.map(
      [5, 10, 20, 30, 40, 50, 60, 70, 80, 90],
      i => `var(--color-brand-${i}0)`
    )[index] //_.random(0, 9)
  );
};
const go = ({ id }) => {
  window.open(`/workflows/report/${id}`, "_blank");
};

const statelabel = record => {
  if (props.config.states && "state" in record) {
    return _.find($g.collections.get("_states"), { value: record.state }).label;
    // return record.state;
  }
};
const stateClass = record => {
  if (props.config.states && "state" in record) {
    return _.find($g.collections.get("_states"), { value: record.state })
      .styles;
    // return record.state;
  }
};
/*

{{#if assignment_type=="user"}}
{{#assignee}}
<a
  target="_blank"
  class="text-blue-500"
  href="mailto:{{email}}"
>{{first_name}} {{last_name}}</a>
{{/assignee}}
{{/if}}

{{#if assignment_type=="group"}}
{{#assignee}}
<a target="_blank" class="text-blue-500" href="/page/{{slug}}">{{name}}</a>
{{/assignee}}
{{/if}}

*/
</script>
<!-- <style>
#script {
  color: v-bind("colorFromScript");
}

#scriptSetup {
  color: v-bind("colorFromScriptSetup");
}
</style> -->

<style>
:root {
  /* --col-title-width: 25em; */
  /* --col-state-width: 25em; */
  --col-title-color: var(--color-slate-50);
  --col-state-color: var(--color-slate-50);
}
/* [data-col="title"] {
  width: var(--col-title-width);
  background-color: var(--col-title-color);
}
[data-col="state"] {
  width: var(--col-state-width);
  background-color: var(--col-state-color);
} */
[data-col] {
  /* flex-grow: 0; */
}
</style>
