import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mande: {
          black: "#0B0B0B",
          dark: "#141414",
          surface: "#1D1D1D",
          ivory: "#F7F4ED",
          ivoryLight: "#FCFBF8",
          ivoryDark: "#EBE5D8",
          gold: "#C9A24A",
          goldLight: "#DFBE73",
          goldDark: "#9E7B2F",
          earth: "#7A4B24",
          earthLight: "#996338",
          earthDark: "#5C3516",
          sand: "#D8C5A5",
          sandLight: "#EAE0CF",
          sandDark: "#BFA67D",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "Montserrat", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #DFBE73 0%, #C9A24A 50%, #9E7B2F 100%)",
        "dark-gradient": "linear-gradient(180deg, rgba(11,11,11,0.9) 0%, rgba(11,11,11,0.6) 100%)",
        "earth-gradient": "linear-gradient(135deg, #7A4B24 0%, #5C3516 100%)",
      },
      boxShadow: {
        "gold-sm": "0 2px 10px rgba(201, 162, 74, 0.15)",
        "gold-md": "0 4px 20px rgba(201, 162, 74, 0.25)",
        "gold-lg": "0 10px 30px rgba(201, 162, 74, 0.35)",
        "card": "0 4px 25px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 10px 35px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
