import Qute from '@qutejs/runtime';
import LabelChipTemplate from './label-chip.jsq';
import './chip.css';

const {ViewModel, Template, Property, Required } = Qute;

@Template(LabelChipTemplate)
class LabelChip extends ViewModel {

    @Required @Property(String) label;
    @Property(String) icon;

    @Property(String) outline;

    _computeClass() {
        return [ 'qm-Chip', this.outline && 'qm-Chip--outline' ];
    }

}

export default LabelChip;
