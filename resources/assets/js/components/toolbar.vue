<template>
  <div class="h-12 z-20 bg-slate-50 border-b border-gray-200 relative">
    <span>
      <button ref="button" @click="toggleMenu" class="">{{ title }}</button>

      <ul
        class="hidden absolute min-w-[8em] border-slate-400 rounded-md py-1 border bg-white shadow-md text-slate-700 flex flex-col"
        ref="ddmenu"
      >
        <li
          v-for="link in links"
          class="hover:bg-slate-200 px-2 py-1 hover:text-slate-900 cursor-pointer"
          @click="action(link.action)"
        >
          {{ link.label }}
        </li>
      </ul></span
    >
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import { Icon } from "@iconify/vue";
// import { ref } from 'vue'

const checkboxOne = ref(false);
const checkboxTwo = ref(false);
const person = ref("pedro");

function handleClick() {
  alert("hello!");
}
import {
  computePosition,
  flip,
  shift,
  offset,
  autoUpdate,
} from "@floating-ui/dom";

defineProps({
  title: {
    type: String,
    default: "Sort by",
  },
  links: {
    type: Array,
    default: [
      { label: "a", action: "get" },
      { label: "b", action: "getIt" },
      { label: "c", action: "got" },
    ],
  },
});
const ddmenu = ref(null);
const button = ref(null);

onMounted(event => {
  function updatePosition() {
    computePosition(button.value, ddmenu.value, {
      placement: "bottom-end",
      middleware: [
        offset({ mainAxis: 4, crossAxis: 2 }),
        flip(),
        shift({ padding: 4 }),
        // arrow({ element: arrowElement }),
      ],
    }).then(({ x, y, placement, middlewareData }) => {
      Object.assign(ddmenu.value.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
    });
  }

  autoUpdate(button.value, ddmenu.value, updatePosition);

  const filter = new gform(
    {
      // name: get().config.resource.id,
      actions: [],
      collections: $g.collections,
      fields: [
        {
          // type: "select",
          type: "filter",
          hideLabel: true,
          parse: false,
          // label: "Sort by",
          label: false,
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
      ],
    },
    ddmenu.value
  );
});
const toggleMenu = () => {
  gform.toggleClass(
    ddmenu.value,
    "hidden",
    !gform.hasClass(ddmenu.value, "hidden")
  );
};
const action = action => {
  gform.toggleClass(ddmenu.value, "hidden", true);
  console.log(action);
};
</script>
