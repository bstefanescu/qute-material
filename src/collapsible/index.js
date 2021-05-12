import Qute from '@qutejs/runtime';
import { Choice } from '@qutejs/form';
//import { Ripple } from '../ripple';
import { onTransitionEnd, runOnNextRepaint } from '@qutejs/ui';
import CollapsibleTemplate from './collapsible.jsq';
import './collapsible.css';

const { Property, Template } = Qute;

@Template(CollapsibleTemplate)
class mCollapsible extends Choice {

    @Property(String) title;
    @Property(String) chevron;

    // define an alias to checked
    get expanded() {
        return this.checked;
    }

    set expanded(value) {
        this.checked = value;
    }

    get body() {
        return this.$el.getElementsByClassName('qm-Collapsible-body')[0];
    }

    get checkedProp() {
        return 'expanded';
    }

    ready() {
        if (this.$attrs && `expanded` in this.$attrs) {
            this.$data.checked = this.$attrs.expanded;
        }
        super.ready();
        if (this._input.checked) {
            this.body.style.height='auto';
        }
    }

    get _computedClass() {
        const chevron = this.chevron;
        return  [
            chevron === 'left' && 'qm-Collapsible--chevron',
            chevron === 'right'&& 'qm-Collapsible--chevron-right'
        ];
    }

    onToggle() {
        var isOpen = this.expanded;
        var body = this.body;
        if (!isOpen) { // collapse
            //we need to change to a fixed size
            body.style.height = body.offsetHeight+'px';
            // start collapsing
            runOnNextRepaint(function() {
                body.style.height = 0;
            })
        } else { // expand
            body.style.height = (isOpen ? body.scrollHeight : 0)+'px';
            onTransitionEnd(body, function() {
                body.style.height = 'auto';
            });
        }
    }
}

export { mCollapsible };