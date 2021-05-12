import Qute from '@qutejs/runtime';
import { IconButton } from './icon-button.jsq';
import { Ripple } from '../ripple';
import '../button/button.css';
import './icon-button.css';

const { ViewModel, Template } = Qute;

@Template(IconButton)
class mIconButton extends ViewModel {

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
            'qm-IconButton'
        ];
        if (attrs.variant) classNames.push('qm-Button--'+attrs.variant);
        if (attrs.size) classNames.push('qm-Button--'+attrs.size);
        if (attrs.rounded) classNames.push('qm-Button--round');
        if (attrs.floating) classNames.push('qm-Button--floating');
        if (attrs.highlight) classNames.push('qm-IconButton--highlight');
        return classNames;
    }

}

export { mIconButton };
