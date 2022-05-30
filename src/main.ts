import * as THREE from 'three';
import { XRAnimationLoopCallback } from 'three';
import { ARButton } from "./components/ARButton";
import { scene, renderer, camera, reticle, initialize } from './renderer';

import './css/main.css';
import { ARFooter } from './components/ARFooter';

let hitTestSource: THREE.XRHitTestSource | null = null;
let hitTestSourceRequested = false;

customElements.get('ar-button') || customElements.define('ar-button', ARButton);
customElements.get('ar-footer') || customElements.define('ar-footer', ARFooter);

const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
};

window.addEventListener('resize', onWindowResize);

const render: XRAnimationLoopCallback = (_: number, frame?: THREE.XRFrame | undefined) => {
    if (frame) {
        const referenceSpace = renderer.xr.getReferenceSpace();
        const session = renderer.xr.getSession();

        if (referenceSpace) {
            //const pose = frame.getViewerPose(referenceSpace);
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

                //document.getElementById('place')!.style.display = 'none';
                document.getElementById('content')!.style.display = 'block';
            });

            hitTestSourceRequested = true;
        }

        if (hitTestSource) {
            const hitTestResults = frame.getHitTestResults(hitTestSource);

            if (hitTestResults.length) {
                const hit = hitTestResults[0];
                
                
                //document.getElementById('place')!.style.display = 'block';

                if (referenceSpace !== null) {
                    const newMatrix = hit.getPose(referenceSpace)?.transform.matrix;
                    
                    if (newMatrix) {
                        reticle.visible = true;
                        reticle.matrix.fromArray([...newMatrix]);
                    }
                }
            } else {
                reticle.visible = false;

                //document.getElementById('place')!.style.display = 'none';
            }
        }
    }

    renderer.render(scene, camera);
};

const animate = () => {
    renderer.setAnimationLoop(render);
    requestAnimationFrame(animate);
};

initialize();
animate();