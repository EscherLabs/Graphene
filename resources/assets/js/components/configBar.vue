<script setup>
import { ref, onMounted, watch, toRaw } from "vue";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";

var formContainer = ref(null);
const emit = defineEmits(["filter", "query"]);

const props = defineProps({
  reports: Array,
  report: {
    type: Number,
    default: 0,
  },
  config: {
    type: Object,
    default: {},
  },
  query: {
    type: Object,
    default: {},
  },
  groupings: {
    type: Array,
    default: [
      {
        label: "- None -",
        value: null,
      },
      {
        label: "State",
        value: "state",
      },
      {
        label: "Status",
        value: "status",
      },
      // {
      //   label: "Title",
      //   value: "title",
      // },
      {
        label: "Assigned",
        value: "user_id",
      },
    ],
  },
});

const group_by = ref(props.groupings[0]);
onMounted(() => {
  $g.collections.add("_states", []);
  $g.collections.on("_states", e => {
    _.each(gform.instances, instance => instance.trigger("collection"));
  });

  // console.log(formContainer.value);
  // debugger;
  // const data = _.extend({}, toRaw(props.query));

  // gform.instances.f19.find('created_at').set([{"search":[{"raw":"[2023-11-01 - 2023-11-04]"}]}])
  const data = props.query;
  if (typeof data.sort == "string") {
    data.sort = data.sort.split(",");
  }

  if (typeof data.state == "string") {
    data.state = data.state.split(",");
  }

  if (typeof data.created_at == "string") {
    data.created_at = data.created_at.split(",");
  }

  if (typeof data.updated_at == "string") {
    data.updated_at = data.updated_at.split(",");
  }

  const filter = new gform(
    {
      // name: get().config.resource.id,
      name: "filter",
      actions: [],
      data,
      collections: $g.collections,
      fields: [
        {
          type: "custom_radio",
          label: false,
          name: "status",
          options: [
            {
              type: "optgroup",
              options: [
                {
                  label: "All",
                  value: "",
                },
                {
                  label: "Open",
                  value: "open",
                },
                {
                  label: "New",
                  value: "new",
                  visible: false,
                },
                {
                  label: "Closed",
                  value: "closed",
                },
              ],
            },
          ],
          parse: [{ type: "not_matches", value: "" }],
        },
        {
          type: "smallcombo",
          // type: "filter",
          hideLabel: true,
          parse: false,
          show: false,
          label: "Group by",
          name: "group_by",
          options: [
            {
              type: "optgroup",
              options: [
                // {
                //   label: "Created At",
                //   value: "created_at",
                // },
                // {
                //   label: "Updated At",
                //   value: "updated_at",
                // },
                // {
                //   label: "Submitted At",
                //   value: "opened_at",
                // },
                {
                  label: "State",
                  value: "state",
                },
                {
                  label: "Status",
                  value: "status",
                },
                // {
                //   label: "Title",
                //   value: "title",
                // },
                {
                  label: "Assigned",
                  value: "user_id",
                },
              ],
            },
          ],
          // parse: [{ type: "requires" }],
        },
        {
          // type: "radio",
          type: "tristateCollection",
          // hideLabel: true,

          parse: [{ type: "requires" }],
          multiple: true,
          label: "Sort by",
          name: "sort",
          options: [
            {
              type: "optgroup",
              options: [
                {
                  label: "Created At",
                  value: "created_at",
                },
                {
                  label: "Updated At",
                  value: "updated_at",
                },
                {
                  label: "Submitted At",
                  value: "opened_at",
                },
                {
                  label: "State",
                  value: "state",
                },
                {
                  label: "Status",
                  value: "status",
                },
                {
                  label: "Title",
                  value: "title",
                },
                {
                  label: "Assigned",
                  value: "user_id",
                },
              ],
            },
          ],
          // parse: [{ type: "requires" }],
        },
        {
          type: "tristateCollection",
          multiple: true,
          // hideLabel: true,
          // parse: false,
          parse: [{ type: "requires" }],
          label: "State",
          options: [
            {
              type: "optgroup",
              // path: get().config.resource.id + "_states",
              path: "_states",
            },
          ],
        },
        {
          type: "date_range",
          label: "Created",
          name: "created_at",
          search: "created_at",
          key: "created_at",
          parse: [{ type: "requires" }],
        },
        {
          type: "date_range",
          label: "Updated",
          name: "updated_at",
          search: "updated_at",
          key: "updated_at",
          parse: [{ type: "requires" }],
        },
      ],
    },
    formContainer.value
  );

  _.each(["created_at", "updated_at"], field => {
    //   debugger;
    filter.find(field).set(props.query[field] || []);

    //   [
    //   {
    //     search: [
    //       {
    //         raw: "[" + (props.query[field] || "").split(",").join(" - ") + "]",
    //       },
    //     ],
    //   },
    // ]);
  });
  // data.created_at = ;
  // debugger;
  // filter.find('created_at').set(data.created_at)
  // filter.find('updated_at').set(data.updated_at)

  filter.on("input", ({ form }) => {
    // const filters = _.reduce(
    //   form.filter({ type: "filter" }),
    //   (result, { name, value }) => {
    //     _.each(value, item => {
    //       result.push({
    //         name,
    //         invert: item.invert,
    //         search: _.map(item.search, "raw"),
    //       });
    //     });
    //     return result;
    //   },
    //   []
    // // );
    // const filters = _.reduce(
    //   form.filter({ type: "tristateCollection" }),
    //   (result, { name, value }) => {
    //     _.each(value[0], search => {
    //       result.push({
    //         name,
    //         invert: false,
    //         search: [search],
    //       });
    //     });
    //     _.each(value[1], search => {
    //       result.push({
    //         name,
    //         invert: true,
    //         search: [search],
    //       });
    //     });
    //     // _.each(value, item => {
    //     //   result.push({
    //     //     name,
    //     //     invert: item.invert,
    //     //     search: _.map(item.search, "raw"),
    //     //   });
    //     // });
    //     return result;
    //   },
    //   []
    // );
    const filters = [];
    _.reduce(
      _.map(form.filter({ type: "date_range" }), field => ({
        name: field.name,
        value: field.get(),
      })),
      (result, { name, value }) => {
        _.each(value, item => {
          result.push({
            name,
            invert: item.invert,
            search: _.map(item.search, ({ raw }) => {
              return _.trim(raw, ["]", "["]).split(" - ");
            }),
          });
        });
        return result;

        // if (typeof value !== "undefined" && value !== "") {
        //   // const { key } = value[0];
        //   // const { raw } = value[0].search[0];
        //   _.each(
        //     _.trim(value[0].search[0].raw, ["]", "["]).split(" - "),
        //     (date, i) => {
        //       if (date) query.push(`${name}[${i}]=${date}`);
        //     }
        //   );
        // }
        // return query;
      },
      filters
    );
    const queryObj = form.toJSON();

    _.reduce(
      filters,
      (result, { name, invert, search }) => {
        // result[invert ? `![${name}]` : `${name}`] = search.join(",");
        result[name] = result[name] ? result[name] + "," : "";
        result[name] += (invert ? "!" : "") + search.join(invert ? ",!" : ",");
        return result;
      },
      form.toJSON()
    );

    emit("query", queryObj);
    return;
    // console.log(QueryString);
    const newQ = _.reduce(
      form.filter({ type: "filter" }),
      (query, { name, value }) => {
        _.each(value, ({ invert, search }) => {
          const pre = invert ? "1" : "0";
          const t = `${name}[${pre}][]=`;
          _.each(search, ({ raw }) => {
            query.push(t + _.trim(raw, '"'));
          });
        });
        return query;
      },
      [new URLSearchParams(form.toJSON()).toString()]
    );
    _.reduce(
      _.map(form.filter({ type: "date_range" }), field => ({
        name: field.name,
        value: field.get(),
      })),
      (query, { name, value }) => {
        if (typeof value !== "undefined" && value !== "") {
          // const { key } = value[0];
          // const { raw } = value[0].search[0];
          _.each(
            _.trim(value[0].search[0].raw, ["]", "["]).split(" - "),
            (date, i) => {
              if (date) query.push(`${name}[${i}]=${date}`);
            }
          );
        }
        return query;
      },
      newQ
    );
    // console.log(newQ.join("&"));
    emit("filter", newQ.join("&"));

    //     api.engine.app.getPage({
    //       page: api.engine.app.page,
    //       id: form.options.name,
    //       filter: api.engine.app.data.searchFilter,
  });
});
</script>
<template>
  <div>
    <Listbox v-if="false" v-model="group_by" class="m-4">
      <div class="relative mt-1">
        <ListboxButton
          class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
        >
          <span class="block truncate"
            ><span class="text-slate-500"
              >Group <span v-if="group_by.value != null">By</span></span
            >
            <span
              class="font-medium text-slate-800"
              v-if="group_by.value != null"
              >&nbsp;{{ group_by.label }}</span
            ></span
          >
          <span
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
          >
            <ChevronUpDownIcon
              class="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </ListboxButton>

        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            <ListboxOption
              v-slot="{ active, selected }"
              v-for="group in groupings"
              :key="group.value"
              :value="group"
              as="template"
            >
              <li
                :class="[
                  active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                  'relative cursor-default select-none py-2 pl-10 pr-4',
                ]"
              >
                <span
                  :class="[
                    selected ? 'font-medium' : 'font-normal',
                    'block truncate',
                  ]"
                  >{{ group.label }}</span
                >
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
                >
                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                </span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
    <div ref="formContainer" class="py-2 px-4 flex flex-col gap-2 mb-2"></div>
  </div>
</template>
