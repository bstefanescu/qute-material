import Qute from '@qutejs/runtime';
import ListTemplate from './list.jsq';
import mListItem from './list-item.js';
import './list.css';

const { ViewModel, Template, Property, On } = Qute;

function closestItem(el, stop) {
    while (el && el !== stop) {
        if (el.classList.contains("qm-List-item")) return el;
        el = el.parentNode;
    }
    return null;
}

function nextItem(item) {
    var node = item.nextElementSibling;
    while (node) {
        if (node.classList.contains('qm-List-item')) {
            return node;
        }
        node = node.nextElementSibling;
    }
    return null;
}

function prevItem(item) {
    var node = item.previousElementSibling;
    while (node) {
        if (node.classList.contains('qm-List-item')) {
            return node;
        }
        node = node.previousElementSibling;
    }
    return null;
}

@Template(ListTemplate)
class mList extends ViewModel {

    @Property(Boolean) multiple; // multpile choices list
    @Property(Boolean) outline;
    @Property(Boolean) floating;
    @Property(Array) items;
    // an optional function to test if an item is checked when rendering the first time.
    @Property(Function) isChecked = function(item) {
        return false;
    }

    get _computedClass() {
        const classes = ['qm-List', 'qm-Box qm-Box--nopadding'];
        this.outline && classes.push('qm-Box--outline');
        this.floating && classes.push('qm-Box--floating');
        return classes;
    }

    created(el) {
        if(el.tabIndex == null) {
            el.tabIndex = -1;
        }
    }

    @On('keydown')
    onKeydown(event) {
        var code = event.keyCode || event.which;
        switch (code) {
            case 38: // up
            this.up();
            event.preventDefault();
            break;
            case 40: // down
            this.down();
            event.preventDefault();
            break;
            case 27: // esc
            this.cancel();
            event.preventDefault();
            break;
            case 13: // enter
            this.check();
            event.preventDefault();
            break;
        }
    }

    @On('click')
    onClick(evt) {
        var item = closestItem(evt.target);
        if (item) {
            this.select(item).check(item);
        }
    }

    getCheckedItems() {
        return this.$el.querySelectorAll('.qm-List-item.is-checked');
    }

    clear() {
        const selected = this.getCheckedItems();
        for (let i=0,l=selected.length; i<l; i++) {
            selected[i].__qute__.checked = false;
        }
    }

    select(item) {
        item.focus();
        return this;
    }

    focus() {
        const firstCheckedItem = this.$el.querySelector('.qm-List-item.is-checked');
        if (firstCheckedItem) {
            firstCheckedItem.focus();
        } else {
            this.$el.focus();
        }
    }

    check(item) {
        const selection = item || this.$el.querySelector('.qm-List-item:focus');
        if (selection) {
            //TODO use Qute.get(target) instead of target.__qute__
            const component = selection.__qute__;
            if (!this.multiple) {
                this.clear(); // remove existing active item if any
                component.checked = true;
            } else {
                component.checked = !component.checked;
            }
            this.emitAsync('change', {
                target: selection,
                component: component,
                label: component.label,
                icon: component.icon,
                value: component.value,
                list: this
            });
        }
    }

    cancel() {
        this.emitAsync('cancel', this);
        //this.clear();
    }

    up() {
        let prev = null;
        const selection = this.$el.querySelector('.qm-List-item:focus');
        if (!selection) {
            const all = this.$el.getElementsByClassName('qm-List-item');
            prev = all ? all[all.length-1] : null
        } else {
            prev = prevItem(selection);
        }
        if (prev) this.select(prev);
    }

    down() {
        let next = null;
        const selection = this.$el.querySelector('.qm-List-item:focus');
        if (!selection) {
            next = this.$el.getElementsByClassName('qm-List-item')[0];
        } else {
            next = nextItem(selection);
        }
        if (next) this.select(next);
    }

}

export { mList, mListItem };
