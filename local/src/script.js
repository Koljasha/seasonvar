import 'bootstrap/dist/css/bootstrap-reboot.css';
import 'bootstrap/dist/css/bootstrap-grid.css';
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
