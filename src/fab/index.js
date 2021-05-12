import Qute from '@qutejs/runtime';
import FabTemplate from './fab.jsq';
import { onTransitionEnd } from '@qutejs/ui';
import './fab.css';

const { ViewModel, Template, Property, On } = Qute;

function toggleItem(item, tm, show, cb) {
    window.setTimeout(() => {
        item.classList.toggle('is-visible');
        item.style.opacity = show ? 1 : 0;
        cb && cb(item);
    }, tm);
}

function getDirectionClass(dir) {
    switch(dir) {
        case 'left': return 'qm-Fab--left';
        case 'top': return 'qm-Fab--top';
        case 'bottom': return 'qm-Fab--bottom';
    }
    return 'qm-Fab--right';
}

@Template(FabTemplate)
class mFab extends ViewModel {

    @Property(String) icon = 'menu';
    @Property(String) action;
    @Property(Array) items;


    @On('click', 'button[data-action]')
    onClick(event) {
        const action = event.target.getAttribute('data-action');
        this.emit('action', action);
        this.close(true);
        return false;
    }

    _computeClass() {
        return ['qm-Fab', getDirectionClass(this.$attrs.direction)];
    }

    get isOpen() {
        return this.$el.classList.contains('is-open');
    }

    open() {
        const items = this.$el.getElementsByClassName('qm-Fab-item');
        this.$el.classList.add('is-open');
        let tm = 0, item, l = items.length-1;
        for (let i=0;i<l;i++) {
            item = items[i];
            toggleItem(item, tm, true);
            tm += 60;
        }
        // for the last button we need to callback when transition ends
        item = items[l];
        toggleItem(item, tm, true);

    }

    close(closeByAction) {
        if (this.$el.classList.contains('is-open')) {
            const items = this.$el.getElementsByClassName('qm-Fab-item');
            let tm = 0, item;
            for (let i=items.length-1;i>0;i--) {
                item = items[i];
                toggleItem(item, tm, false);
                tm += 60;
            }

            // support for animated hamburger menu
            if (closeByAction) {
                const menuBtn = this.$el.firstElementChild;
                Qute.get(menuBtn).toggle();
                /*
                const menuBtn = this.$el.firstElementChild;
                const hamburger = menuBtn.querySelector('.is-active');
                hamburger && hamburger.classList.remove('is-active');
                */
            }

            // for the last button we need to callback when transition ends
            item = items[0];
            toggleItem(item, tm, false, () => {
                onTransitionEnd(item, () => {
                    this.$el.classList.remove('is-open');
                });
            });
        }
    }

    handlePrimaryAction() {
        if (this.isOpen) {
            if (this.action) {
                this.emit('action', this.action);
            }
            this.emit('close', this);
            this.close();
        } else if (this.items && this.items.length > 0) {
            this.emit('open', this);
            this.open();
        } else {
            this.emit('action', this.action);
        }
        return false;
    }
}

export { mFab };
