<script setup>
import { ref, onMounted, watch, toRaw } from "vue";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";

const emit = defineEmits(["query"]);

const page = url => {
  emit("query", { page: parseInt(url.split("=")[1]) });
};

const props = defineProps({
  navInfo: {
    type: Object,
    default: {},
  },
  query: {
    type: Object,
    default: {},
  },
  pageCounts: {
    type: Array,
    default: [
      {
        label: "10",
        value: 10,
      },
      {
        label: "50",
        value: 50,
      },
      {
        label: "100",
        value: 100,
      },
      // {
      //   label: "Title",
      //   value: "title",
      // },
      {
        label: "All",
        value: null,
      },
    ],
  },
});
const per_page = ref(
  _.find(props.pageCounts, {
    value: parseInt(props.query.limit),
  }) || props.pageCounts[0]
);

watch(
  () => props.navInfo,
  () => {
    debugger;
    // per_page.value = _.find(props.pageCounts, {
    //   value: parseInt(props.navInfo.per_page),
    // });
  }
);
const setLimit = npp => {
  emit("query", { ...props.query, limit: parseInt(npp.value) }); //`&limit=${npp.value}`);
};
</script>

<template>
  <div
    class="mt-auto flex items-center justify-between border-t border-gray-300 bg-white px-4 py-3 sm:px-6 h-16"
  >
    <div class="flex flex-1 justify-between sm:hidden">
      <a
        href="#"
        class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >Previous</a
      >
      <a
        href="#"
        class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >Next</a
      >
    </div>
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          Showing
          <span class="font-medium">{{ navInfo.from }}</span>
          to
          <span class="font-medium">{{ navInfo.to }}</span>
          of
          <span class="font-medium">{{ navInfo.total }}</span>
          results
        </p>
      </div>
      <div class="ml-4 text-sm text-gray-700">
        <span class="mr-4"
          >Page {{ navInfo.current_page }} of {{ navInfo.last_page }}</span
        >
        <Listbox
          v-model="per_page"
          class="inline-block"
          @update:modelValue="setLimit"
        >
          <div class="relative">
            <ListboxButton
              class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
            >
              <span class="block truncate">
                <span
                  class="font-medium text-slate-800"
                  v-if="per_page.value != null"
                  >&nbsp;{{ per_page.label }}</span
                ><span class="text-slate-500"> Per Page</span></span
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
                class="absolute z-10 mt-1 bottom-full max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              >
                <ListboxOption
                  v-slot="{ active, selected }"
                  v-for="count in pageCounts"
                  :key="count.value"
                  :value="count"
                  as="template"
                >
                  <li
                    :class="[
                      active ? 'bg-brand-50 text-brand-800' : 'text-gray-700',
                      'relative cursor-default select-none py-2 pl-10 pr-4',
                    ]"
                  >
                    <span
                      :class="[
                        selected ? 'font-medium' : 'font-normal',
                        'block truncate',
                      ]"
                      >{{ count.label }}</span
                    >
                    <span
                      v-if="selected"
                      class="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-700"
                    >
                      <CheckIcon class="h-5 w-5" aria-hidden="true" />
                    </span>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </div>
        </Listbox>
      </div>

      <div>
        <nav
          class="isolate inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          <button
            v-for="link in navInfo.links"
            :href="link.url"
            @click.prevent="page(link.url)"
            :disabled="!link.url"
            data-paginate=""
            aria-current="page"
            :class="[
              'disabled:text-gray-400  disabled:ring-gray-300 disabled:hover:bg-gray-50 relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset focus:z-20 focus:outline-offset-0',
              link.active
                ? 'z-10  bg-green-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600'
                : 'text-gray-900 ring-gray-300 hover:bg-gray-50',
              link.label == 'Previous' ? 'rounded-l-md' : '',
              link.label == 'Next' ? 'rounded-r-md' : '',
            ]"
          >
            <span class="sr-only">{{ link.label }}</span>
            <svg
              v-if="link.label == 'Previous'"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                clip-rule="evenodd"
              />
            </svg>
            {{ isFinite(link.label) ? link.label : "" }}
            <svg
              v-if="link.label == 'Next'"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>
