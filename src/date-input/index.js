import Qute from '@qutejs/runtime';
import DateInputTemplate from './date-input.jsq';
//import './date-input.css';

const {Template, Property, ViewModel, Watch} = Qute;

function digit2(n) {
    return n < 10 ? '0'+n : String(n);
}

function DateInputPattern(pattern) {
    const ymd = pattern.replace(/[^ymd]*/g, ''); // remove other chars than ymd
    if (ymd.length !== 3) throw new Error('Invalid date pattern: '+pattern);
    this[ymd[0]] = 1;
    this[ymd[1]] = 2;
    this[ymd[2]] = 3;
    this.rx = new RegExp(pattern.replace(/\s+/g, '')
        .replace('/./g', '\\.')
        .replace('/\//g', '\\/')
        .replace('y', '\\s*([0-9]{4})\\s*')
        .replace('d', '\\s*([0-9]{1,2})\\s*')
        .replace('m', '\\s*([0-9]{1,2})\\s*'));
    this.pattern = pattern;
}
DateInputPattern.prototype = {
    format(date) {
        return date ? this.pattern.replace('y', date.getFullYear())
        .replace('d', digit2(date.getDate()))
        .replace('m', digit2(date.getMonth()+1)) : '';
    },
    parse(text) {
        if (!text) return null;
        let y, m, d;
        const match = this.rx.exec(text.trim());
        if (match) {
            y = match[this.y];
            m = match[this.m];
            d = match[this.d];
            if (y && m && d) {
                return new Date(parseInt(y), parseInt(m)-1, parseInt(d))
            }
        }
        throw new Error('Invalid date format. Expecting: '+this.pattern
            .replace(/y/, 'yyyy')
            .replace(/d/, 'dd')
            .replace(/m/, 'mm'));
    }
}

const DEFAULT_PATTERN = new DateInputPattern('y-m-d');

// only accepts undefined, null or `Map` values.
Property.registerType(DateInputPattern, {
    setter(value, arg) {
        return value ? new DateInputPattern(value) : DEFAULT_PATTERN;
    }
});


@Template(DateInputTemplate)
class mDateInput extends ViewModel {
    _textbox;
    _popup;

    @Property(Boolean) noinput;
    @Property(DateInputPattern) pattern;
    @Property value;
    @Property(String) label;

    get _valueText() {
        return this.pattern.format(this.value);
    }

    _dateSelected(event) {
        this.value = event.detail.value;
        this._popup.close();
        Qute.runAfter(() => this._textbox._update());
    }

    _onPopupClose() {
        this._togglePopupTrigger(false);
    }

    _onPopupOpen() {
        this._togglePopupTrigger(true);
    }

    _togglePopupTrigger(active) {
        const toggle = Qute.get(this.$el.getElementsByClassName('qm-Select-toggle')[0]);
        window.setTimeout(()=>{toggle.active = active;}, 0);
    }

    textboxChanged(event) {
        if (!this.$attrs.readonly) {
            this.value = this.pattern.parse(event.detail.value);
            this.emitAsync('change', this);
        }
        return false; // cancel the event
    }

    toggleDropdown() {
        this._popup.toggle(this.$el);
    }

    open() {
        this._popup.open(this.$el);
        this.update();
    }

    close() {
        this._popup.close();
    }

    initialized() {
        if (this.noinput) {
            this.$attrs.readonly = true;
        }
    }

    @Watch('noinput')
    _noinputChanged() {
        this.$attrs.readonly = true;
        return false;
    }

}

export { mDateInput };
