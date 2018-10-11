// import Vue from 'vue';

import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

import Particles from 'particlesjs';

window.onload = function() {
  Particles.init({
    selector: '.background',
    maxParticles: 250,
    sizeVariations: 4,
    speed: 0.75,
    color: '#0082EE',
  });
};

// import seasonvar from './main';

// const app = new Vue({
//     el: '#app',
//     data: {
//         url: '',
//         error_: false
//     },
//     methods: {
//         openHD: () => {
//             try {
//                 seasonvar(app.url);
//                 app.error_ = false;
//             } catch (err) {
//                 app.error_ = true;
//             }

//         }
//     }
// })
