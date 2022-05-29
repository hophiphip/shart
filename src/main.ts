import * as THREE from 'three';
import { XRAnimationLoopCallback } from 'three';
import { ARButton } from "./ARButton";
import { light, scene, renderer, container, camera, reticle, controller, geometry } from './renderer';

import './css/main.css';

let hitTestSource: THREE.XRHitTestSource | null = null;
let hitTestSourceRequested = false;

light.position.set(0.5, 1, 0.25);
scene.add(light);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;

container.appendChild(renderer.domElement);

customElements.get('ar-button') || customElements.define('ar-button', ARButton);

const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
};

const onSelect = () => {
    if (reticle.visible) {
        const material = new THREE.MeshPhongMaterial({ color: 0xffffff * Math.random() });
        const mesh = new THREE.Mesh(geometry, material);
        reticle.matrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
        mesh.scale.y = Math.random() * 2 + 1;
        scene.add(mesh);
    }
};

controller.addEventListener('select', onSelect);
scene.add(controller);

reticle.matrixAutoUpdate = false;
reticle.visible = false;
scene.add(reticle);

window.addEventListener('resize', onWindowResize);

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

                document.getElementById('place')!.style.display = 'none';
                document.getElementById('content')!.style.display = 'block';
            });

            hitTestSourceRequested = true;
        }

        if (hitTestSource) {
            const hitTestResults = frame.getHitTestResults(hitTestSource);

            if (hitTestResults.length) {
                const hit = hitTestResults[0];
                
                
                document.getElementById('place')!.style.display = 'block';

                if (referenceSpace !== null) {
                    const newMatrix = hit.getPose(referenceSpace)?.transform.matrix;
                    
                    if (newMatrix) {
                        reticle.visible = true;
                        reticle.matrix.fromArray([...newMatrix]);
                    }
                }
            } else {
                reticle.visible = false;

                document.getElementById('place')!.style.display = 'none';
            }
        }
    }

    renderer.render(scene, camera);
};

const animate = () => {
    renderer.setAnimationLoop(render);
    requestAnimationFrame(animate);
};

document.getElementById("open")!.onclick = () => {
    document.getElementById("sidenav")!.style.width = "250px";
}

document.getElementById("close")!.onclick = () => {
    document.getElementById("sidenav")!.style.width = "0";
}

animate();