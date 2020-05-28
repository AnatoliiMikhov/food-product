'use strict';

document.addEventListener('DOMContentLoaded', () => {

	/* ---------------------------------- Tabs ---------------------------------- */

	// Tabs
	const tabsParent = document.querySelector('.tabcontainer'),
		tabs = tabsParent.querySelectorAll('.tabheader__item'),
		tabsContent = tabsParent.querySelectorAll('.tabcontent');


	function hideTabContent() {
		tabsContent.forEach(item => {
			item.classList.add('hide');
			item.classList.remove('show', 'fade');
		});

		tabs.forEach(item => {
			item.classList.remove('tabheader__item_active');
		});
	}

	function showTabContent(i = 0) {
		tabsContent[i].classList.add('show', 'fade');
		tabsContent[i].classList.remove('hide');
		tabs[i].classList.add('tabheader__item_active');
	}

	hideTabContent();
	showTabContent();

	tabsParent.addEventListener('click', (event) => {
		const target = event.target;

		if (target && target.classList.contains('tabheader__item')) {
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
			hours = Math.floor((t / (1000 * 60 * 60) % 24)),
			minutes = Math.floor((t / (1000 * 60) % 60)),
			seconds = Math.floor((t / 1000) % 60);

		return {
			total: t,
			days,
			hours,
			minutes,
			seconds
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
			days = timer.querySelector('#days'),
			hours = timer.querySelector('#hours'),
			minutes = timer.querySelector('#minutes'),
			seconds = timer.querySelector('#seconds'),
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

	setClock('.timer', deadline);

	/* --------------------------------class Menu Card ------------------------------- */
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
			const element = document.createElement('div');

			if (this.classes.length === 0) {
				this.classes = `menu__item`;
				element.classList.add(this.classes);
			} else {
				this.classes.push('menu__item');
				this.classes.forEach(className => element.classList.add(className));
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

	new MenuCard(
		`img/tabs/vegy.jpg`,
		`vegy`,
		`Меню "Фитнес"`,
		`Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!`,
		9,
		`.menu .container`
	).render();

	new MenuCard(
		`img/tabs/elite.jpg`,
		`elite`,
		`Меню “Премиум”`,
		`В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!`,
		14,
		`.menu .container`
	).render();

	new MenuCard(
		`img/tabs/post.jpg`,
		`post`,
		`Меню "Постное"`,
		`Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.`,
		21,
		`.menu .container`
	).render();

	/* ---------------------------------- Modal --------------------------------- */
	// Modal
	const modalOpenBtn = document.querySelectorAll('[data-modal]'),
		modal = document.querySelector('.modal');

	modalOpenBtn.forEach(btn => {
		btn.addEventListener('click', openModal);
	});


	function openModal() {
		modal.classList.add('show');
		modal.classList.remove('hide');
		document.body.style.overflow = "hidden";
		clearInterval(modalTimerId);
	}

	function closeModal() {
		modal.classList.add('hide');
		modal.classList.remove('show');
		document.body.style.overflow = "";
	}

	modal.addEventListener('click', (event) => {
		if (event.target === modal || event.target.getAttribute('data-close') == '') {
			closeModal();
		}
	});

	document.addEventListener('keydown', (event) => {
		if (event.code === "Escape" && modal.classList.contains('show')) {
			closeModal();
		}
	});

	const modalTimerId = setTimeout(openModal, 600000); // TODO change ms

	function showModalByScroll() {
		if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
			openModal();
			window.removeEventListener('scroll', showModalByScroll);
		}
	}
	window.addEventListener('scroll', showModalByScroll);

	/* ----------------------------- Send Form Data ----------------------------- */
	// Forms

	const forms = document.querySelectorAll('form');

	const message = {
		loading: 'img/form/spinner.svg',
		success: 'Спасибо! Мы скоро перезвоним',
		failure: 'Произошла ошибка. Попробуйте ещё раз'
	};

	forms.forEach(item => {
		postData(item);
	});

	function postData(form) {
		form.addEventListener('submit', (event) => {
			event.preventDefault();

			const statusMessage = document.createElement('img');
			statusMessage.src = message.loading;
			statusMessage.textContent = message.loading;
			statusMessage.style.cssText = `
			display: block;
			margin: 0 auto;
			`;
			form.insertAdjacentElement('afterend', statusMessage);

			const formData = new FormData(form);

			/* const object = {};
			formData.forEach(function (value, key) {
				object[key] = value;
			});

			const json = JSON.stringify(object); */

			fetch('server.php', {
				method: 'POST',
				/* headers: {
					'Content-type': 'application/json; charset=utf-8'
				}, */
				body: formData
			})
				.then(data => data.text())
				.then(data => {
					console.log(data);
					showThanksModal(message.success);
					statusMessage.remove();
				}).catch(() => {
					showThanksModal(message.failure);
				}).finally(() => {
					form.reset();
				});

		});
	}

	// Thanks message
	function showThanksModal(message) {
		const prevModalDialog = document.querySelector('.modal__dialog');

		prevModalDialog.classList.add('hide');
		openModal();

		const thanksModal = document.createElement('div');
		thanksModal.classList.add('modal__dialog');
		thanksModal.innerHTML = `
			<div class="modal__content">
				<div class="modal__close" data-close>&times;</div>
				<div class="modal__title">${message}</div>
			</div>
		`;

		document.querySelector('.modal').append(thanksModal);

		setTimeout(() => {
			thanksModal.remove();
			prevModalDialog.classList.add('show');
			prevModalDialog.classList.remove('hide');
			closeModal();
		}, 3000);
	}

});