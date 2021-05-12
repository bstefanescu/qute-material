import Qute from '@qutejs/runtime';
import ListItemTemplate from "./list-item.jsq";
import './list.css';

const { ViewModel, Template, Property, Required } = Qute;

// attributes:
// optional: icon, label,
// required: value
@Template(ListItemTemplate)
class mListItem extends ViewModel {

    @Required @Property value;
    @Property(Boolean) checked;

    get label() {
        return this.$attrs.label || this.value.label || String(this.value);
    }

    get icon() {
        return this.$attrs.icon || this.value.icon;
    }

    get choice() {
        return !!this.$attrs.choice;
    }

}

export default mListItem;
