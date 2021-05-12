import './modal.css';
import ModalTemplate from './modal.jsq';
import { qModalTrigger } from '@qutejs/modal';
import Qute from '@qutejs/runtime';

const { ViewModel, Template, Property } = Qute;

@Template(ModalTemplate)
class mModal extends ViewModel {

    @Property(Boolean) showProgress = false;
    @Property(Number) progress = 0;

    get _computedBodyStyle() {
        const $attrs = this.$attrs;
        if ($attrs.width || $attrs.height) {
            let style = [];
            if ($attrs.width) style.push('width:'+$attrs.width);
            if ($attrs.height) style.push('height:'+$attrs.height);
            return style.join(';');
        } else {
            return null;
        }
    }

    enhanceModal(modalEl) {
        const modal = modalEl.__qute__;
        const self = this;
        modal.onOpen = function() {
            this.resetProgress();
        }
        modal.onClose = function() {
            this.resetProgress();
        }
        modal.setProgress = function(value) {
            self.setProgress(value);
        }
        modal.resetProgress = function() {
            self.resetProgress();
        }
    }

    setProgress(value) {
        this.progress = value || 0;
        this.showProgress = true;
    }

    resetProgress() {
        this.progress = 0;
        this.showProgress = false;
    }
}

export {mModal, qModalTrigger as mModalTrigger};
