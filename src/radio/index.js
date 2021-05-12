import Qute from '@qutejs/runtime';
import { Choice } from '@qutejs/form';
import { Ripple } from "../ripple";
import RadioTemplate from './radio.jsq';
import './radio.css';

const { Template, Property } = Qute;

@Template(RadioTemplate)
class mRadio extends Choice {

    @Property(String) label;

    onToggle() {
        Ripple.xy(this.$el);
    }
}

export { mRadio };