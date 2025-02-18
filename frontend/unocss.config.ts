import {
	defineConfig,
	presetAttributify,
	presetIcons,
	presetUno,
} from "unocss";

export default defineConfig({
	presets: [
		presetUno(),
		presetIcons({
			scale: 1.2,
			cdn: "https://esm.sh/",
		}),
		presetAttributify(),
	],
	theme: {
		colors: {
			primary: "#3b82f6",
		},
	},
	shortcuts: {
		btn: "px-4 py-2 rounded inline-block bg-primary text-white cursor-pointer hover:bg-primary/80 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50",
		"icon-btn":
			"text-[0.9em] inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-primary",
	},
});
