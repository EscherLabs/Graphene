<script setup>
import { ref, onMounted, watch } from "vue";

import menuBar from "./menuBar.vue";

import { CheckIcon } from "@heroicons/vue/20/solid";

const resource = ref({});
const historyNaveFlag = ref(true);

const props = defineProps({
  reports: Array,
  id: Number,
  project: Object,
  page: { type: Number, default: 1 },
  limit: { type: Number, default: 10 },

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
  // fields: {
  //   type: Object,
  //   default: {},
  // },
  states: {
    type: Object,
    default: {},
  },
});
const fields = ref([]);
const toggleField = field => {
  console.log(field);
  field.include = !field.include;
  debugger;
};
const save = async () => {
  const response = await fetch(`/api/reports/${props.report.id}`, {
    method: "PUT",
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },

    body: JSON.stringify({ fields: _.filter(fields.value, "include") }),
  })
    .then(res => {
      const { status, ok } = res;
      //   return { ok, status, body: await response.json() };
      if (!ok) {
        return res.text().then(text => {
          throw new Error(text);
        });
      } else {
        return res.json();
      }
    })
    .catch(error => {
      console.error(error);
    }); // body data type must match "Content-Type" header
};
const getData = () => {
  const { id } = resource.value;
  props.records = [];
  props.status = "waiting";
  if (!historyNaveFlag.value) {
    history.pushState(
      { reportID: props.report.id },
      null,
      `/admin/projects/${props.id}/reports/${props.report.id}`
    );
  }
  historyNaveFlag.value = false;
};

watch(
  () => props.report,
  async (report, oldReport) => {
    if (report == undefined) {
      props.report == props.reports[0];
      return;
    }
    resource.value = report.config.resource;
    const { states, schema = [] } = resource.value;
    // props.id = report.id;

    props.status = "waiting";
    const response = await fetch(`/api/workflowinstances/${report.id}`)
      .then(res => {
        const { status, ok } = res;
        //   return { ok, status, body: await response.json() };
        if (!ok) {
          return res.text().then(text => {
            throw new Error(text);
          });
        } else {
          return res.json();
        }
      })
      .catch(error => {
        console.error(error);
      }); // body data type must match "Content-Type" header

    const {
      name: instance_name,
      configuration,
      workflow: {
        description,
        code: { flow, form, map, methods, resources, templates },
        name,
        id,
      },
    } = response;
    // console.log(schema);
    debugger;
    fields.value = _.map(form.fields, field => {
      const { label, type = "text" } = field;
      const name = gform.formName(field);
      console.log(_.find(schema, { name }));
      return {
        name,
        label: label || name,
        type,
        include: _.find(schema, { name }) ? true : false,
      };
    });

    props.states = _.map(flow, state => {
      const { name, state_id: id } = state;
      return { id, name };
    });

    $g.collections.update(
      `states`,
      _.map(flow, state => {
        const { name, state_id: id } = state;
        return { id, name };
      })
    );

    getData();
  }
);
onMounted(() => {
  window.addEventListener("popstate", event => {
    if ("reportID" in event.state) {
      historyNaveFlag.value = true;
      props.report = _.find(props.reports, { id: event.state.reportID });
    }
  });

  props.report = props.reports.length ? props.reports[0] : null;
  // props.report = _.find(props.reports, { id: props.id });
  if (props.report !== undefined) resource.value = props.report.config.resource;

  if (!props.report) {
    if (props.reports.length) {
      props.report = props.reports[0];
    } else {
      console.error("Report not Found!");
      return false;
    }
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
        :id="report ? report.id : reports[0].id"
        @report="newreport => (report = newreport)"
      />
    </aside>
    <section
      class="overflow-x-hidden flex-1 flex-col justify-stretch relative bg-slate-200 min-w-[28rem] w-72 flex shadow-inner"
    >
      <div class="p-4 flex gap-2 justify-end">
        <button
          type="button"
          @click="save"
          class="bg-green-400 text-green-500 p-2 border rounded border-green-500 active:bg-green-200 active:order-green-300 hover:opacity-100 opacity-75"
        >
          SAVE
        </button>
      </div>
      <ul class="flex flex-col gap-2 border border-gray-300 m-4 p-2 w-1/3">
        <li
          @click="toggleField(field)"
          v-for="field in fields"
          :field="field"
          class="border border-gray-300 p-2 flex justify-between"
        >
          <div>{{ field.label }} {{ field.type }}</div>
          <CheckIcon
            v-if="field.include"
            :class="[
              'h-5 w-5 bg-white rounded border border-slate-400 text-emerald-500 block',
            ]"
            aria-hidden="true"
          />
        </li>
      </ul>

      <ul class="flex flex-col gap-2 border border-gray-300 m-4 p-2 w-1/3">
        <li v-for="state in states" class="border border-gray-300 p-2">
          {{ state.name }} {{ state.id }}
        </li>
      </ul>
    </section>
    <aside
      class="flex-1 overflow-x-hidden relative w-72 max-w-[18rem] hidden lg:block bg-slate-50 flex-col border-gray-300 border-l"
    ></aside>
  </div>
</template>
