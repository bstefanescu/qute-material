import Qute from '@qutejs/runtime';
import TextareaTemplate from './textarea.jsq';
import { mTextbox } from '../textbox';

function resizeTextArea(elem, initialHeight) {
  elem.style.height = initialHeight+'px';
  elem.scrollTop = 0;
  elem.style.height = (elem.scrollHeight + elem.offsetHeight - elem.clientHeight)+'px';
}

const { Template, On } = Qute;

@Template(TextareaTemplate)
class mTextarea extends mTextbox {

    _initialHeight = null;

    @On('keyup')
    onKeyUp(event) {
        const target = event.target;
        this._update();
        if (this._initialHeight == null) {
            this._initialHeight = target.offsetHeight || 1;
        }
        resizeTextArea(this._input, this._initialHeight);
    }

    @On('scroll')
    function(event) {
        const target = event.target;
        if (this._initialHeight == null) {
            this._initialHeight = target.offsetHeight || 1;
        }
        resizeTextArea(this._input, this._initialHeight);
    }
}

export { mTextarea };
