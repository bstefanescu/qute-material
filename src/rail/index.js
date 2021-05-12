import './rail.css';
import mRailItem from './rail-item.js';
import RailMenuTemplate from './rail.jsq';
import Qute from '@qutejs/runtime';
import { onTransitionEnd } from '@qutejs/ui';

const {ViewModel, Template, Property, On} = Qute;

@Template(RailMenuTemplate)
class mRailMenu extends ViewModel {

    @Property(Boolean) expanded;

    _railEl;
    _activeItem;

    get computedClass() {
        return [
            'qm-RailMenu',
            'is-expanded' && this.expanded
        ];
    }

    get activeItemMenu() {
        return this._activeItem && this._activeItem.menu;
    }

    @On('action')
    onRailAction(evt) {
        const activeItem = evt.detail;
        if (!activeItem.menu) {
            if (this._activeItem) this._activeItem.active = false;
            activeItem.active = true;
            this.closeMenu(() => {
                this._activeItem = activeItem;
            });
            this.emitAsync('navigation', activeItem.value);
        } else if (this._activeItem === activeItem) {
            this.closeMenu(() => {
                this._activeItem = null;
            });
        } else {
            if (this._activeItem) {
                this._activeItem.active = false;
            }
            this._activeItem = activeItem;
            activeItem.active = true;
            this.openMenu();
            this.update(); // activeItemMenu changed
        }
        return false;
    }

    openMenu() {
        //this._railEl.classList.toggle('is-expanded')
        // open after the menu is updated so we can
        if (!this.expanded) {
            Qute.runAfter(() => {
                this.expanded = true;
                const width = this._railEl.scrollWidth;
                this._railEl.style.width = width+'px';
            });
        }
    }

    closeMenu(whenDone) {
        if (this.expanded) {
            this.expanded = false;
            this._railEl.style.width = '';
            if (this._activeItem) {
                this._activeItem.active = false;
                whenDone && onTransitionEnd(this._railEl, whenDone);
            }
        }
    }

    toggleMenu() {
        if (this.expanded) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    // -------- drawer customization ---------
    // these methods are the contract for the m:drawer to e able to customize the element when it is transformed in a drawer

    enterDrawer(rightSide) {
        this._railEl.classList.add('qm-Drawer'); // add drawer qm-RailMenu-container.is-drawer
        if (rightSide) {
            this._railEl.classList.add('qm-Drawer--right');
        }
    }

    leaveDrawer(rightSide) {
        this._railEl.classList.remove('qm-Drawer');
        if (rightSide) {
            this._railEl.classList.remove('qm-Drawer--right');
        }
    }
}

export { mRailMenu, mRailItem };
