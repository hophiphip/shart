import * as THREE from 'three';
import { XRAnimationLoopCallback } from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton';

import './css/main.css';

let container: HTMLDivElement;
let camera: THREE.PerspectiveCamera; 
let scene: THREE.Scene; 
let renderer: THREE.WebGLRenderer;
let controller;

let reticle: THREE.Mesh;

let hitTestSource: THREE.XRHitTestSource | null = null;
let hitTestSourceRequested = false;

const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
};

const init = () => {
    container = document.createElement('div');
    document.body.appendChild(container);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    light.position.set(0.5, 1, 0.25);
    scene.add(light);

    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    container.appendChild(renderer.domElement);

    document.body.appendChild(ARButton.createButton(renderer, { 
        requiredFeatures: [ 'hit-test' ],
        optionalFeatures: [ 'dom-overlay', 'dom-overlay-for-handheld-ar' ],
        domOverlay: { root: document.body }, 
    }));

    const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 32).translate(0, 0.1, 0);

    const onSelect = () => {
        if (reticle.visible) {
            const material = new THREE.MeshPhongMaterial({ color: 0xffffff * Math.random() });
            const mesh = new THREE.Mesh(geometry, material);
            reticle.matrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
            mesh.scale.y = Math.random() * 2 + 1;
            scene.add(mesh);
        }
    };

    controller = renderer.xr.getController(0);
    controller.addEventListener('select', onSelect);
    scene.add(controller);

    reticle = new THREE.Mesh(
        new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial()
    );

    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);

    window.addEventListener('resize', onWindowResize);
};

const render: XRAnimationLoopCallback = (time: number, frame?: THREE.XRFrame | undefined) => {
    if (frame) {
        const referenceSpace = renderer.xr.getReferenceSpace();
        const session = renderer.xr.getSession();

        if (referenceSpace) {
            const pose = frame.getViewerPose(referenceSpace);
        }    

        if (hitTestSourceRequested == false) {
            session?.requestReferenceSpace('viewer').then((referenceSpace) => {
                session.requestHitTestSource({space: referenceSpace})
                    .then((src) => {
                        hitTestSource = src;
                    })
            });

            session?.addEventListener('end', () => {
                hitTestSourceRequested = false;
                hitTestSource = null;
            });

            hitTestSourceRequested = true;
        }

        if (hitTestSource) {
            const hitTestResults = frame.getHitTestResults(hitTestSource);

            if (hitTestResults.length) {
                const hit = hitTestResults[0];
                
                
                if (referenceSpace !== null) {
                    const newMatrix = hit.getPose(referenceSpace)?.transform.matrix;
                    
                    if (newMatrix) {
                        reticle.visible = true;
                        reticle.matrix.fromArray([...newMatrix]);
                    }
                }
            } else {
                reticle.visible = false;
            }
        }
    }

    renderer.render(scene, camera);
};

const animate = () => {
    renderer.setAnimationLoop(render);
};

init();
animate();