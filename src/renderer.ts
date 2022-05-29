import * as THREE from 'three';

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

export const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 32).translate(0, 0.1, 0);

export const reticle = new THREE.Mesh(
    new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial()
);

const onSelect = () => {
    if (reticle.visible) {
        const material = new THREE.MeshPhongMaterial({ color: 0xffffff * Math.random() });
        const mesh = new THREE.Mesh(geometry, material);
        reticle.matrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
        mesh.scale.y = Math.random() * 2 + 1;
        scene.add(mesh);
    }
};

export const initialize = () => {
    light.position.set(0.5, 1, 0.25);
    scene.add(light);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;

    container.appendChild(renderer.domElement);

    controller.addEventListener('select', onSelect);
    scene.add(controller);

    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);
};