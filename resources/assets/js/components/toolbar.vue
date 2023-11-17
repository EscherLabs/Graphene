<template>
  <div class="h-12 z-20 bg-slate-50 border-b border-gray-200 relative">
    <ContextMenuRoot>
      <ContextMenuTrigger
        as-child
        class="select-none inset-0 absolute flex gap-4 p-2 items-center justify-between"
      >
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
      </ContextMenuTrigger>
      <ContextMenuPortal>
        <ContextMenuContent
          class="min-w-[220px] bg-white outline-none rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
          :side-offset="5"
        >
          <ContextMenuItem
            value="New Tab"
            class="group text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
            @click="handleClick"
          >
            New Tab
            <div
              class="ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8"
            >
              ⌘+T
            </div>
          </ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger
              value="more toolsz"
              class="group w-full text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[state=open]:bg-green4 data-[state=open]:text-grass11 data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1 data-[highlighted]:data-[state=open]:bg-green9 data-[highlighted]:data-[state=open]:text-green1"
            >
              More Tools
              <div
                class="ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8"
              >
                <Icon icon="radix-icons:chevron-right" />
              </div>
            </ContextMenuSubTrigger>
            <ContextMenuPortal>
              <ContextMenuSubContent
                class="min-w-[220px] outline-none bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                :side-offset="2"
                :align-offset="-5"
              >
                <ContextMenuItem
                  class="group text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
                >
                  Save Page As…
                  <div
                    class="ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8"
                  >
                    ⌘+S
                  </div>
                </ContextMenuItem>
                <ContextMenuItem
                  class="text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
                >
                  Create Shortcut…
                </ContextMenuItem>
                <ContextMenuItem
                  class="text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
                >
                  Name Window…
                </ContextMenuItem>
                <ContextMenuSeparator class="h-[1px] bg-green6 m-[5px]" />
                <ContextMenuItem
                  class="text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
                >
                  Developer Tools
                </ContextMenuItem>
                <ContextMenuArrow class="fill-white" />
              </ContextMenuSubContent>
            </ContextMenuPortal>
          </ContextMenuSub>
          <ContextMenuItem
            value="New Window"
            class="group text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
          >
            New Window
            <div
              class="ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8"
            >
              ⌘+N
            </div>
          </ContextMenuItem>
          <ContextMenuItem
            value="New Private Window"
            class="group text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
            disabled
          >
            New Private Window
            <div
              class="ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8"
            >
              ⇧+⌘+N
            </div>
          </ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger
              value="more tools"
              class="group text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none w-full outline-none data-[state=open]:bg-green4 data-[state=open]:text-grass11 data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1 data-[highlighted]:data-[state=open]:bg-green9 data-[highlighted]:data-[state=open]:text-green1"
            >
              More Tools
              <div
                class="ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8"
              >
                <Icon icon="radix-icons:chevron-right" />
              </div>
            </ContextMenuSubTrigger>
            <ContextMenuPortal>
              <ContextMenuSubContent
                class="min-w-[220px] outline-none bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                :side-offset="2"
                :align-offset="-5"
              >
                <ContextMenuItem
                  class="group text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
                >
                  Save Page As…
                  <div
                    class="ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8"
                  >
                    ⌘+S
                  </div>
                </ContextMenuItem>
                <ContextMenuItem
                  class="text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
                >
                  Create Shortcut…
                </ContextMenuItem>
                <ContextMenuItem
                  class="text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
                >
                  Name Window…
                </ContextMenuItem>
                <ContextMenuSeparator class="h-[1px] bg-green6 m-[5px]" />
                <ContextMenuItem
                  class="text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
                >
                  Developer Tools
                </ContextMenuItem>
                <ContextMenuSub>
                  <ContextMenuSubTrigger
                    value="more toolsz"
                    class="group w-full text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[state=open]:bg-green4 data-[state=open]:text-grass11 data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1 data-[highlighted]:data-[state=open]:bg-green9 data-[highlighted]:data-[state=open]:text-green1"
                  >
                    More Tools
                    <div
                      class="ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8"
                    >
                      <Icon icon="radix-icons:chevron-right" />
                    </div>
                  </ContextMenuSubTrigger>
                  <ContextMenuPortal>
                    <ContextMenuSubContent
                      class="min-w-[220px] outline-none bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                      :side-offset="2"
                      :align-offset="-5"
                    >
                      <ContextMenuItem
                        class="group text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
                      >
                        Save Page As…
                        <div
                          class="ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8"
                        >
                          ⌘+S
                        </div>
                      </ContextMenuItem>
                      <ContextMenuItem
                        class="text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
                      >
                        Create Shortcut…
                      </ContextMenuItem>
                      <ContextMenuItem
                        class="text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
                      >
                        Name Window…
                      </ContextMenuItem>
                      <ContextMenuSeparator class="h-[1px] bg-green6 m-[5px]" />
                      <ContextMenuItem
                        class="text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
                      >
                        Developer Tools
                      </ContextMenuItem>
                      <ContextMenuSub>
                        <ContextMenuSubTrigger
                          value="more toolsz"
                          class="group w-full text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[state=open]:bg-green4 data-[state=open]:text-grass11 data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1 data-[highlighted]:data-[state=open]:bg-green9 data-[highlighted]:data-[state=open]:text-green1"
                        >
                          More Tools
                          <div
                            class="ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8"
                          >
                            <Icon icon="radix-icons:chevron-right" />
                          </div>
                        </ContextMenuSubTrigger>
                        <ContextMenuPortal>
                          <ContextMenuSubContent
                            class="min-w-[220px] outline-none bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                            :side-offset="2"
                            :align-offset="-5"
                          >
                            <ContextMenuItem
                              class="group text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
                            >
                              Save Page As…
                              <div
                                class="ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8"
                              >
                                ⌘+S
                              </div>
                            </ContextMenuItem>
                            <ContextMenuItem
                              class="text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
                            >
                              Create Shortcut…
                            </ContextMenuItem>
                            <ContextMenuItem
                              class="text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
                            >
                              Name Window…
                            </ContextMenuItem>
                            <ContextMenuSeparator
                              class="h-[1px] bg-green6 m-[5px]"
                            />
                            <ContextMenuItem
                              class="text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
                            >
                              Developer Tools
                            </ContextMenuItem>
                          </ContextMenuSubContent>
                        </ContextMenuPortal>
                      </ContextMenuSub>
                    </ContextMenuSubContent>
                  </ContextMenuPortal>
                </ContextMenuSub>
                <ContextMenuItem
                  class="text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
                >
                  Developer Tools
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuPortal>
          </ContextMenuSub>
          <ContextMenuSeparator class="h-[1px] bg-green6 m-[5px]" />
          <ContextMenuCheckboxItem
            v-model="checkboxOne"
            class="group text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
          >
            <ContextMenuItemIndicator
              class="absolute left-0 w-[25px] inline-flex items-center justify-center"
            >
              <Icon icon="radix-icons:check" />
            </ContextMenuItemIndicator>
            Show Bookmarks
            <div
              class="ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8"
            >
              ⌘+B
            </div>
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            v-model="checkboxTwo"
            class="text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
          >
            <ContextMenuItemIndicator
              class="absolute left-0 w-[25px] inline-flex items-center justify-center"
            >
              <Icon icon="radix-icons:check" />
            </ContextMenuItemIndicator>
            Show Full URLs
          </ContextMenuCheckboxItem>
          <ContextMenuSeparator class="h-[1px] bg-green6 m-[5px]" />
          <ContextMenuLabel
            class="pl-[25px] text-xs leading-[25px] text-mauve11"
          >
            People
          </ContextMenuLabel>
          <ContextMenuRadioGroup v-model="person">
            <ContextMenuRadioItem
              class="text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
              value="pedro"
            >
              <ContextMenuItemIndicator
                class="absolute left-0 w-[25px] inline-flex items-center justify-center"
              >
                <Icon icon="radix-icons:dot-filled" />
              </ContextMenuItemIndicator>
              Pedro Duarte
            </ContextMenuRadioItem>
            <ContextMenuRadioItem
              class="text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
              value="colm"
            >
              <ContextMenuItemIndicator
                class="absolute left-0 w-[25px] inline-flex items-center justify-center"
              >
                <Icon icon="radix-icons:dot-filled" />
              </ContextMenuItemIndicator>
              Colm Tuite
            </ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenuPortal>
    </ContextMenuRoot>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import { Icon } from "@iconify/vue";
// import { ref } from 'vue'
import {
  ContextMenuArrow,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuItemIndicator,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuRoot,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "radix-vue";

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
