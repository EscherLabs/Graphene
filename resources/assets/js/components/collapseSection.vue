<script setup>
import { ref, watch, inject, toRaw } from "vue";
// import Wave from "@/wave/main.js";
// import _j from "@/basejump/index.js";
// import { composerFields } from "@/composer/fields.js";

const props = defineProps({
  name: {
    type: String,
    required: true,
    default: "section",
  },
  open: {
    type: Boolean,
    default: false,
  },
  count: {
    type: Number,
    default: 0,
  },
  // model: Object,
  uuid: String,
  overflow: {
    type: Boolean,
    default: false,
  },
});
const isOpen = ref(props.open);

const activeItem = inject("activeItem");
const resource = inject("resource");
// const field = ref(props.uuid);

function toggle() {
  isOpen.value = !isOpen.value;
}
const formtarget = ref(null);
const summary = ref(null);

// onMounted(() => {
//     // let fields = composerFields[props.name]
//     const activeItem = {}; //app.cluster.collections.findItem("active");

//     new Wave.form(
//         {
//             data: activeItem.value || {},
//             fields: composerFields[props.name],
//             default: { variant: "tool" },
//             name: props.name,
//         },
//         formtarget.value
//     );
// });
watch(
  () => props.uuid,
  item => {
    if (!item || activeItem.value == null) {
      return;
    }
    // const activeItem = app.cluster.collections.findItem({
    //     id: item,
    // });

    // const activeItem = props.model;
    // debugger;
    const data = { ...activeItem.value };
    debugger;
    if ("options" in data) {
      // if (_.isArray(data.options)) {
      //     data.optgroups = { options: [...data.options] };
      // } else {
      data.optgroups = {
        options: _.map(data.options, (optGroup, uuid) => {
          // debugger;
          if (typeof optGroup == "string") {
            // return optGroup;
            const group = Wave.collection.get(optGroup);
            if (group) {
              return {
                ...group.value,
                ..._.omit(Wave.collection.get(optGroup), "value"),
              };
            }
          }
          return {
            // type: "optgroup",
            // options: Wave.collection.get(optGroup.uuid).values .value,
            ...toRaw(
              _.find(Wave.collection.get("resources").value, {
                uuid: optGroup.uuid,
              })
            ),

            options_type: "list",
            ...optGroup,
          };
        }),
      };
      // }
    }
    // delete data.options;
    const form = new Wave.form(
      {
        data,
        // {
        //     optgroups: {
        //         options: _.map(
        //             (activeItem.value || { options: [] }).options,
        //             (option) => {
        //                 return _.find(resource.resources, {
        //                     uuid: option.uuid,
        //                 });
        //                 // return option;
        //             }
        //         ),
        //     },
        // },
        fields: _.map(composerFields[props.name], (item, index) => {
          if (item.teleport == "summary") {
            item.target = summary.value;
          }
          return item;
        }),
        default: { variant: "tool" },
        name: props.name,
        // eventbus: Wave.eventbus,
        collections: Wave.collection,
      },
      formtarget.value
    );
    debugger;
    activeItem.value = {
      ...activeItem.value,
      ...form.value.optgroups,
    };
    form.on("input", e => {
      // debugger;
      activeItem.value = {
        ...activeItem.value,
        ...e.form.value.optgroups,
      };
    });
  }
);
</script>
<template>
  <section class="border-b border-slate-200" id="basic">
    <div
      class="py-3 px-4 flex sticky top-0 bg-slate-50 z-10 shadow"
      @click="toggle"
    >
      <div class="flex w-full items-center">
        <span class="font-semibold text-sm uppercase text-slate-700"
          >{{ name }}
        </span>
        <div ref="summary" class="ml-auto -my-1">
          <span v-if="count">({{ count }})</span>
        </div>
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
    <div
      v-show="true"
      :class="[
        isOpen ? 'opacity-1 my-2 max-h-60' : 'max-h-0 opacity-0',
        overflow ? '' : 'overflow-y-scroll',
      ]"
      class="transition-all"
    >
      <slot></slot>
    </div>
  </section>
</template>
