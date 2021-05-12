import Qute from '@qutejs/runtime';
import { Choice } from '@qutejs/form';
import { Ripple } from "../ripple";
import CheckboxTemplate from './checkbox.jsq';
import './checkbox.css';

const { Template, Property }  = Qute;

@Template(CheckboxTemplate)
class mCheckbox extends Choice {

    @Property(Boolean) bold;
    @Property(String) label;

    _computeClass() {
        return [ "qm-Checkbox", this.bold && "qm-Checkbox--bold", this.checked && 'is-checked' ];
    }

    onToggle() {
        Ripple.xy(this.$el);
    }
}

export { mCheckbox };
