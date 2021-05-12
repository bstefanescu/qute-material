import './spinner.css';

function createCircle(parent, containerClass) {
    var container = document.createElement('DIV');
    container.className = containerClass;
    var circle = document.createElement('DIV');
    circle.className = 'qm-Spinner-circle';
    container.appendChild(circle);
    parent.appendChild(container);
}
function createLayer(parent, color) {
    var layer = document.createElement('DIV');
    layer.className = color ? 'qm-Spinner-layer qm-Spinner--'+color : 'qm-Spinner-layer';
    createCircle(layer, 'qm-Spinner-clipper qm-Spinner--left');
    createCircle(layer, 'qm-Spinner-gap');
    createCircle(layer, 'qm-Spinner-clipper qm-Spinner--right');
    parent.appendChild(layer);
}


/**
 * If color is not specified a multicolor spinner is created. If the color is 'uni' then the CSS currentColor variable is used for the color
 * @param {*} target
 * @param {*} color can be one of blue | red | green | yellow | current
 */
function createSpinner(color, size) {
    const spinner = document.createElement('DIV');
    var cl = spinner.classList;
    cl.add('qm-Spinner');
    if (size) {
        cl.add('qm-Spinner--'+size);
    }
    if (!color) {
        createLayer(spinner, 'blue');
        createLayer(spinner, 'red');
        createLayer(spinner, 'yellow');
        createLayer(spinner, 'green');
    } else if (color === 'current') {
        cl.add('qm-Spinner--uni');
        createLayer(spinner);
    } else {
        cl.add('qm-Spinner--uni');
        createLayer(spinner, color);
    }
    return spinner;
}

const toggleActiveState = (el, model, valFn) => {
    return () => {
        var val = valFn(model);
        if (val) {
            el.classList.add('is-active');
         } else {
            el.classList.remove('is-active');
         }
    }
}

function mSpinner(rendering, xattrs) {
    let color = null, size = null, showVal;
    if (xattrs) {
        if (xattrs.color) {
            color = rendering.eval(xattrs.color);
        }
        if (xattrs.size) {
            size = rendering.eval(xattrs.size);
        }
        showVal = xattrs.$show;
    }
    const el =createSpinner(color, size);
    showVal && rendering.up(toggleActiveState(el, rendering.model, showVal))();
    return el;
}

export { mSpinner };
