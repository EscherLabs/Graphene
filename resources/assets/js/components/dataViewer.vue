<script setup>
import { ref, watch, onMounted } from "vue";

import actionsBar from "./actionsBar.vue";

import reportCanvas from "./reportCanvas.vue";
import reportCalendar from "./reportCalendar.vue";

import pagination from "./pagination.vue";
import dataGrid from "./dataGrid.vue";
const props = defineProps({
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
  resource: {
    type: Object,
    default: {},
  },
});
const computedRecords = ref([]);
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
    } else {
      props.resource = report.config?.resource;
      const { states } = props.resource;

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
    }
    props.query = { limit: 10, page: 1 };
    if ("id" in oldReport && props.query.page !== 1) {
      setQuery({ ..._.omit(props.query, "state"), page: 1 });
    } else {
      getData();
    }
  }
);

const getData = () => {
  // document.app = app;
  // app.update({ data: [], waiting: true });
  const { id } = props.resource;
  props.records = [];
  props.status = "waiting";
  const { id: report_id } = props;
  const target = new URLSearchParams(props.query).toString();
  // if (!historyNavFlag.value) {
  //   history.pushState({ reportID: report_id }, null, `${report_id}?${target}`);
  // }
  // historyNavFlag.value = false;

  $.ajax({
    url: `/api/workflowinstances/${id}/paged_submissions?${target}`,
    contentType: "application/json",
    type: "GET",
    success: result => {
      props.records = result.data;
      if (
        !("map" in props.resource) ||
        typeof props.resource.map !== "object" ||
        !props.resource.map.length
      ) {
        computedRecords.value = _.map(props.records, data => {
          return { data, checked: false, id: data.id };
        });
      } else {
        computedRecords.value = _.map(props.records, record => {
          const data = $g.etl(
            $g.selectPath(record, props.resource.path || ""),
            record,
            props.resource.map
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
const rowClicked = ({ id }, action) => {
  console.log("event:" + action + ":" + id);
  window.open(`/workflows/report/${id}`, "_blank");
};
onMounted(() => {
  // debugger;
  // setQuery(Object.fromEntries(new URLSearchParams(document.location.search)));
  if ("id" in props.report) {
    props.id = props.report.id;
    getData();
  }
});
</script>
<template>
  <actionsBar
    :config="resource"
    @action="takeAction"
    v-if="report.config?.display !== 'calendar'"
  />

  <reportCalendar
    v-if="report.config?.display == 'calendar'"
    :records="records"
    :status="status"
    :config="resource"
    @query="setQuery"
    :query="query"
  />
  <reportCanvas
    v-if="report.config?.display == 'list'"
    :records="records"
    :columns="report.config?.columns"
    :status="status"
    :config="resource"
    @record="rowClicked"
  />
  <dataGrid
    v-if="report.config?.display == 'grid'"
    :records="computedRecords"
    :status="status"
    :config="resource"
    :schema="resource.schema"
    @record="rowClicked"
  />
  <pagination
    v-if="report.config?.display !== 'calendar'"
    :navInfo="navInfo"
    @query="setQuery"
    :query="query"
  />
</template>
