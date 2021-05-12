import Qute from '@qutejs/runtime';
import window from '@qutejs/window';
import SliderTemplate from './slider.jsq';
import { isSelectorSupported } from '@qutejs/ui';
import './slider.css';

const {ViewModel, Template, Property} = Qute;

const isFF = isSelectorSupported('::-moz-range-progress');
const isMS = isFF ? false : isSelectorSupported('::-ms-fill-lower');
// we will not use FF built-in track progress
const canStyleProgressTrack = isMS; //isFF || isMS;



/*
    When computing the position on screen of the tooltip we need to align it with the thumb center.
    But we don't know the exact position of the thumb, we know the current range value (in percent).
    We can apply this percent to the track length to get the tooltip position, but the browser is not
    positioning exactly the thumb at the percent value position. It is shifting the tuumb to the left when it
    approach the right end of the track (and it shift to the right when approaches the left end of the track).
    When the thumb is on the right end it is shifted to the left by the value of the thumb radius so that its right margin don't overflow the track.
    The same for the left end (it shifts with thumb radius at the right).
    When in the center of the track no shift is done.
    This function try to aproximate this shift dependeing on the value of the percent value
*/
function guessPercentPositionShift(percentValue, thumbRadius) {
    if (percentValue < 10) {
        return thumbRadius;
    } else if (percentValue < 20) {
        return thumbRadius * 3 / 4;
    } else if (percentValue < 30) {
        return thumbRadius / 2;
    } else if (percentValue < 40) {
        return thumbRadius / 4;
    } else if (percentValue < 60) {
        return 0;
    } else if (percentValue < 70) {
        return -thumbRadius / 4;
    } else if (percentValue < 80) {
        return -thumbRadius / 2;
    } else if (percentValue < 90) {
        return -thumbRadius * 3 / 4;
    } else {
        return -thumbRadius;
    }
}

/*
function getThumbRadius(target, defValue) {
    try {
        var thumb = target.querySelector('::-webkit-slider-thumb');
        if (thumb) {
            return thumb.offsetWidth / 2;
        }
    } catch(e) {
        return defValue;
    }
}
*/


@Template(SliderTemplate)
class mSlider extends ViewModel {
    _input = null;
    _tooltip = null;
    @Property(Boolean) tooltip; // whether to show the toolrip or not
    @Property(String) width;

    get thumbRadius() {
        return 6; // 12 / 2 => TODO must keep in sync with css
    }
    get showTooltip() {
        return this.tooltip && !isMS;
    }

    ready() {
        var self = this;
        if (isMS) {
            var timer;
            this._onchange = function(event) {
                self._handleInput();
                if (onchange) {
                    if (timer) {
                        window.clearTimeout(timer);
                    }
                    timer = window.setTimeout(function() { onchange(event) }, 200);
                }
            }
        } else {
            this._oninput = function(event) {
                self._handleInput();
            }
        }
        if (!canStyleProgressTrack) {
            this._handleInput(true);
        }
        if (this.showTooltip) {
            this._onblur = function() {
                if (self._tooltip) {
                    self._tooltip.parentNode.removeChild(self._tooltip);
                    self._tooltip = null;
                }
            }
        }
    }

    connected() {
        if (this._onchange) this._input.addEventListener('change', this._onchange);
        if (this._oninput) this._input.addEventListener('input', this._oninput);
        if (this._onblur) this._input.addEventListener('blur', this._onblur);
    }

    disconnected() {
        if (this._onchange) this._input.removeEventListener('change', this._onchange);
        if (this._oninput) this._input.removeEventListener('input', this._oninput);
        if (this._onblur) this._input.removeEventListener('blur', this._onblur);
    }

    _computeClass() {
        return isMS ? 'qm-Slider qm-Slider--ms' : 'qm-Slider';
    }

    _handleInput(initialUpdate) {
        if (!canStyleProgressTrack) {
            // update gradient
            const min = this._input.min;
            const max = this._input.max;
            const value = this._input.value;
            const percent = value * 100 / (max - min);
            this._input.style.backgroundImage = "linear-gradient(to right, currentColor, currentColor "+percent+"%, transparent "+percent+"%, transparent 100%)";

            // now show the tooltip if required
            if (!initialUpdate && this.showTooltip) {
                if (!this._tooltip) {
                    // compute tooltip x,y in viewport
                    //var rect = this._input.getBoundingClientRect();
                    //var dx = value / (max - min);
                    var tooltip = document.createElement('DIV');
                    tooltip.classList.add('qm-Slider-tooltip');
                    tooltip.style.left = percent+'%';
                    tooltip.style.top = '-24px';
                    tooltip.textContent = String(value);
                    this._input.parentNode.appendChild(tooltip);
                    var tooltipHalfWidth = tooltip.offsetWidth / 2;
                    tooltip.style.marginLeft = (guessPercentPositionShift(percent, this.thumbRadius) - tooltipHalfWidth)+'px';
                    this._tooltip = tooltip;
                } else {
                    var tooltip = this._tooltip;
                    tooltip.style.left = percent+'%';
                    var tooltipHalfWidth = tooltip.offsetWidth / 2;
                    tooltip.style.marginLeft = (guessPercentPositionShift(percent, this.thumbRadius) - tooltipHalfWidth)+'px';
                    tooltip.textContent = String(value);
                }
            }
        }
    }

}

export { mSlider };
