import type { Component } from "solid-js";
import { render } from "solid-js/web";
import App from "./App";
import "virtual:uno.css";
import "./index.css";

const Root: Component = () => {
	return <App />;
};

render(() => <Root />, document.getElementById("root") as HTMLElement);
