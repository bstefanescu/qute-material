import Qute from '@qutejs/runtime';
import { Input } from '@qutejs/form';
import TextboxTemplate from './textbox.jsq';
import './textbox.css';

const { Template, Property, On } = Qute;

@Template(TextboxTemplate)
class mTextbox extends Input {

    @Property(String) label;
    @Property(Boolean) outline;
    @Property(String) leftIcon;
    @Property(String) rightIcon;

    _computeClass() {
        const isEmpty = this._input && !this._input.value;
        return ['qm-Textbox',
            this.outline && 'qm-Textbox--outline',
            this.leftIcon && 'qm-Textbox--has-left-icon',
            this.rightIcon && 'qm-Textbox--has-right-icon',
            isEmpty && 'is-empty',
        ];
    }

    _update() {
        var isEmpty = !this._input.value;
        var cl = this._input.closest('.qm-Textbox').classList;
        if (isEmpty) cl.add('is-empty'); else cl.remove('is-empty');
    }

    @On('change')
    onChange() {
        this._update();
    }

    ready() {
        this._update();
    }
}

export { mTextbox };
