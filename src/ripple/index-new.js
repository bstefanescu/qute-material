import window, {document} from '@qutejs/window';
import './ripple.css';
import { onTransitionEnd, runOnNextRepaint } from '@qutejs/ui';

function rippleOn(target, event) {
    rippleAtClientXY(target, event.clientX, event.clientY);
}

function rippleAtClientXY(target, clientX, clientY) {
    const rect = target.getBoundingClientRect();
    rippleAt(target, clientX - rect.left, clientY - rect.top);
}

/**
 * The target must be a positioned element (i.e. relative, absolute or fixed)
 * If the target contains a .qm-Ripple element, it will be used as the ripple area, otherwise the ripple element will be created inside the target.
 * A ripple wave element (i.e. .qm-Ripple-wave) will be created inside the ripple area and removed as soone the animation ends.
 * The x, y coordinate are relative to the ripple area and are the coordinates from where the wave starts.
 * If no x, y is given thwen the wabve will be started from the center of the ripple area.
 */
function rippleAt(target, x, y) {
    const rect = target.getBoundingClientRect();
    
    let rippleEl = document.getElementsByClassName('qm-Ripple')[0];
    console.log('FOUDN RIPPLE', rippleEl);
    if (!rippleEl) {
        rippleEl = document.createElement('div');
        rippleEl.className = 'qm-Ripple';
        //rippleStyle.zIndex = 1000000;
        document.body.appendChild(rippleEl);
    }    
    let rippleStyle = rippleEl.style;
    rippleStyle.color = window.getComputedStyle(target).getPropertyValue('color');
    rippleStyle.left = rect.left+'px';
    rippleStyle.top = rect.top+'px';
    rippleStyle.width = (rect.right-rect.left)+'px';
    rippleStyle.height = (rect.bottom-rect.top)+'px';
            
/*
    let rippleEl = target.querySelector('.qm-Ripple');
    if (!rippleEl) {
        rippleEl = document.createElement('div');
        rippleEl.className = 'qm-Ripple';
        target.appendChild(rippleEl);
    }
*/
    // remove any moving wave
    while (rippleEl.firstElementChild) rippleEl.removeChild(rippleEl.firstElementChild);

    rippleStyle.display = 'block';

    const waveEl = document.createElement('div');
    waveEl.className = 'qm-Ripple-wave';
    if (arguments.length > 1) {
        waveEl.style.left = x + 'px';
        waveEl.style.top = y + 'px';
    }
    rippleEl.appendChild(waveEl);

    onTransitionEnd(waveEl, function() {
        rippleEl.removeChild(waveEl);
        rippleEl.style.display = '';
    });

    runOnNextRepaint(function() {
        waveEl.classList.add('is-moving');
    });
}
function rippleOnClick(target, callback) {
    var listener = function(event) {
        rippleOn(target, event);
        if (callback) return callback(event);
    };
    target.addEventListener('click', listener);
    return function off() {
        target.removeEventListener('click', listener);
    }
}

const Ripple = {
    onclick: rippleOnClick,
    on: rippleOn,
    xy: rippleAt,
    clientXY: rippleAtClientXY
}

export default Ripple;
