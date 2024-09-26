const { blackA, green, grass, mauve } = require("@radix-ui/colors");

/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

export default {
  content: [
    "./public/build/assets/*.js",
    "./public/assets/js/vendor/gform.tailwind.js",
    "./resources/views/default/*Vue.blade.php",
    "./resources/views/*Vue.blade.php",
    "./resources/views/mustache/partials/project/*.mustache",
    "./public/assets/js/cob/project/**/*.cob.js",
    "./resources/assets/js/components/*.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"system - ui"',
          '"-apple - system"',
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Noto Sans",
          "Liberation Sans",
          "Arial",
          '"sans - serif"',
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
          "Inter",
          "sans-serif",
        ],

        // sans: ["Figtree", ...defaultTheme.fontFamily.sans],
      },

      colors: {
        ...blackA,
        ...green,
        ...grass,
        ...mauve,

        gform: colors.blue,
        graphene: colors.orange,
        brand: {
          // CMYK: C25 M0 Y98 K0
          // HEX: #CEDC00
          // 60% HEX: #E2EA66
          // 40% HEX: #EBF199
          // 20% HEX: #F5F8CC
          50: "#F5F8CC",
          100: "#EBF199",
          200: "#E2EA66",
          300: "#CEDC00",
          // CMYK: C63 M0 Y84 K0
          // HEX: #6CC24A
          // 60% HEX: #A7DA92
          // 40% HEX: #C4E7B7
          // 20% HEX: #E2F3DB
          400: "#A7DA92",
          500: "#C4E7B7",
          600: "#A7DA92",
          700: "#6CC24A",

          //CMYK: C93 M10 Y75 K43
          // RGB: R0, G93, B64
          // HEX: #005A43

          800: "#005A43",
          900: "#005A43",
        },
        //CMYK: C30 M20 Y19 K58
        // HEX: #5A5C5B
        // 60% HEX: #9C9D9D
        // 40% HEX: #BDBEBD
        // 20% HEX: #DEDEDE
        // brand: colors.orange,
        success: colors.emerald,
        info: colors.blue,
        danger: colors.red,
        error: colors.red,
      },
    },
  },
  safelist: [
    "transition",
    "ease-in-out",
    "col-span-12",
    "border-gray-300",
    "focus:border-gform-300",
    "focus:ring",
    "focus:ring-gform-200",
    "focus:ring-opacity-50",
    "rounded-md",
    "shadow-sm",
    "block",
    "w-full",
    // {
    //     pattern:
    //         /(bg|border|text|outline)-(berry|secondary)-+/, // You can display all the colors that you need
    //     variants: ["focus", "active", "group-hover"], // Optional
    // },
    // {
    //     pattern: /col-(start|span)-+/,
    //     variants: ["sm"],
    // },
    {
      pattern: /grid-cols-+/,
    },
  ],
  plugins: [
    require("@tailwindcss/forms"),
    // require("@headlessui/tailwindcss")({ prefix: "ui" }),

    // require("@headlessui/tailwindcss"),
    require("@tailwindcss/typography"),
    function ({ addBase, theme }) {
      function extractColorVars(colorObj, colorGroup = "") {
        return Object.keys(colorObj).reduce((vars, colorKey) => {
          const value = colorObj[colorKey];

          const newVars =
            typeof value === "string"
              ? { [`--color${colorGroup}-${colorKey}`]: value }
              : extractColorVars(value, `-${colorKey}`);

          return { ...vars, ...newVars };
        }, {});
      }

      addBase({
        ":root": extractColorVars(theme("colors")),
      });
    },
  ],
};
