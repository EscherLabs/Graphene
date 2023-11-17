<template>
  <div ref="gridContainer"></div>
</template>

<script setup>
import { ref, onMounted, watch, toRaw } from "vue";

const gridContainer = ref(null);
const gGrid = ref({});
gform.stencils.data_grid_footer = `<div class="hidden"></div>`;
var props = defineProps({
  records: {
    default: [],
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

watch(
  () => props.records,
  newRecords => {
    // debugger;
    gGrid.value.load(_.map(newRecords, "data"));
    //     const newList = _.map(newRecords, record => {
    //       return $g.etl(record, record, [
    //         {
    //           source: "/data/currency",
    //           target: "/currency",
    //         },
    //         {
    //           source: "/data/simple",
    //           target: "/simps",
    //         },
    //       ]);
    //     });
    //     // console.log(newList);
    //     // debugger;
  }
);
onMounted(e => {
  gGrid.value = new GrapheneDataGrid({
    filter: false,
    actions: [],
    // sort: false,
    search: false,
    download: false,
    upload: false,
    columns: false,
    data: props.records.value,
    form: {
      fields: [
        { label: "Name", name: "simple" },
        { label: "Programs", name: "programs" },
      ],
    },
    el: gridContainer.value,
  });
});
gGrid.value.on("sort");
// const go = ({ id }) => {
//   window.open(`/workflows/report/${id}`, "_blank");
// };

// const statelabel = record => {
//   if (props.config.states) {
//     return _.find($g.collections.get("_states"), { value: record.state }).label;
//     // return record.state;
//   }
// };
// const stateClass = record => {
//   if (props.config.states) {
//     return _.find($g.collections.get("_states"), { value: record.state })
//       .styles;
//     // return record.state;
//   }
// };
</script>
