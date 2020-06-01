"use strict";

document.addEventListener("DOMContentLoaded", () => {
	/* ---------------------------------- Tabs ---------------------------------- */
	// Tabs
	const tabsParent = document.querySelector(".tabcontainer"),
		tabs = tabsParent.querySelectorAll(".tabheader__item"),
		tabsContent = tabsParent.querySelectorAll(".tabcontent");

	function hideTabContent() {
		tabsContent.forEach((item) => {
			item.classList.add("hide");
			item.classList.remove("show", "fade");
		});

		tabs.forEach((item) => {
			item.classList.remove("tabheader__item_active");
		});
	}

	function showTabContent(i = 0) {
		tabsContent[i].classList.add("show", "fade");
		tabsContent[i].classList.remove("hide");
		tabs[i].classList.add("tabheader__item_active");
	}

	hideTabContent();
	showTabContent();

	tabsParent.addEventListener("click", (event) => {
		const target = event.target;

		if (target && target.classList.contains("tabheader__item")) {
			tabs.forEach((item, i) => {
				if (target === item) {
					hideTabContent();
					showTabContent(i);
				}
			});
		}
	});

	/* ---------------------------------- Timer --------------------------------- */
	// Timer
	// const deadline = '2020-06-23T23:32:37.323Z';
	const diffTime = Math.abs(new Date().getTimezoneOffset() / 60);
	const deadline = `2020-06-24T00:00:00+0${diffTime}:00`; //

	function getTimeRemaining(endtime) {
		const t = Date.parse(endtime) - Date.parse(new Date()),
			days = Math.floor(t / (1000 * 60 * 60 * 24)),
			hours = Math.floor((t / (1000 * 60 * 60)) % 24),
			minutes = Math.floor((t / (1000 * 60)) % 60),
			seconds = Math.floor((t / 1000) % 60);

		return {
			total: t,
			days,
			hours,
			minutes,
			seconds,
		};
	}

	function getZero(num) {
		if (num >= 0 && num < 10) {
			return `0${num}`;
		} else {
			return num;
		}
	}

	function setClock(selector, endtime) {
		const timer = document.querySelector(selector),
			days = timer.querySelector("#days"),
			hours = timer.querySelector("#hours"),
			minutes = timer.querySelector("#minutes"),
			seconds = timer.querySelector("#seconds"),
			timeInterval = setInterval(updateClock, 1000);

		updateClock();

		function updateClock() {
			const t = getTimeRemaining(endtime);

			days.textContent = getZero(t.days);
			hours.textContent = getZero(t.hours);
			minutes.textContent = getZero(t.minutes);
			seconds.textContent = getZero(t.seconds);

			if (t.total <= 0) {
				clearInterval(timeInterval);

				days.textContent = "00";
				hours.textContent = "00";
				minutes.textContent = "00";
				seconds.textContent = "00";
			}
		}
	}

	setClock(".timer", deadline);

	/* -------------------------------- Menu Card ------------------------------- */
	// Menu Card
	class MenuCard {
		constructor(src, alt, title, descr, price, parentSelector, ...classes) {
			this.src = src;
			this.alt = alt;
			this.title = title;
			this.descr = descr;
			this.price = price;
			this.classes = classes;
			this.parent = document.querySelector(parentSelector);
			this.transfer = 27;
			this.changeToUAN();
		}

		changeToUAN() {
			this.price = this.price * this.transfer;
		}

		render() {
			const element = document.createElement("div");

			if (this.classes.length === 0) {
				this.classes = `menu__item`;
				element.classList.add(this.classes);
			} else {
				this.classes.push("menu__item");
				this.classes.forEach((className) => element.classList.add(className));
			}

			element.innerHTML = `
				<img src=${this.src} alt=${this.alt} />
				<h3 class="menu__item-subtitle">${this.title}</h3>
				<div class="menu__item-descr">
					${this.descr}
				</div>
				<div class="menu__item-divider"></div>
				<div class="menu__item-price">
				<div class="menu__item-cost">Цена:</div>
				<div class="menu__item-total"><span>${this.price}</span> грн/день</div>
				</div>
            `;
			this.parent.append(element);
		}
	}

	// fetch usage
	/* const getResouce = async (url) => {
		  const res = await fetch(url);
  
		  if (!res.ok) {
			  throw new Error(`Could not fetch ${url}, status ${res.status}`);
		  }
  
		  return await res.json();
	  }; */

	/* getResouce('http://localhost:3000/menu')
		  .then(data => {
			  data.forEach(({ img, altimg, title, descr, price }) => {
				  new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
			  });
		  }); */

	// axios usage library
	axios.get("http://localhost:3000/menu").then((data) => {
		data.data.forEach(({ img, altimg, title, descr, price }) => {
			new MenuCard(img, altimg, title, descr, price, ".menu .container").render();
		});
	});

	/* ---------------------------------- Modal --------------------------------- */
	// Modal
	const modalOpenBtn = document.querySelectorAll("[data-modal]"),
		modal = document.querySelector(".modal");

	modalOpenBtn.forEach((btn) => {
		btn.addEventListener("click", openModal);
	});

	function openModal() {
		modal.classList.add("show");
		modal.classList.remove("hide");
		document.body.style.overflow = "hidden";
		clearInterval(modalTimerId);
	}

	function closeModal() {
		modal.classList.add("hide");
		modal.classList.remove("show");
		document.body.style.overflow = "";
	}

	modal.addEventListener("click", (event) => {
		if (event.target === modal || event.target.getAttribute("data-close") == "") {
			closeModal();
		}
	});

	document.addEventListener("keydown", (event) => {
		if (event.code === "Escape" && modal.classList.contains("show")) {
			closeModal();
		}
	});

	const modalTimerId = setTimeout(openModal, 600000); // TODO change ms

	function showModalByScroll() {
		if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
			openModal();
			window.removeEventListener("scroll", showModalByScroll);
		}
	}
	window.addEventListener("scroll", showModalByScroll);

	/* ----------------------------- Send Form Data ----------------------------- */
	// Forms

	const forms = document.querySelectorAll("form");

	const message = {
		loading: "img/form/spinner.svg",
		success: "Спасибо! Мы скоро перезвоним",
		failure: "Произошла ошибка. Попробуйте ещё раз",
	};

	forms.forEach((form) => {
		bindPostData(form);
	});

	const postData = async (url, data) => {
		const res = await fetch(url, {
			method: "POST",
			headers: {
				"Content-type": "application/json; charset=utf-8",
			},
			body: data,
		});
		return await res.json();
	};

	function bindPostData(form) {
		form.addEventListener("submit", (event) => {
			event.preventDefault();

			const statusMessage = document.createElement("img");
			statusMessage.src = message.loading;
			statusMessage.textContent = message.loading;
			statusMessage.style.cssText = `
			display: block;
			margin: 0 auto;
			`;
			form.insertAdjacentElement("afterend", statusMessage);

			const formData = new FormData(form);

			const json = JSON.stringify(Object.fromEntries(formData.entries()));

			postData("http://localhost:3000/requests", json)
				.then((data) => {
					console.log(data);
					showThanksModal(message.success);
					statusMessage.remove();
				})
				.catch(() => {
					showThanksModal(message.failure);
				})
				.finally(() => {
					form.reset();
				});
		});
	}

	// Thanks message
	function showThanksModal(message) {
		const prevModalDialog = document.querySelector(".modal__dialog");

		prevModalDialog.classList.add("hide");
		openModal();

		const thanksModal = document.createElement("div");
		thanksModal.classList.add("modal__dialog");
		thanksModal.innerHTML = `
			<div class="modal__content">
				<div class="modal__close" data-close>&times;</div>
				<div class="modal__title">${message}</div>
			</div>
		`;

		document.querySelector(".modal").append(thanksModal);

		setTimeout(() => {
			thanksModal.remove();
			prevModalDialog.classList.add("show");
			prevModalDialog.classList.remove("hide");
			closeModal();
		}, 3000);
	}

	/* --------------------------------- Slider --------------------------------- */
	// Slider ver2.0
	const slides = document.querySelectorAll(".offer__slide"),
		slider = document.querySelector(".offer__slider"),
		prev = document.querySelector(".offer__slider-prev"),
		next = document.querySelector(".offer__slider-next"),
		current = document.querySelector("#current"),
		total = document.querySelector("#total"),
		slidesWrapper = document.querySelector(".offer__slider-wrapper"),
		slidesField = document.querySelector(".offer_slide-inner"),
		width = window.getComputedStyle(slidesWrapper).width;

	let slideIndex = 1;
	let offset = 0;

	if (slides.length < 10) {
		total.textContent = `0${slides.length}`;
	} else {
		total.textContent = slides.length;
	}

	current.textContent = `0${slideIndex}`;

	slidesField.style.width = 100 * slides.length + "%";
	slidesField.style.display = "flex";
	slidesField.style.transition = "0.5s all";

	slidesWrapper.style.overflow = "hidden";

	slides.forEach((slide) => {
		slide.style.width = width;
	});

	slider.style.position = "relative";

	const indicators = document.createElement("ol");
	indicators.classList.add("carousel-indicators");
	slider.append(indicators);

	const dots = [];
	for (let i = 0; i < slides.length; i++) {
		const dot = document.createElement("li");
		dot.setAttribute("data-slide-to", i + 1);
		dot.classList.add("dot");

		if (i == 0) {
			dot.style.opacity = 1;
		}
		indicators.append(dot);
		dots.push(dot);
	}

	next.addEventListener("click", () => {
		if (offset == deleteNotDigits(width) * (slides.length - 1)) {
			offset = 0;
		} else {
			offset += deleteNotDigits(width);
		}

		if (slideIndex == slides.length) {
			slideIndex = 1;
		} else {
			slideIndex++;
		}

		setTranslation(slidesField, offset);
		setCurrentSlide(slideIndex, current);
		setOpacityDots(dots, slideIndex);
		sliderAnimation();
	});

	prev.addEventListener("click", () => {
		if (offset == 0) {
			offset = deleteNotDigits(width) * (slides.length - 1);
		} else {
			offset -= deleteNotDigits(width);
		}

		if (slideIndex == 1) {
			slideIndex = slides.length;
		} else {
			slideIndex--;
		}

		setTranslation(slidesField, offset);
		setCurrentSlide(slideIndex, current);
		setOpacityDots(dots, slideIndex);
		sliderAnimation();
	});

	dots.forEach((dot) => {
		dot.addEventListener("click", (e) => {
			const slideTo = e.target.getAttribute("data-slide-to");
			slideIndex = slideTo;
			offset = deleteNotDigits(width) * (slideTo - 1);

			setTranslation(slidesField, offset);
			setCurrentSlide(slideIndex, current);
			setOpacityDots(dots, slideIndex);
			sliderAnimation();
		});
	});

	function setTranslation(slidesField, offset) {
		slidesField.style.transform = `translateX(-${offset}px)`;
	}

	function sliderAnimation() {
		slides.forEach((slide, i) => {
			slide.style.width = width;
			if (i == slideIndex - 1) {
				slide.classList.add("fade");
			} else {
				slide.classList.remove("fade");
			}
		});
	}

	function setOpacityDots(dots, slideIndex) {
		dots.forEach((dot) => (dot.style.opacity = ".5"));
		dots[slideIndex - 1].style.opacity = 1;
	}

	function setCurrentSlide(slideIndex, current) {
		if (slideIndex < 10) {
			current.textContent = `0${slideIndex}`;
		} else {
			current.textContent = slideIndex;
		}
	}

	function deleteNotDigits(str) {
		return +str.replace(/\D/g, "");
	}

	/* ------------------------------- Calculator ------------------------------- */
	// Calculator
	const result = document.querySelector(".calculating__result span");
	let sex, height, weight, age, ratio;

	if (localStorage.getItem("sex")) {
		sex = localStorage.getItem("sex");
	} else {
		sex = "female";
		localStorage.setItem("sex", "female");
	}

	if (localStorage.getItem("ratio")) {
		ratio = localStorage.getItem("ratio");
	} else {
		ratio = 1.375;
		localStorage.setItem("ratio", 1.375);
	}

	function initLocalSettings(selector, activeClass) {
		const elements = document.querySelectorAll(selector);

		elements.forEach((elem) => {
			elem.classList.remove(activeClass);
			if (elem.getAttribute("id") === localStorage.getItem("sex")) {
				elem.classList.add(activeClass);
			}
			if (elem.getAttribute("data-ratio") === localStorage.getItem("ratio")) {
				elem.classList.add(activeClass);
			}
		});
	}

	initLocalSettings("#gender div", "calculating__choose-item_active");
	initLocalSettings(".calculating__choose_big div", "calculating__choose-item_active");

	function calcTotal() {
		if (!sex || !height || !weight || !age || !ratio) {
			result.textContent = "____";
			return;
		}
		if (sex === "female") {
			result.textContent = Math.round((447.6 + 9.2 * weight + 3.1 * height - 4.3 * age) * ratio);
		} else {
			result.textContent = Math.round((88.36 + 13.4 * weight + 4.8 * height - 5.7 * age) * ratio);
		}
	}
	calcTotal();

	function getStaticInformation(selector, activeClass) {
		const elements = document.querySelectorAll(selector);

		elements.forEach((elem) => {
			elem.addEventListener("click", (e) => {
				if (e.target.getAttribute("data-ratio")) {
					ratio = +e.target.getAttribute("data-ratio");
					localStorage.setItem("ratio", ratio);
				} else {
					sex = e.target.getAttribute("id");
					localStorage.setItem("sex", sex);
				}

				elements.forEach((elem) => {
					elem.classList.remove(activeClass);
				});
				e.target.classList.add(activeClass);

				calcTotal();
			});
		});
	}

	getStaticInformation("#gender div", "calculating__choose-item_active");
	getStaticInformation(".calculating__choose_big div", "calculating__choose-item_active");

	function getDynamicInformation(selector) {
		const input = document.querySelector(selector);
		input.addEventListener("input", () => {
			const checkInput = new Promise((resolve, reject) => {
				if (input.value.match(/\D/g)) {
					input.style.border = `1px solid red`;
					input.style.backgroundColor = `pink`;
					let checkValue = input.value.replace(/\D/g, "");
					setTimeout(() => {
						input.value = checkValue;
						input.style.border = `none`;
						input.style.backgroundColor = ``;
						resolve();
					}, 442);
				}
			});
			checkInput.then(() => getInputValues()).then(() => calcTotal());

			getInputValues();
			calcTotal();
		});

		function getInputValues() {
			switch (input.getAttribute("id")) {
				case "height":
					height = +input.value;
					break;
				case "weight":
					weight = +input.value;
					break;
				case "age":
					age = +input.value;
					break;
			}
		}
	}

	getDynamicInformation("#height");
	getDynamicInformation("#weight");
	getDynamicInformation("#age");
});
