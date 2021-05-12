import Qute from '@qutejs/runtime';
import { Ripple } from '../ripple';
import ActionChipTemplate from './action-chip.jsq';
import './chip.css';

const {ViewModel, Template, Property, Required } = Qute;

/**
 * If type is radio or checkbox the chip can be used as a custom form control.
 * It provides a `value` and a `change` event to integrate with the `q:model` directive from `@qutejs/form`.
 */
@Template(ActionChipTemplate)
class ActionChip extends ViewModel {

    @Required @Property(String) label;
    @Property(String) icon;

    @Property(String) outline;

    @Property(Boolean) closeable;

    _computeClass() {
        return [ 'qm-Chip qm-Chip--clickable', this.outline && 'qm-Chip--outline' ];
    }

    connected() {
        this._rippleOff = Ripple.onclick(this.$el);
    }

    disconnected() {
        this._rippleOff && this._rippleOff();
    }

}

export default ActionChip;
