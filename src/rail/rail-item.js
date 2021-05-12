import RailItemTemplate from './rail-item.jsq';
import Qute from '@qutejs/runtime';
//import { Ripple } from '../ripple';

const {ViewModel, Template, Property} = Qute;

@Template(RailItemTemplate)
class mRailItem extends ViewModel {

    @Property(Boolean) active;
    @Property(String) label;
    @Property(String) icon;
    @Property(String) tooltip;
    @Property(String) value; // either value or menu should be defined
    @Property menu; // a menu template

    get computedClass() {
        return [
            'qm-RailMenu-item',
            this.active && 'is-active'
        ]
    }
/*
    connected() {
        this._rippleOff = Ripple.onclick(this.$el);
    }

    disconnected() {
        this._rippleOff();
    }
*/
}

export default mRailItem;
