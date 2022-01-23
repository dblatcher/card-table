import "../scss/base.scss";

import { initialPiles } from "./setUp";
import { TableApp } from "./TableApp";



function init() {
    const app = new TableApp(initialPiles, document.querySelector(".table"));

    const myWindow = window as any;
    myWindow.app = app;
}

window.addEventListener('load', init, { once: true });
