"use strict";

require("es6-promise").polyfill();
import "nodelist-foreach-polyfill";

import tabs from "./modules/tabs";
import modal from "./modules/modal";
import timer from "./modules/timer";
import calc from "./modules/calc";
import cards from "./modules/cards";
import forms from "./modules/forms";
import slider from "./modules/slider";
import { openModal } from "./modules/modal";

document.addEventListener("DOMContentLoaded", () => {
	const modalTimerId = setTimeout(() => openModal(".modal", modalTimerId), 600000);
	// const diffTime = Math.abs(new Date().getTimezoneOffset() / 60);
	// const deadline = `2020-07-24T00:00:00+0${diffTime}:00`;

	tabs(".tabcontainer", ".tabheader__item", ".tabcontent", "tabheader__item_active");
	modal("[data-modal]", ".modal", modalTimerId);
	timer(".timer", "2020-07-08T00:00:00");
	calc();
	cards(26);
	forms(modalTimerId, "form");
	slider({
		container: ".offer__slider",
		nextArrow: ".offer__slider-next",
		prevArrow: ".offer__slider-prev",
		slide: ".offer__slide",
		totalCounter: "#total",
		currentCounter: "#current",
		wrapper: ".offer__slider-wrapper",
		field: ".offer_slide-inner",
	});
});
