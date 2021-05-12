import Qute from '@qutejs/runtime';
import { Choice } from '@qutejs/form';
import { Ripple } from '../ripple';
import ChoiceChipTemplate from './choice-chip.jsq';
import './chip.css';

const { Template, Property, Required } = Qute;

@Template(ChoiceChipTemplate)
class Chip extends Choice {

    @Required @Property(String) label;
    @Property(String) icon;

    @Property(String) outline;

    _computeClass() {
        return [
            'qm-Chip qm-Chip--clickable',
            this.outline && 'qm-Chip--outline',
            this.checked && 'is-active'
        ];
    }

    connected() {
        super.connected();
        this._rippleOff = Ripple.onclick(this.$el);
    }

    disconnected() {
        super.disconnected();
        this._rippleOff && this._rippleOff();
    }

    onToggle() {
        if (this._input) {
            this.$data.checked = this._input.checked;
            if (this._input.checked) {
                this.$el.classList.add('is-active');
            } else {
                this.$el.classList.remove('is-active');
            }
        }
    }

}

export default Chip;
