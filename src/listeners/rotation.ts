import { ARFooter } from "../components/ARFooter";

/**
 * Device rotation handler.
 */
export const register = () => {
    window.addEventListener("deviceorientation", listener, true);    
};

/**
 * Removes effects of rotation components.
 */
export const remove = () => {
    window.removeEventListener("deviceorientation", listener);
};

const arFooter = document.querySelector('ar-footer') as ARFooter;

const listener = (evt: DeviceOrientationEvent) => {
    // const absolute = evt.absolute;
    // const zAxis    = evt.alpha;
    // const yAxis    = evt.gamma;
    const xAxis    = evt.beta;

    arFooter.handleOrientation(xAxis);
};