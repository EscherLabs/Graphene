const { blackA, green, grass, mauve } = require("@radix-ui/colors");

/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

export default {
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
        info: colors.blue,
        danger: colors.red,
        error: colors.red,
      },
    },
  },

  plugins: [],
  corePlugins: {
    base: false,
  },
};
