<template>
  <ul
    ref="table"
    class="grid divide-y absolute inset-0 overflow-auto border-b items-center justify-center bg-slate-200 bg-opacity-70"
    :class="reportClass"
    v-if="status !== '' || !records.length"
  >
    <div class="empty:hidden h-56 flex items-center justify-center">
      <div class="justify-self-center" role="status" v-if="status == 'waiting'">
        <svg
          aria-hidden="true"
          class="w-8 h-8 mr-2 flex-shrink-0 text-gray-200 animate-spin dark:text-gray-600 fill-brand-700"
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
        class="bg-orange-100 text-orange-600 p-4 rounded-md shadow-md"
        v-if="!records.length && status == ''"
      >
        No matching records found
      </span>
    </div>
  </ul>
  <div class="bg-slate-100">
    <div class="px-4 py-2 flex gap-2">
      <nav
        class="isolate inline-flex -space-x-px rounded-md shadow-sm"
        aria-label="Pagination"
      >
        <button
          v-for="link in navInfo.links"
          :href="link.url"
          @click.prevent="created_at(link.url)"
          :disabled="!link.url"
          data-paginate=""
          aria-current="page"
          :class="[
            'disabled:text-gray-400  disabled:ring-gray-300 disabled:hover:bg-gray-50 relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset focus:z-20 focus:outline-offset-0',
            link.active
              ? 'z-10    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600'
              : 'text-gray-900 ring-gray-300 hover:bg-gray-50',
            link.label == 'Previous' ? 'rounded-l-md' : '',
            link.label == 'Next' ? 'rounded-r-md' : '',
          ]"
        >
          <span class="sr-only">{{ link.label }}</span>
          <svg
            v-if="link.label == 'Previous'"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
              clip-rule="evenodd"
            />
          </svg>
          <span
            v-if="link.label !== 'Previous' && link.label !== 'Next'"
            class="text-gray-900"
            >{{ link.label }}</span
          >
          <svg
            v-if="link.label == 'Next'"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </nav>
      <span
        class="relative inline-flex items-center px-4 py-2 text-sm font-semibold"
        >{{ year }}</span
      >
    </div>
    <div class="grid grid-cols-7 justify-items-center bg-none gap-0.5 p-0.5">
      <div
        v-for="weekday in weekdays"
        class="hidden md:block w-full bold text-lg bg-white"
        style="color: #888"
      >
        <div style="text-align: center">{{ weekday }}</div>
      </div>
      <div
        v-for="weekday in shortdays"
        class="block md:hidden w-full bold text-lg bg-white"
        style="color: #888"
      >
        <div style="text-align: center">{{ weekday }}</div>
      </div>
      <div
        v-for="day in days"
        :class="day.contained ? 'bg-white' : 'bg-gray-100'"
        class="w-full flex flex-col gap-1 py-1"
        style="min-height: 12vh"
      >
        <div
          :class="
            day.isToday
              ? 'bg-blue-500 text-white'
              : day.events.length && day.contained
              ? 'bg-green-100 text-slate-700'
              : 'bg-gray-100 text-slate-700'
          "
          class="flex items-center justify-center ml-1 w-7 h-7 rounded-full"
          style="font-weight: 300"
        >
          {{ day.date }}
        </div>
        <template v-for="event in day.events">
          <div
            v-if="event.start !== event.end"
            :class="[
              event.start == day.date
                ? 'rounded-l ml-1 pl-1 border-l-none'
                : '',
              event.end == day.date ? 'mr-1 rounded-r pr-1 border-r-none' : '',
            ]"
            class="eventItem mb-0.5 px-2 py-0.5 text-sm bg-blue-400 text-white"
          >
            <span v-if="event.start == day.date">{{ event.title }}</span>
            <div v-if="event.start !== day.date" class="text-center">-</div>
          </div>
        </template>
        <div class="overflow-scroll" style="max-height: 60px">
          <template v-for="event in day.events">
            <div
              v-if="event.start == event.end"
              :class="[
                event.start == day.date
                  ? 'rounded-l ml-1 pl-1 border-l-none'
                  : '',
                event.end == day.date
                  ? 'mr-1 rounded-r pr-1 border-r-none'
                  : '',
              ]"
              class="eventItem mb-0.5 px-2 py-0.5 text-sm bg-blue-400 text-white"
            >
              <span v-if="event.start == day.date">{{ event.title }}</span>
              <div v-if="event.start !== day.date" class="text-center">-</div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, toRaw, computed, inject } from "vue";
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

const emit = defineEmits(["query"]);

const table = ref(null);
const computedRecords = ref([]);
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const shortdays = _.map(weekdays, day => day.substring(0, 3));
const date = ref(parse("2022-01-01", "yyyy-MM-dd", new Date()));
const month = ref("");
const year = ref("");

// const current = format(date, "MM/dd/yyyy");

const days = ref([]);
var props = defineProps({
  records: {
    default: [],
    type: Array,
  },
  status: {
    default: "",
    type: String,
  },
  navInfo: {
    type: Object,
    default: {},
  },
  config: {
    type: Object,
    default: {},
  },
  query: {
    type: Object,
    default: {},
  },
});
// const query = ref(inject("query", ""));
const created_at = url => {
  date.value = parse(url.split("=")[1].split(",")[0], "yyyy-MM-dd", new Date());

  emit("query", { created_at: url.split("=")[1] });
  debugger;
  // console.log(props.query);
  // genMenu();
};

const genMenu = () => {
  const [m, y] = format(date.value, "MMMM yyyy").split(" ");
  // debugger;
  month.value = m;
  year.value = y;
  const nextMonth = addMonths(date.value, 1);
  const next =
    "?created_at=" +
    format(startOfMonth(nextMonth), "yyyy-MM-dd") +
    "," +
    format(endOfMonth(nextMonth), "yyyy-MM-dd");
  const previousMonth = addMonths(date.value, -1);
  const previous =
    "?created_at=" +
    format(startOfMonth(previousMonth), "yyyy-MM-dd") +
    "," +
    format(endOfMonth(previousMonth), "yyyy-MM-dd");

  // const [month, year] = format(date, "MMMM yyyy").split(" ");

  props.navInfo.links = [
    { label: "Previous", url: previous },
    { label: m, active: true },
    { label: "Next", url: next },
  ];
};
genMenu();

emit("query", {
  created_at:
    format(startOfMonth(date.value), "yyyy-MM-dd") +
    "," +
    format(endOfMonth(date.value), "yyyy-MM-dd"),
}); // ",2022-01-30" });

const calcDays = () => {
  const offset = getDay(startOfMonth(date.value));
  const mLength = getDate(endOfMonth(date.value));
  const lim = (mLength + offset) % 7;
  const dayList = mLength + offset + (lim > 0 ? 7 - lim : 0);

  const isMonth = isSameMonth(new Date(), date.value);
  const today = isMonth ? getDate(new Date()) : 0;
  days.value = _.map(Array(dayList), (d, i) => {
    const cd = i - offset;

    const dayOfMonth = getDate(addDays(startOfMonth(date.value), cd));
    const contained = cd < 0 ? false : cd < mLength ? true : false;
    let eventList = [];
    // if(!isNaN(dayOfMonth)){
    if (contained) {
      eventList = _.sortBy(
        _.sortBy(
          _.filter(props.records, event => {
            // event.message = event.title;
            if (dayOfMonth >= event.start && dayOfMonth <= event.end) {
              return event;
            }
            // return
          }),
          "start"
        ),
        "allDay"
      );
    }
    return {
      date: dayOfMonth,
      events: eventList,
      contained,
      isToday: isMonth && today == dayOfMonth,
    };
  });
};
watch(
  () => props.records,
  newRecords => {
    if (
      !("map" in props.config) ||
      typeof props.config.map !== "object" ||
      !props.config.map.length
    ) {
      computedRecords.value = newRecords;
      return;
    }
    computedRecords.value = _.map(newRecords, record => {
      record.start = getDate(parseISO(record["created_at"]));
      record.end = getDate(
        parseISO(record["opened_at"] || record["created_at"])
      );
      return $g.etl(
        $g.selectPath(record, props.config.path || ""),
        record,
        props.config.map
      );
    });
    genMenu();

    calcDays();
    // console.log(newList);
    // debugger;
  }
);
onMounted(e => {
  genMenu();
  calcDays();

  // console.log("Cobler Mounted");
});

// const go = ({ id }) => {
//   window.open(`/workflows/report/${id}`, "_blank");
// };

// const statelabel = record => {
//   if (props.config.states && "state" in record) {
//     return _.find($g.collections.get("_states"), { value: record.state }).label;
//     // return record.state;
//   }
// };
// const stateClass = record => {
//   if (props.config.states && "state" in record) {
//     return _.find($g.collections.get("_states"), { value: record.state })
//       .styles;
//     // return record.state;
//   }
// };
// const reportClass = computed(() => {
//   if (props.status == "waiting") {
//     return "grid-cols-1";
//   }
//   const { columns = 1, padding = 4 } = props.config;
//   return `grid-cols-${columns} gap-${padding} p-${padding}`;
// });
</script>
