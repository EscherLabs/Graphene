<script setup>
import { ref, onMounted, watch, toRaw } from "vue";

import {
  // PopoverArrow,
  // PopoverClose,
  // PopoverContent,
  // PopoverPortal,
  // PopoverRoot,
  // PopoverTrigger,
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "radix-vue";

import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  Popover,
  PopoverButton,
  PopoverPanel,
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from "@headlessui/vue";

import menuBar from "./menuBar.vue";
import waiting from "./waiting.vue";
import collapseSection from "./collapseSection.vue";
import dataViewer from "./dataViewer.vue";
import { CheckIcon } from "@heroicons/vue/20/solid";

// import reportCanvas from "./reportCanvas.vue";
// import reportCalendar from "./reportCalendar.vue";

// import pagination from "./pagination.vue";
// import dataGrid from "./dataGrid.vue";

import { Icon } from "@iconify/vue";
// import { Input} from "radix-vue";
// import { Checkbox } from "radix-vue";
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
  fields: {
    type: Object,
    default: [],
  },
  states: {
    type: Object,
    default: [],
  },
  map: {
    type: Object,
    default: [],
  },
});

const primary = ref(props.fields[0]);
const secondary = ref(props.fields[1]);

const toggleField = field => {
  props.status = "changed";
  field.include = !field.include;

  props.fields = _.orderBy(
    props.fields,
    ["include", "order", "name"],
    ["desc", "asc", "asc"]
  );

  // props.reports[3].config.schema = _.map(_.filter(props.fields, "include"), i =>
  //   _.omit(i, "key")
  // );

  // props.report = props.report.id
  // props.report = props.reports[3];
  debugger;
};
const toggleState = state => {
  props.status = "changed";
  state.include = !state.include;

  props.states = _.orderBy(
    props.states,
    ["include", "order", "name"],
    ["desc", "asc", "asc"]
  );
};
const save = async report => {
  console.debug("Save Called");

  props.status = "waiting";
  debugger;
  let content = {
    schema: _.map(_.filter(props.fields, "include"), i =>
      _.omit(i, "include", "key")
    ),
    states: _.map(_.filter(props.states, "include"), i =>
      _.omit(i, "include", "key")
    ),
    map: _.map(props.map, i => _.omit(i, "key")),
    name: report.name,
    display: report.config.display,
    resource: report.config.resource.id,
    // description: props.report.description,
  };
  if (primary.value) content.primary = primary.value;
  if (secondary.value) content.secondary = secondary.value;
  var reports = toRaw(props.reports);
  // props.reports = [];

  const response = await fetch(
    `/api/projects/${props.id}/reports/${report.id}`,
    {
      method: report.id ? "PUT" : "POST",
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },

      body: JSON.stringify(content),
    }
  )
    .then(res => {
      const { status, ok } = res;
      //   return { ok, status, body: await response.json() };
      if (!ok) {
        return res.text().then(text => {
          throw new Error(text);
        });
      } else {
        props.status = "success";

        $g.alert({ type: "success", title: "Project Updated Successfully!" });

        return res.json();
      }
    })
    .then(({ id }) => {
      // props.report = _.find(props.reports, { id: report.id });

      reports.splice(_.findIndex(reports, { id }), 1, props.report);
      props.reports = reports;

      // console.log(props.reports[_.findIndex(props.reports, { id: props.id })]);
    })
    .catch(error => {
      props.status = "error";

      $g.alert({ type: "error", title: "Error Saving" });
      console.error(error);
    }); // body data type must match "Content-Type" header
};

const detach = async report => {
  console.debug("Detach Called");
  console.debug(report);

  props.status = "waiting";
  debugger;
  // let content = {
  //   schema: _.map(_.filter(props.fields, "include"), i =>
  //     _.omit(i, "include", "key")
  //   ),
  //   states: _.map(_.filter(props.states, "include"), i =>
  //     _.omit(i, "include", "key")
  //   ),
  //   map: _.map(props.map, i => _.omit(i, "key")),
  //   name: report.name,
  //   display: report.config.display,
  //   resource: report.config.resource.id,
  //   // description: props.report.description,
  // };
  // if (primary.value) content.primary = primary.value;
  var reports = toRaw(props.reports);
  // props.reports = [];

  const response = await fetch(
    `/api/projects/${props.id}/reports/${report.id}`,
    {
      method: "DELETE",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
    }
  )
    .then(res => {
      const { status, ok } = res;
      if (!ok) {
        return res.text().then(text => {
          throw new Error(text);
        });
      } else {
        props.status = "success";

        $g.alert({ type: "success", title: "Report Removed Successfully!" });

        return res.json();
      }
    })
    .then(({ id }) => {
      reports.splice(_.findIndex(reports, { id }), 1);
      props.reports = reports;
      // props.report == props.reports[0];
    })
    .catch(error => {
      props.status = "error";
      $g.alert({ type: "error", title: "Error Removing Report" });
      console.error(error);
    }); // body data type must match "Content-Type" header
};
const getData = () => {
  const { id } = resource.value;
  props.records = [];
  // props.status = "waiting";
  if (!historyNaveFlag.value) {
    history.pushState(
      { reportID: props.report.id },
      null,
      `/admin/projects/${props.id}/reports/${props.report.id}`
    );
  }
  historyNaveFlag.value = false;
};
const dataForm = ref({});

watch(
  () => props.report,
  async (report, oldReport) => {
    if (report == undefined) {
      props.report == props.reports[0];
      return;
    }
    // if (report.id == -1) return;
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
          props.status = "success";
          return res.json();
        }
      })
      .catch(error => {
        props.status = "error";
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

    props.fields = _.orderBy(
      _.map(
        _.uniqBy(
          _.map(
            form.fields.concat(report.config.resource.schema || []).concat([
              {
                name: "created_at",
                label: "Created",
                type: "datetime",
                display: "[created_at:yyyy-MM-dd]",
              },
              {
                name: "opened_at",
                label: "Opened",
                type: "datetime",
                display: "[opened_at:yyyy-MM-dd]",
              },
              {
                name: "updated_at",
                label: "Updated",
                type: "datetime",
                display: "[Updated:yyyy-MM-dd]",
              },
              {
                name: "deleted_at",
                label: "Deleted",
                type: "datetime",
                display: "[deleted_at:yyyy-MM-dd]",
              },
              {
                name: "status",
                label: "Status",
                type: "smallcombo",
              },
              {
                name: "state",
                label: "State",
                type: "smallcombo",
              },
              {
                name: "owner",
                label: "Owner",
                type: "user",
                display: "{{owner.first_name}} {{owner.last_name}}",
              },
              {
                name: "assignee",
                label: "Assignee",
                type: "user",
                display: "{{owner.first_name}} {{owner.last_name}}",
              },
            ]),
            field => {
              field.name = gform.formName(field);
              return field;
            }
          ),
          "name"
        ),
        (field, index) => {
          field.include = !!_.find(report.config.resource.schema, {
            name: field.name,
          });
          field.key = index;
          return field;
        }
      ),
      ["include", "order", "key"],
      ["desc", "asc", "asc"]
    );
    $g.collections.update(`fields`, props.fields);

    props.states = _.orderBy(
      _.compact(
        _.map(report.config.resource.states || [], item => {
          if (typeof item == "string") {
            return {
              label: item,
              name: item,
              styles: "",
              id: item,
              include: true,
              status: item.status,
            };
          }
          return {
            label: item.label || item.name,
            name: item.name,
            color: item.styles || "",
            id: item.state_id || item.name,
            status: item.status,
            include: true,
          };
        }).concat(
          _.map(flow, state => {
            const { name, state_id: id, label, styles, status } = state;
            if (!_.find(report.config.resource.states, { name })) {
              return { id, name, label, styles, status, include: false };
            }
          })
        )
      ),
      ["include", "order", "name"],
      ["desc", "asc", "asc"]
    );
    $g.collections.update(`states`, props.states);

    props.map = _.map(report.config.resource.map || [], item => {
      return item;
    });
    $g.collections.update(`map`, props.map);
    if (data in gform.instances) {
      gform.instances.data.set(
        _.pick(props.report.config.resource, "primary", "secondary")
      );
      getData();
    }
  }
);
watch(
  () => props.reports,
  (reports, oldList) => {
    // if (reports.length > oldList.length) console.log("new");
    // if (reports.length < oldList.length) console.log("removed");
  }
);
onMounted(() => {
  window.addEventListener("popstate", event => {
    if ("reportID" in event.state) {
      historyNaveFlag.value = true;
      props.report = _.find(props.reports, { id: event.state.reportID });
    }
  });
  // if (props.report.id == undefined) {
  props.report = props.reports.length
    ? _.find(props.reports, { id: props.report.id }) || props.reports[0]
    : null;
  // }
  // else if (!("config" in props.report)) {
  //   debugger;
  //   props.report = _.find(props.reports, { id: props.report.id });
  // }

  if (props.report !== undefined) resource.value = props.report.config.resource;

  if (!props.report) {
    if (props.reports.length) {
      props.report = props.reports[0];
    } else {
      console.error("Report not Found!");
      return false;
    }
  }
  new gform(
    {
      name: "data",
      legend: false,
      data: _.pick(props.report.config.resource, "primary", "secondary"),
      actions: [],
      fields: [
        {
          label: "Primary",
          name: "primary",
          type: "combobox",
          target: "#primary",
          options: [
            {
              type: "optgroup",
              path: "fields",
              format: {
                display:
                  '{{label}}<div class="text-gray-300">{{display}}</div>',
                label: "{{label}}",
                value: field => {
                  return `data.${field.name}`;
                },
              },
            },
          ],
        },
        {
          label: "Secondary",
          name: "secondary",
          type: "combobox",
          options: [
            {
              type: "optgroup",
              path: "fields",
              format: {
                display:
                  '{{label}}<div class="text-gray-300">{{display}}</div>',
                label: "{{label}}",
                value: field => {
                  return `data.${field.name}`;
                },
              },
            },
          ],
        },
      ],
    },
    dataForm.value
  ).on("change", ({ form }) => {
    debugger;
    if (
      props.report.config.resource.primary == form.get("primary") &&
      props.report.config.resource.secondary == form.get("secondary")
    )
      return;

    primary.value = form.get("primary");
    secondary.value = form.get("secondary");
    props.status = "changed";
  });
});
const takeAction = action => {
  console.debug("Action: " + action);
};
const editField = field => {
  console.debug("Editing Field:");
  console.debug(field);
  new gform({
    legend: "Edit Field",
    data: field,
    fields: [
      { label: "Label" },
      { label: "Display", parse: [{ type: "requires" }] },
    ],
  })
    .on("cancel", e => {
      e.form.destroy();
    })
    .on("save", e => {
      props.status = "changed";
      Object.assign(field, e.form.toJSON());
      props.fields = _.orderBy(
        props.fields,
        ["include", "order", "name"],
        ["desc", "asc", "asc"]
      );
      e.form.trigger("close");
    })
    .modal();
};

const editState = state => {
  console.debug("Edit State:");
  console.debug(state);

  console.debug("For Field:");
  console.debug(field);

  new gform({
    legend: "Edit State",
    data: state,
    fields: [
      {
        label: "Name",
        edit: false,
        required: true,
      },
      { label: "Label", parse: [{ type: "requires" }] },
    ],
  })
    .on("cancel", e => {
      e.form.destroy();
    })
    .on("save", e => {
      props.status = "changed";
      Object.assign(state, e.form.toJSON());
      props.states = _.orderBy(
        props.states,
        ["include", "order", "name"],
        ["desc", "asc", "asc"]
      );
      e.form.trigger("close");
    })
    .modal();
};
const editTransform = transform => {
  console.debug("Edit Transform");

  console.debug(transform);
  new gform({
    legend: "Edit Transform",
    data: transform,
    collections: $g.collections,

    fields: [
      {
        label: "Source",
        name: "source",
        type: "combobox",
        options: [
          {
            type: "optgroup",
            path: "fields",
            format: {
              display: '{{label}}<div class="text-gray-300">{{display}}</div>',
              label: "{{label}}",
              value: field => {
                return `data.${field.name}`;
              },
            },
          },
        ],
      },
      { label: "Target", parse: [{ type: "requires" }] },
      { type: "hidden", name: "include", value: true },
    ],
  })
    .on("cancel", e => {
      e.form.destroy();
    })
    .on("save", e => {
      props.status = "changed";

      Object.assign(transform, e.form.toJSON());
      props.map = _.orderBy(props.map, ["name"], ["asc"]);
      e.form.trigger("close");
    })
    .modal();
};

const addMap = () => {
  new gform({
    legend: "Add Transform",
    collections: $g.collections,

    fields: [
      {
        label: "Source",
        name: "source",
        type: "combobox",
        options: [
          {
            type: "optgroup",
            path: "fields",
            format: {
              display: '{{label}}<div class="text-gray-300">{{display}}</div>',
              label: "{{label}}",
              value: field => {
                return `data.${field.name}`;
              },
            },
          },
        ],
      },
      { label: "Target", parse: [{ type: "requires" }] },
    ],
  })
    .on("cancel", e => {
      e.form.destroy();
    })
    .on("save", e => {
      props.status = "changed";
      debugger;
      // Object.assign(transform, e.form.toJSON());
      // props.map =
      props.map.push(e.form.toJSON());
      props.map = _.orderBy(props.map, ["name"], ["asc"]);

      e.form.trigger("close");
    })
    .modal();
};

const addState = () => {
  new gform({
    legend: "Add State",
    collections: $g.collections,

    fields: [
      { name: "include", type: "hidden", parse: true, value: true },
      // { name: "state", type: "hidden", parse: [{ type: "requires" }] },

      { label: "Name", parse: [{ type: "requires" }] },
      { label: "Label", parse: [{ type: "requires" }] },
    ],
  })
    .on("cancel", e => {
      e.form.destroy();
    })
    .on("save", e => {
      props.status = "changed";
      debugger;
      // Object.assign(transform, e.form.toJSON());
      // props.map =
      props.states.push(e.form.toJSON());
      props.states = _.orderBy(props.states, ["name"], ["asc"]);

      e.form.trigger("close");
    })
    .modal();
};

const selectReport = newreport => {
  console.debug("selectReport Called");
  props.report = newreport;
};
const saveReport = report => {
  console.debug("saveReport Called");
  save(!report || report instanceof Event ? props.report : report);
  // props.report = report;
};
const createReport = report => {
  // props.report = report;
  save(report);
  console.debug("createReport Called");
  // props.report = report;
};

const deleteReport = report => {
  // props.report = report;
  console.debug("deleteReport Called");

  console.debug(report);
  detach(report);
  // props.report = report;
};
</script>
<template>
  <div class="flex-grow overflow-scroll flex">
    <aside
      class="flex-1 overflow-x-hidden w-72 max-w-[18rem] relative bg-slate-50 flex-col xl:block hidden border-gray-300 border-r"
    >
      <menuBar
        :reports="reports"
        :id="report ? report.id : reports[0].id"
        :status="status"
        @select="selectReport"
        @update="saveReport"
        @create="createReport"
        @delete="deleteReport"
        editable="true"
      />
    </aside>
    <section
      class="overflow-x-hidden flex-1 flex-col gap-4 p-4 justify-stretch relative min-w-[28rem] w-72 flex shadow-inner"
    >
      <div class="flex gap-2 items-end">
        <div>Preview</div>
        <button
          type="button"
          @click="saveReport"
          :disabled="status !== 'changed'"
          class="text-white ml-auto bg-success-500 hover:bg-success-600 active:bg-success-800 focus:border-success-800 focus:ring-success-200 justify-self-start px-2 py-2 border border-gray-200 rounded-md font-semibold text-xs tracking-widest focus:ring focus:outline-none disabled:opacity-25 transition"
          cclass="disabled:opacity-30 bg-green-300 text-green-700 hover:bg-green-500 hover:text-green-900 p-2 cursor-pointer border rounded border-green-500 active:bg-green-200 active:border-green-300"
        >
          SAVE
        </button>
      </div>
      <div
        class="rounded border border-gray-300 bg-slate-200 h-full overflow-x-hidden flex-1 flex-col justify-stretch relative flex shadow"
      >
        <dataViewer
          :records="records"
          :record="record"
          :resource="resource"
          :report="report"
        >
        </dataViewer>
        <div
          class="absolute inset-0 bg-white opacity-40 hover:opacity-0 hidden"
        ></div>
      </div>
    </section>
    <aside
      class="flex-1 overflow-x-hidden relative w-72 max-w-[18rem] hidden lg:block bg-slate-50 flex-col border-gray-300 border-l"
    >
      <waiting :status="status"></waiting>
      <collapseSection
        v-show="status !== 'waiting'"
        :uuid="uuid"
        name="Data"
        :open="true"
        overflow="true"
      >
        <ul class="flex flex-col gap-1 px-2" ref="dataForm"></ul>
      </collapseSection>

      <collapseSection
        v-show="
          false && status !== 'waiting' && report?.config?.display == 'grid'
        "
        :uuid="uuid"
        name="Fields"
        :count="fields.filter(i => i.include).length"
        :total="fields.length"
        :open="true"
      >
        <ul class="flex flex-col gap-1 px-2">
          <li
            v-for="field in fields"
            :key="field.key"
            :field="field"
            class="justify-between"
          >
            <div
              :class="
                field.include
                  ? 'text-teal-600'
                  : 'text-slate-400 hover:text-slate-600'
              "
              class="flex flex-row gap-2 cursor-pointer items-center p-2 group text-slate-600 rounded border border-transparent hover:border-white hover:bg-blue-100"
            >
              <Icon
                class="w-6 h-6"
                icon="radix-icons:file"
                v-if="field.type == 'base64_file'"
                aria-hidden="true"
              />
              <Icon
                class="w-6 h-6"
                icon="radix-icons:input"
                v-if="field.type == 'text'"
                aria-hidden="true"
              />
              <Icon
                class="w-6 h-6"
                v-if="['user'].indexOf(field.type) > -1"
                :icon="'heroicons:' + field.type"
                aria-hidden="true"
              />
              <Icon
                class="w-6 h-6"
                v-if="['datetime'].indexOf(field.type) > -1"
                :icon="'formkit:' + field.type"
                aria-hidden="true"
              />

              <Icon
                class="w-6 h-6"
                v-if="['checkbox', 'switch'].indexOf(field.type) > -1"
                :icon="'radix-icons:' + field.type"
                aria-hidden="true"
              />

              <Icon
                class="w-6 h-6"
                v-if="['text'].indexOf(field.type) > -1"
                :icon="'radix-icons:' + field.type"
                aria-hidden="true"
              />

              <Icon
                class="w-6 h-6"
                v-if="'status' == field.name"
                aria-hidden="true"
                icon="grommet-icons:status-good"
              />
              <Icon
                class="w-6 h-6"
                v-if="'state' == field.name"
                aria-hidden="true"
                icon="material-symbols-light:conversion-path"
              />

              <div>{{ field.label }}</div>
              <div class="ml-auto flex flex-row gap-1">
                <Icon
                  @click="toggleField(field)"
                  class="w-6 h-6 block"
                  :class="
                    field.include
                      ? 'text-blue-500 group-hover:block hidden'
                      : 'block'
                  "
                  :icon="
                    field.include
                      ? 'radix-icons:eye-none'
                      : 'radix-icons:eye-open'
                  "
                  aria-hidden="true"
                />

                <DropdownMenuRoot :open="false">
                  <DropdownMenuTrigger
                    class="text-slate-300 group-hover:text-slate-500 block"
                    aria-label="Options"
                  >
                    <Icon
                      icon="radix-icons:dots-horizontal"
                      aria-hidden="true"
                    />
                  </DropdownMenuTrigger>

                  <DropdownMenuPortal>
                    <DropdownMenuContent
                      class="min-w-[220px] outline-none bg-white rounded-md p-1 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                      :side-offset="5"
                    >
                      <DropdownMenuItem
                        value="Edit"
                        s
                        class="group leading-none text-slate-600 rounded flex items-center h-8 px-2 relative select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-blue-100"
                        @click="editField(field)"
                      >
                        <Icon
                          class="mr-2"
                          icon="radix-icons:pencil-1"
                          aria-hidden="true"
                        />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator class="h-[1px] bg-slate-200 m-2" />

                      <DropdownMenuItem
                        value="Delete"
                        class="group leading-none text-danger-600 rounded flex items-center h-8 px-2 relative select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-danger-100"
                        @click="editField"
                      >
                        <Icon
                          class="mr-2 text-slate-600"
                          icon="radix-icons:trash"
                          aria-hidden="true"
                        />
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuSeparator class="h-[1px] bg-slate-200 m-2" />

                      <DropdownMenuLabel
                        class="pl-6 text-xs leading-6 text-mauve11"
                      >
                        Style
                      </DropdownMenuLabel>
                      <DropdownMenuArrow class="fill-white" />
                    </DropdownMenuContent>
                  </DropdownMenuPortal>
                </DropdownMenuRoot>

                <PopoverRoot v-if="false">
                  <PopoverTrigger
                    class="text-slate-300 group-hover:text-slate-500 block"
                    aria-label="Options"
                  >
                    <Icon icon="radix-icons:dots-vertical" aria-hidden="true" />
                  </PopoverTrigger>
                  <PopoverPortal>
                    <PopoverContent
                      side="bottom"
                      :side-offset="5"
                      class="rounded p-5 w-[260px] bg-white shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] focus:shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2),0_0_0_2px_theme(colors.green7)] will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
                    >
                      Hello
                      <PopoverClose
                        class="rounded-full h-6 w-6 inline-flex items-center justify-center text-grass11 absolute top-1 right-1 hover:bg-green4 focus:shadow-[0_0_0_2px] focus:shadow-green7 outline-none cursor-default"
                        aria-label="Close"
                      >
                        <Icon icon="radix-icons:cross-2" />
                      </PopoverClose>
                      <PopoverArrow class="fill-white" />
                    </PopoverContent>
                  </PopoverPortal>
                </PopoverRoot>
                <CheckIcon
                  v-if="false"
                  :class="[
                    'ml-auto h-5 w-5 bg-white rounded shadow-sm border border-blue-300 group-hover:shadow-slate-400 text-blue-500 block',
                  ]"
                  aria-hidden="true"
                />
              </div>
            </div>
          </li>
        </ul>
      </collapseSection>

      <collapseSection
        v-show="false && status !== 'waiting'"
        :uuid="uuid"
        :count="states.filter(i => i?.include).length"
        :total="states.length"
        name="States"
        :open="true"
      >
        <ul class="flex flex-col gap-1 px-2">
          <li v-for="state in states" :key="state.name" class="justify-between">
            <div
              :class="
                state.include
                  ? 'text-teal-600'
                  : 'text-slate-400 hover:text-slate-600'
              "
              class="flex flex-row gap-2 cursor-pointer items-center p-2 group text-slate-600 rounded border border-transparent hover:border-white hover:bg-blue-100"
            >
              <Icon
                class="w-6 h-6 text-blue-500"
                icon="carbon:unlocked"
                v-if="state.status == 'open'"
                aria-hidden="true"
              />

              <Icon
                class="w-6 h-6 text-grean-500"
                icon="carbon:unlocked"
                v-if="state.status == 'created'"
                aria-hidden="true"
              />
              <Icon
                class="w-6 h-6 text-red-600"
                icon="carbon:locked"
                v-if="state.status == 'closed'"
                aria-hidden="true"
              />

              <Icon
                class="w-6 h-6"
                icon="gis:flag-start-o"
                v-if="state.name == 'origin'"
                aria-hidden="true"
              />

              <div>
                {{ state.label || state.name }}
                {{ state.style }}
              </div>
              <div class="ml-auto flex flex-row gap-1">
                <Icon
                  @click="toggleState(state)"
                  class="w-6 h-6 block"
                  :class="
                    state.include
                      ? 'text-blue-500 group-hover:block hidden'
                      : 'block'
                  "
                  :icon="
                    state.include
                      ? 'radix-icons:eye-none'
                      : 'radix-icons:eye-open'
                  "
                  aria-hidden="true"
                />

                <DropdownMenuRoot :open="false">
                  <DropdownMenuTrigger
                    class="text-slate-300 group-hover:text-slate-500 block"
                    aria-label="Options"
                  >
                    <Icon
                      icon="radix-icons:dots-horizontal"
                      aria-hidden="true"
                    />
                  </DropdownMenuTrigger>

                  <DropdownMenuPortal>
                    <DropdownMenuContent
                      class="min-w-[220px] outline-none bg-white rounded-md p-1 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                      :side-offset="5"
                    >
                      <DropdownMenuItem
                        value="Edit"
                        s
                        class="group leading-none text-slate-600 rounded flex items-center h-8 px-2 relative select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-blue-100"
                        @click="editState(state)"
                      >
                        <Icon
                          class="mr-2"
                          icon="radix-icons:pencil-1"
                          aria-hidden="true"
                        />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator class="h-[1px] bg-slate-200 m-2" />

                      <DropdownMenuItem
                        value="Delete"
                        class="group leading-none text-danger-600 rounded flex items-center h-8 px-2 relative select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-danger-100"
                        @click="editState"
                      >
                        <Icon
                          class="mr-2 text-slate-600"
                          icon="radix-icons:trash"
                          aria-hidden="true"
                        />
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuArrow class="fill-white" />
                    </DropdownMenuContent>
                  </DropdownMenuPortal>
                </DropdownMenuRoot>
              </div>
            </div>
          </li>
        </ul>
        <div class="flex flex-row justify-end gap mx-3 px-2 mb-2 border-t">
          <button
            class="text-white bg-gform-500 hover:bg-gform-600 active:bg-gform-800 focus:border-gform-800 focus:ring-gform-200 justify-self-start mt-2 px-2 py-2 border border-gray-200 rounded-md font-semibold text-xs tracking-widest focus:ring focus:outline-none disabled:opacity-25 transition"
            @click="addState"
          >
            Add State
          </button>
        </div>
      </collapseSection>

      <collapseSection
        v-show="status !== 'waiting'"
        :uuid="uuid"
        name="Map"
        :count="map.length"
        :open="true"
      >
        <ul class="flex flex-col gap-1 px-2">
          <li
            v-for="transform in map"
            :key="transform.target"
            class="justify-between"
          >
            <div
              class="text-teal-600 flex flex-row gap-2 cursor-pointer items-center p-2 group rounded border border-transparent hover:border-white hover:bg-blue-100"
            >
              <span class="truncate flex-grow-0">{{
                transform.name || transform.target
              }}</span>

              <div
                class="ml-auto flex flex-shrink-0 flex-row items-center gap-1"
              >
                <Menu as="div" class="text-left">
                  <MenuButton
                    class="text-slate-300 group-hover:text-slate-500 block"
                    aria-label="Options"
                    @click.stop=""
                  >
                    <Icon
                      icon="radix-icons:dots-horizontal"
                      aria-hidden="true"
                    />
                  </MenuButton>

                  <transition
                    enter-active-class="transition duration-100 ease-out"
                    enter-from-class="transform scale-95 opacity-0"
                    enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-75 ease-in"
                    leave-from-class="transform scale-100 opacity-100"
                    leave-to-class="transform scale-95 opacity-0"
                  >
                    <MenuItems
                      class="absolute right-3 z-10 mt-4 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
                    >
                      <div class="px-1 py-1">
                        <MenuItem v-slot="{ active }">
                          <button
                            value="Edit"
                            :class="[
                              active
                                ? 'bg-blue-100  text-slate-700'
                                : 'text-slate-600',

                              'group leading-none rounded-md flex w-full items-center px-2 py-2 text-sm relative select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-danger-100',
                            ]"
                            @click="editTransform(transform)"
                          >
                            <Icon
                              class="mr-2 text-lg text-slate-600"
                              icon="radix-icons:pencil-1"
                              aria-hidden="true"
                            />
                            Edit
                          </button>
                        </MenuItem>
                      </div>

                      <div class="px-1 py-1">
                        <MenuItem v-slot="{ active }">
                          <button
                            :class="[
                              active
                                ? 'bg-danger-100 text-danger-700'
                                : 'text-danger-600',
                              'group leading-none rounded-md flex w-full items-center px-2 py-2 text-sm relative select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-danger-100',
                            ]"
                            value="Delete"
                            @click="deleteTransform"
                          >
                            <Icon
                              class="mr-2 text-slate-600 text-lg"
                              icon="radix-icons:trash"
                              aria-hidden="true"
                            />
                            Delete
                          </button>
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </transition>
                </Menu>
              </div>
            </div>
          </li>
        </ul>
        <div class="flex flex-row gap px-2">
          <button
            class="text-white bg-gform-500 hover:bg-gform-600 active:bg-gform-800 focus:border-gform-800 focus:ring-gform-200 justify-self-start mt-2 px-2 py-2 border border-gray-200 rounded-md font-semibold text-xs tracking-widest focus:ring focus:outline-none disabled:opacity-25 transition"
            @click="addMap"
          >
            Add Map
          </button>
        </div>
      </collapseSection>
    </aside>
  </div>
</template>
