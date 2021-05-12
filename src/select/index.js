import Qute  from '@qutejs/runtime';
import SelectTemplate from './select.jsq';
import '../textbox/textbox.css';
import './select.css';

const { Template, ViewModel, On, Property } = Qute;


@Template(SelectTemplate)
class mSelect extends ViewModel {
    _list;
    _popup;
    _popupVisible = false;

    _isItemChecked = item => {
        if (!this.value) return false;
        return this.multiple ? this.value.indexOf(item) > -1 : this.value === item;
    }

    @Property value;
    @Property(String) label;
    @Property(Boolean) outline;
    @Property(String) icon;

    @Property(String) dropdownTitle;
    @Property(Array) options = [];
    @Property(Boolean) multiple;

    get _computedClass() {
        return [
            'qm-Textbox',
            'qm-Textbox--has-right-icon',
            this.outline && 'qm-Textbox--outline',
            this.icon && 'qm-Textbox--has-left-icon',
            this._popupVisible && 'is-open',
            !this.value && 'is-empty'
        ];
    }

    get _textBox() {
        return this.$el.getElementsByClassName('qm-Textbox')[0];
    }

    /**
     * Can be subclassed to customize the select value rendering,
     * Must return an HTML string given the selected value
     */
    renderValue(value) {
        return typeof value === 'string' ? value : value.label;
    }

    get _valueText() {
        if (Array.isArray(this.value)) {
            return this.value.map(item => {
                return this.renderValue(item);
            }).join(', ');
        } else {
            return this.value ? this.renderValue(this.value) : '&nbsp;';
        }
    }

    get _labelStyle() {
        return { visibility: this._popupVisible ? 'hidden' : 'visible' };
    }

    _updateValue(value) {
        if (this.value != value) {
            this.value = Array.isArray(value) && !value.length ? null : value;
            this.emit('change', this);
        }
    }

    ready() {
        this._updateDropdownIconState();
    }

    clear() {
        if (this.value != null) {
            //const list = this._popup.find('.qm-List');
            this._list.clear();
            this._updateValue(null);
            Qute.runAfter(() => this._updateDropdownIconState());
        }
    }

    onPopupReady(event) {
        const list = event.detail.getElementsByClassName('qm-List')[0];
        this._list.focus();
    }

    _updateDropdownIconState() {
        const toggle = Qute.get(this.$el.getElementsByClassName('qm-Select-toggle')[0]);
        toggle.active = !!this.value;
    }

    onPopupClose() {
        this._popupVisible =false;
        var input =this.$el.getElementsByClassName('qm-Textbox-input')[0];
        input && input.focus();
        this._updateDropdownIconState();
        this.update(); // required to recompute the label style since _popupVisible is not a reactive prop
    }

    onSelectionChange(event) {
        if (!event.detail.list) return; // not a list change event
        const selection = this._list.getCheckedItems();
        if (this.multiple) {
            const values = [];
            for (let i=0,l=selection.length; i<l; i++) {
                values.push(selection[i].__qute__.value);
            }
            this._updateValue(values);
        } else {
            this._updateValue(selection[0].__qute__.value);
            this._popup.close();
        }
    }

    onCancel() {
        this._popup.close();
    }

    open() {
        this._popup.open(this.$el);
        this._popupVisible = true;
        this.update();
    }

    onKeyUp(event) {
        if (!this._popupVisible) {
            const key = event.keyCode;
            if (key === 8) {
                this.clear();
            } else if (key >= 32) {
                this.open();
            }
        }
    }

    @On('click')
    onClick(event) {
        if (!this._popupVisible) {
            // we need to hide the label if input has a value any
            this.open();
        }
    }

    toggleDropdown() {
        if (!this._popupVisible && this.value) { // remove current value
            this.clear();
            return false; // do not toggle the popup
        } // else do nothing and let onclick to propagate to open the popup
    }

}

export { mSelect };
