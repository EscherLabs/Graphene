import { r as ref, w as watch, o as onMounted, a as openBlock, b as createElementBlock, d as createBaseVNode, x as createVNode, a2 as _sfc_main$1, F as Fragment, f as renderList, t as toDisplayString, z as createBlock, n as normalizeClass, u as unref, e as createCommentVNode, a3 as createApp, j as h } from "./menuBar-f267832e.js";
import { r as render } from "./CheckIcon-cf73135a.js";
const _hoisted_1 = { class: "flex-grow overflow-scroll flex" };
const _hoisted_2 = { class: "flex-1 overflow-x-hidden w-72 max-w-[18rem] relative bg-slate-50 shadow-lg flex-col xl:block hidden border-gray-300 border-r" };
const _hoisted_3 = { class: "overflow-x-hidden flex-1 flex-col justify-stretch relative bg-slate-200 min-w-[28rem] w-72 flex shadow-inner" };
const _hoisted_4 = { class: "flex flex-col gap-2 border border-gray-300 m-4 p-2 w-1/3" };
const _hoisted_5 = ["onClick", "field"];
const _hoisted_6 = { class: "flex flex-col gap-2 border border-gray-300 m-4 p-2 w-1/3" };
const _hoisted_7 = { class: "border border-gray-300 p-2" };
const _hoisted_8 = /* @__PURE__ */ createBaseVNode("aside", { class: "flex-1 overflow-x-hidden relative w-72 max-w-[18rem] hidden lg:block bg-slate-50 flex-col border-gray-300 border-l" }, null, -1);
const _sfc_main = {
  __name: "adminProject",
  props: {
    reports: Array,
    id: Number,
    project: Object,
    page: { type: Number, default: 1 },
    limit: { type: Number, default: 10 },
    records: { type: Array, default: [] },
    navInfo: {
      type: Object,
      default: {}
    },
    report: {
      type: Object,
      default: { config: { display: "" } }
    },
    status: {
      type: String,
      default: ""
    },
    // fields: {
    //   type: Object,
    //   default: {},
    // },
    states: {
      type: Object,
      default: {}
    }
  },
  setup(__props) {
    const props = __props;
    const resource = ref({});
    const historyNaveFlag = ref(true);
    const fields = ref([]);
    const toggleField = (field) => {
      console.log(field);
      field.include = !field.include;
      debugger;
    };
    const save = async () => {
      await fetch(`/api/reports/${props.report.id}`, {
        method: "PUT",
        mode: "cors",
        // no-cors, *cors, same-origin
        cache: "no-cache",
        // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json"
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({ fields: _.filter(fields.value, "include") })
      }).then((res) => {
        const { status, ok } = res;
        if (!ok) {
          return res.text().then((text) => {
            throw new Error(text);
          });
        } else {
          return res.json();
        }
      }).catch((error) => {
        console.error(error);
      });
    };
    const getData = () => {
      resource.value;
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
        if (report == void 0) {
          props.report == props.reports[0];
          return;
        }
        resource.value = report.config.resource;
        const { states, schema = [] } = resource.value;
        props.status = "waiting";
        const response = await fetch(`/api/workflowinstances/${report.id}`).then((res) => {
          const { status, ok } = res;
          if (!ok) {
            return res.text().then((text) => {
              throw new Error(text);
            });
          } else {
            return res.json();
          }
        }).catch((error) => {
          console.error(error);
        });
        const {
          name: instance_name,
          configuration,
          workflow: {
            description,
            code: { flow, form, map, methods, resources, templates },
            name,
            id
          }
        } = response;
        debugger;
        fields.value = _.map(form.fields, (field) => {
          const { label, type = "text" } = field;
          const name2 = gform.formName(field);
          console.log(_.find(schema, { name: name2 }));
          return {
            name: name2,
            label: label || name2,
            type,
            include: _.find(schema, { name: name2 }) ? true : false
          };
        });
        props.states = _.map(flow, (state) => {
          const { name: name2, state_id: id2 } = state;
          return { id: id2, name: name2 };
        });
        $g.collections.update(
          `states`,
          _.map(flow, (state) => {
            const { name: name2, state_id: id2 } = state;
            return { id: id2, name: name2 };
          })
        );
        getData();
      }
    );
    onMounted(() => {
      window.addEventListener("popstate", (event) => {
        if ("reportID" in event.state) {
          historyNaveFlag.value = true;
          props.report = _.find(props.reports, { id: event.state.reportID });
        }
      });
      props.report = props.reports.length ? props.reports[0] : null;
      if (props.report !== void 0)
        resource.value = props.report.config.resource;
      if (!props.report) {
        if (props.reports.length) {
          props.report = props.reports[0];
        } else {
          console.error("Report not Found!");
          return false;
        }
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("aside", _hoisted_2, [
          createVNode(_sfc_main$1, {
            reports: __props.reports,
            id: __props.report ? __props.report.id : __props.reports[0].id,
            onReport: _cache[0] || (_cache[0] = (newreport) => __props.report = newreport)
          }, null, 8, ["reports", "id"])
        ]),
        createBaseVNode("section", _hoisted_3, [
          createBaseVNode("div", { class: "p-4 flex gap-2 justify-end" }, [
            createBaseVNode("button", {
              type: "button",
              onClick: save,
              class: "bg-green-400 text-green-500 p-2 border rounded border-green-500 active:bg-green-200 active:order-green-300 hover:opacity-100 opacity-75"
            }, " SAVE ")
          ]),
          createBaseVNode("ul", _hoisted_4, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(fields.value, (field) => {
              return openBlock(), createElementBlock("li", {
                onClick: ($event) => toggleField(field),
                field,
                class: "border border-gray-300 p-2 flex justify-between"
              }, [
                createBaseVNode("div", null, toDisplayString(field.label) + " " + toDisplayString(field.type), 1),
                field.include ? (openBlock(), createBlock(unref(render), {
                  key: 0,
                  class: normalizeClass([
                    "h-5 w-5 bg-white rounded border border-slate-400 text-emerald-500 block"
                  ]),
                  "aria-hidden": "true"
                })) : createCommentVNode("", true)
              ], 8, _hoisted_5);
            }), 256))
          ]),
          createBaseVNode("ul", _hoisted_6, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(__props.states, (state) => {
              return openBlock(), createElementBlock("li", _hoisted_7, toDisplayString(state.name) + " " + toDisplayString(state.id), 1);
            }), 256))
          ])
        ]),
        _hoisted_8
      ]);
    };
  }
};
createApp({
  render: () => h(_sfc_main, document.initialData)
}).mount("#app");
