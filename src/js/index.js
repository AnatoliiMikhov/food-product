document.addEventListener('DOMContentLoaded', () => {

    'use strict';

    const tabs = require('./modules/tabs'),
        modal = require('./modules/modal'),
        timer = require('./modules/timer'),
        calc = require('./modules/calc'),
        cards = require('./modules/cards'),
        forms = require('./modules/forms'),
        slider = require('./modules/slider');

    tabs();
    modal();
    timer();
    calc();
    cards();
    forms();
    slider();


});