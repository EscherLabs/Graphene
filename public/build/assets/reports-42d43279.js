import { r as ref, w as watch, o as onMounted, c as computed, a as openBlock, b as createElementBlock, d as createBaseVNode, e as createCommentVNode, t as toDisplayString, F as Fragment, f as renderList, g as createTextVNode, n as normalizeClass, h as withModifiers, u as unref, i as cloneVNode, j as h$1, k as inject, p as provide, l as watchEffect, m as defineComponent, q as onUnmounted, s as nextTick, v as toRaw, x as createVNode, y as withCtx, T as Transition, z as createBlock, A as mergeDefaults, B as mergeProps, C as normalizeStyle, D as normalizeProps, E as resolveDynamicComponent, G as toRefs, H as withKeys, I as shallowRef, J as readonly, K as effectScope, L as getCurrentInstance, M as toHandlerKey, N as camelize, O as onBeforeUnmount, P as getCurrentScope, Q as onScopeDispose, R as shallowReadonly, S as renderSlot, U as useSlots, V as guardReactiveProps, W as customRef, X as onBeforeUpdate, Y as onUpdated, Z as reactive, _ as toRef, $ as withDirectives, a0 as isRef, a1 as Teleport, a2 as _sfc_main$9, a3 as createApp } from "./menuBar-f267832e.js";
import { r as render$4 } from "./CheckIcon-cf73135a.js";
const _hoisted_1$8 = { class: "empty:hidden h-56 flex items-center justify-center" };
const _hoisted_2$8 = {
  key: 0,
  class: "justify-self-center",
  role: "status"
};
const _hoisted_3$8 = /* @__PURE__ */ createBaseVNode("svg", {
  "aria-hidden": "true",
  class: "w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-brand-700",
  viewBox: "0 0 100 101",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, [
  /* @__PURE__ */ createBaseVNode("path", {
    d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z",
    fill: "currentColor"
  }),
  /* @__PURE__ */ createBaseVNode("path", {
    d: "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z",
    fill: "currentFill"
  })
], -1);
const _hoisted_4$7 = /* @__PURE__ */ createBaseVNode("span", { class: "sr-only" }, "Loading...", -1);
const _hoisted_5$5 = [
  _hoisted_3$8,
  _hoisted_4$7
];
const _hoisted_6$5 = {
  key: 1,
  class: "text-error-600 bg-error-100 p-4 rounded-md"
};
const _hoisted_7$5 = {
  key: 2,
  class: "bg-orange-100 text-orange-600 p-4 rounded-md"
};
const _hoisted_8$4 = ["onClick"];
const _hoisted_9$4 = {
  key: 0,
  class: "text-slate-300"
};
const _hoisted_10$4 = { class: "ml-auto flex items-end flex-col" };
const _sfc_main$8 = {
  __name: "reportCanvas",
  props: {
    records: {
      default: [],
      type: Array
    },
    status: {
      default: "",
      type: String
    },
    // navInfo: {
    //   type: Object,
    //   default: {},
    // },
    config: {
      type: Object,
      default: {}
    }
  },
  setup(__props) {
    const props = __props;
    const table = ref(null);
    const computedRecords = ref([]);
    watch(
      () => props.records,
      (newRecords) => {
        debugger;
        if (!("map" in props.config) || typeof props.config.map !== "object" || !props.config.map.length) {
          computedRecords.value = newRecords;
          return;
        }
        computedRecords.value = _.map(
          newRecords,
          (record) => $g.etl(
            $g.selectPath(record, props.config.path || ""),
            record,
            props.config.map
          )
        );
      }
    );
    onMounted((e3) => {
    });
    const go2 = ({ id: id2 }) => {
      window.open(`/workflows/report/${id2}`, "_blank");
    };
    const statelabel = (record) => {
      if (props.config.states && "state" in record) {
        const state = _.find($g.collections.get("_states"), {
          value: record.state
        });
        return typeof state != "undefined" && "label" in state ? state.label : "";
      }
    };
    const stateClass = (record) => {
      if (props.config.states && "state" in record) {
        const state = _.find($g.collections.get("_states"), {
          value: record.state
        });
        return typeof state != "undefined" && "styles" in state ? state.styles : "";
      }
    };
    const reportClass = computed(() => {
      if (props.status == "waiting" || !props.records.length) {
        return "grid-cols-1";
      }
      const { columns = 1, padding = 4 } = props.config;
      return `grid-cols-${columns} gap-${padding} p-${padding}`;
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("ul", {
        ref_key: "table",
        ref: table,
        class: normalizeClass(["grid divide-y top-12 overflow-auto border-b items-center justify-start", reportClass.value])
      }, [
        createBaseVNode("div", _hoisted_1$8, [
          __props.status == "waiting" ? (openBlock(), createElementBlock("div", _hoisted_2$8, _hoisted_5$5)) : createCommentVNode("", true),
          __props.status && __props.status !== "waiting" ? (openBlock(), createElementBlock("p", _hoisted_6$5, toDisplayString(__props.status), 1)) : createCommentVNode("", true),
          !__props.records.length && __props.status == "" ? (openBlock(), createElementBlock("span", _hoisted_7$5, " No matching records found ")) : createCommentVNode("", true)
        ]),
        (openBlock(true), createElementBlock(Fragment, null, renderList(computedRecords.value, (record) => {
          return openBlock(), createElementBlock("li", {
            onClick: ($event) => go2(record),
            href: "/workflows/report/{{id}}",
            target: "_blank",
            class: "pointer hover:bg-slate-100 p-4 px-2 gap-2 bg-white flex w-full cursor-pointer"
          }, [
            createBaseVNode("div", null, [
              createBaseVNode("div", null, [
                createBaseVNode("div", null, [
                  createTextVNode(toDisplayString(record.title) + " ", 1),
                  !record.title ? (openBlock(), createElementBlock("p", _hoisted_9$4, "(no title)")) : createCommentVNode("", true)
                ]),
                createBaseVNode("div", null, toDisplayString(record.opened_at), 1)
              ])
            ]),
            createBaseVNode("div", _hoisted_10$4, [
              createBaseVNode("div", {
                class: normalizeClass([stateClass(record)])
              }, toDisplayString(statelabel(record)), 3),
              createBaseVNode("div", {
                class: normalizeClass([
                  "uppercase rounded px-1 py-0.25 mt-1",
                  record.status == "open" ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"
                ])
              }, toDisplayString(record.status), 3)
            ])
          ], 8, _hoisted_8$4);
        }), 256))
      ], 2);
    };
  }
};
function _typeof(o2) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o3) {
    return typeof o3;
  } : function(o3) {
    return o3 && "function" == typeof Symbol && o3.constructor === Symbol && o3 !== Symbol.prototype ? "symbol" : typeof o3;
  }, _typeof(o2);
}
function toInteger(dirtyNumber) {
  if (dirtyNumber === null || dirtyNumber === true || dirtyNumber === false) {
    return NaN;
  }
  var number = Number(dirtyNumber);
  if (isNaN(number)) {
    return number;
  }
  return number < 0 ? Math.ceil(number) : Math.floor(number);
}
function requiredArgs(required, args) {
  if (args.length < required) {
    throw new TypeError(required + " argument" + (required > 1 ? "s" : "") + " required, but only " + args.length + " present");
  }
}
function toDate(argument) {
  requiredArgs(1, arguments);
  var argStr = Object.prototype.toString.call(argument);
  if (argument instanceof Date || _typeof(argument) === "object" && argStr === "[object Date]") {
    return new Date(argument.getTime());
  } else if (typeof argument === "number" || argStr === "[object Number]") {
    return new Date(argument);
  } else {
    if ((typeof argument === "string" || argStr === "[object String]") && typeof console !== "undefined") {
      console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#string-arguments");
      console.warn(new Error().stack);
    }
    return /* @__PURE__ */ new Date(NaN);
  }
}
function addDays(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var amount = toInteger(dirtyAmount);
  if (isNaN(amount)) {
    return /* @__PURE__ */ new Date(NaN);
  }
  if (!amount) {
    return date;
  }
  date.setDate(date.getDate() + amount);
  return date;
}
function addMonths(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var amount = toInteger(dirtyAmount);
  if (isNaN(amount)) {
    return /* @__PURE__ */ new Date(NaN);
  }
  if (!amount) {
    return date;
  }
  var dayOfMonth = date.getDate();
  var endOfDesiredMonth = new Date(date.getTime());
  endOfDesiredMonth.setMonth(date.getMonth() + amount + 1, 0);
  var daysInMonth = endOfDesiredMonth.getDate();
  if (dayOfMonth >= daysInMonth) {
    return endOfDesiredMonth;
  } else {
    date.setFullYear(endOfDesiredMonth.getFullYear(), endOfDesiredMonth.getMonth(), dayOfMonth);
    return date;
  }
}
function addMilliseconds(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var timestamp = toDate(dirtyDate).getTime();
  var amount = toInteger(dirtyAmount);
  return new Date(timestamp + amount);
}
var defaultOptions = {};
function getDefaultOptions() {
  return defaultOptions;
}
function getTimezoneOffsetInMilliseconds(date) {
  var utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
  utcDate.setUTCFullYear(date.getFullYear());
  return date.getTime() - utcDate.getTime();
}
var millisecondsInMinute = 6e4;
var millisecondsInHour = 36e5;
var millisecondsInSecond = 1e3;
function isDate(value) {
  requiredArgs(1, arguments);
  return value instanceof Date || _typeof(value) === "object" && Object.prototype.toString.call(value) === "[object Date]";
}
function isValid(dirtyDate) {
  requiredArgs(1, arguments);
  if (!isDate(dirtyDate) && typeof dirtyDate !== "number") {
    return false;
  }
  var date = toDate(dirtyDate);
  return !isNaN(Number(date));
}
function endOfMonth(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var month = date.getMonth();
  date.setFullYear(date.getFullYear(), month + 1, 0);
  date.setHours(23, 59, 59, 999);
  return date;
}
function startOfMonth(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
}
function subMilliseconds(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addMilliseconds(dirtyDate, -amount);
}
var MILLISECONDS_IN_DAY = 864e5;
function getUTCDayOfYear(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var timestamp = date.getTime();
  date.setUTCMonth(0, 1);
  date.setUTCHours(0, 0, 0, 0);
  var startOfYearTimestamp = date.getTime();
  var difference = timestamp - startOfYearTimestamp;
  return Math.floor(difference / MILLISECONDS_IN_DAY) + 1;
}
function startOfUTCISOWeek(dirtyDate) {
  requiredArgs(1, arguments);
  var weekStartsOn = 1;
  var date = toDate(dirtyDate);
  var day = date.getUTCDay();
  var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  date.setUTCDate(date.getUTCDate() - diff);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}
function getUTCISOWeekYear(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var year = date.getUTCFullYear();
  var fourthOfJanuaryOfNextYear = /* @__PURE__ */ new Date(0);
  fourthOfJanuaryOfNextYear.setUTCFullYear(year + 1, 0, 4);
  fourthOfJanuaryOfNextYear.setUTCHours(0, 0, 0, 0);
  var startOfNextYear = startOfUTCISOWeek(fourthOfJanuaryOfNextYear);
  var fourthOfJanuaryOfThisYear = /* @__PURE__ */ new Date(0);
  fourthOfJanuaryOfThisYear.setUTCFullYear(year, 0, 4);
  fourthOfJanuaryOfThisYear.setUTCHours(0, 0, 0, 0);
  var startOfThisYear = startOfUTCISOWeek(fourthOfJanuaryOfThisYear);
  if (date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}
function startOfUTCISOWeekYear(dirtyDate) {
  requiredArgs(1, arguments);
  var year = getUTCISOWeekYear(dirtyDate);
  var fourthOfJanuary = /* @__PURE__ */ new Date(0);
  fourthOfJanuary.setUTCFullYear(year, 0, 4);
  fourthOfJanuary.setUTCHours(0, 0, 0, 0);
  var date = startOfUTCISOWeek(fourthOfJanuary);
  return date;
}
var MILLISECONDS_IN_WEEK$1 = 6048e5;
function getUTCISOWeek(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var diff = startOfUTCISOWeek(date).getTime() - startOfUTCISOWeekYear(date).getTime();
  return Math.round(diff / MILLISECONDS_IN_WEEK$1) + 1;
}
function startOfUTCWeek(dirtyDate, options) {
  var _ref, _ref2, _ref3, _options$weekStartsOn, _options$locale, _options$locale$optio, _defaultOptions$local, _defaultOptions$local2;
  requiredArgs(1, arguments);
  var defaultOptions2 = getDefaultOptions();
  var weekStartsOn = toInteger((_ref = (_ref2 = (_ref3 = (_options$weekStartsOn = options === null || options === void 0 ? void 0 : options.weekStartsOn) !== null && _options$weekStartsOn !== void 0 ? _options$weekStartsOn : options === null || options === void 0 ? void 0 : (_options$locale = options.locale) === null || _options$locale === void 0 ? void 0 : (_options$locale$optio = _options$locale.options) === null || _options$locale$optio === void 0 ? void 0 : _options$locale$optio.weekStartsOn) !== null && _ref3 !== void 0 ? _ref3 : defaultOptions2.weekStartsOn) !== null && _ref2 !== void 0 ? _ref2 : (_defaultOptions$local = defaultOptions2.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.weekStartsOn) !== null && _ref !== void 0 ? _ref : 0);
  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  }
  var date = toDate(dirtyDate);
  var day = date.getUTCDay();
  var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  date.setUTCDate(date.getUTCDate() - diff);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}
function getUTCWeekYear(dirtyDate, options) {
  var _ref, _ref2, _ref3, _options$firstWeekCon, _options$locale, _options$locale$optio, _defaultOptions$local, _defaultOptions$local2;
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var year = date.getUTCFullYear();
  var defaultOptions2 = getDefaultOptions();
  var firstWeekContainsDate = toInteger((_ref = (_ref2 = (_ref3 = (_options$firstWeekCon = options === null || options === void 0 ? void 0 : options.firstWeekContainsDate) !== null && _options$firstWeekCon !== void 0 ? _options$firstWeekCon : options === null || options === void 0 ? void 0 : (_options$locale = options.locale) === null || _options$locale === void 0 ? void 0 : (_options$locale$optio = _options$locale.options) === null || _options$locale$optio === void 0 ? void 0 : _options$locale$optio.firstWeekContainsDate) !== null && _ref3 !== void 0 ? _ref3 : defaultOptions2.firstWeekContainsDate) !== null && _ref2 !== void 0 ? _ref2 : (_defaultOptions$local = defaultOptions2.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.firstWeekContainsDate) !== null && _ref !== void 0 ? _ref : 1);
  if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
    throw new RangeError("firstWeekContainsDate must be between 1 and 7 inclusively");
  }
  var firstWeekOfNextYear = /* @__PURE__ */ new Date(0);
  firstWeekOfNextYear.setUTCFullYear(year + 1, 0, firstWeekContainsDate);
  firstWeekOfNextYear.setUTCHours(0, 0, 0, 0);
  var startOfNextYear = startOfUTCWeek(firstWeekOfNextYear, options);
  var firstWeekOfThisYear = /* @__PURE__ */ new Date(0);
  firstWeekOfThisYear.setUTCFullYear(year, 0, firstWeekContainsDate);
  firstWeekOfThisYear.setUTCHours(0, 0, 0, 0);
  var startOfThisYear = startOfUTCWeek(firstWeekOfThisYear, options);
  if (date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}
function startOfUTCWeekYear(dirtyDate, options) {
  var _ref, _ref2, _ref3, _options$firstWeekCon, _options$locale, _options$locale$optio, _defaultOptions$local, _defaultOptions$local2;
  requiredArgs(1, arguments);
  var defaultOptions2 = getDefaultOptions();
  var firstWeekContainsDate = toInteger((_ref = (_ref2 = (_ref3 = (_options$firstWeekCon = options === null || options === void 0 ? void 0 : options.firstWeekContainsDate) !== null && _options$firstWeekCon !== void 0 ? _options$firstWeekCon : options === null || options === void 0 ? void 0 : (_options$locale = options.locale) === null || _options$locale === void 0 ? void 0 : (_options$locale$optio = _options$locale.options) === null || _options$locale$optio === void 0 ? void 0 : _options$locale$optio.firstWeekContainsDate) !== null && _ref3 !== void 0 ? _ref3 : defaultOptions2.firstWeekContainsDate) !== null && _ref2 !== void 0 ? _ref2 : (_defaultOptions$local = defaultOptions2.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.firstWeekContainsDate) !== null && _ref !== void 0 ? _ref : 1);
  var year = getUTCWeekYear(dirtyDate, options);
  var firstWeek = /* @__PURE__ */ new Date(0);
  firstWeek.setUTCFullYear(year, 0, firstWeekContainsDate);
  firstWeek.setUTCHours(0, 0, 0, 0);
  var date = startOfUTCWeek(firstWeek, options);
  return date;
}
var MILLISECONDS_IN_WEEK = 6048e5;
function getUTCWeek(dirtyDate, options) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var diff = startOfUTCWeek(date, options).getTime() - startOfUTCWeekYear(date, options).getTime();
  return Math.round(diff / MILLISECONDS_IN_WEEK) + 1;
}
function addLeadingZeros(number, targetLength) {
  var sign = number < 0 ? "-" : "";
  var output = Math.abs(number).toString();
  while (output.length < targetLength) {
    output = "0" + output;
  }
  return sign + output;
}
var formatters$2 = {
  // Year
  y: function y(date, token) {
    var signedYear = date.getUTCFullYear();
    var year = signedYear > 0 ? signedYear : 1 - signedYear;
    return addLeadingZeros(token === "yy" ? year % 100 : year, token.length);
  },
  // Month
  M: function M(date, token) {
    var month = date.getUTCMonth();
    return token === "M" ? String(month + 1) : addLeadingZeros(month + 1, 2);
  },
  // Day of the month
  d: function d(date, token) {
    return addLeadingZeros(date.getUTCDate(), token.length);
  },
  // AM or PM
  a: function a(date, token) {
    var dayPeriodEnumValue = date.getUTCHours() / 12 >= 1 ? "pm" : "am";
    switch (token) {
      case "a":
      case "aa":
        return dayPeriodEnumValue.toUpperCase();
      case "aaa":
        return dayPeriodEnumValue;
      case "aaaaa":
        return dayPeriodEnumValue[0];
      case "aaaa":
      default:
        return dayPeriodEnumValue === "am" ? "a.m." : "p.m.";
    }
  },
  // Hour [1-12]
  h: function h(date, token) {
    return addLeadingZeros(date.getUTCHours() % 12 || 12, token.length);
  },
  // Hour [0-23]
  H: function H(date, token) {
    return addLeadingZeros(date.getUTCHours(), token.length);
  },
  // Minute
  m: function m(date, token) {
    return addLeadingZeros(date.getUTCMinutes(), token.length);
  },
  // Second
  s: function s(date, token) {
    return addLeadingZeros(date.getUTCSeconds(), token.length);
  },
  // Fraction of second
  S: function S(date, token) {
    var numberOfDigits = token.length;
    var milliseconds = date.getUTCMilliseconds();
    var fractionalSeconds = Math.floor(milliseconds * Math.pow(10, numberOfDigits - 3));
    return addLeadingZeros(fractionalSeconds, token.length);
  }
};
const formatters$3 = formatters$2;
var dayPeriodEnum = {
  am: "am",
  pm: "pm",
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night"
};
var formatters = {
  // Era
  G: function G(date, token, localize2) {
    var era = date.getUTCFullYear() > 0 ? 1 : 0;
    switch (token) {
      case "G":
      case "GG":
      case "GGG":
        return localize2.era(era, {
          width: "abbreviated"
        });
      case "GGGGG":
        return localize2.era(era, {
          width: "narrow"
        });
      case "GGGG":
      default:
        return localize2.era(era, {
          width: "wide"
        });
    }
  },
  // Year
  y: function y2(date, token, localize2) {
    if (token === "yo") {
      var signedYear = date.getUTCFullYear();
      var year = signedYear > 0 ? signedYear : 1 - signedYear;
      return localize2.ordinalNumber(year, {
        unit: "year"
      });
    }
    return formatters$3.y(date, token);
  },
  // Local week-numbering year
  Y: function Y(date, token, localize2, options) {
    var signedWeekYear = getUTCWeekYear(date, options);
    var weekYear = signedWeekYear > 0 ? signedWeekYear : 1 - signedWeekYear;
    if (token === "YY") {
      var twoDigitYear = weekYear % 100;
      return addLeadingZeros(twoDigitYear, 2);
    }
    if (token === "Yo") {
      return localize2.ordinalNumber(weekYear, {
        unit: "year"
      });
    }
    return addLeadingZeros(weekYear, token.length);
  },
  // ISO week-numbering year
  R: function R(date, token) {
    var isoWeekYear = getUTCISOWeekYear(date);
    return addLeadingZeros(isoWeekYear, token.length);
  },
  // Extended year. This is a single number designating the year of this calendar system.
  // The main difference between `y` and `u` localizers are B.C. years:
  // | Year | `y` | `u` |
  // |------|-----|-----|
  // | AC 1 |   1 |   1 |
  // | BC 1 |   1 |   0 |
  // | BC 2 |   2 |  -1 |
  // Also `yy` always returns the last two digits of a year,
  // while `uu` pads single digit years to 2 characters and returns other years unchanged.
  u: function u(date, token) {
    var year = date.getUTCFullYear();
    return addLeadingZeros(year, token.length);
  },
  // Quarter
  Q: function Q(date, token, localize2) {
    var quarter = Math.ceil((date.getUTCMonth() + 1) / 3);
    switch (token) {
      case "Q":
        return String(quarter);
      case "QQ":
        return addLeadingZeros(quarter, 2);
      case "Qo":
        return localize2.ordinalNumber(quarter, {
          unit: "quarter"
        });
      case "QQQ":
        return localize2.quarter(quarter, {
          width: "abbreviated",
          context: "formatting"
        });
      case "QQQQQ":
        return localize2.quarter(quarter, {
          width: "narrow",
          context: "formatting"
        });
      case "QQQQ":
      default:
        return localize2.quarter(quarter, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone quarter
  q: function q(date, token, localize2) {
    var quarter = Math.ceil((date.getUTCMonth() + 1) / 3);
    switch (token) {
      case "q":
        return String(quarter);
      case "qq":
        return addLeadingZeros(quarter, 2);
      case "qo":
        return localize2.ordinalNumber(quarter, {
          unit: "quarter"
        });
      case "qqq":
        return localize2.quarter(quarter, {
          width: "abbreviated",
          context: "standalone"
        });
      case "qqqqq":
        return localize2.quarter(quarter, {
          width: "narrow",
          context: "standalone"
        });
      case "qqqq":
      default:
        return localize2.quarter(quarter, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // Month
  M: function M2(date, token, localize2) {
    var month = date.getUTCMonth();
    switch (token) {
      case "M":
      case "MM":
        return formatters$3.M(date, token);
      case "Mo":
        return localize2.ordinalNumber(month + 1, {
          unit: "month"
        });
      case "MMM":
        return localize2.month(month, {
          width: "abbreviated",
          context: "formatting"
        });
      case "MMMMM":
        return localize2.month(month, {
          width: "narrow",
          context: "formatting"
        });
      case "MMMM":
      default:
        return localize2.month(month, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone month
  L: function L(date, token, localize2) {
    var month = date.getUTCMonth();
    switch (token) {
      case "L":
        return String(month + 1);
      case "LL":
        return addLeadingZeros(month + 1, 2);
      case "Lo":
        return localize2.ordinalNumber(month + 1, {
          unit: "month"
        });
      case "LLL":
        return localize2.month(month, {
          width: "abbreviated",
          context: "standalone"
        });
      case "LLLLL":
        return localize2.month(month, {
          width: "narrow",
          context: "standalone"
        });
      case "LLLL":
      default:
        return localize2.month(month, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // Local week of year
  w: function w(date, token, localize2, options) {
    var week = getUTCWeek(date, options);
    if (token === "wo") {
      return localize2.ordinalNumber(week, {
        unit: "week"
      });
    }
    return addLeadingZeros(week, token.length);
  },
  // ISO week of year
  I: function I(date, token, localize2) {
    var isoWeek = getUTCISOWeek(date);
    if (token === "Io") {
      return localize2.ordinalNumber(isoWeek, {
        unit: "week"
      });
    }
    return addLeadingZeros(isoWeek, token.length);
  },
  // Day of the month
  d: function d2(date, token, localize2) {
    if (token === "do") {
      return localize2.ordinalNumber(date.getUTCDate(), {
        unit: "date"
      });
    }
    return formatters$3.d(date, token);
  },
  // Day of year
  D: function D(date, token, localize2) {
    var dayOfYear = getUTCDayOfYear(date);
    if (token === "Do") {
      return localize2.ordinalNumber(dayOfYear, {
        unit: "dayOfYear"
      });
    }
    return addLeadingZeros(dayOfYear, token.length);
  },
  // Day of week
  E: function E(date, token, localize2) {
    var dayOfWeek = date.getUTCDay();
    switch (token) {
      case "E":
      case "EE":
      case "EEE":
        return localize2.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting"
        });
      case "EEEEE":
        return localize2.day(dayOfWeek, {
          width: "narrow",
          context: "formatting"
        });
      case "EEEEEE":
        return localize2.day(dayOfWeek, {
          width: "short",
          context: "formatting"
        });
      case "EEEE":
      default:
        return localize2.day(dayOfWeek, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Local day of week
  e: function e(date, token, localize2, options) {
    var dayOfWeek = date.getUTCDay();
    var localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
    switch (token) {
      case "e":
        return String(localDayOfWeek);
      case "ee":
        return addLeadingZeros(localDayOfWeek, 2);
      case "eo":
        return localize2.ordinalNumber(localDayOfWeek, {
          unit: "day"
        });
      case "eee":
        return localize2.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting"
        });
      case "eeeee":
        return localize2.day(dayOfWeek, {
          width: "narrow",
          context: "formatting"
        });
      case "eeeeee":
        return localize2.day(dayOfWeek, {
          width: "short",
          context: "formatting"
        });
      case "eeee":
      default:
        return localize2.day(dayOfWeek, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone local day of week
  c: function c(date, token, localize2, options) {
    var dayOfWeek = date.getUTCDay();
    var localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
    switch (token) {
      case "c":
        return String(localDayOfWeek);
      case "cc":
        return addLeadingZeros(localDayOfWeek, token.length);
      case "co":
        return localize2.ordinalNumber(localDayOfWeek, {
          unit: "day"
        });
      case "ccc":
        return localize2.day(dayOfWeek, {
          width: "abbreviated",
          context: "standalone"
        });
      case "ccccc":
        return localize2.day(dayOfWeek, {
          width: "narrow",
          context: "standalone"
        });
      case "cccccc":
        return localize2.day(dayOfWeek, {
          width: "short",
          context: "standalone"
        });
      case "cccc":
      default:
        return localize2.day(dayOfWeek, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // ISO day of week
  i: function i(date, token, localize2) {
    var dayOfWeek = date.getUTCDay();
    var isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
    switch (token) {
      case "i":
        return String(isoDayOfWeek);
      case "ii":
        return addLeadingZeros(isoDayOfWeek, token.length);
      case "io":
        return localize2.ordinalNumber(isoDayOfWeek, {
          unit: "day"
        });
      case "iii":
        return localize2.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting"
        });
      case "iiiii":
        return localize2.day(dayOfWeek, {
          width: "narrow",
          context: "formatting"
        });
      case "iiiiii":
        return localize2.day(dayOfWeek, {
          width: "short",
          context: "formatting"
        });
      case "iiii":
      default:
        return localize2.day(dayOfWeek, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM or PM
  a: function a2(date, token, localize2) {
    var hours = date.getUTCHours();
    var dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
    switch (token) {
      case "a":
      case "aa":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        });
      case "aaa":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "aaaaa":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting"
        });
      case "aaaa":
      default:
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM, PM, midnight, noon
  b: function b(date, token, localize2) {
    var hours = date.getUTCHours();
    var dayPeriodEnumValue;
    if (hours === 12) {
      dayPeriodEnumValue = dayPeriodEnum.noon;
    } else if (hours === 0) {
      dayPeriodEnumValue = dayPeriodEnum.midnight;
    } else {
      dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
    }
    switch (token) {
      case "b":
      case "bb":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        });
      case "bbb":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "bbbbb":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting"
        });
      case "bbbb":
      default:
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // in the morning, in the afternoon, in the evening, at night
  B: function B(date, token, localize2) {
    var hours = date.getUTCHours();
    var dayPeriodEnumValue;
    if (hours >= 17) {
      dayPeriodEnumValue = dayPeriodEnum.evening;
    } else if (hours >= 12) {
      dayPeriodEnumValue = dayPeriodEnum.afternoon;
    } else if (hours >= 4) {
      dayPeriodEnumValue = dayPeriodEnum.morning;
    } else {
      dayPeriodEnumValue = dayPeriodEnum.night;
    }
    switch (token) {
      case "B":
      case "BB":
      case "BBB":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        });
      case "BBBBB":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting"
        });
      case "BBBB":
      default:
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Hour [1-12]
  h: function h2(date, token, localize2) {
    if (token === "ho") {
      var hours = date.getUTCHours() % 12;
      if (hours === 0)
        hours = 12;
      return localize2.ordinalNumber(hours, {
        unit: "hour"
      });
    }
    return formatters$3.h(date, token);
  },
  // Hour [0-23]
  H: function H2(date, token, localize2) {
    if (token === "Ho") {
      return localize2.ordinalNumber(date.getUTCHours(), {
        unit: "hour"
      });
    }
    return formatters$3.H(date, token);
  },
  // Hour [0-11]
  K: function K(date, token, localize2) {
    var hours = date.getUTCHours() % 12;
    if (token === "Ko") {
      return localize2.ordinalNumber(hours, {
        unit: "hour"
      });
    }
    return addLeadingZeros(hours, token.length);
  },
  // Hour [1-24]
  k: function k(date, token, localize2) {
    var hours = date.getUTCHours();
    if (hours === 0)
      hours = 24;
    if (token === "ko") {
      return localize2.ordinalNumber(hours, {
        unit: "hour"
      });
    }
    return addLeadingZeros(hours, token.length);
  },
  // Minute
  m: function m2(date, token, localize2) {
    if (token === "mo") {
      return localize2.ordinalNumber(date.getUTCMinutes(), {
        unit: "minute"
      });
    }
    return formatters$3.m(date, token);
  },
  // Second
  s: function s2(date, token, localize2) {
    if (token === "so") {
      return localize2.ordinalNumber(date.getUTCSeconds(), {
        unit: "second"
      });
    }
    return formatters$3.s(date, token);
  },
  // Fraction of second
  S: function S2(date, token) {
    return formatters$3.S(date, token);
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function X(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();
    if (timezoneOffset === 0) {
      return "Z";
    }
    switch (token) {
      case "X":
        return formatTimezoneWithOptionalMinutes(timezoneOffset);
      case "XXXX":
      case "XX":
        return formatTimezone(timezoneOffset);
      case "XXXXX":
      case "XXX":
      default:
        return formatTimezone(timezoneOffset, ":");
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function x(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();
    switch (token) {
      case "x":
        return formatTimezoneWithOptionalMinutes(timezoneOffset);
      case "xxxx":
      case "xx":
        return formatTimezone(timezoneOffset);
      case "xxxxx":
      case "xxx":
      default:
        return formatTimezone(timezoneOffset, ":");
    }
  },
  // Timezone (GMT)
  O: function O(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();
    switch (token) {
      case "O":
      case "OO":
      case "OOO":
        return "GMT" + formatTimezoneShort(timezoneOffset, ":");
      case "OOOO":
      default:
        return "GMT" + formatTimezone(timezoneOffset, ":");
    }
  },
  // Timezone (specific non-location)
  z: function z(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();
    switch (token) {
      case "z":
      case "zz":
      case "zzz":
        return "GMT" + formatTimezoneShort(timezoneOffset, ":");
      case "zzzz":
      default:
        return "GMT" + formatTimezone(timezoneOffset, ":");
    }
  },
  // Seconds timestamp
  t: function t(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timestamp = Math.floor(originalDate.getTime() / 1e3);
    return addLeadingZeros(timestamp, token.length);
  },
  // Milliseconds timestamp
  T: function T(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timestamp = originalDate.getTime();
    return addLeadingZeros(timestamp, token.length);
  }
};
function formatTimezoneShort(offset2, dirtyDelimiter) {
  var sign = offset2 > 0 ? "-" : "+";
  var absOffset = Math.abs(offset2);
  var hours = Math.floor(absOffset / 60);
  var minutes = absOffset % 60;
  if (minutes === 0) {
    return sign + String(hours);
  }
  var delimiter = dirtyDelimiter || "";
  return sign + String(hours) + delimiter + addLeadingZeros(minutes, 2);
}
function formatTimezoneWithOptionalMinutes(offset2, dirtyDelimiter) {
  if (offset2 % 60 === 0) {
    var sign = offset2 > 0 ? "-" : "+";
    return sign + addLeadingZeros(Math.abs(offset2) / 60, 2);
  }
  return formatTimezone(offset2, dirtyDelimiter);
}
function formatTimezone(offset2, dirtyDelimiter) {
  var delimiter = dirtyDelimiter || "";
  var sign = offset2 > 0 ? "-" : "+";
  var absOffset = Math.abs(offset2);
  var hours = addLeadingZeros(Math.floor(absOffset / 60), 2);
  var minutes = addLeadingZeros(absOffset % 60, 2);
  return sign + hours + delimiter + minutes;
}
const formatters$1 = formatters;
var dateLongFormatter = function dateLongFormatter2(pattern, formatLong2) {
  switch (pattern) {
    case "P":
      return formatLong2.date({
        width: "short"
      });
    case "PP":
      return formatLong2.date({
        width: "medium"
      });
    case "PPP":
      return formatLong2.date({
        width: "long"
      });
    case "PPPP":
    default:
      return formatLong2.date({
        width: "full"
      });
  }
};
var timeLongFormatter = function timeLongFormatter2(pattern, formatLong2) {
  switch (pattern) {
    case "p":
      return formatLong2.time({
        width: "short"
      });
    case "pp":
      return formatLong2.time({
        width: "medium"
      });
    case "ppp":
      return formatLong2.time({
        width: "long"
      });
    case "pppp":
    default:
      return formatLong2.time({
        width: "full"
      });
  }
};
var dateTimeLongFormatter = function dateTimeLongFormatter2(pattern, formatLong2) {
  var matchResult = pattern.match(/(P+)(p+)?/) || [];
  var datePattern = matchResult[1];
  var timePattern = matchResult[2];
  if (!timePattern) {
    return dateLongFormatter(pattern, formatLong2);
  }
  var dateTimeFormat;
  switch (datePattern) {
    case "P":
      dateTimeFormat = formatLong2.dateTime({
        width: "short"
      });
      break;
    case "PP":
      dateTimeFormat = formatLong2.dateTime({
        width: "medium"
      });
      break;
    case "PPP":
      dateTimeFormat = formatLong2.dateTime({
        width: "long"
      });
      break;
    case "PPPP":
    default:
      dateTimeFormat = formatLong2.dateTime({
        width: "full"
      });
      break;
  }
  return dateTimeFormat.replace("{{date}}", dateLongFormatter(datePattern, formatLong2)).replace("{{time}}", timeLongFormatter(timePattern, formatLong2));
};
var longFormatters = {
  p: timeLongFormatter,
  P: dateTimeLongFormatter
};
const longFormatters$1 = longFormatters;
var protectedDayOfYearTokens = ["D", "DD"];
var protectedWeekYearTokens = ["YY", "YYYY"];
function isProtectedDayOfYearToken(token) {
  return protectedDayOfYearTokens.indexOf(token) !== -1;
}
function isProtectedWeekYearToken(token) {
  return protectedWeekYearTokens.indexOf(token) !== -1;
}
function throwProtectedError(token, format2, input) {
  if (token === "YYYY") {
    throw new RangeError("Use `yyyy` instead of `YYYY` (in `".concat(format2, "`) for formatting years to the input `").concat(input, "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));
  } else if (token === "YY") {
    throw new RangeError("Use `yy` instead of `YY` (in `".concat(format2, "`) for formatting years to the input `").concat(input, "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));
  } else if (token === "D") {
    throw new RangeError("Use `d` instead of `D` (in `".concat(format2, "`) for formatting days of the month to the input `").concat(input, "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));
  } else if (token === "DD") {
    throw new RangeError("Use `dd` instead of `DD` (in `".concat(format2, "`) for formatting days of the month to the input `").concat(input, "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));
  }
}
var formatDistanceLocale = {
  lessThanXSeconds: {
    one: "less than a second",
    other: "less than {{count}} seconds"
  },
  xSeconds: {
    one: "1 second",
    other: "{{count}} seconds"
  },
  halfAMinute: "half a minute",
  lessThanXMinutes: {
    one: "less than a minute",
    other: "less than {{count}} minutes"
  },
  xMinutes: {
    one: "1 minute",
    other: "{{count}} minutes"
  },
  aboutXHours: {
    one: "about 1 hour",
    other: "about {{count}} hours"
  },
  xHours: {
    one: "1 hour",
    other: "{{count}} hours"
  },
  xDays: {
    one: "1 day",
    other: "{{count}} days"
  },
  aboutXWeeks: {
    one: "about 1 week",
    other: "about {{count}} weeks"
  },
  xWeeks: {
    one: "1 week",
    other: "{{count}} weeks"
  },
  aboutXMonths: {
    one: "about 1 month",
    other: "about {{count}} months"
  },
  xMonths: {
    one: "1 month",
    other: "{{count}} months"
  },
  aboutXYears: {
    one: "about 1 year",
    other: "about {{count}} years"
  },
  xYears: {
    one: "1 year",
    other: "{{count}} years"
  },
  overXYears: {
    one: "over 1 year",
    other: "over {{count}} years"
  },
  almostXYears: {
    one: "almost 1 year",
    other: "almost {{count}} years"
  }
};
var formatDistance = function formatDistance2(token, count, options) {
  var result;
  var tokenValue = formatDistanceLocale[token];
  if (typeof tokenValue === "string") {
    result = tokenValue;
  } else if (count === 1) {
    result = tokenValue.one;
  } else {
    result = tokenValue.other.replace("{{count}}", count.toString());
  }
  if (options !== null && options !== void 0 && options.addSuffix) {
    if (options.comparison && options.comparison > 0) {
      return "in " + result;
    } else {
      return result + " ago";
    }
  }
  return result;
};
const formatDistance$1 = formatDistance;
function buildFormatLongFn(args) {
  return function() {
    var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    var width = options.width ? String(options.width) : args.defaultWidth;
    var format2 = args.formats[width] || args.formats[args.defaultWidth];
    return format2;
  };
}
var dateFormats = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
};
var timeFormats = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
};
var dateTimeFormats = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong = {
  date: buildFormatLongFn({
    formats: dateFormats,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats,
    defaultWidth: "full"
  })
};
const formatLong$1 = formatLong;
var formatRelativeLocale = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
};
var formatRelative = function formatRelative2(token, _date, _baseDate, _options) {
  return formatRelativeLocale[token];
};
const formatRelative$1 = formatRelative;
function buildLocalizeFn(args) {
  return function(dirtyIndex, options) {
    var context = options !== null && options !== void 0 && options.context ? String(options.context) : "standalone";
    var valuesArray;
    if (context === "formatting" && args.formattingValues) {
      var defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
      var width = options !== null && options !== void 0 && options.width ? String(options.width) : defaultWidth;
      valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
    } else {
      var _defaultWidth = args.defaultWidth;
      var _width = options !== null && options !== void 0 && options.width ? String(options.width) : args.defaultWidth;
      valuesArray = args.values[_width] || args.values[_defaultWidth];
    }
    var index = args.argumentCallback ? args.argumentCallback(dirtyIndex) : dirtyIndex;
    return valuesArray[index];
  };
}
var eraValues = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
};
var quarterValues = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
};
var monthValues = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  wide: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
};
var dayValues = {
  narrow: ["S", "M", "T", "W", "T", "F", "S"],
  short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  wide: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
};
var dayPeriodValues = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  }
};
var formattingDayPeriodValues = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  }
};
var ordinalNumber = function ordinalNumber2(dirtyNumber, _options) {
  var number = Number(dirtyNumber);
  var rem100 = number % 100;
  if (rem100 > 20 || rem100 < 10) {
    switch (rem100 % 10) {
      case 1:
        return number + "st";
      case 2:
        return number + "nd";
      case 3:
        return number + "rd";
    }
  }
  return number + "th";
};
var localize = {
  ordinalNumber,
  era: buildLocalizeFn({
    values: eraValues,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues,
    defaultWidth: "wide",
    argumentCallback: function argumentCallback(quarter) {
      return quarter - 1;
    }
  }),
  month: buildLocalizeFn({
    values: monthValues,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues,
    defaultFormattingWidth: "wide"
  })
};
const localize$1 = localize;
function buildMatchFn(args) {
  return function(string) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var width = options.width;
    var matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
    var matchResult = string.match(matchPattern);
    if (!matchResult) {
      return null;
    }
    var matchedString = matchResult[0];
    var parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
    var key = Array.isArray(parsePatterns) ? findIndex(parsePatterns, function(pattern) {
      return pattern.test(matchedString);
    }) : findKey(parsePatterns, function(pattern) {
      return pattern.test(matchedString);
    });
    var value;
    value = args.valueCallback ? args.valueCallback(key) : key;
    value = options.valueCallback ? options.valueCallback(value) : value;
    var rest = string.slice(matchedString.length);
    return {
      value,
      rest
    };
  };
}
function findKey(object, predicate) {
  for (var key in object) {
    if (object.hasOwnProperty(key) && predicate(object[key])) {
      return key;
    }
  }
  return void 0;
}
function findIndex(array, predicate) {
  for (var key = 0; key < array.length; key++) {
    if (predicate(array[key])) {
      return key;
    }
  }
  return void 0;
}
function buildMatchPatternFn(args) {
  return function(string) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var matchResult = string.match(args.matchPattern);
    if (!matchResult)
      return null;
    var matchedString = matchResult[0];
    var parseResult = string.match(args.parsePattern);
    if (!parseResult)
      return null;
    var value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
    value = options.valueCallback ? options.valueCallback(value) : value;
    var rest = string.slice(matchedString.length);
    return {
      value,
      rest
    };
  };
}
var matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
var parseOrdinalNumberPattern = /\d+/i;
var matchEraPatterns = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
};
var parseEraPatterns = {
  any: [/^b/i, /^(a|c)/i]
};
var matchQuarterPatterns = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
};
var parseQuarterPatterns = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
};
var parseMonthPatterns = {
  narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
  any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^may/i, /^jun/i, /^jul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i]
};
var matchDayPatterns = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
};
var parseDayPatterns = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
};
var matchDayPeriodPatterns = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
};
var parseDayPeriodPatterns = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i
  }
};
var match = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern,
    parsePattern: parseOrdinalNumberPattern,
    valueCallback: function valueCallback(value) {
      return parseInt(value, 10);
    }
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns,
    defaultParseWidth: "any",
    valueCallback: function valueCallback2(index) {
      return index + 1;
    }
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns,
    defaultParseWidth: "any"
  })
};
const match$1 = match;
var locale = {
  code: "en-US",
  formatDistance: formatDistance$1,
  formatLong: formatLong$1,
  formatRelative: formatRelative$1,
  localize: localize$1,
  match: match$1,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};
const defaultLocale = locale;
var formattingTokensRegExp$1 = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;
var longFormattingTokensRegExp$1 = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
var escapedStringRegExp$1 = /^'([^]*?)'?$/;
var doubleQuoteRegExp$1 = /''/g;
var unescapedLatinCharacterRegExp$1 = /[a-zA-Z]/;
function format(dirtyDate, dirtyFormatStr, options) {
  var _ref, _options$locale, _ref2, _ref3, _ref4, _options$firstWeekCon, _options$locale2, _options$locale2$opti, _defaultOptions$local, _defaultOptions$local2, _ref5, _ref6, _ref7, _options$weekStartsOn, _options$locale3, _options$locale3$opti, _defaultOptions$local3, _defaultOptions$local4;
  requiredArgs(2, arguments);
  var formatStr = String(dirtyFormatStr);
  var defaultOptions2 = getDefaultOptions();
  var locale2 = (_ref = (_options$locale = options === null || options === void 0 ? void 0 : options.locale) !== null && _options$locale !== void 0 ? _options$locale : defaultOptions2.locale) !== null && _ref !== void 0 ? _ref : defaultLocale;
  var firstWeekContainsDate = toInteger((_ref2 = (_ref3 = (_ref4 = (_options$firstWeekCon = options === null || options === void 0 ? void 0 : options.firstWeekContainsDate) !== null && _options$firstWeekCon !== void 0 ? _options$firstWeekCon : options === null || options === void 0 ? void 0 : (_options$locale2 = options.locale) === null || _options$locale2 === void 0 ? void 0 : (_options$locale2$opti = _options$locale2.options) === null || _options$locale2$opti === void 0 ? void 0 : _options$locale2$opti.firstWeekContainsDate) !== null && _ref4 !== void 0 ? _ref4 : defaultOptions2.firstWeekContainsDate) !== null && _ref3 !== void 0 ? _ref3 : (_defaultOptions$local = defaultOptions2.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.firstWeekContainsDate) !== null && _ref2 !== void 0 ? _ref2 : 1);
  if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
    throw new RangeError("firstWeekContainsDate must be between 1 and 7 inclusively");
  }
  var weekStartsOn = toInteger((_ref5 = (_ref6 = (_ref7 = (_options$weekStartsOn = options === null || options === void 0 ? void 0 : options.weekStartsOn) !== null && _options$weekStartsOn !== void 0 ? _options$weekStartsOn : options === null || options === void 0 ? void 0 : (_options$locale3 = options.locale) === null || _options$locale3 === void 0 ? void 0 : (_options$locale3$opti = _options$locale3.options) === null || _options$locale3$opti === void 0 ? void 0 : _options$locale3$opti.weekStartsOn) !== null && _ref7 !== void 0 ? _ref7 : defaultOptions2.weekStartsOn) !== null && _ref6 !== void 0 ? _ref6 : (_defaultOptions$local3 = defaultOptions2.locale) === null || _defaultOptions$local3 === void 0 ? void 0 : (_defaultOptions$local4 = _defaultOptions$local3.options) === null || _defaultOptions$local4 === void 0 ? void 0 : _defaultOptions$local4.weekStartsOn) !== null && _ref5 !== void 0 ? _ref5 : 0);
  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  }
  if (!locale2.localize) {
    throw new RangeError("locale must contain localize property");
  }
  if (!locale2.formatLong) {
    throw new RangeError("locale must contain formatLong property");
  }
  var originalDate = toDate(dirtyDate);
  if (!isValid(originalDate)) {
    throw new RangeError("Invalid time value");
  }
  var timezoneOffset = getTimezoneOffsetInMilliseconds(originalDate);
  var utcDate = subMilliseconds(originalDate, timezoneOffset);
  var formatterOptions = {
    firstWeekContainsDate,
    weekStartsOn,
    locale: locale2,
    _originalDate: originalDate
  };
  var result = formatStr.match(longFormattingTokensRegExp$1).map(function(substring) {
    var firstCharacter = substring[0];
    if (firstCharacter === "p" || firstCharacter === "P") {
      var longFormatter = longFormatters$1[firstCharacter];
      return longFormatter(substring, locale2.formatLong);
    }
    return substring;
  }).join("").match(formattingTokensRegExp$1).map(function(substring) {
    if (substring === "''") {
      return "'";
    }
    var firstCharacter = substring[0];
    if (firstCharacter === "'") {
      return cleanEscapedString$1(substring);
    }
    var formatter = formatters$1[firstCharacter];
    if (formatter) {
      if (!(options !== null && options !== void 0 && options.useAdditionalWeekYearTokens) && isProtectedWeekYearToken(substring)) {
        throwProtectedError(substring, dirtyFormatStr, String(dirtyDate));
      }
      if (!(options !== null && options !== void 0 && options.useAdditionalDayOfYearTokens) && isProtectedDayOfYearToken(substring)) {
        throwProtectedError(substring, dirtyFormatStr, String(dirtyDate));
      }
      return formatter(utcDate, substring, locale2.localize, formatterOptions);
    }
    if (firstCharacter.match(unescapedLatinCharacterRegExp$1)) {
      throw new RangeError("Format string contains an unescaped latin alphabet character `" + firstCharacter + "`");
    }
    return substring;
  }).join("");
  return result;
}
function cleanEscapedString$1(input) {
  var matched = input.match(escapedStringRegExp$1);
  if (!matched) {
    return input;
  }
  return matched[1].replace(doubleQuoteRegExp$1, "'");
}
function assign(target, object) {
  if (target == null) {
    throw new TypeError("assign requires that input parameter not be null or undefined");
  }
  for (var property in object) {
    if (Object.prototype.hasOwnProperty.call(object, property)) {
      target[property] = object[property];
    }
  }
  return target;
}
function getDate(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var dayOfMonth = date.getDate();
  return dayOfMonth;
}
function getDay(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var day = date.getDay();
  return day;
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i3 = 0, arr2 = new Array(len); i3 < len; i3++)
    arr2[i3] = arr[i3];
  return arr2;
}
function _unsupportedIterableToArray(o2, minLen) {
  if (!o2)
    return;
  if (typeof o2 === "string")
    return _arrayLikeToArray(o2, minLen);
  var n2 = Object.prototype.toString.call(o2).slice(8, -1);
  if (n2 === "Object" && o2.constructor)
    n2 = o2.constructor.name;
  if (n2 === "Map" || n2 === "Set")
    return Array.from(o2);
  if (n2 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n2))
    return _arrayLikeToArray(o2, minLen);
}
function _createForOfIteratorHelper(o2, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o2[Symbol.iterator] || o2["@@iterator"];
  if (!it) {
    if (Array.isArray(o2) || (it = _unsupportedIterableToArray(o2)) || allowArrayLike && o2 && typeof o2.length === "number") {
      if (it)
        o2 = it;
      var i3 = 0;
      var F2 = function F3() {
      };
      return {
        s: F2,
        n: function n2() {
          if (i3 >= o2.length)
            return {
              done: true
            };
          return {
            done: false,
            value: o2[i3++]
          };
        },
        e: function e3(_e) {
          throw _e;
        },
        f: F2
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var normalCompletion = true, didErr = false, err;
  return {
    s: function s4() {
      it = it.call(o2);
    },
    n: function n2() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function e3(_e2) {
      didErr = true;
      err = _e2;
    },
    f: function f2() {
      try {
        if (!normalCompletion && it["return"] != null)
          it["return"]();
      } finally {
        if (didErr)
          throw err;
      }
    }
  };
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _setPrototypeOf(o2, p2) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o3, p3) {
    o3.__proto__ = p3;
    return o3;
  };
  return _setPrototypeOf(o2, p2);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass)
    _setPrototypeOf(subClass, superClass);
}
function _getPrototypeOf(o2) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o3) {
    return o3.__proto__ || Object.getPrototypeOf(o3);
  };
  return _getPrototypeOf(o2);
}
function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct)
    return false;
  if (Reflect.construct.sham)
    return false;
  if (typeof Proxy === "function")
    return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e3) {
    return false;
  }
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived), result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null)
    return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== void 0) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object")
      return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
function _defineProperties(target, props) {
  for (var i3 = 0; i3 < props.length; i3++) {
    var descriptor = props[i3];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var TIMEZONE_UNIT_PRIORITY = 10;
var Setter = /* @__PURE__ */ function() {
  function Setter2() {
    _classCallCheck(this, Setter2);
    _defineProperty(this, "priority", void 0);
    _defineProperty(this, "subPriority", 0);
  }
  _createClass(Setter2, [{
    key: "validate",
    value: function validate(_utcDate, _options) {
      return true;
    }
  }]);
  return Setter2;
}();
var ValueSetter = /* @__PURE__ */ function(_Setter) {
  _inherits(ValueSetter2, _Setter);
  var _super = _createSuper(ValueSetter2);
  function ValueSetter2(value, validateValue, setValue, priority, subPriority) {
    var _this;
    _classCallCheck(this, ValueSetter2);
    _this = _super.call(this);
    _this.value = value;
    _this.validateValue = validateValue;
    _this.setValue = setValue;
    _this.priority = priority;
    if (subPriority) {
      _this.subPriority = subPriority;
    }
    return _this;
  }
  _createClass(ValueSetter2, [{
    key: "validate",
    value: function validate(utcDate, options) {
      return this.validateValue(utcDate, this.value, options);
    }
  }, {
    key: "set",
    value: function set(utcDate, flags, options) {
      return this.setValue(utcDate, flags, this.value, options);
    }
  }]);
  return ValueSetter2;
}(Setter);
var DateToSystemTimezoneSetter = /* @__PURE__ */ function(_Setter2) {
  _inherits(DateToSystemTimezoneSetter2, _Setter2);
  var _super2 = _createSuper(DateToSystemTimezoneSetter2);
  function DateToSystemTimezoneSetter2() {
    var _this2;
    _classCallCheck(this, DateToSystemTimezoneSetter2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this2 = _super2.call.apply(_super2, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this2), "priority", TIMEZONE_UNIT_PRIORITY);
    _defineProperty(_assertThisInitialized(_this2), "subPriority", -1);
    return _this2;
  }
  _createClass(DateToSystemTimezoneSetter2, [{
    key: "set",
    value: function set(date, flags) {
      if (flags.timestampIsSet) {
        return date;
      }
      var convertedDate = /* @__PURE__ */ new Date(0);
      convertedDate.setFullYear(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
      convertedDate.setHours(date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
      return convertedDate;
    }
  }]);
  return DateToSystemTimezoneSetter2;
}(Setter);
var Parser = /* @__PURE__ */ function() {
  function Parser2() {
    _classCallCheck(this, Parser2);
    _defineProperty(this, "incompatibleTokens", void 0);
    _defineProperty(this, "priority", void 0);
    _defineProperty(this, "subPriority", void 0);
  }
  _createClass(Parser2, [{
    key: "run",
    value: function run(dateString, token, match2, options) {
      var result = this.parse(dateString, token, match2, options);
      if (!result) {
        return null;
      }
      return {
        setter: new ValueSetter(result.value, this.validate, this.set, this.priority, this.subPriority),
        rest: result.rest
      };
    }
  }, {
    key: "validate",
    value: function validate(_utcDate, _value, _options) {
      return true;
    }
  }]);
  return Parser2;
}();
var EraParser = /* @__PURE__ */ function(_Parser) {
  _inherits(EraParser2, _Parser);
  var _super = _createSuper(EraParser2);
  function EraParser2() {
    var _this;
    _classCallCheck(this, EraParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 140);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["R", "u", "t", "T"]);
    return _this;
  }
  _createClass(EraParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "G":
        case "GG":
        case "GGG":
          return match2.era(dateString, {
            width: "abbreviated"
          }) || match2.era(dateString, {
            width: "narrow"
          });
        case "GGGGG":
          return match2.era(dateString, {
            width: "narrow"
          });
        case "GGGG":
        default:
          return match2.era(dateString, {
            width: "wide"
          }) || match2.era(dateString, {
            width: "abbreviated"
          }) || match2.era(dateString, {
            width: "narrow"
          });
      }
    }
  }, {
    key: "set",
    value: function set(date, flags, value) {
      flags.era = value;
      date.setUTCFullYear(value, 0, 1);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return EraParser2;
}(Parser);
var numericPatterns = {
  month: /^(1[0-2]|0?\d)/,
  // 0 to 12
  date: /^(3[0-1]|[0-2]?\d)/,
  // 0 to 31
  dayOfYear: /^(36[0-6]|3[0-5]\d|[0-2]?\d?\d)/,
  // 0 to 366
  week: /^(5[0-3]|[0-4]?\d)/,
  // 0 to 53
  hour23h: /^(2[0-3]|[0-1]?\d)/,
  // 0 to 23
  hour24h: /^(2[0-4]|[0-1]?\d)/,
  // 0 to 24
  hour11h: /^(1[0-1]|0?\d)/,
  // 0 to 11
  hour12h: /^(1[0-2]|0?\d)/,
  // 0 to 12
  minute: /^[0-5]?\d/,
  // 0 to 59
  second: /^[0-5]?\d/,
  // 0 to 59
  singleDigit: /^\d/,
  // 0 to 9
  twoDigits: /^\d{1,2}/,
  // 0 to 99
  threeDigits: /^\d{1,3}/,
  // 0 to 999
  fourDigits: /^\d{1,4}/,
  // 0 to 9999
  anyDigitsSigned: /^-?\d+/,
  singleDigitSigned: /^-?\d/,
  // 0 to 9, -0 to -9
  twoDigitsSigned: /^-?\d{1,2}/,
  // 0 to 99, -0 to -99
  threeDigitsSigned: /^-?\d{1,3}/,
  // 0 to 999, -0 to -999
  fourDigitsSigned: /^-?\d{1,4}/
  // 0 to 9999, -0 to -9999
};
var timezonePatterns = {
  basicOptionalMinutes: /^([+-])(\d{2})(\d{2})?|Z/,
  basic: /^([+-])(\d{2})(\d{2})|Z/,
  basicOptionalSeconds: /^([+-])(\d{2})(\d{2})((\d{2}))?|Z/,
  extended: /^([+-])(\d{2}):(\d{2})|Z/,
  extendedOptionalSeconds: /^([+-])(\d{2}):(\d{2})(:(\d{2}))?|Z/
};
function mapValue(parseFnResult, mapFn) {
  if (!parseFnResult) {
    return parseFnResult;
  }
  return {
    value: mapFn(parseFnResult.value),
    rest: parseFnResult.rest
  };
}
function parseNumericPattern(pattern, dateString) {
  var matchResult = dateString.match(pattern);
  if (!matchResult) {
    return null;
  }
  return {
    value: parseInt(matchResult[0], 10),
    rest: dateString.slice(matchResult[0].length)
  };
}
function parseTimezonePattern(pattern, dateString) {
  var matchResult = dateString.match(pattern);
  if (!matchResult) {
    return null;
  }
  if (matchResult[0] === "Z") {
    return {
      value: 0,
      rest: dateString.slice(1)
    };
  }
  var sign = matchResult[1] === "+" ? 1 : -1;
  var hours = matchResult[2] ? parseInt(matchResult[2], 10) : 0;
  var minutes = matchResult[3] ? parseInt(matchResult[3], 10) : 0;
  var seconds = matchResult[5] ? parseInt(matchResult[5], 10) : 0;
  return {
    value: sign * (hours * millisecondsInHour + minutes * millisecondsInMinute + seconds * millisecondsInSecond),
    rest: dateString.slice(matchResult[0].length)
  };
}
function parseAnyDigitsSigned(dateString) {
  return parseNumericPattern(numericPatterns.anyDigitsSigned, dateString);
}
function parseNDigits(n2, dateString) {
  switch (n2) {
    case 1:
      return parseNumericPattern(numericPatterns.singleDigit, dateString);
    case 2:
      return parseNumericPattern(numericPatterns.twoDigits, dateString);
    case 3:
      return parseNumericPattern(numericPatterns.threeDigits, dateString);
    case 4:
      return parseNumericPattern(numericPatterns.fourDigits, dateString);
    default:
      return parseNumericPattern(new RegExp("^\\d{1," + n2 + "}"), dateString);
  }
}
function parseNDigitsSigned(n2, dateString) {
  switch (n2) {
    case 1:
      return parseNumericPattern(numericPatterns.singleDigitSigned, dateString);
    case 2:
      return parseNumericPattern(numericPatterns.twoDigitsSigned, dateString);
    case 3:
      return parseNumericPattern(numericPatterns.threeDigitsSigned, dateString);
    case 4:
      return parseNumericPattern(numericPatterns.fourDigitsSigned, dateString);
    default:
      return parseNumericPattern(new RegExp("^-?\\d{1," + n2 + "}"), dateString);
  }
}
function dayPeriodEnumToHours(dayPeriod) {
  switch (dayPeriod) {
    case "morning":
      return 4;
    case "evening":
      return 17;
    case "pm":
    case "noon":
    case "afternoon":
      return 12;
    case "am":
    case "midnight":
    case "night":
    default:
      return 0;
  }
}
function normalizeTwoDigitYear(twoDigitYear, currentYear) {
  var isCommonEra = currentYear > 0;
  var absCurrentYear = isCommonEra ? currentYear : 1 - currentYear;
  var result;
  if (absCurrentYear <= 50) {
    result = twoDigitYear || 100;
  } else {
    var rangeEnd = absCurrentYear + 50;
    var rangeEndCentury = Math.floor(rangeEnd / 100) * 100;
    var isPreviousCentury = twoDigitYear >= rangeEnd % 100;
    result = twoDigitYear + rangeEndCentury - (isPreviousCentury ? 100 : 0);
  }
  return isCommonEra ? result : 1 - result;
}
function isLeapYearIndex$1(year) {
  return year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
}
var YearParser = /* @__PURE__ */ function(_Parser) {
  _inherits(YearParser2, _Parser);
  var _super = _createSuper(YearParser2);
  function YearParser2() {
    var _this;
    _classCallCheck(this, YearParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 130);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["Y", "R", "u", "w", "I", "i", "e", "c", "t", "T"]);
    return _this;
  }
  _createClass(YearParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      var valueCallback3 = function valueCallback4(year) {
        return {
          year,
          isTwoDigitYear: token === "yy"
        };
      };
      switch (token) {
        case "y":
          return mapValue(parseNDigits(4, dateString), valueCallback3);
        case "yo":
          return mapValue(match2.ordinalNumber(dateString, {
            unit: "year"
          }), valueCallback3);
        default:
          return mapValue(parseNDigits(token.length, dateString), valueCallback3);
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value.isTwoDigitYear || value.year > 0;
    }
  }, {
    key: "set",
    value: function set(date, flags, value) {
      var currentYear = date.getUTCFullYear();
      if (value.isTwoDigitYear) {
        var normalizedTwoDigitYear = normalizeTwoDigitYear(value.year, currentYear);
        date.setUTCFullYear(normalizedTwoDigitYear, 0, 1);
        date.setUTCHours(0, 0, 0, 0);
        return date;
      }
      var year = !("era" in flags) || flags.era === 1 ? value.year : 1 - value.year;
      date.setUTCFullYear(year, 0, 1);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return YearParser2;
}(Parser);
var LocalWeekYearParser = /* @__PURE__ */ function(_Parser) {
  _inherits(LocalWeekYearParser2, _Parser);
  var _super = _createSuper(LocalWeekYearParser2);
  function LocalWeekYearParser2() {
    var _this;
    _classCallCheck(this, LocalWeekYearParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 130);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["y", "R", "u", "Q", "q", "M", "L", "I", "d", "D", "i", "t", "T"]);
    return _this;
  }
  _createClass(LocalWeekYearParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      var valueCallback3 = function valueCallback4(year) {
        return {
          year,
          isTwoDigitYear: token === "YY"
        };
      };
      switch (token) {
        case "Y":
          return mapValue(parseNDigits(4, dateString), valueCallback3);
        case "Yo":
          return mapValue(match2.ordinalNumber(dateString, {
            unit: "year"
          }), valueCallback3);
        default:
          return mapValue(parseNDigits(token.length, dateString), valueCallback3);
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value.isTwoDigitYear || value.year > 0;
    }
  }, {
    key: "set",
    value: function set(date, flags, value, options) {
      var currentYear = getUTCWeekYear(date, options);
      if (value.isTwoDigitYear) {
        var normalizedTwoDigitYear = normalizeTwoDigitYear(value.year, currentYear);
        date.setUTCFullYear(normalizedTwoDigitYear, 0, options.firstWeekContainsDate);
        date.setUTCHours(0, 0, 0, 0);
        return startOfUTCWeek(date, options);
      }
      var year = !("era" in flags) || flags.era === 1 ? value.year : 1 - value.year;
      date.setUTCFullYear(year, 0, options.firstWeekContainsDate);
      date.setUTCHours(0, 0, 0, 0);
      return startOfUTCWeek(date, options);
    }
  }]);
  return LocalWeekYearParser2;
}(Parser);
var ISOWeekYearParser = /* @__PURE__ */ function(_Parser) {
  _inherits(ISOWeekYearParser2, _Parser);
  var _super = _createSuper(ISOWeekYearParser2);
  function ISOWeekYearParser2() {
    var _this;
    _classCallCheck(this, ISOWeekYearParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 130);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["G", "y", "Y", "u", "Q", "q", "M", "L", "w", "d", "D", "e", "c", "t", "T"]);
    return _this;
  }
  _createClass(ISOWeekYearParser2, [{
    key: "parse",
    value: function parse2(dateString, token) {
      if (token === "R") {
        return parseNDigitsSigned(4, dateString);
      }
      return parseNDigitsSigned(token.length, dateString);
    }
  }, {
    key: "set",
    value: function set(_date, _flags, value) {
      var firstWeekOfYear = /* @__PURE__ */ new Date(0);
      firstWeekOfYear.setUTCFullYear(value, 0, 4);
      firstWeekOfYear.setUTCHours(0, 0, 0, 0);
      return startOfUTCISOWeek(firstWeekOfYear);
    }
  }]);
  return ISOWeekYearParser2;
}(Parser);
var ExtendedYearParser = /* @__PURE__ */ function(_Parser) {
  _inherits(ExtendedYearParser2, _Parser);
  var _super = _createSuper(ExtendedYearParser2);
  function ExtendedYearParser2() {
    var _this;
    _classCallCheck(this, ExtendedYearParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 130);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["G", "y", "Y", "R", "w", "I", "i", "e", "c", "t", "T"]);
    return _this;
  }
  _createClass(ExtendedYearParser2, [{
    key: "parse",
    value: function parse2(dateString, token) {
      if (token === "u") {
        return parseNDigitsSigned(4, dateString);
      }
      return parseNDigitsSigned(token.length, dateString);
    }
  }, {
    key: "set",
    value: function set(date, _flags, value) {
      date.setUTCFullYear(value, 0, 1);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return ExtendedYearParser2;
}(Parser);
var QuarterParser = /* @__PURE__ */ function(_Parser) {
  _inherits(QuarterParser2, _Parser);
  var _super = _createSuper(QuarterParser2);
  function QuarterParser2() {
    var _this;
    _classCallCheck(this, QuarterParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 120);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["Y", "R", "q", "M", "L", "w", "I", "d", "D", "i", "e", "c", "t", "T"]);
    return _this;
  }
  _createClass(QuarterParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "Q":
        case "QQ":
          return parseNDigits(token.length, dateString);
        case "Qo":
          return match2.ordinalNumber(dateString, {
            unit: "quarter"
          });
        case "QQQ":
          return match2.quarter(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.quarter(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "QQQQQ":
          return match2.quarter(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "QQQQ":
        default:
          return match2.quarter(dateString, {
            width: "wide",
            context: "formatting"
          }) || match2.quarter(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.quarter(dateString, {
            width: "narrow",
            context: "formatting"
          });
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 1 && value <= 4;
    }
  }, {
    key: "set",
    value: function set(date, _flags, value) {
      date.setUTCMonth((value - 1) * 3, 1);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return QuarterParser2;
}(Parser);
var StandAloneQuarterParser = /* @__PURE__ */ function(_Parser) {
  _inherits(StandAloneQuarterParser2, _Parser);
  var _super = _createSuper(StandAloneQuarterParser2);
  function StandAloneQuarterParser2() {
    var _this;
    _classCallCheck(this, StandAloneQuarterParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 120);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["Y", "R", "Q", "M", "L", "w", "I", "d", "D", "i", "e", "c", "t", "T"]);
    return _this;
  }
  _createClass(StandAloneQuarterParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "q":
        case "qq":
          return parseNDigits(token.length, dateString);
        case "qo":
          return match2.ordinalNumber(dateString, {
            unit: "quarter"
          });
        case "qqq":
          return match2.quarter(dateString, {
            width: "abbreviated",
            context: "standalone"
          }) || match2.quarter(dateString, {
            width: "narrow",
            context: "standalone"
          });
        case "qqqqq":
          return match2.quarter(dateString, {
            width: "narrow",
            context: "standalone"
          });
        case "qqqq":
        default:
          return match2.quarter(dateString, {
            width: "wide",
            context: "standalone"
          }) || match2.quarter(dateString, {
            width: "abbreviated",
            context: "standalone"
          }) || match2.quarter(dateString, {
            width: "narrow",
            context: "standalone"
          });
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 1 && value <= 4;
    }
  }, {
    key: "set",
    value: function set(date, _flags, value) {
      date.setUTCMonth((value - 1) * 3, 1);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return StandAloneQuarterParser2;
}(Parser);
var MonthParser = /* @__PURE__ */ function(_Parser) {
  _inherits(MonthParser2, _Parser);
  var _super = _createSuper(MonthParser2);
  function MonthParser2() {
    var _this;
    _classCallCheck(this, MonthParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["Y", "R", "q", "Q", "L", "w", "I", "D", "i", "e", "c", "t", "T"]);
    _defineProperty(_assertThisInitialized(_this), "priority", 110);
    return _this;
  }
  _createClass(MonthParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      var valueCallback3 = function valueCallback4(value) {
        return value - 1;
      };
      switch (token) {
        case "M":
          return mapValue(parseNumericPattern(numericPatterns.month, dateString), valueCallback3);
        case "MM":
          return mapValue(parseNDigits(2, dateString), valueCallback3);
        case "Mo":
          return mapValue(match2.ordinalNumber(dateString, {
            unit: "month"
          }), valueCallback3);
        case "MMM":
          return match2.month(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.month(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "MMMMM":
          return match2.month(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "MMMM":
        default:
          return match2.month(dateString, {
            width: "wide",
            context: "formatting"
          }) || match2.month(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.month(dateString, {
            width: "narrow",
            context: "formatting"
          });
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 0 && value <= 11;
    }
  }, {
    key: "set",
    value: function set(date, _flags, value) {
      date.setUTCMonth(value, 1);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return MonthParser2;
}(Parser);
var StandAloneMonthParser = /* @__PURE__ */ function(_Parser) {
  _inherits(StandAloneMonthParser2, _Parser);
  var _super = _createSuper(StandAloneMonthParser2);
  function StandAloneMonthParser2() {
    var _this;
    _classCallCheck(this, StandAloneMonthParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 110);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["Y", "R", "q", "Q", "M", "w", "I", "D", "i", "e", "c", "t", "T"]);
    return _this;
  }
  _createClass(StandAloneMonthParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      var valueCallback3 = function valueCallback4(value) {
        return value - 1;
      };
      switch (token) {
        case "L":
          return mapValue(parseNumericPattern(numericPatterns.month, dateString), valueCallback3);
        case "LL":
          return mapValue(parseNDigits(2, dateString), valueCallback3);
        case "Lo":
          return mapValue(match2.ordinalNumber(dateString, {
            unit: "month"
          }), valueCallback3);
        case "LLL":
          return match2.month(dateString, {
            width: "abbreviated",
            context: "standalone"
          }) || match2.month(dateString, {
            width: "narrow",
            context: "standalone"
          });
        case "LLLLL":
          return match2.month(dateString, {
            width: "narrow",
            context: "standalone"
          });
        case "LLLL":
        default:
          return match2.month(dateString, {
            width: "wide",
            context: "standalone"
          }) || match2.month(dateString, {
            width: "abbreviated",
            context: "standalone"
          }) || match2.month(dateString, {
            width: "narrow",
            context: "standalone"
          });
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 0 && value <= 11;
    }
  }, {
    key: "set",
    value: function set(date, _flags, value) {
      date.setUTCMonth(value, 1);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return StandAloneMonthParser2;
}(Parser);
function setUTCWeek(dirtyDate, dirtyWeek, options) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var week = toInteger(dirtyWeek);
  var diff = getUTCWeek(date, options) - week;
  date.setUTCDate(date.getUTCDate() - diff * 7);
  return date;
}
var LocalWeekParser = /* @__PURE__ */ function(_Parser) {
  _inherits(LocalWeekParser2, _Parser);
  var _super = _createSuper(LocalWeekParser2);
  function LocalWeekParser2() {
    var _this;
    _classCallCheck(this, LocalWeekParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 100);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["y", "R", "u", "q", "Q", "M", "L", "I", "d", "D", "i", "t", "T"]);
    return _this;
  }
  _createClass(LocalWeekParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "w":
          return parseNumericPattern(numericPatterns.week, dateString);
        case "wo":
          return match2.ordinalNumber(dateString, {
            unit: "week"
          });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 1 && value <= 53;
    }
  }, {
    key: "set",
    value: function set(date, _flags, value, options) {
      return startOfUTCWeek(setUTCWeek(date, value, options), options);
    }
  }]);
  return LocalWeekParser2;
}(Parser);
function setUTCISOWeek(dirtyDate, dirtyISOWeek) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var isoWeek = toInteger(dirtyISOWeek);
  var diff = getUTCISOWeek(date) - isoWeek;
  date.setUTCDate(date.getUTCDate() - diff * 7);
  return date;
}
var ISOWeekParser = /* @__PURE__ */ function(_Parser) {
  _inherits(ISOWeekParser2, _Parser);
  var _super = _createSuper(ISOWeekParser2);
  function ISOWeekParser2() {
    var _this;
    _classCallCheck(this, ISOWeekParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 100);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["y", "Y", "u", "q", "Q", "M", "L", "w", "d", "D", "e", "c", "t", "T"]);
    return _this;
  }
  _createClass(ISOWeekParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "I":
          return parseNumericPattern(numericPatterns.week, dateString);
        case "Io":
          return match2.ordinalNumber(dateString, {
            unit: "week"
          });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 1 && value <= 53;
    }
  }, {
    key: "set",
    value: function set(date, _flags, value) {
      return startOfUTCISOWeek(setUTCISOWeek(date, value));
    }
  }]);
  return ISOWeekParser2;
}(Parser);
var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var DAYS_IN_MONTH_LEAP_YEAR = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var DateParser = /* @__PURE__ */ function(_Parser) {
  _inherits(DateParser2, _Parser);
  var _super = _createSuper(DateParser2);
  function DateParser2() {
    var _this;
    _classCallCheck(this, DateParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 90);
    _defineProperty(_assertThisInitialized(_this), "subPriority", 1);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["Y", "R", "q", "Q", "w", "I", "D", "i", "e", "c", "t", "T"]);
    return _this;
  }
  _createClass(DateParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "d":
          return parseNumericPattern(numericPatterns.date, dateString);
        case "do":
          return match2.ordinalNumber(dateString, {
            unit: "date"
          });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
  }, {
    key: "validate",
    value: function validate(date, value) {
      var year = date.getUTCFullYear();
      var isLeapYear = isLeapYearIndex$1(year);
      var month = date.getUTCMonth();
      if (isLeapYear) {
        return value >= 1 && value <= DAYS_IN_MONTH_LEAP_YEAR[month];
      } else {
        return value >= 1 && value <= DAYS_IN_MONTH[month];
      }
    }
  }, {
    key: "set",
    value: function set(date, _flags, value) {
      date.setUTCDate(value);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return DateParser2;
}(Parser);
var DayOfYearParser = /* @__PURE__ */ function(_Parser) {
  _inherits(DayOfYearParser2, _Parser);
  var _super = _createSuper(DayOfYearParser2);
  function DayOfYearParser2() {
    var _this;
    _classCallCheck(this, DayOfYearParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 90);
    _defineProperty(_assertThisInitialized(_this), "subpriority", 1);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["Y", "R", "q", "Q", "M", "L", "w", "I", "d", "E", "i", "e", "c", "t", "T"]);
    return _this;
  }
  _createClass(DayOfYearParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "D":
        case "DD":
          return parseNumericPattern(numericPatterns.dayOfYear, dateString);
        case "Do":
          return match2.ordinalNumber(dateString, {
            unit: "date"
          });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
  }, {
    key: "validate",
    value: function validate(date, value) {
      var year = date.getUTCFullYear();
      var isLeapYear = isLeapYearIndex$1(year);
      if (isLeapYear) {
        return value >= 1 && value <= 366;
      } else {
        return value >= 1 && value <= 365;
      }
    }
  }, {
    key: "set",
    value: function set(date, _flags, value) {
      date.setUTCMonth(0, value);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return DayOfYearParser2;
}(Parser);
function setUTCDay(dirtyDate, dirtyDay, options) {
  var _ref, _ref2, _ref3, _options$weekStartsOn, _options$locale, _options$locale$optio, _defaultOptions$local, _defaultOptions$local2;
  requiredArgs(2, arguments);
  var defaultOptions2 = getDefaultOptions();
  var weekStartsOn = toInteger((_ref = (_ref2 = (_ref3 = (_options$weekStartsOn = options === null || options === void 0 ? void 0 : options.weekStartsOn) !== null && _options$weekStartsOn !== void 0 ? _options$weekStartsOn : options === null || options === void 0 ? void 0 : (_options$locale = options.locale) === null || _options$locale === void 0 ? void 0 : (_options$locale$optio = _options$locale.options) === null || _options$locale$optio === void 0 ? void 0 : _options$locale$optio.weekStartsOn) !== null && _ref3 !== void 0 ? _ref3 : defaultOptions2.weekStartsOn) !== null && _ref2 !== void 0 ? _ref2 : (_defaultOptions$local = defaultOptions2.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.weekStartsOn) !== null && _ref !== void 0 ? _ref : 0);
  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  }
  var date = toDate(dirtyDate);
  var day = toInteger(dirtyDay);
  var currentDay = date.getUTCDay();
  var remainder = day % 7;
  var dayIndex = (remainder + 7) % 7;
  var diff = (dayIndex < weekStartsOn ? 7 : 0) + day - currentDay;
  date.setUTCDate(date.getUTCDate() + diff);
  return date;
}
var DayParser = /* @__PURE__ */ function(_Parser) {
  _inherits(DayParser2, _Parser);
  var _super = _createSuper(DayParser2);
  function DayParser2() {
    var _this;
    _classCallCheck(this, DayParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 90);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["D", "i", "e", "c", "t", "T"]);
    return _this;
  }
  _createClass(DayParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "E":
        case "EE":
        case "EEE":
          return match2.day(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "short",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "EEEEE":
          return match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "EEEEEE":
          return match2.day(dateString, {
            width: "short",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "EEEE":
        default:
          return match2.day(dateString, {
            width: "wide",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "short",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          });
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 0 && value <= 6;
    }
  }, {
    key: "set",
    value: function set(date, _flags, value, options) {
      date = setUTCDay(date, value, options);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return DayParser2;
}(Parser);
var LocalDayParser = /* @__PURE__ */ function(_Parser) {
  _inherits(LocalDayParser2, _Parser);
  var _super = _createSuper(LocalDayParser2);
  function LocalDayParser2() {
    var _this;
    _classCallCheck(this, LocalDayParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 90);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["y", "R", "u", "q", "Q", "M", "L", "I", "d", "D", "E", "i", "c", "t", "T"]);
    return _this;
  }
  _createClass(LocalDayParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2, options) {
      var valueCallback3 = function valueCallback4(value) {
        var wholeWeekDays = Math.floor((value - 1) / 7) * 7;
        return (value + options.weekStartsOn + 6) % 7 + wholeWeekDays;
      };
      switch (token) {
        case "e":
        case "ee":
          return mapValue(parseNDigits(token.length, dateString), valueCallback3);
        case "eo":
          return mapValue(match2.ordinalNumber(dateString, {
            unit: "day"
          }), valueCallback3);
        case "eee":
          return match2.day(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "short",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "eeeee":
          return match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "eeeeee":
          return match2.day(dateString, {
            width: "short",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "eeee":
        default:
          return match2.day(dateString, {
            width: "wide",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "short",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          });
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 0 && value <= 6;
    }
  }, {
    key: "set",
    value: function set(date, _flags, value, options) {
      date = setUTCDay(date, value, options);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return LocalDayParser2;
}(Parser);
var StandAloneLocalDayParser = /* @__PURE__ */ function(_Parser) {
  _inherits(StandAloneLocalDayParser2, _Parser);
  var _super = _createSuper(StandAloneLocalDayParser2);
  function StandAloneLocalDayParser2() {
    var _this;
    _classCallCheck(this, StandAloneLocalDayParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 90);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["y", "R", "u", "q", "Q", "M", "L", "I", "d", "D", "E", "i", "e", "t", "T"]);
    return _this;
  }
  _createClass(StandAloneLocalDayParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2, options) {
      var valueCallback3 = function valueCallback4(value) {
        var wholeWeekDays = Math.floor((value - 1) / 7) * 7;
        return (value + options.weekStartsOn + 6) % 7 + wholeWeekDays;
      };
      switch (token) {
        case "c":
        case "cc":
          return mapValue(parseNDigits(token.length, dateString), valueCallback3);
        case "co":
          return mapValue(match2.ordinalNumber(dateString, {
            unit: "day"
          }), valueCallback3);
        case "ccc":
          return match2.day(dateString, {
            width: "abbreviated",
            context: "standalone"
          }) || match2.day(dateString, {
            width: "short",
            context: "standalone"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "standalone"
          });
        case "ccccc":
          return match2.day(dateString, {
            width: "narrow",
            context: "standalone"
          });
        case "cccccc":
          return match2.day(dateString, {
            width: "short",
            context: "standalone"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "standalone"
          });
        case "cccc":
        default:
          return match2.day(dateString, {
            width: "wide",
            context: "standalone"
          }) || match2.day(dateString, {
            width: "abbreviated",
            context: "standalone"
          }) || match2.day(dateString, {
            width: "short",
            context: "standalone"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "standalone"
          });
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 0 && value <= 6;
    }
  }, {
    key: "set",
    value: function set(date, _flags, value, options) {
      date = setUTCDay(date, value, options);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return StandAloneLocalDayParser2;
}(Parser);
function setUTCISODay(dirtyDate, dirtyDay) {
  requiredArgs(2, arguments);
  var day = toInteger(dirtyDay);
  if (day % 7 === 0) {
    day = day - 7;
  }
  var weekStartsOn = 1;
  var date = toDate(dirtyDate);
  var currentDay = date.getUTCDay();
  var remainder = day % 7;
  var dayIndex = (remainder + 7) % 7;
  var diff = (dayIndex < weekStartsOn ? 7 : 0) + day - currentDay;
  date.setUTCDate(date.getUTCDate() + diff);
  return date;
}
var ISODayParser = /* @__PURE__ */ function(_Parser) {
  _inherits(ISODayParser2, _Parser);
  var _super = _createSuper(ISODayParser2);
  function ISODayParser2() {
    var _this;
    _classCallCheck(this, ISODayParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 90);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["y", "Y", "u", "q", "Q", "M", "L", "w", "d", "D", "E", "e", "c", "t", "T"]);
    return _this;
  }
  _createClass(ISODayParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      var valueCallback3 = function valueCallback4(value) {
        if (value === 0) {
          return 7;
        }
        return value;
      };
      switch (token) {
        case "i":
        case "ii":
          return parseNDigits(token.length, dateString);
        case "io":
          return match2.ordinalNumber(dateString, {
            unit: "day"
          });
        case "iii":
          return mapValue(match2.day(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "short",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          }), valueCallback3);
        case "iiiii":
          return mapValue(match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          }), valueCallback3);
        case "iiiiii":
          return mapValue(match2.day(dateString, {
            width: "short",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          }), valueCallback3);
        case "iiii":
        default:
          return mapValue(match2.day(dateString, {
            width: "wide",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "short",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          }), valueCallback3);
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 1 && value <= 7;
    }
  }, {
    key: "set",
    value: function set(date, _flags, value) {
      date = setUTCISODay(date, value);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return ISODayParser2;
}(Parser);
var AMPMParser = /* @__PURE__ */ function(_Parser) {
  _inherits(AMPMParser2, _Parser);
  var _super = _createSuper(AMPMParser2);
  function AMPMParser2() {
    var _this;
    _classCallCheck(this, AMPMParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 80);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["b", "B", "H", "k", "t", "T"]);
    return _this;
  }
  _createClass(AMPMParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "a":
        case "aa":
        case "aaa":
          return match2.dayPeriod(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "aaaaa":
          return match2.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "aaaa":
        default:
          return match2.dayPeriod(dateString, {
            width: "wide",
            context: "formatting"
          }) || match2.dayPeriod(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting"
          });
      }
    }
  }, {
    key: "set",
    value: function set(date, _flags, value) {
      date.setUTCHours(dayPeriodEnumToHours(value), 0, 0, 0);
      return date;
    }
  }]);
  return AMPMParser2;
}(Parser);
var AMPMMidnightParser = /* @__PURE__ */ function(_Parser) {
  _inherits(AMPMMidnightParser2, _Parser);
  var _super = _createSuper(AMPMMidnightParser2);
  function AMPMMidnightParser2() {
    var _this;
    _classCallCheck(this, AMPMMidnightParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 80);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["a", "B", "H", "k", "t", "T"]);
    return _this;
  }
  _createClass(AMPMMidnightParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "b":
        case "bb":
        case "bbb":
          return match2.dayPeriod(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "bbbbb":
          return match2.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "bbbb":
        default:
          return match2.dayPeriod(dateString, {
            width: "wide",
            context: "formatting"
          }) || match2.dayPeriod(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting"
          });
      }
    }
  }, {
    key: "set",
    value: function set(date, _flags, value) {
      date.setUTCHours(dayPeriodEnumToHours(value), 0, 0, 0);
      return date;
    }
  }]);
  return AMPMMidnightParser2;
}(Parser);
var DayPeriodParser = /* @__PURE__ */ function(_Parser) {
  _inherits(DayPeriodParser2, _Parser);
  var _super = _createSuper(DayPeriodParser2);
  function DayPeriodParser2() {
    var _this;
    _classCallCheck(this, DayPeriodParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 80);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["a", "b", "t", "T"]);
    return _this;
  }
  _createClass(DayPeriodParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "B":
        case "BB":
        case "BBB":
          return match2.dayPeriod(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "BBBBB":
          return match2.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "BBBB":
        default:
          return match2.dayPeriod(dateString, {
            width: "wide",
            context: "formatting"
          }) || match2.dayPeriod(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting"
          });
      }
    }
  }, {
    key: "set",
    value: function set(date, _flags, value) {
      date.setUTCHours(dayPeriodEnumToHours(value), 0, 0, 0);
      return date;
    }
  }]);
  return DayPeriodParser2;
}(Parser);
var Hour1to12Parser = /* @__PURE__ */ function(_Parser) {
  _inherits(Hour1to12Parser2, _Parser);
  var _super = _createSuper(Hour1to12Parser2);
  function Hour1to12Parser2() {
    var _this;
    _classCallCheck(this, Hour1to12Parser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 70);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["H", "K", "k", "t", "T"]);
    return _this;
  }
  _createClass(Hour1to12Parser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "h":
          return parseNumericPattern(numericPatterns.hour12h, dateString);
        case "ho":
          return match2.ordinalNumber(dateString, {
            unit: "hour"
          });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 1 && value <= 12;
    }
  }, {
    key: "set",
    value: function set(date, _flags, value) {
      var isPM = date.getUTCHours() >= 12;
      if (isPM && value < 12) {
        date.setUTCHours(value + 12, 0, 0, 0);
      } else if (!isPM && value === 12) {
        date.setUTCHours(0, 0, 0, 0);
      } else {
        date.setUTCHours(value, 0, 0, 0);
      }
      return date;
    }
  }]);
  return Hour1to12Parser2;
}(Parser);
var Hour0to23Parser = /* @__PURE__ */ function(_Parser) {
  _inherits(Hour0to23Parser2, _Parser);
  var _super = _createSuper(Hour0to23Parser2);
  function Hour0to23Parser2() {
    var _this;
    _classCallCheck(this, Hour0to23Parser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 70);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["a", "b", "h", "K", "k", "t", "T"]);
    return _this;
  }
  _createClass(Hour0to23Parser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "H":
          return parseNumericPattern(numericPatterns.hour23h, dateString);
        case "Ho":
          return match2.ordinalNumber(dateString, {
            unit: "hour"
          });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 0 && value <= 23;
    }
  }, {
    key: "set",
    value: function set(date, _flags, value) {
      date.setUTCHours(value, 0, 0, 0);
      return date;
    }
  }]);
  return Hour0to23Parser2;
}(Parser);
var Hour0To11Parser = /* @__PURE__ */ function(_Parser) {
  _inherits(Hour0To11Parser2, _Parser);
  var _super = _createSuper(Hour0To11Parser2);
  function Hour0To11Parser2() {
    var _this;
    _classCallCheck(this, Hour0To11Parser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 70);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["h", "H", "k", "t", "T"]);
    return _this;
  }
  _createClass(Hour0To11Parser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "K":
          return parseNumericPattern(numericPatterns.hour11h, dateString);
        case "Ko":
          return match2.ordinalNumber(dateString, {
            unit: "hour"
          });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 0 && value <= 11;
    }
  }, {
    key: "set",
    value: function set(date, _flags, value) {
      var isPM = date.getUTCHours() >= 12;
      if (isPM && value < 12) {
        date.setUTCHours(value + 12, 0, 0, 0);
      } else {
        date.setUTCHours(value, 0, 0, 0);
      }
      return date;
    }
  }]);
  return Hour0To11Parser2;
}(Parser);
var Hour1To24Parser = /* @__PURE__ */ function(_Parser) {
  _inherits(Hour1To24Parser2, _Parser);
  var _super = _createSuper(Hour1To24Parser2);
  function Hour1To24Parser2() {
    var _this;
    _classCallCheck(this, Hour1To24Parser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 70);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["a", "b", "h", "H", "K", "t", "T"]);
    return _this;
  }
  _createClass(Hour1To24Parser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "k":
          return parseNumericPattern(numericPatterns.hour24h, dateString);
        case "ko":
          return match2.ordinalNumber(dateString, {
            unit: "hour"
          });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 1 && value <= 24;
    }
  }, {
    key: "set",
    value: function set(date, _flags, value) {
      var hours = value <= 24 ? value % 24 : value;
      date.setUTCHours(hours, 0, 0, 0);
      return date;
    }
  }]);
  return Hour1To24Parser2;
}(Parser);
var MinuteParser = /* @__PURE__ */ function(_Parser) {
  _inherits(MinuteParser2, _Parser);
  var _super = _createSuper(MinuteParser2);
  function MinuteParser2() {
    var _this;
    _classCallCheck(this, MinuteParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 60);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["t", "T"]);
    return _this;
  }
  _createClass(MinuteParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "m":
          return parseNumericPattern(numericPatterns.minute, dateString);
        case "mo":
          return match2.ordinalNumber(dateString, {
            unit: "minute"
          });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 0 && value <= 59;
    }
  }, {
    key: "set",
    value: function set(date, _flags, value) {
      date.setUTCMinutes(value, 0, 0);
      return date;
    }
  }]);
  return MinuteParser2;
}(Parser);
var SecondParser = /* @__PURE__ */ function(_Parser) {
  _inherits(SecondParser2, _Parser);
  var _super = _createSuper(SecondParser2);
  function SecondParser2() {
    var _this;
    _classCallCheck(this, SecondParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 50);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["t", "T"]);
    return _this;
  }
  _createClass(SecondParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "s":
          return parseNumericPattern(numericPatterns.second, dateString);
        case "so":
          return match2.ordinalNumber(dateString, {
            unit: "second"
          });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 0 && value <= 59;
    }
  }, {
    key: "set",
    value: function set(date, _flags, value) {
      date.setUTCSeconds(value, 0);
      return date;
    }
  }]);
  return SecondParser2;
}(Parser);
var FractionOfSecondParser = /* @__PURE__ */ function(_Parser) {
  _inherits(FractionOfSecondParser2, _Parser);
  var _super = _createSuper(FractionOfSecondParser2);
  function FractionOfSecondParser2() {
    var _this;
    _classCallCheck(this, FractionOfSecondParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 30);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["t", "T"]);
    return _this;
  }
  _createClass(FractionOfSecondParser2, [{
    key: "parse",
    value: function parse2(dateString, token) {
      var valueCallback3 = function valueCallback4(value) {
        return Math.floor(value * Math.pow(10, -token.length + 3));
      };
      return mapValue(parseNDigits(token.length, dateString), valueCallback3);
    }
  }, {
    key: "set",
    value: function set(date, _flags, value) {
      date.setUTCMilliseconds(value);
      return date;
    }
  }]);
  return FractionOfSecondParser2;
}(Parser);
var ISOTimezoneWithZParser = /* @__PURE__ */ function(_Parser) {
  _inherits(ISOTimezoneWithZParser2, _Parser);
  var _super = _createSuper(ISOTimezoneWithZParser2);
  function ISOTimezoneWithZParser2() {
    var _this;
    _classCallCheck(this, ISOTimezoneWithZParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 10);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["t", "T", "x"]);
    return _this;
  }
  _createClass(ISOTimezoneWithZParser2, [{
    key: "parse",
    value: function parse2(dateString, token) {
      switch (token) {
        case "X":
          return parseTimezonePattern(timezonePatterns.basicOptionalMinutes, dateString);
        case "XX":
          return parseTimezonePattern(timezonePatterns.basic, dateString);
        case "XXXX":
          return parseTimezonePattern(timezonePatterns.basicOptionalSeconds, dateString);
        case "XXXXX":
          return parseTimezonePattern(timezonePatterns.extendedOptionalSeconds, dateString);
        case "XXX":
        default:
          return parseTimezonePattern(timezonePatterns.extended, dateString);
      }
    }
  }, {
    key: "set",
    value: function set(date, flags, value) {
      if (flags.timestampIsSet) {
        return date;
      }
      return new Date(date.getTime() - value);
    }
  }]);
  return ISOTimezoneWithZParser2;
}(Parser);
var ISOTimezoneParser = /* @__PURE__ */ function(_Parser) {
  _inherits(ISOTimezoneParser2, _Parser);
  var _super = _createSuper(ISOTimezoneParser2);
  function ISOTimezoneParser2() {
    var _this;
    _classCallCheck(this, ISOTimezoneParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 10);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["t", "T", "X"]);
    return _this;
  }
  _createClass(ISOTimezoneParser2, [{
    key: "parse",
    value: function parse2(dateString, token) {
      switch (token) {
        case "x":
          return parseTimezonePattern(timezonePatterns.basicOptionalMinutes, dateString);
        case "xx":
          return parseTimezonePattern(timezonePatterns.basic, dateString);
        case "xxxx":
          return parseTimezonePattern(timezonePatterns.basicOptionalSeconds, dateString);
        case "xxxxx":
          return parseTimezonePattern(timezonePatterns.extendedOptionalSeconds, dateString);
        case "xxx":
        default:
          return parseTimezonePattern(timezonePatterns.extended, dateString);
      }
    }
  }, {
    key: "set",
    value: function set(date, flags, value) {
      if (flags.timestampIsSet) {
        return date;
      }
      return new Date(date.getTime() - value);
    }
  }]);
  return ISOTimezoneParser2;
}(Parser);
var TimestampSecondsParser = /* @__PURE__ */ function(_Parser) {
  _inherits(TimestampSecondsParser2, _Parser);
  var _super = _createSuper(TimestampSecondsParser2);
  function TimestampSecondsParser2() {
    var _this;
    _classCallCheck(this, TimestampSecondsParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 40);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", "*");
    return _this;
  }
  _createClass(TimestampSecondsParser2, [{
    key: "parse",
    value: function parse2(dateString) {
      return parseAnyDigitsSigned(dateString);
    }
  }, {
    key: "set",
    value: function set(_date, _flags, value) {
      return [new Date(value * 1e3), {
        timestampIsSet: true
      }];
    }
  }]);
  return TimestampSecondsParser2;
}(Parser);
var TimestampMillisecondsParser = /* @__PURE__ */ function(_Parser) {
  _inherits(TimestampMillisecondsParser2, _Parser);
  var _super = _createSuper(TimestampMillisecondsParser2);
  function TimestampMillisecondsParser2() {
    var _this;
    _classCallCheck(this, TimestampMillisecondsParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 20);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", "*");
    return _this;
  }
  _createClass(TimestampMillisecondsParser2, [{
    key: "parse",
    value: function parse2(dateString) {
      return parseAnyDigitsSigned(dateString);
    }
  }, {
    key: "set",
    value: function set(_date, _flags, value) {
      return [new Date(value), {
        timestampIsSet: true
      }];
    }
  }]);
  return TimestampMillisecondsParser2;
}(Parser);
var parsers = {
  G: new EraParser(),
  y: new YearParser(),
  Y: new LocalWeekYearParser(),
  R: new ISOWeekYearParser(),
  u: new ExtendedYearParser(),
  Q: new QuarterParser(),
  q: new StandAloneQuarterParser(),
  M: new MonthParser(),
  L: new StandAloneMonthParser(),
  w: new LocalWeekParser(),
  I: new ISOWeekParser(),
  d: new DateParser(),
  D: new DayOfYearParser(),
  E: new DayParser(),
  e: new LocalDayParser(),
  c: new StandAloneLocalDayParser(),
  i: new ISODayParser(),
  a: new AMPMParser(),
  b: new AMPMMidnightParser(),
  B: new DayPeriodParser(),
  h: new Hour1to12Parser(),
  H: new Hour0to23Parser(),
  K: new Hour0To11Parser(),
  k: new Hour1To24Parser(),
  m: new MinuteParser(),
  s: new SecondParser(),
  S: new FractionOfSecondParser(),
  X: new ISOTimezoneWithZParser(),
  x: new ISOTimezoneParser(),
  t: new TimestampSecondsParser(),
  T: new TimestampMillisecondsParser()
};
var formattingTokensRegExp = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;
var longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
var escapedStringRegExp = /^'([^]*?)'?$/;
var doubleQuoteRegExp = /''/g;
var notWhitespaceRegExp = /\S/;
var unescapedLatinCharacterRegExp = /[a-zA-Z]/;
function parse(dirtyDateString, dirtyFormatString, dirtyReferenceDate, options) {
  var _ref, _options$locale, _ref2, _ref3, _ref4, _options$firstWeekCon, _options$locale2, _options$locale2$opti, _defaultOptions$local, _defaultOptions$local2, _ref5, _ref6, _ref7, _options$weekStartsOn, _options$locale3, _options$locale3$opti, _defaultOptions$local3, _defaultOptions$local4;
  requiredArgs(3, arguments);
  var dateString = String(dirtyDateString);
  var formatString = String(dirtyFormatString);
  var defaultOptions2 = getDefaultOptions();
  var locale2 = (_ref = (_options$locale = options === null || options === void 0 ? void 0 : options.locale) !== null && _options$locale !== void 0 ? _options$locale : defaultOptions2.locale) !== null && _ref !== void 0 ? _ref : defaultLocale;
  if (!locale2.match) {
    throw new RangeError("locale must contain match property");
  }
  var firstWeekContainsDate = toInteger((_ref2 = (_ref3 = (_ref4 = (_options$firstWeekCon = options === null || options === void 0 ? void 0 : options.firstWeekContainsDate) !== null && _options$firstWeekCon !== void 0 ? _options$firstWeekCon : options === null || options === void 0 ? void 0 : (_options$locale2 = options.locale) === null || _options$locale2 === void 0 ? void 0 : (_options$locale2$opti = _options$locale2.options) === null || _options$locale2$opti === void 0 ? void 0 : _options$locale2$opti.firstWeekContainsDate) !== null && _ref4 !== void 0 ? _ref4 : defaultOptions2.firstWeekContainsDate) !== null && _ref3 !== void 0 ? _ref3 : (_defaultOptions$local = defaultOptions2.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.firstWeekContainsDate) !== null && _ref2 !== void 0 ? _ref2 : 1);
  if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
    throw new RangeError("firstWeekContainsDate must be between 1 and 7 inclusively");
  }
  var weekStartsOn = toInteger((_ref5 = (_ref6 = (_ref7 = (_options$weekStartsOn = options === null || options === void 0 ? void 0 : options.weekStartsOn) !== null && _options$weekStartsOn !== void 0 ? _options$weekStartsOn : options === null || options === void 0 ? void 0 : (_options$locale3 = options.locale) === null || _options$locale3 === void 0 ? void 0 : (_options$locale3$opti = _options$locale3.options) === null || _options$locale3$opti === void 0 ? void 0 : _options$locale3$opti.weekStartsOn) !== null && _ref7 !== void 0 ? _ref7 : defaultOptions2.weekStartsOn) !== null && _ref6 !== void 0 ? _ref6 : (_defaultOptions$local3 = defaultOptions2.locale) === null || _defaultOptions$local3 === void 0 ? void 0 : (_defaultOptions$local4 = _defaultOptions$local3.options) === null || _defaultOptions$local4 === void 0 ? void 0 : _defaultOptions$local4.weekStartsOn) !== null && _ref5 !== void 0 ? _ref5 : 0);
  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  }
  if (formatString === "") {
    if (dateString === "") {
      return toDate(dirtyReferenceDate);
    } else {
      return /* @__PURE__ */ new Date(NaN);
    }
  }
  var subFnOptions = {
    firstWeekContainsDate,
    weekStartsOn,
    locale: locale2
  };
  var setters = [new DateToSystemTimezoneSetter()];
  var tokens = formatString.match(longFormattingTokensRegExp).map(function(substring) {
    var firstCharacter = substring[0];
    if (firstCharacter in longFormatters$1) {
      var longFormatter = longFormatters$1[firstCharacter];
      return longFormatter(substring, locale2.formatLong);
    }
    return substring;
  }).join("").match(formattingTokensRegExp);
  var usedTokens = [];
  var _iterator = _createForOfIteratorHelper(tokens), _step;
  try {
    var _loop = function _loop2() {
      var token = _step.value;
      if (!(options !== null && options !== void 0 && options.useAdditionalWeekYearTokens) && isProtectedWeekYearToken(token)) {
        throwProtectedError(token, formatString, dirtyDateString);
      }
      if (!(options !== null && options !== void 0 && options.useAdditionalDayOfYearTokens) && isProtectedDayOfYearToken(token)) {
        throwProtectedError(token, formatString, dirtyDateString);
      }
      var firstCharacter = token[0];
      var parser = parsers[firstCharacter];
      if (parser) {
        var incompatibleTokens = parser.incompatibleTokens;
        if (Array.isArray(incompatibleTokens)) {
          var incompatibleToken = usedTokens.find(function(usedToken) {
            return incompatibleTokens.includes(usedToken.token) || usedToken.token === firstCharacter;
          });
          if (incompatibleToken) {
            throw new RangeError("The format string mustn't contain `".concat(incompatibleToken.fullToken, "` and `").concat(token, "` at the same time"));
          }
        } else if (parser.incompatibleTokens === "*" && usedTokens.length > 0) {
          throw new RangeError("The format string mustn't contain `".concat(token, "` and any other token at the same time"));
        }
        usedTokens.push({
          token: firstCharacter,
          fullToken: token
        });
        var parseResult = parser.run(dateString, token, locale2.match, subFnOptions);
        if (!parseResult) {
          return {
            v: /* @__PURE__ */ new Date(NaN)
          };
        }
        setters.push(parseResult.setter);
        dateString = parseResult.rest;
      } else {
        if (firstCharacter.match(unescapedLatinCharacterRegExp)) {
          throw new RangeError("Format string contains an unescaped latin alphabet character `" + firstCharacter + "`");
        }
        if (token === "''") {
          token = "'";
        } else if (firstCharacter === "'") {
          token = cleanEscapedString(token);
        }
        if (dateString.indexOf(token) === 0) {
          dateString = dateString.slice(token.length);
        } else {
          return {
            v: /* @__PURE__ */ new Date(NaN)
          };
        }
      }
    };
    for (_iterator.s(); !(_step = _iterator.n()).done; ) {
      var _ret = _loop();
      if (_typeof(_ret) === "object")
        return _ret.v;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  if (dateString.length > 0 && notWhitespaceRegExp.test(dateString)) {
    return /* @__PURE__ */ new Date(NaN);
  }
  var uniquePrioritySetters = setters.map(function(setter2) {
    return setter2.priority;
  }).sort(function(a4, b3) {
    return b3 - a4;
  }).filter(function(priority, index, array) {
    return array.indexOf(priority) === index;
  }).map(function(priority) {
    return setters.filter(function(setter2) {
      return setter2.priority === priority;
    }).sort(function(a4, b3) {
      return b3.subPriority - a4.subPriority;
    });
  }).map(function(setterArray) {
    return setterArray[0];
  });
  var date = toDate(dirtyReferenceDate);
  if (isNaN(date.getTime())) {
    return /* @__PURE__ */ new Date(NaN);
  }
  var utcDate = subMilliseconds(date, getTimezoneOffsetInMilliseconds(date));
  var flags = {};
  var _iterator2 = _createForOfIteratorHelper(uniquePrioritySetters), _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
      var setter = _step2.value;
      if (!setter.validate(utcDate, subFnOptions)) {
        return /* @__PURE__ */ new Date(NaN);
      }
      var result = setter.set(utcDate, flags, subFnOptions);
      if (Array.isArray(result)) {
        utcDate = result[0];
        assign(flags, result[1]);
      } else {
        utcDate = result;
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return utcDate;
}
function cleanEscapedString(input) {
  return input.match(escapedStringRegExp)[1].replace(doubleQuoteRegExp, "'");
}
function isSameMonth(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var dateLeft = toDate(dirtyDateLeft);
  var dateRight = toDate(dirtyDateRight);
  return dateLeft.getFullYear() === dateRight.getFullYear() && dateLeft.getMonth() === dateRight.getMonth();
}
function parseISO(argument, options) {
  var _options$additionalDi;
  requiredArgs(1, arguments);
  var additionalDigits = toInteger((_options$additionalDi = options === null || options === void 0 ? void 0 : options.additionalDigits) !== null && _options$additionalDi !== void 0 ? _options$additionalDi : 2);
  if (additionalDigits !== 2 && additionalDigits !== 1 && additionalDigits !== 0) {
    throw new RangeError("additionalDigits must be 0, 1 or 2");
  }
  if (!(typeof argument === "string" || Object.prototype.toString.call(argument) === "[object String]")) {
    return /* @__PURE__ */ new Date(NaN);
  }
  var dateStrings = splitDateString(argument);
  var date;
  if (dateStrings.date) {
    var parseYearResult = parseYear(dateStrings.date, additionalDigits);
    date = parseDate(parseYearResult.restDateString, parseYearResult.year);
  }
  if (!date || isNaN(date.getTime())) {
    return /* @__PURE__ */ new Date(NaN);
  }
  var timestamp = date.getTime();
  var time = 0;
  var offset2;
  if (dateStrings.time) {
    time = parseTime(dateStrings.time);
    if (isNaN(time)) {
      return /* @__PURE__ */ new Date(NaN);
    }
  }
  if (dateStrings.timezone) {
    offset2 = parseTimezone(dateStrings.timezone);
    if (isNaN(offset2)) {
      return /* @__PURE__ */ new Date(NaN);
    }
  } else {
    var dirtyDate = new Date(timestamp + time);
    var result = /* @__PURE__ */ new Date(0);
    result.setFullYear(dirtyDate.getUTCFullYear(), dirtyDate.getUTCMonth(), dirtyDate.getUTCDate());
    result.setHours(dirtyDate.getUTCHours(), dirtyDate.getUTCMinutes(), dirtyDate.getUTCSeconds(), dirtyDate.getUTCMilliseconds());
    return result;
  }
  return new Date(timestamp + time + offset2);
}
var patterns = {
  dateTimeDelimiter: /[T ]/,
  timeZoneDelimiter: /[Z ]/i,
  timezone: /([Z+-].*)$/
};
var dateRegex = /^-?(?:(\d{3})|(\d{2})(?:-?(\d{2}))?|W(\d{2})(?:-?(\d{1}))?|)$/;
var timeRegex = /^(\d{2}(?:[.,]\d*)?)(?::?(\d{2}(?:[.,]\d*)?))?(?::?(\d{2}(?:[.,]\d*)?))?$/;
var timezoneRegex = /^([+-])(\d{2})(?::?(\d{2}))?$/;
function splitDateString(dateString) {
  var dateStrings = {};
  var array = dateString.split(patterns.dateTimeDelimiter);
  var timeString;
  if (array.length > 2) {
    return dateStrings;
  }
  if (/:/.test(array[0])) {
    timeString = array[0];
  } else {
    dateStrings.date = array[0];
    timeString = array[1];
    if (patterns.timeZoneDelimiter.test(dateStrings.date)) {
      dateStrings.date = dateString.split(patterns.timeZoneDelimiter)[0];
      timeString = dateString.substr(dateStrings.date.length, dateString.length);
    }
  }
  if (timeString) {
    var token = patterns.timezone.exec(timeString);
    if (token) {
      dateStrings.time = timeString.replace(token[1], "");
      dateStrings.timezone = token[1];
    } else {
      dateStrings.time = timeString;
    }
  }
  return dateStrings;
}
function parseYear(dateString, additionalDigits) {
  var regex2 = new RegExp("^(?:(\\d{4}|[+-]\\d{" + (4 + additionalDigits) + "})|(\\d{2}|[+-]\\d{" + (2 + additionalDigits) + "})$)");
  var captures = dateString.match(regex2);
  if (!captures)
    return {
      year: NaN,
      restDateString: ""
    };
  var year = captures[1] ? parseInt(captures[1]) : null;
  var century = captures[2] ? parseInt(captures[2]) : null;
  return {
    year: century === null ? year : century * 100,
    restDateString: dateString.slice((captures[1] || captures[2]).length)
  };
}
function parseDate(dateString, year) {
  if (year === null)
    return /* @__PURE__ */ new Date(NaN);
  var captures = dateString.match(dateRegex);
  if (!captures)
    return /* @__PURE__ */ new Date(NaN);
  var isWeekDate = !!captures[4];
  var dayOfYear = parseDateUnit(captures[1]);
  var month = parseDateUnit(captures[2]) - 1;
  var day = parseDateUnit(captures[3]);
  var week = parseDateUnit(captures[4]);
  var dayOfWeek = parseDateUnit(captures[5]) - 1;
  if (isWeekDate) {
    if (!validateWeekDate(year, week, dayOfWeek)) {
      return /* @__PURE__ */ new Date(NaN);
    }
    return dayOfISOWeekYear(year, week, dayOfWeek);
  } else {
    var date = /* @__PURE__ */ new Date(0);
    if (!validateDate(year, month, day) || !validateDayOfYearDate(year, dayOfYear)) {
      return /* @__PURE__ */ new Date(NaN);
    }
    date.setUTCFullYear(year, month, Math.max(dayOfYear, day));
    return date;
  }
}
function parseDateUnit(value) {
  return value ? parseInt(value) : 1;
}
function parseTime(timeString) {
  var captures = timeString.match(timeRegex);
  if (!captures)
    return NaN;
  var hours = parseTimeUnit(captures[1]);
  var minutes = parseTimeUnit(captures[2]);
  var seconds = parseTimeUnit(captures[3]);
  if (!validateTime(hours, minutes, seconds)) {
    return NaN;
  }
  return hours * millisecondsInHour + minutes * millisecondsInMinute + seconds * 1e3;
}
function parseTimeUnit(value) {
  return value && parseFloat(value.replace(",", ".")) || 0;
}
function parseTimezone(timezoneString) {
  if (timezoneString === "Z")
    return 0;
  var captures = timezoneString.match(timezoneRegex);
  if (!captures)
    return 0;
  var sign = captures[1] === "+" ? -1 : 1;
  var hours = parseInt(captures[2]);
  var minutes = captures[3] && parseInt(captures[3]) || 0;
  if (!validateTimezone(hours, minutes)) {
    return NaN;
  }
  return sign * (hours * millisecondsInHour + minutes * millisecondsInMinute);
}
function dayOfISOWeekYear(isoWeekYear, week, day) {
  var date = /* @__PURE__ */ new Date(0);
  date.setUTCFullYear(isoWeekYear, 0, 4);
  var fourthOfJanuaryDay = date.getUTCDay() || 7;
  var diff = (week - 1) * 7 + day + 1 - fourthOfJanuaryDay;
  date.setUTCDate(date.getUTCDate() + diff);
  return date;
}
var daysInMonths = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function isLeapYearIndex(year) {
  return year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
}
function validateDate(year, month, date) {
  return month >= 0 && month <= 11 && date >= 1 && date <= (daysInMonths[month] || (isLeapYearIndex(year) ? 29 : 28));
}
function validateDayOfYearDate(year, dayOfYear) {
  return dayOfYear >= 1 && dayOfYear <= (isLeapYearIndex(year) ? 366 : 365);
}
function validateWeekDate(_year, week, day) {
  return week >= 1 && week <= 53 && day >= 0 && day <= 6;
}
function validateTime(hours, minutes, seconds) {
  if (hours === 24) {
    return minutes === 0 && seconds === 0;
  }
  return seconds >= 0 && seconds < 60 && minutes >= 0 && minutes < 60 && hours >= 0 && hours < 25;
}
function validateTimezone(_hours, minutes) {
  return minutes >= 0 && minutes <= 59;
}
const _hoisted_1$7 = { class: "empty:hidden h-56 flex items-center justify-center" };
const _hoisted_2$7 = {
  key: 0,
  class: "justify-self-center",
  role: "status"
};
const _hoisted_3$7 = /* @__PURE__ */ createBaseVNode("svg", {
  "aria-hidden": "true",
  class: "w-8 h-8 mr-2 flex-shrink-0 text-gray-200 animate-spin dark:text-gray-600 fill-brand-700",
  viewBox: "0 0 100 101",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, [
  /* @__PURE__ */ createBaseVNode("path", {
    d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z",
    fill: "currentColor"
  }),
  /* @__PURE__ */ createBaseVNode("path", {
    d: "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z",
    fill: "currentFill"
  })
], -1);
const _hoisted_4$6 = /* @__PURE__ */ createBaseVNode("span", { class: "sr-only" }, "Loading...", -1);
const _hoisted_5$4 = [
  _hoisted_3$7,
  _hoisted_4$6
];
const _hoisted_6$4 = {
  key: 1,
  class: "text-error-600 bg-error-100 p-4 rounded-md"
};
const _hoisted_7$4 = {
  key: 2,
  class: "bg-orange-100 text-orange-600 p-4 rounded-md shadow-md"
};
const _hoisted_8$3 = { class: "bg-gray-50 px-4 py-2 flex gap-2" };
const _hoisted_9$3 = {
  class: "isolate inline-flex -space-x-px rounded-md shadow-sm",
  "aria-label": "Pagination"
};
const _hoisted_10$3 = ["href", "onClick", "disabled"];
const _hoisted_11$3 = { class: "sr-only" };
const _hoisted_12$3 = {
  key: 0,
  class: "h-5 w-5",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  "aria-hidden": "true"
};
const _hoisted_13$3 = /* @__PURE__ */ createBaseVNode("path", {
  "fill-rule": "evenodd",
  d: "M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z",
  "clip-rule": "evenodd"
}, null, -1);
const _hoisted_14$3 = [
  _hoisted_13$3
];
const _hoisted_15$2 = {
  key: 1,
  class: "text-gray-900"
};
const _hoisted_16$1 = {
  key: 2,
  class: "h-5 w-5",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  "aria-hidden": "true"
};
const _hoisted_17$1 = /* @__PURE__ */ createBaseVNode("path", {
  "fill-rule": "evenodd",
  d: "M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z",
  "clip-rule": "evenodd"
}, null, -1);
const _hoisted_18$1 = [
  _hoisted_17$1
];
const _hoisted_19$1 = { class: "relative inline-flex items-center px-4 py-2 text-sm font-semibold" };
const _hoisted_20$1 = { class: "grid grid-cols-7 justify-items-center bg-none gap-0.5 p-0.5" };
const _hoisted_21$1 = {
  class: "hidden md:block w-full bold text-lg bg-white",
  style: { "color": "#888" }
};
const _hoisted_22$1 = { style: { "text-align": "center" } };
const _hoisted_23$1 = {
  class: "block md:hidden w-full bold text-lg bg-white",
  style: { "color": "#888" }
};
const _hoisted_24$1 = { style: { "text-align": "center" } };
const _hoisted_25 = {
  class: "overflow-scroll",
  style: { "max-height": "80px" }
};
const _hoisted_26 = { key: 0 };
const _hoisted_27 = {
  key: 1,
  class: "text-center"
};
const _sfc_main$7 = {
  __name: "reportCalendar",
  props: {
    records: {
      default: [],
      type: Array
    },
    status: {
      default: "",
      type: String
    },
    navInfo: {
      type: Object,
      default: {}
    },
    config: {
      type: Object,
      default: {}
    },
    query: {
      type: Object,
      default: {}
    }
  },
  emits: ["query"],
  setup(__props, { emit }) {
    const props = __props;
    const table = ref(null);
    const computedRecords = ref([]);
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];
    const shortdays = _.map(weekdays, (day) => day.substring(0, 3));
    const date = ref(parse("2022-01-01", "yyyy-MM-dd", /* @__PURE__ */ new Date()));
    const month = ref("");
    const year = ref("");
    const days = ref([]);
    const created_at = (url) => {
      date.value = parse(url.split("=")[1].split(",")[0], "yyyy-MM-dd", /* @__PURE__ */ new Date());
      emit("query", { created_at: url.split("=")[1] });
      debugger;
    };
    const genMenu = () => {
      const [m4, y4] = format(date.value, "MMMM yyyy").split(" ");
      debugger;
      month.value = m4;
      year.value = y4;
      const nextMonth = addMonths(date.value, 1);
      const next = "?created_at=" + format(startOfMonth(nextMonth), "yyyy-MM-dd") + "," + format(endOfMonth(nextMonth), "yyyy-MM-dd");
      const previousMonth = addMonths(date.value, -1);
      const previous = "?created_at=" + format(startOfMonth(previousMonth), "yyyy-MM-dd") + "," + format(endOfMonth(previousMonth), "yyyy-MM-dd");
      props.navInfo.links = [
        { label: "Previous", url: previous },
        { label: m4, active: true },
        { label: "Next", url: next }
      ];
    };
    genMenu();
    emit("query", {
      created_at: format(startOfMonth(date.value), "yyyy-MM-dd") + "," + format(endOfMonth(date.value), "yyyy-MM-dd")
    });
    const calcDays = () => {
      const offset2 = getDay(startOfMonth(date.value));
      const mLength = getDate(endOfMonth(date.value));
      const lim = (mLength + offset2) % 7;
      const dayList = mLength + offset2 + (lim > 0 ? 7 - lim : 0);
      const isMonth = isSameMonth(/* @__PURE__ */ new Date(), date.value);
      const today = isMonth ? getDate(/* @__PURE__ */ new Date()) : 0;
      days.value = _.map(Array(dayList), (d4, i3) => {
        const cd2 = i3 - offset2;
        const dayOfMonth = getDate(addDays(startOfMonth(date.value), cd2));
        const contained = cd2 < 0 ? false : cd2 < mLength ? true : false;
        let eventList = [];
        if (contained) {
          eventList = _.sortBy(
            _.sortBy(
              _.filter(props.records, (event) => {
                if (dayOfMonth >= event.start && dayOfMonth <= event.end) {
                  return event;
                }
              }),
              "start"
            ),
            "allDay"
          );
        }
        return {
          date: dayOfMonth,
          events: eventList,
          contained,
          isToday: isMonth && today == dayOfMonth
        };
      });
    };
    watch(
      () => props.records,
      (newRecords) => {
        if (!("map" in props.config) || typeof props.config.map !== "object" || !props.config.map.length) {
          computedRecords.value = newRecords;
          return;
        }
        computedRecords.value = _.map(newRecords, (record) => {
          record.start = getDate(parseISO(record["created_at"]));
          record.end = getDate(
            parseISO(record["opened_at"] || record["created_at"])
          );
          return $g.etl(
            $g.selectPath(record, props.config.path || ""),
            record,
            props.config.map
          );
        });
        genMenu();
        calcDays();
      }
    );
    onMounted((e3) => {
      genMenu();
      calcDays();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        __props.status !== "" || !__props.records.length ? (openBlock(), createElementBlock("ul", {
          key: 0,
          ref_key: "table",
          ref: table,
          class: normalizeClass(["grid divide-y absolute inset-0 overflow-auto border-b items-center justify-center bg-slate-200 bg-opacity-70", _ctx.reportClass])
        }, [
          createBaseVNode("div", _hoisted_1$7, [
            __props.status == "waiting" ? (openBlock(), createElementBlock("div", _hoisted_2$7, _hoisted_5$4)) : createCommentVNode("", true),
            __props.status && __props.status !== "waiting" ? (openBlock(), createElementBlock("p", _hoisted_6$4, toDisplayString(__props.status), 1)) : createCommentVNode("", true),
            !__props.records.length && __props.status == "" ? (openBlock(), createElementBlock("span", _hoisted_7$4, " No matching records found ")) : createCommentVNode("", true)
          ])
        ], 2)) : createCommentVNode("", true),
        createBaseVNode("div", _hoisted_8$3, [
          createBaseVNode("nav", _hoisted_9$3, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(__props.navInfo.links, (link) => {
              return openBlock(), createElementBlock("button", {
                href: link.url,
                onClick: withModifiers(($event) => created_at(link.url), ["prevent"]),
                disabled: !link.url,
                "data-paginate": "",
                "aria-current": "page",
                class: normalizeClass([
                  "disabled:text-gray-400  disabled:ring-gray-300 disabled:hover:bg-gray-50 relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset focus:z-20 focus:outline-offset-0",
                  link.active ? "z-10    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600" : "text-gray-900 ring-gray-300 hover:bg-gray-50",
                  link.label == "Previous" ? "rounded-l-md" : "",
                  link.label == "Next" ? "rounded-r-md" : ""
                ])
              }, [
                createBaseVNode("span", _hoisted_11$3, toDisplayString(link.label), 1),
                link.label == "Previous" ? (openBlock(), createElementBlock("svg", _hoisted_12$3, _hoisted_14$3)) : createCommentVNode("", true),
                link.label !== "Previous" && link.label !== "Next" ? (openBlock(), createElementBlock("span", _hoisted_15$2, toDisplayString(link.label), 1)) : createCommentVNode("", true),
                link.label == "Next" ? (openBlock(), createElementBlock("svg", _hoisted_16$1, _hoisted_18$1)) : createCommentVNode("", true)
              ], 10, _hoisted_10$3);
            }), 256))
          ]),
          createBaseVNode("span", _hoisted_19$1, toDisplayString(year.value), 1)
        ]),
        createBaseVNode("div", _hoisted_20$1, [
          (openBlock(), createElementBlock(Fragment, null, renderList(weekdays, (weekday) => {
            return createBaseVNode("div", _hoisted_21$1, [
              createBaseVNode("div", _hoisted_22$1, toDisplayString(weekday), 1)
            ]);
          }), 64)),
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(shortdays), (weekday) => {
            return openBlock(), createElementBlock("div", _hoisted_23$1, [
              createBaseVNode("div", _hoisted_24$1, toDisplayString(weekday), 1)
            ]);
          }), 256)),
          (openBlock(true), createElementBlock(Fragment, null, renderList(days.value, (day) => {
            return openBlock(), createElementBlock("div", {
              class: normalizeClass([day.contained ? "bg-white" : "bg-gray-100", "w-full flex flex-col gap-1 py-1"]),
              style: { "min-height": "12vh" }
            }, [
              createBaseVNode("div", {
                class: normalizeClass([
                  day.isToday ? "bg-blue-500 text-white" : day.events.length && day.contained ? "bg-green-100 text-slate-700" : "bg-gray-100 text-slate-700",
                  "flex items-center justify-center ml-1 w-7 h-7 rounded-full"
                ]),
                style: { "font-weight": "300" }
              }, toDisplayString(day.date), 3),
              createBaseVNode("div", _hoisted_25, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(day.events, (event) => {
                  return openBlock(), createElementBlock("div", {
                    class: normalizeClass([[
                      event.start == day.date ? "rounded-l ml-1 pl-1 border-l-none" : "",
                      event.end == day.date ? "mr-1 rounded-r pr-1 border-r-none" : ""
                    ], "eventItem mb-0.5 px-2 py-0.5 text-sm bg-blue-400 text-white"])
                  }, [
                    event.start == day.date ? (openBlock(), createElementBlock("span", _hoisted_26, toDisplayString(event.title), 1)) : createCommentVNode("", true),
                    event.start !== day.date ? (openBlock(), createElementBlock("div", _hoisted_27, "-")) : createCommentVNode("", true)
                  ], 2);
                }), 256))
              ])
            ], 2);
          }), 256))
        ])
      ], 64);
    };
  }
};
function u$2(r2, n2, ...a4) {
  if (r2 in n2) {
    let e3 = n2[r2];
    return typeof e3 == "function" ? e3(...a4) : e3;
  }
  let t3 = new Error(`Tried to handle "${r2}" but there is no handler defined. Only defined handlers are: ${Object.keys(n2).map((e3) => `"${e3}"`).join(", ")}.`);
  throw Error.captureStackTrace && Error.captureStackTrace(t3, u$2), t3;
}
var N$1 = ((o2) => (o2[o2.None = 0] = "None", o2[o2.RenderStrategy = 1] = "RenderStrategy", o2[o2.Static = 2] = "Static", o2))(N$1 || {}), S3 = ((e3) => (e3[e3.Unmount = 0] = "Unmount", e3[e3.Hidden = 1] = "Hidden", e3))(S3 || {});
function H3({ visible: r2 = true, features: t3 = 0, ourProps: e3, theirProps: o2, ...i3 }) {
  var a4;
  let n2 = j(o2, e3), l2 = Object.assign(i3, { props: n2 });
  if (r2 || t3 & 2 && n2.static)
    return y$2(l2);
  if (t3 & 1) {
    let d4 = (a4 = n2.unmount) == null || a4 ? 0 : 1;
    return u$2(d4, { [0]() {
      return null;
    }, [1]() {
      return y$2({ ...i3, props: { ...n2, hidden: true, style: { display: "none" } } });
    } });
  }
  return y$2(l2);
}
function y$2({ props: r2, attrs: t3, slots: e3, slot: o2, name: i3 }) {
  var m4, h4;
  let { as: n2, ...l2 } = T$1(r2, ["unmount", "static"]), a4 = (m4 = e3.default) == null ? void 0 : m4.call(e3, o2), d4 = {};
  if (o2) {
    let u3 = false, c3 = [];
    for (let [p2, f2] of Object.entries(o2))
      typeof f2 == "boolean" && (u3 = true), f2 === true && c3.push(p2);
    u3 && (d4["data-headlessui-state"] = c3.join(" "));
  }
  if (n2 === "template") {
    if (a4 = b$1(a4 != null ? a4 : []), Object.keys(l2).length > 0 || Object.keys(t3).length > 0) {
      let [u3, ...c3] = a4 != null ? a4 : [];
      if (!v(u3) || c3.length > 0)
        throw new Error(['Passing props on "template"!', "", `The current component <${i3} /> is rendering a "template".`, "However we need to passthrough the following props:", Object.keys(l2).concat(Object.keys(t3)).map((s4) => s4.trim()).filter((s4, g2, R2) => R2.indexOf(s4) === g2).sort((s4, g2) => s4.localeCompare(g2)).map((s4) => `  - ${s4}`).join(`
`), "", "You can apply a few solutions:", ['Add an `as="..."` prop, to ensure that we render an actual element instead of a "template".', "Render a single element as the child so that we can forward the props onto that element."].map((s4) => `  - ${s4}`).join(`
`)].join(`
`));
      let p2 = j((h4 = u3.props) != null ? h4 : {}, l2), f2 = cloneVNode(u3, p2);
      for (let s4 in p2)
        s4.startsWith("on") && (f2.props || (f2.props = {}), f2.props[s4] = p2[s4]);
      return f2;
    }
    return Array.isArray(a4) && a4.length === 1 ? a4[0] : a4;
  }
  return h$1(n2, Object.assign({}, l2, d4), { default: () => a4 });
}
function b$1(r2) {
  return r2.flatMap((t3) => t3.type === Fragment ? b$1(t3.children) : [t3]);
}
function j(...r2) {
  if (r2.length === 0)
    return {};
  if (r2.length === 1)
    return r2[0];
  let t3 = {}, e3 = {};
  for (let i3 of r2)
    for (let n2 in i3)
      n2.startsWith("on") && typeof i3[n2] == "function" ? (e3[n2] != null || (e3[n2] = []), e3[n2].push(i3[n2])) : t3[n2] = i3[n2];
  if (t3.disabled || t3["aria-disabled"])
    return Object.assign(t3, Object.fromEntries(Object.keys(e3).map((i3) => [i3, void 0])));
  for (let i3 in e3)
    Object.assign(t3, { [i3](n2, ...l2) {
      let a4 = e3[i3];
      for (let d4 of a4) {
        if (n2 instanceof Event && n2.defaultPrevented)
          return;
        d4(n2, ...l2);
      }
    } });
  return t3;
}
function K$1(r2) {
  let t3 = Object.assign({}, r2);
  for (let e3 in t3)
    t3[e3] === void 0 && delete t3[e3];
  return t3;
}
function T$1(r2, t3 = []) {
  let e3 = Object.assign({}, r2);
  for (let o2 of t3)
    o2 in e3 && delete e3[o2];
  return e3;
}
function v(r2) {
  return r2 == null ? false : typeof r2.type == "string" || typeof r2.type == "object" || typeof r2.type == "function";
}
let e$1 = 0;
function n$2() {
  return ++e$1;
}
function t2() {
  return n$2();
}
var o$3 = ((r2) => (r2.Space = " ", r2.Enter = "Enter", r2.Escape = "Escape", r2.Backspace = "Backspace", r2.Delete = "Delete", r2.ArrowLeft = "ArrowLeft", r2.ArrowUp = "ArrowUp", r2.ArrowRight = "ArrowRight", r2.ArrowDown = "ArrowDown", r2.Home = "Home", r2.End = "End", r2.PageUp = "PageUp", r2.PageDown = "PageDown", r2.Tab = "Tab", r2))(o$3 || {});
function f$2(r2) {
  throw new Error("Unexpected object: " + r2);
}
var a$2 = ((e3) => (e3[e3.First = 0] = "First", e3[e3.Previous = 1] = "Previous", e3[e3.Next = 2] = "Next", e3[e3.Last = 3] = "Last", e3[e3.Specific = 4] = "Specific", e3[e3.Nothing = 5] = "Nothing", e3))(a$2 || {});
function x$1(r2, n2) {
  let t3 = n2.resolveItems();
  if (t3.length <= 0)
    return null;
  let l2 = n2.resolveActiveIndex(), s4 = l2 != null ? l2 : -1, d4 = (() => {
    switch (r2.focus) {
      case 0:
        return t3.findIndex((e3) => !n2.resolveDisabled(e3));
      case 1: {
        let e3 = t3.slice().reverse().findIndex((i3, c3, u3) => s4 !== -1 && u3.length - c3 - 1 >= s4 ? false : !n2.resolveDisabled(i3));
        return e3 === -1 ? e3 : t3.length - 1 - e3;
      }
      case 2:
        return t3.findIndex((e3, i3) => i3 <= s4 ? false : !n2.resolveDisabled(e3));
      case 3: {
        let e3 = t3.slice().reverse().findIndex((i3) => !n2.resolveDisabled(i3));
        return e3 === -1 ? e3 : t3.length - 1 - e3;
      }
      case 4:
        return t3.findIndex((e3) => n2.resolveId(e3) === r2.id);
      case 5:
        return null;
      default:
        f$2(r2);
    }
  })();
  return d4 === -1 ? l2 : d4;
}
function o$2(n2) {
  var l2;
  return n2 == null || n2.value == null ? null : (l2 = n2.value.$el) != null ? l2 : n2.value;
}
let n$1 = Symbol("Context");
var l = ((e3) => (e3[e3.Open = 1] = "Open", e3[e3.Closed = 2] = "Closed", e3[e3.Closing = 4] = "Closing", e3[e3.Opening = 8] = "Opening", e3))(l || {});
function p$1() {
  return inject(n$1, null);
}
function c$2(o2) {
  provide(n$1, o2);
}
function r$1(t3, e3) {
  if (t3)
    return t3;
  let n2 = e3 != null ? e3 : "button";
  if (typeof n2 == "string" && n2.toLowerCase() === "button")
    return "button";
}
function b2(t3, e3) {
  let n2 = ref(r$1(t3.value.type, t3.value.as));
  return onMounted(() => {
    n2.value = r$1(t3.value.type, t3.value.as);
  }), watchEffect(() => {
    var o2;
    n2.value || o$2(e3) && o$2(e3) instanceof HTMLButtonElement && !((o2 = o$2(e3)) != null && o2.hasAttribute("type")) && (n2.value = "button");
  }), n2;
}
var i2 = Object.defineProperty;
var d$1 = (t3, e3, r2) => e3 in t3 ? i2(t3, e3, { enumerable: true, configurable: true, writable: true, value: r2 }) : t3[e3] = r2;
var n = (t3, e3, r2) => (d$1(t3, typeof e3 != "symbol" ? e3 + "" : e3, r2), r2);
class s3 {
  constructor() {
    n(this, "current", this.detect());
    n(this, "currentId", 0);
  }
  set(e3) {
    this.current !== e3 && (this.currentId = 0, this.current = e3);
  }
  reset() {
    this.set(this.detect());
  }
  nextId() {
    return ++this.currentId;
  }
  get isServer() {
    return this.current === "server";
  }
  get isClient() {
    return this.current === "client";
  }
  detect() {
    return typeof window == "undefined" || typeof document == "undefined" ? "server" : "client";
  }
}
let c$1 = new s3();
function m3(r2) {
  if (c$1.isServer)
    return null;
  if (r2 instanceof Node)
    return r2.ownerDocument;
  if (r2 != null && r2.hasOwnProperty("value")) {
    let n2 = o$2(r2);
    if (n2)
      return n2.ownerDocument;
  }
  return document;
}
let c2 = ["[contentEditable=true]", "[tabindex]", "a[href]", "area[href]", "button:not([disabled])", "iframe", "input:not([disabled])", "select:not([disabled])", "textarea:not([disabled])"].map((e3) => `${e3}:not([tabindex='-1'])`).join(",");
var N = ((n2) => (n2[n2.First = 1] = "First", n2[n2.Previous = 2] = "Previous", n2[n2.Next = 4] = "Next", n2[n2.Last = 8] = "Last", n2[n2.WrapAround = 16] = "WrapAround", n2[n2.NoScroll = 32] = "NoScroll", n2))(N || {}), T2 = ((o2) => (o2[o2.Error = 0] = "Error", o2[o2.Overflow = 1] = "Overflow", o2[o2.Success = 2] = "Success", o2[o2.Underflow = 3] = "Underflow", o2))(T2 || {}), F = ((t3) => (t3[t3.Previous = -1] = "Previous", t3[t3.Next = 1] = "Next", t3))(F || {});
var h3 = ((t3) => (t3[t3.Strict = 0] = "Strict", t3[t3.Loose = 1] = "Loose", t3))(h3 || {});
function w$1(e3, r2 = 0) {
  var t3;
  return e3 === ((t3 = m3(e3)) == null ? void 0 : t3.body) ? false : u$2(r2, { [0]() {
    return e3.matches(c2);
  }, [1]() {
    let l2 = e3;
    for (; l2 !== null; ) {
      if (l2.matches(c2))
        return true;
      l2 = l2.parentElement;
    }
    return false;
  } });
}
var y$1 = ((t3) => (t3[t3.Keyboard = 0] = "Keyboard", t3[t3.Mouse = 1] = "Mouse", t3))(y$1 || {});
typeof window != "undefined" && typeof document != "undefined" && (document.addEventListener("keydown", (e3) => {
  e3.metaKey || e3.altKey || e3.ctrlKey || (document.documentElement.dataset.headlessuiFocusVisible = "");
}, true), document.addEventListener("click", (e3) => {
  e3.detail === 1 ? delete document.documentElement.dataset.headlessuiFocusVisible : e3.detail === 0 && (document.documentElement.dataset.headlessuiFocusVisible = "");
}, true));
function O2(e3, r2 = (t3) => t3) {
  return e3.slice().sort((t3, l2) => {
    let o2 = r2(t3), i3 = r2(l2);
    if (o2 === null || i3 === null)
      return 0;
    let n2 = o2.compareDocumentPosition(i3);
    return n2 & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : n2 & Node.DOCUMENT_POSITION_PRECEDING ? 1 : 0;
  });
}
function u$1(e3, t3, n2) {
  c$1.isServer || watchEffect((o2) => {
    document.addEventListener(e3, t3, n2), o2(() => document.removeEventListener(e3, t3, n2));
  });
}
function w2(e3, n2, t3) {
  c$1.isServer || watchEffect((o2) => {
    window.addEventListener(e3, n2, t3), o2(() => window.removeEventListener(e3, n2, t3));
  });
}
function y3(f2, c3, i3 = computed(() => true)) {
  function a4(e3, r2) {
    if (!i3.value || e3.defaultPrevented)
      return;
    let t3 = r2(e3);
    if (t3 === null || !t3.getRootNode().contains(t3))
      return;
    let m4 = function o2(n2) {
      return typeof n2 == "function" ? o2(n2()) : Array.isArray(n2) || n2 instanceof Set ? n2 : [n2];
    }(f2);
    for (let o2 of m4) {
      if (o2 === null)
        continue;
      let n2 = o2 instanceof HTMLElement ? o2 : o$2(o2);
      if (n2 != null && n2.contains(t3) || e3.composed && e3.composedPath().includes(n2))
        return;
    }
    return !w$1(t3, h3.Loose) && t3.tabIndex !== -1 && e3.preventDefault(), c3(e3, t3);
  }
  let u3 = ref(null);
  u$1("pointerdown", (e3) => {
    var r2, t3;
    i3.value && (u3.value = ((t3 = (r2 = e3.composedPath) == null ? void 0 : r2.call(e3)) == null ? void 0 : t3[0]) || e3.target);
  }, true), u$1("mousedown", (e3) => {
    var r2, t3;
    i3.value && (u3.value = ((t3 = (r2 = e3.composedPath) == null ? void 0 : r2.call(e3)) == null ? void 0 : t3[0]) || e3.target);
  }, true), u$1("click", (e3) => {
    u3.value && (a4(e3, () => u3.value), u3.value = null);
  }, true), u$1("touchend", (e3) => a4(e3, () => e3.target instanceof HTMLElement ? e3.target : null), true), w2("blur", (e3) => a4(e3, () => window.document.activeElement instanceof HTMLIFrameElement ? window.document.activeElement : null), true);
}
var a$1 = ((e3) => (e3[e3.None = 1] = "None", e3[e3.Focusable = 2] = "Focusable", e3[e3.Hidden = 4] = "Hidden", e3))(a$1 || {});
let f$1 = defineComponent({ name: "Hidden", props: { as: { type: [Object, String], default: "div" }, features: { type: Number, default: 1 } }, setup(r2, { slots: t3, attrs: d4 }) {
  return () => {
    let { features: e3, ...o2 } = r2, n2 = { "aria-hidden": (e3 & 2) === 2 ? true : void 0, style: { position: "fixed", top: 1, left: 1, width: 1, height: 0, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", borderWidth: "0", ...(e3 & 4) === 4 && (e3 & 2) !== 2 && { display: "none" } } };
    return H3({ ourProps: n2, theirProps: o2, slot: {}, attrs: d4, slots: t3, name: "Hidden" });
  };
} });
function e2(i3 = {}, s4 = null, t3 = []) {
  for (let [r2, n2] of Object.entries(i3))
    o$1(t3, f(s4, r2), n2);
  return t3;
}
function f(i3, s4) {
  return i3 ? i3 + "[" + s4 + "]" : s4;
}
function o$1(i3, s4, t3) {
  if (Array.isArray(t3))
    for (let [r2, n2] of t3.entries())
      o$1(i3, f(s4, r2.toString()), n2);
  else
    t3 instanceof Date ? i3.push([s4, t3.toISOString()]) : typeof t3 == "boolean" ? i3.push([s4, t3 ? "1" : "0"]) : typeof t3 == "string" ? i3.push([s4, t3]) : typeof t3 == "number" ? i3.push([s4, `${t3}`]) : t3 == null ? i3.push([s4, ""]) : e2(t3, s4, i3);
}
function d3(u3, e3, r2) {
  let i3 = ref(r2 == null ? void 0 : r2.value), f2 = computed(() => u3.value !== void 0);
  return [computed(() => f2.value ? u3.value : i3.value), function(t3) {
    return f2.value || (i3.value = t3), e3 == null ? void 0 : e3(t3);
  }];
}
function r(e3) {
  return [e3.screenX, e3.screenY];
}
function u2() {
  let e3 = ref([-1, -1]);
  return { wasMoved(n2) {
    let t3 = r(n2);
    return e3.value[0] === t3[0] && e3.value[1] === t3[1] ? false : (e3.value = t3, true);
  }, update(n2) {
    e3.value = r(n2);
  } };
}
let a3 = /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;
function o(e3) {
  var r2, i3;
  let n2 = (r2 = e3.innerText) != null ? r2 : "", t3 = e3.cloneNode(true);
  if (!(t3 instanceof HTMLElement))
    return n2;
  let u3 = false;
  for (let f2 of t3.querySelectorAll('[hidden],[aria-hidden],[role="img"]'))
    f2.remove(), u3 = true;
  let l2 = u3 ? (i3 = t3.innerText) != null ? i3 : "" : n2;
  return a3.test(l2) && (l2 = l2.replace(a3, "")), l2;
}
function g(e3) {
  let n2 = e3.getAttribute("aria-label");
  if (typeof n2 == "string")
    return n2.trim();
  let t3 = e3.getAttribute("aria-labelledby");
  if (t3) {
    let u3 = t3.split(" ").map((l2) => {
      let r2 = document.getElementById(l2);
      if (r2) {
        let i3 = r2.getAttribute("aria-label");
        return typeof i3 == "string" ? i3.trim() : o(r2).trim();
      }
      return null;
    }).filter(Boolean);
    if (u3.length > 0)
      return u3.join(", ");
  }
  return o(e3).trim();
}
function p(a4) {
  let t3 = ref(""), r2 = ref("");
  return () => {
    let e3 = o$2(a4);
    if (!e3)
      return "";
    let l2 = e3.innerText;
    if (t3.value === l2)
      return r2.value;
    let u3 = g(e3).trim().toLowerCase();
    return t3.value = l2, r2.value = u3, u3;
  };
}
function pe$1(t3, v2) {
  return t3 === v2;
}
var ce = ((l2) => (l2[l2.Open = 0] = "Open", l2[l2.Closed = 1] = "Closed", l2))(ce || {}), ve$1 = ((l2) => (l2[l2.Single = 0] = "Single", l2[l2.Multi = 1] = "Multi", l2))(ve$1 || {}), be$1 = ((l2) => (l2[l2.Pointer = 0] = "Pointer", l2[l2.Other = 1] = "Other", l2))(be$1 || {});
function me$1(t3) {
  requestAnimationFrame(() => requestAnimationFrame(t3));
}
let $$1 = Symbol("ListboxContext");
function A(t3) {
  let v2 = inject($$1, null);
  if (v2 === null) {
    let l2 = new Error(`<${t3} /> is missing a parent <Listbox /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(l2, A), l2;
  }
  return v2;
}
let Be$1 = defineComponent({ name: "Listbox", emits: { "update:modelValue": (t3) => true }, props: { as: { type: [Object, String], default: "template" }, disabled: { type: [Boolean], default: false }, by: { type: [String, Function], default: () => pe$1 }, horizontal: { type: [Boolean], default: false }, modelValue: { type: [Object, String, Number, Boolean], default: void 0 }, defaultValue: { type: [Object, String, Number, Boolean], default: void 0 }, form: { type: String, optional: true }, name: { type: String, optional: true }, multiple: { type: [Boolean], default: false } }, inheritAttrs: false, setup(t3, { slots: v2, attrs: l$1, emit: L2 }) {
  let e$12 = ref(1), d$12 = ref(null), b3 = ref(null), m4 = ref(null), f2 = ref([]), o2 = ref(""), i3 = ref(null), T3 = ref(1);
  function k2(a4 = (n2) => n2) {
    let n2 = i3.value !== null ? f2.value[i3.value] : null, u3 = O2(a4(f2.value.slice()), (O3) => o$2(O3.dataRef.domRef)), s4 = n2 ? u3.indexOf(n2) : null;
    return s4 === -1 && (s4 = null), { options: u3, activeOptionIndex: s4 };
  }
  let y$12 = computed(() => t3.multiple ? 1 : 0), [h$2, M3] = d3(computed(() => t3.modelValue), (a4) => L2("update:modelValue", a4), computed(() => t3.defaultValue)), w3 = computed(() => h$2.value === void 0 ? u$2(y$12.value, { [1]: [], [0]: void 0 }) : h$2.value), r2 = { listboxState: e$12, value: w3, mode: y$12, compare(a4, n2) {
    if (typeof t3.by == "string") {
      let u3 = t3.by;
      return (a4 == null ? void 0 : a4[u3]) === (n2 == null ? void 0 : n2[u3]);
    }
    return t3.by(a4, n2);
  }, orientation: computed(() => t3.horizontal ? "horizontal" : "vertical"), labelRef: d$12, buttonRef: b3, optionsRef: m4, disabled: computed(() => t3.disabled), options: f2, searchQuery: o2, activeOptionIndex: i3, activationTrigger: T3, closeListbox() {
    t3.disabled || e$12.value !== 1 && (e$12.value = 1, i3.value = null);
  }, openListbox() {
    t3.disabled || e$12.value !== 0 && (e$12.value = 0);
  }, goToOption(a4, n2, u3) {
    if (t3.disabled || e$12.value === 1)
      return;
    let s4 = k2(), O3 = x$1(a4 === a$2.Specific ? { focus: a$2.Specific, id: n2 } : { focus: a4 }, { resolveItems: () => s4.options, resolveActiveIndex: () => s4.activeOptionIndex, resolveId: (P) => P.id, resolveDisabled: (P) => P.dataRef.disabled });
    o2.value = "", i3.value = O3, T3.value = u3 != null ? u3 : 1, f2.value = s4.options;
  }, search(a4) {
    if (t3.disabled || e$12.value === 1)
      return;
    let u3 = o2.value !== "" ? 0 : 1;
    o2.value += a4.toLowerCase();
    let O3 = (i3.value !== null ? f2.value.slice(i3.value + u3).concat(f2.value.slice(0, i3.value + u3)) : f2.value).find((I2) => I2.dataRef.textValue.startsWith(o2.value) && !I2.dataRef.disabled), P = O3 ? f2.value.indexOf(O3) : -1;
    P === -1 || P === i3.value || (i3.value = P, T3.value = 1);
  }, clearSearch() {
    t3.disabled || e$12.value !== 1 && o2.value !== "" && (o2.value = "");
  }, registerOption(a4, n2) {
    let u3 = k2((s4) => [...s4, { id: a4, dataRef: n2 }]);
    f2.value = u3.options, i3.value = u3.activeOptionIndex;
  }, unregisterOption(a4) {
    let n2 = k2((u3) => {
      let s4 = u3.findIndex((O3) => O3.id === a4);
      return s4 !== -1 && u3.splice(s4, 1), u3;
    });
    f2.value = n2.options, i3.value = n2.activeOptionIndex, T3.value = 1;
  }, theirOnChange(a4) {
    t3.disabled || M3(a4);
  }, select(a4) {
    t3.disabled || M3(u$2(y$12.value, { [0]: () => a4, [1]: () => {
      let n2 = toRaw(r2.value.value).slice(), u3 = toRaw(a4), s4 = n2.findIndex((O3) => r2.compare(u3, toRaw(O3)));
      return s4 === -1 ? n2.push(u3) : n2.splice(s4, 1), n2;
    } }));
  } };
  y3([b3, m4], (a4, n2) => {
    var u3;
    r2.closeListbox(), w$1(n2, h3.Loose) || (a4.preventDefault(), (u3 = o$2(b3)) == null || u3.focus());
  }, computed(() => e$12.value === 0)), provide($$1, r2), c$2(computed(() => u$2(e$12.value, { [0]: l.Open, [1]: l.Closed })));
  let x3 = computed(() => {
    var a4;
    return (a4 = o$2(b3)) == null ? void 0 : a4.closest("form");
  });
  return onMounted(() => {
    watch([x3], () => {
      if (!x3.value || t3.defaultValue === void 0)
        return;
      function a4() {
        r2.theirOnChange(t3.defaultValue);
      }
      return x3.value.addEventListener("reset", a4), () => {
        var n2;
        (n2 = x3.value) == null || n2.removeEventListener("reset", a4);
      };
    }, { immediate: true });
  }), () => {
    let { name: a4, modelValue: n2, disabled: u3, form: s4, ...O3 } = t3, P = { open: e$12.value === 0, disabled: u3, value: w3.value };
    return h$1(Fragment, [...a4 != null && w3.value != null ? e2({ [a4]: w3.value }).map(([I2, Q2]) => h$1(f$1, K$1({ features: a$1.Hidden, key: I2, as: "input", type: "hidden", hidden: true, readOnly: true, form: s4, name: I2, value: Q2 }))) : [], H3({ ourProps: {}, theirProps: { ...l$1, ...T$1(O3, ["defaultValue", "onUpdate:modelValue", "horizontal", "multiple", "by"]) }, slot: P, slots: v2, attrs: l$1, name: "Listbox" })]);
  };
} }), Ne = defineComponent({ name: "ListboxButton", props: { as: { type: [Object, String], default: "button" }, id: { type: String, default: () => `headlessui-listbox-button-${t2()}` } }, setup(t3, { attrs: v2, slots: l2, expose: L2 }) {
  let e3 = A("ListboxButton");
  L2({ el: e3.buttonRef, $el: e3.buttonRef });
  function d4(o2) {
    switch (o2.key) {
      case o$3.Space:
      case o$3.Enter:
      case o$3.ArrowDown:
        o2.preventDefault(), e3.openListbox(), nextTick(() => {
          var i3;
          (i3 = o$2(e3.optionsRef)) == null || i3.focus({ preventScroll: true }), e3.value.value || e3.goToOption(a$2.First);
        });
        break;
      case o$3.ArrowUp:
        o2.preventDefault(), e3.openListbox(), nextTick(() => {
          var i3;
          (i3 = o$2(e3.optionsRef)) == null || i3.focus({ preventScroll: true }), e3.value.value || e3.goToOption(a$2.Last);
        });
        break;
    }
  }
  function b$12(o2) {
    switch (o2.key) {
      case o$3.Space:
        o2.preventDefault();
        break;
    }
  }
  function m4(o2) {
    e3.disabled.value || (e3.listboxState.value === 0 ? (e3.closeListbox(), nextTick(() => {
      var i3;
      return (i3 = o$2(e3.buttonRef)) == null ? void 0 : i3.focus({ preventScroll: true });
    })) : (o2.preventDefault(), e3.openListbox(), me$1(() => {
      var i3;
      return (i3 = o$2(e3.optionsRef)) == null ? void 0 : i3.focus({ preventScroll: true });
    })));
  }
  let f2 = b2(computed(() => ({ as: t3.as, type: v2.type })), e3.buttonRef);
  return () => {
    var y4, h4;
    let o2 = { open: e3.listboxState.value === 0, disabled: e3.disabled.value, value: e3.value.value }, { id: i3, ...T3 } = t3, k2 = { ref: e3.buttonRef, id: i3, type: f2.value, "aria-haspopup": "listbox", "aria-controls": (y4 = o$2(e3.optionsRef)) == null ? void 0 : y4.id, "aria-expanded": e3.listboxState.value === 0, "aria-labelledby": e3.labelRef.value ? [(h4 = o$2(e3.labelRef)) == null ? void 0 : h4.id, i3].join(" ") : void 0, disabled: e3.disabled.value === true ? true : void 0, onKeydown: d4, onKeyup: b$12, onClick: m4 };
    return H3({ ourProps: k2, theirProps: T3, slot: o2, attrs: v2, slots: l2, name: "ListboxButton" });
  };
} }), He = defineComponent({ name: "ListboxOptions", props: { as: { type: [Object, String], default: "ul" }, static: { type: Boolean, default: false }, unmount: { type: Boolean, default: true }, id: { type: String, default: () => `headlessui-listbox-options-${t2()}` } }, setup(t3, { attrs: v2, slots: l$1, expose: L2 }) {
  let e3 = A("ListboxOptions"), d4 = ref(null);
  L2({ el: e3.optionsRef, $el: e3.optionsRef });
  function b3(o2) {
    switch (d4.value && clearTimeout(d4.value), o2.key) {
      case o$3.Space:
        if (e3.searchQuery.value !== "")
          return o2.preventDefault(), o2.stopPropagation(), e3.search(o2.key);
      case o$3.Enter:
        if (o2.preventDefault(), o2.stopPropagation(), e3.activeOptionIndex.value !== null) {
          let i3 = e3.options.value[e3.activeOptionIndex.value];
          e3.select(i3.dataRef.value);
        }
        e3.mode.value === 0 && (e3.closeListbox(), nextTick(() => {
          var i3;
          return (i3 = o$2(e3.buttonRef)) == null ? void 0 : i3.focus({ preventScroll: true });
        }));
        break;
      case u$2(e3.orientation.value, { vertical: o$3.ArrowDown, horizontal: o$3.ArrowRight }):
        return o2.preventDefault(), o2.stopPropagation(), e3.goToOption(a$2.Next);
      case u$2(e3.orientation.value, { vertical: o$3.ArrowUp, horizontal: o$3.ArrowLeft }):
        return o2.preventDefault(), o2.stopPropagation(), e3.goToOption(a$2.Previous);
      case o$3.Home:
      case o$3.PageUp:
        return o2.preventDefault(), o2.stopPropagation(), e3.goToOption(a$2.First);
      case o$3.End:
      case o$3.PageDown:
        return o2.preventDefault(), o2.stopPropagation(), e3.goToOption(a$2.Last);
      case o$3.Escape:
        o2.preventDefault(), o2.stopPropagation(), e3.closeListbox(), nextTick(() => {
          var i3;
          return (i3 = o$2(e3.buttonRef)) == null ? void 0 : i3.focus({ preventScroll: true });
        });
        break;
      case o$3.Tab:
        o2.preventDefault(), o2.stopPropagation();
        break;
      default:
        o2.key.length === 1 && (e3.search(o2.key), d4.value = setTimeout(() => e3.clearSearch(), 350));
        break;
    }
  }
  let m4 = p$1(), f2 = computed(() => m4 !== null ? (m4.value & l.Open) === l.Open : e3.listboxState.value === 0);
  return () => {
    var y4, h4, M3, w3;
    let o2 = { open: e3.listboxState.value === 0 }, { id: i3, ...T3 } = t3, k2 = { "aria-activedescendant": e3.activeOptionIndex.value === null || (y4 = e3.options.value[e3.activeOptionIndex.value]) == null ? void 0 : y4.id, "aria-multiselectable": e3.mode.value === 1 ? true : void 0, "aria-labelledby": (w3 = (h4 = o$2(e3.labelRef)) == null ? void 0 : h4.id) != null ? w3 : (M3 = o$2(e3.buttonRef)) == null ? void 0 : M3.id, "aria-orientation": e3.orientation.value, id: i3, onKeydown: b3, role: "listbox", tabIndex: 0, ref: e3.optionsRef };
    return H3({ ourProps: k2, theirProps: T3, slot: o2, attrs: v2, slots: l$1, features: N$1.RenderStrategy | N$1.Static, visible: f2.value, name: "ListboxOptions" });
  };
} }), Ue = defineComponent({ name: "ListboxOption", props: { as: { type: [Object, String], default: "li" }, value: { type: [Object, String, Number, Boolean] }, disabled: { type: Boolean, default: false }, id: { type: String, default: () => `headlessui-listbox.option-${t2()}` } }, setup(t3, { slots: v2, attrs: l2, expose: L2 }) {
  let e3 = A("ListboxOption"), d4 = ref(null);
  L2({ el: d4, $el: d4 });
  let b3 = computed(() => e3.activeOptionIndex.value !== null ? e3.options.value[e3.activeOptionIndex.value].id === t3.id : false), m4 = computed(() => u$2(e3.mode.value, { [0]: () => e3.compare(toRaw(e3.value.value), toRaw(t3.value)), [1]: () => toRaw(e3.value.value).some((r2) => e3.compare(toRaw(r2), toRaw(t3.value))) })), f2 = computed(() => u$2(e3.mode.value, { [1]: () => {
    var x3;
    let r2 = toRaw(e3.value.value);
    return ((x3 = e3.options.value.find((a4) => r2.some((n2) => e3.compare(toRaw(n2), toRaw(a4.dataRef.value))))) == null ? void 0 : x3.id) === t3.id;
  }, [0]: () => m4.value })), o2 = p(d4), i3 = computed(() => ({ disabled: t3.disabled, value: t3.value, get textValue() {
    return o2();
  }, domRef: d4 }));
  onMounted(() => e3.registerOption(t3.id, i3)), onUnmounted(() => e3.unregisterOption(t3.id)), onMounted(() => {
    watch([e3.listboxState, m4], () => {
      e3.listboxState.value === 0 && m4.value && u$2(e3.mode.value, { [1]: () => {
        f2.value && e3.goToOption(a$2.Specific, t3.id);
      }, [0]: () => {
        e3.goToOption(a$2.Specific, t3.id);
      } });
    }, { immediate: true });
  }), watchEffect(() => {
    e3.listboxState.value === 0 && b3.value && e3.activationTrigger.value !== 0 && nextTick(() => {
      var r2, x3;
      return (x3 = (r2 = o$2(d4)) == null ? void 0 : r2.scrollIntoView) == null ? void 0 : x3.call(r2, { block: "nearest" });
    });
  });
  function T3(r2) {
    if (t3.disabled)
      return r2.preventDefault();
    e3.select(t3.value), e3.mode.value === 0 && (e3.closeListbox(), nextTick(() => {
      var x3;
      return (x3 = o$2(e3.buttonRef)) == null ? void 0 : x3.focus({ preventScroll: true });
    }));
  }
  function k2() {
    if (t3.disabled)
      return e3.goToOption(a$2.Nothing);
    e3.goToOption(a$2.Specific, t3.id);
  }
  let y4 = u2();
  function h4(r2) {
    y4.update(r2);
  }
  function M3(r2) {
    y4.wasMoved(r2) && (t3.disabled || b3.value || e3.goToOption(a$2.Specific, t3.id, 0));
  }
  function w3(r2) {
    y4.wasMoved(r2) && (t3.disabled || b3.value && e3.goToOption(a$2.Nothing));
  }
  return () => {
    let { disabled: r2 } = t3, x3 = { active: b3.value, selected: m4.value, disabled: r2 }, { id: a4, value: n2, disabled: u3, ...s4 } = t3, O3 = { id: a4, ref: d4, role: "option", tabIndex: r2 === true ? void 0 : -1, "aria-disabled": r2 === true ? true : void 0, "aria-selected": m4.value, disabled: void 0, onClick: T3, onFocus: k2, onPointerenter: h4, onMouseenter: h4, onPointermove: M3, onMousemove: M3, onPointerleave: w3, onMouseleave: w3 };
    return H3({ ourProps: O3, theirProps: s4, slot: x3, attrs: l2, slots: v2, name: "ListboxOption" });
  };
} });
function render$3(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    "aria-hidden": "true"
  }, [
    createBaseVNode("path", {
      "fill-rule": "evenodd",
      d: "M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z",
      "clip-rule": "evenodd"
    })
  ]);
}
function render$2(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    "aria-hidden": "true"
  }, [
    createBaseVNode("path", {
      "fill-rule": "evenodd",
      d: "M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z",
      "clip-rule": "evenodd"
    })
  ]);
}
function render$1(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    "aria-hidden": "true"
  }, [
    createBaseVNode("path", {
      "fill-rule": "evenodd",
      d: "M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z",
      "clip-rule": "evenodd"
    })
  ]);
}
const _hoisted_1$6 = { class: "relative mt-1" };
const _hoisted_2$6 = { class: "block truncate" };
const _hoisted_3$6 = { class: "text-slate-500" };
const _hoisted_4$5 = { key: 0 };
const _hoisted_5$3 = {
  key: 0,
  class: "font-medium text-slate-800"
};
const _hoisted_6$3 = { class: "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2" };
const _hoisted_7$3 = {
  key: 0,
  class: "absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
};
const _sfc_main$6 = {
  __name: "configBar",
  props: {
    reports: Array,
    report: {
      type: Number,
      default: 0
    },
    config: {
      type: Object,
      default: {}
    },
    query: {
      type: Object,
      default: {}
    },
    groupings: {
      type: Array,
      default: [
        {
          label: "- None -",
          value: null
        },
        {
          label: "State",
          value: "state"
        },
        {
          label: "Status",
          value: "status"
        },
        // {
        //   label: "Title",
        //   value: "title",
        // },
        {
          label: "Assigned",
          value: "user_id"
        }
      ]
    }
  },
  emits: ["filter", "query"],
  setup(__props, { emit }) {
    const props = __props;
    var formContainer = ref(null);
    const group_by = ref(props.groupings[0]);
    onMounted(() => {
      $g.collections.add("_states", []);
      debugger;
      const filter = new gform(
        {
          // name: get().config.resource.id,
          actions: [],
          data: props.query,
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
                      value: ""
                    },
                    {
                      label: "Open",
                      value: "open"
                    },
                    {
                      label: "New",
                      value: "new",
                      visible: false
                    },
                    {
                      label: "Closed",
                      value: "closed"
                    }
                  ]
                }
              ],
              parse: [{ type: "not_matches", value: "" }]
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
                      value: "state"
                    },
                    {
                      label: "Status",
                      value: "status"
                    },
                    // {
                    //   label: "Title",
                    //   value: "title",
                    // },
                    {
                      label: "Assigned",
                      value: "user_id"
                    }
                  ]
                }
              ]
              // parse: [{ type: "requires" }],
            },
            {
              // type: "select",
              type: "radio",
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
                      value: "created_at"
                    },
                    {
                      label: "Updated At",
                      value: "updated_at"
                    },
                    {
                      label: "Submitted At",
                      value: "opened_at"
                    },
                    {
                      label: "State",
                      value: "state"
                    },
                    {
                      label: "Status",
                      value: "status"
                    },
                    {
                      label: "Title",
                      value: "title"
                    },
                    {
                      label: "Assigned",
                      value: "user_id"
                    }
                  ]
                }
              ]
              // parse: [{ type: "requires" }],
            },
            {
              type: "radio",
              multiple: true,
              // hideLabel: true,
              // parse: false,
              parse: [{ type: "requires" }],
              label: "State",
              options: [
                {
                  type: "optgroup",
                  // path: get().config.resource.id + "_states",
                  path: "_states"
                }
              ]
            },
            {
              type: "date_range",
              label: "Created",
              name: "created_at",
              search: "created_at",
              key: "created_at",
              parse: false
            },
            {
              type: "date_range",
              label: "Updated",
              name: "updated_at",
              search: "updated_at",
              key: "updated_at",
              parse: false
            }
          ]
        },
        formContainer.value
      );
      _.each(["created_at", "updated_at"], (field) => {
        filter.find(field).set([
          {
            search: [
              {
                raw: "[" + (props.query[field] || "").split(",").join(" - ") + "]"
              }
            ]
          }
        ]);
      });
      filter.on("input", ({ form }) => {
        const filters = _.reduce(
          form.filter({ type: "filter" }),
          (result, { name, value }) => {
            _.each(value, (item) => {
              result.push({
                name,
                invert: item.invert,
                search: _.map(item.search, "raw")
              });
            });
            return result;
          },
          []
        );
        _.reduce(
          _.map(form.filter({ type: "date_range" }), (field) => ({
            name: field.name,
            value: field.get()
          })),
          (result, { name, value }) => {
            _.each(value, (item) => {
              result.push({
                name,
                invert: item.invert,
                search: _.map(item.search, ({ raw }) => {
                  return _.trim(raw, ["]", "["]).split(" - ");
                })
              });
            });
            return result;
          },
          filters
        );
        const queryObj = _.reduce(
          filters,
          (result, { name, invert, search }) => {
            result[name] = result[name] ? result[name] + "," : "";
            result[name] += (invert ? "!" : "") + search.join(invert ? ",!" : ",");
            return result;
          },
          form.toJSON()
        );
        emit("query", queryObj);
        return;
      });
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", null, [
        createVNode(unref(Be$1), {
          modelValue: group_by.value,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => group_by.value = $event),
          class: "m-4"
        }, {
          default: withCtx(() => [
            createBaseVNode("div", _hoisted_1$6, [
              createVNode(unref(Ne), { class: "relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm" }, {
                default: withCtx(() => [
                  createBaseVNode("span", _hoisted_2$6, [
                    createBaseVNode("span", _hoisted_3$6, [
                      createTextVNode("Group "),
                      group_by.value.value != null ? (openBlock(), createElementBlock("span", _hoisted_4$5, "By")) : createCommentVNode("", true)
                    ]),
                    group_by.value.value != null ? (openBlock(), createElementBlock("span", _hoisted_5$3, " " + toDisplayString(group_by.value.label), 1)) : createCommentVNode("", true)
                  ]),
                  createBaseVNode("span", _hoisted_6$3, [
                    createVNode(unref(render$2), {
                      class: "h-5 w-5 text-gray-400",
                      "aria-hidden": "true"
                    })
                  ])
                ]),
                _: 1
              }),
              createVNode(Transition, {
                "leave-active-class": "transition duration-100 ease-in",
                "leave-from-class": "opacity-100",
                "leave-to-class": "opacity-0"
              }, {
                default: withCtx(() => [
                  createVNode(unref(He), { class: "absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm" }, {
                    default: withCtx(() => [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(__props.groupings, (group) => {
                        return openBlock(), createBlock(unref(Ue), {
                          key: group.value,
                          value: group,
                          as: "template"
                        }, {
                          default: withCtx(({ active, selected }) => [
                            createBaseVNode("li", {
                              class: normalizeClass([
                                active ? "bg-amber-100 text-amber-900" : "text-gray-900",
                                "relative cursor-default select-none py-2 pl-10 pr-4"
                              ])
                            }, [
                              createBaseVNode("span", {
                                class: normalizeClass([
                                  selected ? "font-medium" : "font-normal",
                                  "block truncate"
                                ])
                              }, toDisplayString(group.label), 3),
                              selected ? (openBlock(), createElementBlock("span", _hoisted_7$3, [
                                createVNode(unref(render$4), {
                                  class: "h-5 w-5",
                                  "aria-hidden": "true"
                                })
                              ])) : createCommentVNode("", true)
                            ], 2)
                          ]),
                          _: 2
                        }, 1032, ["value"]);
                      }), 128))
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ])
          ]),
          _: 1
        }, 8, ["modelValue"]),
        createBaseVNode("div", {
          ref_key: "formContainer",
          ref: formContainer,
          class: "py-2 px-4 flex flex-col gap-2 mb-2"
        }, null, 512)
      ]);
    };
  }
};
const matchIconName = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const stringToIcon = (value, validate, allowSimpleName, provider = "") => {
  const colonSeparated = value.split(":");
  if (value.slice(0, 1) === "@") {
    if (colonSeparated.length < 2 || colonSeparated.length > 3) {
      return null;
    }
    provider = colonSeparated.shift().slice(1);
  }
  if (colonSeparated.length > 3 || !colonSeparated.length) {
    return null;
  }
  if (colonSeparated.length > 1) {
    const name2 = colonSeparated.pop();
    const prefix = colonSeparated.pop();
    const result = {
      // Allow provider without '@': "provider:prefix:name"
      provider: colonSeparated.length > 0 ? colonSeparated[0] : provider,
      prefix,
      name: name2
    };
    return validate && !validateIconName(result) ? null : result;
  }
  const name = colonSeparated[0];
  const dashSeparated = name.split("-");
  if (dashSeparated.length > 1) {
    const result = {
      provider,
      prefix: dashSeparated.shift(),
      name: dashSeparated.join("-")
    };
    return validate && !validateIconName(result) ? null : result;
  }
  if (allowSimpleName && provider === "") {
    const result = {
      provider,
      prefix: "",
      name
    };
    return validate && !validateIconName(result, allowSimpleName) ? null : result;
  }
  return null;
};
const validateIconName = (icon, allowSimpleName) => {
  if (!icon) {
    return false;
  }
  return !!((icon.provider === "" || icon.provider.match(matchIconName)) && (allowSimpleName && icon.prefix === "" || icon.prefix.match(matchIconName)) && icon.name.match(matchIconName));
};
const defaultIconDimensions = Object.freeze(
  {
    left: 0,
    top: 0,
    width: 16,
    height: 16
  }
);
const defaultIconTransformations = Object.freeze({
  rotate: 0,
  vFlip: false,
  hFlip: false
});
const defaultIconProps = Object.freeze({
  ...defaultIconDimensions,
  ...defaultIconTransformations
});
const defaultExtendedIconProps = Object.freeze({
  ...defaultIconProps,
  body: "",
  hidden: false
});
function mergeIconTransformations(obj1, obj2) {
  const result = {};
  if (!obj1.hFlip !== !obj2.hFlip) {
    result.hFlip = true;
  }
  if (!obj1.vFlip !== !obj2.vFlip) {
    result.vFlip = true;
  }
  const rotate = ((obj1.rotate || 0) + (obj2.rotate || 0)) % 4;
  if (rotate) {
    result.rotate = rotate;
  }
  return result;
}
function mergeIconData(parent, child) {
  const result = mergeIconTransformations(parent, child);
  for (const key in defaultExtendedIconProps) {
    if (key in defaultIconTransformations) {
      if (key in parent && !(key in result)) {
        result[key] = defaultIconTransformations[key];
      }
    } else if (key in child) {
      result[key] = child[key];
    } else if (key in parent) {
      result[key] = parent[key];
    }
  }
  return result;
}
function getIconsTree(data, names) {
  const icons = data.icons;
  const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
  const resolved = /* @__PURE__ */ Object.create(null);
  function resolve(name) {
    if (icons[name]) {
      return resolved[name] = [];
    }
    if (!(name in resolved)) {
      resolved[name] = null;
      const parent = aliases[name] && aliases[name].parent;
      const value = parent && resolve(parent);
      if (value) {
        resolved[name] = [parent].concat(value);
      }
    }
    return resolved[name];
  }
  (names || Object.keys(icons).concat(Object.keys(aliases))).forEach(resolve);
  return resolved;
}
function internalGetIconData(data, name, tree) {
  const icons = data.icons;
  const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
  let currentProps = {};
  function parse2(name2) {
    currentProps = mergeIconData(
      icons[name2] || aliases[name2],
      currentProps
    );
  }
  parse2(name);
  tree.forEach(parse2);
  return mergeIconData(data, currentProps);
}
function parseIconSet(data, callback) {
  const names = [];
  if (typeof data !== "object" || typeof data.icons !== "object") {
    return names;
  }
  if (data.not_found instanceof Array) {
    data.not_found.forEach((name) => {
      callback(name, null);
      names.push(name);
    });
  }
  const tree = getIconsTree(data);
  for (const name in tree) {
    const item = tree[name];
    if (item) {
      callback(name, internalGetIconData(data, name, item));
      names.push(name);
    }
  }
  return names;
}
const optionalPropertyDefaults = {
  provider: "",
  aliases: {},
  not_found: {},
  ...defaultIconDimensions
};
function checkOptionalProps(item, defaults) {
  for (const prop in defaults) {
    if (prop in item && typeof item[prop] !== typeof defaults[prop]) {
      return false;
    }
  }
  return true;
}
function quicklyValidateIconSet(obj) {
  if (typeof obj !== "object" || obj === null) {
    return null;
  }
  const data = obj;
  if (typeof data.prefix !== "string" || !obj.icons || typeof obj.icons !== "object") {
    return null;
  }
  if (!checkOptionalProps(obj, optionalPropertyDefaults)) {
    return null;
  }
  const icons = data.icons;
  for (const name in icons) {
    const icon = icons[name];
    if (!name.match(matchIconName) || typeof icon.body !== "string" || !checkOptionalProps(
      icon,
      defaultExtendedIconProps
    )) {
      return null;
    }
  }
  const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
  for (const name in aliases) {
    const icon = aliases[name];
    const parent = icon.parent;
    if (!name.match(matchIconName) || typeof parent !== "string" || !icons[parent] && !aliases[parent] || !checkOptionalProps(
      icon,
      defaultExtendedIconProps
    )) {
      return null;
    }
  }
  return data;
}
const dataStorage = /* @__PURE__ */ Object.create(null);
function newStorage(provider, prefix) {
  return {
    provider,
    prefix,
    icons: /* @__PURE__ */ Object.create(null),
    missing: /* @__PURE__ */ new Set()
  };
}
function getStorage(provider, prefix) {
  const providerStorage = dataStorage[provider] || (dataStorage[provider] = /* @__PURE__ */ Object.create(null));
  return providerStorage[prefix] || (providerStorage[prefix] = newStorage(provider, prefix));
}
function addIconSet(storage2, data) {
  if (!quicklyValidateIconSet(data)) {
    return [];
  }
  return parseIconSet(data, (name, icon) => {
    if (icon) {
      storage2.icons[name] = icon;
    } else {
      storage2.missing.add(name);
    }
  });
}
function addIconToStorage(storage2, name, icon) {
  try {
    if (typeof icon.body === "string") {
      storage2.icons[name] = { ...icon };
      return true;
    }
  } catch (err) {
  }
  return false;
}
let simpleNames = false;
function allowSimpleNames(allow) {
  if (typeof allow === "boolean") {
    simpleNames = allow;
  }
  return simpleNames;
}
function getIconData(name) {
  const icon = typeof name === "string" ? stringToIcon(name, true, simpleNames) : name;
  if (icon) {
    const storage2 = getStorage(icon.provider, icon.prefix);
    const iconName = icon.name;
    return storage2.icons[iconName] || (storage2.missing.has(iconName) ? null : void 0);
  }
}
function addIcon(name, data) {
  const icon = stringToIcon(name, true, simpleNames);
  if (!icon) {
    return false;
  }
  const storage2 = getStorage(icon.provider, icon.prefix);
  return addIconToStorage(storage2, icon.name, data);
}
function addCollection(data, provider) {
  if (typeof data !== "object") {
    return false;
  }
  if (typeof provider !== "string") {
    provider = data.provider || "";
  }
  if (simpleNames && !provider && !data.prefix) {
    let added = false;
    if (quicklyValidateIconSet(data)) {
      data.prefix = "";
      parseIconSet(data, (name, icon) => {
        if (icon && addIcon(name, icon)) {
          added = true;
        }
      });
    }
    return added;
  }
  const prefix = data.prefix;
  if (!validateIconName({
    provider,
    prefix,
    name: "a"
  })) {
    return false;
  }
  const storage2 = getStorage(provider, prefix);
  return !!addIconSet(storage2, data);
}
const defaultIconSizeCustomisations = Object.freeze({
  width: null,
  height: null
});
const defaultIconCustomisations = Object.freeze({
  // Dimensions
  ...defaultIconSizeCustomisations,
  // Transformations
  ...defaultIconTransformations
});
const unitsSplit = /(-?[0-9.]*[0-9]+[0-9.]*)/g;
const unitsTest = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
function calculateSize(size, ratio, precision) {
  if (ratio === 1) {
    return size;
  }
  precision = precision || 100;
  if (typeof size === "number") {
    return Math.ceil(size * ratio * precision) / precision;
  }
  if (typeof size !== "string") {
    return size;
  }
  const oldParts = size.split(unitsSplit);
  if (oldParts === null || !oldParts.length) {
    return size;
  }
  const newParts = [];
  let code = oldParts.shift();
  let isNumber = unitsTest.test(code);
  while (true) {
    if (isNumber) {
      const num = parseFloat(code);
      if (isNaN(num)) {
        newParts.push(code);
      } else {
        newParts.push(Math.ceil(num * ratio * precision) / precision);
      }
    } else {
      newParts.push(code);
    }
    code = oldParts.shift();
    if (code === void 0) {
      return newParts.join("");
    }
    isNumber = !isNumber;
  }
}
const isUnsetKeyword = (value) => value === "unset" || value === "undefined" || value === "none";
function iconToSVG(icon, customisations) {
  const fullIcon = {
    ...defaultIconProps,
    ...icon
  };
  const fullCustomisations = {
    ...defaultIconCustomisations,
    ...customisations
  };
  const box = {
    left: fullIcon.left,
    top: fullIcon.top,
    width: fullIcon.width,
    height: fullIcon.height
  };
  let body = fullIcon.body;
  [fullIcon, fullCustomisations].forEach((props) => {
    const transformations = [];
    const hFlip = props.hFlip;
    const vFlip = props.vFlip;
    let rotation = props.rotate;
    if (hFlip) {
      if (vFlip) {
        rotation += 2;
      } else {
        transformations.push(
          "translate(" + (box.width + box.left).toString() + " " + (0 - box.top).toString() + ")"
        );
        transformations.push("scale(-1 1)");
        box.top = box.left = 0;
      }
    } else if (vFlip) {
      transformations.push(
        "translate(" + (0 - box.left).toString() + " " + (box.height + box.top).toString() + ")"
      );
      transformations.push("scale(1 -1)");
      box.top = box.left = 0;
    }
    let tempValue;
    if (rotation < 0) {
      rotation -= Math.floor(rotation / 4) * 4;
    }
    rotation = rotation % 4;
    switch (rotation) {
      case 1:
        tempValue = box.height / 2 + box.top;
        transformations.unshift(
          "rotate(90 " + tempValue.toString() + " " + tempValue.toString() + ")"
        );
        break;
      case 2:
        transformations.unshift(
          "rotate(180 " + (box.width / 2 + box.left).toString() + " " + (box.height / 2 + box.top).toString() + ")"
        );
        break;
      case 3:
        tempValue = box.width / 2 + box.left;
        transformations.unshift(
          "rotate(-90 " + tempValue.toString() + " " + tempValue.toString() + ")"
        );
        break;
    }
    if (rotation % 2 === 1) {
      if (box.left !== box.top) {
        tempValue = box.left;
        box.left = box.top;
        box.top = tempValue;
      }
      if (box.width !== box.height) {
        tempValue = box.width;
        box.width = box.height;
        box.height = tempValue;
      }
    }
    if (transformations.length) {
      body = '<g transform="' + transformations.join(" ") + '">' + body + "</g>";
    }
  });
  const customisationsWidth = fullCustomisations.width;
  const customisationsHeight = fullCustomisations.height;
  const boxWidth = box.width;
  const boxHeight = box.height;
  let width;
  let height;
  if (customisationsWidth === null) {
    height = customisationsHeight === null ? "1em" : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
    width = calculateSize(height, boxWidth / boxHeight);
  } else {
    width = customisationsWidth === "auto" ? boxWidth : customisationsWidth;
    height = customisationsHeight === null ? calculateSize(width, boxHeight / boxWidth) : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
  }
  const attributes = {};
  const setAttr = (prop, value) => {
    if (!isUnsetKeyword(value)) {
      attributes[prop] = value.toString();
    }
  };
  setAttr("width", width);
  setAttr("height", height);
  attributes.viewBox = box.left.toString() + " " + box.top.toString() + " " + boxWidth.toString() + " " + boxHeight.toString();
  return {
    attributes,
    body
  };
}
const regex = /\sid="(\S+)"/g;
const randomPrefix = "IconifyId" + Date.now().toString(16) + (Math.random() * 16777216 | 0).toString(16);
let counter = 0;
function replaceIDs(body, prefix = randomPrefix) {
  const ids = [];
  let match2;
  while (match2 = regex.exec(body)) {
    ids.push(match2[1]);
  }
  if (!ids.length) {
    return body;
  }
  const suffix = "suffix" + (Math.random() * 16777216 | Date.now()).toString(16);
  ids.forEach((id2) => {
    const newID = typeof prefix === "function" ? prefix(id2) : prefix + (counter++).toString();
    const escapedID = id2.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    body = body.replace(
      // Allowed characters before id: [#;"]
      // Allowed characters after id: [)"], .[a-z]
      new RegExp('([#;"])(' + escapedID + ')([")]|\\.[a-z])', "g"),
      "$1" + newID + suffix + "$3"
    );
  });
  body = body.replace(new RegExp(suffix, "g"), "");
  return body;
}
const storage = /* @__PURE__ */ Object.create(null);
function setAPIModule(provider, item) {
  storage[provider] = item;
}
function getAPIModule(provider) {
  return storage[provider] || storage[""];
}
function createAPIConfig(source) {
  let resources;
  if (typeof source.resources === "string") {
    resources = [source.resources];
  } else {
    resources = source.resources;
    if (!(resources instanceof Array) || !resources.length) {
      return null;
    }
  }
  const result = {
    // API hosts
    resources,
    // Root path
    path: source.path || "/",
    // URL length limit
    maxURL: source.maxURL || 500,
    // Timeout before next host is used.
    rotate: source.rotate || 750,
    // Timeout before failing query.
    timeout: source.timeout || 5e3,
    // Randomise default API end point.
    random: source.random === true,
    // Start index
    index: source.index || 0,
    // Receive data after time out (used if time out kicks in first, then API module sends data anyway).
    dataAfterTimeout: source.dataAfterTimeout !== false
  };
  return result;
}
const configStorage = /* @__PURE__ */ Object.create(null);
const fallBackAPISources = [
  "https://api.simplesvg.com",
  "https://api.unisvg.com"
];
const fallBackAPI = [];
while (fallBackAPISources.length > 0) {
  if (fallBackAPISources.length === 1) {
    fallBackAPI.push(fallBackAPISources.shift());
  } else {
    if (Math.random() > 0.5) {
      fallBackAPI.push(fallBackAPISources.shift());
    } else {
      fallBackAPI.push(fallBackAPISources.pop());
    }
  }
}
configStorage[""] = createAPIConfig({
  resources: ["https://api.iconify.design"].concat(fallBackAPI)
});
function addAPIProvider(provider, customConfig) {
  const config = createAPIConfig(customConfig);
  if (config === null) {
    return false;
  }
  configStorage[provider] = config;
  return true;
}
function getAPIConfig(provider) {
  return configStorage[provider];
}
const detectFetch = () => {
  let callback;
  try {
    callback = fetch;
    if (typeof callback === "function") {
      return callback;
    }
  } catch (err) {
  }
};
let fetchModule = detectFetch();
function calculateMaxLength(provider, prefix) {
  const config = getAPIConfig(provider);
  if (!config) {
    return 0;
  }
  let result;
  if (!config.maxURL) {
    result = 0;
  } else {
    let maxHostLength = 0;
    config.resources.forEach((item) => {
      const host = item;
      maxHostLength = Math.max(maxHostLength, host.length);
    });
    const url = prefix + ".json?icons=";
    result = config.maxURL - maxHostLength - config.path.length - url.length;
  }
  return result;
}
function shouldAbort(status) {
  return status === 404;
}
const prepare = (provider, prefix, icons) => {
  const results = [];
  const maxLength = calculateMaxLength(provider, prefix);
  const type = "icons";
  let item = {
    type,
    provider,
    prefix,
    icons: []
  };
  let length = 0;
  icons.forEach((name, index) => {
    length += name.length + 1;
    if (length >= maxLength && index > 0) {
      results.push(item);
      item = {
        type,
        provider,
        prefix,
        icons: []
      };
      length = name.length;
    }
    item.icons.push(name);
  });
  results.push(item);
  return results;
};
function getPath(provider) {
  if (typeof provider === "string") {
    const config = getAPIConfig(provider);
    if (config) {
      return config.path;
    }
  }
  return "/";
}
const send = (host, params, callback) => {
  if (!fetchModule) {
    callback("abort", 424);
    return;
  }
  let path = getPath(params.provider);
  switch (params.type) {
    case "icons": {
      const prefix = params.prefix;
      const icons = params.icons;
      const iconsList = icons.join(",");
      const urlParams = new URLSearchParams({
        icons: iconsList
      });
      path += prefix + ".json?" + urlParams.toString();
      break;
    }
    case "custom": {
      const uri = params.uri;
      path += uri.slice(0, 1) === "/" ? uri.slice(1) : uri;
      break;
    }
    default:
      callback("abort", 400);
      return;
  }
  let defaultError = 503;
  fetchModule(host + path).then((response) => {
    const status = response.status;
    if (status !== 200) {
      setTimeout(() => {
        callback(shouldAbort(status) ? "abort" : "next", status);
      });
      return;
    }
    defaultError = 501;
    return response.json();
  }).then((data) => {
    if (typeof data !== "object" || data === null) {
      setTimeout(() => {
        if (data === 404) {
          callback("abort", data);
        } else {
          callback("next", defaultError);
        }
      });
      return;
    }
    setTimeout(() => {
      callback("success", data);
    });
  }).catch(() => {
    callback("next", defaultError);
  });
};
const fetchAPIModule = {
  prepare,
  send
};
function sortIcons(icons) {
  const result = {
    loaded: [],
    missing: [],
    pending: []
  };
  const storage2 = /* @__PURE__ */ Object.create(null);
  icons.sort((a4, b3) => {
    if (a4.provider !== b3.provider) {
      return a4.provider.localeCompare(b3.provider);
    }
    if (a4.prefix !== b3.prefix) {
      return a4.prefix.localeCompare(b3.prefix);
    }
    return a4.name.localeCompare(b3.name);
  });
  let lastIcon = {
    provider: "",
    prefix: "",
    name: ""
  };
  icons.forEach((icon) => {
    if (lastIcon.name === icon.name && lastIcon.prefix === icon.prefix && lastIcon.provider === icon.provider) {
      return;
    }
    lastIcon = icon;
    const provider = icon.provider;
    const prefix = icon.prefix;
    const name = icon.name;
    const providerStorage = storage2[provider] || (storage2[provider] = /* @__PURE__ */ Object.create(null));
    const localStorage = providerStorage[prefix] || (providerStorage[prefix] = getStorage(provider, prefix));
    let list;
    if (name in localStorage.icons) {
      list = result.loaded;
    } else if (prefix === "" || localStorage.missing.has(name)) {
      list = result.missing;
    } else {
      list = result.pending;
    }
    const item = {
      provider,
      prefix,
      name
    };
    list.push(item);
  });
  return result;
}
function removeCallback(storages, id2) {
  storages.forEach((storage2) => {
    const items = storage2.loaderCallbacks;
    if (items) {
      storage2.loaderCallbacks = items.filter((row) => row.id !== id2);
    }
  });
}
function updateCallbacks(storage2) {
  if (!storage2.pendingCallbacksFlag) {
    storage2.pendingCallbacksFlag = true;
    setTimeout(() => {
      storage2.pendingCallbacksFlag = false;
      const items = storage2.loaderCallbacks ? storage2.loaderCallbacks.slice(0) : [];
      if (!items.length) {
        return;
      }
      let hasPending = false;
      const provider = storage2.provider;
      const prefix = storage2.prefix;
      items.forEach((item) => {
        const icons = item.icons;
        const oldLength = icons.pending.length;
        icons.pending = icons.pending.filter((icon) => {
          if (icon.prefix !== prefix) {
            return true;
          }
          const name = icon.name;
          if (storage2.icons[name]) {
            icons.loaded.push({
              provider,
              prefix,
              name
            });
          } else if (storage2.missing.has(name)) {
            icons.missing.push({
              provider,
              prefix,
              name
            });
          } else {
            hasPending = true;
            return true;
          }
          return false;
        });
        if (icons.pending.length !== oldLength) {
          if (!hasPending) {
            removeCallback([storage2], item.id);
          }
          item.callback(
            icons.loaded.slice(0),
            icons.missing.slice(0),
            icons.pending.slice(0),
            item.abort
          );
        }
      });
    });
  }
}
let idCounter = 0;
function storeCallback(callback, icons, pendingSources) {
  const id2 = idCounter++;
  const abort = removeCallback.bind(null, pendingSources, id2);
  if (!icons.pending.length) {
    return abort;
  }
  const item = {
    id: id2,
    icons,
    callback,
    abort
  };
  pendingSources.forEach((storage2) => {
    (storage2.loaderCallbacks || (storage2.loaderCallbacks = [])).push(item);
  });
  return abort;
}
function listToIcons(list, validate = true, simpleNames2 = false) {
  const result = [];
  list.forEach((item) => {
    const icon = typeof item === "string" ? stringToIcon(item, validate, simpleNames2) : item;
    if (icon) {
      result.push(icon);
    }
  });
  return result;
}
var defaultConfig = {
  resources: [],
  index: 0,
  timeout: 2e3,
  rotate: 750,
  random: false,
  dataAfterTimeout: false
};
function sendQuery(config, payload, query, done) {
  const resourcesCount = config.resources.length;
  const startIndex = config.random ? Math.floor(Math.random() * resourcesCount) : config.index;
  let resources;
  if (config.random) {
    let list = config.resources.slice(0);
    resources = [];
    while (list.length > 1) {
      const nextIndex = Math.floor(Math.random() * list.length);
      resources.push(list[nextIndex]);
      list = list.slice(0, nextIndex).concat(list.slice(nextIndex + 1));
    }
    resources = resources.concat(list);
  } else {
    resources = config.resources.slice(startIndex).concat(config.resources.slice(0, startIndex));
  }
  const startTime = Date.now();
  let status = "pending";
  let queriesSent = 0;
  let lastError;
  let timer = null;
  let queue = [];
  let doneCallbacks = [];
  if (typeof done === "function") {
    doneCallbacks.push(done);
  }
  function resetTimer() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }
  function abort() {
    if (status === "pending") {
      status = "aborted";
    }
    resetTimer();
    queue.forEach((item) => {
      if (item.status === "pending") {
        item.status = "aborted";
      }
    });
    queue = [];
  }
  function subscribe(callback, overwrite) {
    if (overwrite) {
      doneCallbacks = [];
    }
    if (typeof callback === "function") {
      doneCallbacks.push(callback);
    }
  }
  function getQueryStatus() {
    return {
      startTime,
      payload,
      status,
      queriesSent,
      queriesPending: queue.length,
      subscribe,
      abort
    };
  }
  function failQuery() {
    status = "failed";
    doneCallbacks.forEach((callback) => {
      callback(void 0, lastError);
    });
  }
  function clearQueue() {
    queue.forEach((item) => {
      if (item.status === "pending") {
        item.status = "aborted";
      }
    });
    queue = [];
  }
  function moduleResponse(item, response, data) {
    const isError = response !== "success";
    queue = queue.filter((queued) => queued !== item);
    switch (status) {
      case "pending":
        break;
      case "failed":
        if (isError || !config.dataAfterTimeout) {
          return;
        }
        break;
      default:
        return;
    }
    if (response === "abort") {
      lastError = data;
      failQuery();
      return;
    }
    if (isError) {
      lastError = data;
      if (!queue.length) {
        if (!resources.length) {
          failQuery();
        } else {
          execNext();
        }
      }
      return;
    }
    resetTimer();
    clearQueue();
    if (!config.random) {
      const index = config.resources.indexOf(item.resource);
      if (index !== -1 && index !== config.index) {
        config.index = index;
      }
    }
    status = "completed";
    doneCallbacks.forEach((callback) => {
      callback(data);
    });
  }
  function execNext() {
    if (status !== "pending") {
      return;
    }
    resetTimer();
    const resource = resources.shift();
    if (resource === void 0) {
      if (queue.length) {
        timer = setTimeout(() => {
          resetTimer();
          if (status === "pending") {
            clearQueue();
            failQuery();
          }
        }, config.timeout);
        return;
      }
      failQuery();
      return;
    }
    const item = {
      status: "pending",
      resource,
      callback: (status2, data) => {
        moduleResponse(item, status2, data);
      }
    };
    queue.push(item);
    queriesSent++;
    timer = setTimeout(execNext, config.rotate);
    query(resource, payload, item.callback);
  }
  setTimeout(execNext);
  return getQueryStatus;
}
function initRedundancy(cfg) {
  const config = {
    ...defaultConfig,
    ...cfg
  };
  let queries = [];
  function cleanup() {
    queries = queries.filter((item) => item().status === "pending");
  }
  function query(payload, queryCallback, doneCallback) {
    const query2 = sendQuery(
      config,
      payload,
      queryCallback,
      (data, error) => {
        cleanup();
        if (doneCallback) {
          doneCallback(data, error);
        }
      }
    );
    queries.push(query2);
    return query2;
  }
  function find(callback) {
    return queries.find((value) => {
      return callback(value);
    }) || null;
  }
  const instance = {
    query,
    find,
    setIndex: (index) => {
      config.index = index;
    },
    getIndex: () => config.index,
    cleanup
  };
  return instance;
}
function emptyCallback$1() {
}
const redundancyCache = /* @__PURE__ */ Object.create(null);
function getRedundancyCache(provider) {
  if (!redundancyCache[provider]) {
    const config = getAPIConfig(provider);
    if (!config) {
      return;
    }
    const redundancy = initRedundancy(config);
    const cachedReundancy = {
      config,
      redundancy
    };
    redundancyCache[provider] = cachedReundancy;
  }
  return redundancyCache[provider];
}
function sendAPIQuery(target, query, callback) {
  let redundancy;
  let send2;
  if (typeof target === "string") {
    const api = getAPIModule(target);
    if (!api) {
      callback(void 0, 424);
      return emptyCallback$1;
    }
    send2 = api.send;
    const cached = getRedundancyCache(target);
    if (cached) {
      redundancy = cached.redundancy;
    }
  } else {
    const config = createAPIConfig(target);
    if (config) {
      redundancy = initRedundancy(config);
      const moduleKey = target.resources ? target.resources[0] : "";
      const api = getAPIModule(moduleKey);
      if (api) {
        send2 = api.send;
      }
    }
  }
  if (!redundancy || !send2) {
    callback(void 0, 424);
    return emptyCallback$1;
  }
  return redundancy.query(query, send2, callback)().abort;
}
const browserCacheVersion = "iconify2";
const browserCachePrefix = "iconify";
const browserCacheCountKey = browserCachePrefix + "-count";
const browserCacheVersionKey = browserCachePrefix + "-version";
const browserStorageHour = 36e5;
const browserStorageCacheExpiration = 168;
function getStoredItem(func, key) {
  try {
    return func.getItem(key);
  } catch (err) {
  }
}
function setStoredItem(func, key, value) {
  try {
    func.setItem(key, value);
    return true;
  } catch (err) {
  }
}
function removeStoredItem(func, key) {
  try {
    func.removeItem(key);
  } catch (err) {
  }
}
function setBrowserStorageItemsCount(storage2, value) {
  return setStoredItem(storage2, browserCacheCountKey, value.toString());
}
function getBrowserStorageItemsCount(storage2) {
  return parseInt(getStoredItem(storage2, browserCacheCountKey)) || 0;
}
const browserStorageConfig = {
  local: true,
  session: true
};
const browserStorageEmptyItems = {
  local: /* @__PURE__ */ new Set(),
  session: /* @__PURE__ */ new Set()
};
let browserStorageStatus = false;
function setBrowserStorageStatus(status) {
  browserStorageStatus = status;
}
let _window = typeof window === "undefined" ? {} : window;
function getBrowserStorage(key) {
  const attr = key + "Storage";
  try {
    if (_window && _window[attr] && typeof _window[attr].length === "number") {
      return _window[attr];
    }
  } catch (err) {
  }
  browserStorageConfig[key] = false;
}
function iterateBrowserStorage(key, callback) {
  const func = getBrowserStorage(key);
  if (!func) {
    return;
  }
  const version = getStoredItem(func, browserCacheVersionKey);
  if (version !== browserCacheVersion) {
    if (version) {
      const total2 = getBrowserStorageItemsCount(func);
      for (let i3 = 0; i3 < total2; i3++) {
        removeStoredItem(func, browserCachePrefix + i3.toString());
      }
    }
    setStoredItem(func, browserCacheVersionKey, browserCacheVersion);
    setBrowserStorageItemsCount(func, 0);
    return;
  }
  const minTime = Math.floor(Date.now() / browserStorageHour) - browserStorageCacheExpiration;
  const parseItem = (index) => {
    const name = browserCachePrefix + index.toString();
    const item = getStoredItem(func, name);
    if (typeof item !== "string") {
      return;
    }
    try {
      const data = JSON.parse(item);
      if (typeof data === "object" && typeof data.cached === "number" && data.cached > minTime && typeof data.provider === "string" && typeof data.data === "object" && typeof data.data.prefix === "string" && // Valid item: run callback
      callback(data, index)) {
        return true;
      }
    } catch (err) {
    }
    removeStoredItem(func, name);
  };
  let total = getBrowserStorageItemsCount(func);
  for (let i3 = total - 1; i3 >= 0; i3--) {
    if (!parseItem(i3)) {
      if (i3 === total - 1) {
        total--;
        setBrowserStorageItemsCount(func, total);
      } else {
        browserStorageEmptyItems[key].add(i3);
      }
    }
  }
}
function initBrowserStorage() {
  if (browserStorageStatus) {
    return;
  }
  setBrowserStorageStatus(true);
  for (const key in browserStorageConfig) {
    iterateBrowserStorage(key, (item) => {
      const iconSet = item.data;
      const provider = item.provider;
      const prefix = iconSet.prefix;
      const storage2 = getStorage(
        provider,
        prefix
      );
      if (!addIconSet(storage2, iconSet).length) {
        return false;
      }
      const lastModified = iconSet.lastModified || -1;
      storage2.lastModifiedCached = storage2.lastModifiedCached ? Math.min(storage2.lastModifiedCached, lastModified) : lastModified;
      return true;
    });
  }
}
function updateLastModified(storage2, lastModified) {
  const lastValue = storage2.lastModifiedCached;
  if (
    // Matches or newer
    lastValue && lastValue >= lastModified
  ) {
    return lastValue === lastModified;
  }
  storage2.lastModifiedCached = lastModified;
  if (lastValue) {
    for (const key in browserStorageConfig) {
      iterateBrowserStorage(key, (item) => {
        const iconSet = item.data;
        return item.provider !== storage2.provider || iconSet.prefix !== storage2.prefix || iconSet.lastModified === lastModified;
      });
    }
  }
  return true;
}
function storeInBrowserStorage(storage2, data) {
  if (!browserStorageStatus) {
    initBrowserStorage();
  }
  function store(key) {
    let func;
    if (!browserStorageConfig[key] || !(func = getBrowserStorage(key))) {
      return;
    }
    const set = browserStorageEmptyItems[key];
    let index;
    if (set.size) {
      set.delete(index = Array.from(set).shift());
    } else {
      index = getBrowserStorageItemsCount(func);
      if (!setBrowserStorageItemsCount(func, index + 1)) {
        return;
      }
    }
    const item = {
      cached: Math.floor(Date.now() / browserStorageHour),
      provider: storage2.provider,
      data
    };
    return setStoredItem(
      func,
      browserCachePrefix + index.toString(),
      JSON.stringify(item)
    );
  }
  if (data.lastModified && !updateLastModified(storage2, data.lastModified)) {
    return;
  }
  if (!Object.keys(data.icons).length) {
    return;
  }
  if (data.not_found) {
    data = Object.assign({}, data);
    delete data.not_found;
  }
  if (!store("local")) {
    store("session");
  }
}
function emptyCallback() {
}
function loadedNewIcons(storage2) {
  if (!storage2.iconsLoaderFlag) {
    storage2.iconsLoaderFlag = true;
    setTimeout(() => {
      storage2.iconsLoaderFlag = false;
      updateCallbacks(storage2);
    });
  }
}
function loadNewIcons(storage2, icons) {
  if (!storage2.iconsToLoad) {
    storage2.iconsToLoad = icons;
  } else {
    storage2.iconsToLoad = storage2.iconsToLoad.concat(icons).sort();
  }
  if (!storage2.iconsQueueFlag) {
    storage2.iconsQueueFlag = true;
    setTimeout(() => {
      storage2.iconsQueueFlag = false;
      const { provider, prefix } = storage2;
      const icons2 = storage2.iconsToLoad;
      delete storage2.iconsToLoad;
      let api;
      if (!icons2 || !(api = getAPIModule(provider))) {
        return;
      }
      const params = api.prepare(provider, prefix, icons2);
      params.forEach((item) => {
        sendAPIQuery(provider, item, (data) => {
          if (typeof data !== "object") {
            item.icons.forEach((name) => {
              storage2.missing.add(name);
            });
          } else {
            try {
              const parsed = addIconSet(
                storage2,
                data
              );
              if (!parsed.length) {
                return;
              }
              const pending = storage2.pendingIcons;
              if (pending) {
                parsed.forEach((name) => {
                  pending.delete(name);
                });
              }
              storeInBrowserStorage(storage2, data);
            } catch (err) {
              console.error(err);
            }
          }
          loadedNewIcons(storage2);
        });
      });
    });
  }
}
const loadIcons = (icons, callback) => {
  const cleanedIcons = listToIcons(icons, true, allowSimpleNames());
  const sortedIcons = sortIcons(cleanedIcons);
  if (!sortedIcons.pending.length) {
    let callCallback = true;
    if (callback) {
      setTimeout(() => {
        if (callCallback) {
          callback(
            sortedIcons.loaded,
            sortedIcons.missing,
            sortedIcons.pending,
            emptyCallback
          );
        }
      });
    }
    return () => {
      callCallback = false;
    };
  }
  const newIcons = /* @__PURE__ */ Object.create(null);
  const sources = [];
  let lastProvider, lastPrefix;
  sortedIcons.pending.forEach((icon) => {
    const { provider, prefix } = icon;
    if (prefix === lastPrefix && provider === lastProvider) {
      return;
    }
    lastProvider = provider;
    lastPrefix = prefix;
    sources.push(getStorage(provider, prefix));
    const providerNewIcons = newIcons[provider] || (newIcons[provider] = /* @__PURE__ */ Object.create(null));
    if (!providerNewIcons[prefix]) {
      providerNewIcons[prefix] = [];
    }
  });
  sortedIcons.pending.forEach((icon) => {
    const { provider, prefix, name } = icon;
    const storage2 = getStorage(provider, prefix);
    const pendingQueue = storage2.pendingIcons || (storage2.pendingIcons = /* @__PURE__ */ new Set());
    if (!pendingQueue.has(name)) {
      pendingQueue.add(name);
      newIcons[provider][prefix].push(name);
    }
  });
  sources.forEach((storage2) => {
    const { provider, prefix } = storage2;
    if (newIcons[provider][prefix].length) {
      loadNewIcons(storage2, newIcons[provider][prefix]);
    }
  });
  return callback ? storeCallback(callback, sortedIcons, sources) : emptyCallback;
};
function mergeCustomisations(defaults, item) {
  const result = {
    ...defaults
  };
  for (const key in item) {
    const value = item[key];
    const valueType = typeof value;
    if (key in defaultIconSizeCustomisations) {
      if (value === null || value && (valueType === "string" || valueType === "number")) {
        result[key] = value;
      }
    } else if (valueType === typeof result[key]) {
      result[key] = key === "rotate" ? value % 4 : value;
    }
  }
  return result;
}
const separator = /[\s,]+/;
function flipFromString(custom, flip2) {
  flip2.split(separator).forEach((str) => {
    const value = str.trim();
    switch (value) {
      case "horizontal":
        custom.hFlip = true;
        break;
      case "vertical":
        custom.vFlip = true;
        break;
    }
  });
}
function rotateFromString(value, defaultValue = 0) {
  const units = value.replace(/^-?[0-9.]*/, "");
  function cleanup(value2) {
    while (value2 < 0) {
      value2 += 4;
    }
    return value2 % 4;
  }
  if (units === "") {
    const num = parseInt(value);
    return isNaN(num) ? 0 : cleanup(num);
  } else if (units !== value) {
    let split = 0;
    switch (units) {
      case "%":
        split = 25;
        break;
      case "deg":
        split = 90;
    }
    if (split) {
      let num = parseFloat(value.slice(0, value.length - units.length));
      if (isNaN(num)) {
        return 0;
      }
      num = num / split;
      return num % 1 === 0 ? cleanup(num) : 0;
    }
  }
  return defaultValue;
}
function iconToHTML(body, attributes) {
  let renderAttribsHTML = body.indexOf("xlink:") === -1 ? "" : ' xmlns:xlink="http://www.w3.org/1999/xlink"';
  for (const attr in attributes) {
    renderAttribsHTML += " " + attr + '="' + attributes[attr] + '"';
  }
  return '<svg xmlns="http://www.w3.org/2000/svg"' + renderAttribsHTML + ">" + body + "</svg>";
}
function encodeSVGforURL(svg) {
  return svg.replace(/"/g, "'").replace(/%/g, "%25").replace(/#/g, "%23").replace(/</g, "%3C").replace(/>/g, "%3E").replace(/\s+/g, " ");
}
function svgToData(svg) {
  return "data:image/svg+xml," + encodeSVGforURL(svg);
}
function svgToURL(svg) {
  return 'url("' + svgToData(svg) + '")';
}
const defaultExtendedIconCustomisations = {
  ...defaultIconCustomisations,
  inline: false
};
const svgDefaults = {
  "xmlns": "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  "aria-hidden": true,
  "role": "img"
};
const commonProps = {
  display: "inline-block"
};
const monotoneProps = {
  backgroundColor: "currentColor"
};
const coloredProps = {
  backgroundColor: "transparent"
};
const propsToAdd = {
  Image: "var(--svg)",
  Repeat: "no-repeat",
  Size: "100% 100%"
};
const propsToAddTo = {
  webkitMask: monotoneProps,
  mask: monotoneProps,
  background: coloredProps
};
for (const prefix in propsToAddTo) {
  const list = propsToAddTo[prefix];
  for (const prop in propsToAdd) {
    list[prefix + prop] = propsToAdd[prop];
  }
}
const customisationAliases = {};
["horizontal", "vertical"].forEach((prefix) => {
  const attr = prefix.slice(0, 1) + "Flip";
  customisationAliases[prefix + "-flip"] = attr;
  customisationAliases[prefix.slice(0, 1) + "-flip"] = attr;
  customisationAliases[prefix + "Flip"] = attr;
});
function fixSize(value) {
  return value + (value.match(/^[-0-9.]+$/) ? "px" : "");
}
const render = (icon, props) => {
  const customisations = mergeCustomisations(defaultExtendedIconCustomisations, props);
  const componentProps = { ...svgDefaults };
  const mode = props.mode || "svg";
  const style = {};
  const propsStyle = props.style;
  const customStyle = typeof propsStyle === "object" && !(propsStyle instanceof Array) ? propsStyle : {};
  for (let key in props) {
    const value = props[key];
    if (value === void 0) {
      continue;
    }
    switch (key) {
      case "icon":
      case "style":
      case "onLoad":
      case "mode":
        break;
      case "inline":
      case "hFlip":
      case "vFlip":
        customisations[key] = value === true || value === "true" || value === 1;
        break;
      case "flip":
        if (typeof value === "string") {
          flipFromString(customisations, value);
        }
        break;
      case "color":
        style.color = value;
        break;
      case "rotate":
        if (typeof value === "string") {
          customisations[key] = rotateFromString(value);
        } else if (typeof value === "number") {
          customisations[key] = value;
        }
        break;
      case "ariaHidden":
      case "aria-hidden":
        if (value !== true && value !== "true") {
          delete componentProps["aria-hidden"];
        }
        break;
      default: {
        const alias = customisationAliases[key];
        if (alias) {
          if (value === true || value === "true" || value === 1) {
            customisations[alias] = true;
          }
        } else if (defaultExtendedIconCustomisations[key] === void 0) {
          componentProps[key] = value;
        }
      }
    }
  }
  const item = iconToSVG(icon, customisations);
  const renderAttribs = item.attributes;
  if (customisations.inline) {
    style.verticalAlign = "-0.125em";
  }
  if (mode === "svg") {
    componentProps.style = {
      ...style,
      ...customStyle
    };
    Object.assign(componentProps, renderAttribs);
    let localCounter = 0;
    let id2 = props.id;
    if (typeof id2 === "string") {
      id2 = id2.replace(/-/g, "_");
    }
    componentProps["innerHTML"] = replaceIDs(item.body, id2 ? () => id2 + "ID" + localCounter++ : "iconifyVue");
    return h$1("svg", componentProps);
  }
  const { body, width, height } = icon;
  const useMask = mode === "mask" || (mode === "bg" ? false : body.indexOf("currentColor") !== -1);
  const html = iconToHTML(body, {
    ...renderAttribs,
    width: width + "",
    height: height + ""
  });
  componentProps.style = {
    ...style,
    "--svg": svgToURL(html),
    "width": fixSize(renderAttribs.width),
    "height": fixSize(renderAttribs.height),
    ...commonProps,
    ...useMask ? monotoneProps : coloredProps,
    ...customStyle
  };
  return h$1("span", componentProps);
};
allowSimpleNames(true);
setAPIModule("", fetchAPIModule);
if (typeof document !== "undefined" && typeof window !== "undefined") {
  initBrowserStorage();
  const _window2 = window;
  if (_window2.IconifyPreload !== void 0) {
    const preload = _window2.IconifyPreload;
    const err = "Invalid IconifyPreload syntax.";
    if (typeof preload === "object" && preload !== null) {
      (preload instanceof Array ? preload : [preload]).forEach((item) => {
        try {
          if (
            // Check if item is an object and not null/array
            typeof item !== "object" || item === null || item instanceof Array || // Check for 'icons' and 'prefix'
            typeof item.icons !== "object" || typeof item.prefix !== "string" || // Add icon set
            !addCollection(item)
          ) {
            console.error(err);
          }
        } catch (e3) {
          console.error(err);
        }
      });
    }
  }
  if (_window2.IconifyProviders !== void 0) {
    const providers = _window2.IconifyProviders;
    if (typeof providers === "object" && providers !== null) {
      for (let key in providers) {
        const err = "IconifyProviders[" + key + "] is invalid.";
        try {
          const value = providers[key];
          if (typeof value !== "object" || !value || value.resources === void 0) {
            continue;
          }
          if (!addAPIProvider(key, value)) {
            console.error(err);
          }
        } catch (e3) {
          console.error(err);
        }
      }
    }
  }
}
const emptyIcon = {
  ...defaultIconProps,
  body: ""
};
const Icon = defineComponent({
  // Do not inherit other attributes: it is handled by render()
  inheritAttrs: false,
  // Set initial data
  data() {
    return {
      // Mounted status
      iconMounted: false,
      // Callback counter to trigger re-render
      counter: 0
    };
  },
  mounted() {
    this._name = "";
    this._loadingIcon = null;
    this.iconMounted = true;
  },
  unmounted() {
    this.abortLoading();
  },
  methods: {
    abortLoading() {
      if (this._loadingIcon) {
        this._loadingIcon.abort();
        this._loadingIcon = null;
      }
    },
    // Get data for icon to render or null
    getIcon(icon, onload) {
      if (typeof icon === "object" && icon !== null && typeof icon.body === "string") {
        this._name = "";
        this.abortLoading();
        return {
          data: icon
        };
      }
      let iconName;
      if (typeof icon !== "string" || (iconName = stringToIcon(icon, false, true)) === null) {
        this.abortLoading();
        return null;
      }
      const data = getIconData(iconName);
      if (!data) {
        if (!this._loadingIcon || this._loadingIcon.name !== icon) {
          this.abortLoading();
          this._name = "";
          if (data !== null) {
            this._loadingIcon = {
              name: icon,
              abort: loadIcons([iconName], () => {
                this.counter++;
              })
            };
          }
        }
        return null;
      }
      this.abortLoading();
      if (this._name !== icon) {
        this._name = icon;
        if (onload) {
          onload(icon);
        }
      }
      const classes = ["iconify"];
      if (iconName.prefix !== "") {
        classes.push("iconify--" + iconName.prefix);
      }
      if (iconName.provider !== "") {
        classes.push("iconify--" + iconName.provider);
      }
      return { data, classes };
    }
  },
  // Render icon
  render() {
    this.counter;
    const props = this.$attrs;
    const icon = this.iconMounted ? this.getIcon(props.icon, props.onLoad) : null;
    if (!icon) {
      return render(emptyIcon, props);
    }
    let newProps = props;
    if (icon.classes) {
      newProps = {
        ...props,
        class: (typeof props["class"] === "string" ? props["class"] + " " : "") + icon.classes.join(" ")
      };
    }
    return render({
      ...defaultIconProps,
      ...icon.data
    }, newProps);
  }
});
var hs = Object.defineProperty, ys = Object.defineProperties, gs = Object.getOwnPropertyDescriptors, Eo = Object.getOwnPropertySymbols, bs = Object.prototype.hasOwnProperty, _s = Object.prototype.propertyIsEnumerable, Oo = (n2, e3, t3) => e3 in n2 ? hs(n2, e3, { enumerable: true, configurable: true, writable: true, value: t3 }) : n2[e3] = t3, ws = (n2, e3) => {
  for (var t3 in e3 || (e3 = {}))
    bs.call(e3, t3) && Oo(n2, t3, e3[t3]);
  if (Eo)
    for (var t3 of Eo(e3))
      _s.call(e3, t3) && Oo(n2, t3, e3[t3]);
  return n2;
}, Cs = (n2, e3) => ys(n2, gs(e3));
function Es(n2, e3) {
  var t3;
  const o2 = shallowRef();
  return watchEffect(() => {
    o2.value = n2();
  }, Cs(ws({}, e3), {
    flush: (t3 = e3 == null ? void 0 : e3.flush) != null ? t3 : "sync"
  })), readonly(o2);
}
function ft(n2) {
  return getCurrentScope() ? (onScopeDispose(n2), true) : false;
}
function In(n2) {
  let e3 = false, t3;
  const o2 = effectScope(true);
  return (...a4) => (e3 || (t3 = o2.run(() => n2(...a4)), e3 = true), t3);
}
function Oe(n2) {
  return typeof n2 == "function" ? n2() : unref(n2);
}
const be = typeof window < "u", Os = (n2) => typeof n2 < "u", $o = (n2, e3, t3) => Math.min(t3, Math.max(e3, n2)), At = () => {
}, So = /* @__PURE__ */ $s();
function $s() {
  var n2;
  return be && ((n2 = window == null ? void 0 : window.navigator) == null ? void 0 : n2.userAgent) && /* @__PURE__ */ /iP(ad|hone|od)/.test(window.navigator.userAgent);
}
function Jo(...n2) {
  if (n2.length !== 1)
    return toRef(...n2);
  const e3 = n2[0];
  return typeof e3 == "function" ? readonly(customRef(() => ({ get: e3, set: At }))) : ref(e3);
}
function jo(n2, e3 = 1e4) {
  return customRef((t3, o2) => {
    let a4 = n2, s4;
    const i3 = () => setTimeout(() => {
      a4 = n2, o2();
    }, Oe(e3));
    return ft(() => {
      clearTimeout(s4);
    }), {
      get() {
        return t3(), a4;
      },
      set(r2) {
        a4 = r2, o2(), clearTimeout(s4), s4 = i3();
      }
    };
  });
}
function $e(n2) {
  var e3;
  const t3 = Oe(n2);
  return (e3 = t3 == null ? void 0 : t3.$el) != null ? e3 : t3;
}
const kn = be ? window : void 0, fn = be ? window.document : void 0;
function Je(...n2) {
  let e3, t3, o2, a4;
  if (typeof n2[0] == "string" || Array.isArray(n2[0]) ? ([t3, o2, a4] = n2, e3 = kn) : [e3, t3, o2, a4] = n2, !e3)
    return At;
  Array.isArray(t3) || (t3 = [t3]), Array.isArray(o2) || (o2 = [o2]);
  const s4 = [], i3 = () => {
    s4.forEach((c3) => c3()), s4.length = 0;
  }, r2 = (c3, p2, f2, v2) => (c3.addEventListener(p2, f2, v2), () => c3.removeEventListener(p2, f2, v2)), u3 = watch(
    () => [$e(e3), Oe(a4)],
    ([c3, p2]) => {
      i3(), c3 && s4.push(
        ...t3.flatMap((f2) => o2.map((v2) => r2(c3, f2, v2, p2)))
      );
    },
    { immediate: true, flush: "post" }
  ), d4 = () => {
    u3(), i3();
  };
  return ft(d4), d4;
}
function Ts(n2) {
  return typeof n2 == "function" ? n2 : typeof n2 == "string" ? (e3) => e3.key === n2 : Array.isArray(n2) ? (e3) => n2.includes(e3.key) : () => true;
}
function As(...n2) {
  let e3, t3, o2 = {};
  n2.length === 3 ? (e3 = n2[0], t3 = n2[1], o2 = n2[2]) : n2.length === 2 ? typeof n2[1] == "object" ? (e3 = true, t3 = n2[0], o2 = n2[1]) : (e3 = n2[0], t3 = n2[1]) : (e3 = true, t3 = n2[0]);
  const {
    target: a4 = kn,
    eventName: s4 = "keydown",
    passive: i3 = false,
    dedupe: r2 = false
  } = o2, u3 = Ts(e3);
  return Je(a4, s4, (c3) => {
    c3.repeat && Oe(r2) || u3(c3) && t3(c3);
  }, i3);
}
function Ht() {
  const n2 = ref(false);
  return getCurrentInstance() && onMounted(() => {
    n2.value = true;
  }), n2;
}
function Is(n2) {
  return JSON.parse(JSON.stringify(n2));
}
function Qo(n2) {
  const e3 = window.getComputedStyle(n2);
  if (e3.overflowX === "scroll" || e3.overflowY === "scroll" || e3.overflowX === "auto" && n2.clientWidth < n2.scrollWidth || e3.overflowY === "auto" && n2.clientHeight < n2.scrollHeight)
    return true;
  {
    const t3 = n2.parentNode;
    return !t3 || t3.tagName === "BODY" ? false : Qo(t3);
  }
}
function Fs(n2) {
  const e3 = n2 || window.event, t3 = e3.target;
  return Qo(t3) ? false : e3.touches.length > 1 ? true : (e3.preventDefault && e3.preventDefault(), false);
}
function Ns(n2, e3 = false) {
  const t3 = ref(e3);
  let o2 = null, a4;
  watch(Jo(n2), (r2) => {
    if (r2) {
      const u3 = r2;
      a4 = u3.style.overflow, t3.value && (u3.style.overflow = "hidden");
    }
  }, {
    immediate: true
  });
  const s4 = () => {
    const r2 = Oe(n2);
    !r2 || t3.value || (So && (o2 = Je(
      r2,
      "touchmove",
      (u3) => {
        Fs(u3);
      },
      { passive: false }
    )), r2.style.overflow = "hidden", t3.value = true);
  }, i3 = () => {
    const r2 = Oe(n2);
    !r2 || !t3.value || (So && (o2 == null || o2()), r2.style.overflow = a4, t3.value = false);
  };
  return ft(i3), computed({
    get() {
      return t3.value;
    },
    set(r2) {
      r2 ? s4() : i3();
    }
  });
}
function X2(n2, e3, t3, o2 = {}) {
  var a4, s4, i3;
  const {
    clone: r2 = false,
    passive: u3 = false,
    eventName: d4,
    deep: c3 = false,
    defaultValue: p2,
    shouldEmit: f2
  } = o2, v2 = getCurrentInstance(), m4 = t3 || (v2 == null ? void 0 : v2.emit) || ((a4 = v2 == null ? void 0 : v2.$emit) == null ? void 0 : a4.bind(v2)) || ((i3 = (s4 = v2 == null ? void 0 : v2.proxy) == null ? void 0 : s4.$emit) == null ? void 0 : i3.bind(v2 == null ? void 0 : v2.proxy));
  let h4 = d4;
  e3 || (e3 = "modelValue"), h4 = h4 || `update:${e3.toString()}`;
  const g2 = (O3) => r2 ? typeof r2 == "function" ? r2(O3) : Is(O3) : O3, S4 = () => Os(n2[e3]) ? g2(n2[e3]) : p2, E2 = (O3) => {
    f2 ? f2(O3) && m4(h4, O3) : m4(h4, O3);
  };
  if (u3) {
    const O3 = S4(), P = ref(O3);
    return watch(
      () => n2[e3],
      (T3) => P.value = g2(T3)
    ), watch(
      P,
      (T3) => {
        (T3 !== n2[e3] || c3) && E2(T3);
      },
      { deep: c3 }
    ), P;
  } else
    return computed({
      get() {
        return S4();
      },
      set(O3) {
        E2(O3);
      }
    });
}
function Wt(n2, e3, t3, o2 = {}) {
  if (!e3)
    return null;
  const {
    arrowKeyOptions: a4 = "both",
    attributeName: s4 = "data-radix-vue-collection-item",
    itemsArray: i3 = [],
    loop: r2 = true,
    dir: u3 = "ltr",
    preventScroll: d4 = true,
    focus: c3 = false
  } = o2, [p2, f2, v2, m4, h4, g2] = [
    n2.key === "ArrowRight",
    n2.key === "ArrowLeft",
    n2.key === "ArrowUp",
    n2.key === "ArrowDown",
    n2.key === "Home",
    n2.key === "End"
  ], S4 = v2 || m4, E2 = p2 || f2;
  if (!h4 && !g2 && (!S4 && !E2 || a4 === "vertical" && E2 || a4 === "horizontal" && S4))
    return null;
  const O3 = t3 ? Array.from(t3.querySelectorAll(`[${s4}]`)) : i3;
  if (!O3.length)
    return null;
  d4 && n2.preventDefault();
  let P = null;
  return E2 || S4 ? P = ea(O3, e3, {
    goForward: S4 ? m4 : u3 === "ltr" ? p2 : f2,
    loop: r2
  }) : h4 ? P = O3.at(0) || null : g2 && (P = O3.at(-1) || null), c3 && (P == null || P.focus()), P;
}
function ea(n2, e3, { goForward: t3, loop: o2 }, a4 = n2.length) {
  if (--a4 === 0)
    return null;
  const s4 = n2.indexOf(e3), i3 = t3 ? s4 + 1 : s4 - 1;
  if (!o2 && (i3 < 0 || i3 >= n2.length))
    return null;
  const r2 = (i3 + n2.length) % n2.length, u3 = n2[r2];
  return u3 ? u3.hasAttribute("disabled") && u3.getAttribute("disabled") !== "false" ? ea(
    n2,
    u3,
    { goForward: t3, loop: o2 },
    a4
  ) : u3 : null;
}
function ta(n2, e3) {
  const t3 = ref(n2);
  function o2(s4) {
    return e3[t3.value][s4] ?? t3.value;
  }
  return {
    state: t3,
    dispatch: (s4) => {
      t3.value = o2(s4);
    }
  };
}
let vn = 0;
function xn() {
  watchEffect((n2) => {
    if (!be)
      return;
    const e3 = document.querySelectorAll("[data-radix-focus-guard]");
    document.body.insertAdjacentElement(
      "afterbegin",
      e3[0] ?? Bo()
    ), document.body.insertAdjacentElement(
      "beforeend",
      e3[1] ?? Bo()
    ), vn++, n2(() => {
      vn === 1 && document.querySelectorAll("[data-radix-focus-guard]").forEach((t3) => t3.remove()), vn--;
    });
  });
}
function Bo() {
  const n2 = document.createElement("span");
  return n2.setAttribute("data-radix-focus-guard", ""), n2.tabIndex = 0, n2.style.cssText = "outline: none; opacity: 0; position: fixed; pointer-events: none", n2;
}
const Ls = "data-radix-vue-collection-item";
function le(n2) {
  const e3 = n2 ?? Symbol();
  return { createCollection: (a4) => {
    const s4 = ref([]);
    function i3() {
      const r2 = $e(a4);
      return r2 ? s4.value = Array.from(
        r2.querySelectorAll(`[${Ls}]:not([data-disabled=true])`)
      ) : s4.value = [];
    }
    return onBeforeUpdate(() => {
      s4.value = [];
    }), onMounted(i3), onUpdated(i3), watch(() => a4 == null ? void 0 : a4.value, i3, { immediate: true }), provide(e3, s4), s4;
  }, injectCollection: () => inject(e3, ref([])) };
}
function J(n2) {
  const e3 = getCurrentInstance(), t3 = e3 == null ? void 0 : e3.type.emits, o2 = {};
  return t3 != null && t3.length || console.warn(
    `No emitted event found. Please check component: ${e3 == null ? void 0 : e3.type.__name}`
  ), t3 == null || t3.forEach((a4) => {
    o2[toHandlerKey(camelize(a4))] = (...s4) => n2(a4, ...s4);
  }), o2;
}
function na(n2) {
  const e3 = ref(), t3 = computed(() => {
    var a4;
    return ((a4 = e3.value) == null ? void 0 : a4.width) ?? 0;
  }), o2 = computed(() => {
    var a4;
    return ((a4 = e3.value) == null ? void 0 : a4.height) ?? 0;
  });
  return onMounted(() => {
    const a4 = $e(n2);
    if (a4) {
      e3.value = { width: a4.offsetWidth, height: a4.offsetHeight };
      const s4 = new ResizeObserver((i3) => {
        if (!Array.isArray(i3) || !i3.length)
          return;
        const r2 = i3[0];
        let u3, d4;
        if ("borderBoxSize" in r2) {
          const c3 = r2.borderBoxSize, p2 = Array.isArray(c3) ? c3[0] : c3;
          u3 = p2.inlineSize, d4 = p2.blockSize;
        } else
          u3 = a4.offsetWidth, d4 = a4.offsetHeight;
        e3.value = { width: u3, height: d4 };
      });
      return s4.observe(a4, { box: "border-box" }), () => s4.unobserve(a4);
    } else
      e3.value = void 0;
  }), {
    width: t3,
    height: o2
  };
}
var Vs = function(n2) {
  if (typeof document > "u")
    return null;
  var e3 = Array.isArray(n2) ? n2[0] : n2;
  return e3.ownerDocument.body;
}, Ge = /* @__PURE__ */ new WeakMap(), Ot = /* @__PURE__ */ new WeakMap(), $t = {}, mn = 0, oa = function(n2) {
  return n2 && (n2.host || oa(n2.parentNode));
}, Ks = function(n2, e3) {
  return e3.map(function(t3) {
    if (n2.contains(t3))
      return t3;
    var o2 = oa(t3);
    return o2 && n2.contains(o2) ? o2 : (console.error("aria-hidden", t3, "in not contained inside", n2, ". Doing nothing"), null);
  }).filter(function(t3) {
    return !!t3;
  });
}, Hs = function(n2, e3, t3, o2) {
  var a4 = Ks(e3, Array.isArray(n2) ? n2 : [n2]);
  $t[t3] || ($t[t3] = /* @__PURE__ */ new WeakMap());
  var s4 = $t[t3], i3 = [], r2 = /* @__PURE__ */ new Set(), u3 = new Set(a4), d4 = function(p2) {
    !p2 || r2.has(p2) || (r2.add(p2), d4(p2.parentNode));
  };
  a4.forEach(d4);
  var c3 = function(p2) {
    !p2 || u3.has(p2) || Array.prototype.forEach.call(p2.children, function(f2) {
      if (r2.has(f2))
        c3(f2);
      else {
        var v2 = f2.getAttribute(o2), m4 = v2 !== null && v2 !== "false", h4 = (Ge.get(f2) || 0) + 1, g2 = (s4.get(f2) || 0) + 1;
        Ge.set(f2, h4), s4.set(f2, g2), i3.push(f2), h4 === 1 && m4 && Ot.set(f2, true), g2 === 1 && f2.setAttribute(t3, "true"), m4 || f2.setAttribute(o2, "true");
      }
    });
  };
  return c3(e3), r2.clear(), mn++, function() {
    i3.forEach(function(p2) {
      var f2 = Ge.get(p2) - 1, v2 = s4.get(p2) - 1;
      Ge.set(p2, f2), s4.set(p2, v2), f2 || (Ot.has(p2) || p2.removeAttribute(o2), Ot.delete(p2)), v2 || p2.removeAttribute(t3);
    }), mn--, mn || (Ge = /* @__PURE__ */ new WeakMap(), Ge = /* @__PURE__ */ new WeakMap(), Ot = /* @__PURE__ */ new WeakMap(), $t = {});
  };
}, Ws = function(n2, e3, t3) {
  t3 === void 0 && (t3 = "data-aria-hidden");
  var o2 = Array.from(Array.isArray(n2) ? n2 : [n2]), a4 = e3 || Vs(n2);
  return a4 ? (o2.push.apply(o2, Array.from(a4.querySelectorAll("[aria-live]"))), Hs(o2, a4, t3, "aria-hidden")) : function() {
    return null;
  };
};
function zt(n2) {
  let e3;
  watch(() => $e(n2), (t3) => {
    t3 ? e3 = Ws(t3) : e3 && e3();
  }), onUnmounted(() => {
    e3();
  });
}
const zs = In(() => ({ count: ref(0) }));
function oe(n2) {
  const { count: e3 } = zs();
  return n2 || e3.value++, n2 || `radix-${e3.value}`;
}
function Rn(n2) {
  return n2 ? n2.flatMap((e3) => e3.type === Fragment ? Rn(e3.children) : [e3]) : [];
}
function Ys(n2) {
  return n2 && (typeof n2.type == "string" || typeof n2.type == "object" || typeof n2.type == "function");
}
const Gs = In(() => ref(0));
function Ut(n2) {
  const e3 = Gs(), t3 = Ns(fn == null ? void 0 : fn.body, false), o2 = computed({
    get() {
      return t3.value;
    },
    set(a4) {
      if (be)
        if (a4) {
          const s4 = window.innerWidth - document.documentElement.clientWidth;
          s4 > 0 && (document.body.style.paddingRight = `${s4}px`), nextTick(() => {
            document.body.style.pointerEvents = "none", t3.value = true;
          });
        } else
          document.body.style.paddingRight = "", document.body.style.pointerEvents = "", t3.value = false;
    }
  });
  return n2 && (e3.value++, o2.value = n2), onBeforeUnmount(() => {
    n2 && (e3.value--, e3.value === 0 && (document.body.style.paddingRight = "", document.body.style.pointerEvents = ""));
  }), o2;
}
function Fn(n2) {
  const e3 = jo("", 1e3);
  return {
    search: e3,
    handleTypeaheadSearch: (a4) => {
      var p2, f2;
      e3.value = e3.value + a4;
      const s4 = n2.value, i3 = document.activeElement, r2 = ((f2 = (p2 = s4.find((v2) => v2 === i3)) == null ? void 0 : p2.textContent) == null ? void 0 : f2.trim()) ?? "", u3 = s4.map((v2) => {
        var m4;
        return ((m4 = v2.textContent) == null ? void 0 : m4.trim()) ?? "";
      }), d4 = qs(u3, e3.value, r2), c3 = s4.find(
        (v2) => {
          var m4;
          return ((m4 = v2.textContent) == null ? void 0 : m4.trim()) === d4;
        }
      );
      c3 && c3.focus();
    },
    resetTypeahead: () => {
      e3.value = "";
    }
  };
}
function Nn(n2, e3) {
  return n2.map((t3, o2) => n2[(e3 + o2) % n2.length]);
}
function qs(n2, e3, t3) {
  const a4 = e3.length > 1 && Array.from(e3).every((d4) => d4 === e3[0]) ? e3[0] : e3, s4 = t3 ? n2.indexOf(t3) : -1;
  let i3 = Nn(n2, Math.max(s4, 0));
  a4.length === 1 && (i3 = i3.filter((d4) => d4 !== t3));
  const u3 = i3.find(
    (d4) => d4.toLowerCase().startsWith(a4.toLowerCase())
  );
  return u3 !== t3 ? u3 : void 0;
}
function aa(n2) {
  const e3 = Symbol(
    `${n2}Context`
  );
  return [(a4) => {
    const s4 = inject(e3, a4);
    if (s4)
      return s4;
    if (s4 === null)
      return null;
    throw new Error(`Component must be used within ${n2}`);
  }, (a4) => {
    provide(e3, a4);
  }];
}
function Xs(n2) {
  throw new Error(
    [
      `Detected an invalid children for \`${n2}\` with \`asChild\` prop.`,
      "",
      "Note: All components accepting `asChild` expect only one direct child of valid VNode type.",
      "You can apply a few solutions:",
      [
        "Provide a single child element so that we can forward the props onto that element.",
        "Ensure the first child is an actual element instead of a raw text node or comment node."
      ].map((e3) => `  - ${e3}`).join(`
`)
    ].join(`
`)
  );
}
const x2 = defineComponent({
  name: "Primitive",
  inheritAttrs: false,
  props: {
    asChild: {
      type: Boolean,
      default: false
    },
    as: {
      type: String,
      default: "div"
    }
  },
  setup(n2, { attrs: e3, slots: t3 }) {
    const o2 = n2.asChild ? "template" : n2.as;
    return o2 !== "template" ? () => h$1(n2.as, e3, { default: t3.default }) : () => {
      var r2, u3;
      if (!t3.default)
        return null;
      const a4 = Rn(t3.default()), [s4, ...i3] = a4;
      if (Ys(s4) || Xs(o2), Object.keys(e3).length > 0) {
        (r2 = s4.props) == null || delete r2.ref;
        const d4 = mergeProps(e3, s4.props ?? {});
        e3.class && ((u3 = s4.props) != null && u3.class) && delete s4.props.class;
        const c3 = cloneVNode(s4, d4);
        for (const p2 in d4)
          p2.startsWith("on") && (c3.props || (c3.props = {}), c3.props[p2] = d4[p2]);
        return a4.length === 1 ? c3 : [c3, ...i3];
      }
      return a4;
    };
  }
});
function K2() {
  const n2 = ref(), e3 = computed(() => {
    var t3;
    return ((t3 = n2.value) == null ? void 0 : t3.$el.nodeName) === "#text" ? n2.value.$el.nextElementSibling : $e(n2);
  });
  return {
    primitiveElement: n2,
    currentElement: e3
  };
}
function Zs(n2, e3) {
  const t3 = ref({}), o2 = ref("none"), a4 = n2.value ? "mounted" : "unmounted", { state: s4, dispatch: i3 } = ta(a4, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: {
      MOUNT: "mounted"
    }
  });
  watch(
    n2,
    async (f2, v2) => {
      var h4;
      const m4 = v2 !== f2;
      if (await nextTick(), m4) {
        const g2 = o2.value, S4 = St(e3.value);
        f2 ? i3("MOUNT") : S4 === "none" || ((h4 = t3.value) == null ? void 0 : h4.display) === "none" ? i3("UNMOUNT") : i3(v2 && g2 !== S4 ? "ANIMATION_OUT" : "UNMOUNT");
      }
    },
    { immediate: true }
  );
  const r2 = (f2) => {
    const m4 = St(e3.value).includes(
      f2.animationName
    );
    f2.target === e3.value && m4 && i3("ANIMATION_END");
  }, u3 = (f2) => {
    f2.target === e3.value && (o2.value = St(e3.value));
  }, d4 = watch(
    e3,
    (f2, v2) => {
      f2 ? (t3.value = getComputedStyle(f2), f2.addEventListener("animationstart", u3), f2.addEventListener("animationcancel", r2), f2.addEventListener("animationend", r2)) : (i3("ANIMATION_END"), v2 == null || v2.removeEventListener("animationstart", u3), v2 == null || v2.removeEventListener("animationcancel", r2), v2 == null || v2.removeEventListener("animationend", r2));
    },
    { immediate: true }
  ), c3 = watch(s4, () => {
    const f2 = St(e3.value);
    o2.value = s4.value === "mounted" ? f2 : "none";
  });
  return onUnmounted(() => {
    d4(), c3();
  }), {
    isPresent: computed(
      () => ["mounted", "unmountSuspended"].includes(s4.value)
    )
  };
}
function St(n2) {
  return n2 && getComputedStyle(n2).animationName || "none";
}
const ie = /* @__PURE__ */ defineComponent({
  __name: "Presence",
  props: {
    present: { type: Boolean },
    forceMount: { type: Boolean }
  },
  setup(n2, { expose: e3 }) {
    var f2;
    const t3 = n2, { present: o2, forceMount: a4 } = toRefs(t3), s4 = useSlots(), i3 = ref(), { isPresent: r2 } = Zs(o2, i3), u3 = {
      beforeMount(v2) {
        v2.hasAttribute("data-radix-popper-content-wrapper") ? i3.value = v2.firstChild : i3.value = v2;
      }
    };
    let d4 = (f2 = s4.default) == null ? void 0 : f2.call(s4);
    d4 = Rn(d4 || []);
    const c3 = getCurrentInstance();
    function p2() {
      var v2, m4;
      if (d4 && (d4 == null ? void 0 : d4.length) > 1) {
        const h4 = (v2 = c3 == null ? void 0 : c3.parent) != null && v2.type.name ? `<${c3.parent.type.name} />` : "component";
        throw new Error(
          [
            `Detected an invalid children for \`${h4}\` for  \`Presence\` component.`,
            "",
            "Note: Presence works similarly to `v-if` directly, but it waits for animation/transition to finished before unmounting. So it expect only one direct child of valid VNode type.",
            "You can apply a few solutions:",
            [
              "Provide a single child element so that `presence` directive attach correctly.rv",
              "Ensure the first child is an actual element instead of a raw text node or comment node."
            ].map((g2) => `  - ${g2}`).join(`
`)
          ].join(`
`)
        );
      }
      return a4.value || o2.value || r2.value ? withDirectives((m4 = s4.default) == null ? void 0 : m4.call(s4)[0], [[u3]]) : null;
    }
    return e3({
      present: r2
    }), (v2, m4) => (openBlock(), createBlock(p2));
  }
});
const il = "rovingFocusGroup.onEntryFocus", rl = { bubbles: false, cancelable: true };
function da(n2) {
  const e3 = document.activeElement;
  for (const t3 of n2)
    if (t3 === e3 || (t3.focus(), document.activeElement !== e3))
      return;
}
const ca = Symbol(), Qe = /* @__PURE__ */ defineComponent({
  __name: "RovingFocusGroup",
  props: {
    orientation: { default: void 0 },
    dir: { default: "ltr" },
    loop: { type: Boolean, default: false },
    currentTabStopId: {},
    defaultCurrentTabStopId: {},
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["entryFocus", "update:currentTabStopId"],
  setup(n2, { emit: e3 }) {
    const t3 = n2, { loop: o2, orientation: a4, dir: s4 } = toRefs(t3), i3 = X2(t3, "currentTabStopId", e3, {
      defaultValue: t3.defaultCurrentTabStopId,
      passive: true
    }), r2 = ref(false), u3 = ref(false), d4 = ref(0), { primitiveElement: c3, currentElement: p2 } = K2(), { createCollection: f2 } = le("rovingFocus"), v2 = f2(p2);
    function m4(h4) {
      const g2 = !u3.value;
      if (h4.currentTarget && h4.target === h4.currentTarget && g2 && !r2.value) {
        const S4 = new CustomEvent(il, rl);
        if (h4.currentTarget.dispatchEvent(S4), e3("entryFocus", S4), !S4.defaultPrevented) {
          const E2 = v2.value, O3 = E2.find((D2) => D2.getAttribute("data-active") === "true"), P = E2.find(
            (D2) => D2.id === i3.value
          ), T3 = [O3, P, ...E2].filter(
            Boolean
          );
          da(T3);
        }
      }
      u3.value = false;
    }
    return provide(ca, {
      loop: o2,
      dir: s4,
      orientation: a4,
      currentTabStopId: i3,
      onItemFocus: (h4) => {
        i3.value = h4;
      },
      onItemShiftTab: () => {
        r2.value = true;
      },
      onFocusableItemAdd: () => {
        d4.value++;
      },
      onFocusableItemRemove: () => {
        d4.value--;
      }
    }), (h4, g2) => (openBlock(), createBlock(unref(x2), {
      ref_key: "primitiveElement",
      ref: c3,
      tabindex: r2.value || d4.value === 0 ? -1 : 0,
      "data-orientation": unref(a4),
      as: h4.as,
      "as-child": h4.asChild,
      style: { outline: "none" },
      onMousedown: g2[0] || (g2[0] = (S4) => u3.value = true),
      onFocus: m4,
      onBlur: g2[1] || (g2[1] = (S4) => r2.value = false)
    }, {
      default: withCtx(() => [
        renderSlot(h4.$slots, "default")
      ]),
      _: 3
    }, 8, ["tabindex", "data-orientation", "as", "as-child"]));
  }
});
const We = /* @__PURE__ */ defineComponent({
  __name: "Teleport",
  props: {
    to: { default: "body" },
    disabled: { type: Boolean },
    forceMount: { type: Boolean }
  },
  setup(n2) {
    const e3 = Ht();
    return (t3, o2) => unref(e3) || t3.forceMount ? (openBlock(), createBlock(Teleport, {
      key: 0,
      to: t3.to,
      disabled: t3.disabled
    }, [
      renderSlot(t3.$slots, "default")
    ], 8, ["to", "disabled"])) : createCommentVNode("", true);
  }
}), Fl = "dismissableLayer.pointerDownOutside", Nl = "dismissableLayer.focusOutside";
function Ea(n2, e3) {
  const t3 = e3.closest(
    "[data-dismissable-layer]"
  ), o2 = n2.querySelector(
    "[data-dismissable-layer]"
  );
  if (!o2)
    return false;
  const a4 = Array.from(
    n2.ownerDocument.querySelectorAll("[data-dismissable-layer]")
  );
  return o2 === t3 || a4.indexOf(o2) < a4.indexOf(t3);
}
function Ll(n2, e3) {
  var s4;
  const t3 = ((s4 = e3 == null ? void 0 : e3.value) == null ? void 0 : s4.ownerDocument) ?? (globalThis == null ? void 0 : globalThis.document), o2 = ref(false), a4 = ref(() => {
  });
  return watchEffect((i3) => {
    if (!be)
      return;
    const r2 = async (d4) => {
      if (e3 != null && e3.value) {
        if (await nextTick(), Ea(e3.value, d4.target)) {
          o2.value = false;
          return;
        }
        if (d4.target && !o2.value) {
          let c3 = function() {
            Oa(
              Fl,
              n2,
              p2
            );
          };
          const p2 = { originalEvent: d4 };
          d4.pointerType === "touch" ? (t3.removeEventListener("click", a4.value), a4.value = c3, t3.addEventListener("click", a4.value, {
            once: true
          })) : c3();
        } else
          t3.removeEventListener("click", a4.value);
        o2.value = false;
      }
    }, u3 = window.setTimeout(() => {
      t3.addEventListener("pointerdown", r2);
    }, 0);
    i3(() => {
      window.clearTimeout(u3), t3.removeEventListener("pointerdown", r2), t3.removeEventListener("click", a4.value);
    });
  }), {
    onPointerDownCapture: () => o2.value = true
  };
}
function Vl(n2, e3) {
  var a4;
  const t3 = ((a4 = e3 == null ? void 0 : e3.value) == null ? void 0 : a4.ownerDocument) ?? (globalThis == null ? void 0 : globalThis.document), o2 = ref(false);
  return watchEffect((s4) => {
    if (!be)
      return;
    const i3 = async (r2) => {
      e3 != null && e3.value && (await nextTick(), !Ea(e3.value, r2.target) && r2.target && !o2.value && Oa(
        Nl,
        n2,
        { originalEvent: r2 }
      ));
    };
    t3.addEventListener("focusin", i3), s4(() => t3.removeEventListener("focusin", i3));
  }), {
    onFocusCapture: () => o2.value = true,
    onBlurCapture: () => o2.value = false
  };
}
function Oa(n2, e3, t3) {
  const o2 = t3.originalEvent.target, a4 = new CustomEvent(n2, {
    bubbles: false,
    cancelable: true,
    detail: t3
  });
  e3 && o2.addEventListener(n2, e3, { once: true }), o2.dispatchEvent(a4);
}
const ze = /* @__PURE__ */ defineComponent({
  __name: "DismissableLayer",
  props: {
    disableOutsidePointerEvents: { type: Boolean, default: false },
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "dismiss"],
  setup(n2, { emit: e3 }) {
    const t3 = n2, { primitiveElement: o2, currentElement: a4 } = K2(), s4 = computed(
      () => {
        var m4;
        return ((m4 = a4.value) == null ? void 0 : m4.ownerDocument) ?? globalThis.document;
      }
    ), i3 = ref(/* @__PURE__ */ new Set()), r2 = ref(/* @__PURE__ */ new Set());
    provide("dismissable", {
      layers: i3,
      layersWithOutsidePointerEventsDisabled: r2
    });
    const u3 = inject("dismissable", {
      layers: i3,
      layersWithOutsidePointerEventsDisabled: r2
    });
    watch(
      () => u3,
      () => {
        u3 != null && u3.layers.value && (i3.value = u3.layers.value), u3 != null && u3.layersWithOutsidePointerEventsDisabled.value && (r2.value = u3.layersWithOutsidePointerEventsDisabled.value);
      },
      { immediate: true, deep: true }
    );
    const d4 = computed(() => a4.value ? Array.from(i3.value).indexOf(a4.value) : -1), c3 = computed(() => r2.value.size > 0), p2 = computed(() => {
      const m4 = Array.from(i3.value), [h4] = [...r2.value].slice(-1), g2 = m4.indexOf(h4);
      return d4.value >= g2;
    }), f2 = Ll(async (m4) => {
      p2.value && (e3("pointerDownOutside", m4), e3("interactOutside", m4), await nextTick(), m4.defaultPrevented || e3("dismiss"));
    }, a4), v2 = Vl((m4) => {
      e3("focusOutside", m4), e3("interactOutside", m4), m4.defaultPrevented || e3("dismiss");
    }, a4);
    return As("Escape", (m4) => {
      d4.value === i3.value.size - 1 && (e3("escapeKeyDown", m4), m4.defaultPrevented || e3("dismiss"));
    }), watchEffect((m4) => {
      if (!a4.value)
        return;
      let h4;
      t3.disableOutsidePointerEvents && (r2.value.size === 0 && (h4 = s4.value.body.style.pointerEvents, s4.value.body.style.pointerEvents = "none"), r2.value.add(a4.value)), i3.value.add(a4.value), m4(() => {
        (t3.disableOutsidePointerEvents || r2.value.size === 1) && (s4.value.body.style.pointerEvents = h4);
      });
    }), watchEffect((m4) => {
      m4(() => {
        a4.value && (i3.value.delete(a4.value), r2.value.delete(a4.value));
      });
    }), (m4, h4) => (openBlock(), createBlock(unref(x2), {
      ref_key: "primitiveElement",
      ref: o2,
      "as-child": m4.asChild,
      as: m4.as,
      "data-dismissable-layer": "",
      style: normalizeStyle({
        pointerEvents: c3.value ? p2.value ? "auto" : "none" : void 0
      }),
      onFocusCapture: unref(v2).onFocusCapture,
      onBlurCapture: unref(v2).onBlurCapture,
      onPointerdownCapture: unref(f2).onPointerDownCapture
    }, {
      default: withCtx(() => [
        renderSlot(m4.$slots, "default")
      ]),
      _: 3
    }, 8, ["as-child", "as", "style", "onFocusCapture", "onBlurCapture", "onPointerdownCapture"]));
  }
}), hn = "focusScope.autoFocusOnMount", yn = "focusScope.autoFocusOnUnmount", To = { bubbles: false, cancelable: true };
function Kl(n2, { select: e3 = false } = {}) {
  const t3 = document.activeElement;
  for (const o2 of n2)
    if (Ie(o2, { select: e3 }), document.activeElement !== t3)
      return;
}
function Hl(n2) {
  const e3 = $a(n2), t3 = Ao(e3, n2), o2 = Ao(e3.reverse(), n2);
  return [t3, o2];
}
function $a(n2) {
  const e3 = [], t3 = document.createTreeWalker(n2, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (o2) => {
      const a4 = o2.tagName === "INPUT" && o2.type === "hidden";
      return o2.disabled || o2.hidden || a4 ? NodeFilter.FILTER_SKIP : o2.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  for (; t3.nextNode(); )
    e3.push(t3.currentNode);
  return e3;
}
function Ao(n2, e3) {
  for (const t3 of n2)
    if (!Wl(t3, { upTo: e3 }))
      return t3;
}
function Wl(n2, { upTo: e3 }) {
  if (getComputedStyle(n2).visibility === "hidden")
    return true;
  for (; n2; ) {
    if (e3 !== void 0 && n2 === e3)
      return false;
    if (getComputedStyle(n2).display === "none")
      return true;
    n2 = n2.parentElement;
  }
  return false;
}
function zl(n2) {
  return n2 instanceof HTMLInputElement && "select" in n2;
}
function Ie(n2, { select: e3 = false } = {}) {
  if (n2 && n2.focus) {
    const t3 = document.activeElement;
    n2.focus({ preventScroll: true }), n2 !== t3 && zl(n2) && e3 && n2.select();
  }
}
const Ul = In(() => ref([]));
function Yl() {
  const n2 = Ul();
  return {
    add(e3) {
      const t3 = n2.value[0];
      e3 !== t3 && (t3 == null || t3.pause()), n2.value = Do(n2.value, e3), n2.value.unshift(e3);
    },
    remove(e3) {
      var t3;
      n2.value = Do(n2.value, e3), (t3 = n2.value[0]) == null || t3.resume();
    }
  };
}
function Do(n2, e3) {
  const t3 = [...n2], o2 = t3.indexOf(e3);
  return o2 !== -1 && t3.splice(o2, 1), t3;
}
function Gl(n2) {
  return n2.filter((e3) => e3.tagName !== "A");
}
const Xt = /* @__PURE__ */ defineComponent({
  __name: "FocusScope",
  props: {
    loop: { type: Boolean, default: false },
    trapped: { type: Boolean, default: false },
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["mountAutoFocus", "unmountAutoFocus"],
  setup(n2, { emit: e3 }) {
    const t3 = n2, { primitiveElement: o2, currentElement: a4 } = K2(), s4 = ref(null), i3 = Yl(), r2 = reactive({
      paused: false,
      pause() {
        this.paused = true;
      },
      resume() {
        this.paused = false;
      }
    });
    watchEffect((d4) => {
      if (!be)
        return;
      const c3 = a4.value;
      if (!t3.trapped)
        return;
      function p2(h4) {
        if (r2.paused || !c3)
          return;
        const g2 = h4.target;
        c3.contains(g2) ? s4.value = g2 : Ie(s4.value, { select: true });
      }
      function f2(h4) {
        if (r2.paused || !c3)
          return;
        const g2 = h4.relatedTarget;
        g2 !== null && (c3.contains(g2) || Ie(s4.value, { select: true }));
      }
      function v2(h4) {
        if (document.activeElement === document.body)
          for (const S4 of h4)
            S4.removedNodes.length > 0 && Ie(c3);
      }
      document.addEventListener("focusin", p2), document.addEventListener("focusout", f2);
      const m4 = new MutationObserver(v2);
      c3 && m4.observe(c3, { childList: true, subtree: true }), d4(() => {
        document.removeEventListener("focusin", p2), document.removeEventListener("focusout", f2), m4.disconnect();
      });
    }), watchEffect(async (d4) => {
      const c3 = a4.value;
      if (await nextTick(), !c3)
        return;
      i3.add(r2);
      const p2 = document.activeElement;
      if (!c3.contains(p2)) {
        const v2 = new CustomEvent(hn, To);
        c3.addEventListener(
          hn,
          (m4) => e3("mountAutoFocus", m4)
        ), c3.dispatchEvent(v2), v2.defaultPrevented || (Kl(Gl($a(c3)), {
          select: true
        }), document.activeElement === p2 && Ie(c3));
      }
      d4(() => {
        c3.removeEventListener(
          hn,
          (h4) => e3("mountAutoFocus", h4)
        );
        const v2 = new CustomEvent(yn, To), m4 = (h4) => {
          e3("unmountAutoFocus", h4);
        };
        c3.addEventListener(yn, m4), c3.dispatchEvent(v2), setTimeout(() => {
          v2.defaultPrevented || Ie(p2 ?? document.body, { select: true }), c3.removeEventListener(yn, m4), i3.remove(r2);
        }, 0);
      });
    });
    function u3(d4) {
      if (!t3.loop && !t3.trapped || r2.paused)
        return;
      const c3 = d4.key === "Tab" && !d4.altKey && !d4.ctrlKey && !d4.metaKey, p2 = document.activeElement;
      if (c3 && p2) {
        const f2 = d4.currentTarget, [v2, m4] = Hl(f2);
        v2 && m4 ? !d4.shiftKey && p2 === m4 ? (d4.preventDefault(), t3.loop && Ie(v2, { select: true })) : d4.shiftKey && p2 === v2 && (d4.preventDefault(), t3.loop && Ie(m4, { select: true })) : p2 === f2 && d4.preventDefault();
      }
    }
    return (d4, c3) => (openBlock(), createBlock(unref(x2), {
      ref_key: "primitiveElement",
      ref: o2,
      tabindex: "-1",
      "as-child": t3.asChild,
      as: t3.as,
      onKeydown: u3
    }, {
      default: withCtx(() => [
        renderSlot(d4.$slots, "default")
      ]),
      _: 3
    }, 8, ["as-child", "as"]));
  }
}), ql = "menu.itemSelect", bn = ["Enter", " "], Xl = ["ArrowDown", "PageUp", "Home"], Sa = ["ArrowUp", "PageDown", "End"], Jl = [...Xl, ...Sa], jl = {
  ltr: [...bn, "ArrowRight"],
  rtl: [...bn, "ArrowLeft"]
}, Zl = {
  ltr: ["ArrowLeft"],
  rtl: ["ArrowRight"]
};
function Wn(n2) {
  return n2 ? "open" : "closed";
}
function It(n2) {
  return n2 === "indeterminate";
}
function zn(n2) {
  return It(n2) ? "indeterminate" : n2 ? "checked" : "unchecked";
}
function _n(n2) {
  const e3 = document.activeElement;
  for (const t3 of n2)
    if (t3 === e3 || (t3.focus(), document.activeElement !== e3))
      return;
}
function Ql(n2, e3) {
  const { x: t3, y: o2 } = n2;
  let a4 = false;
  for (let s4 = 0, i3 = e3.length - 1; s4 < e3.length; i3 = s4++) {
    const r2 = e3[s4].x, u3 = e3[s4].y, d4 = e3[i3].x, c3 = e3[i3].y;
    u3 > o2 != c3 > o2 && t3 < (d4 - r2) * (o2 - u3) / (c3 - u3) + r2 && (a4 = !a4);
  }
  return a4;
}
function ei(n2, e3) {
  if (!e3)
    return false;
  const t3 = { x: n2.clientX, y: n2.clientY };
  return Ql(t3, e3);
}
function rt(n2) {
  return n2.pointerType === "mouse";
}
const Gn = Symbol(), tt = /* @__PURE__ */ defineComponent({
  __name: "PopperRoot",
  setup(n2) {
    const e3 = ref();
    return provide(Gn, {
      anchor: e3,
      onAnchorChange: (t3) => {
        e3.value = t3;
      }
    }), (t3, o2) => renderSlot(t3.$slots, "default");
  }
}), nt = /* @__PURE__ */ defineComponent({
  __name: "PopperAnchor",
  props: {
    element: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(n2) {
    const e3 = n2, { primitiveElement: t3, currentElement: o2 } = K2(), a4 = inject(Gn);
    return watch(o2, () => {
      a4 == null || a4.onAnchorChange(e3.element ?? o2.value);
    }), (s4, i3) => (openBlock(), createBlock(unref(x2), {
      ref_key: "primitiveElement",
      ref: t3,
      as: s4.as,
      "as-child": s4.asChild
    }, {
      default: withCtx(() => [
        renderSlot(s4.$slots, "default")
      ]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), ui = ["top", "right", "bottom", "left"], ut = Math.min, Le = Math.max, di = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, ci = {
  start: "end",
  end: "start"
};
function wn(n2, e3, t3) {
  return Le(n2, ut(e3, t3));
}
function Pe(n2, e3) {
  return typeof n2 == "function" ? n2(e3) : n2;
}
function Be(n2) {
  return n2.split("-")[0];
}
function ot(n2) {
  return n2.split("-")[1];
}
function qn(n2) {
  return n2 === "x" ? "y" : "x";
}
function Xn(n2) {
  return n2 === "y" ? "height" : "width";
}
function at(n2) {
  return ["top", "bottom"].includes(Be(n2)) ? "y" : "x";
}
function Jn(n2) {
  return qn(at(n2));
}
function pi(n2, e3, t3) {
  t3 === void 0 && (t3 = false);
  const o2 = ot(n2), a4 = Jn(n2), s4 = Xn(a4);
  let i3 = a4 === "x" ? o2 === (t3 ? "end" : "start") ? "right" : "left" : o2 === "start" ? "bottom" : "top";
  return e3.reference[s4] > e3.floating[s4] && (i3 = Mt(i3)), [i3, Mt(i3)];
}
function fi(n2) {
  const e3 = Mt(n2);
  return [Cn(n2), e3, Cn(e3)];
}
function Cn(n2) {
  return n2.replace(/start|end/g, (e3) => ci[e3]);
}
function vi(n2, e3, t3) {
  const o2 = ["left", "right"], a4 = ["right", "left"], s4 = ["top", "bottom"], i3 = ["bottom", "top"];
  switch (n2) {
    case "top":
    case "bottom":
      return t3 ? e3 ? a4 : o2 : e3 ? o2 : a4;
    case "left":
    case "right":
      return e3 ? s4 : i3;
    default:
      return [];
  }
}
function mi(n2, e3, t3, o2) {
  const a4 = ot(n2);
  let s4 = vi(Be(n2), t3 === "start", o2);
  return a4 && (s4 = s4.map((i3) => i3 + "-" + a4), e3 && (s4 = s4.concat(s4.map(Cn)))), s4;
}
function Mt(n2) {
  return n2.replace(/left|right|bottom|top/g, (e3) => di[e3]);
}
function hi(n2) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...n2
  };
}
function Aa(n2) {
  return typeof n2 != "number" ? hi(n2) : {
    top: n2,
    right: n2,
    bottom: n2,
    left: n2
  };
}
function kt(n2) {
  return {
    ...n2,
    top: n2.y,
    left: n2.x,
    right: n2.x + n2.width,
    bottom: n2.y + n2.height
  };
}
function Io(n2, e3, t3) {
  let {
    reference: o2,
    floating: a4
  } = n2;
  const s4 = at(e3), i3 = Jn(e3), r2 = Xn(i3), u3 = Be(e3), d4 = s4 === "y", c3 = o2.x + o2.width / 2 - a4.width / 2, p2 = o2.y + o2.height / 2 - a4.height / 2, f2 = o2[r2] / 2 - a4[r2] / 2;
  let v2;
  switch (u3) {
    case "top":
      v2 = {
        x: c3,
        y: o2.y - a4.height
      };
      break;
    case "bottom":
      v2 = {
        x: c3,
        y: o2.y + o2.height
      };
      break;
    case "right":
      v2 = {
        x: o2.x + o2.width,
        y: p2
      };
      break;
    case "left":
      v2 = {
        x: o2.x - a4.width,
        y: p2
      };
      break;
    default:
      v2 = {
        x: o2.x,
        y: o2.y
      };
  }
  switch (ot(e3)) {
    case "start":
      v2[i3] -= f2 * (t3 && d4 ? -1 : 1);
      break;
    case "end":
      v2[i3] += f2 * (t3 && d4 ? -1 : 1);
      break;
  }
  return v2;
}
const yi = async (n2, e3, t3) => {
  const {
    placement: o2 = "bottom",
    strategy: a4 = "absolute",
    middleware: s4 = [],
    platform: i3
  } = t3, r2 = s4.filter(Boolean), u3 = await (i3.isRTL == null ? void 0 : i3.isRTL(e3));
  let d4 = await i3.getElementRects({
    reference: n2,
    floating: e3,
    strategy: a4
  }), {
    x: c3,
    y: p2
  } = Io(d4, o2, u3), f2 = o2, v2 = {}, m4 = 0;
  for (let h4 = 0; h4 < r2.length; h4++) {
    const {
      name: g2,
      fn: S4
    } = r2[h4], {
      x: E2,
      y: O3,
      data: P,
      reset: T3
    } = await S4({
      x: c3,
      y: p2,
      initialPlacement: o2,
      placement: f2,
      strategy: a4,
      middlewareData: v2,
      rects: d4,
      platform: i3,
      elements: {
        reference: n2,
        floating: e3
      }
    });
    if (c3 = E2 ?? c3, p2 = O3 ?? p2, v2 = {
      ...v2,
      [g2]: {
        ...v2[g2],
        ...P
      }
    }, T3 && m4 <= 50) {
      m4++, typeof T3 == "object" && (T3.placement && (f2 = T3.placement), T3.rects && (d4 = T3.rects === true ? await i3.getElementRects({
        reference: n2,
        floating: e3,
        strategy: a4
      }) : T3.rects), {
        x: c3,
        y: p2
      } = Io(d4, f2, u3)), h4 = -1;
      continue;
    }
  }
  return {
    x: c3,
    y: p2,
    placement: f2,
    strategy: a4,
    middlewareData: v2
  };
};
async function dt(n2, e3) {
  var t3;
  e3 === void 0 && (e3 = {});
  const {
    x: o2,
    y: a4,
    platform: s4,
    rects: i3,
    elements: r2,
    strategy: u3
  } = n2, {
    boundary: d4 = "clippingAncestors",
    rootBoundary: c3 = "viewport",
    elementContext: p2 = "floating",
    altBoundary: f2 = false,
    padding: v2 = 0
  } = Pe(e3, n2), m4 = Aa(v2), g2 = r2[f2 ? p2 === "floating" ? "reference" : "floating" : p2], S4 = kt(await s4.getClippingRect({
    element: (t3 = await (s4.isElement == null ? void 0 : s4.isElement(g2))) == null || t3 ? g2 : g2.contextElement || await (s4.getDocumentElement == null ? void 0 : s4.getDocumentElement(r2.floating)),
    boundary: d4,
    rootBoundary: c3,
    strategy: u3
  })), E2 = p2 === "floating" ? {
    ...i3.floating,
    x: o2,
    y: a4
  } : i3.reference, O3 = await (s4.getOffsetParent == null ? void 0 : s4.getOffsetParent(r2.floating)), P = await (s4.isElement == null ? void 0 : s4.isElement(O3)) ? await (s4.getScale == null ? void 0 : s4.getScale(O3)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, T3 = kt(s4.convertOffsetParentRelativeRectToViewportRelativeRect ? await s4.convertOffsetParentRelativeRectToViewportRelativeRect({
    rect: E2,
    offsetParent: O3,
    strategy: u3
  }) : E2);
  return {
    top: (S4.top - T3.top + m4.top) / P.y,
    bottom: (T3.bottom - S4.bottom + m4.bottom) / P.y,
    left: (S4.left - T3.left + m4.left) / P.x,
    right: (T3.right - S4.right + m4.right) / P.x
  };
}
const gi = (n2) => ({
  name: "arrow",
  options: n2,
  async fn(e3) {
    const {
      x: t3,
      y: o2,
      placement: a4,
      rects: s4,
      platform: i3,
      elements: r2
    } = e3, {
      element: u3,
      padding: d4 = 0
    } = Pe(n2, e3) || {};
    if (u3 == null)
      return {};
    const c3 = Aa(d4), p2 = {
      x: t3,
      y: o2
    }, f2 = Jn(a4), v2 = Xn(f2), m4 = await i3.getDimensions(u3), h4 = f2 === "y", g2 = h4 ? "top" : "left", S4 = h4 ? "bottom" : "right", E2 = h4 ? "clientHeight" : "clientWidth", O3 = s4.reference[v2] + s4.reference[f2] - p2[f2] - s4.floating[v2], P = p2[f2] - s4.reference[f2], T3 = await (i3.getOffsetParent == null ? void 0 : i3.getOffsetParent(u3));
    let D2 = T3 ? T3[E2] : 0;
    (!D2 || !await (i3.isElement == null ? void 0 : i3.isElement(T3))) && (D2 = r2.floating[E2] || s4.floating[v2]);
    const I2 = O3 / 2 - P / 2, H4 = D2 / 2 - m4[v2] / 2 - 1, A2 = ut(c3[g2], H4), V = ut(c3[S4], H4), F2 = A2, z2 = D2 - m4[v2] - V, U = D2 / 2 - m4[v2] / 2 + I2, Q2 = wn(F2, U, z2), re = ot(a4) != null && U != Q2 && s4.reference[v2] / 2 - (U < F2 ? A2 : V) - m4[v2] / 2 < 0 ? U < F2 ? F2 - U : z2 - U : 0;
    return {
      [f2]: p2[f2] - re,
      data: {
        [f2]: Q2,
        centerOffset: U - Q2 + re
      }
    };
  }
}), bi = function(n2) {
  return n2 === void 0 && (n2 = {}), {
    name: "flip",
    options: n2,
    async fn(e3) {
      var t3;
      const {
        placement: o2,
        middlewareData: a4,
        rects: s4,
        initialPlacement: i3,
        platform: r2,
        elements: u3
      } = e3, {
        mainAxis: d4 = true,
        crossAxis: c3 = true,
        fallbackPlacements: p2,
        fallbackStrategy: f2 = "bestFit",
        fallbackAxisSideDirection: v2 = "none",
        flipAlignment: m4 = true,
        ...h4
      } = Pe(n2, e3), g2 = Be(o2), S4 = Be(i3) === i3, E2 = await (r2.isRTL == null ? void 0 : r2.isRTL(u3.floating)), O3 = p2 || (S4 || !m4 ? [Mt(i3)] : fi(i3));
      !p2 && v2 !== "none" && O3.push(...mi(i3, m4, v2, E2));
      const P = [i3, ...O3], T3 = await dt(e3, h4), D2 = [];
      let I2 = ((t3 = a4.flip) == null ? void 0 : t3.overflows) || [];
      if (d4 && D2.push(T3[g2]), c3) {
        const F2 = pi(o2, s4, E2);
        D2.push(T3[F2[0]], T3[F2[1]]);
      }
      if (I2 = [...I2, {
        placement: o2,
        overflows: D2
      }], !D2.every((F2) => F2 <= 0)) {
        var H4, A2;
        const F2 = (((H4 = a4.flip) == null ? void 0 : H4.index) || 0) + 1, z2 = P[F2];
        if (z2)
          return {
            data: {
              index: F2,
              overflows: I2
            },
            reset: {
              placement: z2
            }
          };
        let U = (A2 = I2.filter((Q2) => Q2.overflows[0] <= 0).sort((Q2, ne) => Q2.overflows[1] - ne.overflows[1])[0]) == null ? void 0 : A2.placement;
        if (!U)
          switch (f2) {
            case "bestFit": {
              var V;
              const Q2 = (V = I2.map((ne) => [ne.placement, ne.overflows.filter((re) => re > 0).reduce((re, Ue2) => re + Ue2, 0)]).sort((ne, re) => ne[1] - re[1])[0]) == null ? void 0 : V[0];
              Q2 && (U = Q2);
              break;
            }
            case "initialPlacement":
              U = i3;
              break;
          }
        if (o2 !== U)
          return {
            reset: {
              placement: U
            }
          };
      }
      return {};
    }
  };
};
function Mo(n2, e3) {
  return {
    top: n2.top - e3.height,
    right: n2.right - e3.width,
    bottom: n2.bottom - e3.height,
    left: n2.left - e3.width
  };
}
function ko(n2) {
  return ui.some((e3) => n2[e3] >= 0);
}
const _i = function(n2) {
  return n2 === void 0 && (n2 = {}), {
    name: "hide",
    options: n2,
    async fn(e3) {
      const {
        rects: t3
      } = e3, {
        strategy: o2 = "referenceHidden",
        ...a4
      } = Pe(n2, e3);
      switch (o2) {
        case "referenceHidden": {
          const s4 = await dt(e3, {
            ...a4,
            elementContext: "reference"
          }), i3 = Mo(s4, t3.reference);
          return {
            data: {
              referenceHiddenOffsets: i3,
              referenceHidden: ko(i3)
            }
          };
        }
        case "escaped": {
          const s4 = await dt(e3, {
            ...a4,
            altBoundary: true
          }), i3 = Mo(s4, t3.floating);
          return {
            data: {
              escapedOffsets: i3,
              escaped: ko(i3)
            }
          };
        }
        default:
          return {};
      }
    }
  };
};
async function wi(n2, e3) {
  const {
    placement: t3,
    platform: o2,
    elements: a4
  } = n2, s4 = await (o2.isRTL == null ? void 0 : o2.isRTL(a4.floating)), i3 = Be(t3), r2 = ot(t3), u3 = at(t3) === "y", d4 = ["left", "top"].includes(i3) ? -1 : 1, c3 = s4 && u3 ? -1 : 1, p2 = Pe(e3, n2);
  let {
    mainAxis: f2,
    crossAxis: v2,
    alignmentAxis: m4
  } = typeof p2 == "number" ? {
    mainAxis: p2,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: 0,
    crossAxis: 0,
    alignmentAxis: null,
    ...p2
  };
  return r2 && typeof m4 == "number" && (v2 = r2 === "end" ? m4 * -1 : m4), u3 ? {
    x: v2 * c3,
    y: f2 * d4
  } : {
    x: f2 * d4,
    y: v2 * c3
  };
}
const Ci = function(n2) {
  return n2 === void 0 && (n2 = 0), {
    name: "offset",
    options: n2,
    async fn(e3) {
      const {
        x: t3,
        y: o2
      } = e3, a4 = await wi(e3, n2);
      return {
        x: t3 + a4.x,
        y: o2 + a4.y,
        data: a4
      };
    }
  };
}, Ei = function(n2) {
  return n2 === void 0 && (n2 = {}), {
    name: "shift",
    options: n2,
    async fn(e3) {
      const {
        x: t3,
        y: o2,
        placement: a4
      } = e3, {
        mainAxis: s4 = true,
        crossAxis: i3 = false,
        limiter: r2 = {
          fn: (g2) => {
            let {
              x: S4,
              y: E2
            } = g2;
            return {
              x: S4,
              y: E2
            };
          }
        },
        ...u3
      } = Pe(n2, e3), d4 = {
        x: t3,
        y: o2
      }, c3 = await dt(e3, u3), p2 = at(Be(a4)), f2 = qn(p2);
      let v2 = d4[f2], m4 = d4[p2];
      if (s4) {
        const g2 = f2 === "y" ? "top" : "left", S4 = f2 === "y" ? "bottom" : "right", E2 = v2 + c3[g2], O3 = v2 - c3[S4];
        v2 = wn(E2, v2, O3);
      }
      if (i3) {
        const g2 = p2 === "y" ? "top" : "left", S4 = p2 === "y" ? "bottom" : "right", E2 = m4 + c3[g2], O3 = m4 - c3[S4];
        m4 = wn(E2, m4, O3);
      }
      const h4 = r2.fn({
        ...e3,
        [f2]: v2,
        [p2]: m4
      });
      return {
        ...h4,
        data: {
          x: h4.x - t3,
          y: h4.y - o2
        }
      };
    }
  };
}, Oi = function(n2) {
  return n2 === void 0 && (n2 = {}), {
    options: n2,
    fn(e3) {
      const {
        x: t3,
        y: o2,
        placement: a4,
        rects: s4,
        middlewareData: i3
      } = e3, {
        offset: r2 = 0,
        mainAxis: u3 = true,
        crossAxis: d4 = true
      } = Pe(n2, e3), c3 = {
        x: t3,
        y: o2
      }, p2 = at(a4), f2 = qn(p2);
      let v2 = c3[f2], m4 = c3[p2];
      const h4 = Pe(r2, e3), g2 = typeof h4 == "number" ? {
        mainAxis: h4,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...h4
      };
      if (u3) {
        const O3 = f2 === "y" ? "height" : "width", P = s4.reference[f2] - s4.floating[O3] + g2.mainAxis, T3 = s4.reference[f2] + s4.reference[O3] - g2.mainAxis;
        v2 < P ? v2 = P : v2 > T3 && (v2 = T3);
      }
      if (d4) {
        var S4, E2;
        const O3 = f2 === "y" ? "width" : "height", P = ["top", "left"].includes(Be(a4)), T3 = s4.reference[p2] - s4.floating[O3] + (P && ((S4 = i3.offset) == null ? void 0 : S4[p2]) || 0) + (P ? 0 : g2.crossAxis), D2 = s4.reference[p2] + s4.reference[O3] + (P ? 0 : ((E2 = i3.offset) == null ? void 0 : E2[p2]) || 0) - (P ? g2.crossAxis : 0);
        m4 < T3 ? m4 = T3 : m4 > D2 && (m4 = D2);
      }
      return {
        [f2]: v2,
        [p2]: m4
      };
    }
  };
}, $i = function(n2) {
  return n2 === void 0 && (n2 = {}), {
    name: "size",
    options: n2,
    async fn(e3) {
      const {
        placement: t3,
        rects: o2,
        platform: a4,
        elements: s4
      } = e3, {
        apply: i3 = () => {
        },
        ...r2
      } = Pe(n2, e3), u3 = await dt(e3, r2), d4 = Be(t3), c3 = ot(t3), p2 = at(t3) === "y", {
        width: f2,
        height: v2
      } = o2.floating;
      let m4, h4;
      d4 === "top" || d4 === "bottom" ? (m4 = d4, h4 = c3 === (await (a4.isRTL == null ? void 0 : a4.isRTL(s4.floating)) ? "start" : "end") ? "left" : "right") : (h4 = d4, m4 = c3 === "end" ? "top" : "bottom");
      const g2 = v2 - u3[m4], S4 = f2 - u3[h4], E2 = !e3.middlewareData.shift;
      let O3 = g2, P = S4;
      if (p2) {
        const D2 = f2 - u3.left - u3.right;
        P = c3 || E2 ? ut(S4, D2) : D2;
      } else {
        const D2 = v2 - u3.top - u3.bottom;
        O3 = c3 || E2 ? ut(g2, D2) : D2;
      }
      if (E2 && !c3) {
        const D2 = Le(u3.left, 0), I2 = Le(u3.right, 0), H4 = Le(u3.top, 0), A2 = Le(u3.bottom, 0);
        p2 ? P = f2 - 2 * (D2 !== 0 || I2 !== 0 ? D2 + I2 : Le(u3.left, u3.right)) : O3 = v2 - 2 * (H4 !== 0 || A2 !== 0 ? H4 + A2 : Le(u3.top, u3.bottom));
      }
      await i3({
        ...e3,
        availableWidth: P,
        availableHeight: O3
      });
      const T3 = await a4.getDimensions(s4.floating);
      return f2 !== T3.width || v2 !== T3.height ? {
        reset: {
          rects: true
        }
      } : {};
    }
  };
};
function pe(n2) {
  var e3;
  return ((e3 = n2.ownerDocument) == null ? void 0 : e3.defaultView) || window;
}
function me(n2) {
  return pe(n2).getComputedStyle(n2);
}
function Da(n2) {
  return n2 instanceof pe(n2).Node;
}
function Me(n2) {
  return Da(n2) ? (n2.nodeName || "").toLowerCase() : "#document";
}
function he(n2) {
  return n2 instanceof pe(n2).HTMLElement;
}
function Ce(n2) {
  return n2 instanceof pe(n2).Element;
}
function xo(n2) {
  return typeof ShadowRoot < "u" && (n2 instanceof pe(n2).ShadowRoot || n2 instanceof ShadowRoot);
}
function ct(n2) {
  const { overflow: e3, overflowX: t3, overflowY: o2, display: a4 } = me(n2);
  return /auto|scroll|overlay|hidden|clip/.test(e3 + o2 + t3) && !["inline", "contents"].includes(a4);
}
function Si(n2) {
  return ["table", "td", "th"].includes(Me(n2));
}
function En(n2) {
  const e3 = jn(), t3 = me(n2);
  return t3.transform !== "none" || t3.perspective !== "none" || !e3 && !!t3.backdropFilter && t3.backdropFilter !== "none" || !e3 && !!t3.filter && t3.filter !== "none" || ["transform", "perspective", "filter"].some((o2) => (t3.willChange || "").includes(o2)) || ["paint", "layout", "strict", "content"].some((o2) => (t3.contain || "").includes(o2));
}
function jn() {
  return !(typeof CSS > "u" || !CSS.supports) && CSS.supports("-webkit-backdrop-filter", "none");
}
function Jt(n2) {
  return ["html", "body", "#document"].includes(Me(n2));
}
const On = Math.min, qe = Math.max, xt = Math.round, Pt = Math.floor, Ve = (n2) => ({ x: n2, y: n2 });
function Ia(n2) {
  const e3 = me(n2);
  let t3 = parseFloat(e3.width) || 0, o2 = parseFloat(e3.height) || 0;
  const a4 = he(n2), s4 = a4 ? n2.offsetWidth : t3, i3 = a4 ? n2.offsetHeight : o2, r2 = xt(t3) !== s4 || xt(o2) !== i3;
  return r2 && (t3 = s4, o2 = i3), { width: t3, height: o2, $: r2 };
}
function Zn(n2) {
  return Ce(n2) ? n2 : n2.contextElement;
}
function Xe(n2) {
  const e3 = Zn(n2);
  if (!he(e3))
    return Ve(1);
  const t3 = e3.getBoundingClientRect(), { width: o2, height: a4, $: s4 } = Ia(e3);
  let i3 = (s4 ? xt(t3.width) : t3.width) / o2, r2 = (s4 ? xt(t3.height) : t3.height) / a4;
  return i3 && Number.isFinite(i3) || (i3 = 1), r2 && Number.isFinite(r2) || (r2 = 1), { x: i3, y: r2 };
}
const Ro = Ve(0);
function Ma(n2, e3, t3) {
  var o2, a4;
  if (e3 === void 0 && (e3 = true), !jn())
    return Ro;
  const s4 = n2 ? pe(n2) : window;
  return !t3 || e3 && t3 !== s4 ? Ro : { x: ((o2 = s4.visualViewport) == null ? void 0 : o2.offsetLeft) || 0, y: ((a4 = s4.visualViewport) == null ? void 0 : a4.offsetTop) || 0 };
}
function Ke(n2, e3, t3, o2) {
  e3 === void 0 && (e3 = false), t3 === void 0 && (t3 = false);
  const a4 = n2.getBoundingClientRect(), s4 = Zn(n2);
  let i3 = Ve(1);
  e3 && (o2 ? Ce(o2) && (i3 = Xe(o2)) : i3 = Xe(n2));
  const r2 = Ma(s4, t3, o2);
  let u3 = (a4.left + r2.x) / i3.x, d4 = (a4.top + r2.y) / i3.y, c3 = a4.width / i3.x, p2 = a4.height / i3.y;
  if (s4) {
    const f2 = pe(s4), v2 = o2 && Ce(o2) ? pe(o2) : o2;
    let m4 = f2.frameElement;
    for (; m4 && o2 && v2 !== f2; ) {
      const h4 = Xe(m4), g2 = m4.getBoundingClientRect(), S4 = getComputedStyle(m4), E2 = g2.left + (m4.clientLeft + parseFloat(S4.paddingLeft)) * h4.x, O3 = g2.top + (m4.clientTop + parseFloat(S4.paddingTop)) * h4.y;
      u3 *= h4.x, d4 *= h4.y, c3 *= h4.x, p2 *= h4.y, u3 += E2, d4 += O3, m4 = pe(m4).frameElement;
    }
  }
  return kt({ width: c3, height: p2, x: u3, y: d4 });
}
function Ee(n2) {
  return ((Da(n2) ? n2.ownerDocument : n2.document) || window.document).documentElement;
}
function jt(n2) {
  return Ce(n2) ? { scrollLeft: n2.scrollLeft, scrollTop: n2.scrollTop } : { scrollLeft: n2.pageXOffset, scrollTop: n2.pageYOffset };
}
function ka(n2) {
  return Ke(Ee(n2)).left + jt(n2).scrollLeft;
}
function je(n2) {
  if (Me(n2) === "html")
    return n2;
  const e3 = n2.assignedSlot || n2.parentNode || xo(n2) && n2.host || Ee(n2);
  return xo(e3) ? e3.host : e3;
}
function xa(n2) {
  const e3 = je(n2);
  return Jt(e3) ? n2.ownerDocument ? n2.ownerDocument.body : n2.body : he(e3) && ct(e3) ? e3 : xa(e3);
}
function Rt(n2, e3) {
  var t3;
  e3 === void 0 && (e3 = []);
  const o2 = xa(n2), a4 = o2 === ((t3 = n2.ownerDocument) == null ? void 0 : t3.body), s4 = pe(o2);
  return a4 ? e3.concat(s4, s4.visualViewport || [], ct(o2) ? o2 : []) : e3.concat(o2, Rt(o2));
}
function Fo(n2, e3, t3) {
  let o2;
  if (e3 === "viewport")
    o2 = function(a4, s4) {
      const i3 = pe(a4), r2 = Ee(a4), u3 = i3.visualViewport;
      let d4 = r2.clientWidth, c3 = r2.clientHeight, p2 = 0, f2 = 0;
      if (u3) {
        d4 = u3.width, c3 = u3.height;
        const v2 = jn();
        (!v2 || v2 && s4 === "fixed") && (p2 = u3.offsetLeft, f2 = u3.offsetTop);
      }
      return { width: d4, height: c3, x: p2, y: f2 };
    }(n2, t3);
  else if (e3 === "document")
    o2 = function(a4) {
      const s4 = Ee(a4), i3 = jt(a4), r2 = a4.ownerDocument.body, u3 = qe(s4.scrollWidth, s4.clientWidth, r2.scrollWidth, r2.clientWidth), d4 = qe(s4.scrollHeight, s4.clientHeight, r2.scrollHeight, r2.clientHeight);
      let c3 = -i3.scrollLeft + ka(a4);
      const p2 = -i3.scrollTop;
      return me(r2).direction === "rtl" && (c3 += qe(s4.clientWidth, r2.clientWidth) - u3), { width: u3, height: d4, x: c3, y: p2 };
    }(Ee(n2));
  else if (Ce(e3))
    o2 = function(a4, s4) {
      const i3 = Ke(a4, true, s4 === "fixed"), r2 = i3.top + a4.clientTop, u3 = i3.left + a4.clientLeft, d4 = he(a4) ? Xe(a4) : Ve(1);
      return { width: a4.clientWidth * d4.x, height: a4.clientHeight * d4.y, x: u3 * d4.x, y: r2 * d4.y };
    }(e3, t3);
  else {
    const a4 = Ma(n2);
    o2 = { ...e3, x: e3.x - a4.x, y: e3.y - a4.y };
  }
  return kt(o2);
}
function Ra(n2, e3) {
  const t3 = je(n2);
  return !(t3 === e3 || !Ce(t3) || Jt(t3)) && (me(t3).position === "fixed" || Ra(t3, e3));
}
function No(n2, e3) {
  return he(n2) && me(n2).position !== "fixed" ? e3 ? e3(n2) : n2.offsetParent : null;
}
function Lo(n2, e3) {
  const t3 = pe(n2);
  if (!he(n2))
    return t3;
  let o2 = No(n2, e3);
  for (; o2 && Si(o2) && me(o2).position === "static"; )
    o2 = No(o2, e3);
  return o2 && (Me(o2) === "html" || Me(o2) === "body" && me(o2).position === "static" && !En(o2)) ? t3 : o2 || function(a4) {
    let s4 = je(a4);
    for (; he(s4) && !Jt(s4); ) {
      if (En(s4))
        return s4;
      s4 = je(s4);
    }
    return null;
  }(n2) || t3;
}
function Pi(n2, e3, t3) {
  const o2 = he(e3), a4 = Ee(e3), s4 = t3 === "fixed", i3 = Ke(n2, true, s4, e3);
  let r2 = { scrollLeft: 0, scrollTop: 0 };
  const u3 = Ve(0);
  if (o2 || !o2 && !s4)
    if ((Me(e3) !== "body" || ct(a4)) && (r2 = jt(e3)), he(e3)) {
      const d4 = Ke(e3, true, s4, e3);
      u3.x = d4.x + e3.clientLeft, u3.y = d4.y + e3.clientTop;
    } else
      a4 && (u3.x = ka(a4));
  return { x: i3.left + r2.scrollLeft - u3.x, y: i3.top + r2.scrollTop - u3.y, width: i3.width, height: i3.height };
}
const Bi = { getClippingRect: function(n2) {
  let { element: e3, boundary: t3, rootBoundary: o2, strategy: a4 } = n2;
  const s4 = t3 === "clippingAncestors" ? function(d4, c3) {
    const p2 = c3.get(d4);
    if (p2)
      return p2;
    let f2 = Rt(d4).filter((g2) => Ce(g2) && Me(g2) !== "body"), v2 = null;
    const m4 = me(d4).position === "fixed";
    let h4 = m4 ? je(d4) : d4;
    for (; Ce(h4) && !Jt(h4); ) {
      const g2 = me(h4), S4 = En(h4);
      S4 || g2.position !== "fixed" || (v2 = null), (m4 ? !S4 && !v2 : !S4 && g2.position === "static" && v2 && ["absolute", "fixed"].includes(v2.position) || ct(h4) && !S4 && Ra(d4, h4)) ? f2 = f2.filter((E2) => E2 !== h4) : v2 = g2, h4 = je(h4);
    }
    return c3.set(d4, f2), f2;
  }(e3, this._c) : [].concat(t3), i3 = [...s4, o2], r2 = i3[0], u3 = i3.reduce((d4, c3) => {
    const p2 = Fo(e3, c3, a4);
    return d4.top = qe(p2.top, d4.top), d4.right = On(p2.right, d4.right), d4.bottom = On(p2.bottom, d4.bottom), d4.left = qe(p2.left, d4.left), d4;
  }, Fo(e3, r2, a4));
  return { width: u3.right - u3.left, height: u3.bottom - u3.top, x: u3.left, y: u3.top };
}, convertOffsetParentRelativeRectToViewportRelativeRect: function(n2) {
  let { rect: e3, offsetParent: t3, strategy: o2 } = n2;
  const a4 = he(t3), s4 = Ee(t3);
  if (t3 === s4)
    return e3;
  let i3 = { scrollLeft: 0, scrollTop: 0 }, r2 = Ve(1);
  const u3 = Ve(0);
  if ((a4 || !a4 && o2 !== "fixed") && ((Me(t3) !== "body" || ct(s4)) && (i3 = jt(t3)), he(t3))) {
    const d4 = Ke(t3);
    r2 = Xe(t3), u3.x = d4.x + t3.clientLeft, u3.y = d4.y + t3.clientTop;
  }
  return { width: e3.width * r2.x, height: e3.height * r2.y, x: e3.x * r2.x - i3.scrollLeft * r2.x + u3.x, y: e3.y * r2.y - i3.scrollTop * r2.y + u3.y };
}, isElement: Ce, getDimensions: function(n2) {
  return Ia(n2);
}, getOffsetParent: Lo, getDocumentElement: Ee, getScale: Xe, async getElementRects(n2) {
  let { reference: e3, floating: t3, strategy: o2 } = n2;
  const a4 = this.getOffsetParent || Lo, s4 = this.getDimensions;
  return { reference: Pi(e3, await a4(t3), o2), floating: { x: 0, y: 0, ...await s4(t3) } };
}, getClientRects: (n2) => Array.from(n2.getClientRects()), isRTL: (n2) => me(n2).direction === "rtl" };
function Ti(n2, e3, t3, o2) {
  o2 === void 0 && (o2 = {});
  const { ancestorScroll: a4 = true, ancestorResize: s4 = true, elementResize: i3 = true, layoutShift: r2 = typeof IntersectionObserver == "function", animationFrame: u3 = false } = o2, d4 = Zn(n2), c3 = a4 || s4 ? [...d4 ? Rt(d4) : [], ...Rt(e3)] : [];
  c3.forEach((h4) => {
    a4 && h4.addEventListener("scroll", t3, { passive: true }), s4 && h4.addEventListener("resize", t3);
  });
  const p2 = d4 && r2 ? function(h4, g2) {
    let S4, E2 = null;
    const O3 = Ee(h4);
    function P() {
      clearTimeout(S4), E2 && E2.disconnect(), E2 = null;
    }
    return function T3(D2, I2) {
      D2 === void 0 && (D2 = false), I2 === void 0 && (I2 = 1), P();
      const { left: H4, top: A2, width: V, height: F2 } = h4.getBoundingClientRect();
      if (D2 || g2(), !V || !F2)
        return;
      const z2 = Pt(A2), U = Pt(O3.clientWidth - (H4 + V)), Q2 = Pt(O3.clientHeight - (A2 + F2)), ne = Pt(H4);
      let re = true;
      E2 = new IntersectionObserver((Ue2) => {
        const lt = Ue2[0].intersectionRatio;
        if (lt !== I2) {
          if (!re)
            return T3();
          lt ? T3(false, lt) : S4 = setTimeout(() => {
            T3(false, 1e-7);
          }, 100);
        }
        re = false;
      }, { rootMargin: -z2 + "px " + -U + "px " + -Q2 + "px " + -ne + "px", threshold: qe(0, On(1, I2)) || 1 }), E2.observe(h4);
    }(true), P;
  }(d4, t3) : null;
  let f2, v2 = null;
  i3 && (v2 = new ResizeObserver(t3), d4 && !u3 && v2.observe(d4), v2.observe(e3));
  let m4 = u3 ? Ke(n2) : null;
  return u3 && function h4() {
    const g2 = Ke(n2);
    !m4 || g2.x === m4.x && g2.y === m4.y && g2.width === m4.width && g2.height === m4.height || t3(), m4 = g2, f2 = requestAnimationFrame(h4);
  }(), t3(), () => {
    c3.forEach((h4) => {
      a4 && h4.removeEventListener("scroll", t3), s4 && h4.removeEventListener("resize", t3);
    }), p2 && p2(), v2 && v2.disconnect(), v2 = null, u3 && cancelAnimationFrame(f2);
  };
}
const Ai = (n2, e3, t3) => {
  const o2 = /* @__PURE__ */ new Map(), a4 = { platform: Bi, ...t3 }, s4 = { ...a4.platform, _c: o2 };
  return yi(n2, e3, { ...a4, platform: s4 });
};
function $n(n2) {
  var e3;
  return (e3 = n2 == null ? void 0 : n2.$el) != null ? e3 : n2;
}
function Di(n2) {
  return {
    name: "arrow",
    options: n2,
    fn(e3) {
      const t3 = $n(unref(n2.element));
      return t3 == null ? {} : gi({
        element: t3,
        padding: n2.padding
      }).fn(e3);
    }
  };
}
function Fa(n2) {
  return typeof window > "u" ? 1 : (n2.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function Vo(n2, e3) {
  const t3 = Fa(n2);
  return Math.round(e3 * t3) / t3;
}
function Ii(n2, e3, t3) {
  t3 === void 0 && (t3 = {});
  const o2 = t3.whileElementsMounted, a4 = computed(() => {
    var I2;
    return (I2 = unref(t3.open)) != null ? I2 : true;
  }), s4 = computed(() => unref(t3.middleware)), i3 = computed(() => {
    var I2;
    return (I2 = unref(t3.placement)) != null ? I2 : "bottom";
  }), r2 = computed(() => {
    var I2;
    return (I2 = unref(t3.strategy)) != null ? I2 : "absolute";
  }), u3 = computed(() => {
    var I2;
    return (I2 = unref(t3.transform)) != null ? I2 : true;
  }), d4 = computed(() => $n(n2.value)), c3 = computed(() => $n(e3.value)), p2 = ref(0), f2 = ref(0), v2 = ref(r2.value), m4 = ref(i3.value), h4 = shallowRef({}), g2 = ref(false), S4 = computed(() => {
    const I2 = {
      position: v2.value,
      left: "0",
      top: "0"
    };
    if (!c3.value)
      return I2;
    const H4 = Vo(c3.value, p2.value), A2 = Vo(c3.value, f2.value);
    return u3.value ? {
      ...I2,
      transform: "translate(" + H4 + "px, " + A2 + "px)",
      ...Fa(c3.value) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: v2.value,
      left: H4 + "px",
      top: A2 + "px"
    };
  });
  let E2;
  function O3() {
    d4.value == null || c3.value == null || Ai(d4.value, c3.value, {
      middleware: s4.value,
      placement: i3.value,
      strategy: r2.value
    }).then((I2) => {
      p2.value = I2.x, f2.value = I2.y, v2.value = I2.strategy, m4.value = I2.placement, h4.value = I2.middlewareData, g2.value = true;
    });
  }
  function P() {
    typeof E2 == "function" && (E2(), E2 = void 0);
  }
  function T3() {
    if (P(), o2 === void 0) {
      O3();
      return;
    }
    if (d4.value != null && c3.value != null) {
      E2 = o2(d4.value, c3.value, O3);
      return;
    }
  }
  function D2() {
    a4.value || (g2.value = false);
  }
  return watch([s4, i3, r2], O3, {
    flush: "sync"
  }), watch([d4, c3], T3, {
    flush: "sync"
  }), watch(a4, D2, {
    flush: "sync"
  }), getCurrentScope() && onScopeDispose(P), {
    x: shallowReadonly(p2),
    y: shallowReadonly(f2),
    strategy: shallowReadonly(v2),
    placement: shallowReadonly(m4),
    middlewareData: shallowReadonly(h4),
    isPositioned: shallowReadonly(g2),
    floatingStyles: S4,
    update: O3
  };
}
function Mi(n2) {
  return n2 !== null;
}
function ki(n2) {
  return {
    name: "transformOrigin",
    options: n2,
    fn(e3) {
      var g2, S4, E2;
      const { placement: t3, rects: o2, middlewareData: a4 } = e3, i3 = ((g2 = a4.arrow) == null ? void 0 : g2.centerOffset) !== 0, r2 = i3 ? 0 : n2.arrowWidth, u3 = i3 ? 0 : n2.arrowHeight, [d4, c3] = Sn(t3), p2 = { start: "0%", center: "50%", end: "100%" }[c3], f2 = (((S4 = a4.arrow) == null ? void 0 : S4.x) ?? 0) + r2 / 2, v2 = (((E2 = a4.arrow) == null ? void 0 : E2.y) ?? 0) + u3 / 2;
      let m4 = "", h4 = "";
      return d4 === "bottom" ? (m4 = i3 ? p2 : `${f2}px`, h4 = `${-u3}px`) : d4 === "top" ? (m4 = i3 ? p2 : `${f2}px`, h4 = `${o2.floating.height + u3}px`) : d4 === "right" ? (m4 = `${-u3}px`, h4 = i3 ? p2 : `${v2}px`) : d4 === "left" && (m4 = `${o2.floating.width + u3}px`, h4 = i3 ? p2 : `${v2}px`), { data: { x: m4, y: h4 } };
    }
  };
}
function Sn(n2) {
  const [e3, t3 = "center"] = n2.split("-");
  return [e3, t3];
}
const ve = {
  side: "bottom",
  sideOffset: 0,
  align: "center",
  alignOffset: 0,
  arrowPadding: 0,
  avoidCollisions: true,
  collisionBoundary: () => [],
  collisionPadding: 0,
  sticky: "partial",
  hideWhenDetached: false,
  updatePositionStrategy: "optimized",
  prioritizePosition: false
}, Na = Symbol(), xi = {
  inheritAttrs: false
}, ht = /* @__PURE__ */ defineComponent({
  ...xi,
  __name: "PopperContent",
  props: mergeDefaults({
    side: {},
    sideOffset: {},
    align: {},
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean },
    updatePositionStrategy: {},
    onPlaced: { type: Function },
    prioritizePosition: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  }, {
    ...ve
  }),
  setup(n2, { expose: e3 }) {
    const t3 = n2, o2 = inject(Gn), { primitiveElement: a4, currentElement: s4 } = K2(), i3 = ref(), r2 = ref(), { width: u3, height: d4 } = na(r2), c3 = computed(
      () => t3.side + (t3.align !== "center" ? `-${t3.align}` : "")
    ), p2 = computed(() => typeof t3.collisionPadding == "number" ? t3.collisionPadding : { top: 0, right: 0, bottom: 0, left: 0, ...t3.collisionPadding }), f2 = computed(() => Array.isArray(t3.collisionBoundary) ? t3.collisionBoundary : [t3.collisionBoundary]), v2 = computed(() => ({
      padding: p2.value,
      boundary: f2.value.filter(Mi),
      // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
      altBoundary: f2.value.length > 0
    })), m4 = Es(() => [
      Ci({
        mainAxis: t3.sideOffset + d4.value,
        alignmentAxis: t3.alignOffset
      }),
      t3.avoidCollisions && Ei({
        mainAxis: true,
        crossAxis: !!t3.prioritizePosition,
        limiter: t3.sticky === "partial" ? Oi() : void 0,
        ...v2.value
      }),
      !t3.prioritizePosition && t3.avoidCollisions && bi({
        ...v2.value
      }),
      $i({
        ...v2.value,
        apply: ({ elements: A2, rects: V, availableWidth: F2, availableHeight: z2 }) => {
          const { width: U, height: Q2 } = V.reference, ne = A2.floating.style;
          Object.assign(A2.floating.style, {
            maxWidth: `${F2}px`,
            maxHeight: `${z2}px`
          }), ne.setProperty(
            "--radix-popper-available-width",
            `${F2}px`
          ), ne.setProperty(
            "--radix-popper-available-height",
            `${z2}px`
          ), ne.setProperty(
            "--radix-popper-anchor-width",
            `${U}px`
          ), ne.setProperty(
            "--radix-popper-anchor-height",
            `${Q2}px`
          );
        }
      }),
      r2.value && Di({ element: r2.value, padding: t3.arrowPadding }),
      ki({
        arrowWidth: u3.value,
        arrowHeight: d4.value
      }),
      t3.hideWhenDetached && _i({ strategy: "referenceHidden", ...v2.value })
    ]), { floatingStyles: h4, placement: g2, isPositioned: S4, middlewareData: E2 } = Ii(
      o2.anchor,
      i3,
      {
        strategy: "fixed",
        placement: c3,
        whileElementsMounted: (...A2) => Ti(...A2, {
          animationFrame: t3.updatePositionStrategy === "always"
        }),
        middleware: m4
      }
    ), O3 = computed(
      () => Sn(g2.value)[0]
    ), P = computed(
      () => Sn(g2.value)[1]
    );
    watchEffect(() => {
      var A2;
      S4.value && ((A2 = t3.onPlaced) == null || A2.call(t3));
    });
    const T3 = computed(
      () => {
        var A2;
        return ((A2 = E2.value.arrow) == null ? void 0 : A2.centerOffset) !== 0;
      }
    ), D2 = ref("");
    watchEffect(() => {
      s4.value && (D2.value = window.getComputedStyle(s4.value).zIndex);
    });
    const I2 = computed(() => {
      var A2;
      return ((A2 = E2.value.arrow) == null ? void 0 : A2.x) ?? 0;
    }), H4 = computed(() => {
      var A2;
      return ((A2 = E2.value.arrow) == null ? void 0 : A2.y) ?? 0;
    });
    return provide(Na, {
      placedSide: O3,
      onArrowChange: (A2) => {
        r2.value = A2;
      },
      arrowX: I2,
      arrowY: H4,
      shouldHideArrow: T3
    }), e3({
      $el: s4
    }), (A2, V) => {
      var F2, z2, U;
      return openBlock(), createElementBlock("div", {
        ref_key: "floatingRef",
        ref: i3,
        "data-radix-popper-content-wrapper": "",
        style: normalizeStyle({
          ...unref(h4),
          transform: unref(S4) ? unref(h4).transform : "translate(0, -200%)",
          // keep off the page when measuring
          minWidth: "max-content",
          zIndex: D2.value,
          ["--radix-popper-transform-origin"]: [
            (F2 = unref(E2).transformOrigin) == null ? void 0 : F2.x,
            (z2 = unref(E2).transformOrigin) == null ? void 0 : z2.y
          ].join(" ")
        })
      }, [
        createVNode(unref(x2), mergeProps({
          ref_key: "primitiveElement",
          ref: a4
        }, A2.$attrs, {
          "as-child": t3.asChild,
          as: A2.as,
          "data-side": O3.value,
          "data-align": P.value,
          style: {
            // if the PopperContent hasn't been placed yet (not all measurements done)
            // we prevent animations so that users's animation don't kick in too early referring wrong sides
            animation: unref(S4) ? void 0 : "none",
            // hide the content if using the hide middleware and should be hidden
            opacity: (U = unref(E2).hide) != null && U.referenceHidden ? 0 : void 0
          }
        }), {
          default: withCtx(() => [
            renderSlot(A2.$slots, "default")
          ]),
          _: 3
        }, 16, ["as-child", "as", "data-side", "data-align", "style"])
      ], 4);
    };
  }
}), Ri = /* @__PURE__ */ createBaseVNode("polygon", { points: "0,0 30,0 15,10" }, null, -1), Fi = /* @__PURE__ */ defineComponent({
  __name: "Arrow",
  props: {
    width: { default: 10 },
    height: { default: 5 },
    asChild: { type: Boolean },
    as: { default: "svg" }
  },
  setup(n2) {
    const e3 = n2, { primitiveElement: t3 } = K2();
    return (o2, a4) => (openBlock(), createBlock(unref(x2), mergeProps({
      ref_key: "primitiveElement",
      ref: t3
    }, e3, {
      width: o2.width,
      height: o2.height,
      viewBox: "0 0 30 10",
      preserveAspectRatio: "none"
    }), {
      default: withCtx(() => [
        renderSlot(o2.$slots, "default", {}, () => [
          Ri
        ])
      ]),
      _: 3
    }, 16, ["width", "height"]));
  }
}), Ni = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
}, Li = {
  inheritAttrs: false
}, yt = /* @__PURE__ */ defineComponent({
  ...Li,
  __name: "PopperArrow",
  props: {
    width: {},
    height: {},
    asChild: { type: Boolean },
    as: { default: "svg" }
  },
  setup(n2) {
    const e3 = inject(Na), t3 = computed(
      () => e3 != null && e3.placedSide ? Ni[e3 == null ? void 0 : e3.placedSide.value] : ""
    );
    return (o2, a4) => {
      var s4, i3, r2, u3;
      return openBlock(), createElementBlock("span", {
        ref: (d4) => {
          unref(e3).onArrowChange(d4);
        },
        style: normalizeStyle({
          position: "absolute",
          left: (s4 = unref(e3).arrowX) != null && s4.value ? `${(i3 = unref(e3).arrowX) == null ? void 0 : i3.value}px` : void 0,
          top: (r2 = unref(e3).arrowY) != null && r2.value ? `${(u3 = unref(e3).arrowY) == null ? void 0 : u3.value}px` : void 0,
          [t3.value]: 0,
          transformOrigin: {
            top: "",
            right: "0 0",
            bottom: "center 0",
            left: "100% 0"
          }[unref(e3).placedSide.value],
          transform: {
            top: "translateY(100%)",
            right: "translateY(50%) rotate(90deg) translateX(-50%)",
            bottom: "rotate(180deg)",
            left: "translateY(50%) rotate(-90deg) translateX(50%)"
          }[unref(e3).placedSide.value],
          visibility: unref(e3).shouldHideArrow.value ? "hidden" : void 0
        })
      }, [
        createVNode(Fi, mergeProps(o2.$attrs, {
          style: {
            display: "block"
          },
          as: o2.as,
          "as-child": o2.asChild
        }), null, 16, ["as", "as-child"])
      ], 4);
    };
  }
}), La = "tooltip.open";
function Vi(n2, e3) {
  const t3 = Math.abs(e3.top - n2.y), o2 = Math.abs(e3.bottom - n2.y), a4 = Math.abs(e3.right - n2.x), s4 = Math.abs(e3.left - n2.x);
  switch (Math.min(t3, o2, a4, s4)) {
    case s4:
      return "left";
    case a4:
      return "right";
    case t3:
      return "top";
    case o2:
      return "bottom";
    default:
      throw new Error("unreachable");
  }
}
function Ki(n2, e3, t3 = 5) {
  const o2 = [];
  switch (e3) {
    case "top":
      o2.push(
        { x: n2.x - t3, y: n2.y + t3 },
        { x: n2.x + t3, y: n2.y + t3 }
      );
      break;
    case "bottom":
      o2.push(
        { x: n2.x - t3, y: n2.y - t3 },
        { x: n2.x + t3, y: n2.y - t3 }
      );
      break;
    case "left":
      o2.push(
        { x: n2.x + t3, y: n2.y - t3 },
        { x: n2.x + t3, y: n2.y + t3 }
      );
      break;
    case "right":
      o2.push(
        { x: n2.x - t3, y: n2.y - t3 },
        { x: n2.x - t3, y: n2.y + t3 }
      );
      break;
  }
  return o2;
}
function Hi(n2) {
  const { top: e3, right: t3, bottom: o2, left: a4 } = n2;
  return [
    { x: a4, y: e3 },
    { x: t3, y: e3 },
    { x: t3, y: o2 },
    { x: a4, y: o2 }
  ];
}
function Wi(n2, e3) {
  const { x: t3, y: o2 } = n2;
  let a4 = false;
  for (let s4 = 0, i3 = e3.length - 1; s4 < e3.length; i3 = s4++) {
    const r2 = e3[s4].x, u3 = e3[s4].y, d4 = e3[i3].x, c3 = e3[i3].y;
    u3 > o2 != c3 > o2 && t3 < (d4 - r2) * (o2 - u3) / (c3 - u3) + r2 && (a4 = !a4);
  }
  return a4;
}
function zi(n2) {
  const e3 = n2.slice();
  return e3.sort((t3, o2) => t3.x < o2.x ? -1 : t3.x > o2.x ? 1 : t3.y < o2.y ? -1 : t3.y > o2.y ? 1 : 0), Ui(e3);
}
function Ui(n2) {
  if (n2.length <= 1)
    return n2.slice();
  const e3 = [];
  for (let o2 = 0; o2 < n2.length; o2++) {
    const a4 = n2[o2];
    for (; e3.length >= 2; ) {
      const s4 = e3[e3.length - 1], i3 = e3[e3.length - 2];
      if ((s4.x - i3.x) * (a4.y - i3.y) >= (s4.y - i3.y) * (a4.x - i3.x))
        e3.pop();
      else
        break;
    }
    e3.push(a4);
  }
  e3.pop();
  const t3 = [];
  for (let o2 = n2.length - 1; o2 >= 0; o2--) {
    const a4 = n2[o2];
    for (; t3.length >= 2; ) {
      const s4 = t3[t3.length - 1], i3 = t3[t3.length - 2];
      if ((s4.x - i3.x) * (a4.y - i3.y) >= (s4.y - i3.y) * (a4.x - i3.x))
        t3.pop();
      else
        break;
    }
    t3.push(a4);
  }
  return t3.pop(), e3.length === 1 && t3.length === 1 && e3[0].x === t3[0].x && e3[0].y === t3[0].y ? e3 : e3.concat(t3);
}
const [Qn, Yi] = aa("TooltipProvider"), [Zt, Gi] = aa("TooltipRoot"), eo = /* @__PURE__ */ defineComponent({
  __name: "VisuallyHidden",
  props: {
    asChild: { type: Boolean },
    as: { default: "span" }
  },
  setup(n2) {
    return (e3, t3) => (openBlock(), createBlock(unref(x2), {
      as: e3.as,
      "as-child": e3.asChild,
      style: normalizeStyle({
        // See: https://github.com/twbs/bootstrap/blob/master/scss/mixins/_screen-reader.scss
        position: "absolute",
        border: 0,
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        wordWrap: "normal"
      })
    }, {
      default: withCtx(() => [
        renderSlot(e3.$slots, "default")
      ]),
      _: 3
    }, 8, ["as", "as-child", "style"]));
  }
}), Va = /* @__PURE__ */ defineComponent({
  __name: "TooltipContentImpl",
  props: {
    ariaLabel: {},
    asChild: { type: Boolean, default: false },
    as: {},
    side: { default: "top" },
    sideOffset: { default: 0 },
    align: { default: "center" },
    alignOffset: {},
    avoidCollisions: { type: Boolean, default: true },
    collisionBoundary: { default: () => [] },
    collisionPadding: { default: 0 },
    arrowPadding: { default: 0 },
    sticky: { default: "partial" },
    hideWhenDetached: { type: Boolean, default: false }
  },
  emits: ["escapeKeyDown", "pointerDownOutside"],
  setup(n2, { emit: e3 }) {
    const t3 = n2, o2 = ref(), a4 = Zt(), s4 = computed(() => {
      var c3, p2;
      if (t3.ariaLabel)
        return t3.ariaLabel;
      const r2 = (p2 = (c3 = useSlots()).default) == null ? void 0 : p2.call(c3);
      let u3 = "";
      function d4(f2) {
        typeof f2.children == "string" ? u3 += f2.children : Array.isArray(f2.children) && f2.children.forEach((v2) => d4(v2));
      }
      return r2 == null || r2.forEach((f2) => d4(f2)), u3;
    }), i3 = computed(() => {
      const { ariaLabel: r2, ...u3 } = t3;
      return u3;
    });
    return onMounted(() => {
      Je(window, "scroll", (r2) => {
        const u3 = r2.target;
        u3 != null && u3.contains(a4.trigger.value) && a4.onClose();
      }), Je(window, La, a4.onClose);
    }), (r2, u3) => (openBlock(), createBlock(unref(ze), {
      "as-child": "",
      "disable-outside-pointer-events": false,
      onEscapeKeyDown: u3[0] || (u3[0] = (d4) => e3("escapeKeyDown", d4)),
      onPointerDownOutside: u3[1] || (u3[1] = (d4) => e3("pointerDownOutside", d4)),
      onFocusOutside: u3[2] || (u3[2] = withModifiers(() => {
      }, ["prevent"])),
      onDismiss: u3[3] || (u3[3] = (d4) => unref(a4).onClose())
    }, {
      default: withCtx(() => [
        createVNode(unref(ht), mergeProps({
          ref_key: "contentElement",
          ref: o2,
          "data-state": unref(a4).stateAttribute.value
        }, { ...r2.$attrs, ...i3.value }, { style: {
          "--radix-tooltip-content-transform-origin": "var(--radix-popper-transform-origin)",
          "--radix-tooltip-content-available-width": "var(--radix-popper-available-width)",
          "--radix-tooltip-content-available-height": "var(--radix-popper-available-height)",
          "--radix-tooltip-trigger-width": "var(--radix-popper-anchor-width)",
          "--radix-tooltip-trigger-height": "var(--radix-popper-anchor-height)"
        } }), {
          default: withCtx(() => [
            renderSlot(r2.$slots, "default"),
            createVNode(unref(eo), {
              id: unref(a4).contentId,
              role: "tooltip"
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(s4.value), 1)
              ]),
              _: 1
            }, 8, ["id"])
          ]),
          _: 3
        }, 16, ["data-state", "style"])
      ]),
      _: 3
    }));
  }
}), qi = /* @__PURE__ */ defineComponent({
  __name: "TooltipContentHoverable",
  props: {
    ariaLabel: {},
    asChild: { type: Boolean },
    as: {},
    side: {},
    sideOffset: {},
    align: {},
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean }
  },
  setup(n2) {
    const e3 = n2, { primitiveElement: t3, currentElement: o2 } = K2(), { trigger: a4, onClose: s4 } = Zt(), i3 = Qn(), r2 = ref(null);
    function u3() {
      r2.value = null, i3.onPointerInTransitChange(false);
    }
    function d4(c3, p2) {
      const f2 = c3.currentTarget, v2 = { x: c3.clientX, y: c3.clientY }, m4 = Vi(v2, f2.getBoundingClientRect()), h4 = Ki(v2, m4), g2 = Hi(p2.getBoundingClientRect()), S4 = zi([...h4, ...g2]);
      r2.value = S4, i3.onPointerInTransitChange(true);
    }
    return watchEffect((c3) => {
      if (a4.value && o2.value) {
        const p2 = (v2) => d4(v2, o2.value), f2 = (v2) => d4(v2, a4.value);
        a4.value.addEventListener("pointerleave", p2), o2.value.addEventListener("pointerleave", f2), c3(() => {
          var v2, m4;
          (v2 = a4.value) == null || v2.removeEventListener("pointerleave", p2), (m4 = o2.value) == null || m4.removeEventListener("pointerleave", f2);
        });
      }
    }), watchEffect((c3) => {
      if (r2.value) {
        const p2 = (f2) => {
          var S4, E2;
          if (!r2.value)
            return;
          const v2 = f2.target, m4 = { x: f2.clientX, y: f2.clientY }, h4 = ((S4 = a4.value) == null ? void 0 : S4.contains(v2)) || ((E2 = o2.value) == null ? void 0 : E2.contains(v2)), g2 = !Wi(m4, r2.value);
          h4 ? u3() : g2 && (u3(), s4());
        };
        document.addEventListener("pointermove", p2), c3(() => document.removeEventListener("pointermove", p2));
      }
    }), (c3, p2) => (openBlock(), createBlock(Va, mergeProps({
      ref_key: "primitiveElement",
      ref: t3
    }, e3), {
      default: withCtx(() => [
        renderSlot(c3.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
});
/* @__PURE__ */ defineComponent({
  __name: "TooltipContent",
  props: mergeDefaults({
    ariaLabel: {},
    asChild: { type: Boolean },
    as: {},
    side: {},
    sideOffset: {},
    align: {},
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean }
  }, {
    ...ve,
    side: "top"
  }),
  emits: ["escapeKeyDown", "pointerDownOutside"],
  setup(n2, { emit: e3 }) {
    const t3 = n2, o2 = J(e3), a4 = Zt();
    return (s4, i3) => unref(a4).open.value ? (openBlock(), createBlock(resolveDynamicComponent(unref(a4).disableHoverableContent.value ? Va : qi), normalizeProps(mergeProps({ key: 0 }, { ...t3, ...unref(o2) })), {
      default: withCtx(() => [
        renderSlot(s4.$slots, "default")
      ]),
      _: 3
    }, 16)) : createCommentVNode("", true);
  }
});
const Qt = Symbol();
function Ft(n2) {
  return (e3) => e3.pointerType === "touch" ? void 0 : n2();
}
function Xi(n2) {
  const e3 = [], t3 = document.createTreeWalker(n2, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (o2) => o2.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
  });
  for (; t3.nextNode(); )
    e3.push(t3.currentNode);
  return e3;
}
const Ji = /* @__PURE__ */ defineComponent({
  __name: "HoverCardContentImpl",
  props: {
    side: {},
    sideOffset: {},
    align: {},
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean },
    updatePositionStrategy: {},
    onPlaced: { type: Function },
    prioritizePosition: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "dismiss"],
  setup(n2, { emit: e3 }) {
    const t3 = n2, { primitiveElement: o2, currentElement: a4 } = K2(), s4 = inject(Qt), i3 = ref(false);
    let r2;
    watchEffect((d4) => {
      if (i3.value) {
        const c3 = document.body;
        r2 = c3.style.userSelect || c3.style.webkitUserSelect, c3.style.userSelect = "none", c3.style.webkitUserSelect = "none", d4(() => {
          c3.style.userSelect = r2, c3.style.webkitUserSelect = r2;
        });
      }
    });
    function u3() {
      i3.value = false, s4.isPointerDownOnContentRef.value = false, nextTick(() => {
        var c3;
        ((c3 = document.getSelection()) == null ? void 0 : c3.toString()) !== "" && (s4.hasSelectionRef.value = true);
      });
    }
    return onMounted(() => {
      a4.value && (document.addEventListener("pointerup", u3), Xi(a4.value).forEach((c3) => c3.setAttribute("tabindex", "-1")));
    }), onUnmounted(() => {
      document.removeEventListener("pointerup", u3), s4.hasSelectionRef.value = false, s4.isPointerDownOnContentRef.value = false;
    }), (d4, c3) => {
      var p2;
      return openBlock(), createBlock(unref(ze), {
        "as-child": "",
        "disable-outside-pointer-events": false,
        onEscapeKeyDown: c3[1] || (c3[1] = (f2) => e3("escapeKeyDown", f2)),
        onPointerDownOutside: c3[2] || (c3[2] = (f2) => e3("pointerDownOutside", f2)),
        onFocusOutside: c3[3] || (c3[3] = withModifiers((f2) => e3("focusOutside", f2), ["prevent"])),
        onDismiss: (p2 = unref(s4)) == null ? void 0 : p2.onDismiss
      }, {
        default: withCtx(() => {
          var f2;
          return [
            createVNode(unref(ht), mergeProps({
              ref_key: "primitiveElement",
              ref: o2
            }, { ...t3, ...d4.$attrs }, {
              "data-state": (f2 = unref(s4)) != null && f2.open.value ? "open" : "closed",
              style: {
                userSelect: i3.value ? "text" : void 0,
                // Safari requires prefix
                WebkitUserSelect: i3.value ? "text" : void 0,
                // re-namespace exposed content custom properties
                "--radix-hover-card-content-transform-origin": "var(--radix-popper-transform-origin)",
                "--radix-hover-card-content-available-width": "var(--radix-popper-available-width)",
                "--radix-hover-card-content-available-height": "var(--radix-popper-available-height)",
                "--radix-hover-card-trigger-width": "var(--radix-popper-anchor-width)",
                "--radix-hover-card-trigger-height": "var(--radix-popper-anchor-height)"
              },
              onPointerdown: c3[0] || (c3[0] = (v2) => {
                v2.currentTarget.contains(v2.target) && (i3.value = true), unref(s4).hasSelectionRef.value = false, unref(s4).isPointerDownOnContentRef.value = true;
              })
            }), {
              default: withCtx(() => [
                renderSlot(d4.$slots, "default")
              ]),
              _: 3
            }, 16, ["data-state", "style"])
          ];
        }),
        _: 3
      }, 8, ["onDismiss"]);
    };
  }
});
/* @__PURE__ */ defineComponent({
  __name: "HoverCardContent",
  props: mergeDefaults({
    side: {},
    sideOffset: {},
    align: {},
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean },
    updatePositionStrategy: {},
    onPlaced: { type: Function },
    prioritizePosition: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  }, {
    ...ve
  }),
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "dismiss"],
  setup(n2, { emit: e3 }) {
    const t3 = n2, o2 = J(e3), a4 = inject(Qt);
    return (s4, i3) => (openBlock(), createBlock(unref(ie), {
      present: unref(a4).open.value
    }, {
      default: withCtx(() => [
        createVNode(Ji, mergeProps({ ...t3, ...unref(o2) }, {
          onPointerenter: i3[0] || (i3[0] = (r2) => unref(Ft)(unref(a4).onOpen)(r2)),
          onPointerleave: i3[1] || (i3[1] = (r2) => unref(Ft)(unref(a4).onClose)(r2))
        }), {
          default: withCtx(() => [
            renderSlot(s4.$slots, "default")
          ]),
          _: 3
        }, 16)
      ]),
      _: 3
    }, 8, ["present"]));
  }
});
const ke = Symbol(), Ka = /* @__PURE__ */ defineComponent({
  __name: "PopoverContentImpl",
  props: {
    trapFocus: { type: Boolean },
    side: {},
    sideOffset: {},
    align: {},
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean },
    updatePositionStrategy: {},
    onPlaced: { type: Function },
    prioritizePosition: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    disableOutsidePointerEvents: { type: Boolean }
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "dismiss", "openAutoFocus", "closeAutoFocus"],
  setup(n2, { emit: e3 }) {
    const t3 = n2, o2 = inject(ke);
    return xn(), (a4, s4) => (openBlock(), createBlock(unref(Xt), {
      "as-child": "",
      loop: "",
      trapped: a4.trapFocus,
      onMountAutoFocus: s4[5] || (s4[5] = (i3) => e3("openAutoFocus", i3)),
      onUnmountAutoFocus: s4[6] || (s4[6] = (i3) => e3("closeAutoFocus", i3))
    }, {
      default: withCtx(() => [
        createVNode(unref(ze), {
          "as-child": "",
          "disable-outside-pointer-events": a4.disableOutsidePointerEvents,
          onPointerDownOutside: s4[0] || (s4[0] = (i3) => e3("pointerDownOutside", i3)),
          onInteractOutside: s4[1] || (s4[1] = (i3) => e3("interactOutside", i3)),
          onEscapeKeyDown: s4[2] || (s4[2] = (i3) => e3("escapeKeyDown", i3)),
          onFocusOutside: s4[3] || (s4[3] = (i3) => e3("focusOutside", i3)),
          onDismiss: s4[4] || (s4[4] = (i3) => {
            var r2;
            return (r2 = unref(o2)) == null ? void 0 : r2.onOpenChange(false);
          })
        }, {
          default: withCtx(() => {
            var i3, r2;
            return [
              createVNode(unref(ht), mergeProps(t3, {
                id: (i3 = unref(o2)) == null ? void 0 : i3.contentId,
                "data-state": (r2 = unref(o2)) != null && r2.open.value ? "open" : "closed",
                role: "dialog",
                style: {
                  "--radix-popover-content-transform-origin": "var(--radix-popper-transform-origin)",
                  "--radix-popover-content-available-width": "var(--radix-popper-available-width)",
                  "--radix-popover-content-available-height": "var(--radix-popper-available-height)",
                  "--radix-popover-trigger-width": "var(--radix-popper-anchor-width)",
                  "--radix-popover-trigger-height": "var(--radix-popper-anchor-height)"
                }
              }), {
                default: withCtx(() => [
                  renderSlot(a4.$slots, "default")
                ]),
                _: 3
              }, 16, ["id", "data-state", "style"])
            ];
          }),
          _: 3
        }, 8, ["disable-outside-pointer-events"])
      ]),
      _: 3
    }, 8, ["trapped"]));
  }
}), ji = /* @__PURE__ */ defineComponent({
  __name: "PopoverContentModal",
  props: {
    trapFocus: { type: Boolean },
    side: {},
    sideOffset: {},
    align: {},
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean },
    updatePositionStrategy: {},
    onPlaced: { type: Function },
    prioritizePosition: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    disableOutsidePointerEvents: { type: Boolean }
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "dismiss", "openAutoFocus", "closeAutoFocus"],
  setup(n2, { emit: e3 }) {
    const t3 = n2, o2 = inject(ke), a4 = ref(false);
    Ut(true);
    const s4 = J(e3), { primitiveElement: i3, currentElement: r2 } = K2();
    return zt(r2), (u3, d4) => {
      var c3;
      return openBlock(), createBlock(Ka, mergeProps({
        ref_key: "primitiveElement",
        ref: i3
      }, { ...t3, ...unref(s4) }, {
        "trap-focus": (c3 = unref(o2)) == null ? void 0 : c3.open.value,
        "disable-outside-pointer-events": "",
        onCloseAutoFocus: d4[0] || (d4[0] = withModifiers(
          (p2) => {
            var f2, v2;
            e3("closeAutoFocus", p2), a4.value || (v2 = (f2 = unref(o2)) == null ? void 0 : f2.triggerElement.value) == null || v2.focus();
          },
          ["prevent"]
        )),
        onPointerDownOutside: d4[1] || (d4[1] = (p2) => {
          e3("pointerDownOutside", p2);
          const f2 = p2.detail.originalEvent, v2 = f2.button === 0 && f2.ctrlKey === true, m4 = f2.button === 2 || v2;
          a4.value = m4;
        }),
        onFocusOutside: d4[2] || (d4[2] = withModifiers(() => {
        }, ["prevent"]))
      }), {
        default: withCtx(() => [
          renderSlot(u3.$slots, "default")
        ]),
        _: 3
      }, 16, ["trap-focus"]);
    };
  }
}), Zi = /* @__PURE__ */ defineComponent({
  __name: "PopoverContentNonModal",
  props: {
    trapFocus: { type: Boolean },
    side: {},
    sideOffset: {},
    align: {},
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean },
    updatePositionStrategy: {},
    onPlaced: { type: Function },
    prioritizePosition: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    disableOutsidePointerEvents: { type: Boolean }
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "dismiss", "openAutoFocus", "closeAutoFocus"],
  setup(n2, { emit: e3 }) {
    const t3 = n2, o2 = inject(ke), a4 = ref(false), s4 = ref(false), i3 = J(e3);
    return (r2, u3) => (openBlock(), createBlock(Ka, mergeProps({ ...t3, ...unref(i3) }, {
      "trap-focus": false,
      "disable-outside-pointer-events": false,
      onCloseAutoFocus: u3[0] || (u3[0] = (d4) => {
        var c3, p2;
        e3("closeAutoFocus", d4), d4.defaultPrevented || (a4.value || (p2 = (c3 = unref(o2)) == null ? void 0 : c3.triggerElement.value) == null || p2.focus(), d4.preventDefault()), a4.value = false, s4.value = false;
      }),
      onInteractOutside: u3[1] || (u3[1] = async (d4) => {
        var f2, v2;
        e3("interactOutside", d4), d4.defaultPrevented || (a4.value = true, d4.detail.originalEvent.type === "pointerdown" && (s4.value = true));
        const c3 = d4.target;
        ((v2 = (f2 = unref(o2)) == null ? void 0 : f2.triggerElement.value) == null ? void 0 : v2.contains(c3)) && d4.preventDefault(), d4.detail.originalEvent.type === "focusin" && s4.value && d4.preventDefault();
      })
    }), {
      default: withCtx(() => [
        renderSlot(r2.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
});
/* @__PURE__ */ defineComponent({
  __name: "PopoverContent",
  props: mergeDefaults({
    forceMount: { type: Boolean },
    trapFocus: { type: Boolean },
    side: {},
    sideOffset: {},
    align: {},
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean },
    updatePositionStrategy: {},
    onPlaced: { type: Function },
    prioritizePosition: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    disableOutsidePointerEvents: { type: Boolean }
  }, {
    ...ve
  }),
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "dismiss", "openAutoFocus", "closeAutoFocus"],
  setup(n2, { emit: e3 }) {
    const t3 = n2, o2 = inject(ke), a4 = J(e3);
    return (s4, i3) => (openBlock(), createBlock(unref(ie), {
      present: s4.forceMount || unref(o2).open.value
    }, {
      default: withCtx(() => {
        var r2;
        return [
          (r2 = unref(o2)) != null && r2.modal.value ? (openBlock(), createBlock(ji, normalizeProps(mergeProps({ key: 0 }, { ...t3, ...unref(a4) })), {
            default: withCtx(() => [
              renderSlot(s4.$slots, "default")
            ]),
            _: 3
          }, 16)) : (openBlock(), createBlock(Zi, normalizeProps(mergeProps({ key: 1 }, { ...t3, ...unref(a4) })), {
            default: withCtx(() => [
              renderSlot(s4.$slots, "default")
            ]),
            _: 3
          }, 16))
        ];
      }),
      _: 3
    }, 8, ["present"]));
  }
});
const en = /* @__PURE__ */ defineComponent({
  __name: "MenuAnchor",
  props: {
    element: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(n2) {
    const e3 = n2;
    return (t3, o2) => (openBlock(), createBlock(unref(nt), normalizeProps(guardReactiveProps(e3)), {
      default: withCtx(() => [
        renderSlot(t3.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), to = /* @__PURE__ */ defineComponent({
  __name: "MenuArrow",
  props: {
    width: {},
    height: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(n2) {
    const e3 = n2;
    return (t3, o2) => (openBlock(), createBlock(unref(yt), normalizeProps(guardReactiveProps(e3)), {
      default: withCtx(() => [
        renderSlot(t3.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Te = Symbol(), st = Symbol(), no = /* @__PURE__ */ defineComponent({
  __name: "MenuRoot",
  props: {
    open: { type: Boolean, default: false },
    onOpenChange: {},
    dir: { default: "ltr" },
    modal: { type: Boolean, default: true }
  },
  emits: ["update:open"],
  setup(n2, { emit: e3 }) {
    const t3 = n2, { modal: o2, dir: a4 } = toRefs(t3), s4 = X2(t3, "open", e3), i3 = ref(), r2 = ref(false);
    return watchEffect((u3) => {
      if (!be)
        return;
      const d4 = () => {
        r2.value = true, document.addEventListener("pointerdown", c3, {
          capture: true,
          once: true
        }), document.addEventListener("pointermove", c3, {
          capture: true,
          once: true
        });
      }, c3 = () => r2.value = false;
      document.addEventListener("keydown", d4, { capture: true }), u3(() => {
        document.removeEventListener("keydown", d4, { capture: true }), document.removeEventListener("pointerdown", c3, {
          capture: true
        }), document.removeEventListener("pointermove", c3, {
          capture: true
        });
      });
    }), provide(Te, {
      open: s4,
      onOpenChange: (u3) => {
        s4.value = u3;
      },
      content: i3,
      onContentChange: (u3) => {
        i3.value = u3;
      }
    }), provide(st, {
      onClose: () => {
        s4.value = false;
      },
      isUsingKeyboardRef: r2,
      dir: a4,
      modal: o2
    }), (u3, d4) => (openBlock(), createBlock(unref(tt), null, {
      default: withCtx(() => [
        renderSlot(u3.$slots, "default")
      ]),
      _: 3
    }));
  }
}), tn = Symbol(), oo = /* @__PURE__ */ defineComponent({
  __name: "MenuContentImpl",
  props: mergeDefaults({
    loop: { type: Boolean },
    disableOutsidePointerEvents: { type: Boolean },
    disableOutsideScroll: { type: Boolean },
    trapFocus: { type: Boolean },
    side: {},
    sideOffset: {},
    align: {},
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean },
    updatePositionStrategy: {},
    prioritizePosition: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  }, {
    ...ve
  }),
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "dismiss", "entryFocus", "openAutoFocus", "closeAutoFocus"],
  setup(n2, { emit: e3 }) {
    const t3 = n2, o2 = inject(Te), a4 = inject(st), { trapFocus: s4, disableOutsidePointerEvents: i3, loop: r2 } = toRefs(t3);
    xn(), Ut(i3.value);
    const u3 = ref(""), d4 = ref(0), c3 = ref(0), p2 = ref(null), f2 = ref("right"), v2 = ref(0), m4 = ref(null), { createCollection: h4 } = le(), { primitiveElement: g2, currentElement: S4 } = K2(), E2 = h4(S4);
    watch(S4, (A2) => {
      o2.onContentChange(A2);
    });
    const { handleTypeaheadSearch: O3 } = Fn(E2);
    onUnmounted(() => {
      window.clearTimeout(d4.value);
    });
    function P(A2) {
      var F2, z2;
      return f2.value === ((F2 = p2.value) == null ? void 0 : F2.side) && ei(A2, (z2 = p2.value) == null ? void 0 : z2.area);
    }
    async function T3(A2) {
      var V;
      e3("openAutoFocus", A2), A2.preventDefault(), (V = S4.value) == null || V.focus();
    }
    function D2(A2) {
      const F2 = A2.target.closest("[data-radix-menu-content]") === A2.currentTarget, z2 = A2.ctrlKey || A2.altKey || A2.metaKey, U = A2.key.length === 1, Q2 = Wt(
        A2,
        document.activeElement,
        S4.value,
        {
          loop: r2.value,
          arrowKeyOptions: "vertical",
          dir: a4 == null ? void 0 : a4.dir.value,
          focus: true
        }
      );
      if (Q2)
        return Q2 == null ? void 0 : Q2.focus();
      if (A2.code === "Space" || (F2 && (A2.key === "Tab" && A2.preventDefault(), !z2 && U && O3(A2.key)), A2.target !== S4.value) || !Jl.includes(A2.key))
        return;
      A2.preventDefault();
      const ne = E2.value;
      Sa.includes(A2.key) && ne.reverse(), _n(ne);
    }
    function I2(A2) {
      var V, F2;
      (F2 = (V = A2 == null ? void 0 : A2.currentTarget) == null ? void 0 : V.contains) != null && F2.call(V, A2.target) || (window.clearTimeout(d4.value), u3.value = "");
    }
    function H4(A2) {
      var z2;
      if (!rt(A2))
        return;
      const V = A2.target, F2 = v2.value !== A2.clientX;
      if ((z2 = A2 == null ? void 0 : A2.currentTarget) != null && z2.contains(V) && F2) {
        const U = A2.clientX > v2.value ? "right" : "left";
        f2.value = U, v2.value = A2.clientX;
      }
    }
    return provide(tn, {
      onItemEnter: (A2) => {
        P(A2) && A2.preventDefault();
      },
      onItemLeave: (A2) => {
        var V;
        P(A2) || ((V = S4.value) == null || V.focus(), m4.value = null);
      },
      onTriggerLeave: (A2) => {
        P(A2) && A2.preventDefault();
      },
      searchRef: u3,
      pointerGraceTimerRef: c3,
      onPointerGraceIntentChange: (A2) => {
        p2.value = A2;
      }
    }), (A2, V) => (openBlock(), createBlock(unref(Xt), {
      "as-child": "",
      trapped: unref(s4),
      onMountAutoFocus: T3,
      onUnmountAutoFocus: V[7] || (V[7] = (F2) => e3("closeAutoFocus", F2))
    }, {
      default: withCtx(() => [
        createVNode(unref(ze), {
          "as-child": "",
          "disable-outside-pointer-events": unref(i3),
          onEscapeKeyDown: V[2] || (V[2] = (F2) => e3("escapeKeyDown", F2)),
          onPointerDownOutside: V[3] || (V[3] = (F2) => e3("pointerDownOutside", F2)),
          onFocusOutside: V[4] || (V[4] = (F2) => e3("focusOutside", F2)),
          onInteractOutside: V[5] || (V[5] = (F2) => e3("interactOutside", F2)),
          onDismiss: V[6] || (V[6] = (F2) => e3("dismiss"))
        }, {
          default: withCtx(() => {
            var F2;
            return [
              createVNode(unref(Qe), {
                "current-tab-stop-id": m4.value,
                "onUpdate:currentTabStopId": V[0] || (V[0] = (z2) => m4.value = z2),
                "as-child": "",
                orientation: "vertical",
                dir: (F2 = unref(a4)) == null ? void 0 : F2.dir.value,
                loop: unref(r2),
                onEntryFocus: V[1] || (V[1] = (z2) => {
                  var U;
                  e3("entryFocus", z2), (U = unref(a4)) != null && U.isUsingKeyboardRef.value || z2.preventDefault();
                })
              }, {
                default: withCtx(() => [
                  createVNode(unref(ht), {
                    ref_key: "primitiveElement",
                    ref: g2,
                    role: "menu",
                    as: A2.as,
                    "as-child": A2.asChild,
                    "aria-orientation": "vertical",
                    "data-radix-menu-content": "",
                    "data-state": unref(Wn)(unref(o2).open.value),
                    dir: unref(a4).dir.value,
                    side: A2.side,
                    "side-offset": A2.sideOffset,
                    align: A2.align,
                    "align-offset": A2.alignOffset,
                    "avoid-collisions": A2.avoidCollisions,
                    "collision-boundary": A2.collisionBoundary,
                    "collision-padding": A2.collisionPadding,
                    "arrow-padding": A2.arrowPadding,
                    sticky: A2.sticky,
                    "hide-when-detached": A2.hideWhenDetached,
                    onKeydown: D2,
                    onBlur: I2,
                    onPointermove: H4
                  }, {
                    default: withCtx(() => [
                      renderSlot(A2.$slots, "default")
                    ]),
                    _: 3
                  }, 8, ["as", "as-child", "data-state", "dir", "side", "side-offset", "align", "align-offset", "avoid-collisions", "collision-boundary", "collision-padding", "arrow-padding", "sticky", "hide-when-detached"])
                ]),
                _: 3
              }, 8, ["current-tab-stop-id", "dir", "loop"])
            ];
          }),
          _: 3
        }, 8, ["disable-outside-pointer-events"])
      ]),
      _: 3
    }, 8, ["trapped"]));
  }
}), Ha = /* @__PURE__ */ defineComponent({
  __name: "MenuItemImpl",
  props: {
    disabled: { type: Boolean },
    textValue: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(n2, { expose: e3 }) {
    const t3 = n2, { primitiveElement: o2, currentElement: a4 } = K2(), s4 = inject(tn), i3 = ref(false);
    async function r2(d4) {
      if (await nextTick(), !d4.defaultPrevented && rt(d4)) {
        if (t3.disabled)
          s4.onItemLeave(d4);
        else if (s4.onItemEnter(d4), !d4.defaultPrevented) {
          const c3 = d4.currentTarget;
          c3 && c3.focus();
        }
      }
    }
    async function u3(d4) {
      await nextTick(), !d4.defaultPrevented && rt(d4) && s4.onItemLeave(d4);
    }
    return e3({
      el: a4
    }), (d4, c3) => (openBlock(), createBlock(unref(x2), {
      ref_key: "primitiveElement",
      ref: o2,
      role: "menuitem",
      tabindex: "-1",
      as: d4.as,
      "as-child": d4.asChild,
      "data-radix-vue-collection-item": "",
      "aria-disabled": d4.disabled || void 0,
      "data-disabled": d4.disabled ? "" : void 0,
      disabled: d4.disabled,
      "data-highlighted": i3.value ? "" : void 0,
      onPointermove: r2,
      onPointerleave: u3,
      onFocus: c3[0] || (c3[0] = async (p2) => {
        await nextTick(), !(p2.defaultPrevented || d4.disabled) && (i3.value = true);
      }),
      onBlur: c3[1] || (c3[1] = async (p2) => {
        await nextTick(), !p2.defaultPrevented && (i3.value = false);
      })
    }, {
      default: withCtx(() => [
        renderSlot(d4.$slots, "default")
      ]),
      _: 3
    }, 8, ["as", "as-child", "aria-disabled", "data-disabled", "disabled", "data-highlighted"]));
  }
}), gt = /* @__PURE__ */ defineComponent({
  __name: "MenuItem",
  props: {
    disabled: { type: Boolean },
    textValue: {},
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["select"],
  setup(n2, { emit: e3 }) {
    const t3 = n2, { primitiveElement: o2, currentElement: a4 } = K2(), s4 = inject(st), i3 = inject(tn), r2 = ref(false);
    async function u3() {
      const d4 = a4.value;
      if (!t3.disabled && d4) {
        const c3 = new CustomEvent(ql, {
          bubbles: true,
          cancelable: true
        });
        e3("select", c3), await nextTick(), c3.defaultPrevented ? r2.value = false : s4.onClose();
      }
    }
    return (d4, c3) => (openBlock(), createBlock(Ha, mergeProps(t3, {
      ref_key: "primitiveElement",
      ref: o2,
      onClick: u3,
      onPointerdown: c3[0] || (c3[0] = () => {
        r2.value = true;
      }),
      onPointerup: c3[1] || (c3[1] = async (p2) => {
        var f2;
        await nextTick(), !p2.defaultPrevented && (r2.value || (f2 = p2.currentTarget) == null || f2.click());
      }),
      onKeydown: c3[2] || (c3[2] = async (p2) => {
        const f2 = unref(i3).searchRef.value !== "";
        d4.disabled || f2 && p2.key === " " || unref(bn).includes(p2.key) && (p2.currentTarget.click(), p2.preventDefault());
      })
    }), {
      default: withCtx(() => [
        renderSlot(d4.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), ao = Symbol(), so = /* @__PURE__ */ defineComponent({
  __name: "MenuItemIndicator",
  props: {
    asChild: { type: Boolean },
    as: { default: "span" }
  },
  setup(n2) {
    const e3 = inject(ao, {
      checked: ref(false)
    });
    return (t3, o2) => {
      var a4, s4;
      return openBlock(), createBlock(unref(ie), {
        present: unref(It)((a4 = unref(e3)) == null ? void 0 : a4.checked.value) || ((s4 = unref(e3)) == null ? void 0 : s4.checked.value) === true
      }, {
        default: withCtx(() => [
          createVNode(unref(x2), {
            as: t3.as,
            "as-child": t3.asChild,
            "data-state": unref(zn)(unref(e3).checked.value)
          }, {
            default: withCtx(() => [
              renderSlot(t3.$slots, "default")
            ]),
            _: 3
          }, 8, ["as", "as-child", "data-state"])
        ]),
        _: 3
      }, 8, ["present"]);
    };
  }
}), lo = /* @__PURE__ */ defineComponent({
  __name: "MenuCheckboxItem",
  props: {
    checked: { type: [Boolean, String], default: false },
    disabled: { type: Boolean },
    textValue: {},
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["select", "update:checked"],
  setup(n2, { emit: e3 }) {
    const t3 = n2, o2 = X2(t3, "checked", e3);
    return provide(ao, {
      checked: o2
    }), (a4, s4) => (openBlock(), createBlock(gt, mergeProps({ role: "menuitemcheckbox" }, t3, {
      "aria-checked": unref(It)(unref(o2)) ? "mixed" : unref(o2),
      "data-state": unref(zn)(unref(o2)),
      onSelect: s4[0] || (s4[0] = async (i3) => {
        e3("select", i3), unref(It)(unref(o2)) ? o2.value = true : o2.value = !unref(o2);
      })
    }), {
      default: withCtx(() => [
        renderSlot(a4.$slots, "default")
      ]),
      _: 3
    }, 16, ["aria-checked", "data-state"]));
  }
}), Qi = /* @__PURE__ */ defineComponent({
  __name: "MenuRootContentModal",
  props: {
    loop: { type: Boolean },
    side: {},
    sideOffset: {},
    align: {},
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean },
    updatePositionStrategy: {},
    prioritizePosition: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "dismiss", "entryFocus", "openAutoFocus", "closeAutoFocus"],
  setup(n2, { emit: e3 }) {
    const t3 = n2, o2 = inject(Te), a4 = J(e3), { primitiveElement: s4, currentElement: i3 } = K2();
    return zt(i3), (r2, u3) => {
      var d4, c3;
      return openBlock(), createBlock(oo, mergeProps({
        ref_key: "primitiveElement",
        ref: s4
      }, { ...t3, ...unref(a4) }, {
        "trap-focus": (d4 = unref(o2)) == null ? void 0 : d4.open.value,
        "disable-outside-pointer-events": (c3 = unref(o2)) == null ? void 0 : c3.open.value,
        "disable-outside-scroll": true,
        onDismiss: u3[0] || (u3[0] = (p2) => {
          var f2;
          return (f2 = unref(o2)) == null ? void 0 : f2.onOpenChange(false);
        }),
        onFocusOutside: u3[1] || (u3[1] = withModifiers((p2) => e3("focusOutside", p2), ["prevent"]))
      }), {
        default: withCtx(() => [
          renderSlot(r2.$slots, "default")
        ]),
        _: 3
      }, 16, ["trap-focus", "disable-outside-pointer-events"]);
    };
  }
}), er = /* @__PURE__ */ defineComponent({
  __name: "MenuRootContentNonModal",
  props: {
    loop: { type: Boolean },
    side: {},
    sideOffset: {},
    align: {},
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean },
    updatePositionStrategy: {},
    prioritizePosition: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "dismiss", "entryFocus", "openAutoFocus", "closeAutoFocus"],
  setup(n2, { emit: e3 }) {
    const t3 = n2, o2 = inject(Te), a4 = J(e3);
    return (s4, i3) => (openBlock(), createBlock(oo, mergeProps({ ...t3, ...unref(a4) }, {
      "trap-focus": false,
      "disable-outside-pointer-events": false,
      "disable-outside-scroll": false,
      onDismiss: i3[0] || (i3[0] = (r2) => {
        var u3;
        return (u3 = unref(o2)) == null ? void 0 : u3.onOpenChange(false);
      })
    }), {
      default: withCtx(() => [
        renderSlot(s4.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), io = /* @__PURE__ */ defineComponent({
  __name: "MenuContent",
  props: {
    loop: { type: Boolean },
    side: {},
    sideOffset: {},
    align: {},
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean },
    updatePositionStrategy: {},
    prioritizePosition: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "dismiss", "entryFocus", "openAutoFocus", "closeAutoFocus"],
  setup(n2, { emit: e3 }) {
    const t3 = n2, o2 = inject(Te), a4 = inject(st), s4 = J(e3);
    return (i3, r2) => (openBlock(), createBlock(unref(ie), {
      present: unref(o2).open.value
    }, {
      default: withCtx(() => {
        var u3;
        return [
          (u3 = unref(a4)) != null && u3.modal.value ? (openBlock(), createBlock(Qi, normalizeProps(mergeProps({ key: 0 }, { ...i3.$attrs, ...t3, ...unref(s4) })), {
            default: withCtx(() => [
              renderSlot(i3.$slots, "default")
            ]),
            _: 3
          }, 16)) : (openBlock(), createBlock(er, normalizeProps(mergeProps({ key: 1 }, { ...i3.$attrs, ...t3, ...unref(s4) })), {
            default: withCtx(() => [
              renderSlot(i3.$slots, "default")
            ]),
            _: 3
          }, 16))
        ];
      }),
      _: 3
    }, 8, ["present"]));
  }
}), nn = /* @__PURE__ */ defineComponent({
  __name: "MenuGroup",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(n2) {
    const e3 = n2;
    return (t3, o2) => (openBlock(), createBlock(unref(x2), mergeProps({ role: "group" }, e3), {
      default: withCtx(() => [
        renderSlot(t3.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), ro = /* @__PURE__ */ defineComponent({
  __name: "MenuLabel",
  props: {
    asChild: { type: Boolean },
    as: { default: "label" }
  },
  setup(n2) {
    const e3 = n2;
    return (t3, o2) => (openBlock(), createBlock(unref(x2), normalizeProps(guardReactiveProps(e3)), {
      default: withCtx(() => [
        renderSlot(t3.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), uo = /* @__PURE__ */ defineComponent({
  __name: "MenuPortal",
  props: {
    to: {},
    disabled: { type: Boolean },
    forceMount: { type: Boolean }
  },
  setup(n2) {
    const e3 = n2;
    return (t3, o2) => (openBlock(), createBlock(unref(We), normalizeProps(guardReactiveProps(e3)), {
      default: withCtx(() => [
        renderSlot(t3.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Wa = Symbol(), co = /* @__PURE__ */ defineComponent({
  __name: "MenuRadioGroup",
  props: {
    modelValue: { default: "" },
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["update:modelValue"],
  setup(n2, { emit: e3 }) {
    const t3 = n2, o2 = X2(t3, "modelValue", e3);
    return provide(Wa, {
      modelValue: o2,
      onValueChange: (a4) => {
        o2.value = a4;
      }
    }), (a4, s4) => (openBlock(), createBlock(nn, normalizeProps(guardReactiveProps(t3)), {
      default: withCtx(() => [
        renderSlot(a4.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), po = /* @__PURE__ */ defineComponent({
  __name: "MenuRadioItem",
  props: {
    value: {},
    disabled: { type: Boolean },
    textValue: {},
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["select"],
  setup(n2, { emit: e3 }) {
    const t3 = n2, { value: o2 } = toRefs(t3), a4 = inject(Wa), s4 = computed(
      () => (a4 == null ? void 0 : a4.modelValue.value) === (o2 == null ? void 0 : o2.value)
    );
    return provide(ao, {
      checked: s4
    }), (i3, r2) => (openBlock(), createBlock(gt, mergeProps({ role: "menuitemradio" }, t3, {
      "aria-checked": s4.value,
      "data-state": unref(zn)(s4.value),
      onSelect: r2[0] || (r2[0] = async (u3) => {
        var d4;
        e3("select", u3), (d4 = unref(a4)) == null || d4.onValueChange(unref(o2));
      })
    }), {
      default: withCtx(() => [
        renderSlot(i3.$slots, "default")
      ]),
      _: 3
    }, 16, ["aria-checked", "data-state"]));
  }
}), fo = /* @__PURE__ */ defineComponent({
  __name: "MenuSeparator",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(n2) {
    const e3 = n2;
    return (t3, o2) => (openBlock(), createBlock(unref(x2), mergeProps(e3, {
      role: "separator",
      "aria-orientation": "horizontal"
    }), {
      default: withCtx(() => [
        renderSlot(t3.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), vo = Symbol(), mo = /* @__PURE__ */ defineComponent({
  __name: "MenuSub",
  props: {
    open: { type: Boolean }
  },
  emits: ["update:open"],
  setup(n2, { emit: e3 }) {
    const o2 = X2(n2, "open", e3, {
      defaultValue: false,
      passive: true
    }), a4 = inject(Te), s4 = ref(), i3 = ref();
    return watchEffect((r2) => {
      (a4 == null ? void 0 : a4.open.value) === false && (o2.value = false), r2(() => o2.value = false);
    }), provide(Te, {
      open: o2,
      onOpenChange: (r2) => {
        o2.value = r2;
      },
      content: i3,
      onContentChange: (r2) => {
        i3.value = r2;
      }
    }), provide(vo, {
      triggerId: oe(),
      contentId: oe(),
      trigger: s4,
      onTriggerChange: (r2) => {
        s4.value = r2;
      }
    }), (r2, u3) => (openBlock(), createBlock(unref(tt), null, {
      default: withCtx(() => [
        renderSlot(r2.$slots, "default")
      ]),
      _: 3
    }));
  }
}), ho = /* @__PURE__ */ defineComponent({
  __name: "MenuSubContent",
  props: mergeDefaults({
    loop: { type: Boolean },
    disableOutsidePointerEvents: { type: Boolean },
    disableOutsideScroll: { type: Boolean },
    trapFocus: { type: Boolean },
    side: {},
    sideOffset: {},
    align: {},
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean },
    updatePositionStrategy: {},
    prioritizePosition: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  }, {
    ...ve
  }),
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "dismiss", "entryFocus", "openAutoFocus", "closeAutoFocus"],
  setup(n2, { emit: e3 }) {
    const t3 = n2, o2 = J(e3), a4 = inject(Te), s4 = inject(st), i3 = inject(vo), { primitiveElement: r2, currentElement: u3 } = K2();
    return (d4, c3) => (openBlock(), createBlock(unref(ie), {
      present: unref(a4).open.value
    }, {
      default: withCtx(() => [
        createVNode(oo, mergeProps({ ...t3, ...unref(o2) }, {
          id: unref(i3).contentId,
          ref_key: "primitiveElement",
          ref: r2,
          "aria-labelledby": unref(i3).triggerId,
          align: "start",
          side: unref(s4).dir.value === "rtl" ? "left" : "right",
          "disable-outside-pointer-events": false,
          "disable-outside-scroll": false,
          "trap-focus": false,
          onOpenAutoFocus: c3[0] || (c3[0] = (p2) => {
            var f2;
            unref(s4).isUsingKeyboardRef.value && ((f2 = unref(u3)) == null || f2.focus());
          }),
          onCloseAutoFocus: c3[1] || (c3[1] = withModifiers(() => {
          }, ["prevent"])),
          onFocusOutside: c3[2] || (c3[2] = async (p2) => {
            p2.defaultPrevented || p2.target !== unref(i3).trigger.value && unref(a4).onOpenChange(false);
          }),
          onEscapeKeyDown: c3[3] || (c3[3] = (p2) => {
            var f2;
            (f2 = unref(s4)) == null || f2.onClose(), p2.preventDefault();
          }),
          onKeydown: c3[4] || (c3[4] = (p2) => {
            var m4, h4;
            const f2 = (m4 = p2.currentTarget) == null ? void 0 : m4.contains(p2.target), v2 = unref(Zl)[unref(s4).dir.value].includes(p2.key);
            f2 && v2 && (unref(a4).onOpenChange(false), (h4 = unref(i3).trigger.value) == null || h4.focus(), p2.preventDefault());
          })
        }), {
          default: withCtx(() => [
            renderSlot(d4.$slots, "default")
          ]),
          _: 3
        }, 16, ["id", "aria-labelledby", "side"])
      ]),
      _: 3
    }, 8, ["present"]));
  }
}), yo = /* @__PURE__ */ defineComponent({
  __name: "MenuSubTrigger",
  props: {
    disabled: { type: Boolean },
    textValue: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(n2) {
    const e3 = n2, t3 = inject(Te), o2 = inject(st), a4 = inject(vo), s4 = inject(tn), i3 = ref(null), r2 = computed(
      () => s4 == null ? void 0 : s4.pointerGraceTimerRef.value
    );
    function u3() {
      i3.value && window.clearTimeout(i3.value), i3.value = null;
    }
    onUnmounted(() => {
      u3();
    });
    function d4(f2) {
      rt(f2) && (s4.onItemEnter(f2), t3.onOpenChange(true), !f2.defaultPrevented && !e3.disabled && !(t3 != null && t3.open.value) && !i3.value && (s4.onPointerGraceIntentChange(null), i3.value = window.setTimeout(() => {
        u3();
      }, 100)));
    }
    function c3(f2) {
      var m4, h4;
      if (!rt(f2))
        return;
      u3();
      const v2 = (m4 = t3.content.value) == null ? void 0 : m4.getBoundingClientRect();
      if (v2) {
        const g2 = (h4 = t3.content.value) == null ? void 0 : h4.dataset.side, S4 = g2 === "right", E2 = S4 ? -5 : 5, O3 = v2[S4 ? "left" : "right"], P = v2[S4 ? "right" : "left"];
        s4.onPointerGraceIntentChange({
          area: [
            // Apply a bleed on clientX to ensure that our exit point is
            // consistently within polygon bounds
            { x: f2.clientX + E2, y: f2.clientY },
            { x: O3, y: v2.top },
            { x: P, y: v2.top },
            { x: P, y: v2.bottom },
            { x: O3, y: v2.bottom }
          ],
          side: g2
        }), window.clearTimeout(r2.value), s4.pointerGraceTimerRef.value = window.setTimeout(
          () => s4.onPointerGraceIntentChange(null),
          300
        );
      } else {
        if (s4.onTriggerLeave(f2), f2.defaultPrevented)
          return;
        s4.onPointerGraceIntentChange(null);
      }
    }
    async function p2(f2) {
      var m4;
      const v2 = s4.searchRef.value !== "";
      e3.disabled || v2 && f2.key === " " || jl[o2.dir.value].includes(f2.key) && (t3.onOpenChange(true), await nextTick(), (m4 = t3.content.value) == null || m4.focus(), f2.preventDefault());
    }
    return (f2, v2) => (openBlock(), createBlock(en, { "as-child": "" }, {
      default: withCtx(() => {
        var m4;
        return [
          createVNode(Ha, {
            id: unref(a4).triggerId,
            ref: (h4) => {
              var g2;
              (g2 = unref(a4)) == null || g2.onTriggerChange(h4 == null ? void 0 : h4.el);
            },
            "aria-haspopup": "menu",
            "aria-expanded": unref(t3).open.value,
            "aria-controls": (m4 = unref(a4)) == null ? void 0 : m4.contentId,
            "data-state": unref(Wn)(unref(t3).open.value),
            onClick: v2[0] || (v2[0] = async (h4) => {
              e3.disabled || h4.defaultPrevented || (h4.currentTarget.focus(), unref(t3).open.value || unref(t3).onOpenChange(true));
            }),
            onPointermove: d4,
            onPointerleave: c3,
            onKeydown: p2
          }, {
            default: withCtx(() => [
              renderSlot(f2.$slots, "default")
            ]),
            _: 3
          }, 8, ["id", "aria-expanded", "aria-controls", "data-state"])
        ];
      }),
      _: 3
    }));
  }
}), go = Symbol();
/* @__PURE__ */ defineComponent({
  __name: "DropdownMenuContent",
  props: mergeDefaults({
    loop: { type: Boolean },
    side: {},
    sideOffset: {},
    align: {},
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean },
    updatePositionStrategy: {},
    prioritizePosition: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  }, {
    ...ve
  }),
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "dismiss", "entryFocus", "openAutoFocus", "closeAutoFocus"],
  setup(n2, { emit: e3 }) {
    const t3 = n2, o2 = inject(go), a4 = ref(false), s4 = J(e3);
    function i3(r2) {
      e3("closeAutoFocus", r2), !r2.defaultPrevented && (a4.value || setTimeout(() => {
        var u3;
        (u3 = o2 == null ? void 0 : o2.triggerElement.value) == null || u3.focus();
      }, 0), a4.value = false, r2.preventDefault());
    }
    return (r2, u3) => {
      var d4, c3;
      return openBlock(), createBlock(unref(io), mergeProps({ ...t3, ...unref(s4) }, {
        id: (d4 = unref(o2)) == null ? void 0 : d4.contentId,
        "aria-labelledby": (c3 = unref(o2)) == null ? void 0 : c3.triggerId,
        style: {
          "--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
          "--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
          "--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
          "--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
          "--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)"
        },
        onCloseAutoFocus: i3,
        onInteractOutside: u3[0] || (u3[0] = (p2) => {
          var h4;
          if (e3("interactOutside", p2), p2.defaultPrevented)
            return;
          const f2 = p2.detail.originalEvent, v2 = f2.button === 0 && f2.ctrlKey === true, m4 = f2.button === 2 || v2;
          (!((h4 = unref(o2)) != null && h4.modal.value) || m4) && (a4.value = true);
        })
      }), {
        default: withCtx(() => [
          renderSlot(r2.$slots, "default")
        ]),
        _: 3
      }, 16, ["id", "aria-labelledby", "style"]);
    };
  }
});
/* @__PURE__ */ defineComponent({
  __name: "DropdownMenuSubContent",
  props: mergeDefaults({
    loop: { type: Boolean },
    disableOutsidePointerEvents: { type: Boolean },
    disableOutsideScroll: { type: Boolean },
    trapFocus: { type: Boolean },
    side: {},
    sideOffset: {},
    align: {},
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean },
    updatePositionStrategy: {},
    prioritizePosition: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  }, {
    ...ve
  }),
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "dismiss", "entryFocus", "openAutoFocus", "closeAutoFocus"],
  setup(n2, { emit: e3 }) {
    const t3 = n2;
    return (o2, a4) => (openBlock(), createBlock(unref(ho), mergeProps({ ...t3, ...e3 }, { style: {
      "--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
      "--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
      "--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
      "--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
      "--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)"
    } }), {
      default: withCtx(() => [
        renderSlot(o2.$slots, "default")
      ]),
      _: 3
    }, 16, ["style"]));
  }
});
const bo = Symbol(), nd = /* @__PURE__ */ defineComponent({
  __name: "ContextMenuRoot",
  props: {
    dir: { default: "ltr" },
    modal: { type: Boolean, default: true }
  },
  emits: ["update:open"],
  setup(n2, { emit: e3 }) {
    const t3 = n2, { dir: o2, modal: a4 } = toRefs(t3), s4 = ref(false);
    return provide(bo, {
      open: s4,
      onOpenChange: (i3) => {
        s4.value = i3, e3("update:open", i3);
      },
      dir: o2,
      modal: a4
    }), (i3, r2) => (openBlock(), createBlock(unref(no), {
      open: s4.value,
      "onUpdate:open": r2[0] || (r2[0] = (u3) => s4.value = u3),
      dir: unref(o2),
      modal: unref(a4)
    }, {
      default: withCtx(() => [
        renderSlot(i3.$slots, "default")
      ]),
      _: 3
    }, 8, ["open", "dir", "modal"]));
  }
});
function Ko(n2) {
  return n2.pointerType !== "mouse";
}
const tr = {
  inheritAttrs: false
}, od = /* @__PURE__ */ defineComponent({
  ...tr,
  __name: "ContextMenuTrigger",
  props: {
    disabled: { type: Boolean, default: false },
    asChild: { type: Boolean },
    as: { default: "span" }
  },
  setup(n2) {
    const e3 = n2, { disabled: t3 } = toRefs(e3), o2 = inject(bo), a4 = ref({ x: 0, y: 0 }), s4 = computed(() => ({
      getBoundingClientRect: () => ({
        width: 0,
        height: 0,
        left: a4.value.x,
        right: a4.value.x,
        top: a4.value.y,
        bottom: a4.value.y,
        ...a4.value
      })
    })), i3 = ref(0);
    function r2() {
      window.clearTimeout(i3.value);
    }
    function u3(f2) {
      a4.value = { x: f2.clientX, y: f2.clientY }, o2 == null || o2.onOpenChange(true);
    }
    async function d4(f2) {
      t3.value || (await nextTick(), f2.defaultPrevented || (r2(), u3(f2), f2.preventDefault()));
    }
    async function c3(f2) {
      t3.value || (await nextTick(), Ko(f2) && !f2.defaultPrevented && (r2(), i3.value = window.setTimeout(() => u3(f2), 700)));
    }
    async function p2(f2) {
      t3.value || (await nextTick(), Ko(f2) && !f2.defaultPrevented && r2());
    }
    return (f2, v2) => {
      var m4;
      return openBlock(), createElementBlock(Fragment, null, [
        createVNode(unref(en), {
          as: "div",
          element: s4.value
        }, null, 8, ["element"]),
        createVNode(unref(x2), mergeProps({
          as: f2.as,
          "as-child": f2.asChild,
          "data-state": (m4 = unref(o2)) != null && m4.open.value ? "open" : "closed",
          "data-disabled": unref(t3) ? "" : void 0,
          style: {
            WebkitTouchCallout: "none"
          }
        }, f2.$attrs, {
          onContextmenu: d4,
          onPointerdown: c3,
          onPointermove: p2,
          onPointercancel: p2,
          onPointerup: p2
        }), {
          default: withCtx(() => [
            renderSlot(f2.$slots, "default")
          ]),
          _: 3
        }, 16, ["as", "as-child", "data-state", "data-disabled"])
      ], 64);
    };
  }
}), ad = /* @__PURE__ */ defineComponent({
  __name: "ContextMenuPortal",
  props: {
    to: {},
    disabled: { type: Boolean },
    forceMount: { type: Boolean }
  },
  setup(n2) {
    const e3 = n2;
    return (t3, o2) => (openBlock(), createBlock(unref(uo), normalizeProps(guardReactiveProps(e3)), {
      default: withCtx(() => [
        renderSlot(t3.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), sd = /* @__PURE__ */ defineComponent({
  __name: "ContextMenuContent",
  props: {
    loop: { type: Boolean },
    alignOffset: { default: 0 },
    avoidCollisions: { type: Boolean, default: true },
    collisionBoundary: { default: () => [] },
    collisionPadding: { default: 0 },
    sticky: { default: "partial" },
    hideWhenDetached: { type: Boolean, default: false },
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "dismiss", "entryFocus", "openAutoFocus", "closeAutoFocus"],
  setup(n2, { emit: e3 }) {
    const t3 = n2, o2 = inject(bo), a4 = ref(false);
    return (s4, i3) => (openBlock(), createBlock(unref(io), mergeProps(t3, {
      side: "right",
      "side-offset": 2,
      align: "start",
      style: {
        "--radix-context-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
        "--radix-context-menu-content-available-width": "var(--radix-popper-available-width)",
        "--radix-context-menu-content-available-height": "var(--radix-popper-available-height)",
        "--radix-context-menu-trigger-width": "var(--radix-popper-anchor-width)",
        "--radix-context-menu-trigger-height": "var(--radix-popper-anchor-height)"
      },
      onCloseAutoFocus: i3[0] || (i3[0] = (r2) => {
        e3("closeAutoFocus", r2), !r2.defaultPrevented && a4.value && r2.preventDefault(), a4.value = false;
      }),
      onInteractOutside: i3[1] || (i3[1] = (r2) => {
        var u3;
        e3("interactOutside", r2), !r2.defaultPrevented && !((u3 = unref(o2)) != null && u3.modal.value) && (a4.value = true);
      })
    }), {
      default: withCtx(() => [
        renderSlot(s4.$slots, "default")
      ]),
      _: 3
    }, 16, ["style"]));
  }
}), ld = /* @__PURE__ */ defineComponent({
  __name: "ContextMenuArrow",
  props: {
    width: {},
    height: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(n2) {
    const e3 = n2;
    return (t3, o2) => (openBlock(), createBlock(unref(to), normalizeProps(guardReactiveProps(e3)), {
      default: withCtx(() => [
        renderSlot(t3.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), id = /* @__PURE__ */ defineComponent({
  __name: "ContextMenuItem",
  props: {
    disabled: { type: Boolean },
    textValue: {},
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["select"],
  setup(n2, { emit: e3 }) {
    const t3 = n2, o2 = J(e3);
    return (a4, s4) => (openBlock(), createBlock(unref(gt), normalizeProps(guardReactiveProps({ ...t3, ...unref(o2) })), {
      default: withCtx(() => [
        renderSlot(a4.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), ud = /* @__PURE__ */ defineComponent({
  __name: "ContextMenuSeparator",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(n2) {
    const e3 = n2;
    return (t3, o2) => (openBlock(), createBlock(unref(fo), normalizeProps(guardReactiveProps(e3)), {
      default: withCtx(() => [
        renderSlot(t3.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), dd = /* @__PURE__ */ defineComponent({
  __name: "ContextMenuCheckboxItem",
  props: {
    checked: { type: [Boolean, String] },
    disabled: { type: Boolean },
    textValue: {},
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["select", "update:checked"],
  setup(n2, { emit: e3 }) {
    const t3 = n2, o2 = J(e3);
    return (a4, s4) => (openBlock(), createBlock(unref(lo), normalizeProps(guardReactiveProps({ ...t3, ...unref(o2) })), {
      default: withCtx(() => [
        renderSlot(a4.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), cd = /* @__PURE__ */ defineComponent({
  __name: "ContextMenuItemIndicator",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(n2) {
    const e3 = n2;
    return (t3, o2) => (openBlock(), createBlock(unref(so), normalizeProps(guardReactiveProps(e3)), {
      default: withCtx(() => [
        renderSlot(t3.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), pd = /* @__PURE__ */ defineComponent({
  __name: "ContextMenuLabel",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(n2) {
    const e3 = n2;
    return (t3, o2) => (openBlock(), createBlock(unref(ro), normalizeProps(guardReactiveProps(e3)), {
      default: withCtx(() => [
        renderSlot(t3.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), fd = /* @__PURE__ */ defineComponent({
  __name: "ContextMenuRadioGroup",
  props: {
    modelValue: {},
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["update:modelValue"],
  setup(n2, { emit: e3 }) {
    const t3 = n2, o2 = J(e3);
    return (a4, s4) => (openBlock(), createBlock(unref(co), normalizeProps(guardReactiveProps({ ...t3, ...unref(o2) })), {
      default: withCtx(() => [
        renderSlot(a4.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), vd = /* @__PURE__ */ defineComponent({
  __name: "ContextMenuRadioItem",
  props: {
    value: {},
    disabled: { type: Boolean },
    textValue: {},
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["select"],
  setup(n2, { emit: e3 }) {
    const t3 = n2, o2 = J(e3);
    return (a4, s4) => (openBlock(), createBlock(unref(po), normalizeProps(guardReactiveProps({ ...t3, ...unref(o2) })), {
      default: withCtx(() => [
        renderSlot(a4.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), md = /* @__PURE__ */ defineComponent({
  __name: "ContextMenuSub",
  props: {
    open: { type: Boolean },
    defaultOpen: { type: Boolean }
  },
  emits: ["update:open"],
  setup(n2, { emit: e3 }) {
    const t3 = n2, o2 = X2(t3, "open", e3, {
      passive: true,
      defaultValue: t3.defaultOpen
    });
    return (a4, s4) => (openBlock(), createBlock(unref(mo), {
      open: unref(o2),
      "onUpdate:open": s4[0] || (s4[0] = (i3) => isRef(o2) ? o2.value = i3 : null)
    }, {
      default: withCtx(() => [
        renderSlot(a4.$slots, "default")
      ]),
      _: 3
    }, 8, ["open"]));
  }
}), hd = /* @__PURE__ */ defineComponent({
  __name: "ContextMenuSubContent",
  props: mergeDefaults({
    loop: { type: Boolean },
    disableOutsidePointerEvents: { type: Boolean },
    disableOutsideScroll: { type: Boolean },
    trapFocus: { type: Boolean },
    side: {},
    sideOffset: {},
    align: {},
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean },
    updatePositionStrategy: {},
    prioritizePosition: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  }, {
    ...ve
  }),
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "dismiss", "entryFocus", "openAutoFocus", "closeAutoFocus"],
  setup(n2, { emit: e3 }) {
    const t3 = n2, o2 = J(e3);
    return (a4, s4) => (openBlock(), createBlock(unref(ho), mergeProps({ ...t3, ...unref(o2) }, { style: {
      "--radix-context-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
      "--radix-context-menu-content-available-width": "var(--radix-popper-available-width)",
      "--radix-context-menu-content-available-height": "var(--radix-popper-available-height)",
      "--radix-context-menu-trigger-width": "var(--radix-popper-anchor-width)",
      "--radix-context-menu-trigger-height": "var(--radix-popper-anchor-height)"
    } }), {
      default: withCtx(() => [
        renderSlot(a4.$slots, "default")
      ]),
      _: 3
    }, 16, ["style"]));
  }
}), yd = /* @__PURE__ */ defineComponent({
  __name: "ContextMenuSubTrigger",
  props: {
    disabled: { type: Boolean },
    textValue: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(n2) {
    const e3 = n2;
    return (t3, o2) => (openBlock(), createBlock(unref(yo), normalizeProps(guardReactiveProps(e3)), {
      default: withCtx(() => [
        renderSlot(t3.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), xe = Symbol(), we = 10;
const on = Symbol(), ir = {
  inheritAttrs: false
}, rr = /* @__PURE__ */ defineComponent({
  ...ir,
  __name: "SelectItemAlignedPosition",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["placed"],
  setup(n2, { emit: e3 }) {
    const t3 = n2, { injectCollection: o2 } = le(), a4 = inject(xe), s4 = inject(Ae), i3 = o2(), r2 = ref(false), u3 = ref(true), d4 = ref(), { primitiveElement: c3, currentElement: p2 } = K2(), { viewport: f2, selectedItem: v2, selectedItemText: m4, focusSelectedItem: h4 } = s4;
    function g2() {
      if (a4 && a4.triggerElement.value && a4.valueElement.value && d4.value && p2.value && (f2 != null && f2.value) && (v2 != null && v2.value) && (m4 != null && m4.value)) {
        const O3 = a4.triggerElement.value.getBoundingClientRect(), P = p2.value.getBoundingClientRect(), T3 = a4.valueElement.value.getBoundingClientRect(), D2 = m4.value.getBoundingClientRect();
        if (a4.dir.value !== "rtl") {
          const Re = D2.left - P.left, De = T3.left - Re, Fe = O3.left - De, Ne2 = O3.width + Fe, dn = Math.max(Ne2, P.width), cn = window.innerWidth - we, pn = $o(De, we, cn - dn);
          d4.value.style.minWidth = `${Ne2}px`, d4.value.style.left = `${pn}px`;
        } else {
          const Re = P.right - D2.right, De = window.innerWidth - T3.right - Re, Fe = window.innerWidth - O3.right - De, Ne2 = O3.width + Fe, dn = Math.max(Ne2, P.width), cn = window.innerWidth - we, pn = $o(
            De,
            we,
            cn - dn
          );
          d4.value.style.minWidth = `${Ne2}px`, d4.value.style.right = `${pn}px`;
        }
        const I2 = i3.value, H4 = window.innerHeight - we * 2, A2 = f2.value.scrollHeight, V = window.getComputedStyle(p2.value), F2 = Number.parseInt(
          V.borderTopWidth,
          10
        ), z2 = Number.parseInt(V.paddingTop, 10), U = Number.parseInt(
          V.borderBottomWidth,
          10
        ), Q2 = Number.parseInt(
          V.paddingBottom,
          10
        ), ne = F2 + z2 + A2 + Q2 + U, re = Math.min(
          v2.value.offsetHeight * 5,
          ne
        ), Ue2 = window.getComputedStyle(f2.value), lt = Number.parseInt(Ue2.paddingTop, 10), es = Number.parseInt(
          Ue2.paddingBottom,
          10
        ), Ct = O3.top + O3.height / 2 - we, ts = H4 - Ct, un = v2.value.offsetHeight / 2, ns = v2.value.offsetTop + un, Et = F2 + z2 + ns, os = ne - Et;
        if (Et <= Ct) {
          const Re = v2.value === I2[I2.length - 1];
          d4.value.style.bottom = "0px";
          const De = p2.value.clientHeight - f2.value.offsetTop - f2.value.offsetHeight, Fe = Math.max(
            ts,
            un + (Re ? es : 0) + De + U
          ), Ne2 = Et + Fe;
          d4.value.style.height = `${Ne2}px`;
        } else {
          const Re = v2.value === I2[0];
          d4.value.style.top = "0px";
          const Fe = Math.max(
            Ct,
            F2 + f2.value.offsetTop + (Re ? lt : 0) + un
          ) + os;
          d4.value.style.height = `${Fe}px`, f2.value.scrollTop = Et - Ct + f2.value.offsetTop;
        }
        d4.value.style.margin = `${we}px 0`, d4.value.style.minHeight = `${re}px`, d4.value.style.maxHeight = `${H4}px`, e3("placed"), requestAnimationFrame(() => r2.value = true);
      }
    }
    const S4 = ref("");
    onMounted(() => {
      g2(), p2.value && (S4.value = window.getComputedStyle(p2.value).zIndex);
    });
    function E2(O3) {
      O3 && u3.value === true && (g2(), h4 == null || h4(), u3.value = false);
    }
    return provide(on, {
      contentWrapper: d4,
      shouldExpandOnScrollRef: r2,
      onScrollButtonChange: E2
    }), (O3, P) => (openBlock(), createElementBlock("div", {
      ref_key: "contentWrapperElement",
      ref: d4,
      style: normalizeStyle({
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        zIndex: S4.value
      })
    }, [
      createVNode(unref(x2), mergeProps({
        ref_key: "primitiveElement",
        ref: c3,
        style: {
          // When we get the height of the content, it includes borders. If we were to set
          // the height without having `boxSizing: 'border-box'` it would be too big.
          boxSizing: "border-box",
          // We need to ensure the content doesn't get taller than the wrapper
          maxHeight: "100%"
        }
      }, { ...O3.$attrs, ...t3 }), {
        default: withCtx(() => [
          renderSlot(O3.$slots, "default")
        ]),
        _: 3
      }, 16, ["style"])
    ], 4));
  }
}), ur = /* @__PURE__ */ defineComponent({
  __name: "SelectPopperPosition",
  props: {
    side: {},
    sideOffset: {},
    align: { default: "start" },
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: { default: we },
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean },
    updatePositionStrategy: {},
    onPlaced: {},
    prioritizePosition: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  },
  setup(n2) {
    const e3 = n2;
    return (t3, o2) => (openBlock(), createBlock(unref(ht), mergeProps(e3, { style: {
      // Ensure border-box for floating-ui calculations
      boxSizing: "border-box",
      "--radix-select-content-transform-origin": "var(--radix-popper-transform-origin)",
      "--radix-select-content-available-width": "var(--radix-popper-available-width)",
      "--radix-select-content-available-height": "var(--radix-popper-available-height)",
      "--radix-select-trigger-width": "var(--radix-popper-anchor-width)",
      "--radix-select-trigger-height": "var(--radix-popper-anchor-height)"
    } }), {
      default: withCtx(() => [
        renderSlot(t3.$slots, "default")
      ]),
      _: 3
    }, 16, ["style"]));
  }
}), Ae = Symbol(), dr = /* @__PURE__ */ defineComponent({
  __name: "SelectContentImpl",
  props: {
    position: {},
    side: {},
    sideOffset: {},
    align: {},
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean },
    updatePositionStrategy: {},
    onPlaced: { type: Function },
    prioritizePosition: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["closeAutoFocus", "escapeKeyDown", "pointerDownOutside"],
  setup(n2, { emit: e3 }) {
    const t3 = n2, o2 = inject(xe);
    xn(), Ut(true);
    const { createCollection: a4 } = le(), s4 = ref();
    zt(s4);
    const i3 = a4(s4), { search: r2, handleTypeaheadSearch: u3 } = Fn(i3), d4 = ref(), c3 = ref(), p2 = ref(), f2 = ref(false), v2 = ref(false);
    function m4() {
      c3.value && s4.value && _n([c3.value, s4.value]);
    }
    watch(f2, () => {
      m4();
    });
    const { onOpenChange: h4, triggerPointerDownPosRef: g2 } = o2;
    watchEffect((O3) => {
      if (!s4.value)
        return;
      let P = { x: 0, y: 0 };
      const T3 = (I2) => {
        var H4, A2;
        P = {
          x: Math.abs(
            Math.round(I2.pageX) - (((H4 = g2.value) == null ? void 0 : H4.x) ?? 0)
          ),
          y: Math.abs(
            Math.round(I2.pageY) - (((A2 = g2.value) == null ? void 0 : A2.y) ?? 0)
          )
        };
      }, D2 = (I2) => {
        var H4;
        P.x <= 10 && P.y <= 10 ? I2.preventDefault() : (H4 = s4.value) != null && H4.contains(I2.target) || h4(false), document.removeEventListener("pointermove", T3), g2.value = null;
      };
      g2.value !== null && (document.addEventListener("pointermove", T3), document.addEventListener("pointerup", D2, {
        capture: true,
        once: true
      })), O3(() => {
        document.removeEventListener("pointermove", T3), document.removeEventListener("pointerup", D2, {
          capture: true
        });
      });
    });
    function S4(O3) {
      const P = O3.ctrlKey || O3.altKey || O3.metaKey;
      if (O3.key === "Tab" && O3.preventDefault(), !P && O3.key.length === 1 && u3(O3.key), ["ArrowUp", "ArrowDown", "Home", "End"].includes(O3.key)) {
        let T3 = i3.value;
        if (["ArrowUp", "End"].includes(O3.key) && (T3 = T3.slice().reverse()), ["ArrowUp", "ArrowDown"].includes(O3.key)) {
          const D2 = O3.target, I2 = T3.indexOf(D2);
          T3 = T3.slice(I2 + 1);
        }
        setTimeout(() => _n(T3)), O3.preventDefault();
      }
    }
    const E2 = computed(() => t3.position === "popper" ? t3 : {});
    return provide(Ae, {
      content: s4,
      viewport: d4,
      onViewportChange: (O3) => {
        d4.value = O3;
      },
      itemRefCallback: (O3, P, T3) => {
        var H4, A2;
        const D2 = !v2.value && !T3;
        (((H4 = o2 == null ? void 0 : o2.modelValue) == null ? void 0 : H4.value) !== void 0 && ((A2 = o2 == null ? void 0 : o2.modelValue) == null ? void 0 : A2.value) === P || D2) && (c3.value = O3, D2 && (v2.value = true));
      },
      selectedItem: c3,
      selectedItemText: p2,
      onItemLeave: () => {
        var O3;
        (O3 = s4.value) == null || O3.focus();
      },
      itemTextRefCallback: (O3, P, T3) => {
        var H4, A2;
        const D2 = !v2.value && !T3;
        (((H4 = o2 == null ? void 0 : o2.modelValue) == null ? void 0 : H4.value) !== void 0 && ((A2 = o2 == null ? void 0 : o2.modelValue) == null ? void 0 : A2.value) === P || D2) && (p2.value = O3);
      },
      focusSelectedItem: m4,
      position: t3.position,
      isPositioned: f2,
      searchRef: r2
    }), (O3, P) => (openBlock(), createBlock(unref(Xt), {
      "as-child": "",
      onMountAutoFocus: P[6] || (P[6] = withModifiers(() => {
      }, ["prevent"])),
      onUnmountAutoFocus: P[7] || (P[7] = (T3) => {
        var D2, I2;
        e3("closeAutoFocus", T3), !T3.defaultPrevented && ((I2 = (D2 = unref(o2)) == null ? void 0 : D2.triggerElement.value) == null || I2.focus({ preventScroll: true }), T3.preventDefault());
      })
    }, {
      default: withCtx(() => [
        createVNode(unref(ze), {
          "as-child": "",
          "disable-outside-pointer-events": "",
          onFocusOutside: P[2] || (P[2] = withModifiers(() => {
          }, ["prevent"])),
          onDismiss: P[3] || (P[3] = (T3) => {
            var D2;
            return (D2 = unref(o2)) == null ? void 0 : D2.onOpenChange(false);
          }),
          onEscapeKeyDown: P[4] || (P[4] = (T3) => e3("escapeKeyDown", T3)),
          onPointerDownOutside: P[5] || (P[5] = (T3) => e3("pointerDownOutside", T3))
        }, {
          default: withCtx(() => {
            var T3, D2, I2;
            return [
              (openBlock(), createBlock(resolveDynamicComponent(
                O3.position === "popper" ? ur : rr
              ), mergeProps({ ...O3.$attrs, ...E2.value }, {
                id: (T3 = unref(o2)) == null ? void 0 : T3.contentId,
                ref: (H4) => {
                  s4.value = unref($e)(H4);
                },
                role: "listbox",
                "data-state": (D2 = unref(o2)) != null && D2.open.value ? "open" : "closed",
                dir: (I2 = unref(o2)) == null ? void 0 : I2.dir.value,
                style: {
                  // flex layout so we can place the scroll buttons properly
                  display: "flex",
                  flexDirection: "column",
                  // reset the outline by default as the content MAY get focused
                  outline: "none"
                },
                onContextmenu: P[0] || (P[0] = withModifiers(() => {
                }, ["prevent"])),
                onPlaced: P[1] || (P[1] = (H4) => f2.value = true),
                onKeydown: S4
              }), {
                default: withCtx(() => [
                  renderSlot(O3.$slots, "default")
                ]),
                _: 3
              }, 16, ["id", "data-state", "dir"]))
            ];
          }),
          _: 3
        })
      ]),
      _: 3
    }));
  }
});
/* @__PURE__ */ defineComponent({
  __name: "SelectContent",
  props: mergeDefaults({
    position: {},
    side: {},
    sideOffset: {},
    align: {},
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean },
    updatePositionStrategy: {},
    onPlaced: { type: Function },
    prioritizePosition: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  }, {
    ...ve,
    align: "start",
    position: "item-aligned"
  }),
  emits: ["closeAutoFocus", "escapeKeyDown", "pointerDownOutside"],
  setup(n2, { emit: e3 }) {
    const t3 = n2, o2 = inject(xe), a4 = J(e3);
    return (s4, i3) => (openBlock(), createBlock(unref(ie), {
      present: unref(o2).open.value
    }, {
      default: withCtx(() => [
        createVNode(dr, normalizeProps(guardReactiveProps({ ...t3, ...unref(a4) })), {
          default: withCtx(() => [
            renderSlot(s4.$slots, "default")
          ]),
          _: 3
        }, 16)
      ]),
      _: 3
    }, 8, ["present"]));
  }
});
const bt = Symbol(), an = Symbol();
/* @__PURE__ */ defineComponent({
  __name: "MenubarContent",
  props: mergeDefaults({
    loop: { type: Boolean },
    side: {},
    sideOffset: {},
    align: {},
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean },
    updatePositionStrategy: {},
    prioritizePosition: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  }, {
    ...ve,
    align: "start"
  }),
  setup(n2) {
    const e3 = n2, t3 = inject(bt), o2 = inject(an), { injectCollection: a4 } = le("menubar"), s4 = a4(), i3 = ref(false);
    function r2(u3) {
      const c3 = u3.target.hasAttribute(
        "data-radix-menubar-subtrigger"
      ), f2 = ((t3 == null ? void 0 : t3.dir.value) === "rtl" ? "ArrowRight" : "ArrowLeft") === u3.key;
      if (!f2 && c3)
        return;
      let m4 = s4.value.map((S4) => S4.dataset.value);
      f2 && m4.reverse();
      const h4 = m4.indexOf(o2 == null ? void 0 : o2.value);
      m4 = t3 != null && t3.loop.value ? Nn(m4, h4 + 1) : m4.slice(h4 + 1);
      const [g2] = m4;
      g2 && (t3 == null || t3.onMenuOpen(g2));
    }
    return (u3, d4) => {
      var c3, p2;
      return openBlock(), createBlock(unref(io), mergeProps({
        id: (c3 = unref(o2)) == null ? void 0 : c3.contentId,
        "aria-labelledby": (p2 = unref(o2)) == null ? void 0 : p2.triggerId,
        "data-radix-menubar-content": ""
      }, e3, {
        style: {
          "--radix-menubar-content-transform-origin": "var(--radix-popper-transform-origin)",
          "--radix-menubar-content-available-width": "var(--radix-popper-available-width)",
          "--radix-menubar-content-available-height": "var(--radix-popper-available-height)",
          "--radix-menubar-trigger-width": "var(--radix-popper-anchor-width)",
          "--radix-menubar-trigger-height": "var(--radix-popper-anchor-height)"
        },
        onCloseAutoFocus: d4[0] || (d4[0] = (f2) => {
          var m4, h4;
          !!!((m4 = unref(t3)) != null && m4.modelValue.value) && !i3.value && ((h4 = unref(o2).triggerElement.value) == null || h4.focus()), i3.value = false, f2.preventDefault();
        }),
        onFocusOutside: d4[1] || (d4[1] = (f2) => {
          const v2 = f2.target;
          unref(s4).some((h4) => h4.contains(v2)) && f2.preventDefault();
        }),
        onInteractOutside: d4[2] || (d4[2] = (f2) => {
          i3.value = true;
        }),
        onOpenAutoFocus: d4[3] || (d4[3] = (f2) => {
          var v2;
          (v2 = unref(o2)) != null && v2.wasKeyboardTriggerOpenRef.value || f2.preventDefault();
        }),
        onEntryFocus: d4[4] || (d4[4] = (f2) => {
          var v2;
          (v2 = unref(o2)) != null && v2.wasKeyboardTriggerOpenRef.value || f2.preventDefault();
        }),
        onKeydown: withKeys(r2, ["arrow-right", "arrow-left"])
      }), {
        default: withCtx(() => [
          renderSlot(u3.$slots, "default")
        ]),
        _: 3
      }, 16, ["id", "aria-labelledby", "style", "onKeydown"]);
    };
  }
});
/* @__PURE__ */ defineComponent({
  __name: "MenubarSubContent",
  props: mergeDefaults({
    loop: { type: Boolean },
    disableOutsidePointerEvents: { type: Boolean },
    disableOutsideScroll: { type: Boolean },
    trapFocus: { type: Boolean },
    side: {},
    sideOffset: {},
    align: {},
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean },
    updatePositionStrategy: {},
    prioritizePosition: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  }, {
    ...ve
  }),
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "dismiss", "entryFocus", "openAutoFocus", "closeAutoFocus"],
  setup(n2, { emit: e3 }) {
    const t3 = n2, { injectCollection: o2 } = le("menubar"), a4 = inject(bt), s4 = inject(an), i3 = o2();
    function r2(u3) {
      if (u3.target.hasAttribute(
        "data-radix-menubar-subtrigger"
      ))
        return;
      let p2 = i3.value.map((m4) => m4.dataset.value);
      const f2 = p2.indexOf(s4 == null ? void 0 : s4.value);
      p2 = a4 != null && a4.loop.value ? Nn(p2, f2 + 1) : p2.slice(f2 + 1);
      const [v2] = p2;
      v2 && (a4 == null || a4.onMenuOpen(v2));
    }
    return (u3, d4) => (openBlock(), createBlock(unref(ho), mergeProps({ ...t3, ...e3 }, {
      "data-radix-menubar-content": "",
      style: {
        "--radix-menubar-content-transform-origin": "var(--radix-popper-transform-origin)",
        "--radix-menubar-content-available-width": "var(--radix-popper-available-width)",
        "--radix-menubar-content-available-height": "var(--radix-popper-available-height)",
        "--radix-menubar-trigger-width": "var(--radix-popper-anchor-width)",
        "--radix-menubar-trigger-height": "var(--radix-popper-anchor-height)"
      },
      onKeydown: withKeys(r2, ["arrow-right"])
    }), {
      default: withCtx(() => [
        renderSlot(u3.$slots, "default")
      ]),
      _: 3
    }, 16, ["style", "onKeydown"]));
  }
});
const min = Math.min;
const max = Math.max;
const round = Math.round;
const floor = Math.floor;
const createCoords = (v2) => ({
  x: v2,
  y: v2
});
const oppositeSideMap = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
const oppositeAlignmentMap = {
  start: "end",
  end: "start"
};
function clamp(start, value, end) {
  return max(start, min(value, end));
}
function evaluate(value, param) {
  return typeof value === "function" ? value(param) : value;
}
function getSide(placement) {
  return placement.split("-")[0];
}
function getAlignment(placement) {
  return placement.split("-")[1];
}
function getOppositeAxis(axis) {
  return axis === "x" ? "y" : "x";
}
function getAxisLength(axis) {
  return axis === "y" ? "height" : "width";
}
function getSideAxis(placement) {
  return ["top", "bottom"].includes(getSide(placement)) ? "y" : "x";
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.replace(/start|end/g, (alignment) => oppositeAlignmentMap[alignment]);
}
function getSideList(side, isStart, rtl) {
  const lr = ["left", "right"];
  const rl2 = ["right", "left"];
  const tb = ["top", "bottom"];
  const bt2 = ["bottom", "top"];
  switch (side) {
    case "top":
    case "bottom":
      if (rtl)
        return isStart ? rl2 : lr;
      return isStart ? lr : rl2;
    case "left":
    case "right":
      return isStart ? tb : bt2;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === "start", rtl);
  if (alignment) {
    list = list.map((side) => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, (side) => oppositeSideMap[side]);
}
function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}
function getPaddingObject(padding) {
  return typeof padding !== "number" ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  return {
    ...rect,
    top: rect.y,
    left: rect.x,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  };
}
function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = getSideAxis(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const alignLength = getAxisLength(alignmentAxis);
  const side = getSide(placement);
  const isVertical = sideAxis === "y";
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case "top":
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case "bottom":
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case "right":
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case "left":
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch (getAlignment(placement)) {
    case "start":
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case "end":
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}
const computePosition$1 = async (reference, floating, config) => {
  const {
    placement = "bottom",
    strategy = "absolute",
    middleware = [],
    platform: platform2
  } = config;
  const validMiddleware = middleware.filter(Boolean);
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(floating));
  let rects = await platform2.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x: x3,
    y: y4
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let middlewareData = {};
  let resetCount = 0;
  for (let i3 = 0; i3 < validMiddleware.length; i3++) {
    const {
      name,
      fn: fn2
    } = validMiddleware[i3];
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn2({
      x: x3,
      y: y4,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform: platform2,
      elements: {
        reference,
        floating
      }
    });
    x3 = nextX != null ? nextX : x3;
    y4 = nextY != null ? nextY : y4;
    middlewareData = {
      ...middlewareData,
      [name]: {
        ...middlewareData[name],
        ...data
      }
    };
    if (reset && resetCount <= 50) {
      resetCount++;
      if (typeof reset === "object") {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform2.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x: x3,
          y: y4
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i3 = -1;
      continue;
    }
  }
  return {
    x: x3,
    y: y4,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};
async function detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x: x3,
    y: y4,
    platform: platform2,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = "clippingAncestors",
    rootBoundary = "viewport",
    elementContext = "floating",
    altBoundary = false,
    padding = 0
  } = evaluate(options, state);
  const paddingObject = getPaddingObject(padding);
  const altContext = elementContext === "floating" ? "reference" : "floating";
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = rectToClientRect(await platform2.getClippingRect({
    element: ((_await$platform$isEle = await (platform2.isElement == null ? void 0 : platform2.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform2.getDocumentElement == null ? void 0 : platform2.getDocumentElement(elements.floating)),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === "floating" ? {
    ...rects.floating,
    x: x3,
    y: y4
  } : rects.reference;
  const offsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(elements.floating));
  const offsetScale = await (platform2.isElement == null ? void 0 : platform2.isElement(offsetParent)) ? await (platform2.getScale == null ? void 0 : platform2.getScale(offsetParent)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  };
  const elementClientRect = rectToClientRect(platform2.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect({
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}
const flip = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "flip",
    options,
    async fn(state) {
      var _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform: platform2,
        elements
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = "bestFit",
        fallbackAxisSideDirection = "none",
        flipAlignment = true,
        ...detectOverflowOptions
      } = evaluate(options, state);
      const side = getSide(placement);
      const isBasePlacement = getSide(initialPlacement) === initialPlacement;
      const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
      if (!specifiedFallbackPlacements && fallbackAxisSideDirection !== "none") {
        fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements = [initialPlacement, ...fallbackPlacements];
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const sides = getAlignmentSides(placement, rects, rtl);
        overflows.push(overflow[sides[0]], overflow[sides[1]]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];
      if (!overflows.every((side2) => side2 <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements[nextIndex];
        if (nextPlacement) {
          return {
            data: {
              index: nextIndex,
              overflows: overflowsData
            },
            reset: {
              placement: nextPlacement
            }
          };
        }
        let resetPlacement = (_overflowsData$filter = overflowsData.filter((d4) => d4.overflows[0] <= 0).sort((a4, b3) => a4.overflows[1] - b3.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case "bestFit": {
              var _overflowsData$map$so;
              const placement2 = (_overflowsData$map$so = overflowsData.map((d4) => [d4.placement, d4.overflows.filter((overflow2) => overflow2 > 0).reduce((acc, overflow2) => acc + overflow2, 0)]).sort((a4, b3) => a4[1] - b3[1])[0]) == null ? void 0 : _overflowsData$map$so[0];
              if (placement2) {
                resetPlacement = placement2;
              }
              break;
            }
            case "initialPlacement":
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};
async function convertValueToCoords(state, options) {
  const {
    placement,
    platform: platform2,
    elements
  } = state;
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const isVertical = getSideAxis(placement) === "y";
  const mainAxisMulti = ["left", "top"].includes(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = evaluate(options, state);
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === "number" ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: 0,
    crossAxis: 0,
    alignmentAxis: null,
    ...rawValue
  };
  if (alignment && typeof alignmentAxis === "number") {
    crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}
const offset = function(options) {
  if (options === void 0) {
    options = 0;
  }
  return {
    name: "offset",
    options,
    async fn(state) {
      const {
        x: x3,
        y: y4
      } = state;
      const diffCoords = await convertValueToCoords(state, options);
      return {
        x: x3 + diffCoords.x,
        y: y4 + diffCoords.y,
        data: diffCoords
      };
    }
  };
};
const shift = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "shift",
    options,
    async fn(state) {
      const {
        x: x3,
        y: y4,
        placement
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: (_ref) => {
            let {
              x: x4,
              y: y5
            } = _ref;
            return {
              x: x4,
              y: y5
            };
          }
        },
        ...detectOverflowOptions
      } = evaluate(options, state);
      const coords = {
        x: x3,
        y: y4
      };
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const crossAxis = getSideAxis(getSide(placement));
      const mainAxis = getOppositeAxis(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === "y" ? "top" : "left";
        const maxSide = mainAxis === "y" ? "bottom" : "right";
        const min2 = mainAxisCoord + overflow[minSide];
        const max2 = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = clamp(min2, mainAxisCoord, max2);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === "y" ? "top" : "left";
        const maxSide = crossAxis === "y" ? "bottom" : "right";
        const min2 = crossAxisCoord + overflow[minSide];
        const max2 = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = clamp(min2, crossAxisCoord, max2);
      }
      const limitedCoords = limiter.fn({
        ...state,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x3,
          y: limitedCoords.y - y4
        }
      };
    }
  };
};
function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || "").toLowerCase();
  }
  return "#document";
}
function getWindow(node) {
  var _node$ownerDocument;
  return (node == null ? void 0 : (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
  return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
  if (typeof ShadowRoot === "undefined") {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle$1(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !["inline", "contents"].includes(display);
}
function isTableElement(element) {
  return ["table", "td", "th"].includes(getNodeName(element));
}
function isContainingBlock(element) {
  const webkit = isWebKit();
  const css = getComputedStyle$1(element);
  return css.transform !== "none" || css.perspective !== "none" || (css.containerType ? css.containerType !== "normal" : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== "none" : false) || !webkit && (css.filter ? css.filter !== "none" : false) || ["transform", "perspective", "filter"].some((value) => (css.willChange || "").includes(value)) || ["paint", "layout", "strict", "content"].some((value) => (css.contain || "").includes(value));
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else {
      currentNode = getParentNode(currentNode);
    }
  }
  return null;
}
function isWebKit() {
  if (typeof CSS === "undefined" || !CSS.supports)
    return false;
  return CSS.supports("-webkit-backdrop-filter", "none");
}
function isLastTraversableNode(node) {
  return ["html", "body", "#document"].includes(getNodeName(node));
}
function getComputedStyle$1(element) {
  return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.pageXOffset,
    scrollTop: element.pageYOffset
  };
}
function getParentNode(node) {
  if (getNodeName(node) === "html") {
    return node;
  }
  const result = (
    // Step into the shadow DOM of the parent of a slotted node.
    node.assignedSlot || // DOM Element detected.
    node.parentNode || // ShadowRoot detected.
    isShadowRoot(node) && node.host || // Fallback.
    getDocumentElement(node)
  );
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : []);
  }
  return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor));
}
function getCssDimensions(element) {
  const css = getComputedStyle$1(element);
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = isHTMLElement(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}
function unwrapElement(element) {
  return !isElement(element) ? element.contextElement : element;
}
function getScale(element) {
  const domElement = unwrapElement(element);
  if (!isHTMLElement(domElement)) {
    return createCoords(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $: $2
  } = getCssDimensions(domElement);
  let x3 = ($2 ? round(rect.width) : rect.width) / width;
  let y4 = ($2 ? round(rect.height) : rect.height) / height;
  if (!x3 || !Number.isFinite(x3)) {
    x3 = 1;
  }
  if (!y4 || !Number.isFinite(y4)) {
    y4 = 1;
  }
  return {
    x: x3,
    y: y4
  };
}
const noOffsets = /* @__PURE__ */ createCoords(0);
function getVisualOffsets(element) {
  const win = getWindow(element);
  if (!isWebKit() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) {
    return false;
  }
  return isFixed;
}
function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = createCoords(1);
  if (includeScale) {
    if (offsetParent) {
      if (isElement(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
  let x3 = (clientRect.left + visualOffsets.x) / scale.x;
  let y4 = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win = getWindow(domElement);
    const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
    let currentIFrame = win.frameElement;
    while (currentIFrame && offsetParent && offsetWin !== win) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = getComputedStyle$1(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x3 *= iframeScale.x;
      y4 *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x3 += left;
      y4 += top;
      currentIFrame = getWindow(currentIFrame).frameElement;
    }
  }
  return rectToClientRect({
    width,
    height,
    x: x3,
    y: y4
  });
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  if (offsetParent === documentElement) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = createCoords(1);
  const offsets = createCoords(0);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && strategy !== "fixed") {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y
  };
}
function getClientRects(element) {
  return Array.from(element.getClientRects());
}
function getWindowScrollBarX(element) {
  return getBoundingClientRect(getDocumentElement(element)).left + getNodeScroll(element).scrollLeft;
}
function getDocumentRect(element) {
  const html = getDocumentElement(element);
  const scroll = getNodeScroll(element);
  const body = element.ownerDocument.body;
  const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x3 = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y4 = -scroll.scrollTop;
  if (getComputedStyle$1(body).direction === "rtl") {
    x3 += max(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x: x3,
    y: y4
  };
}
function getViewportRect(element, strategy) {
  const win = getWindow(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x3 = 0;
  let y4 = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = isWebKit();
    if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
      x3 = visualViewport.offsetLeft;
      y4 = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x: x3,
    y: y4
  };
}
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x3 = left * scale.x;
  const y4 = top * scale.y;
  return {
    width,
    height,
    x: x3,
    y: y4
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === "viewport") {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === "document") {
    rect = getDocumentRect(getDocumentElement(element));
  } else if (isElement(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      ...clippingAncestor,
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y
    };
  }
  return rectToClientRect(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
  const parentNode = getParentNode(element);
  if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
    return false;
  }
  return getComputedStyle$1(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
}
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = getOverflowAncestors(element).filter((el) => isElement(el) && getNodeName(el) !== "body");
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = getComputedStyle$1(element).position === "fixed";
  let currentNode = elementIsFixed ? getParentNode(element) : element;
  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle$1(currentNode);
    const currentNodeIsContaining = isContainingBlock(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === "fixed") {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && ["absolute", "fixed"].includes(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
    if (shouldDropCurrentNode) {
      result = result.filter((ancestor) => ancestor !== currentNode);
    } else {
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = getParentNode(currentNode);
  }
  cache.set(element, result);
  return result;
}
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === "clippingAncestors" ? getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
}
function getDimensions(element) {
  return getCssDimensions(element);
}
function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const isFixed = strategy === "fixed";
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = createCoords(0);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}
function getTrueOffsetParent(element, polyfill) {
  if (!isHTMLElement(element) || getComputedStyle$1(element).position === "fixed") {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  return element.offsetParent;
}
function getOffsetParent(element, polyfill) {
  const window2 = getWindow(element);
  if (!isHTMLElement(element)) {
    return window2;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === "static") {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle$1(offsetParent).position === "static" && !isContainingBlock(offsetParent))) {
    return window2;
  }
  return offsetParent || getContainingBlock(element) || window2;
}
const getElementRects = async function(_ref) {
  let {
    reference,
    floating,
    strategy
  } = _ref;
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  return {
    reference: getRectRelativeToOffsetParent(reference, await getOffsetParentFn(floating), strategy),
    floating: {
      x: 0,
      y: 0,
      ...await getDimensionsFn(floating)
    }
  };
};
function isRTL(element) {
  return getComputedStyle$1(element).direction === "rtl";
}
const platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement,
  isRTL
};
function observeMove(element, onMove) {
  let io2 = null;
  let timeoutId;
  const root = getDocumentElement(element);
  function cleanup() {
    clearTimeout(timeoutId);
    io2 && io2.disconnect();
    io2 = null;
  }
  function refresh(skip, threshold) {
    if (skip === void 0) {
      skip = false;
    }
    if (threshold === void 0) {
      threshold = 1;
    }
    cleanup();
    const {
      left,
      top,
      width,
      height
    } = element.getBoundingClientRect();
    if (!skip) {
      onMove();
    }
    if (!width || !height) {
      return;
    }
    const insetTop = floor(top);
    const insetRight = floor(root.clientWidth - (left + width));
    const insetBottom = floor(root.clientHeight - (top + height));
    const insetLeft = floor(left);
    const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
    const options = {
      rootMargin,
      threshold: max(0, min(1, threshold)) || 1
    };
    let isFirstUpdate = true;
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;
      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }
        if (!ratio) {
          timeoutId = setTimeout(() => {
            refresh(false, 1e-7);
          }, 100);
        } else {
          refresh(false, ratio);
        }
      }
      isFirstUpdate = false;
    }
    try {
      io2 = new IntersectionObserver(handleObserve, {
        ...options,
        // Handle <iframe>s
        root: root.ownerDocument
      });
    } catch (e3) {
      io2 = new IntersectionObserver(handleObserve, options);
    }
    io2.observe(element);
  }
  refresh(true);
  return cleanup;
}
function autoUpdate(reference, floating, update, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === "function",
    layoutShift = typeof IntersectionObserver === "function",
    animationFrame = false
  } = options;
  const referenceEl = unwrapElement(reference);
  const ancestors = ancestorScroll || ancestorResize ? [...referenceEl ? getOverflowAncestors(referenceEl) : [], ...getOverflowAncestors(floating)] : [];
  ancestors.forEach((ancestor) => {
    ancestorScroll && ancestor.addEventListener("scroll", update, {
      passive: true
    });
    ancestorResize && ancestor.addEventListener("resize", update);
  });
  const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
  let reobserveFrame = -1;
  let resizeObserver = null;
  if (elementResize) {
    resizeObserver = new ResizeObserver((_ref) => {
      let [firstEntry] = _ref;
      if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        reobserveFrame = requestAnimationFrame(() => {
          resizeObserver && resizeObserver.observe(floating);
        });
      }
      update();
    });
    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }
    resizeObserver.observe(floating);
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && (nextRefRect.x !== prevRefRect.x || nextRefRect.y !== prevRefRect.y || nextRefRect.width !== prevRefRect.width || nextRefRect.height !== prevRefRect.height)) {
      update();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update();
  return () => {
    ancestors.forEach((ancestor) => {
      ancestorScroll && ancestor.removeEventListener("scroll", update);
      ancestorResize && ancestor.removeEventListener("resize", update);
    });
    cleanupIo && cleanupIo();
    resizeObserver && resizeObserver.disconnect();
    resizeObserver = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}
const computePosition = (reference, floating, options) => {
  const cache = /* @__PURE__ */ new Map();
  const mergedOptions = {
    platform,
    ...options
  };
  const platformWithCache = {
    ...mergedOptions.platform,
    _c: cache
  };
  return computePosition$1(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};
const _hoisted_1$5 = { class: "h-12 z-20 bg-slate-50 border-b border-gray-200 relative" };
const _hoisted_2$5 = ["onClick"];
const _hoisted_3$5 = /* @__PURE__ */ createBaseVNode("div", { class: "ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8" }, " ⌘+T ", -1);
const _hoisted_4$4 = { class: "ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8" };
const _hoisted_5$2 = /* @__PURE__ */ createBaseVNode("div", { class: "ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8" }, " ⌘+S ", -1);
const _hoisted_6$2 = /* @__PURE__ */ createBaseVNode("div", { class: "ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8" }, " ⌘+N ", -1);
const _hoisted_7$2 = /* @__PURE__ */ createBaseVNode("div", { class: "ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8" }, " ⇧+⌘+N ", -1);
const _hoisted_8$2 = { class: "ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8" };
const _hoisted_9$2 = /* @__PURE__ */ createBaseVNode("div", { class: "ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8" }, " ⌘+S ", -1);
const _hoisted_10$2 = { class: "ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8" };
const _hoisted_11$2 = /* @__PURE__ */ createBaseVNode("div", { class: "ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8" }, " ⌘+S ", -1);
const _hoisted_12$2 = { class: "ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8" };
const _hoisted_13$2 = /* @__PURE__ */ createBaseVNode("div", { class: "ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8" }, " ⌘+S ", -1);
const _hoisted_14$2 = /* @__PURE__ */ createBaseVNode("div", { class: "ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8" }, " ⌘+B ", -1);
const _sfc_main$5 = {
  __name: "toolbar",
  props: {
    title: {
      type: String,
      default: "Sort by"
    },
    links: {
      type: Array,
      default: [
        { label: "a", action: "get" },
        { label: "b", action: "getIt" },
        { label: "c", action: "got" }
      ]
    }
  },
  setup(__props) {
    const checkboxOne = ref(false);
    const checkboxTwo = ref(false);
    const person = ref("pedro");
    function handleClick() {
      alert("hello!");
    }
    const ddmenu = ref(null);
    const button = ref(null);
    onMounted((event) => {
      function updatePosition() {
        computePosition(button.value, ddmenu.value, {
          placement: "bottom-end",
          middleware: [
            offset({ mainAxis: 4, crossAxis: 2 }),
            flip(),
            shift({ padding: 4 })
            // arrow({ element: arrowElement }),
          ]
        }).then(({ x: x3, y: y4, placement, middlewareData }) => {
          Object.assign(ddmenu.value.style, {
            left: `${x3}px`,
            top: `${y4}px`
          });
        });
      }
      autoUpdate(button.value, ddmenu.value, updatePosition);
      new gform(
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
                      value: "created_at"
                    },
                    {
                      label: "Updated At",
                      value: "updated_at"
                    },
                    {
                      label: "Submitted At",
                      value: "opened_at"
                    },
                    {
                      label: "State",
                      value: "state"
                    },
                    {
                      label: "Status",
                      value: "status"
                    },
                    {
                      label: "Title",
                      value: "title"
                    },
                    {
                      label: "Assigned",
                      value: "user_id"
                    }
                  ]
                }
              ]
              // parse: [{ type: "requires" }],
            }
          ]
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
    const action = (action2) => {
      gform.toggleClass(ddmenu.value, "hidden", true);
      console.log(action2);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$5, [
        createVNode(unref(nd), null, {
          default: withCtx(() => [
            createVNode(unref(od), {
              "as-child": "",
              class: "select-none inset-0 absolute flex gap-4 p-2 items-center justify-between"
            }, {
              default: withCtx(() => [
                createBaseVNode("span", null, [
                  createBaseVNode("button", {
                    ref_key: "button",
                    ref: button,
                    onClick: toggleMenu,
                    class: ""
                  }, toDisplayString(__props.title), 513),
                  createBaseVNode("ul", {
                    class: "hidden absolute min-w-[8em] border-slate-400 rounded-md py-1 border bg-white shadow-md text-slate-700 flex flex-col",
                    ref_key: "ddmenu",
                    ref: ddmenu
                  }, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(__props.links, (link) => {
                      return openBlock(), createElementBlock("li", {
                        class: "hover:bg-slate-200 px-2 py-1 hover:text-slate-900 cursor-pointer",
                        onClick: ($event) => action(link.action)
                      }, toDisplayString(link.label), 9, _hoisted_2$5);
                    }), 256))
                  ], 512)
                ])
              ]),
              _: 1
            }),
            createVNode(unref(ad), null, {
              default: withCtx(() => [
                createVNode(unref(sd), {
                  class: "min-w-[220px] bg-white outline-none rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade",
                  "side-offset": 5
                }, {
                  default: withCtx(() => [
                    createVNode(unref(id), {
                      value: "New Tab",
                      class: "group text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1",
                      onClick: handleClick
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" New Tab "),
                        _hoisted_3$5
                      ]),
                      _: 1
                    }),
                    createVNode(unref(md), null, {
                      default: withCtx(() => [
                        createVNode(unref(yd), {
                          value: "more toolsz",
                          class: "group w-full text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[state=open]:bg-green4 data-[state=open]:text-grass11 data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1 data-[highlighted]:data-[state=open]:bg-green9 data-[highlighted]:data-[state=open]:text-green1"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" More Tools "),
                            createBaseVNode("div", _hoisted_4$4, [
                              createVNode(unref(Icon), { icon: "radix-icons:chevron-right" })
                            ])
                          ]),
                          _: 1
                        }),
                        createVNode(unref(ad), null, {
                          default: withCtx(() => [
                            createVNode(unref(hd), {
                              class: "min-w-[220px] outline-none bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade",
                              "side-offset": 2,
                              "align-offset": -5
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(id), { class: "group text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1" }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Save Page As… "),
                                    _hoisted_5$2
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(id), { class: "text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1" }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Create Shortcut… ")
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(id), { class: "text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1" }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Name Window… ")
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(ud), { class: "h-[1px] bg-green6 m-[5px]" }),
                                createVNode(unref(id), { class: "text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1" }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Developer Tools ")
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(ld), { class: "fill-white" })
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(id), {
                      value: "New Window",
                      class: "group text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" New Window "),
                        _hoisted_6$2
                      ]),
                      _: 1
                    }),
                    createVNode(unref(id), {
                      value: "New Private Window",
                      class: "group text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1",
                      disabled: ""
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" New Private Window "),
                        _hoisted_7$2
                      ]),
                      _: 1
                    }),
                    createVNode(unref(md), null, {
                      default: withCtx(() => [
                        createVNode(unref(yd), {
                          value: "more tools",
                          class: "group text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none w-full outline-none data-[state=open]:bg-green4 data-[state=open]:text-grass11 data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1 data-[highlighted]:data-[state=open]:bg-green9 data-[highlighted]:data-[state=open]:text-green1"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" More Tools "),
                            createBaseVNode("div", _hoisted_8$2, [
                              createVNode(unref(Icon), { icon: "radix-icons:chevron-right" })
                            ])
                          ]),
                          _: 1
                        }),
                        createVNode(unref(ad), null, {
                          default: withCtx(() => [
                            createVNode(unref(hd), {
                              class: "min-w-[220px] outline-none bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade",
                              "side-offset": 2,
                              "align-offset": -5
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(id), { class: "group text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1" }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Save Page As… "),
                                    _hoisted_9$2
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(id), { class: "text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1" }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Create Shortcut… ")
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(id), { class: "text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1" }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Name Window… ")
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(ud), { class: "h-[1px] bg-green6 m-[5px]" }),
                                createVNode(unref(id), { class: "text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1" }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Developer Tools ")
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(md), null, {
                                  default: withCtx(() => [
                                    createVNode(unref(yd), {
                                      value: "more toolsz",
                                      class: "group w-full text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[state=open]:bg-green4 data-[state=open]:text-grass11 data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1 data-[highlighted]:data-[state=open]:bg-green9 data-[highlighted]:data-[state=open]:text-green1"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" More Tools "),
                                        createBaseVNode("div", _hoisted_10$2, [
                                          createVNode(unref(Icon), { icon: "radix-icons:chevron-right" })
                                        ])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(ad), null, {
                                      default: withCtx(() => [
                                        createVNode(unref(hd), {
                                          class: "min-w-[220px] outline-none bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade",
                                          "side-offset": 2,
                                          "align-offset": -5
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(unref(id), { class: "group text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1" }, {
                                              default: withCtx(() => [
                                                createTextVNode(" Save Page As… "),
                                                _hoisted_11$2
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(unref(id), { class: "text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1" }, {
                                              default: withCtx(() => [
                                                createTextVNode(" Create Shortcut… ")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(unref(id), { class: "text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1" }, {
                                              default: withCtx(() => [
                                                createTextVNode(" Name Window… ")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(unref(ud), { class: "h-[1px] bg-green6 m-[5px]" }),
                                            createVNode(unref(id), { class: "text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1" }, {
                                              default: withCtx(() => [
                                                createTextVNode(" Developer Tools ")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(unref(md), null, {
                                              default: withCtx(() => [
                                                createVNode(unref(yd), {
                                                  value: "more toolsz",
                                                  class: "group w-full text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[state=open]:bg-green4 data-[state=open]:text-grass11 data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1 data-[highlighted]:data-[state=open]:bg-green9 data-[highlighted]:data-[state=open]:text-green1"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(" More Tools "),
                                                    createBaseVNode("div", _hoisted_12$2, [
                                                      createVNode(unref(Icon), { icon: "radix-icons:chevron-right" })
                                                    ])
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(unref(ad), null, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(hd), {
                                                      class: "min-w-[220px] outline-none bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade",
                                                      "side-offset": 2,
                                                      "align-offset": -5
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(id), { class: "group text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1" }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(" Save Page As… "),
                                                            _hoisted_13$2
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(unref(id), { class: "text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1" }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(" Create Shortcut… ")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(unref(id), { class: "text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1" }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(" Name Window… ")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(unref(ud), { class: "h-[1px] bg-green6 m-[5px]" }),
                                                        createVNode(unref(id), { class: "text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1" }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(" Developer Tools ")
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(id), { class: "text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1" }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Developer Tools ")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(ud), { class: "h-[1px] bg-green6 m-[5px]" }),
                    createVNode(unref(dd), {
                      modelValue: checkboxOne.value,
                      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => checkboxOne.value = $event),
                      class: "group text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(cd), { class: "absolute left-0 w-[25px] inline-flex items-center justify-center" }, {
                          default: withCtx(() => [
                            createVNode(unref(Icon), { icon: "radix-icons:check" })
                          ]),
                          _: 1
                        }),
                        createTextVNode(" Show Bookmarks "),
                        _hoisted_14$2
                      ]),
                      _: 1
                    }, 8, ["modelValue"]),
                    createVNode(unref(dd), {
                      modelValue: checkboxTwo.value,
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => checkboxTwo.value = $event),
                      class: "text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(cd), { class: "absolute left-0 w-[25px] inline-flex items-center justify-center" }, {
                          default: withCtx(() => [
                            createVNode(unref(Icon), { icon: "radix-icons:check" })
                          ]),
                          _: 1
                        }),
                        createTextVNode(" Show Full URLs ")
                      ]),
                      _: 1
                    }, 8, ["modelValue"]),
                    createVNode(unref(ud), { class: "h-[1px] bg-green6 m-[5px]" }),
                    createVNode(unref(pd), { class: "pl-[25px] text-xs leading-[25px] text-mauve11" }, {
                      default: withCtx(() => [
                        createTextVNode(" People ")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(fd), {
                      modelValue: person.value,
                      "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => person.value = $event)
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(vd), {
                          class: "text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1",
                          value: "pedro"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(cd), { class: "absolute left-0 w-[25px] inline-flex items-center justify-center" }, {
                              default: withCtx(() => [
                                createVNode(unref(Icon), { icon: "radix-icons:dot-filled" })
                              ]),
                              _: 1
                            }),
                            createTextVNode(" Pedro Duarte ")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(vd), {
                          class: "text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1",
                          value: "colm"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(cd), { class: "absolute left-0 w-[25px] inline-flex items-center justify-center" }, {
                              default: withCtx(() => [
                                createVNode(unref(Icon), { icon: "radix-icons:dot-filled" })
                              ]),
                              _: 1
                            }),
                            createTextVNode(" Colm Tuite ")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }, 8, ["modelValue"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        })
      ]);
    };
  }
};
const _hoisted_1$4 = { class: "mt-auto flex items-center justify-between border-t border-gray-300 bg-white px-4 py-3 sm:px-6 h-16" };
const _hoisted_2$4 = /* @__PURE__ */ createBaseVNode("div", { class: "flex flex-1 justify-between sm:hidden" }, [
  /* @__PURE__ */ createBaseVNode("a", {
    href: "#",
    class: "relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
  }, "Previous"),
  /* @__PURE__ */ createBaseVNode("a", {
    href: "#",
    class: "relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
  }, "Next")
], -1);
const _hoisted_3$4 = { class: "hidden sm:flex sm:flex-1 sm:items-center sm:justify-between" };
const _hoisted_4$3 = { class: "text-sm text-gray-700" };
const _hoisted_5$1 = { class: "font-medium" };
const _hoisted_6$1 = { class: "font-medium" };
const _hoisted_7$1 = { class: "font-medium" };
const _hoisted_8$1 = { class: "ml-4 text-sm text-gray-700" };
const _hoisted_9$1 = { class: "mr-4" };
const _hoisted_10$1 = { class: "relative" };
const _hoisted_11$1 = { class: "block truncate" };
const _hoisted_12$1 = {
  key: 0,
  class: "font-medium text-slate-800"
};
const _hoisted_13$1 = /* @__PURE__ */ createBaseVNode("span", { class: "text-slate-500" }, " Per Page", -1);
const _hoisted_14$1 = { class: "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2" };
const _hoisted_15$1 = {
  key: 0,
  class: "absolute inset-y-0 left-0 flex items-center pl-3 text-brand-700"
};
const _hoisted_16 = {
  class: "isolate inline-flex -space-x-px rounded-md shadow-sm",
  "aria-label": "Pagination"
};
const _hoisted_17 = ["href", "onClick", "disabled"];
const _hoisted_18 = { class: "sr-only" };
const _hoisted_19 = {
  key: 0,
  class: "h-5 w-5",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  "aria-hidden": "true"
};
const _hoisted_20 = /* @__PURE__ */ createBaseVNode("path", {
  "fill-rule": "evenodd",
  d: "M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z",
  "clip-rule": "evenodd"
}, null, -1);
const _hoisted_21 = [
  _hoisted_20
];
const _hoisted_22 = {
  key: 1,
  class: "h-5 w-5",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  "aria-hidden": "true"
};
const _hoisted_23 = /* @__PURE__ */ createBaseVNode("path", {
  "fill-rule": "evenodd",
  d: "M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z",
  "clip-rule": "evenodd"
}, null, -1);
const _hoisted_24 = [
  _hoisted_23
];
const _sfc_main$4 = {
  __name: "pagination",
  props: {
    navInfo: {
      type: Object,
      default: {}
    },
    query: {
      type: Object,
      default: {}
    },
    pageCounts: {
      type: Array,
      default: [
        {
          label: "10",
          value: 10
        },
        {
          label: "50",
          value: 50
        },
        {
          label: "100",
          value: 100
        },
        // {
        //   label: "Title",
        //   value: "title",
        // },
        {
          label: "All",
          value: null
        }
      ]
    }
  },
  emits: ["query"],
  setup(__props, { emit }) {
    const props = __props;
    const page = (url) => {
      emit("query", { page: parseInt(url.split("=")[1]) });
    };
    const per_page = ref(
      _.find(props.pageCounts, {
        value: parseInt(props.query.limit)
      }) || props.pageCounts[0]
    );
    watch(
      () => props.navInfo,
      () => {
        debugger;
      }
    );
    const setLimit = (npp) => {
      emit("query", { ...props.query, limit: parseInt(npp.value) });
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$4, [
        _hoisted_2$4,
        createBaseVNode("div", _hoisted_3$4, [
          createBaseVNode("div", null, [
            createBaseVNode("p", _hoisted_4$3, [
              createTextVNode(" Showing "),
              createBaseVNode("span", _hoisted_5$1, toDisplayString(__props.navInfo.from), 1),
              createTextVNode(" to "),
              createBaseVNode("span", _hoisted_6$1, toDisplayString(__props.navInfo.to), 1),
              createTextVNode(" of "),
              createBaseVNode("span", _hoisted_7$1, toDisplayString(__props.navInfo.total), 1),
              createTextVNode(" results ")
            ])
          ]),
          createBaseVNode("div", _hoisted_8$1, [
            createBaseVNode("span", _hoisted_9$1, "Page " + toDisplayString(__props.navInfo.current_page) + " of " + toDisplayString(__props.navInfo.last_page), 1),
            createVNode(unref(Be$1), {
              modelValue: per_page.value,
              "onUpdate:modelValue": [
                _cache[0] || (_cache[0] = ($event) => per_page.value = $event),
                setLimit
              ],
              class: "inline-block"
            }, {
              default: withCtx(() => [
                createBaseVNode("div", _hoisted_10$1, [
                  createVNode(unref(Ne), { class: "relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm" }, {
                    default: withCtx(() => [
                      createBaseVNode("span", _hoisted_11$1, [
                        per_page.value.value != null ? (openBlock(), createElementBlock("span", _hoisted_12$1, " " + toDisplayString(per_page.value.label), 1)) : createCommentVNode("", true),
                        _hoisted_13$1
                      ]),
                      createBaseVNode("span", _hoisted_14$1, [
                        createVNode(unref(render$2), {
                          class: "h-5 w-5 text-gray-400",
                          "aria-hidden": "true"
                        })
                      ])
                    ]),
                    _: 1
                  }),
                  createVNode(Transition, {
                    "leave-active-class": "transition duration-100 ease-in",
                    "leave-from-class": "opacity-100",
                    "leave-to-class": "opacity-0"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(He), { class: "absolute z-10 mt-1 bottom-full max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm" }, {
                        default: withCtx(() => [
                          (openBlock(true), createElementBlock(Fragment, null, renderList(__props.pageCounts, (count) => {
                            return openBlock(), createBlock(unref(Ue), {
                              key: count.value,
                              value: count,
                              as: "template"
                            }, {
                              default: withCtx(({ active, selected }) => [
                                createBaseVNode("li", {
                                  class: normalizeClass([
                                    active ? "bg-brand-50 text-brand-800" : "text-gray-700",
                                    "relative cursor-default select-none py-2 pl-10 pr-4"
                                  ])
                                }, [
                                  createBaseVNode("span", {
                                    class: normalizeClass([
                                      selected ? "font-medium" : "font-normal",
                                      "block truncate"
                                    ])
                                  }, toDisplayString(count.label), 3),
                                  selected ? (openBlock(), createElementBlock("span", _hoisted_15$1, [
                                    createVNode(unref(render$4), {
                                      class: "h-5 w-5",
                                      "aria-hidden": "true"
                                    })
                                  ])) : createCommentVNode("", true)
                                ], 2)
                              ]),
                              _: 2
                            }, 1032, ["value"]);
                          }), 128))
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ])
              ]),
              _: 1
            }, 8, ["modelValue"])
          ]),
          createBaseVNode("div", null, [
            createBaseVNode("nav", _hoisted_16, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(__props.navInfo.links, (link) => {
                return openBlock(), createElementBlock("button", {
                  href: link.url,
                  onClick: withModifiers(($event) => page(link.url), ["prevent"]),
                  disabled: !link.url,
                  "data-paginate": "",
                  "aria-current": "page",
                  class: normalizeClass([
                    "disabled:text-gray-400  disabled:ring-gray-300 disabled:hover:bg-gray-50 relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset focus:z-20 focus:outline-offset-0",
                    link.active ? "z-10  bg-green-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600" : "text-gray-900 ring-gray-300 hover:bg-gray-50",
                    link.label == "Previous" ? "rounded-l-md" : "",
                    link.label == "Next" ? "rounded-r-md" : ""
                  ])
                }, [
                  createBaseVNode("span", _hoisted_18, toDisplayString(link.label), 1),
                  link.label == "Previous" ? (openBlock(), createElementBlock("svg", _hoisted_19, _hoisted_21)) : createCommentVNode("", true),
                  createTextVNode(" " + toDisplayString(isFinite(link.label) ? link.label : "") + " ", 1),
                  link.label == "Next" ? (openBlock(), createElementBlock("svg", _hoisted_22, _hoisted_24)) : createCommentVNode("", true)
                ], 10, _hoisted_17);
              }), 256))
            ])
          ])
        ])
      ]);
    };
  }
};
const _hoisted_1$3 = { class: "h-16 flex items-stretch flex-shrink-0 odd:bg-slate-50 even:bg-white group hover:bg-blue-200 text-slate-600 hover:text-slate-700 divide-x border-gray-300" };
const _hoisted_2$3 = ["data-col"];
const _hoisted_3$3 = /* @__PURE__ */ createBaseVNode("td", { class: "flex-1" }, null, -1);
const _sfc_main$3 = {
  __name: "gridRow",
  props: {
    data: {
      default: {},
      type: Object
    },
    schema: {
      type: Array,
      default: []
    },
    index: null,
    checked: false,
    id: null,
    key: null
    // checked: false,
  },
  emits: ["check"],
  setup(__props, { emit }) {
    const props = __props;
    const mark = (target) => {
      emit("check", props.id);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("tr", _hoisted_1$3, [
        createBaseVNode("td", {
          onClick: _cache[0] || (_cache[0] = withModifiers(($event) => mark(), ["stop"])),
          class: "w-14 flex items-center justify-center flex-grow-0 flex-shrink-0"
        }, [
          createBaseVNode("span", {
            class: normalizeClass(__props.checked ? "hidden" : "group-hover:hidden text-slate-500")
          }, toDisplayString(__props.index), 3),
          createVNode(unref(render$4), {
            class: normalizeClass([
              "h-5 w-5 bg-white rounded border border-slate-400",
              __props.checked ? "block text-emerald-500" : "hidden group-hover:block text-white "
            ]),
            "aria-hidden": "true"
          }, null, 8, ["class"])
        ]),
        (openBlock(true), createElementBlock(Fragment, null, renderList(__props.schema, (field) => {
          return openBlock(), createElementBlock("td", {
            "data-col": field.name,
            style: normalizeStyle("width:var(--col-" + field.name + "-width)"),
            class: normalizeClass([
              "grid-cell truncate",
              "px-4 py-2 w-72 flex flex-col flex-grow-0 flex-shrink-0"
            ])
          }, [
            createBaseVNode("div", null, toDisplayString(__props.data[field.name]), 1),
            createBaseVNode("div", null, toDisplayString(__props.data[field.secondary]), 1)
          ], 12, _hoisted_2$3);
        }), 256)),
        _hoisted_3$3
      ]);
    };
  }
};
const dataGrid_vue_vue_type_style_index_0_lang = "";
const _hoisted_1$2 = { class: "block relative flex-grow overflow-x-auto" };
const _hoisted_2$2 = { class: "block w-fit min-w-full" };
const _hoisted_3$2 = { class: "noselect flex h-10 divide-x items-center bg-slate-50 border-b border-b-slate-300" };
const _hoisted_4$2 = ["data-col"];
const _hoisted_5 = ["onClick"];
const _hoisted_6 = { class: "flex flex-col cursor-pointer" };
const _hoisted_7 = /* @__PURE__ */ createBaseVNode("th", { class: "flex-grow h-10" }, null, -1);
const _hoisted_8 = {
  key: 0,
  class: "overflow-x-hidden flex flex-col absolute bottom-0 top-10 overflow-auto divide-y min-w-full"
};
const _hoisted_9 = { class: "empty:hidden absolute inset-x-0 top-10 bottom-auto h-56 flex items-center justify-center" };
const _hoisted_10 = {
  key: 0,
  role: "status"
};
const _hoisted_11 = /* @__PURE__ */ createBaseVNode("svg", {
  "aria-hidden": "true",
  class: "w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-brand-700",
  viewBox: "0 0 100 101",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, [
  /* @__PURE__ */ createBaseVNode("path", {
    d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z",
    fill: "currentColor"
  }),
  /* @__PURE__ */ createBaseVNode("path", {
    d: "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z",
    fill: "currentFill"
  })
], -1);
const _hoisted_12 = /* @__PURE__ */ createBaseVNode("span", { class: "sr-only" }, "Loading...", -1);
const _hoisted_13 = [
  _hoisted_11,
  _hoisted_12
];
const _hoisted_14 = {
  key: 1,
  class: "text-error-600 bg-error-100 p-4 rounded-md"
};
const _hoisted_15 = {
  key: 2,
  class: "bg-orange-100 text-orange-600 p-4 rounded-md"
};
const _sfc_main$2 = {
  __name: "dataGrid",
  props: {
    records: {
      default: [],
      type: Array
    },
    schema: {
      default: [
        {
          name: "title",
          label: "Title",
          locked: true
        },
        {
          name: "state",
          label: "State",
          locked: false
        },
        {
          name: "status",
          label: "Status",
          locked: false
        },
        {
          name: "opened_at",
          label: "Opened At",
          type: "date",
          locked: false
        }
      ],
      type: Array
    },
    status: {
      default: "",
      type: String
    },
    // navInfo: {
    //   type: Object,
    //   default: {},
    // },
    config: {
      type: Object,
      default: {}
    }
  },
  setup(__props) {
    const props = __props;
    ref(null);
    const computedRecords = ref([]);
    const rows = ref(null);
    const selected = ref(0);
    watch(
      () => props.records,
      (newRecords) => {
        debugger;
        if (!("map" in props.config) || typeof props.config.map !== "object" || !props.config.map.length) {
          computedRecords.value = newRecords;
          return;
        }
        computedRecords.value = _.map(newRecords, (item) => {
          const record = item.data;
          record.start = getDate(parseISO(record["created_at"]));
          record.end = getDate(
            parseISO(record["opened_at"] || record["created_at"])
          );
          item.data = $g.etl(
            $g.selectPath(record, props.config.path || ""),
            record,
            props.config.map
          );
          return item;
        });
        selected.value = 0;
      }
    );
    const loadSchema = (schema) => {
      _.each(schema, (field) => {
        document.querySelector(":root").style.setProperty(
          "--col-" + field.name + "-width",
          field.width || "24rem"
        );
      });
    };
    watch(() => props.schema, loadSchema);
    onMounted((e3) => {
      loadSchema(props.schema);
    });
    const check = (id2, target) => {
      const record = _.find(computedRecords.value, { id: id2 });
      if (record == null)
        return;
      record.checked = typeof target == "boolean" ? target : !record.checked;
      updateSelected();
    };
    const rowClick = (record) => {
      console.log("Clicked on row:" + record.id);
    };
    const updateSelected = () => {
      selected.value = _.filter(computedRecords.value, "checked").length;
    };
    const toggleAll = () => {
      const targetChecked = selected.value == 0;
      _.each(computedRecords.value, (record) => {
        record.checked = targetChecked;
      });
      selected.value = targetChecked ? computedRecords.value.length : 0;
    };
    const sortBy = (field, direction = 0) => {
      console.log(field.name + (direction ? direction : "toggle"));
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createBaseVNode("table", _hoisted_1$2, [
          createBaseVNode("thead", _hoisted_2$2, [
            createBaseVNode("tr", _hoisted_3$2, [
              createBaseVNode("th", {
                class: "cursor-pointer select-col w-14 text-slate-600 font-normal flex-grow-0 flex-shrink-0",
                onClick: toggleAll
              }, [
                createVNode(unref(render$4), {
                  class: normalizeClass([
                    "hidden h-5 w-5 bg-white rounded border border-slate-400",
                    _ctx.checked ? " text-emerald-500 block" : " text-white "
                  ]),
                  "aria-hidden": "true"
                }, null, 8, ["class"]),
                createTextVNode(" " + toDisplayString(selected.value), 1)
              ]),
              (openBlock(true), createElementBlock(Fragment, null, renderList(__props.schema, (field) => {
                return openBlock(), createElementBlock("th", {
                  "data-col": field.name,
                  style: normalizeStyle("width:var(--col-" + field.name + "-width)"),
                  class: "grid-cell px-4 text-slate-600 whitespace-nowrap flex items-center gap-2 font-normal w-72 flex-grow-0 flex-shrink-0 truncate"
                }, [
                  createBaseVNode("span", {
                    class: "cursor-pointer",
                    onClick: ($event) => sortBy(field)
                  }, toDisplayString(field.label), 9, _hoisted_5),
                  createBaseVNode("div", _hoisted_6, [
                    createVNode(unref(render$1), {
                      onClick: ($event) => sortBy(field, 1),
                      class: "h-5 w-5 hover:text-slate-400 relative top-1",
                      "aria-hidden": "true"
                    }, null, 8, ["onClick"]),
                    createVNode(unref(render$3), {
                      onClick: ($event) => sortBy(field, -1),
                      class: "h-5 w-5 hover:text-slate-400 relative bottom-1",
                      "aria-hidden": "true"
                    }, null, 8, ["onClick"])
                  ])
                ], 12, _hoisted_4$2);
              }), 256)),
              _hoisted_7
            ])
          ]),
          __props.status == "" ? (openBlock(), createElementBlock("tbody", _hoisted_8, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(computedRecords.value, (record, index) => {
              return openBlock(), createBlock(_sfc_main$3, {
                index,
                key: record.id,
                id: record.id,
                data: record.data,
                checked: record.checked,
                onCheck: check,
                onClick: ($event) => rowClick(record),
                ref_for: true,
                ref_key: "rows",
                ref: rows,
                schema: __props.schema
              }, null, 8, ["index", "id", "data", "checked", "onClick", "schema"]);
            }), 128))
          ])) : createCommentVNode("", true)
        ]),
        createBaseVNode("div", _hoisted_9, [
          __props.status == "waiting" ? (openBlock(), createElementBlock("div", _hoisted_10, _hoisted_13)) : createCommentVNode("", true),
          __props.status && __props.status !== "waiting" ? (openBlock(), createElementBlock("p", _hoisted_14, toDisplayString(__props.status), 1)) : createCommentVNode("", true),
          !__props.records.length && __props.status == "" ? (openBlock(), createElementBlock("span", _hoisted_15, " No matching records found ")) : createCommentVNode("", true)
        ])
      ], 64);
    };
  }
};
const _hoisted_1$1 = { class: "border-b border-gray-300 bg-white h-12 shrink-0" };
const _hoisted_2$1 = { class: "flex gap-4 px-4 items-center h-full" };
const _hoisted_3$1 = ["onClick"];
const _hoisted_4$1 = { class: "truncate" };
const _sfc_main$1 = {
  __name: "actionsBar",
  props: {
    actions: {
      type: Array,
      default: [
        { label: "Edit", name: "edit" },
        { label: "View", name: "view" }
      ]
    }
  },
  emits: ["action"],
  setup(__props, { emit }) {
    const take = (report) => {
      emit("action", report);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$1, [
        createBaseVNode("ul", _hoisted_2$1, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(__props.actions, (action) => {
            return openBlock(), createElementBlock("li", {
              class: normalizeClass(["px-4 h-8 py-1 flex rounded-md items-center gap-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 border border-transparent hover:border-white cursor-pointer", "bg-blue-100 hover:bg-blue-200 hover:text-blue-900 text-blue-700"]),
              onClick: ($event) => take(action)
            }, [
              createBaseVNode("span", _hoisted_4$1, toDisplayString(action.label), 1)
            ], 8, _hoisted_3$1);
          }), 256))
        ])
      ]);
    };
  }
};
const _hoisted_1 = { class: "flex-grow overflow-scroll flex" };
const _hoisted_2 = { class: "flex-1 overflow-x-hidden w-72 max-w-[18rem] relative bg-slate-50 shadow-lg flex-col xl:block hidden border-gray-300 border-r" };
const _hoisted_3 = { class: "overflow-x-hidden flex-1 flex-col justify-stretch relative bg-slate-200 min-w-[28rem] w-72 flex shadow-inner" };
const _hoisted_4 = { class: "flex-1 overflow-x-hidden relative w-72 max-w-[18rem] hidden lg:block bg-slate-50 flex-col border-gray-300 border-l" };
const _sfc_main = {
  __name: "reports",
  props: {
    reports: Array,
    id: Number,
    page: { type: Number, default: 1 },
    limit: { type: Number, default: 10 },
    query: {
      type: Object,
      default: { limit: 10, page: 1 }
    },
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
    }
  },
  setup(__props) {
    const props = __props;
    const resource = ref({});
    const historyNavFlag = ref(true);
    const computedRecords = ref([]);
    const setQuery = (queryObj) => {
      const { page = 1, limit = 10, q: q2 = "" } = props.query;
      props.query = { page, limit, q: q2, ...queryObj };
      if (props.query.limit == void 0 || props.query.limit == 10) {
        delete props.query.limit;
      }
      if (props.query.page == void 0 || props.query.page == 1) {
        delete props.query.page;
      }
      if (props.query.q == void 0 || props.query.q == "") {
        delete props.query.q;
      }
    };
    setQuery(Object.fromEntries(new URLSearchParams(document.location.search)));
    const getData = () => {
      const { id: id2 } = resource.value;
      props.records = [];
      props.status = "waiting";
      const { id: report_id } = props;
      const target = new URLSearchParams(props.query).toString();
      if (!historyNavFlag.value) {
        history.pushState({ reportID: report_id }, null, `${report_id}?${target}`);
      }
      historyNavFlag.value = false;
      $.ajax({
        url: `/api/workflowinstances/${id2}/paged_submissions?${target}`,
        contentType: "application/json",
        type: "GET",
        success: (result) => {
          props.records = result.data;
          if (!("map" in resource.value) || typeof resource.value.map !== "object" || !resource.value.map.length) {
            computedRecords.value = _.map(props.records, (data) => {
              return { data, checked: false, id: data.id };
            });
          } else {
            computedRecords.value = _.map(props.records, (record) => {
              const data = $g.etl(
                $g.selectPath(record, resource.value.path || ""),
                record,
                resource.value.map
              );
              return { data, checked: false, id: data.id };
            });
          }
          props.navInfo = _.omit(result, "data");
          props.status = "";
        },
        error: (result) => {
          props.status = "Error";
        }
      });
    };
    watch(
      () => props.query,
      () => {
        getData();
      }
    );
    watch(
      () => props.report,
      (report, oldReport) => {
        if (report == void 0)
          ;
        else {
          resource.value = report.config.resource;
          const { states } = resource.value;
          props.id = report.id;
          $g.collections.update(
            `_states`,
            _.map(states, (item) => {
              if (typeof item == "string") {
                return {
                  label: item,
                  value: item,
                  styles: ""
                };
              }
              return {
                label: item.label,
                value: item.name,
                color: item.styles || ""
              };
            })
          );
        }
        if ("id" in oldReport && props.query.page !== 1) {
          setQuery({ ..._.omit(props.query, "state"), page: 1 });
        } else {
          getData();
        }
      }
    );
    onMounted(() => {
      window.addEventListener("popstate", (event) => {
        if ("reportID" in event.state) {
          historyNavFlag.value = true;
          props.report = _.find(props.reports, { id: event.state.reportID });
        }
      });
      props.report = _.find(props.reports, { id: props.id });
      if (!props.report) {
        console.error("Report not Found!");
        return false;
      }
      resource.value = props.report.config.resource;
    });
    const takeAction = (action) => {
      console.log(action);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createVNode(_sfc_main$5, { class: "shrink-0" }),
        createBaseVNode("div", _hoisted_1, [
          createBaseVNode("aside", _hoisted_2, [
            createVNode(_sfc_main$9, {
              reports: __props.reports,
              id: __props.report ? __props.report.id : null,
              onReport: _cache[0] || (_cache[0] = (newreport) => {
                props.query = {};
                __props.report = newreport;
              })
            }, null, 8, ["reports", "id"])
          ]),
          createBaseVNode("section", _hoisted_3, [
            __props.report.config.display !== "calendar" ? (openBlock(), createBlock(_sfc_main$1, {
              key: 0,
              config: resource.value,
              onAction: takeAction
            }, null, 8, ["config"])) : createCommentVNode("", true),
            __props.report.config.display == "calendar" ? (openBlock(), createBlock(_sfc_main$7, {
              key: 1,
              records: __props.records,
              status: __props.status,
              config: resource.value,
              onQuery: setQuery,
              query: __props.query
            }, null, 8, ["records", "status", "config", "query"])) : createCommentVNode("", true),
            __props.report.config.display == "list" ? (openBlock(), createBlock(_sfc_main$8, {
              key: 2,
              records: __props.records,
              status: __props.status,
              config: resource.value
            }, null, 8, ["records", "status", "config"])) : createCommentVNode("", true),
            __props.report.config.display == "grid" ? (openBlock(), createBlock(_sfc_main$2, {
              key: 3,
              records: computedRecords.value,
              status: __props.status,
              config: resource.value,
              schema: resource.value.schema
            }, null, 8, ["records", "status", "config", "schema"])) : createCommentVNode("", true),
            __props.report.config.display !== "calendar" ? (openBlock(), createBlock(_sfc_main$4, {
              key: 4,
              navInfo: __props.navInfo,
              onQuery: setQuery,
              query: __props.query
            }, null, 8, ["navInfo", "query"])) : createCommentVNode("", true)
          ]),
          createBaseVNode("aside", _hoisted_4, [
            createVNode(_sfc_main$6, {
              reports: __props.reports,
              config: resource.value,
              query: __props.query,
              onQuery: setQuery
            }, null, 8, ["reports", "config", "query"])
          ])
        ])
      ], 64);
    };
  }
};
createApp({
  render: () => h$1(_sfc_main, document.initialData)
}).mount("#app");
