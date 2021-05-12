/*
* Update the tabs UI in response to user actions.
* Arguments:
* 1. el - the tabs element
* 2. onchange - optional callback called when tab is changed
* depends on anikme.js
* requires Element.closest polyfill for IE
*/

import Qute from '@qutejs/runtime';
import { onTransitionEnd } from '@qutejs/ui';
import { Ripple } from "../ripple";
import { Tabs, Tab as mTab} from './tabs.jsq';
import './tabs.css';

const { ViewModel, Template, Property, On } = Qute;
/**
 * A tabs componnent which supports both dynamic tabs (through the tabs property) and static tabs written in the template
 */
@Template(Tabs)
class mTabs extends ViewModel {

    @Property(Array) tabs; // [ {name, icon, label} ]
    @Property(String) value;

    get normalizedTabs() {
        if (this.tabs && this.tabs.length) {
            return this.tabs.map(tab => {
                return typeof tab === 'string' ? {
                    name: tab, label: tab
                } : tab;
            })
        }
        return null;
    }
    connected() {
        this.value && this.activate(this.value);
    }

    getActiveTab() {
        const tab = this.$el.querySelector('.qm-Tabs-item.is-active');
        return tab ? tab.getAttribute('data-tab') : null;
    }

    activate(tabName, fireChange) {
        var tabEl = this.$el.querySelector('.qm-Tabs-item[data-tab="'+tabName+'"]');
        if (!tabEl) return false;

        var cl = tabEl.classList;
        if (!cl.contains('is-active')) {
            var active = this.$el.querySelector('.qm-Tabs-item.is-active');
            if (active) {
                active.classList.remove('is-active');
            }
            cl.add('is-active');
            // show animation only if a tab was active before
            this._showIndicator(tabEl, !!active);
            if (fireChange) {
                this.$data.value = tabName;
                this.emitAsync('change', this);
            }
        }

        return true;
    }

    _showIndicator(el, animate) {
        var indicator = this.$el.querySelector('.qm-Tabs-indicator');
        if (animate) {
            var cl = indicator.classList;
            if (!cl.contains('is-moving-right') && !cl.contains('is-moving-left')) {
                var isMovingClass = indicator.offsetLeft < el.offsetLeft ? 'is-moving-right' : 'is-moving-left';
                cl.add(isMovingClass);
                onTransitionEnd(indicator, function() {
                    cl.remove(isMovingClass);
                });
            }
        }
        indicator.style.left = el.offsetLeft+'px';
        indicator.style.right = (el.offsetParent.clientWidth - el.offsetLeft - el.offsetWidth)+'px';
    }

    @On('changetab')
    onChangeTab(evt) {
        let target = evt.$originalTarget;
        if (!target || !evt.detail) throw new Error('use q:emit-changetab-onclick to emit a changetab event');
        target = target.closest('button');
        Ripple.on(target, evt.$originalEvent);
        this.activate(evt.detail, true);
        return false;
    }

}

export { mTabs, mTab };
