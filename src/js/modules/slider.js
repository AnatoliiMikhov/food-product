'use strict';
function slider() {
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
}

module.exports = slider;