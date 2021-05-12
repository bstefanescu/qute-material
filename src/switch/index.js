import Qute from '@qutejs/runtime';
import { Choice } from '@qutejs/form';
import { Ripple } from "../ripple";
import SwitchTemplate from './switch.jsq';
import './switch.css';

const {Template, Property}  = Qute;

@Template(SwitchTemplate)
class mSwitch extends Choice {

    @Property(String) label;

    _computeClass() {
        return [ 'qm-Switch', this.checked && 'is-checked' ];
    }

    onToggle() {
        const label = this._input.closest('label');
        Ripple.xy(label);
    }
}

export { mSwitch };
