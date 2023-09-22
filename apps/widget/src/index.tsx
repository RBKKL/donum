import { render } from "solid-js/web";
import { Widget } from "~/components/widget";

render(() => <Widget />, document.getElementById("widget") as HTMLElement);
