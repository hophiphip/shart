import * as THREE from 'three';
import { ARButton } from './components/ARButton';

export const container = document.getElementById('container') as HTMLDivElement;;
export const scene = new THREE.Scene(); 
export const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20); 
export const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
export const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
export const controller = renderer.xr.getController(0);
export const content = document.getElementById('content');

export const options = {
    requiredFeatures: [ 'hit-test' ],
    optionalFeatures: [ 'dom-overlay' ],
    domOverlay: { root: content }, 
};

export const buttonAR = ARButton.createButton(renderer, options);

export const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 32).translate(0, 0.1, 0);

export const reticle = new THREE.Mesh(
    new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial()
);