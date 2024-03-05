<template>
  <section class="border-b border-slate-200" id="basic" style="">
    <div
      class="py-3 px-4 flex sticky top-0 bg-slate-50 z-10"
      @click="isOpen = !isOpen"
    >
      <div class="flex w-full items-center">
        <span class="font-semibold text-sm uppercase text-slate-700"
          >Reports</span
        >
        <div class="ml-auto -my-1">({{ reports.length }})</div>
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

    <ul
      v-show="isOpen"
      id="reports"
      class="flex flex-col gap-1 mb-2 px-2 max-h-52 overflow-x-auto"
    >
      <li
        v-for="report in reports"
        class="px-4 py-2 flex rounded-md items-center gap-2 border border-transparent hover:border-white cursor-pointer group"
        :class="
          report.id == id
            ? 'bg-blue-100 hover:bg-blue-200 hover:text-blue-800 text-blue-500'
            : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100 '
        "
        :data-reportID="report.id"
        @contextmenu.prevent="contextClick(report)"
        @click="go(report)"
      >
        <TableCellsIcon
          class="h-5 w-5 flex-shrink-0 opacity-75"
          v-if="report.config.display == 'grid'"
          aria-hidden="true"
        />
        <QueueListIcon
          class="h-5 w-5 flex-shrink-0 opacity-75"
          v-if="report.config.display == 'list'"
          aria-hidden="true"
        />
        <CalendarIcon
          class="h-5 w-5 flex-shrink-0 opacity-75"
          v-if="report.config.display == 'calendar'"
          aria-hidden="true"
        />

        <span class="truncate">{{ report.title }}</span>
        <span class="flex-shrink-0 text-white group-hover:block hidden"
          >r:{{ report.config.resource.id }}</span
        >
        <div v-if="editable" class="ml-auto">
          <Menu as="div" class="text-left" v-slot="{ open }">
            <MenuButton
              class="text-slate-500 invisible group-hover:visible"
              :class="
                report.id == id || open
                  ? 'block !visible'
                  : 'hidden group-hover:block'
              "
              aria-label="Options"
              @click.stop=""
            >
              <Icon icon="radix-icons:dots-horizontal" aria-hidden="true" />
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
                class="absolute right-5 z-10 mt-1 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
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
                      @click="editReport(report)"
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
                      @click="deleteReport"
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

        <DropdownMenuRoot :open="false" v-if="false">
          <DropdownMenuTrigger
            class="text-slate-300 group-hover:text-slate-500 block"
            aria-label="Options"
          >
            <Icon icon="radix-icons:dots-horizontal" aria-hidden="true" />
          </DropdownMenuTrigger>

          <DropdownMenuPortal>
            <DropdownMenuContent
              class="min-w-[220px] outline-none bg-white rounded-md p-1 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
              :side-offset="5"
              :align="start"
            >
              <DropdownMenuItem
                value="Edit"
                class="group leading-none text-slate-600 rounded flex items-center h-8 px-2 relative select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-blue-100"
                @click="editReport(report)"
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
                @click="deleteReport"
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
      </li>
    </ul>
  </section>
</template>

<script setup>
import {
  TableCellsIcon,
  CalendarIcon,
  QueueListIcon,
} from "@heroicons/vue/24/outline";

import {
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "radix-vue";

import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";

import { Icon } from "@iconify/vue";

const emit = defineEmits(["report"]);

const editReport = report => {
  console.log(report);
  new gform({
    legend: "Edit Report",
    data: report,
    fields: [
      { label: "Name" },
      { label: "Title", parse: [{ type: "requires" }] },
      {
        type: "fieldset",
        name: "config",
        label: false,
        fields: [
          {
            type: "fieldset",
            name: "resource",
            label: false,
            edit: false,
            fields: [
              {
                label: "Type",
                name: "type",
                options: ["", "Workflow", "Resource"],
                format: {
                  value: i => i.value.toLowerCase(),
                  label: "{{label}}",
                },
                edit: [{ type: "matches", value: "" }],
              },
              {
                label: "Workflow",
                show: [{ type: "matches", name: "type", value: "workflow" }],
                name: "id",
                options: "/api/workflowinstances",
                format: { value: i => i.id, label: "{{name}} ({{slug}})" },
              },
            ],
          },
          {
            label: "Display",
            options: ["List", "Calendar", "Grid"],
            format: {
              value: ({ value }) => value.toLowerCase(),
            },
          },
          {
            label: "Columns",
            type: "custom_radio",
            defaultValue: 1,
            format: {
              value: ({ i }) => i,
              label: "{{value}} column{{^first}}s{{/first}}",
            },
            options: [{ type: "optgroup", min: 1, max: 5 }],
            show: [{ type: "matches", name: "display", value: "list" }],
          },
        ],
      },
    ],
  })
    .on("cancel", e => {
      e.form.destroy();
    })
    .on("save", e => {
      console.log("old:");
      console.log(report);
      Object.assign(report, e.form.toJSON());
      console.log("new:");
      console.log(report);
      e.form.trigger("close");
    })
    .modal();
};
const contextClick = report => {
  debugger;
  // document.querySelector("#radix-1").click();
  document.querySelector(`[data-reportID="${report.id}"] button`).click();

  // report.open = true;
};
const props = defineProps({
  reports: Array,
  id: Object,
  isOpen: { default: true, type: Boolean },
  editable: { type: Boolean, default: false },
  // apps: Array,
  // forms: Array,
  // resources: Array,
});
const go = report => {
  emit("report", report);
};
</script>
