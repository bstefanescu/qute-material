
import './overlay.css';
import {onTransitionEnd, runOnNextRepaint} from '@qutejs/ui';

export function Overlay(className, onClose) {
    if (arguments.length === 1) {
        var arg = arguments[0];
        if (typeof arg !== 'string' && arg.call) {
            onClose = className;
            className = null;
        }
    }
    var el = document.createElement('DIV');
    el.className = className ? 'qm-Overlay '+className : 'qm-Overlay';
    var self = this;
    el.addEventListener('click', function(e) {
        self.close();
        onClose && onClose();
    });
    this.el = el;
    this._overflow = '';
}

Overlay.prototype = {
    open(parent) {
        if (!this.el.parentNode) {
            if (!parent) parent = document.body;
            this._overflow = parent.style.overflow || '';
            parent.appendChild(this.el);
            parent.style.overflow = 'hidden';
            runOnNextRepaint(() => {
                this.el.classList.add('is-open');
            });
        }
        return this;
    },
    close() {
        if (this.el.parentNode) {
            var parent = this.el.parentNode;
            parent.style.overflow = this._overflow;
            this.el.classList.remove('is-open');
            onTransitionEnd(this.el, () => {
                parent.removeChild(this.el);
            })
        }
        return this;
    }
}
