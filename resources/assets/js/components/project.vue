<script setup>
import { ref, onMounted, watch } from "vue";

import menuBar from "./menuBar.vue";

const resource = ref({});
const historyNaveFlag = ref(true);
const computedRecords = ref([]);

const props = defineProps({
  reports: Array,
  id: Number,
  page: { type: Number, default: 1 },
  limit: { type: Number, default: 10 },
  query: {
    type: Object,
    default: { limit: 10, page: 1 },
  },
  records: { type: Array, default: [] },
  navInfo: {
    type: Object,
    default: {},
  },
  report: {
    type: Object,
    default: { config: { display: "" } },
  },
  status: {
    type: String,
    default: "",
  },
});

const setQuery = queryObj => {
  const { page = 1, limit = 10, q = "" } = props.query;
  props.query = { page, limit, q, ...queryObj };
  if (props.query.limit == undefined || props.query.limit == 10) {
    delete props.query.limit;
  }
  if (props.query.page == undefined || props.query.page == 1) {
    delete props.query.page;
  }
  if (props.query.q == undefined || props.query.q == "") {
    delete props.query.q;
  }
};
setQuery(Object.fromEntries(new URLSearchParams(document.location.search)));
const getData = () => {
  // document.app = app;
  // app.update({ data: [], waiting: true });
  const { id } = resource.value;
  props.records = [];
  props.status = "waiting";
  const { id: report_id } = props;
  const target = new URLSearchParams(props.query).toString();
  if (!historyNaveFlag.value) {
    history.pushState({ reportID: report_id }, null, `${report_id}?${target}`);
  }
  historyNaveFlag.value = false;

  $.ajax({
    url: `/api/workflowinstances/${id}/paged_submissions?${target}`,
    contentType: "application/json",
    type: "GET",
    success: result => {
      props.records = result.data;
      if (
        !("map" in resource.value) ||
        typeof resource.value.map !== "object" ||
        !resource.value.map.length
      ) {
        computedRecords.value = _.map(props.records, data => {
          return { data, checked: false, id: data.id };
        });
      } else {
        computedRecords.value = _.map(props.records, record => {
          const data = $g.etl(
            $g.selectPath(record, resource.value.path || ""),
            record,
            resource.value.map
          );
          return { data, checked: false, id: data.id };
        });
      }
      props.navInfo = _.omit(result, "data");
      props.status = "";
    },
    error: result => {
      props.status = "Error";
    },
  });
};
watch(
  () => props.query,
  () => {
    getData();
  }
);
watch(
  () => props.report,
  (report, oldReport) => {
    if (report == undefined) {
      return;
    }
    resource.value = report.config.resource;
    const { states } = resource.value;
    props.id = report.id;

    $g.collections.update(
      `_states`,
      _.map(states, item => {
        if (typeof item == "string") {
          return {
            label: item,
            value: item,
            styles: "",
          };
        }
        return {
          label: item.label,
          value: item.name,
          color: item.styles || "",
        };
      })
    );
    if ("id" in oldReport && props.query.page !== 1) {
      setQuery({ ..._.omit(props.query, "state"), page: 1 });
    } else {
      getData();
    }
  }
);
onMounted(() => {
  window.addEventListener("popstate", event => {
    if ("reportID" in event.state) {
      console.log("popped");
      historyNaveFlag.value = true;
      props.report = _.find(props.reports, { id: event.state.reportID });
    }
  });
  props.report = _.find(props.reports, { id: props.id });
  debugger;
  if (props.report !== undefined) resource.value = props.report.config.resource;

  // setQuery(Object.fromEntries(new URLSearchParams(document.location.search)));

  if (!props.report) {
    console.error("Report not Found!");
    return false;
  }
});
const takeAction = action => {
  console.log(action);
};
</script>
<template>
  <div class="flex-grow overflow-scroll flex">
    <aside
      class="flex-1 overflow-x-hidden w-72 max-w-[18rem] relative bg-slate-50 shadow-lg flex-col xl:block hidden border-gray-300 border-r"
    >
      <menuBar
        :reports="reports"
        :id="report ? report.id : null"
        @report="newreport => (report = newreport)"
      />
    </aside>
    <section
      class="overflow-x-hidden flex-1 flex-col justify-stretch relative bg-slate-200 min-w-[28rem] w-72 flex shadow-inner"
    ></section>
    <aside
      class="flex-1 overflow-x-hidden relative w-72 max-w-[18rem] hidden lg:block bg-slate-50 flex-col border-gray-300 border-l"
    ></aside>
  </div>
</template>
