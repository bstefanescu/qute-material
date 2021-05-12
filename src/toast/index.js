import './toast.css';
import ToastTemplate from './toast.jsq';
import Qute from '@qutejs/runtime';
import window, {document} from '@qutejs/window';
import { onTransitionEnd, runOnNextRepaint } from '@qutejs/ui';


class Toast {

    _timer = null;
    queue = [];
    popup = null;
    ttl;
    template;
    top = false;

    constructor(ttl) {
        this.ttl = ttl || 4000;
    }

    render(msg) {
        const el = Qute.render(this.template || ToastTemplate, {
            toast: this,
            message: msg
        });
        if (this.top) {
            el.classList.add('qm-Toast--top');
        }
        return el;
    }

    // close on demand
    close() {
        if (this._timer) {
            window.clearTimeout(this._timer);
            this._timer = null;
        }
        this._close();
    }

    _close() {
        if (this.popup) {
            this.popup.classList.remove('is-active');
            onTransitionEnd(this.popup, ()=> {
                this.popup.parentNode.removeChild(this.popup);
                this.popup = null;
                const msg = this.queue.shift();
                msg && this._show(msg);
            });
        }
    }

    show(msg) {
        if (this.popup) {
            this.queue.push(msg);
        } else {
            this._show(msg);
        }
    }

    _show(msg) {
        this.popup = this.render(msg);
        document.body.appendChild(this.popup);
        this._display(this.popup);
        this._timer = window.setTimeout(() => {
            this._close();
        }, this.ttl);
    }

    _display(popup) {
        runOnNextRepaint(() => {
            popup.classList.add('is-active');
        });
    }

    clear() {
        this.queue = [];
        this._close();
    }
}

export { Toast };
