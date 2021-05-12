import Qute from '@qutejs/runtime';
import { mIconButton } from '../icon-button';
import ToggleGroupTemplate from './toggle-group.jsq';
import './toggle-group.css';

const { Template, ViewModel, Property, Watch, On } = Qute;

class mToggle extends mIconButton {
    @Property(Boolean) active;

    toggle() {
        this.active = !this.active;
    }

    ready() {
        if (this.active) this.$el.firstElementChild.classList.add('is-active');
    }

    @On('click')
    onClick() {
        this.active = !this.active;
    }

    @Watch('active')
    onActiveChanged(value) {
        const cl = this.$el.firstElementChild.classList;
        if (value) {
            cl.add('is-active');
        } else {
            cl.remove('is-active');
        }
        return false;
    }
}


@Template(ToggleGroupTemplate)
class mToggleGroup extends ViewModel {

    _active;

    ready() {
        const active = this.$el.getElementsByClassName('is-active')[0];
        if (active) {
            this._active = Qute.get(active.parentNode);
        }
    }

    @On('click')
    handleClick(event) {
        const item = Qute.get(event.target);
        if (this._active && item !== this._active) {
            console.log('active is ',this._active.$el);
            this._active.active = false;
        }
        if (item.active) {
            this._active = item;
        } else {
            this._active = null;
        }
    }

}


export { mToggle, mToggleGroup };
