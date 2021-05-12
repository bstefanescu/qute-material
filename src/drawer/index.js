import window from '@qutejs/window';
import { addMediaQueryListener } from '@qutejs/ui';
import { Overlay } from '../overlay';
import './drawer.css';

let drawerMQ = null;
let drawer = null;
let overlay = null;

function registerDrawerStateUpdate(app, drawerOn, drawerOff) {
    if (!drawerMQ) {
        drawerMQ = window.matchMedia(app.env['qm-Drawer-media-query'] || 'only screen and (min-width: 992px)');
    }
    const update = () => {
        if (drawerMQ.matches) { // enable drawer
            drawerOn();
        } else { // disable drawer
            drawerOff();
        }
    }
    addMediaQueryListener(drawerMQ, update);
    return update;
}

export function openDrawer() {
    overlay = new Overlay(() => {
        drawer.classList.remove('is-open');
    }).open();
    drawer.classList.add('is-open');
}

export function closeDrawer() {
    drawer.classList.remove('is-open');
    overlay && overlay.close();
    overlay = null;
}

export function toggleDrawer() {
    if (drawer.classList.contains('is-open')) {
        closeDrawer();
    } else {
        openDrawer();
    }
}

export function mDrawer(attrs, val, el, comp) {
    return function (el) {
        if (drawer) {
            throw new Error('Drawer already defined! You can only define one drawer using m:drawer.');
        }

        let rightSide = this.eval(val) === 'right';
        if (this.app.env.rtl) rightSide = !rightSide;

        drawer = el;

        const navigationHandler = () => {
            closeDrawer();
        }

        registerDrawerStateUpdate(this.app, () => { // disable drawer
            el.removeEventListener('navigate', navigationHandler);
            if (el.__qute__ && el.__qute__.enterDrawer) {
                el.__qute__.enterDrawer(rightSide);
            } else {
                //TODO use Qute class binding to manipulate classes
                el.classList.remove('qm-Drawer');
                if (rightSide) el.classList.remove('qm-Drawer--right');
            }
        }, () => { // enable drawer
            el.addEventListener('navigate', navigationHandler);
            if (el.__qute__ && el.__qute__.leaveDrawer) {
                el.__qute__.leaveDrawer(rightSide);
            } else {
                //TODO use Qute class binding to manipulate classes
                el.classList.add('qm-Drawer');
                if (rightSide) el.classList.add('qm-Drawer--right');
            }
        })();
    }
}

export function mDrawerToggle(attrs, val, el, comp) {
    return function (el) {
        el.addEventListener('click', () => {
            if (!drawer) {
                throw new Error('Cannot toggle drawer: No drawer defined!');
            }
            toggleDrawer();
        });
        registerDrawerStateUpdate(this.app, () => { // disable drawer
            el.style.display = 'none';
        }, () => { // enable drawer
            el.style.display = '';
        })();
    }
}
