import Qute from '@qutejs/runtime';
import { Button } from './button.jsq';
import { Ripple } from '../ripple';
import './button.css';

const { ViewModel, Template, Property } = Qute;

/**
 * Attributes:
 *  - icon: the icon name if any
 *  - label: the label if any
 *  - variant: primary | secondary | flat. Defaults to flat
 *  - rounded: toggle attribute
 *  - floating: toggle attribute
 *  - size: small | large | normal. Defaults to normal
 * Default slot: the button content overrides the label and the icon
 */
@Template(Button)
class mButton extends ViewModel {

    @Property(String) label;
    @Property(String) icon;
    @Property(Boolean) disabled;

    connected() {
        this._rippleOff = Ripple.onclick(this.$el);
    }

    disconnected() {
        this._rippleOff();
    }

    _computeClass() {
        const attrs = this.$attrs;
        const classNames = [
            'qm-Button--'+(attrs.variant || 'flat')
        ];
        if (!this.label && this.icon) classNames.push('qm-Button--icon');
        if (attrs.size) classNames.push('qm-Button--'+attrs.size);
        if (attrs.rounded) classNames.push('qm-Button--round');
        if (attrs.floating) classNames.push('qm-Button--floating');
        return classNames;
    }

    get _iconSize() {
        var size = this.$attrs.size;
        if (this.label) { // text and icon
            return size === 'large' ? size : 'small';
        } else { // only icon - preserve the size
            return size ? size : 'normal';
        }
    }

}

export { mButton };
