import Vue from 'vue';

import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

import './logo.jpg';
import './favicon.png';
import './opera.png';
import './firefox.png';

import './serial.crx';
import './firefox.xpi'

import seasonvar from './main';

let app = new Vue({
    el: '#app',
    data: {
        url: '',
        error_: false
    },
    methods: {
        openHD: () => {
            try {
                seasonvar(app.url);
                app.error_ = false;
            } catch (err) {
                app.error_ = true;
            }

        }
    }
})